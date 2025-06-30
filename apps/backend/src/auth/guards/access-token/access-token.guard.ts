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

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractRequestFromHeaders(request);
    if (!token) {
      throw new UnauthorizedException('Không tìm thấy token');
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);

      request[REQUEST_USER_KEY] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }

  private extractRequestFromHeaders(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
