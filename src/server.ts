import redisClient from "@/configs/redis.config";
import { envs } from "@/configs/env.config";
import { logger } from "@/configs/logger.config";

import app from "@/app";

const PORT = envs.PORT;
const ENV = envs.ENV;
const BASE_URL = envs.BASE_URL;

let server: ReturnType<typeof app.listen>;

const onInit = (): void => {
  const baseUrl = ENV === "development" ? `http://localhost:${PORT}` : BASE_URL;
  logger.info({ env: ENV, baseUrl }, `Server running in ${ENV} mode on ${baseUrl}`);
};

const shutdown = (): void => {
  server.close((err?: Error) => {
    process.exit(err ? 1 : 0);
  });

  setTimeout(() => {
    process.exit(1);
  }, 10000).unref();
};

const start = async (): Promise<void> => {
  await redisClient.connect();
  server = app.listen(PORT, onInit);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

void start();
