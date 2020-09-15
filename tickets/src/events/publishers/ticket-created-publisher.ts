import { Subjects, Publisher, TicketCreatedEvent } from "@mmatickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
