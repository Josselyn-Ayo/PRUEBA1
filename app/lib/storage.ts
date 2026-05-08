import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = Platform.OS === 'web'
  ? { getItem: async (k: string) => localStorage.getItem(k), setItem: async (k: string, v: string) => { localStorage.setItem(k, v); }, removeItem: async (k: string) => { localStorage.removeItem(k); } }
  : AsyncStorage;

export const setUserData = async (userId: string, key: string, value: any) => {
  const storageKey = `@gastro:user:${userId}:${key}`;
  await storage.setItem(storageKey, JSON.stringify(value));
};

export const getUserData = async (userId: string, key: string) => {
  const storageKey = `@gastro:user:${userId}:${key}`;
  const s = await storage.getItem(storageKey);
  return s ? JSON.parse(s) : null;
};

export const removeUserData = async (userId: string, key: string) => {
  const storageKey = `@gastro:user:${userId}:${key}`;
  await storage.removeItem(storageKey);
};
