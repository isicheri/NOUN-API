import { Controller, Get } from '@nestjs/common';
import { AcademiceventService } from './academicevent.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('academicevent')
export class AcademiceventController {
  constructor(private readonly academiceventService: AcademiceventService) {}

  @Public()
  @Get('academic-event')
  async getEvent() {
    return this.academiceventService.getCurrentEvents();
  }
}
