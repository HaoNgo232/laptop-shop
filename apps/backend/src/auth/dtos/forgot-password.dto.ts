import { IsEmail, IsNotEmpty } from 'class-validator';
import { IForgotPassword } from '@web-ecom/shared-types';

export class ForgotPasswordDto implements IForgotPassword {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
