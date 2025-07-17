import { ConfigService } from '@nestjs/config';
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
import { AuthenticationGuard } from '@/auth/guards/authentication/authentication.guard';
import { GenerateTokensProvider } from '@/auth/providers/generate-tokens.provider';
import { RolesGuard } from '@/auth/guards/authentication/roles.guard';

/**
 * Module để quản lý đăng nhập, đăng ký, và xác thực người dùng
 */
@Module({
  imports: [
    // Cấu hình TypeOrmModule
    TypeOrmModule.forFeature([User]),
    // Cấu hình JwtModule
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
    // Import CartModule
    forwardRef(() => CartModule),
  ],
  controllers: [AuthController, UsersController],
  providers: [
    // Services
    AuthService,
    UsersService,
    // Providers
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    BcryptProvider,
    GenerateTokensProvider,
    AccessTokenGuard,
    AuthenticationGuard,
    RolesGuard, // Strategies
    JwtStrategy, // Strategies
  ],
  // Exports cho các module khác sử dụng
  exports: [UsersService, AccessTokenGuard, RolesGuard],
})
export class AuthModule {}
