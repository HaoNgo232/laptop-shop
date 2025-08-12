import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email là bắt buộc' })
  email: string;

  @ApiProperty({ example: 'StrongPass123', description: 'Ít nhất 8 ký tự, gồm chữ và số' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu là bắt buộc' })
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @Matches(/(?=.*\d)(?=.*[a-zA-Z])/, {
    message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
  })
  password: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu xác nhận là bắt buộc' })
  @MinLength(8, { message: 'Mật khẩu xác nhận phải có ít nhất 8 ký tự' })
  @Matches(/(?=.*\d)(?=.*[a-zA-Z])/, {
    message: 'Mật khẩu xác nhận phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
  })
  confirmPassword: string;

  @ApiProperty({ example: 'nguoimoi' })
  @IsString()
  @IsNotEmpty({ message: 'Tên người dùng là bắt buộc' })
  @MinLength(3, { message: 'Tên người dùng phải có ít nhất 3 ký tự' })
  @MaxLength(20, { message: 'Tên người dùng không được vượt quá 20 ký tự' })
  username: string;
}
