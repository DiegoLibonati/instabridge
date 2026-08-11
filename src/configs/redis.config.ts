import * as redis from "redis";

import { envs } from "@/configs/env.config";
import { logger } from "@/configs/logger.config";

const REDIS_HOST = envs.REDIS_HOST;
const REDIS_PORT = envs.REDIS_PORT;

const redisClient = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

let isConnectionDown = false;

redisClient.on("error", function (err: unknown) {
  if (isConnectionDown) return;

  isConnectionDown = true;

  logger.warn(
    { err, host: REDIS_HOST, port: REDIS_PORT },
    "Redis connection error. Further connection errors are silenced until the connection is restored."
  );
});

redisClient.on("ready", function () {
  if (!isConnectionDown) return;

  isConnectionDown = false;

  logger.info({ host: REDIS_HOST, port: REDIS_PORT }, "Redis connection restored.");
});

export default redisClient;
