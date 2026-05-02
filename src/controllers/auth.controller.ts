import type { Request, Response } from "express";

import { SessionService } from "@/services/session.service";
import { InstagramService } from "@/services/instagram.service";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";

import { MESSAGES_SUCCESS } from "@/constants/messages.constant";
import { CODES_SUCCESS } from "@/constants/codes.constant";

export const AuthController = {
  getUserId: async (_: Request, res: Response): Promise<void> => {
    try {
      const INSTAGRAM_ACCESS_TOKEN = await SessionService.getAccessToken();

      const data = await InstagramService.getAuthId(INSTAGRAM_ACCESS_TOKEN!);

      const idUser = data.id;

      await SessionService.setUserId(idUser);

      res.status(200).json({
        code: CODES_SUCCESS.getUserId,
        message: MESSAGES_SUCCESS.getUserId,
        data: data,
      });
    } catch (e: unknown) {
      const { status, ...response } = getExceptionMessage(e);
      res.status(status).json(response);
    }
  },
};
