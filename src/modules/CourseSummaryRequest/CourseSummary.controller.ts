import { Body, Controller,Post,Patch, UseGuards, Req } from "@nestjs/common";
import { CourseSummaryService } from "./CourseSummary.service";
import { CreateCourseSummaryRequestDto, MarkAsPaidDto } from "./dto/types";
import { JwtAuthGuard } from "../auth/guards/jwt-guard.guard";
import { AuthRequest } from "../auth/types/auth-types";



@Controller("course-summary") 
export class CourseSummaryContoller {

    constructor(private readonly service: CourseSummaryService) {}


  @UseGuards(JwtAuthGuard)  
  @Post('/request')
  createRequest(@Body() dto: CreateCourseSummaryRequestDto,@Req() request: AuthRequest) {
    return this.service.createRequest(dto,request.user);
  }

  @Patch('mark-paid')
markAsPaid(@Body() dto: MarkAsPaidDto) {
  return this.service.markAsPaid(dto.requestId);
}

}