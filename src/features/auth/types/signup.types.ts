export type SignUpAgreement = {
  serviceTerms: boolean;
  privacyPolicy: boolean;
  marketing: boolean;
};

export type SignUpPayload = {
  userId: string;
  password: string;
  passwordConfirm: string;
  email: string;
  phone: string;
  phoneVerified: boolean;
  userIdVerified: boolean;
  agreements: SignUpAgreement;
};

export type SignUpErrorCode =
  | 'EMPTY_USER_ID'
  | 'USER_ID_NOT_CHECKED'
  | 'USER_ID_TAKEN'
  | 'INVALID_PASSWORD'
  | 'PASSWORD_MISMATCH'
  | 'INVALID_EMAIL'
  | 'INVALID_PHONE'
  | 'PHONE_NOT_VERIFIED'
  | 'PHONE_ALREADY_USED'
  | 'TERMS_REQUIRED'
  | 'SERVER_ERROR';

export type SignUpResult =
  | { ok: true; userId: string; accessToken: string; expiresAt: string }
  | { ok: false; code: SignUpErrorCode; message: string };
