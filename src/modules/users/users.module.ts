import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './users.controller';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UsersService, PrismaService],
})
export class UserModule {}
