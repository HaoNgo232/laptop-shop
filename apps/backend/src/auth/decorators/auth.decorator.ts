/* eslint-disable @typescript-eslint/naming-convention */
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { UserRole } from '@/auth/enums/user-role.enum';
import { AUTH_TYPE_KEY } from '@/auth/constants/auth.constants';
import { AuthenticationGuard } from '@/auth/guards/authentication/authentication.guard';
import { ROLES_KEY, RolesGuard } from '@/auth/guards/authentication/roles.guard';

/**
 * Decorator xác thực và phân quyền người dùng
 */
export function Auth(authType: AuthType = AuthType.Bearer, ...roles: UserRole[]) {
  const decorators = [
    // Lưu loại xác thực vào metadata
    SetMetadata(AUTH_TYPE_KEY, [authType]),

    // Thêm guard xác thực
    UseGuards(AuthenticationGuard),
  ];

  // Nếu có yêu cầu phân quyền (roles)
  if (roles.length > 0) {
    // Thêm metadata về roles và guard phân quyền
    decorators.push(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
  }

  // Áp dụng tất cả decorators (lưu loại xác thực vào metadata)
  return applyDecorators(...decorators);
}
