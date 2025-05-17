import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[0-9])(?=.*[a-zA-Z])/, {
    message:
      'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
  })
  password!: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;
}
