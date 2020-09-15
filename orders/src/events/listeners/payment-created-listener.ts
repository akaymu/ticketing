import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PaymentCreatedEvent, OrderStatus } from '@mmatickets/common';

import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { orderId } = data;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();

    // Burada order upated gibi bir publishing yapmadık
    // 1. order tablosunun eşi başka bir serviste mevcut değil
    // 2. OrderStatus.Completed olduktan sonra başka bir servisin
    //    bu orderda değişiklik yapmasını beklemiyoruz.

    msg.ack();
  }
}