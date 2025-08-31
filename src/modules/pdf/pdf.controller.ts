// pdf.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfCategory } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-guard.guard';

@Controller('pdfs')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}


  @UseGuards(JwtAuthGuard)
  @Get()
  async getPdfs(
    @Query('category') category?: PdfCategory,
    @Query('search') search?: string,
    @Query('level') level?: string,
    @Query('isFree') isFree?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.pdfService.getPdfs({
      category,
      search,
      level,
      isFree: isFree ? isFree === 'true' : undefined,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
  }
}
