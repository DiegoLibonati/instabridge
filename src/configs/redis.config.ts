import * as redis from "redis";

import { envs } from "@/configs/env.config";

const REDIS_HOST = envs.REDIS_HOST;
const REDIS_PORT = envs.REDIS_PORT;

const redisClient = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

redisClient.on("error", function (error) {
  console.error("Redis connection error:", error);
});

export default redisClient;
