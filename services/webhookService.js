import nats from 'nats';

const connectNats = () => {
  const nc = nats.connect();
  nc.on('connect', () => {
    console.log('Connected to NATS');
  });
  return nc;
};

const notifyCompletion = (nc, requestId) => {
  nc.publish('image-processing.completed', JSON.stringify({ requestId }));
};

export { connectNats, notifyCompletion };
