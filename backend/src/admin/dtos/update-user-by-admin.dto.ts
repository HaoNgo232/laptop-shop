import { UserRole } from '@/auth/enums/user-role.enum';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class UpdateUserByAdminDto {
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
