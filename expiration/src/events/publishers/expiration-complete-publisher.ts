import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@rdgtickets/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
