import { Module } from '@nestjs/common';
import { OrdersController } from './Orders.controller';
import { OrdersService } from './Orders.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [OrdersController],
  imports: [],
  providers: [OrdersService, PrismaService],
})
export class OrdersModule {}
