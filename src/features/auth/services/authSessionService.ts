import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthSession, AuthSessionStatus } from '../types/authSession.types';

const STORAGE_KEY = '@my-date-app/auth/session';

async function readSession(): Promise<AuthSession | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

function sessionStatus(session: AuthSession | null, now = new Date()): AuthSessionStatus {
  if (!session?.accessToken?.trim() || !session.userId?.trim()) {
    return 'none';
  }
  const expiresAt = new Date(session.expiresAt);
  if (Number.isNaN(expiresAt.getTime()) || expiresAt <= now) {
    return 'expired';
  }
  return 'valid';
}

export const authSessionService = {
  async warmUp(): Promise<void> {
    await AsyncStorage.getItem(STORAGE_KEY);
  },

  async getSessionStatus(): Promise<AuthSessionStatus> {
    const session = await readSession();
    return sessionStatus(session);
  },

  async isLoggedIn(): Promise<boolean> {
    return (await this.getSessionStatus()) === 'valid';
  },

  /** 만료·형식 오류 세션 제거 (스플래시 직전 호출) */
  async clearInvalidSessions(): Promise<void> {
    const session = await readSession();
    if (!session) {
      return;
    }
    if (sessionStatus(session) !== 'valid') {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  },

  /** @deprecated clearInvalidSessions 사용 */
  async clearExpiredSession(): Promise<void> {
    await this.clearInvalidSessions();
  },

  async saveSession(session: AuthSession): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  },

  async signOut(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },

  /** 개발·체험용 임시 로그인 */
  async signInDemo(): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);
    await this.saveSession({
      accessToken: `demo-${Date.now()}`,
      expiresAt: expiresAt.toISOString(),
      userId: 'demo',
    });
  },
};
