import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email đăng nhập',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu đăng nhập',
    example: 'Pass123456',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
