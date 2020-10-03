import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserDto } from "./dto/User.dto";


export const GetUser = createParamDecorator((data, ctx: ExecutionContext): UserDto => {
    const req = ctx.switchToHttp().getRequest();
    // console.log("req.user", req.user)
    return req.user;
});