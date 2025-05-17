import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  // Chỉ synchronize trong môi trường phát triển
  synchronize: process.env.NODE_ENV !== 'production',
  // Chỉ xóa schema trong môi trường phát triển và test
  dropSchema: ['development', 'test'].includes(process.env.NODE_ENV ?? ''),
  // Sử dụng logging chỉ trong môi trường phát triển
  //   logging: process.env.NODE_ENV === 'development',
  // logging: process.env.NODE_ENV === 'development' ? true : ['error', 'schema'],

  // Thêm cấu hình migrations
  migrationsRun: process.env.NODE_ENV === 'production',
  migrations: ['dist/migrations/**/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
}));
