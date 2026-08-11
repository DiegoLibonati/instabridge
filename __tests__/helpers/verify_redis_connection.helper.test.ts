import type { VerifyConnectionOptions } from "@/types/helpers";

import { verifyRedisConnection } from "@/helpers/verify_redis_connection.helper";

import redisClient from "@/configs/redis.config";
import { logger } from "@/configs/logger.config";

jest.mock("@/configs/redis.config", () => ({
  __esModule: true,
  default: { isReady: true, ping: jest.fn() },
}));

jest.mock("@/configs/logger.config", () => ({
  logger: { info: jest.fn(), warn: jest.fn() },
}));

interface MockRedisClient {
  isReady: boolean;
  ping: jest.Mock;
}

interface MockLogger {
  info: jest.Mock;
  warn: jest.Mock;
}

const mockRedisClient: MockRedisClient = redisClient as unknown as MockRedisClient;
const mockLogger: MockLogger = logger as unknown as MockLogger;

const fastOptions: VerifyConnectionOptions = { retries: 3, baseDelayMs: 1, maxDelayMs: 8000 };

describe("verify_redis_connection.helper", () => {
  describe("verifyRedisConnection", () => {
    beforeEach((): void => {
      mockRedisClient.isReady = true;
    });

    it("should return true and log info when redis responds on the first attempt", async () => {
      mockRedisClient.ping.mockResolvedValue("PONG");

      const result: boolean = await verifyRedisConnection();

      expect(result).toBe(true);
      expect(mockRedisClient.ping).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith({ attempt: 1 }, "Redis connection verified.");
      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it("should retry and return true when redis responds after a failed attempt", async () => {
      mockRedisClient.ping.mockRejectedValueOnce(new Error("boom")).mockResolvedValueOnce("PONG");

      const result: boolean = await verifyRedisConnection(fastOptions);

      expect(result).toBe(true);
      expect(mockRedisClient.ping).toHaveBeenCalledTimes(2);
      expect(mockLogger.info).toHaveBeenCalledWith({ attempt: 2 }, "Redis connection verified.");
    });

    it("should log a warn with attempt, retries and retryInMs between failed attempts", async () => {
      mockRedisClient.ping.mockRejectedValue(new Error("boom"));

      await verifyRedisConnection(fastOptions);

      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        1,
        { attempt: 1, retries: 3, retryInMs: 1 },
        "Redis is not reachable yet, retrying."
      );
      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        2,
        { attempt: 2, retries: 3, retryInMs: 2 },
        "Redis is not reachable yet, retrying."
      );
    });

    it("should return false and log a final warn when all retries are exhausted", async () => {
      mockRedisClient.ping.mockRejectedValue(new Error("boom"));

      const result: boolean = await verifyRedisConnection(fastOptions);

      expect(result).toBe(false);
      expect(mockRedisClient.ping).toHaveBeenCalledTimes(3);
      expect(mockLogger.warn).toHaveBeenCalledTimes(3);
      expect(mockLogger.warn).toHaveBeenLastCalledWith(
        { retries: 3 },
        expect.stringContaining("The server keeps running")
      );
    });

    it("should treat a not ready client as a failed attempt without pinging", async () => {
      mockRedisClient.isReady = false;

      const result: boolean = await verifyRedisConnection({ retries: 2, baseDelayMs: 1 });

      expect(result).toBe(false);
      expect(mockRedisClient.ping).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        1,
        { attempt: 1, retries: 2, retryInMs: 1 },
        "Redis is not reachable yet, retrying."
      );
    });

    it("should cap the retry delay at maxDelayMs", async () => {
      mockRedisClient.ping.mockRejectedValue(new Error("boom"));

      await verifyRedisConnection({ retries: 3, baseDelayMs: 4, maxDelayMs: 5 });

      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        1,
        { attempt: 1, retries: 3, retryInMs: 4 },
        "Redis is not reachable yet, retrying."
      );
      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        2,
        { attempt: 2, retries: 3, retryInMs: 5 },
        "Redis is not reachable yet, retrying."
      );
    });

    it("should not log info when redis never connects", async () => {
      mockRedisClient.ping.mockRejectedValue(new Error("boom"));

      await verifyRedisConnection(fastOptions);

      expect(mockLogger.info).not.toHaveBeenCalled();
    });
  });
});
