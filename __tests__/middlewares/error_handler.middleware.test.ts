import type { NextFunction, Request, Response } from "express";

import { errorHandler } from "@/middlewares/error_handler.middleware";

import { AppError } from "@/errors/app.error";
import { BadRequestError } from "@/errors/bad_request.error";
import { NotFoundError } from "@/errors/not_found.error";

import { logger } from "@/configs/logger.config";

jest.mock("@/configs/logger.config", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    fatal: jest.fn(),
    trace: jest.fn(),
  },
}));

const buildReq = (): Request => ({}) as Request;

const buildRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const buildNext = (): NextFunction => jest.fn();

describe("error_handler.middleware", () => {
  describe("errorHandler", () => {
    it("should respond with 500 and ERROR_GENERIC for plain Error instances", () => {
      const err: Error = new Error("Something failed");
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: "ERROR_GENERIC",
        message: "Something went wrong!",
      });
    });

    it("should log the error when status is 500 or higher", () => {
      const err: Error = new Error("Boom");
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      errorHandler(err, req, res, next);

      expect(logger.error).toHaveBeenCalledWith({ err }, "Boom");
    });

    it("should not log the error when status is below 500", () => {
      const err: BadRequestError = new BadRequestError("ERROR_BAD", "Bad request");
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      errorHandler(err, req, res, next);

      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should map AppError to its declared status, code and message", () => {
      const err: AppError = new AppError(418, "ERROR_TEAPOT", "I am a teapot");
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(418);
      expect(res.json).toHaveBeenCalledWith({
        code: "ERROR_TEAPOT",
        message: "I am a teapot",
      });
    });

    it("should respond with 404 for NotFoundError", () => {
      const err: NotFoundError = new NotFoundError("CODE_NF", "Resource not found");
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: "CODE_NF",
        message: "Resource not found",
      });
    });

    it("should respond with 400 for BadRequestError", () => {
      const err: BadRequestError = new BadRequestError("ERROR_BAD", "Bad request");
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: "ERROR_BAD",
        message: "Bad request",
      });
    });

    it("should not call next", () => {
      const err: Error = new Error("Error");
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      errorHandler(err, req, res, next);

      expect(next).not.toHaveBeenCalled();
    });

    it("should respond with 500 for errors without a message", () => {
      const err: Error = new Error();
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
