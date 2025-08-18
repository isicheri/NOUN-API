import { Controller, Get } from '@nestjs/common';
import { AcademiceventService } from './academicevent.service';

@Controller('academicevent')
export class AcademiceventController {

    constructor(
        private readonly academiceventService: AcademiceventService
    ) {}


    @Get("academic-event")
async getEvent() {
  return this.academiceventService.getCurrentEvents();
}

}
