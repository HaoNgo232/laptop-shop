import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

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

  // Sử dụng ClassSerializerInterceptor toàn cục
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Lấy port từ config service
  const port = configService.get<number>('app.port') ?? 3000;
  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Environment: ${configService.get('app.nodeEnv')}`);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
