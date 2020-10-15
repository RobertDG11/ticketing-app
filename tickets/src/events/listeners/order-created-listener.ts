import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@rdgtickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { ticket, id } = data;
    // Find the ticket that the order is reserving
    const fetchedTicket = await Ticket.findById(ticket.id);

    // If no ticket, throw error
    if (!fetchedTicket) {
      throw new Error('Ticket not found');
    }

    // Mark the ticket as being reserved by setting its orderId property
    fetchedTicket.set({
      orderId: id,
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
