import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsString,
  IsUUID,
  IsDate,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../enums/user.role';

@Expose() // Chỉ hiển thị các trường được định nghĩa rõ ràng
export class UserProfileDto {
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
  phone_number?: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  @Exclude()
  password_hash?: string;

  constructor(partial: Partial<UserProfileDto>) {
    Object.assign(this, partial);
  }
}
