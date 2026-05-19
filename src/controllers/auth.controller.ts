import type { NextFunction, Request, Response } from "express";

import { SessionService } from "@/services/session.service";
import { InstagramService } from "@/services/instagram.service";

import { CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS } from "@/constants/messages.constant";

export const AuthController = {
  getUserId: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const INSTAGRAM_ACCESS_TOKEN = await SessionService.getAccessToken();

      const data = await InstagramService.getAuthId(INSTAGRAM_ACCESS_TOKEN!);

      await SessionService.setUserId(data.id);

      res.status(200).json({
        code: CODES_SUCCESS.getUserId,
        message: MESSAGES_SUCCESS.getUserId,
        data: data,
      });
    } catch (e) {
      next(e);
    }
  },
};
