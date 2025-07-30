import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, MaxLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email là bắt buộc' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu là bắt buộc' })
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @Matches(/(?=.*\d)(?=.*[a-zA-Z])/, {
    message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu xác nhận là bắt buộc' })
  @MinLength(8, { message: 'Mật khẩu xác nhận phải có ít nhất 8 ký tự' })
  @Matches(/(?=.*\d)(?=.*[a-zA-Z])/, {
    message: 'Mật khẩu xác nhận phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
  })
  confirmPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên người dùng là bắt buộc' })
  @MinLength(3, { message: 'Tên người dùng phải có ít nhất 3 ký tự' })
  @MaxLength(20, { message: 'Tên người dùng không được vượt quá 20 ký tự' })
  username: string;
}
