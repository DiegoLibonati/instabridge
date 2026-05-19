import { AppError } from "@/errors/app.error";

describe("app.error", () => {
  it("should set status, code and message from constructor arguments", () => {
    const err: AppError = new AppError(418, "ERROR_TEAPOT", "I am a teapot");

    expect(err.status).toBe(418);
    expect(err.code).toBe("ERROR_TEAPOT");
    expect(err.message).toBe("I am a teapot");
  });

  it("should set the name to AppError", () => {
    const err: AppError = new AppError(500, "ERROR_GENERIC", "Boom");

    expect(err.name).toBe("AppError");
  });

  it("should be an instance of Error and AppError", () => {
    const err: AppError = new AppError(500, "ERROR_GENERIC", "Boom");

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
  });

  it("should preserve a stack trace", () => {
    const err: AppError = new AppError(500, "ERROR_GENERIC", "Boom");

    expect(typeof err.stack).toBe("string");
  });

  it("should expose status and code as readonly fields", () => {
    const err: AppError = new AppError(500, "ERROR_GENERIC", "Boom");

    expect(err.status).toBe(500);
    expect(err.code).toBe("ERROR_GENERIC");
  });

  it("should set name to the subclass name when extended", () => {
    class SubError extends AppError {
      constructor() {
        super(400, "ERROR_SUB", "Sub error");
      }
    }

    const err: SubError = new SubError();

    expect(err.name).toBe("SubError");
  });
});
