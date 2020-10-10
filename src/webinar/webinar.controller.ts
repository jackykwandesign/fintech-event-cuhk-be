import { Controller, Get } from '@nestjs/common';
import { WebinarService } from './webinar.service';

@Controller('webinar')
export class WebinarController {
    constructor(
        private webinarService:WebinarService
    ){}

    @Get("/")
    getAllWebinar(){
        return this.webinarService.getAllWebinar()
    }
}
