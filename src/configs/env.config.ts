import { z } from "zod";

import type { Envs } from "@/types/env";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5050),
  API_VERSION: z.string().default("0.0.1"),
  BASE_URL: z.string().default(""),
  INSTAGRAM_API: z.string().min(1),
  INSTAGRAM_API_VERSION: z.string().min(1),
  INSTAGRAM_SECRET_CLIENT: z.string().min(1),
  INSTAGRAM_USER_ACCESS_TOKEN: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.string().min(1),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().nonnegative().default(0),
  BODY_LIMIT: z.string().default("1gb"),
  SEED_DEFAULT_DATA: z.stringbool().default(false),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(`Invalid environment variables:\n${issues}`);
}

export const envs: Envs = {
  PORT: parsed.data.PORT,
  API_VERSION: parsed.data.API_VERSION,
  ENV: parsed.data.NODE_ENV,
  BASE_URL: parsed.data.BASE_URL,
  INSTAGRAM_API: parsed.data.INSTAGRAM_API,
  INSTAGRAM_API_VERSION: parsed.data.INSTAGRAM_API_VERSION,
  INSTAGRAM_SECRET_CLIENT: parsed.data.INSTAGRAM_SECRET_CLIENT,
  INSTAGRAM_USER_ACCESS_TOKEN: parsed.data.INSTAGRAM_USER_ACCESS_TOKEN,
  REDIS_HOST: parsed.data.REDIS_HOST,
  REDIS_PORT: parsed.data.REDIS_PORT,
  LOG_LEVEL: parsed.data.LOG_LEVEL,
  RATE_LIMIT_WINDOW_MS: parsed.data.RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX: parsed.data.RATE_LIMIT_MAX,
  BODY_LIMIT: parsed.data.BODY_LIMIT,
  SEED_DEFAULT_DATA: parsed.data.SEED_DEFAULT_DATA,
};
