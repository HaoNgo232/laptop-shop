import { PartialType, OmitType } from '@nestjs/mapped-types';
import { UserProfileDto } from './user-profile.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

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
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Họ tên phải dài ít nhất 3 ký tự' })
  @MaxLength(50, { message: 'Họ tên không được vượt quá 50 ký tự' })
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Địa chỉ phải dài ít nhất 3 ký tự' })
  @MaxLength(100, { message: 'Địa chỉ không được vượt quá 100 ký tự' })
  address?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;
}
