import { S3 } from "aws-sdk";
import config from "~/config";

export const s3 = new S3({
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

export default s3;
