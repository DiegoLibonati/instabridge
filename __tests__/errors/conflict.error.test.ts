import { AppError } from "@/errors/app.error";
import { ConflictError } from "@/errors/conflict.error";

describe("conflict.error", () => {
  it("should set status to 409", () => {
    const err: ConflictError = new ConflictError("ERROR_CONFLICT", "Conflict");

    expect(err.status).toBe(409);
  });

  it("should set code and message from constructor arguments", () => {
    const err: ConflictError = new ConflictError("ERROR_CONFLICT", "Conflict");

    expect(err.code).toBe("ERROR_CONFLICT");
    expect(err.message).toBe("Conflict");
  });

  it("should be an instance of AppError and ConflictError", () => {
    const err: ConflictError = new ConflictError("ERROR_CONFLICT", "Conflict");

    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(ConflictError);
  });

  it("should set the name to ConflictError", () => {
    const err: ConflictError = new ConflictError("ERROR_CONFLICT", "Conflict");

    expect(err.name).toBe("ConflictError");
  });
});
