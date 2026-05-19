import { AppError } from "@/errors/app.error";
import { UnauthorizedError } from "@/errors/unathorized.error";

describe("unathorized.error", () => {
  it("should set status to 401", () => {
    const err: UnauthorizedError = new UnauthorizedError("ERROR_UNAUTHORIZED", "Unauthorized");

    expect(err.status).toBe(401);
  });

  it("should set code and message from constructor arguments", () => {
    const err: UnauthorizedError = new UnauthorizedError("ERROR_UNAUTHORIZED", "Unauthorized");

    expect(err.code).toBe("ERROR_UNAUTHORIZED");
    expect(err.message).toBe("Unauthorized");
  });

  it("should be an instance of AppError and UnauthorizedError", () => {
    const err: UnauthorizedError = new UnauthorizedError("ERROR_UNAUTHORIZED", "Unauthorized");

    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(UnauthorizedError);
  });

  it("should set the name to UnauthorizedError", () => {
    const err: UnauthorizedError = new UnauthorizedError("ERROR_UNAUTHORIZED", "Unauthorized");

    expect(err.name).toBe("UnauthorizedError");
  });
});
