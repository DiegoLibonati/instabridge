import type { VerifyConnectionOptions } from "@/types/helpers";

import redisClient from "@/configs/redis.config";
import { logger } from "@/configs/logger.config";

export const verifyRedisConnection = async (
  options: VerifyConnectionOptions = {}
): Promise<boolean> => {
  const { retries = 5, baseDelayMs = 500, maxDelayMs = 8000 } = options;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (!redisClient.isReady) throw new Error("Redis client is not ready yet");

      await redisClient.ping();

      logger.info({ attempt }, "Redis connection verified.");

      return true;
    } catch {
      if (attempt < retries) {
        const retryInMs = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);

        logger.warn({ attempt, retries, retryInMs }, "Redis is not reachable yet, retrying.");

        await new Promise((resolveWait) => setTimeout(resolveWait, retryInMs));
      }
    }
  }

  logger.warn(
    { retries },
    "Redis is unreachable after all retries. The server keeps running and the redis client reconnects on its own once the service is back. If you are running without Docker, verify that Redis is up and that REDIS_HOST/REDIS_PORT in your .env point to it (e.g. REDIS_HOST=localhost instead of the compose hostname)."
  );

  return false;
};
