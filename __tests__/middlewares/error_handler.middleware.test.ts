import type { NextFunction, Request, Response } from "express";

import { errorHandler } from "@/middlewares/error_handler.middleware";

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
    beforeEach(() =>
      jest.spyOn(console, "error").mockImplementation(() => {
        // Empty fn
      })
    );

    it("should respond with 500 and generic error body for any error", () => {
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
