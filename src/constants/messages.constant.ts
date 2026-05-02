import type { MessagesSuccess, MessagesError, MessagesNot } from "@/types/constants";

export const MESSAGES_SUCCESS: MessagesSuccess = {
  getUserId: "Successfully found the user id.",
  getUserProfile: "Successfully found user profile.",
};

export const MESSAGES_NOT: MessagesNot = {
  foundRoute: "Route not found.",
  foundAccessToken: "Access token not found. Set INSTAGRAM_USER_ACCESS_TOKEN in your environment.",
  foundUserId: "User ID not found. Call GET /api/v1/auth/user_id first.",
};

export const MESSAGES_ERROR: MessagesError = {
  generic: "Something went wrong!",
};
