import { Controller, Get, UseGuards, Patch, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/auth/user-role.enum';
import { UpdateWebinarDto } from './dto/update-webinar.dto';
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

    @Patch("/updateWebinar")
    @Roles(UserRole.ADMIN)
    updateWebinar(
        @Body() updateWebinarDto:UpdateWebinarDto
    ){
        return this.webinarService.updateWebinarByID(updateWebinarDto)
    }
}
