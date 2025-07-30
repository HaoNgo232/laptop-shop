import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  // Bật synchronize để tự động tạo bảng
  synchronize: true,
  // Bật logging để debug
  logging: true,
  // Không xóa schema
  dropSchema: false,
  // Thêm cấu hình migrations
  migrationsRun: process.env.NODE_ENV === 'production',
  migrations: ['dist/migrations/**/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
}));
