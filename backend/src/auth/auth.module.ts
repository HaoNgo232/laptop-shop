import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '@/auth/entities/user.entity';
import { Order } from '@/orders/entities/order.entity';
import { AuthController } from '@/auth/controllers/auth.controller';
import { UsersController } from '@/auth/controllers/users.controller';
import { AuthService } from '@/auth/services/auth.service';
import { UsersService } from '@/auth/services/users.service';
import { RankService } from '@/orders/services/rank.service';
import { HashingProvider } from '@/auth/providers/hashing.provider';
import { BcryptProvider } from '@/auth/providers/bcrypt.provider';
import { GenerateTokensProvider } from '@/auth/providers/generate-tokens.provider';
import { AccessTokenGuard } from '@/auth/guards/access-token/access-token.guard';
import { AuthenticationGuard } from '@/auth/guards/authentication/authentication.guard';
import { RolesGuard } from '@/auth/guards/authentication/roles.guard';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';

/**
 * Module để quản lý đăng nhập, đăng ký, và xác thực người dùng
 */
@Module({
  imports: [
    // Cấu hình TypeOrmModule
    TypeOrmModule.forFeature([User, Order]),
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
  ],
  controllers: [AuthController, UsersController],
  providers: [
    // Services
    AuthService,
    UsersService,
    RankService,
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
