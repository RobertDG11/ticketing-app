import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('should have a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('should return the ticket if the ticket is found', async () => {
  const price = 20;
  const title = 'New title';

  const newTicket = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    });

  const ticket = await request(app)
    .get(`/api/tickets/${newTicket.body.id}`)
    .send()
    .expect(200);

  expect(ticket.body.title).toEqual(title);
  expect(ticket.body.price).toEqual(price);
});
