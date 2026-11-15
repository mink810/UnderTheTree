export type LoginErrorCode =
  | 'EMPTY_USER_ID'
  | 'EMPTY_PASSWORD'
  | 'INVALID_CREDENTIALS'
  | 'WITHDRAWN'
  | 'SUSPENDED'
  | 'NETWORK_ERROR'
  | 'RATE_LIMITED';

export type LoginSuccess = {
  ok: true;
  userId: string;
  accessToken: string;
  expiresAt: string;
};

export type LoginFailure = {
  ok: false;
  code: LoginErrorCode;
  message: string;
};

export type LoginResult = LoginSuccess | LoginFailure;
