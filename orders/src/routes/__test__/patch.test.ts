import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@rdgtickets/common';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  return ticket;
};

it('should cancel the order', async () => {
  // create ticket
  const ticket = await buildTicket();

  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const response = await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(200);

  expect(response.body.status).toEqual(OrderStatus.Cancelled);
});

it('should return an error if one user tries to cancel another user order', async () => {
  // create ticket
  const ticket = await buildTicket();

  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .expect(401);
});

it('should emit an event for order cancelled', async () => {
  const ticket = await buildTicket();

  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const response = await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
