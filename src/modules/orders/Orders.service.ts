import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { GetOrderQueryDto } from "./dto/get-order.dto";



@Injectable()
export class OrdersService {

    constructor(private prisma:PrismaService) {}

    async fetchOrders(query: GetOrderQueryDto) {
  const { page = 1, limit = 10, status, search } = query;

  const where: any = {};

  if (status) where.status = status;

  if (search) {
    where.user = {
      is: {
        email: {
          contains: search,
          mode: 'insensitive',
        },
      },
    };
  }

  const [data, total] = await this.prisma.$transaction([
    this.prisma.order.findMany({
      where,
      include: {
        user: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    this.prisma.order.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    limit,
  };
}


}