import { connect } from 'nats';

const connectNats = async () => {
  try {
    const nc = await connect({ servers: 'nats://localhost:4222' });
    console.log('Connected to NATS');
    return nc;
  } catch (error) {
    console.error('Failed to connect to NATS:', error);
    throw error;
  }
};

const notifyCompletion = (nc, requestId) => {
  nc.publish('image-processing.completed', JSON.stringify({ requestId }));
};

export { connectNats, notifyCompletion };
