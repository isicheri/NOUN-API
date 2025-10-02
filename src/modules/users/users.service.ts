import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetUsersDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getNotificationsForAdmin(adminId: string) {
    const adminWithNotifications = await this.prisma.user.findUnique({
      where: { id: adminId },
      include: {
        notification: true, // or notification? depends on your schema
      },
    });
    if (!adminWithNotifications) {
      throw new NotFoundException('Admin not found');
    }
    // return the notifications array
    return adminWithNotifications.notification || [];
  }

  async fetchAllUsers(query: GetUsersDto) {
    const { page = 1, limit = 10 } = query;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        include: {
          profile: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        omit: {
          password: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
