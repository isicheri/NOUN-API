import { Module } from '@nestjs/common';
import { SupabaseModule } from './supabase/supabase.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AcademiceventModule } from './modules/academicEvent/academicevent.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/users.module';

@Module({
  imports: [SupabaseModule, ConfigModule.register({folder: "."}), PrismaModule,AcademiceventModule,AuthModule,UserModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
