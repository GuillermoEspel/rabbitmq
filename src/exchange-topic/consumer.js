require("dotenv").config();
const amqp = require("amqplib");
const options = {
  clientProperties: {
    connection_name: "consumer-service",
  },
};
const queue = process.env.QUEUE || "topic-queue";
const exchangeName = "topic-exchange";
const exchangeType = "topic";
const pattern = process.env.PATTERN || "log.#";
console.log({
  type: "CONSUMER",
  exchangeName,
  exchangeType,
  queue,
  pattern,
});

async function consumer() {
  const connection = await amqp.connect(process.env.AMQP_URL, options);
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });
  await channel.assertExchange(exchangeName, exchangeType);
  await channel.bindQueue(queue, exchangeName, pattern);
  await channel.prefetch(1);
  channel.consume(queue, (message) => {
    const content = JSON.parse(message.content.toString());
    console.log(`Receives message from "${queue}" queue`);
    console.log(content);
    channel.ack(message);
  });
}
consumer().catch((error) => {
  console.error(error);
  process.exit(1);
});
