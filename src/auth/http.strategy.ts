import { Injectable, UnauthorizedException } from '@nestjs/common';

import {PassportStrategy} from '@nestjs/passport';
import {Strategy} from 'passport-http-bearer';
import { AuthService } from './auth.service';

@Injectable()

export class HttpStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly authService: AuthService){
        super();
    }
    async validate(token: string){
        const user = await this.authService.validateUser(token);
        // console.log("user", user)
        if(!user){ // 如果用token找不到使用者，就丟unauthorized exception
            throw new UnauthorizedException();
        }
        return user; // 有找到使用者，passport会把user物件存在req中
    }
}