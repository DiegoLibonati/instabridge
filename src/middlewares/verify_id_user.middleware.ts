import type { NextFunction, Request, Response } from "express";

import { CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

import { SessionService } from "@/services/session.service";

export const verifyIdUser = async (
  _: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const REDIS_INSTAGRAM_USER_ID = await SessionService.getUserId();

  if (!REDIS_INSTAGRAM_USER_ID) {
    res
      .status(401)
      .json({
        code: CODES_NOT.foundUserId,
        message: MESSAGES_NOT.foundUserId,
      })
      .end();
    return;
  }

  next();
};
