import { AppError } from "@/errors/app.error";

import { CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

export class NotFoundError extends AppError {
  constructor(code: string = CODES_NOT.foundRoute, message: string = MESSAGES_NOT.foundRoute) {
    super(404, code, message);
  }
}
