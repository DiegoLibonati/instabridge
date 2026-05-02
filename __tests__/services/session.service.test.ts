import { RedisDAO } from "@/daos/redis.dao";

import { SessionService } from "@/services/session.service";

import { mockUser } from "@tests/__mocks__/user.mock";

jest.mock("@/daos/redis.dao");

describe("session.service", () => {
  describe("getUserId", () => {
    it("should return the user ID from Redis using the idUser key", async () => {
      (RedisDAO.getValue as jest.Mock).mockResolvedValue("12345");

      const result: string | null = await SessionService.getUserId();

      expect(RedisDAO.getValue).toHaveBeenCalledWith("idUser");
      expect(result).toBe("12345");
    });

    it("should return null when user ID is not stored", async () => {
      (RedisDAO.getValue as jest.Mock).mockResolvedValue(null);

      const result: string | null = await SessionService.getUserId();

      expect(result).toBeNull();
    });
  });

  describe("getAccessToken", () => {
    it("should return the access token from Redis using the access_token key", async () => {
      (RedisDAO.getValue as jest.Mock).mockResolvedValue("my_token");

      const result: string | null = await SessionService.getAccessToken();

      expect(RedisDAO.getValue).toHaveBeenCalledWith("access_token");
      expect(result).toBe("my_token");
    });

    it("should return null when access token is not stored", async () => {
      (RedisDAO.getValue as jest.Mock).mockResolvedValue(null);

      const result: string | null = await SessionService.getAccessToken();

      expect(result).toBeNull();
    });
  });

  describe("getUser", () => {
    it("should return the user JSON string from Redis using the user key", async () => {
      const mockUserJson: string = JSON.stringify(mockUser);
      (RedisDAO.getValue as jest.Mock).mockResolvedValue(mockUserJson);

      const result: string | null = await SessionService.getUser();

      expect(RedisDAO.getValue).toHaveBeenCalledWith("user");
      expect(result).toBe(mockUserJson);
    });
  });

  describe("setUserId", () => {
    it("should store the user ID under the idUser key and return OK", async () => {
      (RedisDAO.setValue as jest.Mock).mockResolvedValue("OK");

      const result: string | null = await SessionService.setUserId("12345");

      expect(RedisDAO.setValue).toHaveBeenCalledWith("idUser", "12345");
      expect(result).toBe("OK");
    });
  });

  describe("setAccessToken", () => {
    it("should store the access token under the access_token key and return OK", async () => {
      (RedisDAO.setValue as jest.Mock).mockResolvedValue("OK");

      const result: string | null = await SessionService.setAccessToken("my_token");

      expect(RedisDAO.setValue).toHaveBeenCalledWith("access_token", "my_token");
      expect(result).toBe("OK");
    });
  });

  describe("setUser", () => {
    it("should store the user as a JSON string under the user key", async () => {
      (RedisDAO.setValue as jest.Mock).mockResolvedValue("OK");

      const result: string | null = await SessionService.setUser(mockUser);

      expect(RedisDAO.setValue).toHaveBeenCalledWith("user", JSON.stringify(mockUser));
      expect(result).toBe("OK");
    });
  });

  describe("deleteUserId", () => {
    it("should delete the idUser key and return the deletion count", async () => {
      (RedisDAO.deleteKey as jest.Mock).mockResolvedValue(1);

      const result: number = await SessionService.deleteUserId();

      expect(RedisDAO.deleteKey).toHaveBeenCalledWith("idUser");
      expect(result).toBe(1);
    });

    it("should return 0 when the key does not exist", async () => {
      (RedisDAO.deleteKey as jest.Mock).mockResolvedValue(0);

      const result: number = await SessionService.deleteUserId();

      expect(result).toBe(0);
    });
  });
});
