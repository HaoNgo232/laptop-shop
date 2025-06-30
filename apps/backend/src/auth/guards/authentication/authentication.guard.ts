/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '@/auth/constants/auth.constants';
import { AccessTokenGuard } from '@/auth/guards/access-token/access-token.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;

  private readonly authtypeGuardMap: Record<AuthType, CanActivate | CanActivate[]>;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authtypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // authTypes from reflector
    const authTypes = this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];

    // array of guards
    const guards = authTypes.map((type) => this.authtypeGuardMap[type]).flat();
    const error = new UnauthorizedException('Không có quyền truy cập');

    // Loop guards canActivate
    for (const instance of guards) {
      const canActivate = await Promise.resolve(instance.canActivate(context)).catch((err) => {
        throw new UnauthorizedException('Không có quyền truy cập', err);
      });
      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}
