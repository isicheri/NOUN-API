import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCourseSummaryRequestDto } from "./dto/types";
import { RequestStatus } from "@prisma/client";
import { NotificationService } from "../Notifications/Notification.service";
import { AuthUser } from "../auth/types/auth-types";


@Injectable()
export class CourseSummaryService {

     constructor(private prisma: PrismaService,private notificationService:NotificationService) {}


async createRequest(dto: CreateCourseSummaryRequestDto,user:AuthUser) {
  const totalPrice = dto.numCourses * 2000;
  
  const findUser = await this.prisma.user.findFirst({where: {id: user.userId},include: {profile: true}});
  

  return this.prisma.$transaction(async (tx) => {
    // Create notification
    await this.notificationService.createRequestNotificationTx(
      {
        degreeLevel: dto.degreeLevel,
        courseCodes: dto.courseCodes,
        username: findUser?.profile?.name.split(" ")[0] || ""
      },
      tx // pass the transaction client
    );

    // Create course summary request
    return tx.courseSummaryRequest.create({
      data: {
        degreeLevel: dto.degreeLevel,
        courseCount: dto.numCourses,
        courseCodes: dto.courseCodes,
        email: dto.email,
        whatsapp: dto.whatsapp,
        totalPrice,
        status: RequestStatus.PENDING,
        paid: false,
      },
    });
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