import { Message } from 'node-nats-streaming';

import { Listener } from './base-listener';
import { TicketUpdatedEvent } from './ticket-updated-event';
import { Subjects } from './subjects';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  // subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    // TODO: Your code here

    // Herşey çok iyi gittikten sonra ack göndermek gerekiyor.
    msg.ack();
  }
}