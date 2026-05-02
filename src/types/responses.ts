import type { User } from "@/types/app";

export interface DefaultResponse {
  code: string;
  message: string;
}

export interface ResponseWithData<T> extends DefaultResponse {
  data: T;
}

export type ResponseDirect<T> = T;

export interface ResponseDirectAuthId {
  id: User["id"];
}
