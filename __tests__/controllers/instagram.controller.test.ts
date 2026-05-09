import type { Request, Response } from "express";

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

describe("instagram.controller", () => {
  describe("alive", () => {
    it("should return 200 with author and API version", () => {
      const req: Request = buildReq();
      const res: Response = buildRes();

      InstagramController.alive(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ author: "Diego Libonati" }));
    });

    it("should include the version field in the response", () => {
      const req: Request = buildReq();
      const res: Response = buildRes();

      InstagramController.alive(req, res);

      const body: unknown = (res.json as jest.Mock).mock.calls[0]?.[0];
      expect(body).toHaveProperty("version");
    });
  });

  describe("userProfile", () => {
    beforeEach(() =>
      jest.spyOn(console, "error").mockImplementation(() => {
        // Empty fn
      })
    );

    it("should return 200 with SUCCESS_GET_USER_PROFILE code and profile data when successful", async () => {
      (SessionService.getUserId as jest.Mock).mockResolvedValue("12345");
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (InstagramService.getProfile as jest.Mock).mockResolvedValue(mockProfile);
      (SessionService.setUser as jest.Mock).mockResolvedValue("OK");
      const req: Request = buildReq();
      const res: Response = buildRes();

      await InstagramController.userProfile(req, res);

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
    });

    it("should return 500 with ERROR_GENERIC when InstagramService.getProfile throws", async () => {
      (SessionService.getUserId as jest.Mock).mockResolvedValue("12345");
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (InstagramService.getProfile as jest.Mock).mockRejectedValue(new Error("API error"));
      const req: Request = buildReq();
      const res: Response = buildRes();

      await InstagramController.userProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: "ERROR_GENERIC",
        message: "Something went wrong!",
      });
    });

    it("should not call setUser when getProfile throws", async () => {
      (SessionService.getUserId as jest.Mock).mockResolvedValue("12345");
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (InstagramService.getProfile as jest.Mock).mockRejectedValue(new Error("API error"));
      const req: Request = buildReq();
      const res: Response = buildRes();

      await InstagramController.userProfile(req, res);

      expect(SessionService.setUser).not.toHaveBeenCalled();
    });

    it("should return 500 when setUser throws", async () => {
      (SessionService.getUserId as jest.Mock).mockResolvedValue("12345");
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (InstagramService.getProfile as jest.Mock).mockResolvedValue(mockProfile);
      (SessionService.setUser as jest.Mock).mockRejectedValue(new Error("Redis error"));
      const req: Request = buildReq();
      const res: Response = buildRes();

      await InstagramController.userProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
