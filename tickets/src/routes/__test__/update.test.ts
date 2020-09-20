import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

const getId = () => {
  return new mongoose.Types.ObjectId().toHexString();
};

it('should return a 404 if the ticket is not found', async () => {
  const id = getId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Edited title',
      price: 20.5,
    })
    .expect(404);
});

it('should return a 401 if the user is not authenticated', async () => {
  const id = getId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Edited title',
      price: 20.5,
    })
    .expect(401);
});

it('should return a 401 if the user does not own the title', async () => {
  const newTicket = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'New title',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${newTicket.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Edited title',
      price: 20.5,
    })
    .expect(401);
});

it('should return a 400 if the user provides an invalid price or title', async () => {
  const cookie = global.signin();
  const newTicket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'New title',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${newTicket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20.5,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${newTicket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Edited title',
      price: -20.5,
    })
    .expect(400);
});

it('should update the ticket provided value inputs', async () => {
  const cookie = global.signin();
  const newTicket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'New title',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${newTicket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Edited title',
      price: 20.5,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${newTicket.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('Edited title');
  expect(ticketResponse.body.price).toEqual(20.5);
});
