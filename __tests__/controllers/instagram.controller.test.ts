import type { NextFunction, Request, Response } from "express";

import { InstagramController } from "@/controllers/instagram.controller";

import { SessionService } from "@/services/session.service";
import { InstagramService } from "@/services/instagram.service";

import { mockProfile } from "@tests/__mocks__/profile.mock";

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

describe("instagram.controller", () => {
  describe("alive", () => {
    it("should return 200 with author and API version", () => {
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      InstagramController.alive(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ author: "Diego Libonati" }));
      expect(next).not.toHaveBeenCalled();
    });

    it("should include the version field in the response", () => {
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      InstagramController.alive(req, res, next);

      const body: unknown = (res.json as jest.Mock).mock.calls[0]?.[0];
      expect(body).toHaveProperty("version");
    });
  });

  describe("userProfile", () => {
    it("should return 200 with SUCCESS_GET_USER_PROFILE code and profile data when successful", async () => {
      (SessionService.getUserId as jest.Mock).mockResolvedValue("12345");
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (InstagramService.getProfile as jest.Mock).mockResolvedValue(mockProfile);
      (SessionService.setUser as jest.Mock).mockResolvedValue("OK");
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await InstagramController.userProfile(req, res, next);

      expect(InstagramService.getProfile).toHaveBeenCalledWith("test_token", "12345");
      expect(SessionService.setUser).toHaveBeenCalledWith({
        id: mockProfile.id,
        username: mockProfile.username,
        account_type: mockProfile.account_type,
        media_count: mockProfile.media_count,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: "SUCCESS_GET_USER_PROFILE",
        message: "Successfully found user profile.",
        data: mockProfile,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should forward the error to next when InstagramService.getProfile throws", async () => {
      (SessionService.getUserId as jest.Mock).mockResolvedValue("12345");
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      const error: Error = new Error("API error");
      (InstagramService.getProfile as jest.Mock).mockRejectedValue(error);
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await InstagramController.userProfile(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should not call setUser when getProfile throws", async () => {
      (SessionService.getUserId as jest.Mock).mockResolvedValue("12345");
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (InstagramService.getProfile as jest.Mock).mockRejectedValue(new Error("API error"));
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await InstagramController.userProfile(req, res, next);

      expect(SessionService.setUser).not.toHaveBeenCalled();
    });

    it("should forward the error to next when setUser throws", async () => {
      (SessionService.getUserId as jest.Mock).mockResolvedValue("12345");
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (InstagramService.getProfile as jest.Mock).mockResolvedValue(mockProfile);
      const error: Error = new Error("Redis error");
      (SessionService.setUser as jest.Mock).mockRejectedValue(error);
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await InstagramController.userProfile(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
