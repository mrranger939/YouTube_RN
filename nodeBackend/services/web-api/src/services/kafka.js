import { Kafka } from "kafkajs";
import { config } from "../config/index.js";

const kafka = new Kafka({
  clientId: "web-api",
  brokers: [config.KAFKA_BROKER],
});

export const producer = kafka.producer();

export const connectKafka = async () => {
  try {
    await producer.connect();
    console.log("Kafka producer connected");
  } catch (err) {
    console.error("Kafka connection failed:", err.message);
  }
};

export const sendVideoMessage = async (filename) => {
  try {
    await producer.send({
      topic: config.KAFKA_TOPIC,
      messages: [{ value: JSON.stringify({ filename }) }],
    });
    console.log("Kafka message sent:", filename);
    return true;
  } catch (err) {
    console.error("Kafka send error:", err.message);
    return false;
  }
};
