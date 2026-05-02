import type { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "@/middlewares/verify_access_token.middleware";

import { SessionService } from "@/services/session.service";

jest.mock("@/services/session.service");
jest.mock("@/configs/env.config", () => ({
  envs: {
    get INSTAGRAM_USER_ACCESS_TOKEN(): string {
      return process.env.INSTAGRAM_USER_ACCESS_TOKEN ?? "";
    },
    PORT: 5050,
    API_VERSION: "0.0.1",
    ENV: "test",
    BASE_URL: "",
    INSTAGRAM_API: "https://graph.instagram.com",
    INSTAGRAM_API_VERSION: "v19.0",
    INSTAGRAM_SECRET_CLIENT: "YOUR_SECRET_CLIENT",
    REDIS_HOST: "localhost",
    REDIS_PORT: "6379",
  },
}));

const buildReq = (): Request =>
  ({
    params: {},
    query: {},
    body: {},
  }) as Request;

const buildRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res as Response;
};

const buildNext = (): NextFunction => jest.fn();

describe("verify_access_token.middleware", () => {
  beforeEach((): void => {
    process.env.INSTAGRAM_USER_ACCESS_TOKEN = "YOUR_ACCESS_TOKEN";
  });

  describe("verifyAccessToken", () => {
    it("should call next without arguments when token is in env and already in Redis", async () => {
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("existing_token");
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await verifyAccessToken(req, res, next);

      expect(SessionService.setAccessToken).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should store token in Redis and call next when token is not in Redis", async () => {
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue(null);
      (SessionService.setAccessToken as jest.Mock).mockResolvedValue("OK");
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await verifyAccessToken(req, res, next);

      expect(SessionService.setAccessToken).toHaveBeenCalledWith("YOUR_ACCESS_TOKEN");
      expect(next).toHaveBeenCalledWith();
    });

    it("should return 401 with NOT_FOUND_ACCESS_TOKEN when env var is not set", async () => {
      process.env.INSTAGRAM_USER_ACCESS_TOKEN = "";
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await verifyAccessToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        code: "NOT_FOUND_ACCESS_TOKEN",
        message: "Access token not found. Set INSTAGRAM_USER_ACCESS_TOKEN in your environment.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should not call SessionService when env var is not set", async () => {
      process.env.INSTAGRAM_USER_ACCESS_TOKEN = "";
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await verifyAccessToken(req, res, next);

      expect(SessionService.getAccessToken).not.toHaveBeenCalled();
      expect(SessionService.setAccessToken).not.toHaveBeenCalled();
    });
  });
});
