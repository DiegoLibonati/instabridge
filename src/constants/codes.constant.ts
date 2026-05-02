import type { CodesError, CodesNot, CodesSuccess } from "@/types/constants";

export const CODES_SUCCESS: CodesSuccess = {
  getUserId: "SUCCESS_GET_USER_ID",
  getUserProfile: "SUCCESS_GET_USER_PROFILE",
};

export const CODES_ERROR: CodesError = {
  generic: "ERROR_GENERIC",
};

export const CODES_NOT: CodesNot = {
  foundRoute: "NOT_FOUND_ROUTE",
  foundAccessToken: "NOT_FOUND_ACCESS_TOKEN",
  foundUserId: "NOT_FOUND_USER_ID",
};
