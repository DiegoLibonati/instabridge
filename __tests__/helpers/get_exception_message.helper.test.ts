import type { ExceptionInfo } from "@/types/helpers";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";

import { AppError } from "@/errors/app.error";
import { BadRequestError } from "@/errors/bad_request.error";
import { ConflictError } from "@/errors/conflict.error";
import { NotFoundError } from "@/errors/not_found.error";
import { UnauthorizedError } from "@/errors/unathorized.error";

describe("get_exception_message.helper", () => {
  describe("getExceptionMessage", () => {
    it("should return 500 with ERROR_GENERIC for plain Error instances", () => {
      const result: ExceptionInfo = getExceptionMessage(new Error("Something broke"));

      expect(result).toEqual({
        status: 500,
        code: "ERROR_GENERIC",
        message: "Something went wrong!",
      });
    });

    it("should return 500 with ERROR_GENERIC for string errors", () => {
      const result: ExceptionInfo = getExceptionMessage("string error");

      expect(result).toEqual({
        status: 500,
        code: "ERROR_GENERIC",
        message: "Something went wrong!",
      });
    });

    it("should return 500 for null", () => {
      const result: ExceptionInfo = getExceptionMessage(null);

      expect(result.status).toBe(500);
      expect(result.code).toBe("ERROR_GENERIC");
    });

    it("should return 500 for undefined", () => {
      const result: ExceptionInfo = getExceptionMessage(undefined);

      expect(result.status).toBe(500);
      expect(result.code).toBe("ERROR_GENERIC");
    });

    it("should return 500 for arbitrary object errors", () => {
      const result: ExceptionInfo = getExceptionMessage({ code: 42 });

      expect(result.status).toBe(500);
      expect(result.code).toBe("ERROR_GENERIC");
    });

    it("should map AppError to its status, code and message", () => {
      const err: AppError = new AppError(418, "ERROR_TEAPOT", "I am a teapot");

      const result: ExceptionInfo = getExceptionMessage(err);

      expect(result).toEqual({
        status: 418,
        code: "ERROR_TEAPOT",
        message: "I am a teapot",
      });
    });

    it("should map BadRequestError to status 400", () => {
      const err: BadRequestError = new BadRequestError("ERROR_BAD", "Bad request");

      const result: ExceptionInfo = getExceptionMessage(err);

      expect(result).toEqual({ status: 400, code: "ERROR_BAD", message: "Bad request" });
    });

    it("should map UnauthorizedError to status 401", () => {
      const err: UnauthorizedError = new UnauthorizedError("ERROR_UNAUTH", "Unauthorized");

      const result: ExceptionInfo = getExceptionMessage(err);

      expect(result).toEqual({ status: 401, code: "ERROR_UNAUTH", message: "Unauthorized" });
    });

    it("should map NotFoundError to status 404", () => {
      const err: NotFoundError = new NotFoundError("CUSTOM_NOT_FOUND", "Not found");

      const result: ExceptionInfo = getExceptionMessage(err);

      expect(result).toEqual({ status: 404, code: "CUSTOM_NOT_FOUND", message: "Not found" });
    });

    it("should map ConflictError to status 409", () => {
      const err: ConflictError = new ConflictError("ERROR_CONFLICT", "Conflict");

      const result: ExceptionInfo = getExceptionMessage(err);

      expect(result).toEqual({ status: 409, code: "ERROR_CONFLICT", message: "Conflict" });
    });
  });
});
