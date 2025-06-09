import { IUpdateUserByAdmin } from '@web-ecom/shared-types/admin/interfaces.cjs';
import { UserRole } from '@web-ecom/shared-types/auth/enums.cjs';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class UpdateUserByAdminDto implements IUpdateUserByAdmin {
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
