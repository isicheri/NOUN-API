import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { PdfCategory } from '@prisma/client';

export class CreatePdfDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  courseCode: string;

  @IsString()
  level: string;

  @IsEnum(PdfCategory)
  category: PdfCategory;

  @IsBoolean()
  @IsOptional()
  isFree?: boolean;

  @IsNumber()
  @IsOptional()
  price?: number = 0.0;
}
