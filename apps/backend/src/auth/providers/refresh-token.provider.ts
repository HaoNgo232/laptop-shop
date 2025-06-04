import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '@/auth/config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { GenerateTokensProvider } from '@/auth/providers/generate-tokens.provider';
import { RefreshTokenDto } from '@/auth/dtos/refresh-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';
import { LoginResponseDto } from '@/auth/dtos/login-response.dto';
import { User } from '@/auth/entities/user.entity';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly generateTokensProvider: GenerateTokensProvider,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<LoginResponseDto> {
    try {
      // Xác thực refresh token
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
      });

      // Lấy thông tin user từ database
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Khong tìm thấy user');
      }

      // Generate new tokens
      const tokens = await this.generateTokensProvider.generateTokens(user);
      return { ...tokens, user };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error; // Ném lại ngoại lệ đã được xử lý
      }
      throw new UnauthorizedException('Refresh token không hợp lệ'); // Xử lý ngoại lệ khác
    }
  }
}
