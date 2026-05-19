import request from "supertest";

import type { Response } from "supertest";

import app from "@/app";

const baseUrl = "/api/v1/health";

describe("health.route", () => {
  describe(`GET ${baseUrl}/live`, () => {
    it("should return 200 with SUCCESS_HEALTH_LIVE code", async () => {
      const res: Response = await request(app).get(`${baseUrl}/live`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        code: "SUCCESS_HEALTH_LIVE",
        message: "Service is alive.",
        data: null,
      });
    });
  });

  describe(`GET ${baseUrl}/ready`, () => {
    it("should return 200 with SUCCESS_HEALTH_READY code", async () => {
      const res: Response = await request(app).get(`${baseUrl}/ready`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        code: "SUCCESS_HEALTH_READY",
        message: "Service is ready.",
        data: null,
      });
    });
  });

  describe(`GET ${baseUrl}/unknown`, () => {
    it("should return 404 with NOT_FOUND_ROUTE for unknown health subroutes", async () => {
      const res: Response = await request(app).get(`${baseUrl}/unknown`);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ code: "NOT_FOUND_ROUTE" });
    });
  });
});
