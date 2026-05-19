import type { ZodType } from "zod";

declare module "express-serve-static-core" {
  interface Request {
    id: string;
  }
}

export interface User {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
}

export type Profile = Pick<User, "id" | "username" | "account_type" | "media_count">;

export type Env = "development" | "production" | "test";

export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";

export interface ValidateConfig {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}
