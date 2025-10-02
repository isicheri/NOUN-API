import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}
  async getQuoteOfTheDay() {
    const count = await this.prisma.quotes.count();
    const randomIndex = Math.floor(Math.random() * count);
    const quote = await this.prisma.quotes.findMany({
      take: 1,
      skip: randomIndex,
    });
    return quote[0];
  }
}
