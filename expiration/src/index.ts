import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

// Start the application
const start = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  if (!process.env.REDIS_HOST) {
    throw new Error('REDIS_HOST must be defined');
  }

  // NATS Connection
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    console.log('NATS Client id is ', process.env.NATS_CLIENT_ID);

    natsWrapper.client.on('close', () => {
      console.log('NATS Connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    // Listen NATS Streaming Server
    new OrderCreatedListener(natsWrapper.client).listen();

  } catch (err) {
    console.error(err);
  }
};

start();