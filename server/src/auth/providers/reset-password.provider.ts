/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BcryptProvider } from './bcrypt.provider';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../../config/jwt.config';
import { ResetPasswordPayload } from '../interfaces/reset-password-payload.interface'; // Import ResetPasswordPayload

@Injectable()
export class ResetPasswordProvider {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly bcryptProvider: BcryptProvider,
  ) {}

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    try {
      // Xác thực token
      const payload = await this.jwtService.verifyAsync<ResetPasswordPayload>( // Sử dụng ResetPasswordPayload
        resetPasswordDto.token,
        {
          secret: this.jwtConfiguration.secret,
        },
      );

      // Kiểm tra loại token
      if (payload.type !== 'password-reset') {
        throw new UnauthorizedException('Invalid token');
      }

      // Tìm user
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = await this.bcryptProvider.hashPassword(
        resetPasswordDto.newPassword,
      );

      // Cập nhật mật khẩu
      user.password = hashedPassword;
      await this.userRepository.save(user);
    } catch (err: unknown) {
      // Explicitly type the error as unknown
      // Optional: Log the error for more detailed diagnostics if needed
      // For example: if (err instanceof Error) console.error(err.message);
      throw new UnauthorizedException('Token is invalid or expired');
    }
  }
}
