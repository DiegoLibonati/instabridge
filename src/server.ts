import redisClient from "@/configs/redis.config";
import { envs, loadedEnvFiles } from "@/configs/env.config";
import { logger } from "@/configs/logger.config";

import { verifyRedisConnection } from "@/helpers/verify_redis_connection.helper";

import app from "@/app";

const PORT = envs.PORT;
const ENV = envs.ENV;
const BASE_URL = envs.BASE_URL;

let server: ReturnType<typeof app.listen>;

const onInit = (): void => {
  const baseUrl = ENV === "development" ? `http://localhost:${PORT}` : BASE_URL;
  logger.info(
    { env: ENV, baseUrl, envFiles: loadedEnvFiles },
    `Server running in ${ENV} mode on ${baseUrl}`
  );

  void verifyRedisConnection();
};

const shutdown = (): void => {
  server.close((err?: Error) => {
    process.exit(err ? 1 : 0);
  });

  setTimeout(() => {
    process.exit(1);
  }, 10000).unref();
};

const start = (): void => {
  redisClient.connect().catch((err: unknown) => {
    logger.warn({ err }, "Initial Redis connection failed.");
  });

  server = app.listen(PORT, onInit);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

start();
