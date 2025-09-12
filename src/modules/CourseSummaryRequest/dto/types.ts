// src/course-summary/dto/create-course-summary-request.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsArray, ArrayNotEmpty, IsPhoneNumber, IsUUID } from 'class-validator';

export class CreateCourseSummaryRequestDto {
  @IsNotEmpty()
  @IsString()
  degreeLevel: string;

  @IsNotEmpty()
  numCourses: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  courseCodes: string[];

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
//   @IsPhoneNumber(undefined, { message: "WhatsApp number must be a valid international phone number (e.g. +234...)" })
  whatsapp: string;

  @IsBoolean()
  agree: boolean;
}


export class MarkAsPaidDto {
  @IsUUID()
  requestId: string;
}