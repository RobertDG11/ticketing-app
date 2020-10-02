import { Publisher, Subjects, TicketUpdatedEvent } from '@rdgtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
