import { z } from "zod";

import type { NextFunction, Request, RequestHandler, Response } from "express";

import { validate } from "@/middlewares/validate.middleware";

import { CODES_ERROR, CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

import { BadRequestError } from "@/errors/bad_request.error";

const buildReq = (overrides: Partial<Request> = {}): Request => {
  const req: Partial<Request> = {
    params: {},
    query: {},
    body: {},
    ...overrides,
  };
  return req as Request;
};

const buildRes = (): Response => ({}) as Response;

const buildNext = (): NextFunction => jest.fn();

describe("validate.middleware", () => {
  describe("validate", () => {
    it("should call next with no arguments when body schema parses successfully", () => {
      const schema: z.ZodType = z.object({ name: z.string() });
      const handler: RequestHandler = validate({ body: schema });
      const req: Request = buildReq({ body: { name: "Diego" } });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      handler(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it("should assign parsed body back to req.body", () => {
      const schema: z.ZodType = z.object({ count: z.coerce.number() });
      const handler: RequestHandler = validate({ body: schema });
      const req: Request = buildReq({ body: { count: "42" } });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      handler(req, res, next);

      expect(req.body).toEqual({ count: 42 });
    });

    it("should assign parsed params back to req.params", () => {
      const schema: z.ZodType = z.object({ id: z.coerce.number() });
      const handler: RequestHandler = validate({ params: schema });
      const req: Request = buildReq({ params: { id: "7" } });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      handler(req, res, next);

      expect(req.params).toEqual({ id: 7 });
    });

    it("should parse query without reassigning it", () => {
      const schema: z.ZodType = z.object({ page: z.string() });
      const handler: RequestHandler = validate({ query: schema });
      const originalQuery: Record<string, string> = { page: "1" };
      const req: Request = buildReq({ query: originalQuery });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      handler(req, res, next);

      expect(req.query).toBe(originalQuery);
      expect(next).toHaveBeenCalledWith();
    });

    it("should forward a BadRequestError to next when body validation fails", () => {
      const schema: z.ZodType = z.object({ name: z.string() });
      const handler: RequestHandler = validate({ body: schema });
      const req: Request = buildReq({ body: { name: 42 } });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      handler(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const err: unknown = (next as jest.Mock).mock.calls[0][0];
      expect(err).toBeInstanceOf(BadRequestError);
    });

    it("should map id validation errors to CODES_NOT.validId", () => {
      const schema: z.ZodType = z.object({ id: z.string() });
      const handler: RequestHandler = validate({ body: schema });
      const req: Request = buildReq({ body: { id: 99 } });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      handler(req, res, next);

      const err: BadRequestError = (next as jest.Mock).mock.calls[0][0] as BadRequestError;
      expect(err.code).toBe(CODES_NOT.validId);
      expect(err.message).toBe(MESSAGES_NOT.validId);
    });

    it("should map username validation errors to CODES_NOT.validUsername", () => {
      const schema: z.ZodType = z.object({ username: z.string() });
      const handler: RequestHandler = validate({ body: schema });
      const req: Request = buildReq({ body: { username: 42 } });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      handler(req, res, next);

      const err: BadRequestError = (next as jest.Mock).mock.calls[0][0] as BadRequestError;
      expect(err.code).toBe(CODES_NOT.validUsername);
    });

    it("should map account_type validation errors to CODES_NOT.validAccountType", () => {
      const schema: z.ZodType = z.object({ account_type: z.string() });
      const handler: RequestHandler = validate({ body: schema });
      const req: Request = buildReq({ body: { account_type: 42 } });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      handler(req, res, next);

      const err: BadRequestError = (next as jest.Mock).mock.calls[0][0] as BadRequestError;
      expect(err.code).toBe(CODES_NOT.validAccountType);
    });

    it("should map media_count validation errors to CODES_NOT.validMediaCount", () => {
      const schema: z.ZodType = z.object({ media_count: z.number() });
      const handler: RequestHandler = validate({ body: schema });
      const req: Request = buildReq({ body: { media_count: "ten" } });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      handler(req, res, next);

      const err: BadRequestError = (next as jest.Mock).mock.calls[0][0] as BadRequestError;
      expect(err.code).toBe(CODES_NOT.validMediaCount);
    });

    it("should fall back to CODES_ERROR.validation for unknown field paths", () => {
      const schema: z.ZodType = z.object({ unknown_field: z.string() });
      const handler: RequestHandler = validate({ body: schema });
      const req: Request = buildReq({ body: { unknown_field: 42 } });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      handler(req, res, next);

      const err: BadRequestError = (next as jest.Mock).mock.calls[0][0] as BadRequestError;
      expect(err.code).toBe(CODES_ERROR.validation);
      expect(err.status).toBe(400);
    });

    it("should forward non-Zod errors as-is to next", () => {
      const exploding: z.ZodType = {
        parse: (): never => {
          throw new Error("not a zod error");
        },
      } as unknown as z.ZodType;
      const handler: RequestHandler = validate({ body: exploding });
      const req: Request = buildReq({ body: {} });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      handler(req, res, next);

      const err: unknown = (next as jest.Mock).mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).not.toBeInstanceOf(BadRequestError);
      expect((err as Error).message).toBe("not a zod error");
    });

    it("should run all configured schemas when params, query and body are provided", () => {
      const paramsSchema: z.ZodType = z.object({ id: z.coerce.number() });
      const querySchema: z.ZodType = z.object({ page: z.string() });
      const bodySchema: z.ZodType = z.object({ name: z.string() });
      const handler: RequestHandler = validate({
        params: paramsSchema,
        query: querySchema,
        body: bodySchema,
      });
      const req: Request = buildReq({
        params: { id: "1" },
        query: { page: "2" },
        body: { name: "Diego" },
      });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      handler(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.params).toEqual({ id: 1 });
      expect(req.body).toEqual({ name: "Diego" });
    });
  });
});
