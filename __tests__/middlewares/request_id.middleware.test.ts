import type { NextFunction, Request, Response } from "express";

import { requestId } from "@/middlewares/request_id.middleware";

const HEADER = "x-request-id";
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const buildReq = (incomingId?: string): Request => {
  const headers: Record<string, string | undefined> = {};
  if (incomingId !== undefined) headers[HEADER] = incomingId;
  const header: Request["header"] = jest.fn(
    (name: string): string | undefined => headers[name.toLowerCase()]
  ) as unknown as Request["header"];
  const req: Partial<Request> = { header };
  return req as Request;
};

const buildRes = (): Response => {
  const res: Partial<Response> = {};
  res.setHeader = jest.fn().mockReturnValue(res as Response);
  return res as Response;
};

const buildNext = (): NextFunction => jest.fn();

describe("request_id.middleware", () => {
  describe("requestId", () => {
    it("should generate a UUID and assign it to req.id when no incoming header", () => {
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      requestId(req, res, next);

      expect(req.id).toMatch(UUID_REGEX);
    });

    it("should set the x-request-id response header to the generated id", () => {
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      requestId(req, res, next);

      expect(res.setHeader).toHaveBeenCalledWith(HEADER, req.id);
    });

    it("should call next exactly once with no arguments", () => {
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      requestId(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
    });

    it("should reuse the incoming x-request-id header when present", () => {
      const incoming = "abc-123-existing";
      const req: Request = buildReq(incoming);
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      requestId(req, res, next);

      expect(req.id).toBe(incoming);
      expect(res.setHeader).toHaveBeenCalledWith(HEADER, incoming);
    });

    it("should generate a UUID when the incoming header is an empty string", () => {
      const req: Request = buildReq("");
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      requestId(req, res, next);

      expect(req.id).toMatch(UUID_REGEX);
    });

    it("should generate distinct ids on successive calls", () => {
      const reqA: Request = buildReq();
      const reqB: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      requestId(reqA, res, next);
      requestId(reqB, res, next);

      expect(reqA.id).not.toBe(reqB.id);
    });
  });
});
