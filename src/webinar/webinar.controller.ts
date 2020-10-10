import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { WebinarService } from './webinar.service';

@Controller('webinar')
@UseGuards(AuthGuard('bearer'),RolesGuard)
export class WebinarController {
    constructor(
        private webinarService:WebinarService
    ){}

    @Get("/")
    getAllWebinar(){
        return this.webinarService.getAllWebinar()
    }
}
