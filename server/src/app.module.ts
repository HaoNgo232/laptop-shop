import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { validationSchema } from './config/validation.schema';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { ProductsModule } from './products/products.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './auth/config/jwt.config';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { JwtModule } from '@nestjs/jwt';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from '@/orders/orders.module';
// import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

@Module({
  imports: [
    // Cấu hình ConfigModule
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
      validationSchema,
    }),
    // Cấu hình TypeOrmModule
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        autoLoadEntities: true,
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('database.logging'),
      }),
    }),
    AuthModule,
    MailModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    // Tạm thời comment out để handle lỗi manual
    // {
    //   provide: APP_FILTER,
    //   useClass: GlobalExceptionFilter,
    // },
  ],
})
export class AppModule {}
