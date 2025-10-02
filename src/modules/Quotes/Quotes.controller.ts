import { Controller, Get } from '@nestjs/common';
import { QuotesService } from './Quotes.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('quotes')
export class QuotesController {
  constructor(private quotesService: QuotesService) {}
  @Public()
  @Get('today')
  async getQuoteOfTheDay() {
    return await this.quotesService.getQuoteOfTheDay();
  }
}
