import { PartialType, OmitType } from '@nestjs/mapped-types';
import { UserProfileDto } from './user-profile.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// Kế thừa từ UserProfileDto nhưng loại bỏ các trường nhạy cảm
export class UpdateProfileDto extends PartialType(
  OmitType(UserProfileDto, [
    'id',
    'email',
    'role',
    'createdAt',
    'updatedAt',
    'password_hash',
  ] as const),
) {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Họ tên phải dài ít nhất 3 ký tự' })
  @MaxLength(50, { message: 'Họ tên không được vượt quá 50 ký tự' })
  full_name?: string;
}
