import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { config } from "../config/index.js";

export const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: config.LOCALSTACK_URL,
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
  forcePathStyle: true, // needed for LocalStack
});

export const uploadToS3 = async (
  buffer,
  bucketName,
  fileName,
  isImg = false,
  exp = 6000
) => {
  try {
    // create bucket if not exists
    await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
    };

    if (isImg) {
      params.CacheControl = `max-age=${exp}`;
    }

    await s3Client.send(new PutObjectCommand(params));

    console.log(`File uploaded to ${bucketName}/${fileName}`);
    return true;
  } catch (err) {
    console.error("S3 upload error:", err.message);
    return false;
  }
};
