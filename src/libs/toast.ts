import { useAppStore, type ToastPlacement } from '@/stores/app-stores';

export const toast = (text: string, options?: { placement?: ToastPlacement; duration?: number }) => {
  useAppStore.getState().showToast(text, options);
};
