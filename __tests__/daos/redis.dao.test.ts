import redisClient from "@/configs/redis.config";

import { RedisDAO } from "@/daos/redis.dao";

jest.mock("@/configs/redis.config", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  },
}));

describe("redis.dao", () => {
  describe("getValue", () => {
    it("should return the value when the key exists", async () => {
      (redisClient.get as unknown as jest.Mock).mockResolvedValue("stored_value");

      const result: string | null = await RedisDAO.getValue("someKey");

      expect(redisClient.get).toHaveBeenCalledWith("someKey");
      expect(result).toBe("stored_value");
    });

    it("should return null when the key does not exist", async () => {
      (redisClient.get as unknown as jest.Mock).mockResolvedValue(null);

      const result: string | null = await RedisDAO.getValue("missingKey");

      expect(redisClient.get).toHaveBeenCalledWith("missingKey");
      expect(result).toBeNull();
    });
  });

  describe("setValue", () => {
    it("should set the key with the given value and return OK", async () => {
      (redisClient.set as unknown as jest.Mock).mockResolvedValue("OK");

      const result: string | null = await RedisDAO.setValue("myKey", "myValue");

      expect(redisClient.set).toHaveBeenCalledWith("myKey", "myValue");
      expect(result).toBe("OK");
    });

    it("should return null when Redis returns null", async () => {
      (redisClient.set as unknown as jest.Mock).mockResolvedValue(null);

      const result: string | null = await RedisDAO.setValue("myKey", "myValue");

      expect(result).toBeNull();
    });
  });

  describe("deleteKey", () => {
    it("should delete the key and return the number of deleted keys", async () => {
      (redisClient.del as unknown as jest.Mock).mockResolvedValue(1);

      const result: number = await RedisDAO.deleteKey("myKey");

      expect(redisClient.del).toHaveBeenCalledWith("myKey");
      expect(result).toBe(1);
    });

    it("should return 0 when the key does not exist", async () => {
      (redisClient.del as unknown as jest.Mock).mockResolvedValue(0);

      const result: number = await RedisDAO.deleteKey("nonexistent");

      expect(result).toBe(0);
    });
  });
});
