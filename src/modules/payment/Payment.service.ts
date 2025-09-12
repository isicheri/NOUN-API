import * as crypto from "crypto";
import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PaymentStatus, RequestStatus } from "@prisma/client";
import { ConfigService } from '@nestjs/config';




@Injectable()
export class PaymentService {
 constructor(private prisma: PrismaService,private configService:ConfigService) {}

  async handlePaystackWebhook(headers: any, bodyOrRawBody: any, isRaw = false) {
//   console.log("=== Webhook received ===");
//   console.log("Headers:", headers);

  const signature = headers['x-paystack-signature'] || headers['X-Paystack-Signature'];
//   console.log("Signature from header:", signature);

  const secret = this.configService.get<string>("PAYSTACK_SECRET_KEY");
//   console.log("Using secret key:", secret ? "DEFINED" : "UNDEFINED");

  if (!secret) {
    // console.error("❌ PAYSTACK_SECRET_KEY is not defined");
    throw new BadRequestException("PAYSTACK_SECRET_KEY is not defined");
  }

  let dataToHash = bodyOrRawBody;

  if (!isRaw) {
    // If you receive parsed JSON, stringify it for hashing (but this is not ideal!)
    dataToHash = JSON.stringify(bodyOrRawBody);
  }

//   console.log("Data used for hash:", dataToHash);

  const hash = crypto.createHmac("sha512", secret).update(dataToHash).digest("hex");
//   console.log("Computed hash:", hash);

  if (hash !== signature) {
    // console.error("❌ Invalid signature! Hash does not match header signature.");
    throw new BadRequestException("Invalid signature");
  }
//   console.log("✅ Signature valid");

  // If body is raw string, parse it here
  const body = isRaw ? JSON.parse(bodyOrRawBody) : bodyOrRawBody;

//   console.log("Event received:", body.event);

  if (body.event === "charge.success") {
    const reference = body.data.reference;
    // console.log("Payment reference:", reference);

    const payment = await this.prisma.payment.findUnique({ where: { reference } });

    if (!payment) {
    //   console.error("❌ Payment record not found for reference:", reference);
      throw new BadRequestException("Payment record not found");
    }

    if (payment.status === "SUCCESS") {
    //   console.log("Payment already marked SUCCESS. Skipping update.");
      return { ok: true };
    }

    // console.log("Updating payment status to SUCCESS");

    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { reference },
        data: { status: PaymentStatus.SUCCESS, paidAt: new Date() },
      }),
      this.prisma.courseSummaryRequest.update({
        where: { id: payment.requestId! },
        data: { status: RequestStatus.PAID, paid: true,paymentId: payment.id },
      }),
    ]);

    // console.log("Payment and request status updated successfully");
  }

  return { ok: true };
}

}