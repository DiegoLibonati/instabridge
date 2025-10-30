import { Request, Response } from "express";

import { envs } from "@src/config/env.config";

import { SessionService } from "@src/services/session.service";

import { getExceptionMessage } from "@src/helpers/get_exception_message.helper";

import { MESSAGES_SUCCESS } from "@src/constants/messages.constant";
import { CODES_SUCCESS } from "@src/constants/codes.constant";

export const AuthController = {
  getUserId: async (_: Request, res: Response) => {
    try {
      const INSTAGRAM_ACCESS_TOKEN = await SessionService.getAccessToken();

      const request = await fetch(
        `${envs.INSTAGRAM_API}/me?access_token=${INSTAGRAM_ACCESS_TOKEN}`
      );

      const user: { id: string } = await request.json();

      const idUser = user.id;

      await SessionService.setUserId(idUser);

      res.status(200).json({
        code: CODES_SUCCESS.getUserId,
        message: MESSAGES_SUCCESS.getUserId,
        data: user,
      });
    } catch (e: unknown) {
      const response = getExceptionMessage(e);
      res.status(500).json(response);
    }
  },
};
