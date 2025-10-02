import { Module } from '@nestjs/common';
import { CartController } from './Cart.controller';
import { CartService } from './Cart.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [CartController],
  providers: [CartService, PrismaService, ConfigService],
})
export class CartModule {}
