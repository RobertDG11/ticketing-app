import request from 'supertest';
import { app } from '../../app';

const createTicket = (title: string, post: number) => {
  return request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title: title,
    price: post,
  });
};

it('should fetch a list of tickets', async () => {
  await createTicket('Ticket1', 20);
  await createTicket('Ticket2', 30);
  await createTicket('Ticket3', 35.3);

  const tickets = await request(app).get(`/api/tickets`).send().expect(200);

  expect(tickets.body.length).toEqual(3);
});
