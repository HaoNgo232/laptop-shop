import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class UserBriefDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
