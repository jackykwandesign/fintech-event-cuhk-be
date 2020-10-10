import { AuthService } from './auth.service';
import { Request } from 'express';
import { UserDto } from './dto/User.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    fillUserInfo(user: UserDto, formData: any): Promise<void>;
    login(user: UserDto): Promise<UserDto>;
    register(request: Request): Promise<void>;
}
