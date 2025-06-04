import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { BcryptProvider } from '@/auth/providers/bcrypt.provider';
import { ResetPasswordDto } from '@/auth/dtos/reset-password.dto';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from '@/auth/config/jwt.config';
import { ResetPasswordPayload } from '@/auth/interfaces/reset-password-payload.interface'; // Import ResetPasswordPayload
import { User } from '@/auth/entities/user.entity';

@Injectable()
export class ResetPasswordProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly bcryptProvider: BcryptProvider,
  ) {}

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    try {
      const resetPayload = await this.jwtService.verifyAsync<ResetPasswordPayload>(
        resetPasswordDto.token,
        {
          secret: this.jwtConfiguration.secret,
        },
      );

      if (resetPayload.type !== 'password-reset') {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      const user = await this.userRepository.findOne({
        where: { id: resetPayload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User không tồn tại');
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = await this.bcryptProvider.hashPassword(resetPasswordDto.newPassword);

      // Cập nhật mật khẩu
      user.password_hash = hashedPassword;
      await this.userRepository.save(user);
    } catch (error) {
      if (error) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }
      throw error;
    }
  }
}
