import { PdfCategory } from "@prisma/client";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";



export class UpdatePdfDto {

    @IsString()
    @IsOptional()
  title?: string;

  @IsString()
    @IsOptional()
  description?: string; 

   @IsNumber()
    @IsOptional()
  price?: number;

   @IsBoolean()
    @IsOptional()
  isFree?: boolean;

  @IsOptional()
    @IsEnum(PdfCategory)
  category?: PdfCategory;
  

  @IsOptional()
@IsString()
  level?: string;
}