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
import { APP_GUARD } from '@nestjs/core';
import { HashingProvider } from './providers/hashing.provider';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('jwt.secret');
        const expirationTime = configService.get<string>('jwt.expirationTime'); // jwt.config.ts now returns string ("1h")

        if (!secret) {
          throw new Error('JWT_SECRET is not defined!');
        }
        if (!expirationTime) {
          throw new Error('JWT_EXPIRATION_TIME is not defined!');
        }

        return {
          secret: secret,
          signOptions: {
            expiresIn: expirationTime, // Use string with time unit (e.g., "1h")
          },
        };
      },
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    MailerModule,
  ],
  controllers: [AuthController, UsersController],
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
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    UsersService,
  ],
})
export class AuthModule {}
