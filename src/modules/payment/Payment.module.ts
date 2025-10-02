import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentController } from './Payment.controller';
import { PaymentService } from './Payment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/utilities/email/email.service';
import { PdfService } from '../pdf/pdf.service';

@Module({
  imports: [],
  providers: [
    PaymentService,
    PrismaService,
    ConfigService,
    EmailService,
    PdfService,
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
