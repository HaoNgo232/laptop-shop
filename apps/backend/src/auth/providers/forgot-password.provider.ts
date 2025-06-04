import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import jwtConfig from '@/auth/config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordPayload } from '@/auth/interfaces/reset-password-payload.interface';
import { User } from '@/auth/entities/user.entity';

@Injectable()
export class ForgotPasswordProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly mailerService: MailerService,
  ) {}

  async sendResetPasswordEmail(email: string): Promise<void> {
    // Tìm user theo email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    // Tạo reset token với payload đúng kiểu
    const payload: ResetPasswordPayload = {
      sub: user.id,
      type: 'password-reset',
    };

    const resetToken = this.jwtService.sign(payload, {
      secret: this.jwtConfiguration.secret,
      expiresIn: '1h',
    });

    // Tạo URL reset password
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Gửi email
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset your password',
      template: 'reset-password',
      context: {
        name: user.username || user.email,
        resetUrl,
      },
    });
  }
}
