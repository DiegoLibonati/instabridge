export interface MessagesSuccess {
  getUserId: string;
  getUserProfile: string;
  healthLive: string;
  healthReady: string;
}

export interface MessagesNot {
  foundRoute: string;
  foundAccessToken: string;
  foundUserId: string;
  validId: string;
  validUsername: string;
  validAccountType: string;
  validMediaCount: string;
}

export interface MessagesError {
  generic: string;
  validation: string;
}

export interface CodesSuccess {
  getUserId: "SUCCESS_GET_USER_ID";
  getUserProfile: "SUCCESS_GET_USER_PROFILE";
  healthLive: "SUCCESS_HEALTH_LIVE";
  healthReady: "SUCCESS_HEALTH_READY";
}

export interface CodesNot {
  foundRoute: "NOT_FOUND_ROUTE";
  foundAccessToken: "NOT_FOUND_ACCESS_TOKEN";
  foundUserId: "NOT_FOUND_USER_ID";
  validId: "NOT_VALID_ID";
  validUsername: "NOT_VALID_USERNAME";
  validAccountType: "NOT_VALID_ACCOUNT_TYPE";
  validMediaCount: "NOT_VALID_MEDIA_COUNT";
}

export interface CodesError {
  generic: "ERROR_GENERIC";
  validation: "ERROR_VALIDATION";
}
