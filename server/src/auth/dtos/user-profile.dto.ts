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
import { ApiProperty } from '@nestjs/swagger';

@Expose() // Chỉ hiển thị các trường được định nghĩa rõ ràng
export class UserProfileDto {
  @ApiProperty({
    description: 'ID người dùng',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Địa chỉ email',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({
    description: 'Họ và tên',
    example: 'Nguyễn Văn A',
  })
  @IsString()
  full_name: string;

  @ApiProperty({
    description: 'Địa chỉ',
    example: '123 Đường ABC, Quận 1, TP.HCM',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0901234567',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Số điện thoại không hợp lệ' })
  phone_number?: string;

  @ApiProperty({
    description: 'Vai trò người dùng',
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: 'Thời điểm tạo tài khoản',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Thời điểm cập nhật tài khoản',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDate()
  updatedAt: Date;

  @Exclude()
  password_hash?: string;

  constructor(partial: Partial<UserProfileDto>) {
    Object.assign(this, partial);
  }
}
