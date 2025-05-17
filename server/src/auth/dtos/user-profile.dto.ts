import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsString, IsUUID, IsDate } from 'class-validator';
import { UserRole } from '../enums/user.role';

@Expose() // Chỉ hiển thị các trường được định nghĩa rõ ràng
export class UserProfileDto {
  @IsUUID()
  id: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  full_name: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @Exclude()
  password_hash?: string;

  constructor(partial: Partial<UserProfileDto>) {
    Object.assign(this, partial);
  }
}
