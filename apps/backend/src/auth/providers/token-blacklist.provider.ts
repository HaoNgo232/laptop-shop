/* eslint-disable @typescript-eslint/no-misused-promises */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';
import { TokenBlacklist } from '@/auth/entities/token-blacklist.entity';

@Injectable()
export class TokenBlacklistProvider {
  constructor(
    @InjectRepository(TokenBlacklist)
    private readonly tokenBlacklistRepository: Repository<TokenBlacklist>,
    private readonly jwtService: JwtService,
  ) {
    // Đặt lịch tự động xóa các token hết hạn mỗi ngày
    setInterval(() => this.removeExpiredTokens(), 24 * 60 * 60 * 1000);
  }

  /**
   * Thêm token vào blacklist
   * @param token Token cần thêm vào blacklist
   * @param type Loại token (access/refresh)
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
   * @param token Token cần kiểm tra
   * @returns true nếu token có trong blacklist, false nếu không
   */
  async isBlacklisted(token: string): Promise<boolean> {
    const count = await this.tokenBlacklistRepository.count({
      where: { token },
    });
    return count > 0;
  }

  /**
   * Xóa các token đã hết hạn khỏi blacklist
   */
  async removeExpiredTokens(): Promise<void> {
    const now = new Date();
    await this.tokenBlacklistRepository.delete({
      expiresAt: LessThan(now),
    });
  }
}
