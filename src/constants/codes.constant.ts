import type { CodesError, CodesNot, CodesSuccess } from "@/types/constants";

export const CODES_SUCCESS: CodesSuccess = {
  getUserId: "SUCCESS_GET_USER_ID",
  getUserProfile: "SUCCESS_GET_USER_PROFILE",
  healthLive: "SUCCESS_HEALTH_LIVE",
  healthReady: "SUCCESS_HEALTH_READY",
};

export const CODES_ERROR: CodesError = {
  generic: "ERROR_GENERIC",
};

export const CODES_NOT: CodesNot = {
  foundRoute: "NOT_FOUND_ROUTE",
  foundAccessToken: "NOT_FOUND_ACCESS_TOKEN",
  foundUserId: "NOT_FOUND_USER_ID",
  validId: "NOT_VALID_ID",
  validUsername: "NOT_VALID_USERNAME",
  validAccountType: "NOT_VALID_ACCOUNT_TYPE",
  validMediaCount: "NOT_VALID_MEDIA_COUNT",
};
