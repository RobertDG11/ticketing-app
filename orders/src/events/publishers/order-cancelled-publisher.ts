import { Publisher, Subjects, OrderCancelledEvent } from '@rdgtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
