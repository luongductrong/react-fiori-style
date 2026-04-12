import { useAppStore, type ToastPlacement } from '@/stores/app-store';

export const toast = (text: string, options?: { placement?: ToastPlacement; duration?: number }) => {
  useAppStore.getState().showToast(text, options);
};
