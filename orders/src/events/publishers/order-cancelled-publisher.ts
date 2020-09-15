import { Subjects, Publisher, OrderCancelledEvent } from "@mmatickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
