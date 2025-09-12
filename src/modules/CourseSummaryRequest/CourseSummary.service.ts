import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCourseSummaryRequestDto } from "./dto/types";
import { RequestStatus } from "@prisma/client";
import { NotificationService } from "../Notifications/Notification.service";
import { AuthUser } from "../auth/types/auth-types";
import { v4 as uuidv4 } from "uuid";
import { PaymentStatus } from "@prisma/client"
import { ConfigService } from "@nestjs/config";


@Injectable()
export class CourseSummaryService {

     constructor(private prisma: PrismaService,private notificationService:NotificationService,private configService:ConfigService) {}


async createRequest(dto: CreateCourseSummaryRequestDto, user: AuthUser) {
  const totalPrice = dto.numCourses * 2000;

  const findUser = await this.prisma.user.findFirst({
    where: { id: user.userId },
    include: { profile: true },
  });

  const reference = uuidv4(); // Unique Paystack reference

  return this.prisma.$transaction(async (tx) => {
    await this.notificationService.createRequestNotificationTx(
      {
        degreeLevel: dto.degreeLevel,
        courseCodes: dto.courseCodes,
        username: findUser?.profile?.name.split(" ")[0] || "",
      },
      tx
    );

    // Create Course Summary Request
    const request = await tx.courseSummaryRequest.create({
      data: {
        degreeLevel: dto.degreeLevel,
        courseCount: dto.numCourses,
        courseCodes: dto.courseCodes,
        email: dto.email,
        whatsapp: dto.whatsapp,
        totalPrice,
        status: RequestStatus.PENDING,
        paid: false,
        userId: user.userId,
      },
    });

    // Create associated Payment record
    await tx.payment.create({
      data: {
        reference,
        amount: totalPrice,
        currency: "NGN",
        userId: user.userId,
        requestId: request.id,
        status: PaymentStatus.PENDING,
        gateway: "paystack",
      },
    });

    return {
      reference,
      amount: totalPrice,
      email: dto.email,
      publicKey: this.configService.get<string>("PAYSTACK_PUBLIC_KEY") ,
    };
  });
}

 

async markAsPaid(requestId: string) {
  return this.prisma.courseSummaryRequest.update({
    where: { id: requestId },
    data: {
      paid: true,
      status: RequestStatus.PAID,
    },
  });
}

}