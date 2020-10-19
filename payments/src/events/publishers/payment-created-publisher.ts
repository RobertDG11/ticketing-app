import { PaymentCreatedEvent, Publisher, Subjects } from '@rdgtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}