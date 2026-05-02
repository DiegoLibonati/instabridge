import type { ResponseDirect, ResponseDirectAuthId } from "@/types/responses";
import type { Profile } from "@/types/app";

import { envs } from "@/configs/env.config";

export const InstagramService = {
  getAuthId: async (accessToken: string): Promise<ResponseDirect<ResponseDirectAuthId>> => {
    const response = await fetch(`${envs.INSTAGRAM_API}/me?access_token=${accessToken}`);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return (await response.json()) as ResponseDirect<ResponseDirectAuthId>;
  },
  getProfile: async (accessToken: string, idUser: string): Promise<ResponseDirect<Profile>> => {
    const response = await fetch(
      `${envs.INSTAGRAM_API}/${envs.INSTAGRAM_API_VERSION}/${idUser}?fields=id,username,account_type,media_count&access_token=${accessToken}`
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return (await response.json()) as ResponseDirect<Profile>;
  },
};
