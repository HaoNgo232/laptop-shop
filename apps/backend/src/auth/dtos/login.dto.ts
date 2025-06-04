import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ILoginUser } from '@web-ecom/shared-types';

export class LoginUserDto implements ILoginUser {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email là bắt buộc' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu là bắt buộc' })
  password: string;
}
