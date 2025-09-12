import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";



@Injectable()
export class UsersService {

    constructor(private prisma:PrismaService) {}

    async getNotificationsForAdmin(adminId: string) {
      const adminWithNotifications = await this.prisma.user.findUnique({
        where: { id: adminId },
        include: {
          notification: true,  // or notification? depends on your schema
        },
      });
    
      if (!adminWithNotifications) {
        throw new NotFoundException('Admin not found');
      }
    
      // return the notifications array
      return adminWithNotifications.notification || [];
    }
    

}