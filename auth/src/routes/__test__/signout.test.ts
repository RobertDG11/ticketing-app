import request from 'supertest';
import { app } from '../../app';

it('should clear the cookie after signing out', async () => {
  await global.signup();

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
