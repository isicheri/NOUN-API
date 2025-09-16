import * as crypto from "crypto";
import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Order, PaymentStatus, RequestStatus } from "@prisma/client";
import { ConfigService } from '@nestjs/config';
import { EmailService } from "src/utilities/email/email.service";
import { PdfService } from "../pdf/pdf.service";




@Injectable()
export class PaymentService {
 constructor(private prisma: PrismaService,private configService:ConfigService,private emailService:EmailService,private pdfService:PdfService) {}

//   async handlePaystackWebhook(headers: any, bodyOrRawBody: any, isRaw = false) {
// //   console.log("=== Webhook received ===");
// //   console.log("Headers:", headers);

//   const signature = headers['x-paystack-signature'] || headers['X-Paystack-Signature'];
// //   console.log("Signature from header:", signature);

//   const secret = this.configService.get<string>("PAYSTACK_SECRET_KEY");
// //   console.log("Using secret key:", secret ? "DEFINED" : "UNDEFINED");

//   if (!secret) {
//     // console.error("❌ PAYSTACK_SECRET_KEY is not defined");
//     throw new BadRequestException("PAYSTACK_SECRET_KEY is not defined");
//   }

//   let dataToHash = bodyOrRawBody;

//   if (!isRaw) {
//     // If you receive parsed JSON, stringify it for hashing (but this is not ideal!)
//     dataToHash = JSON.stringify(bodyOrRawBody);
//   }

// //   console.log("Data used for hash:", dataToHash);

//   const hash = crypto.createHmac("sha512", secret).update(dataToHash).digest("hex");
// //   console.log("Computed hash:", hash);

//   if (hash !== signature) {
//     // console.error("❌ Invalid signature! Hash does not match header signature.");
//     throw new BadRequestException("Invalid signature");
//   }
// //   console.log("✅ Signature valid");

//   // If body is raw string, parse it here
//   const body = isRaw ? JSON.parse(bodyOrRawBody) : bodyOrRawBody;

// //   console.log("Event received:", body.event);

//   if (body.event === "charge.success") {
//     const reference = body.data.reference;
//     // console.log("Payment reference:", reference);

//     const payment = await this.prisma.payment.findUnique({ where: { reference } });

//     if (!payment) throw new BadRequestException("Payment record not found");
//     //   console.error("❌ Payment record not found for reference:", reference);
    

//     if (payment.status === "SUCCESS") return { ok: true };
//     //   console.log("Payment already marked SUCCESS. Skipping update.");
  
//  await this.prisma.$transaction(async (tx) => {
//     await tx.payment.update({
//       where: { reference },
//       data: { status: PaymentStatus.SUCCESS, paidAt: new Date() },
//     });

//     if (payment.orderId) {
//       await tx.order.update({
//         where: { id: payment.orderId },
//         data: { status: "PAID", paymentId: payment.id },
//       });

//       await tx.cartItem.deleteMany({
//         where: { cart: { userId: payment.userId! } },
//       });
//     }

//     if (payment.requestId) {
//       await tx.courseSummaryRequest.update({
//         where: { id: payment.requestId },
//         data: { status: RequestStatus.PAID, paid: true, paymentId: payment.id },
//       });
//     }
//   });

//   return { ok: true };
// }
//   }
async handlePaystackWebhook(headers: any, bodyOrRawBody: any, isRaw = false) {
  const signature = headers['x-paystack-signature'] || headers['X-Paystack-Signature'];
  const secret = this.configService.get<string>("PAYSTACK_SECRET_KEY");

  if (!secret) throw new BadRequestException("PAYSTACK_SECRET_KEY is not defined");

  const dataToHash = isRaw ? bodyOrRawBody : JSON.stringify(bodyOrRawBody);
  const hash = crypto.createHmac("sha512", secret).update(dataToHash).digest("hex");

  if (hash !== signature) throw new BadRequestException("Invalid signature");

  const body = isRaw ? JSON.parse(bodyOrRawBody) : bodyOrRawBody;
  const reference = body?.data?.reference;

  console.log("📩 Webhook body received:", body.event, reference);

  if (body.event !== "charge.success") {
    console.log("📭 Ignoring non-charge.success event:", body.event);
    return { received: true };
  }

  const payment = await this.prisma.payment.findUnique({ where: { reference } });

  if (!payment) throw new BadRequestException("Payment not found");
  if (payment.status === "SUCCESS") return { ok: true };

  let order: (Order & { user: { email: string }, items: { pdf: { id: string, fileKey: string, title: string } }[] }) | undefined;

  // 🔒 DATABASE TRANSACTION (ONLY DB STUFF HERE)
  await this.prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { reference },
      data: { status: PaymentStatus.SUCCESS, paidAt: new Date() },
    });

    if (payment.orderId) {
      order = await tx.order.update({
        where: { id: payment.orderId },
        data: { status: "PAID", paymentId: payment.id },
        include: {
          items: { include: { pdf: true } },
          user: true,
        },
      });

      await tx.cartItem.deleteMany({
        where: { cart: { userId: payment.userId! } },
      });

      const downloadRecords = order.items.map((item) => ({
        userId: order!.userId,
        pdfId: item.pdf.id,
      }));

      await tx.download.createMany({ data: downloadRecords });
    }

    if (payment.requestId) {
      await tx.courseSummaryRequest.update({
        where: { id: payment.requestId },
        data: {
          status: RequestStatus.PAID,
          paid: true,
          paymentId: payment.id,
        },
      });
    }
  });

  // ✅ OUTSIDE TRANSACTION: Generate links, send email, create notifications
  if (order && order.user?.email) {
    console.log("📧 Preparing to send email to:", order.user.email);

    const downloadLinks = await Promise.all(
      order.items.map(async (item) => {
        const signedUrl = await this.pdfService.getSignedUrl(item.pdf.fileKey);
        return `<li><a href="${signedUrl}">${item.pdf.title}</a></li>`;
      })
    );

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2>🎉 Thank you for your purchase!</h2>
        <p>Here are your PDF download links (valid for 15 minutes):</p>
        <ul>${downloadLinks.join("")}</ul>
        <p>If you have any issues, contact our support.</p>
        <small>© ${new Date().getFullYear()} Nounedu</small>
      </div>
    `;

    const admins = await this.prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    await this.prisma.notification.createMany({
      data: admins.map((admin) => ({
        title: `New Order Placed`,
        body: `User ${order!.user.email} purchased ${order!.items.length} PDF(s).`,
        recipientId: admin.id,
        type: "ORDER",
      })),
    });

 const emailResult =  await this.emailService.sendMail(
      {
        to: order.user.email,
        from: "no-reply@nounedu.net",
      },
      htmlBody,
      "Your PDF Downloads from NounEdu"
    );
if (!emailResult.success) {
  console.error("❌ Failed to send email:", emailResult.message);
} else {
  console.log("✅ Email sent successfully to:", order.user.email);
}
  } else {
    console.warn("⚠️ No order or user email found — skipping email");
  }

  return { ok: true };
}




}