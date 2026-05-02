import type { Request, Response, NextFunction } from "express";

import { envs } from "@/configs/env.config";

import { CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

import { SessionService } from "@/services/session.service";

export const verifyAccessToken = async (
  _: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const INSTAGRAM_USER_ACCESS_TOKEN = envs.INSTAGRAM_USER_ACCESS_TOKEN;

  if (!INSTAGRAM_USER_ACCESS_TOKEN) {
    res
      .status(401)
      .json({
        code: CODES_NOT.foundAccessToken,
        message: MESSAGES_NOT.foundAccessToken,
      })
      .end();
    return;
  }

  const REDIS_INSTAGRAM_ACCESS_TOKEN = await SessionService.getAccessToken();

  if (!REDIS_INSTAGRAM_ACCESS_TOKEN)
    await SessionService.setAccessToken(INSTAGRAM_USER_ACCESS_TOKEN);

  next();
};
