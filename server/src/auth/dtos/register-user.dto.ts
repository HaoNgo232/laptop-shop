import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Email người dùng',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu người dùng',
    example: 'Pass123456',
    required: true,
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[a-zA-Z])/, {
    message:
      'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
  })
  password!: string;

  @ApiProperty({
    description: 'Họ và tên người dùng',
    example: 'Nguyễn Văn A',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;
}
