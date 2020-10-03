import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
@Controller('auth')
export class AuthController {
    constructor(
        private authService:AuthService
    ){}
    // @Get("/")
    // getAllUser(){
    //     return this.authService.getAllUser()
    // }

    // @Get("/webinar")
    // getAllWebinar(){
    //     return this.authService.getAllWebinar()
    // }

    // @UseGuards(AuthGuard('bearer'))
    @Post("/login")
    login(
        @Req() request: Request
    ){
        return this.authService.login(request)
    }
}
