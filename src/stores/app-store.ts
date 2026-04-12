import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DEFAULT_VIEW_MODE } from '@/app-constant';

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
  errors: string[];
};

export type AppAction = {
  setViewMode: (viewMode: AppState['viewMode']) => void;
  showToast: (text: string, options?: ToastState['options']) => void;
  clearToast: () => void;
  setErrors: (updater: (prev: string[]) => string[]) => void;
};

export type AppStore = AppState & AppAction;

export const useAppStore = create<AppStore>()(
  devtools((set) => ({
    viewMode: DEFAULT_VIEW_MODE,
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

    errors: [],
    setErrors: (updater: (prev: string[]) => string[]) =>
      set((state) => ({
        errors: updater(state.errors),
      })), // function updater
  })),
);
