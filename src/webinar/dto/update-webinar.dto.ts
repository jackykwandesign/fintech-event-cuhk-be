import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateWebinarDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  zoomURL:string;

  @IsOptional()
  @IsString()
  replayURL:string;
}