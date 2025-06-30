import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { User } from '@/auth/entities/user.entity';
import { UserRole } from '@/auth/enums/user-role.enum';
import { REQUEST_USER_KEY } from '@/auth/constants/auth.constants';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

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
