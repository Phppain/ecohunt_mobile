import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'access_token';

export const AuthStorage = {
  async save(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async get(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },
};
