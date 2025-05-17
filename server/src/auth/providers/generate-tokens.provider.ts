import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signToken<T>(userId: string, expiresIn: string, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  public async generateTokens(user: Omit<User, 'password'>) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      // Generate access token
      this.signToken(
        user.id,
        this.jwtConfiguration.expirationTime.toString(),
        payload,
      ),

      // Generate refresh token
      this.signToken(
        user.id,
        this.jwtConfiguration.refreshExpirationTime,
        payload,
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
