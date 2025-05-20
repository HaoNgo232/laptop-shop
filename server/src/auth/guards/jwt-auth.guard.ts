/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/isPublic.decorator';
import { TokenBlacklistProvider } from '../providers/token-blacklist.provider';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenBlacklistProvider: TokenBlacklistProvider,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Kiểm tra nếu route được đánh dấu là public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Kiểm tra xem token có nằm trong blacklist không
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      // Kiểm tra token có trong blacklist không
      return this.validateToken(token).then((valid) => {
        if (!valid) {
          throw new UnauthorizedException(
            'Token đã hết hạn hoặc đã bị vô hiệu hóa',
          );
        }

        return super.canActivate(context) as Promise<boolean>;
      });
    }

    return super.canActivate(context);
  }

  private async validateToken(token: string): Promise<boolean> {
    try {
      const isBlacklisted =
        await this.tokenBlacklistProvider.isBlacklisted(token);
      return !isBlacklisted;
    } catch (error) {
      console.error('Lỗi khi kiểm tra token blacklist:', error);
      return false;
    }
  }
}
