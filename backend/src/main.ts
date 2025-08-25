import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import { appCreate } from '@/app.create';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // // Thiết lập global prefix cho tất cả API
  // app.setGlobalPrefix('api');

  // Áp dụng cấu hình app
  appCreate(app);

  app.useStaticAssets(join(__dirname, '..', 'images'), {
    prefix: '/images',
  });

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
