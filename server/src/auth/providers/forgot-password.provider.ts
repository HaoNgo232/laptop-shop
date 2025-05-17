import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../../config/jwt.config';
// import { EmailService } from '../../shared/services/email.service';
import { ResetPasswordPayload } from '../interfaces/reset-password-payload.interface';

@Injectable()
export class ForgotPasswordProvider {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    // private readonly emailService: EmailService,
  ) {}

  async sendResetPasswordEmail(email: string): Promise<void> {
    // Tìm user theo email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
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

    // // Gửi email
    // await this.emailService.sendMail({
    //   to: user.email,
    //   subject: 'Reset your password',
    //   template: 'reset-password',
    //   context: {
    //     name: user.fullName || user.email,
    //     resetUrl,
    //   },
    // });
  }
}
