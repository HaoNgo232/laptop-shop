import { AccessTokenGuard } from './guards/access-token/access-token.guard';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenBlacklistProvider } from './providers/token-blacklist.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { TokenBlacklist } from './entities/token-blacklist.entity'; // Tạo nếu chưa có
import { CreateUserProvider } from './providers/create-user.provider';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { ValidateUserProvider } from './providers/validate-user.provider';
import { ForgotPasswordProvider } from './providers/forgot-password.provider';
import { ResetPasswordProvider } from './providers/reset-password.provider';
import { RefreshTokenProvider } from './providers/refresh-token.provider';
import { User } from './entities/user.entity';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';
import { HashingProvider } from './providers/hashing.provider';
import { UsersController } from './controllers/users.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { RolesGuard } from './guards/authentication/roles.guard';
@Module({
  imports: [
    TypeOrmModule.forFeature([TokenBlacklist, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
      }),
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [
    AccessTokenGuard,
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    UsersService,
    JwtStrategy,
    TokenBlacklistProvider,
    BcryptProvider,
    CreateUserProvider,
    GenerateTokensProvider,
    ValidateUserProvider,
    ForgotPasswordProvider,
    ResetPasswordProvider,
    RefreshTokenProvider,
    AuthenticationGuard,
    RolesGuard,
  ],
  exports: [
    UsersService,
    JwtStrategy,
    TokenBlacklistProvider,
    BcryptProvider,
    JwtModule,
    CreateUserProvider,
    GenerateTokensProvider,
    ValidateUserProvider,
    ForgotPasswordProvider,
    ResetPasswordProvider,
    RefreshTokenProvider,
    AuthenticationGuard,
    AccessTokenGuard,
    RolesGuard,
  ],
})
export class AuthModule {}
