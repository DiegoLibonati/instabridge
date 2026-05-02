import type { Request, Response } from "express";

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

describe("auth.controller", () => {
  describe("getUserId", () => {
    it("should return 200 with SUCCESS_GET_USER_ID code and auth data when successful", async () => {
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (InstagramService.getAuthId as jest.Mock).mockResolvedValue(mockMe);
      (SessionService.setUserId as jest.Mock).mockResolvedValue("OK");
      const req: Request = buildReq();
      const res: Response = buildRes();

      await AuthController.getUserId(req, res);

      expect(SessionService.getAccessToken).toHaveBeenCalled();
      expect(InstagramService.getAuthId).toHaveBeenCalledWith("test_token");
      expect(SessionService.setUserId).toHaveBeenCalledWith(mockMe.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: "SUCCESS_GET_USER_ID",
        message: "Successfully found the user id.",
        data: mockMe,
      });
    });

    it("should return 500 with ERROR_GENERIC when InstagramService.getAuthId throws", async () => {
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (InstagramService.getAuthId as jest.Mock).mockRejectedValue(new Error("API error"));
      const req: Request = buildReq();
      const res: Response = buildRes();

      await AuthController.getUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: "ERROR_GENERIC",
        message: "Something went wrong!",
      });
    });

    it("should not call setUserId when getAuthId throws", async () => {
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (InstagramService.getAuthId as jest.Mock).mockRejectedValue(new Error("API error"));
      const req: Request = buildReq();
      const res: Response = buildRes();

      await AuthController.getUserId(req, res);

      expect(SessionService.setUserId).not.toHaveBeenCalled();
    });

    it("should return 500 when setUserId throws", async () => {
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (InstagramService.getAuthId as jest.Mock).mockResolvedValue(mockMe);
      (SessionService.setUserId as jest.Mock).mockRejectedValue(new Error("Redis error"));
      const req: Request = buildReq();
      const res: Response = buildRes();

      await AuthController.getUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
