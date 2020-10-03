import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpStrategy } from './http.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    HttpStrategy
  ]
})
export class AuthModule {}
