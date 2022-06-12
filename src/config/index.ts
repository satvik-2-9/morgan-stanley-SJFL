import { config as dotenvconfig } from "dotenv";

dotenvconfig();

export const config = {
  PORT: process.env.PORT || 5000,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || "",
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || "",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
  JWT_SECRET: process.env.JWT_SECRET || "thisisaransdomstring",
};

export default config;
