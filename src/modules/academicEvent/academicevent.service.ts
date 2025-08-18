import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AcademiceventService {

    constructor(
        private readonly prismaClient: PrismaService
    ) {}

async getCurrentEvents() {
  return this.prismaClient.academicEvent.findMany({
    orderBy: { target: "asc" }, // soonest event first
  });
}


}
