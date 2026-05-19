import type { NextFunction, Request, Response } from "express";

import { HealthController } from "@/controllers/health.controller";

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

describe("health.controller", () => {
  describe("live", () => {
    it("should return 200 with SUCCESS_HEALTH_LIVE code and null data", () => {
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      HealthController.live(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: "SUCCESS_HEALTH_LIVE",
        message: "Service is alive.",
        data: null,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should forward errors thrown by res.json to next", () => {
      const error: Error = new Error("response failure");
      const req: Request = buildReq();
      const res: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockImplementation((): never => {
          throw error;
        }),
      } as unknown as Response;
      const next: NextFunction = buildNext();

      HealthController.live(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("ready", () => {
    it("should return 200 with SUCCESS_HEALTH_READY code and null data", () => {
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      HealthController.ready(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: "SUCCESS_HEALTH_READY",
        message: "Service is ready.",
        data: null,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should forward errors thrown by res.json to next", () => {
      const error: Error = new Error("response failure");
      const req: Request = buildReq();
      const res: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockImplementation((): never => {
          throw error;
        }),
      } as unknown as Response;
      const next: NextFunction = buildNext();

      HealthController.ready(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
