import { Body, Controller, Get, Post, Put, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/auth/dto/User.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/auth/user-role.enum';
import { UserOptDto } from './dto/userOptDto.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('bearer'),RolesGuard)
export class UserController {
    constructor(
        private userService:UserService
    ){}

    @Get("/participant")
    @Roles(UserRole.ADMIN,UserRole.HELPER)
    getAllParticipant(
        // @GetUser() user:UserDto,
        // @Body('formData') formData:any
    ){
        return this.userService.getAllParticipant()
    }

    @Get("/shareParticipant")
    // @Roles(UserRole.ADMIN,UserRole.HELPER)
    getShareParticipant(
        // @GetUser() user:UserDto,
        // @Body('formData') formData:any
    ){
        return this.userService.getShareParticipant()
    }

    @Get("/helperOrAdmin")
    @Roles(UserRole.ADMIN)
    getAllHelperOrAdmin(
        // @GetUser() user:UserDto,
        // @Body('formData') formData:any
    ){
        return this.userService.getAllHelperOrAdmin()
    }

    @Put("/setHelper")
    @Roles(UserRole.ADMIN)
    setHelper(
        @Body() userOptDto:UserOptDto
    ){
        return this.userService.setHelper(userOptDto)
    }

    @Post("/createHelper")
    @Roles(UserRole.ADMIN)
    createHelper(
        @Body() userOptDto:UserOptDto
    ){
        return this.userService.createHelper(userOptDto)
    }
}
