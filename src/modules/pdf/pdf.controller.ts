// pdf.controller.ts
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfCategory } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-guard.guard';
import { AuthRequest } from '../auth/types/auth-types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdatePdfDto } from './dto/update-pdf.dto';
import { Public } from 'src/common/decorators/public.decorator';

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
  @Get('/:pdfId/download')
  async downloadPdf(@Param('pdfId') id: string, @Req() req: AuthRequest) {
    return await this.pdfService.downloadpdf(id, req);
  }

  // only admin can upload
  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      limits: { fileSize: 15 * 1024 * 1024 },
    }),
  )
  async uploadPdfs(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 15 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^application\/pdf$/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Body('metadata') rawMetadata: string, // string from multipart/form-data
    @Req() req: AuthRequest,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one PDF file is required');
    }

    let metadataArray: CreatePdfDto[];

    try {
      metadataArray = JSON.parse(rawMetadata);
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Invalid metadata format');
    }
    // console.log(metadataArray)
    return await this.pdfService.uploadMultiplePdfs(files, metadataArray, req);
  }

  @Delete('/:pdfId/delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deletePdf(@Param('pdfId') id: string, @Req() request: AuthRequest) {
    await this.pdfService.deletePdfFile(id, request);
  }

  @Get('/:pdfId/view')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getpdfById(@Param('pdfId') id: string, @Req() request: AuthRequest) {
    return await this.pdfService.getPdfById(id, request);
  }

  @Put('/:pdfId/update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updatePdfById(
    @Param('pdfId') id: string,
    @Req() request: AuthRequest,
    @Body() body: UpdatePdfDto,
  ) {
    // console.log(body);
    return await this.pdfService.updatePdfById(id, request, body);
  }

  @Get('/trending')
  @Public()
  async getTrendingPdf() {
    return await this.pdfService.getTrendingByDownload(3);
  }
}
