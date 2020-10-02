import { TicketCreatedEvent, Publisher, Subjects } from '@rdgtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
