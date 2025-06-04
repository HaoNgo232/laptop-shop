import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { IResetPassword } from '@web-ecom/shared-types';

export class ResetPasswordDto implements IResetPassword {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
  })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
