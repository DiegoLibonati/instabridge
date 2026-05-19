import type { Env, LogLevel } from "@/types/app";

export interface Envs {
  PORT: Port;
  API_VERSION: ApiVersion;
  ENV: Env;
  BASE_URL: BaseUrl;
  INSTAGRAM_API: InstagramApi;
  INSTAGRAM_API_VERSION: InstagramApiVersion;
  INSTAGRAM_SECRET_CLIENT: InstagramSecretClient;
  INSTAGRAM_USER_ACCESS_TOKEN: InstagramUserAccessToken;
  REDIS_HOST: RedisHost;
  REDIS_PORT: RedisPort;
  LOG_LEVEL: LogLevel;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX: number;
  BODY_LIMIT: string;
  SEED_DEFAULT_DATA: boolean;
}

type Port = number;
type ApiVersion = string;
type BaseUrl = string;
type InstagramApi = string;
type InstagramApiVersion = string;
type InstagramSecretClient = string;
type InstagramUserAccessToken = string;
type RedisHost = string;
type RedisPort = string;
