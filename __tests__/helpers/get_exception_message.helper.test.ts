import type { ExceptionInfo } from "@/types/helpers";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";

describe("get_exception_message.helper", () => {
  describe("getExceptionMessage", () => {
    beforeEach(() =>
      jest.spyOn(console, "error").mockImplementation(() => {
        // Empty fn
      })
    );

    it("should return 500 with ERROR_GENERIC code for Error instances", () => {
      const result: ExceptionInfo = getExceptionMessage(new Error("Something broke"));

      expect(result).toEqual({
        status: 500,
        code: "ERROR_GENERIC",
        message: "Something went wrong!",
      });
    });

    it("should return 500 with ERROR_GENERIC code for string errors", () => {
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

    it("should return 500 for object errors", () => {
      const result: ExceptionInfo = getExceptionMessage({ code: 42 });

      expect(result.status).toBe(500);
    });
  });
});
