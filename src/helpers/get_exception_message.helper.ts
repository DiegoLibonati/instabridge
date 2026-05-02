import type { ExceptionInfo } from "@/types/helpers";

import { CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_ERROR } from "@/constants/messages.constant";

export const getExceptionMessage = (e: unknown): ExceptionInfo => {
  console.error(e instanceof Error ? e.message : e);
  return { status: 500, code: CODES_ERROR.generic, message: MESSAGES_ERROR.generic };
};
