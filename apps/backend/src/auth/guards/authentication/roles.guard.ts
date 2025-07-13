import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { User } from '@/auth/entities/user.entity';
import { UserRole } from '@/auth/enums/user-role.enum';
import { REQUEST_USER_KEY } from '@/auth/constants/auth.constants';

// Key để lấy thông tin roles từ metadata.
export const ROLES_KEY = 'roles';

/**
 * Decorator để lấy thông tin roles từ metadata.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    /**
     * Reflector để lấy thông tin roles từ metadata.
     */
    private readonly reflector: Reflector,
  ) {}

  /**
   * Kiểm tra xem user có quyền truy cập hay không.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request: Request & { user: User } = context.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY];

    return requiredRoles.some((role) => user.role === role);
  }
}
