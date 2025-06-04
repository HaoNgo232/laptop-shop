import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { TokenBlacklistProvider } from '@/auth/providers/token-blacklist.provider';
import { User } from '@/auth/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenBlacklistProvider: TokenBlacklistProvider,
  ) {
    const jwtSecret = configService.get<string>('jwt.secret');

    if (!jwtSecret) {
      throw new Error('JWT secret is not defined in the configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string; email: string }) {
    // Kiểm tra token có nằm trong blacklist không
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const isBlacklisted = await this.tokenBlacklistProvider.isBlacklisted(token);

      if (isBlacklisted) {
        throw new UnauthorizedException('Token đã hết hạn hoặc đã bị vô hiệu hóa');
      }
    }

    // Tìm user theo id (sub) từ payload
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });
    if (!user) {
      return null;
    }

    // Loại bỏ password trước khi trả về
    const { password_hash, ...result } = user;
    return result;
  }
}
