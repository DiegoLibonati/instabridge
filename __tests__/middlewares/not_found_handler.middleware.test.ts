import type { Request, Response } from "express";

import { notFoundHandler } from "@/middlewares/not_found_handler.middleware";

const buildReq = (): Request => ({}) as Request;

const buildRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("not_found_handler.middleware", () => {
  describe("notFoundHandler", () => {
    it("should respond with 404 and NOT_FOUND_ROUTE code", () => {
      const req: Request = buildReq();
      const res: Response = buildRes();

      notFoundHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: "NOT_FOUND_ROUTE",
        message: "Route not found.",
      });
    });

    it("should call json exactly once", () => {
      const req: Request = buildReq();
      const res: Response = buildRes();

      notFoundHandler(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });
});
