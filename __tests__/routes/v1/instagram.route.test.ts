import request from "supertest";

import type { Response } from "supertest";
import type { Profile } from "@/types/app";
import type { ResponseDirect } from "@/types/responses";

import app from "@/app";

import { SessionService } from "@/services/session.service";
import { InstagramService } from "@/services/instagram.service";

jest.mock("@/services/session.service");
jest.mock("@/services/instagram.service");

const baseUrl = "/api/v1/instagram";

const mockProfileData: ResponseDirect<Profile> = {
  id: "12345",
  username: "testuser",
  account_type: "PERSONAL",
  media_count: 10,
};

describe("instagram.route", () => {
  describe(`GET ${baseUrl}/alive`, () => {
    it("should return 200 with author and version when middlewares pass", async () => {
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (SessionService.getUserId as jest.Mock).mockResolvedValue("12345");

      const res: Response = await request(app).get(`${baseUrl}/alive`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ author: "Diego Libonati" });
      expect(res.body).toHaveProperty("version");
    });

    it("should return 401 with NOT_FOUND_USER_ID when user ID is not in Redis", async () => {
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (SessionService.getUserId as jest.Mock).mockResolvedValue(null);

      const res: Response = await request(app).get(`${baseUrl}/alive`);

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({ code: "NOT_FOUND_USER_ID" });
    });
  });

  describe(`GET ${baseUrl}/user/profile`, () => {
    beforeEach(() =>
      jest.spyOn(console, "error").mockImplementation(() => {
        // Empty fn
      })
    );

    it("should return 200 with SUCCESS_GET_USER_PROFILE code and profile data", async () => {
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (SessionService.getUserId as jest.Mock).mockResolvedValue("12345");
      (InstagramService.getProfile as jest.Mock).mockResolvedValue(mockProfileData);
      (SessionService.setUser as jest.Mock).mockResolvedValue("OK");

      const res: Response = await request(app).get(`${baseUrl}/user/profile`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: "SUCCESS_GET_USER_PROFILE",
        message: "Successfully found user profile.",
        data: mockProfileData,
      });
    });

    it("should return 401 with NOT_FOUND_USER_ID when user ID is not in Redis", async () => {
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (SessionService.getUserId as jest.Mock).mockResolvedValue(null);

      const res: Response = await request(app).get(`${baseUrl}/user/profile`);

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({ code: "NOT_FOUND_USER_ID" });
    });

    it("should return 500 when InstagramService.getProfile throws", async () => {
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (SessionService.getUserId as jest.Mock).mockResolvedValue("12345");
      (InstagramService.getProfile as jest.Mock).mockRejectedValue(new Error("API error"));

      const res: Response = await request(app).get(`${baseUrl}/user/profile`);

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({ code: "ERROR_GENERIC" });
    });
  });
});
