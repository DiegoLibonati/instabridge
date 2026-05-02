export interface MessagesSuccess {
  getUserId: string;
  getUserProfile: string;
}

export interface MessagesNot {
  foundRoute: string;
  foundAccessToken: string;
  foundUserId: string;
}

export interface MessagesError {
  generic: string;
}

export interface CodesSuccess {
  getUserId: "SUCCESS_GET_USER_ID";
  getUserProfile: "SUCCESS_GET_USER_PROFILE";
}

export interface CodesNot {
  foundRoute: "NOT_FOUND_ROUTE";
  foundAccessToken: "NOT_FOUND_ACCESS_TOKEN";
  foundUserId: "NOT_FOUND_USER_ID";
}

export interface CodesError {
  generic: "ERROR_GENERIC";
}
