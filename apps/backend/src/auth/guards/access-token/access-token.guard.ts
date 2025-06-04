/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import jwtConfig from '../../config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../../constants/auth.constants';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the request object from the context
    const request = context.switchToHttp().getRequest();
    // Extract the token from the request headers
    const token = this.extractRequestFromHeaders(request);
    // Validate the token
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request[REQUEST_USER_KEY] = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractRequestFromHeaders(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
