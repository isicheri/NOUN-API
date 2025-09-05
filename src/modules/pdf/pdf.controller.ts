// pdf.controller.ts
import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfCategory } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-guard.guard';
import { AuthRequest } from '../auth/types/auth-types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Request } from 'express';

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


  @UseGuards(JwtAuthGuard)
  @Get("/:pdfId/download")
  async downloadPdf(
    @Param("pdfId") id: string,
    @Req() req:AuthRequest
  ){
   return await this.pdfService.downloadpdf(id,req);
  }

  
  // only admin can upload
 @Post('upload')
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(Role.ADMIN)
@UseInterceptors(FileInterceptor('file'))
async uploadPdf(
  @UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 15, message: "file size must be 15mb or less" }),
      new FileTypeValidator({ fileType: /^application\/pdf$/ })
    ]
  })) file: Express.Multer.File,
  @Body() createPdfDto: CreatePdfDto,
  @Req() req: AuthRequest
) {
  return await this.pdfService.uploadPdf(file, createPdfDto, req);
}


@Post('test-auth')
@UseGuards(JwtAuthGuard)
getUser(@Req() req: Request) {

  console.log('req.user in test-auth:', req.user);
  return req.user;
}



}
