import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";



@Controller("app")
export class AppController {
    
constructor(private  prismaService: PrismaService) {}

    @Get('health')
async health() {
  const isConnected = await this.prismaService.isDbConnected();
  if (!isConnected) {
    throw new ServiceUnavailableException('Cannot connect to DB');
  }
  return { status: 'ok' };
}


}