import { Request, Response, NextFunction } from "express";

import { envs } from "@src/config/env.config";
import redisClient from "@src/config/redis.config";

import { SessionService } from "@src/services/session.service";

import { CODES_NOT } from "@src/constants/codes.constant";
import { MESSAGES_NOT } from "@src/constants/messages.constant";

export const verifyAccessToken = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
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

  if (!redisClient.isOpen) await redisClient.connect();

  const REDIS_INSTAGRAM_ACCESS_TOKEN = await SessionService.getAccessToken();

  if (!REDIS_INSTAGRAM_ACCESS_TOKEN)
    await SessionService.setAccessToken(INSTAGRAM_USER_ACCESS_TOKEN);

  next();
};
