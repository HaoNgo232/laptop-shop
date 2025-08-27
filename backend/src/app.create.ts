import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function appCreate(app: INestApplication): void {
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

  // Cấu hình Swagger document cho API
  const config = new DocumentBuilder()
    .setTitle('🏪 Laptop Shop E-commerce API')
    .setDescription(`
      **Comprehensive API Documentation for Laptop Shop E-commerce Platform**
      
      This API provides complete functionality for an e-commerce laptop store including:
      
      ## 🔐 Authentication & Authorization
      - User registration and login
      - JWT token-based authentication
      - Role-based access control (USER, ADMIN)
      - Token refresh mechanism
      
      ## 🛍️ Product Management
      - Browse products with advanced filtering
      - Product search and sorting
      - Category-based organization
      - Best-selling and high-stock recommendations
      
      ## 🛒 Shopping Experience
      - Shopping cart management
      - Order creation and tracking
      - Multiple payment methods (COD, SePay QR)
      - Order status updates
      
      ## 💳 Payment Processing
      - SePay QR code generation
      - Webhook handling for payment notifications
      - Payment method switching
      - Secure transaction processing
      
      ## 👨‍💼 Administrative Features
      - Dashboard with analytics
      - User and order management
      - Inventory tracking
      - Sales reporting
      
      ## 📧 Additional Features
      - Email notifications
      - Product reviews and ratings
      - Stock reservation system
      - Comprehensive error handling
      
      **Base URL:** \`/api\`
      
      **Authentication:** Most endpoints require Bearer token authentication.
      Include in request header: \`Authorization: Bearer <your-token>\`
      
      **Rate Limiting:** SePay API calls are limited to 2 requests/second.
      
      **Error Handling:** All endpoints return standardized error responses with appropriate HTTP status codes.
    `)
    .setVersion('1.0.0')
    .setContact('Development Team', 'https://github.com/HaoNgo232/laptop-shop', 'contact@laptopshop.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token obtained from login endpoint',
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
      docExpansion: 'list',
      filter: true,
      showRequestHeaders: true,
      showCommonExtensions: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Laptop Shop API Documentation',
    customfavIcon: 'https://avatars.githubusercontent.com/u/20165699?s=32&v=4',
  });

  // Sử dụng ClassSerializerInterceptor toàn cục
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  console.log(`Environment: ${configService.get('app.nodeEnv')}`);
  console.log(`🔖 Swagger documentation available at: http://localhost:${configService.get('app.port')}/api/docs`);

  // Thiết lập CORS
  app.enableCors();
}