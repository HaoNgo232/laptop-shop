import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { IChangePassword } from '@web-ecom/shared-types/auth/interfaces';

export class ChangePasswordDto implements IChangePassword {
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu hiện tại là bắt buộc' })
  currentPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu mới là bắt buộc' })
  @MinLength(8, { message: 'Mật khẩu mới phải có ít nhất 8 ký tự' })
  @Matches(/(?=.*[0-9])(?=.*[a-zA-Z])/, {
    message: 'Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Xác nhận mật khẩu là bắt buộc' })
  confirmPassword: string;
}
