import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '@/auth/config/jwt.config';
import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';
import { User } from '@/auth/entities/user.entity';

interface IGenerateTokensProvider {
  signToken<T>(userId: string, expiresIn: string | number, payload?: T): Promise<string>;
  generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }>;
}

@Injectable()
export class GenerateTokensProvider implements IGenerateTokensProvider {
  constructor(
    /**
     * JwtService để tạo token.
     */
    private readonly jwtService: JwtService,

    /**
     * Cấu hình Jwt.
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  /**
   * Tạo token cho user.
   */
  public async signToken<T>(
    userId: string,
    expiresIn: string | number, // Có thể là string (ví dụ: '7d') hoặc number (giây)
    payload?: T,
  ) {
    const signOptions = {
      secret: this.jwtConfiguration.secret,
      expiresIn: expiresIn,
    };

    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      signOptions,
    );
  }

  /**
   * Tạo token cho user.
   */
  public async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Access token sử dụng string expirationTime với đơn vị thời gian (ví dụ: "1h")
    const accessTokenExpiresIn = this.jwtConfiguration.expirationTime;
    // Refresh token sử dụng string refreshExpirationTime (ví dụ: '7d')
    const refreshTokenExpiresIn = this.jwtConfiguration.refreshExpirationTime;

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<JwtPayload>(
        user.id,
        accessTokenExpiresIn, // Truyền string với đơn vị thời gian (ví dụ: "1h")
        payload,
      ),
      this.signToken<JwtPayload>(
        user.id,
        refreshTokenExpiresIn, // Truyền string (ví dụ: '7d')
        payload,
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
