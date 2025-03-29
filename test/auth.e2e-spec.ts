import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('it handles a signup request', () => {
    const body = {
      email: 'John Doe',
      password: 'johnDoe2@gmail.com',
      name: 'johndoe123',
    };
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(body)
      .expect(201)
      .then((response) => {
        expect(response.body.id).toBeDefined();
        expect(response.body.email).toBeDefined();
        expect(response.body.name).toBeDefined();
        expect(response.body.password).not.toBeDefined();
      });
  });
});
