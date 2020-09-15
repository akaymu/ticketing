import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

import { TicketCreatedListener } from './events/ticket-created-listener';
import { TicketUpdatedListener } from './events/ticket-updated-listener';

console.clear();

const stan = nats.connect(
  'ticketing', //
  randomBytes(4).toString('hex'), // Client ID
  {
    url: 'http://localhost:4222'
  }
);

stan.on('connect', () => {
  console.log('Listener connected on NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
  new TicketUpdatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());