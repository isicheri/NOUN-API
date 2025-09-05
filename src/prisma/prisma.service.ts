import { Injectable,OnModuleInit,OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy,OnModuleInit{
  async  onModuleInit() {
    await this.$connect();
    }

   async  onModuleDestroy() {
        await this.$disconnect();
    }

    async isDbConnected(): Promise<boolean> {
    try {
      // A simple query to check DB connectivity
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (e) {
      return false;
    }
  }
    
}
