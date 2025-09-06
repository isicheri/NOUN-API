import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { Public } from "./common/decorators/public.decorator";



@Controller("app")
export class AppController {
    
constructor(private  prismaService: PrismaService) {}

    @Public()
    @Get('health')
async health() {
  const isConnected = await this.prismaService.isDbConnected();
  if (!isConnected) {
    throw new ServiceUnavailableException('Cannot connect to DB');
  }
  return { status: 'ok' };
}


}