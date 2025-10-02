import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/utilities/email/email.service';

@Module({
  imports: [],
  providers: [PdfService, PrismaService, ConfigService, EmailService],
  controllers: [PdfController],
})
export class PdfModule {}
