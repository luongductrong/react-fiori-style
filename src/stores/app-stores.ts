import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ToastPlacement =
  | 'TopStart'
  | 'TopCenter'
  | 'TopEnd'
  | 'MiddleStart'
  | 'MiddleCenter'
  | 'MiddleEnd'
  | 'BottomStart'
  | 'BottomCenter'
  | 'BottomEnd';

export type ToastState = {
  id: number;
  text: string;
  options?: {
    placement?: ToastPlacement;
    duration?: number;
  };
};

export type AppState = {
  viewMode: 'table' | 'grid';
  toast: ToastState;
  csrfToken: string | null;
  currentUserRole: 'ADMIN' | 'USER' | '';
};

export type AppAction = {
  setViewMode: (viewMode: AppState['viewMode']) => void;
  showToast: (text: string, options?: ToastState['options']) => void;
  clearToast: () => void;
  setCsrfToken: (csrfToken: string) => void;
  setViewMode: (_viewMode: AppState['viewMode']) => void;
  setCurrentUserRole: (_role: AppState['currentUserRole']) => void;
};

export type AppStore = AppState & AppAction;

function getStoredCurrentUserRole(): AppState['currentUserRole'] {
  const value = sessionStorage.getItem('current-user-role');

  return value === 'ADMIN' ? 'ADMIN' : value === 'USER' ? 'USER' : '';
}

export const useAppStore = create<AppStore>()(
  devtools((set) => ({
    viewMode: 'table',
    currentUserRole: getStoredCurrentUserRole(),
    setViewMode: (viewMode) => set({ viewMode }),

    toast: {
      id: 0,
      text: '',
      options: undefined,
    },
    showToast: (text, options) =>
      set((state) => ({
        toast: {
          id: state.toast.id + 1,
          text,
          options,
        },
      })),
    clearToast: () =>
      set((state) => ({
        toast: {
          ...state.toast,
          text: '',
          options: undefined,
        },
      })),

    csrfToken: null,
    setCsrfToken: (csrfToken) => set({ csrfToken }),
    setCurrentUserRole: (currentUserRole) => {
      sessionStorage.setItem('current-user-role', currentUserRole);
      set({ currentUserRole });
    },
  })),
);
