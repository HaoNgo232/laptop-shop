import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for user login
 */
export class LoginUserDto {
  @ApiProperty({ 
    description: 'User email address for authentication',
    example: 'admin@gmail.com',
    format: 'email' 
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email là bắt buộc' })
  email: string;

  @ApiProperty({ 
    description: 'User password for authentication',
    example: 'admin123',
    minLength: 1 
  })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu là bắt buộc' })
  password: string;
}
