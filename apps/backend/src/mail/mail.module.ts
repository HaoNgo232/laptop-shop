import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';
import { MailService } from '@/mail/mail.service';

/**
 * Module để gửi email
 */
@Global()
@Module({
  imports: [
    // Cấu hình MailerModule
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('app.mailHost'),
          port: 2525,
          secure: false,
          auth: {
            user: configService.get<string>('app.smtpUsername'),
            pass: configService.get<string>('app.smtpPassword'),
          },
        },
        defaults: {
          from: `My Ecommerce Website <noreply@myapp.com>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter({
            inlineCssEnabled: true,
          }),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  providers: [
    // Services
    MailService,
  ],
  exports: [MailService],
})
export class MailModule {}
