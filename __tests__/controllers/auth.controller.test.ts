import type { NextFunction, Request, Response } from "express";

import { AuthController } from "@/controllers/auth.controller";

import { SessionService } from "@/services/session.service";
import { InstagramService } from "@/services/instagram.service";

import { mockMe } from "@tests/__mocks__/me.mock";

jest.mock("@/services/session.service");
jest.mock("@/services/instagram.service");

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
  return res as Response;
};

const buildNext = (): NextFunction => jest.fn();

describe("auth.controller", () => {
  describe("getUserId", () => {
    it("should return 200 with SUCCESS_GET_USER_ID code and auth data when successful", async () => {
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (InstagramService.getAuthId as jest.Mock).mockResolvedValue(mockMe);
      (SessionService.setUserId as jest.Mock).mockResolvedValue("OK");
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await AuthController.getUserId(req, res, next);

      expect(SessionService.getAccessToken).toHaveBeenCalled();
      expect(InstagramService.getAuthId).toHaveBeenCalledWith("test_token");
      expect(SessionService.setUserId).toHaveBeenCalledWith(mockMe.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: "SUCCESS_GET_USER_ID",
        message: "Successfully found the user id.",
        data: mockMe,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should forward the error to next when InstagramService.getAuthId throws", async () => {
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      const error: Error = new Error("API error");
      (InstagramService.getAuthId as jest.Mock).mockRejectedValue(error);
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await AuthController.getUserId(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should not call setUserId when getAuthId throws", async () => {
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (InstagramService.getAuthId as jest.Mock).mockRejectedValue(new Error("API error"));
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await AuthController.getUserId(req, res, next);

      expect(SessionService.setUserId).not.toHaveBeenCalled();
    });

    it("should forward the error to next when setUserId throws", async () => {
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (InstagramService.getAuthId as jest.Mock).mockResolvedValue(mockMe);
      const error: Error = new Error("Redis error");
      (SessionService.setUserId as jest.Mock).mockRejectedValue(error);
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await AuthController.getUserId(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should forward the error to next when getAccessToken throws", async () => {
      const error: Error = new Error("Redis down");
      (SessionService.getAccessToken as jest.Mock).mockRejectedValue(error);
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await AuthController.getUserId(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(InstagramService.getAuthId).not.toHaveBeenCalled();
    });
  });
});
