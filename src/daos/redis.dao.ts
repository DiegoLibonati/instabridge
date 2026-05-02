import redisClient from "@/configs/redis.config";

export const RedisDAO = {
  getValue: async (key: string): Promise<string | null> => await redisClient.get(key),
  setValue: async (key: string, value: string): Promise<string | null> =>
    await redisClient.set(key, value),
  deleteKey: async (key: string): Promise<number> => await redisClient.del(key),
};
