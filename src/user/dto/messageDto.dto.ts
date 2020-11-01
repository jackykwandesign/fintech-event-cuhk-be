import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class MessageDto {
  @IsNotEmpty()
  @IsEmail()
  receiverEmail: string;

  @IsNotEmpty()
  @IsString()
  message:string;
}