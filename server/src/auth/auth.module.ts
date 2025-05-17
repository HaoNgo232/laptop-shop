import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserProvider } from './providers/create-user.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { ValidateUserProvider } from './providers/validate-user.provider';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { RefreshTokenProvider } from './providers/refresh-token.provider';
import { ChangePasswordProvider } from './providers/change-password.provider';
import { ForgotPasswordProvider } from './providers/forgot-password.provider';
import { ResetPasswordProvider } from './providers/reset-password.provider';
// import { EmailService } from '../shared/services/email.service'; // Giả định bạn có EmailService
import { APP_GUARD } from '@nestjs/core';
import { HashingProvider } from './providers/hashing.provider';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    CreateUserProvider,
    BcryptProvider,
    ValidateUserProvider,
    GenerateTokensProvider,
    RefreshTokenProvider,
    ChangePasswordProvider,
    ForgotPasswordProvider,
    ResetPasswordProvider,
    // EmailService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
  ],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: `${configService.get('jwt.expirationTime')}s`,
        },
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
})
export class AuthModule {}
