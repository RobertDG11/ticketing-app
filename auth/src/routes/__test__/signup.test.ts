import request from 'supertest';
import { app } from '../../app';

it('should return a 201 on successful signup', async () => {
  await global.signup();
});

it('should return a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'invalid_email',
      password: 'password',
    })
    .expect(400);
});

it('should return a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'p',
    })
    .expect(400);
});

it('should return a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com' })
    .expect(400);
  return request(app)
    .post('/api/users/signup')
    .send({ password: 'password' })
    .expect(400);
});

it('should disallow duplicate emails', async () => {
  await global.signup();

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('should set a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
