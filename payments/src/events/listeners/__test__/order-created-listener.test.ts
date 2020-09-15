import { OrderCreatedEvent, OrderStatus } from '@mmatickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: mongoose.Types.ObjectId().toHexString(),
    expiresAt: (new Date()).toISOString(),
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
      price: 20
    }
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg };

};


it('replicates the order info', async () => {
  // call setup 
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created!
  const order = await Order.findById(data.id);

  expect(order).toBeDefined();
  expect(order!.id).toEqual(data.id);
  expect(order!.price).toEqual(data.ticket.price);
  expect(order!.version).toEqual(data.version);
  expect(order!.userId).toEqual(data.userId);
  expect(order!.status).toEqual(data.status);
});

it('ack the message', async () => {
  // call setup
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  //write assertions to make sure ack function is called.
  expect(msg.ack).toHaveBeenCalled();
});

// it('publishes a ticket updated event', async () => {
//   // call setup
//   const { listener, data, msg } = await setup();

//   // call the onMessage function with the data object + message object
//   await listener.onMessage(data, msg);

//   expect(natsWrapper.client.publish).toHaveBeenCalled();

//   const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
//   expect(data.id).toEqual(ticketUpdatedData.orderId);
// });