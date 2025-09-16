import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SupabaseModule } from './supabase/supabase.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AcademiceventModule } from './modules/academicEvent/academicevent.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/users.module';
import { RolesGuard } from './common/guards/roles.guard';
import { EmailModule } from './utilities/email/email.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { PrismaHealthMiddleware } from './prisma/middleware/prismaHealth.middleware';
import { AppController } from './app.controller';
import { JwtAuthGuard } from './modules/auth/guards/jwt-guard.guard';
import { CourseSummaryModule } from './modules/CourseSummaryRequest/CourseSummary.module';
import { NotificationModule } from './modules/Notifications/Notification.module';
import { PaymentModule } from './modules/payment/Payment.module';
import { CartModule } from './modules/Cart/Cart.module';
import { QuotesModule } from './modules/Quotes/Quotes.module';

@Module({
  imports: [SupabaseModule, ConfigModule.register({folder: "."}), PrismaModule,AcademiceventModule,AuthModule,UserModule,EmailModule,PdfModule,CourseSummaryModule,NotificationModule,PaymentModule,CartModule,QuotesModule],
  controllers: [AppController],
  providers: [PrismaService,
      {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // ✅ Must come first
    },
{
  provide: APP_GUARD,
  useClass: RolesGuard
},PrismaHealthMiddleware],
})
export class AppModule implements NestModule {
   constructor(private readonly prismaHealthMiddleware: PrismaHealthMiddleware) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrismaHealthMiddleware).forRoutes('*');
  }
}
