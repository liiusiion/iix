import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { appOptions, setupApp } from './../src/app.setup.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(appOptions);
    setupApp(app);
    await app.init();
  });

  it('/api/we-good (GET)', () => {
    return request(app.getHttpServer()).get('/api/we-good').expect(200).expect('We good.');
  });

  afterEach(async () => {
    await app.close();
  });
});
