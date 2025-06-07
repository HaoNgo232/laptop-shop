import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsString, IsUUID, IsDate, IsOptional } from 'class-validator';
import { IUserProfile } from '@web-ecom/shared-types';
import { UserRole } from '@/auth/enums/user-role.enum';

@Expose()
export class UserProfileDto implements IUserProfile {
  @IsUUID()
  id: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại không hợp lệ' })
  phoneNumber?: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @Exclude()
  passwordHash?: string;
}
