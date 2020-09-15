import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Order } from '../../models/order';
import { OrderStatus } from '@mmatickets/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

// Remove while testing with real stripe api test suite
// Also change src/__mocks__/stripe.ts to src/__mocks__/stripe.ts.old
// jest.mock('../../stripe');

it('returns a 404 when purchasing an order that does not exist', async () => {
  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookie())
    .send({
      token: 'sometoken',
      orderId: mongoose.Types.ObjectId().toHexString()
    });

  expect(response.status).toEqual(404);
});

it('returns 401 when purchasing an order that does not belong to the user ', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 10,
    status: OrderStatus.Created
  });
  await order.save();

  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookie())
    .send({
      token: 'sometoken',
      orderId: order.id
    });
  expect(response.status).toEqual(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId,
    price: 10,
    status: OrderStatus.Cancelled
  });
  await order.save();

  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookie(userId))
    .send({
      token: 'sometoken',
      orderId: order.id
    });
  expect(response.status).toEqual(400);

});

it('returns a 204 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId,
    price,
    status: OrderStatus.Created
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookie(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(charge => {
    return charge.amount === price * 100;
  });
  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id
  });
  expect(payment).not.toBeNull();

  // This lines are about Mock for Stripe api  
  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  // expect(chargeOptions.source).toEqual('tok_visa');
  // expect(chargeOptions.amount).toEqual(order.price * 100);
  // expect(chargeOptions.currency).toEqual('usd');

});