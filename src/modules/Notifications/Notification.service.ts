import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, NotificationType } from "@prisma/client";
import { readFile } from "fs/promises";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class NotificationService {

    constructor(private prisma:PrismaService) {}

async createRequestNotificationTx(
  dto: { degreeLevel: string; courseCodes: string[],username: string },
  tx: Prisma.TransactionClient
) {
const admins = await tx.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true },
  });

  const notificationData = admins.map((admin) => ({
    title: `New course summary request from ${dto.username}`,
    body: `Degree Level: ${dto.degreeLevel}\nCourses: ${dto.courseCodes.join(", ")}`,
    type: NotificationType.REQUEST,
    recipientId: admin.id,
  }));

  await tx.notification.createMany({
    data: notificationData,
  });
}



async getAdmingNotificationById(notificationId: string,adminId:string) {
   const notification = await this.prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) throw new NotFoundException('Notification not found');

  if (notification.recipientId && notification.recipientId !== adminId) {
    throw new ForbiddenException('Not allowed');
  }

  return notification;
}


async markAsRead(notificationId: string, adminId: string) {
  const notification = await this.prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) throw new NotFoundException('Notification not found');

  if (notification.recipientId && notification.recipientId !== adminId) {
    throw new ForbiddenException('Not allowed');
  }

  return await this.prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}




async deleteNotification(id: string) {
    const notification = await this.prisma.notification.findFirst({where: {id}})
    if(!notification) {
        throw new NotFoundException("notification not found!")
    }
   await this.prisma.notification.delete({where: {id}})
   return {message: "notificaton successfully deleted"}
}


async getUnreadNotificationCountForAdmin(adminId: string) {
  const count = await this.prisma.notification.count({
    where: {
      AND: [
        { recipientId: adminId },        // Filter for notifications for this admin
        { isRead: false }              // Only unread notifications
      ]
    }
  });

  return { count };
}




}