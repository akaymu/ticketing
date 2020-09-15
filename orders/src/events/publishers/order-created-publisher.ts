import { Subjects, Publisher, OrderCreatedEvent } from "@mmatickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
