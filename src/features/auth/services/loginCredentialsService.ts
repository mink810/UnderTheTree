import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_USER_ID_KEY = '@my-date-app/auth/saved-login-id';

export const loginCredentialsService = {
  async getSavedUserId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(SAVED_USER_ID_KEY);
    } catch {
      return null;
    }
  },

  async persistSavedUserId(userId: string | null): Promise<void> {
    if (!userId?.trim()) {
      await AsyncStorage.removeItem(SAVED_USER_ID_KEY);
      return;
    }
    await AsyncStorage.setItem(SAVED_USER_ID_KEY, userId.trim());
  },
};
