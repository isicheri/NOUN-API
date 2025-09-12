import { Module } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { PaymentController } from "./Payment.controller";
import { PaymentService } from "./Payment.service";
import { PrismaService } from "src/prisma/prisma.service";





@Module({
    imports: [],
    providers: [PaymentService,PrismaService,ConfigService],
    controllers: [PaymentController]
})
export class PaymentModule {}