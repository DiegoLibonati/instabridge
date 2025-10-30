import { Request, Response } from "express";

import { Profile, User } from "@src/entities/app";

import redisClient from "@src/config/redis.config";
import { envs } from "@src/config/env.config";

import { SessionService } from "@src/services/session.service";

import { getExceptionMessage } from "@src/helpers/get_exception_message.helper";

import { MESSAGES_SUCCESS } from "@src/constants/messages.constant";
import { CODES_SUCCESS } from "@src/constants/codes.constant";

export const InstagramController = {
  alive: async (_: Request, res: Response) => {
    try {
      res
        .status(200)
        .json({ author: "Diego Libonati", version: envs.API_VERSION });
    } catch (e: unknown) {
      const response = getExceptionMessage(e);
      res.status(500).json(response);
    }
  },
  userProfile: async (_: Request, res: Response) => {
    const REDIS_INSTAGRAM_USER_ID: string =
      (await SessionService.getUserId()) as string;
    const INSTAGRAM_ACCESS_TOKEN =
      (await SessionService.getAccessToken()) as string;

    try {
      const request = await fetch(
        `${envs.INSTAGRAM_API}/${envs.INSTAGRAM_API_VERSION}/${REDIS_INSTAGRAM_USER_ID}?fields=id,username,account_type,media_count&access_token=${INSTAGRAM_ACCESS_TOKEN}`
      );

      const profile: Profile = await request.json();

      const user: User = {
        id: profile.id,
        account_type: profile.account_type,
        media_count: profile.media_count,
        username: profile.username,
      };

      await SessionService.setUser(user);

      res.status(200).json({
        code: CODES_SUCCESS.getUserProfile,
        message: MESSAGES_SUCCESS.getUserProfile,
        data: profile,
      });
    } catch (e: unknown) {
      const response = getExceptionMessage(e);
      res.status(500).json(response);
    }
  },
};
