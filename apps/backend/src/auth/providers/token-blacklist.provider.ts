/* eslint-disable @typescript-eslint/no-misused-promises */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';
import { TokenBlacklist } from '@/auth/entities/token-blacklist.entity';

interface ITokenBlacklistProvider {
  addToBlacklist(token: string, type: 'access' | 'refresh'): Promise<void>;
  isBlacklisted(token: string): Promise<boolean>;
  removeExpiredTokens(): Promise<void>;
}

@Injectable()
export class TokenBlacklistProvider implements ITokenBlacklistProvider {
  constructor(
    /**
     * Repository để lưu trữ token blacklist.
     */
    @InjectRepository(TokenBlacklist)
    private readonly tokenBlacklistRepository: Repository<TokenBlacklist>,

    /**
     * JwtService để giải mã token.
     */
    private readonly jwtService: JwtService,
  ) {
    // Đặt lịch tự động xóa các token hết hạn mỗi ngày (24 giờ)
    setInterval(() => this.removeExpiredTokens(), 24 * 60 * 60 * 1000);
  }

  /**
   * Thêm token vào blacklist
   */
  async addToBlacklist(token: string, type: 'access' | 'refresh'): Promise<void> {
    try {
      // Giải mã token để lấy thời gian hết hạn
      const decoded: JwtPayload = this.jwtService.decode(token);

      if (!decoded || !decoded.exp) {
        throw new UnauthorizedException('Invalid token');
      }

      // Chuyển đổi exp từ timestamp (giây) sang Date
      const expiresAt = new Date(decoded.exp * 1000);

      // Lưu token vào blacklist
      await this.tokenBlacklistRepository.save({
        token,
        type,
        expiresAt,
      });
    } catch (error) {
      throw new UnauthorizedException(error, 'Invalid token');
    }
  }

  /**
   * Kiểm tra token có trong blacklist không
   */
  async isBlacklisted(token: string): Promise<boolean> {
    const count = await this.tokenBlacklistRepository.count({
      where: { token },
    });
    return count > 0;
  }

  /**
   * Xóa các token đã hết hạn khỏi blacklist (24 giờ)
   */
  async removeExpiredTokens(): Promise<void> {
    const now = new Date();
    await this.tokenBlacklistRepository.delete({
      expiresAt: LessThan(now),
    });
  }
}
