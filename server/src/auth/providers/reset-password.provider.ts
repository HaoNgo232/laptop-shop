import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BcryptProvider } from './bcrypt.provider';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { ResetPasswordPayload } from '../interfaces/reset-password-payload.interface'; // Import ResetPasswordPayload

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
      // Xác thực token
      const resetPayload =
        await this.jwtService.verifyAsync<ResetPasswordPayload>( // Sử dụng ResetPasswordPayload
          resetPasswordDto.token,
          {
            secret: this.jwtConfiguration.secret,
          },
        );

      // Kiểm tra loại token
      if (resetPayload.type !== 'password-reset') {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      // Tìm user
      const user = await this.userRepository.findOne({
        where: { id: resetPayload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User không tồn tại');
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = await this.bcryptProvider.hashPassword(
        resetPasswordDto.newPassword,
      );

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
