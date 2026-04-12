import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type AuthState = {
  isAdmin: boolean;
  csrfToken: string | null;
};

export type AuthAction = {
  setIsAdmin: (_isAdmin: boolean) => void;
  setCsrfToken: (_csrfToken: string) => void;
};

export type AuthStore = AuthState & AuthAction;

export const useAuthStore = create<AuthStore>()(
  devtools((set) => ({
    isAdmin: false,
    csrfToken: null,
    setIsAdmin: (isAdmin) => set({ isAdmin }),
    setCsrfToken: (csrfToken) => set({ csrfToken }),
  })),
);
