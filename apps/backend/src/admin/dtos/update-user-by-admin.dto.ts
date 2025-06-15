import { IUpdateByAdmin } from '@web-ecom/shared-types/admin/interfaces.cjs';
import { UserRole } from '@web-ecom/shared-types/auth/enums.cjs';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserByAdminDto implements IUpdateByAdmin {
  @ApiProperty({
    description: 'Vai trò mới của người dùng',
    enum: UserRole,
    example: UserRole.USER,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: 'Trạng thái hoạt động của người dùng',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
