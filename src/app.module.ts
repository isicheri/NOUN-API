import { Module } from '@nestjs/common';
import { SupabaseModule } from './supabase/supabase.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AcademiceventModule } from './modules/academicEvent/academicevent.module';

@Module({
  imports: [SupabaseModule, ConfigModule.register({folder: "."}), PrismaModule,AcademiceventModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
