import type { NextFunction, Request, Response } from "express";

import { verifyIdUser } from "@/middlewares/verify_id_user.middleware";

import { SessionService } from "@/services/session.service";

jest.mock("@/services/session.service");

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

describe("verify_id_user.middleware", () => {
  describe("verifyIdUser", () => {
    it("should call next when user ID exists in Redis", async () => {
      (SessionService.getUserId as jest.Mock).mockResolvedValue("12345");
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await verifyIdUser(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should return 401 with NOT_FOUND_USER_ID when user ID is not in Redis", async () => {
      (SessionService.getUserId as jest.Mock).mockResolvedValue(null);
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await verifyIdUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        code: "NOT_FOUND_USER_ID",
        message: "User ID not found. Call GET /api/v1/auth/user_id first.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call getUserId exactly once", async () => {
      (SessionService.getUserId as jest.Mock).mockResolvedValue("12345");
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await verifyIdUser(req, res, next);

      expect(SessionService.getUserId).toHaveBeenCalledTimes(1);
    });
  });
});
