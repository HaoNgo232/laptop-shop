import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables
config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST') || 'postgres',
  port: parseInt(configService.get('DATABASE_PORT') || '5432'),
  username: configService.get('DATABASE_USERNAME') || 'ecom_user',
  password: configService.get('DATABASE_PASSWORD') || 'ecom_password',
  database: configService.get('DATABASE_NAME') || 'ecom_db',
  synchronize: true, // Tự động tạo bảng từ entities, đơn giản nhất!
  logging: true, // Bật log để debug
  entities: ['dist/**/*.entity.js'],
  dropSchema: false, // Không xóa data cũ
});

export default AppDataSource;
