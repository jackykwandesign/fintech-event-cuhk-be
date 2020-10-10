import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserOptDto {
  @IsEmail()
  email: string;
}