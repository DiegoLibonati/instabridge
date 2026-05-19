import { AppError } from "@/errors/app.error";
import { NotFoundError } from "@/errors/not_found.error";

import { CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

describe("not_found.error", () => {
  it("should set status to 404", () => {
    const err: NotFoundError = new NotFoundError();

    expect(err.status).toBe(404);
  });

  it("should default code to CODES_NOT.foundRoute when not provided", () => {
    const err: NotFoundError = new NotFoundError();

    expect(err.code).toBe(CODES_NOT.foundRoute);
  });

  it("should default message to MESSAGES_NOT.foundRoute when not provided", () => {
    const err: NotFoundError = new NotFoundError();

    expect(err.message).toBe(MESSAGES_NOT.foundRoute);
  });

  it("should use provided code and message when given", () => {
    const err: NotFoundError = new NotFoundError("CUSTOM_CODE", "Custom message");

    expect(err.code).toBe("CUSTOM_CODE");
    expect(err.message).toBe("Custom message");
  });

  it("should be an instance of AppError and NotFoundError", () => {
    const err: NotFoundError = new NotFoundError();

    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(NotFoundError);
  });

  it("should set the name to NotFoundError", () => {
    const err: NotFoundError = new NotFoundError();

    expect(err.name).toBe("NotFoundError");
  });
});
