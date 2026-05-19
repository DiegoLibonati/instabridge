import request from "supertest";

import type { Response } from "supertest";

import app from "@/app";

import { SessionService } from "@/services/session.service";
import { InstagramService } from "@/services/instagram.service";

jest.mock("@/services/session.service");
jest.mock("@/services/instagram.service");

const baseUrl = "/api/v1/auth";

describe("auth.route", () => {
  describe(`GET ${baseUrl}/user_id`, () => {
    it("should return 200 with user id data when token and Instagram API are available", async () => {
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (InstagramService.getAuthId as jest.Mock).mockResolvedValue({ id: "12345" });
      (SessionService.setUserId as jest.Mock).mockResolvedValue("OK");

      const res: Response = await request(app).get(`${baseUrl}/user_id`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: "SUCCESS_GET_USER_ID",
        message: "Successfully found the user id.",
        data: { id: "12345" },
      });
    });

    it("should return 500 with ERROR_GENERIC when InstagramService.getAuthId throws", async () => {
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue("test_token");
      (InstagramService.getAuthId as jest.Mock).mockRejectedValue(new Error("API error"));

      const res: Response = await request(app).get(`${baseUrl}/user_id`);

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({ code: "ERROR_GENERIC" });
    });

    it("should store the token in Redis when it is not already cached", async () => {
      (SessionService.getAccessToken as jest.Mock).mockResolvedValue(null);
      (SessionService.setAccessToken as jest.Mock).mockResolvedValue("OK");
      (InstagramService.getAuthId as jest.Mock).mockResolvedValue({ id: "12345" });
      (SessionService.setUserId as jest.Mock).mockResolvedValue("OK");

      const res: Response = await request(app).get(`${baseUrl}/user_id`);

      expect(SessionService.setAccessToken).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/v1/unknown-route", () => {
    it("should return 404 for routes that do not exist", async () => {
      const res: Response = await request(app).get("/api/v1/unknown-route");

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ code: "NOT_FOUND_ROUTE" });
    });
  });
});
