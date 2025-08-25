import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';

export function appCreate(app: INestApplication): void {
  const configService = app.get(ConfigService);

  // Configure static file serving for uploaded images
  const expressApp = app.getHttpAdapter().getInstance();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  expressApp.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Thiết lập global ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // Loại bỏ các thuộc tính không được định nghĩa trong DTO
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Cấu hình Swagger document cho API
  const config = new DocumentBuilder()
    .setTitle('Web Ecommerce API')
    .setDescription('API documentation cho ứng dụng Web Ecommerce')
    .setVersion('1.0')
    .addTag('Ứng dụng', 'Các API chung của ứng dụng')
    .addTag('Xác thực', 'Các API liên quan đến xác thực người dùng')
    .addTag('Người dùng', 'Các API liên quan đến quản lý thông tin người dùng')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Sử dụng ClassSerializerInterceptor toàn cục
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  console.log(`Environment: ${configService.get('app.nodeEnv')}`);

  // Thiết lập CORS
  app.enableCors();
}
