export type AuthSession = {
  accessToken: string;
  expiresAt: string;
  userId: string;
};

export type AuthSessionStatus = 'valid' | 'expired' | 'none';
