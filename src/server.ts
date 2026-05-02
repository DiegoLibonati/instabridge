import redisClient from "@/configs/redis.config";
import { envs } from "@/configs/env.config";

import app from "@/app";

const PORT = envs.PORT;
const ENV = envs.ENV;
const BASE_URL = envs.BASE_URL;

const onInit = (): void => {
  const baseUrl = ENV === "development" ? `http://localhost:${PORT}` : BASE_URL;
  console.log(`Server running in ${ENV} mode on ${baseUrl}`);
};

const start = async (): Promise<void> => {
  await redisClient.connect();
  app.listen(PORT, onInit);
};

void start();
