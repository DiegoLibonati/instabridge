import { NextFunction, Request, Response } from "express";

import redisClient from "@src/config/redis.config";

import { SessionService } from "@src/services/session.service";

import { CODES_NOT } from "@src/constants/codes.constant";
import { MESSAGES_NOT } from "@src/constants/messages.constant";

export const verifyIdUser = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (!redisClient.isOpen) await redisClient.connect();

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
