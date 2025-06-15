import { ConfigService } from '@nestjs/config';
import { TokenBlacklist } from '@/auth/entities/token-blacklist.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/auth/entities/user.entity';
import { forwardRef } from '@nestjs/common';
import { AuthController } from '@/auth/controllers/auth.controller';
import { AccessTokenGuard } from '@/auth/guards/access-token/access-token.guard';
import { UsersController } from '@/auth/controllers/users.controller';
import { Module } from '@nestjs/common';
import { CartModule } from '@/cart/cart.module';
import { AuthService } from '@/auth/services/auth.service';
import { HashingProvider } from '@/auth/providers/hashing.provider';
import { UsersService } from '@/auth/services/users.service';
import { BcryptProvider } from '@/auth/providers/bcrypt.provider';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { TokenBlacklistProvider } from '@/auth/providers/token-blacklist.provider';
import { AuthenticationGuard } from '@/auth/guards/authentication/authentication.guard';
import { GenerateTokensProvider } from '@/auth/providers/generate-tokens.provider';
import { RolesGuard } from '@/auth/guards/authentication/roles.guard';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { ValidateUserUseCase } from './use-cases/validate-user.use-case';
import { ForgotPasswordUseCase } from './use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from './use-cases/reset-password.use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { ChangePasswordUseCase } from './use-cases/change-password.use-case';

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
    forwardRef(() => CartModule),
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
    GenerateTokensProvider,
    AuthenticationGuard,
    RolesGuard,
    CreateUserUseCase,
    ValidateUserUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    RefreshTokenUseCase,
    ChangePasswordUseCase,
  ],
  exports: [
    UsersService,
    JwtStrategy,
    TokenBlacklistProvider,
    BcryptProvider,
    JwtModule,
    GenerateTokensProvider,
    AuthenticationGuard,
    AccessTokenGuard,
    RolesGuard,
  ],
})
export class AuthModule {}
