import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '@/auth/entities/user.entity';

/**
 * Strategy để xác thực token JWT.
 * Hiện tại chưa sử dụng service này, đang dùng jwtService trong authService để thay thế.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    /**
     * ConfigService để lấy secret key từ configuration.
     */
    private readonly configService: ConfigService,

    /**
     * Repository để lấy thông tin user từ database.
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const jwtSecret = configService.get<string>('jwt.secret');

    if (!jwtSecret) {
      throw new Error('JWT secret is not defined in the configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Validate payload từ token.
   */
  async validate(payload: { sub: string; email: string }) {
    // Tìm user theo id (sub) từ payloads
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });
    if (!user) {
      return null;
    }

    // Loại bỏ password trước khi trả về
    const { passwordHash, ...result } = user;
    return result;
  }
}
