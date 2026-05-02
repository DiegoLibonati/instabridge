export interface User {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
}

export type Profile = Pick<User, "id" | "username" | "account_type" | "media_count">;

export type Env = "development" | "production" | "test";
