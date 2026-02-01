import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 8000,
  IP_ADD: process.env.IP_ADD,

  JWT_SECRET: process.env.JWT_SECRET || "your_secret_key",

  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/YoutubeRN",

  KAFKA_BROKER: `${process.env.IP_ADD}:9092`,
  KAFKA_TOPIC: "video-uploads",

  LOCALSTACK_URL: `http://${process.env.IP_ADD}:4566`,

  S3_U_BUCKET: "untranscoded",
  S3_I_BUCKET: "thumbnail",
  S3_V_BUCKET: "video-abr",
  S3_X_BUCKET: "profiles",
};
