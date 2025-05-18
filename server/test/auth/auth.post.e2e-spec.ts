/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker';

describe('[Auth] @Post Endpoint', () => {
  let app: INestApplication;
  let accessToken: string; // Biến để lưu trữ access token
  let configService: ConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.listen(3001); // Sử dụng cổng 3001 cho bài kiểm tra

    // Đăng nhập để lấy token
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    accessToken = response.body.accessToken as string;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a user', async () => {
    const fakeEmail = faker.internet.email();
    const fakeFullName = faker.person.fullName();
    const fakePassword = faker.internet.password();

    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: fakeEmail,
        full_name: fakeFullName,
        password: fakePassword,
        // Thêm các trường cần thiết khác theo DTO
      })
      .expect(201); // Kiểm tra mã trạng thái HTTP

    expect(response.body).toHaveProperty('id'); // Kiểm tra xem phản hồi có chứa id không
  });

  it('should login a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(response.body).toHaveProperty('accessToken'); // Kiểm tra xem phản hồi có chứa accessToken không
    accessToken = response.body.accessToken as string; // Lưu access token để sử dụng cho các bài kiểm tra sau
  });

  it('should logout a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.message).toBe('Đăng xuất thành công');
  });

  it('should refresh token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/refresh-token')
      .send({
        refreshToken: accessToken, // Thay bằng refresh token hợp lệ
      })
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
  });

  it.todo('should change password');
  it.todo('should send forgot password email');
  it.todo('should reset password');
});
