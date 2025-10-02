import { Module } from '@nestjs/common';
import { AcademiceventController } from './academicevent.controller';
import { AcademiceventService } from './academicevent.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [AcademiceventService, PrismaService],
  controllers: [AcademiceventController],
})
export class AcademiceventModule {}
