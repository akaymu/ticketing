import request from 'supertest';

import { app } from '../../app';

const createTicket = (ticket: { title: string; price: number; }) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send(ticket);
};

it('can fetch a list of tickets', async () => {
  const ticketsArray = [
    { title: 'Ticket #1', price: 10 },
    { title: 'Ticket #2', price: 20 },
    { title: 'Ticket #3', price: 30 }
  ];

  for (let i = 0; i < ticketsArray.length; i++) {
    await createTicket(ticketsArray[i]);
  }

  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200);

  expect(response.body.length).toEqual(ticketsArray.length);

});