import { AppError } from "@/errors/app.error";
import { BadRequestError } from "@/errors/bad_request.error";

describe("bad_request.error", () => {
  it("should set status to 400", () => {
    const err: BadRequestError = new BadRequestError("ERROR_BAD", "Bad request");

    expect(err.status).toBe(400);
  });

  it("should set code and message from constructor arguments", () => {
    const err: BadRequestError = new BadRequestError("ERROR_BAD", "Bad request");

    expect(err.code).toBe("ERROR_BAD");
    expect(err.message).toBe("Bad request");
  });

  it("should be an instance of AppError and BadRequestError", () => {
    const err: BadRequestError = new BadRequestError("ERROR_BAD", "Bad request");

    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(BadRequestError);
  });

  it("should set the name to BadRequestError", () => {
    const err: BadRequestError = new BadRequestError("ERROR_BAD", "Bad request");

    expect(err.name).toBe("BadRequestError");
  });
});
