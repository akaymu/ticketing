import { Subjects, Publisher, ExpirationCompleteEvent } from "@mmatickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
