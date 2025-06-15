/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { IAdminQuery } from '@web-ecom/shared-types/admin/interfaces.cjs';
import { UserRole } from '@web-ecom/shared-types/auth/enums.cjs';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminUserQueryDto implements IAdminQuery {
  @ApiProperty({
    description: 'Số trang (bắt đầu từ 1)',
    example: 1,
    minimum: 1,
    required: false,
    default: 1,
  })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Số lượng item trên mỗi trang',
    example: 10,
    minimum: 1,
    required: false,
    default: 10,
  })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'Từ khóa tìm kiếm theo email hoặc tên người dùng',
    example: 'john@example.com',
    required: false,
  })
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Lọc theo vai trò người dùng',
    enum: UserRole,
    example: UserRole.USER,
    required: false,
  })
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}
