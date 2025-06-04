import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@/auth/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserWelcomeEmail(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'noreply@myapp.com',
      subject: 'Welcome to My Ecommerce Web!',
      template: 'welcome',
      context: {
        name: user.username,
        email: user.email,
        loginUrl: 'http://localhost:3000',
      },
    });
  }
}
