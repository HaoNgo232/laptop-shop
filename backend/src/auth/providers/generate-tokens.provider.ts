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
     * Service để tạo và verify JWT tokens
     */
    private readonly jwtService: JwtService,

    /**
     * Config chứa secret key và thời gian hết hạn tokens
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  /**
   * Tạo JWT token với thông tin user và thời gian hết hạn
   * @param userId - ID của user (sẽ được lưu trong 'sub' claim)
   * @param expiresIn - Thời gian hết hạn (vd: '1h', '7d' hoặc số giây)
   * @param payload - Data bổ sung cần lưu trong token
   */
  public async signToken<T>(userId: string, expiresIn: string | number, payload?: T) {
    const payloadData: object = {
      sub: userId,
      ...payload,
    };

    const optional = {
      secret: this.jwtConfiguration.secret,
      expiresIn,
    };

    // Tạo token với payload và thời gian hết hạn
    const token: string = await this.jwtService.signAsync(payloadData, optional);

    return token;
  }

  /**
   * Tạo cặp access token và refresh token cho user
   * Access token: dùng để xác thực API calls (thời gian ngắn)
   * Refresh token: dùng để tạo access token mới (thời gian dài)
   */
  public async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    // Payload chung cho cả 2 loại token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessTokenExpiresIn = this.jwtConfiguration.expirationTime; // láy thời gian hết hạn từ biến môi trường - 1h
    const refreshTokenExpiresIn = this.jwtConfiguration.refreshExpirationTime; // láy thời gian hết hạn từ biến môi trường - 7d

    // Tạo song song để tối ưu performance
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<JwtPayload>(user.id, accessTokenExpiresIn, payload),
      this.signToken<JwtPayload>(user.id, refreshTokenExpiresIn, payload),
    ]);

    return { accessToken, refreshToken };
  }
}
