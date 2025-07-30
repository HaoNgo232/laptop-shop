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
    /**
     * Reflector để lấy thông tin auth type từ metadata.
     */
    private readonly reflector: Reflector,

    /**
     * Guard để kiểm tra access token.
     */
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authtypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }

  /**
   * Kiểm tra xem request có được phép truy cập hay không.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //  Sử dụng reflector lấy authTypes từ metadata gắn tại context từ class hoặc method(handler)
    const authTypes = this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];

    // Mảng các guard
    const guards = authTypes.map((type) => this.authtypeGuardMap[type]).flat();
    const error = new UnauthorizedException('Không có quyền truy cập');

    // Loop qua các guard canActivate
    for (const instance of guards) {
      // Kiểm tra xem guard có thể activate hay không bằng gọi canActivate từ guard tương ứng
      const canActivate = await Promise.resolve(instance.canActivate(context)).catch((err) => {
        throw new UnauthorizedException('Không có quyền truy cập', err);
      });
      // Nếu token hợp lệ thì trả về true
      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}
