import type { Env } from "@/types/app";
import type { Envs } from "@/types/env";

import { requireEnv } from "@/helpers/require_env.helper";

const INSTAGRAM_API = requireEnv("INSTAGRAM_API");
const INSTAGRAM_API_VERSION = requireEnv("INSTAGRAM_API_VERSION");
const INSTAGRAM_SECRET_CLIENT = requireEnv("INSTAGRAM_SECRET_CLIENT");
const INSTAGRAM_USER_ACCESS_TOKEN = requireEnv("INSTAGRAM_USER_ACCESS_TOKEN");
const REDIS_HOST = requireEnv("REDIS_HOST");
const REDIS_PORT = requireEnv("REDIS_PORT");

export const envs: Envs = {
  PORT: Number(process.env.PORT) || 5050,
  API_VERSION: process.env.API_VERSION ?? "0.0.1",
  ENV: (process.env.NODE_ENV ?? "development") as Env,
  BASE_URL: process.env.BASE_URL ?? "",
  INSTAGRAM_API: INSTAGRAM_API,
  INSTAGRAM_API_VERSION: INSTAGRAM_API_VERSION,
  INSTAGRAM_SECRET_CLIENT: INSTAGRAM_SECRET_CLIENT,
  INSTAGRAM_USER_ACCESS_TOKEN: INSTAGRAM_USER_ACCESS_TOKEN,
  REDIS_HOST: REDIS_HOST,
  REDIS_PORT: REDIS_PORT,
};
