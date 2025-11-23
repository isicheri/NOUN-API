import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}
  async getQuoteOfTheDay() {
    const count = await this.prisma.quotes.count();
    if (count === 0) {
      return {
        text: 'The journey of a thousand miles begins with a single step.',
        author: 'Lao Tzu',
      };
    }
    const randomIndex = Math.floor(Math.random() * count);
    const quote = await this.prisma.quotes.findMany({
      take: 1,
      skip: randomIndex,
    });
    return quote[0];
  }
}
