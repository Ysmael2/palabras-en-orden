// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { PersistStorage, StorageValue } from 'zustand/middleware';

const localStorageAdapter: PersistStorage<AuthState> = {
  getItem: (name: string): Promise<StorageValue<AuthState> | null> => {
    const item = localStorage.getItem(name);
    
    return Promise.resolve(item ? JSON.parse(item) : null);
  },
  setItem: (name: string, value: StorageValue<AuthState>): void => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
};

type User = {
  id: string;
  username: string;
  email: string;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
      storage: localStorageAdapter, // Usa la propiedad correcta "storage"
    }
  )
);

