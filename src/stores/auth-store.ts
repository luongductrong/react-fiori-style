import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type AuthState = {
  csrfToken: string | null;
  googleAccessToken: string | null;
};

export type AuthAction = {
  setCsrfToken: (csrfToken: string | null) => void;
  setGoogleAccessToken: (googleAccessToken: string | null) => void;
};

export type AuthStore = AuthState & AuthAction;

export const useAuthStore = create<AuthStore>()(
  devtools((set) => ({
    csrfToken: null,
    googleAccessToken: null,
    setCsrfToken: (csrfToken) => set({ csrfToken }),
    setGoogleAccessToken: (googleAccessToken) => set({ googleAccessToken }),
  })),
);
