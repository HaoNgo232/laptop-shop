/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { UserRole } from '@/auth/enums/user-role.enum';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AdminUserQueryDto {
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  search?: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}
