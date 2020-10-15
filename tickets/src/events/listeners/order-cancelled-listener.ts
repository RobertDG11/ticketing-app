import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCancelledEvent } from '@rdgtickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { ticket } = data;
    // Find the ticket that the order is reserving
    const fetchedTicket = await Ticket.findById(ticket.id);

    // If no ticket, throw error
    if (!fetchedTicket) {
      throw new Error('Ticket not found');
    }

    // Mark the ticket as being not reserved by setting its orderId property to undefined
    fetchedTicket.set({
      orderId: undefined,
    });

    // Save the ticket
    await fetchedTicket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: fetchedTicket.id,
      price: fetchedTicket.price,
      title: fetchedTicket.title,
      userId: fetchedTicket.userId,
      orderId: fetchedTicket.orderId,
      version: fetchedTicket.version,
    });

    // Ack message
    msg.ack();
  }
}
