/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { IAdminQuery } from '@web-ecom/shared-types/admin/interfaces.cjs';
import { UserRole } from '@web-ecom/shared-types/auth/enums.cjs';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AdminUserQueryDto implements IAdminQuery {
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
