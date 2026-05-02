import type { Request, Response } from "express";
import type { User } from "@/types/app";

import { envs } from "@/configs/env.config";

import { SessionService } from "@/services/session.service";
import { InstagramService } from "@/services/instagram.service";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";

import { MESSAGES_SUCCESS } from "@/constants/messages.constant";
import { CODES_SUCCESS } from "@/constants/codes.constant";

export const InstagramController = {
  alive: (_: Request, res: Response): void => {
    try {
      res.status(200).json({ author: "Diego Libonati", version: envs.API_VERSION });
    } catch (e: unknown) {
      const { status, ...response } = getExceptionMessage(e);
      res.status(status).json(response);
    }
  },
  userProfile: async (_: Request, res: Response): Promise<void> => {
    const REDIS_INSTAGRAM_USER_ID = await SessionService.getUserId();
    const INSTAGRAM_ACCESS_TOKEN = await SessionService.getAccessToken();

    try {
      const data = await InstagramService.getProfile(
        INSTAGRAM_ACCESS_TOKEN!,
        REDIS_INSTAGRAM_USER_ID!
      );

      const user: User = {
        id: data.id,
        account_type: data.account_type,
        media_count: data.media_count,
        username: data.username,
      };

      await SessionService.setUser(user);

      res.status(200).json({
        code: CODES_SUCCESS.getUserProfile,
        message: MESSAGES_SUCCESS.getUserProfile,
        data: data,
      });
    } catch (e: unknown) {
      const { status, ...response } = getExceptionMessage(e);
      res.status(status).json(response);
    }
  },
};
