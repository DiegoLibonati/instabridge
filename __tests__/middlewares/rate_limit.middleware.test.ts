import express from "express";
import request from "supertest";

import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { Response as SupertestResponse } from "supertest";

const buildReq = (): Request => ({}) as Request;

const buildRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res as Response);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

const buildNext = (): NextFunction => jest.fn();

const loadRateLimiter = (rateLimitMax: number, rateLimitWindowMs: number): RequestHandler => {
  let handler: RequestHandler = ((): void => undefined) as RequestHandler;
  jest.isolateModules((): void => {
    jest.doMock("@/configs/env.config", () => ({
      envs: {
        RATE_LIMIT_MAX: rateLimitMax,
        RATE_LIMIT_WINDOW_MS: rateLimitWindowMs,
      },
    }));
    const mod: { rateLimiter: RequestHandler } = jest.requireActual(
      "@/middlewares/rate_limit.middleware"
    );
    handler = mod.rateLimiter;
  });
  return handler;
};

describe("rate_limit.middleware", () => {
  describe("rateLimiter", () => {
    it("should be a passthrough that calls next when RATE_LIMIT_MAX is 0", () => {
      const handler: RequestHandler = loadRateLimiter(0, 1000);
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      void handler(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should allow the request through when RATE_LIMIT_MAX is greater than 0 and limit is not exceeded", async () => {
      const handler: RequestHandler = loadRateLimiter(5, 60_000);
      const app: express.Application = express();
      app.use(handler);
      app.get("/", (_req: Request, res: Response): void => {
        res.status(200).json({ ok: true });
      });

      const response: SupertestResponse = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ok: true });
    });

    it("should block requests with 429 when the limit is exceeded", async () => {
      const handler: RequestHandler = loadRateLimiter(1, 60_000);
      const app: express.Application = express();
      app.use(handler);
      app.get("/", (_req: Request, res: Response): void => {
        res.status(200).json({ ok: true });
      });

      const first: SupertestResponse = await request(app).get("/");
      const second: SupertestResponse = await request(app).get("/");

      expect(first.status).toBe(200);
      expect(second.status).toBe(429);
    });
  });
});
