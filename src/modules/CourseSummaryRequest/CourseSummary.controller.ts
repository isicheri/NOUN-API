import { Body, Controller,Post,Patch, UseGuards, Req, Get, Query } from "@nestjs/common";
import { CourseSummaryService } from "./CourseSummary.service";
import { CreateCourseSummaryRequestDto, MarkAsPaidDto } from "./dto/types";
import { JwtAuthGuard } from "../auth/guards/jwt-guard.guard";
import { AuthRequest } from "../auth/types/auth-types";
import { GetCourseSummaryRequestDto } from "./dto/get-course-summary-request.dto";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Role } from "src/common/enums/role.enum";
import { Roles } from "src/common/decorators/roles.decorator";



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


   @Get("/admin-get-request")
   @UseGuards(JwtAuthGuard,RolesGuard)
   @Roles(Role.ADMIN)
  async findAll(@Query() query: GetCourseSummaryRequestDto) {
    return this.service.getCourseSummaryRequests(query);
  }


}