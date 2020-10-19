import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
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

it('should fetch orders for a particular user', async () => {
  // create 3 tickets
  const tickeOne = await buildTicket();
  const tickeTwo = await buildTicket();
  const tickeThree = await buildTicket();

  const userOne = global.signin();
  const userTwo = global.signin();
  // create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({
      ticketId: tickeOne.id,
    })
    .expect(201);
  // create two orders as User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      ticketId: tickeTwo.id,
    })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      ticketId: tickeThree.id,
    })
    .expect(201);
  // make request to get orders for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
});
