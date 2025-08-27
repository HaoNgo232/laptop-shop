import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for user registration
 */
export class RegisterUserDto {
  @ApiProperty({ 
    description: 'User email address (will be used for login)',
    example: 'user@example.com',
    format: 'email' 
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email là bắt buộc' })
  email: string;

  @ApiProperty({ 
    description: 'Password must be at least 8 characters long and contain both letters and numbers',
    example: 'StrongPass123',
    minLength: 8,
    pattern: '^(?=.*[a-zA-Z])(?=.*\\d).{8,}$' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu là bắt buộc' })
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @Matches(/(?=.*\d)(?=.*[a-zA-Z])/, {
    message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
  })
  password: string;

  @ApiProperty({ 
    description: 'Password confirmation (must match the password field)',
    example: 'StrongPass123',
    minLength: 8 
  })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu xác nhận là bắt buộc' })
  @MinLength(8, { message: 'Mật khẩu xác nhận phải có ít nhất 8 ký tự' })
  @Matches(/(?=.*\d)(?=.*[a-zA-Z])/, {
    message: 'Mật khẩu xác nhận phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
  })
  confirmPassword: string;

  @ApiProperty({ 
    description: 'Unique username for the account',
    example: 'johnsmith',
    minLength: 3,
    maxLength: 20 
  })
  @IsString()
  @IsNotEmpty({ message: 'Tên người dùng là bắt buộc' })
  @MinLength(3, { message: 'Tên người dùng phải có ít nhất 3 ký tự' })
  @MaxLength(20, { message: 'Tên người dùng không được vượt quá 20 ký tự' })
  username: string;
}
