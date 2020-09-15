import { Subjects, Publisher, PaymentCreatedEvent } from "@mmatickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
