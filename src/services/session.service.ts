import type { User } from "@/types/app";

import { RedisDAO } from "@/daos/redis.dao";

export const SessionService = {
  getUserId: async (): Promise<string | null> => RedisDAO.getValue("idUser"),
  getAccessToken: async (): Promise<string | null> => RedisDAO.getValue("access_token"),
  getUser: async (): Promise<string | null> => RedisDAO.getValue("user"),
  setUserId: async (idUser: string): Promise<string | null> => RedisDAO.setValue("idUser", idUser),
  setAccessToken: async (accessToken: string): Promise<string | null> =>
    RedisDAO.setValue("access_token", accessToken),
  setUser: async (user: User): Promise<string | null> =>
    RedisDAO.setValue("user", JSON.stringify(user)),
  deleteUserId: async (): Promise<number> => RedisDAO.deleteKey("idUser"),
};
