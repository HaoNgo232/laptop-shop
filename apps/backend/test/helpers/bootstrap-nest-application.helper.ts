// import { INestApplication } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import { AppModule } from '../../src/app.module';
// import { TestingModule } from '@nestjs/testing';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { appCreate } from '../../src/app.create';

// export async function bootstrapNestApplication(): Promise<INestApplication> {
//   const moduleFixture: TestingModule = await Test.createTestingModule({
//     imports: [AppModule, ConfigModule],
//     providers: [ConfigService],
//   }).compile();

//   const app = moduleFixture.createNestApplication();
//   appCreate(app);
//   await app.init();

//   return app;
// }
