/* eslint-disable @typescript-eslint/naming-convention */
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import jwtConfig from '@/auth/config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '@/auth/constants/auth.constants';
import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';
/**
 * Guard để kiểm tra token truyền vào
 */
@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    /**
     * Inject JwtService để kiểm tra token.
     */
    private readonly jwtService: JwtService,

    /**
     * Inject cấu hình Jwt.
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  /**
   * Kiểm tra xem token có hợp lệ hay không.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Lấy request từ context
    const request: Request = context.switchToHttp().getRequest();
    // Lấy token từ headers
    const token = this.extractRequestFromHeaders(request);
    // Nếu không tìm thấy token thì throw exception
    if (!token) {
      throw new UnauthorizedException('Không tìm thấy token');
    }

    // Kiểm tra token
    try {
      // Verify token
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.secret,
        ignoreExpiration: false, // Không bỏ qua thời gian hết hạn - JWT tự động kiểm tra trường "exp" trong token
      });

      // Lưu payload vào request
      request[REQUEST_USER_KEY] = payload;

      // Trả về true để cho phép request đi tiếp
      return true;
    } catch {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }

  /**
   * Lấy token từ headers.
   */
  private extractRequestFromHeaders(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
