import { PartialType, OmitType } from '@nestjs/mapped-types';
import { UserProfileDto } from './user-profile.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Kế thừa từ UserProfileDto nhưng loại bỏ các trường nhạy cảm
export class UpdateUserProfileDto extends PartialType(
  OmitType(UserProfileDto, [
    'id',
    'email',
    'role',
    'createdAt',
    'updatedAt',
    'password_hash',
  ] as const),
) {
  @ApiProperty({
    description: 'Họ và tên',
    example: 'Nguyễn Văn A',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Họ tên phải dài ít nhất 3 ký tự' })
  @MaxLength(50, { message: 'Họ tên không được vượt quá 50 ký tự' })
  full_name?: string;

  @ApiProperty({
    description: 'Địa chỉ',
    example: '123 Đường ABC, Quận 1, TP.HCM',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Địa chỉ phải dài ít nhất 3 ký tự' })
  @MaxLength(100, { message: 'Địa chỉ không được vượt quá 100 ký tự' })
  address?: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0901234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone_number?: string;
}
