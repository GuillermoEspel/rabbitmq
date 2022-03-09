require("dotenv").config();
const amqp = require("amqplib");
const options = {
  clientProperties: {
    connection_name: "producer-service",
  },
};
const queue = "direct-queue";
const exchangeName = "direct-exchange";
const exchangeType = "direct";
const routingKey = "abc";
console.log({
  type: "PRODUCER",
  exchangeName,
  exchangeType,
  queue,
  routingKey,
});

async function producer() {
  const connection = await amqp.connect(process.env.AMQP_URL, options);
  const message = JSON.stringify({
    id: Math.random().toString(32).slice(2, 6),
    message: "Hello World",
  });
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, exchangeType);
  const sent = await channel.publish(exchangeName, routingKey, Buffer.from(message), {
    persistent: true,
  });
  if (sent) {
    console.log(`Sent message to "${queue}": ${message}`);
  } else {
    console.log(`Fails sending message to "${queue}": ${message}`);
  }
}
producer().catch((error) => {
  console.error(error);
  process.exit(1);
});
