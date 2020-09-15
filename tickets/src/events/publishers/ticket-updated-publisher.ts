import { Subjects, Publisher, TicketUpdatedEvent } from "@mmatickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
