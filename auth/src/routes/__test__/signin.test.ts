import request from 'supertest';
import { app } from '../../app';

it('should respond with a cookie when giving valid credentials', async () => {
  await global.signup();

  const response = await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});

it('should return a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'invalid_email',
      password: 'password',
    })
    .expect(400);
});

it('should return a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '',
    })
    .expect(400);
});

it('should fail when an email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(400);
});

it('should fail when an incorrect password is supplied', async () => {
  await global.signup();

  await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'bad_password' })
    .expect(400);
});
