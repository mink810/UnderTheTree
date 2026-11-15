import AsyncStorage from '@react-native-async-storage/async-storage';

import { MOCK_MEMBERS } from '../data/loginUsers.mock';
import { RegisteredMember } from '../types/registeredMember.types';

const STORAGE_KEY = '@my-date-app/auth/registered-members';

async function readAll(): Promise<RegisteredMember[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as RegisteredMember[];
  } catch {
    return [];
  }
}

async function writeAll(members: RegisteredMember[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

function normalizeId(userId: string): string {
  return userId.trim().toLowerCase();
}

export const memberRegistryService = {
  async listRegistered(): Promise<RegisteredMember[]> {
    return readAll();
  },

  async isUserIdTaken(userId: string): Promise<boolean> {
    const id = normalizeId(userId);
    if (!id) {
      return true;
    }
    const inMock = MOCK_MEMBERS.some((m) => normalizeId(m.userId) === id);
    if (inMock) {
      return true;
    }
    const registered = await readAll();
    return registered.some((m) => normalizeId(m.userId) === id);
  },

  async isPhoneTaken(phone: string): Promise<boolean> {
    const digits = phone.replace(/\D/g, '');
    const registered = await readAll();
    return registered.some((m) => m.phone === digits);
  },

  async register(member: RegisteredMember): Promise<void> {
    const all = await readAll();
    await writeAll([...all, member]);
  },

  async findForLogin(
    userId: string,
    password: string
  ): Promise<RegisteredMember | undefined> {
    const id = normalizeId(userId);
    const registered = await readAll();
    return registered.find(
      (m) => normalizeId(m.userId) === id && m.password === password
    );
  },
};
