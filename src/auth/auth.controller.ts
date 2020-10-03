import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GetUser } from './get-user.decorator';
import { UserDto } from './dto/User.dto';
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
    @UseGuards(AuthGuard('bearer'))
    @Post("/fillInfo")
    fillUserInfo(
        @GetUser() user:UserDto,
        @Body('formData') formData:any
    ){
        return this.authService.fillUserInfo(formData,user)
    }    

    @UseGuards(AuthGuard('bearer'))
    @Post("/login")
    login(
        @GetUser() user:UserDto
    ){
        return this.authService.login(user)
    }



    // @Post("/loginByToken")
    // loginByToken(
    //     // @GetUser() user:UserDto
    //     @Body('accessToken') token:string,
    // ){
    //     return this.authService.loginByToken(token)
    // }
    
    // @UseGuards(AuthGuard('bearer'))
    @Post("/register")
    register(
        @Req() request: Request
    ){
        return this.authService.register(request)
    }

}
