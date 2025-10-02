import { Module } from '@nestjs/common';
import { CourseSummaryService } from './CourseSummary.service';
import { CourseSummaryContoller } from './CourseSummary.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationService } from '../Notifications/Notification.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [CourseSummaryContoller],
  providers: [
    CourseSummaryService,
    PrismaService,
    NotificationService,
    ConfigService,
  ],
})
export class CourseSummaryModule {}
