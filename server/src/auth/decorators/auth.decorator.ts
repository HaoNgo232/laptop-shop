import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthType } from '../enums/auth-type.enum';
import { UserRole } from '../enums/user.role';
import { AUTH_TYPE_KEY } from '../constants/auth.constants';
import { RolesGuard, ROLES_KEY } from '../guards/authentication/roles.guard';
import { AuthenticationGuard } from '../guards/authentication/authentication.guard';

/**
 * Decorator xác thực và phân quyền người dùng
 * @param authType - Loại xác thực (mặc định là Bearer)
 * @param roles - Danh sách vai trò được phép truy cập
 */
export function Auth(
  authType: AuthType = AuthType.Bearer,
  ...roles: UserRole[]
) {
  // Khởi tạo mảng decorators với các guard cơ bản
  const decorators = [
    // Lưu loại xác thực vào metadata
    SetMetadata(AUTH_TYPE_KEY, [authType]),
    // Thêm guard xác thực
    UseGuards(AuthenticationGuard),
  ];

  // Nếu có yêu cầu phân quyền
  if (roles.length > 0) {
    // Thêm metadata về roles và guard phân quyền
    decorators.push(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
  }

  // Áp dụng tất cả decorators
  return applyDecorators(...decorators);
}
