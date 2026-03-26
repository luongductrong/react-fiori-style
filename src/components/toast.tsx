import { useAppStore } from '@/stores/app-stores';
import { Toast } from '@ui5/webcomponents-react/Toast';

export const Toaster = () => {
  const toast = useAppStore((state) => state.toast);
  const clearToast = useAppStore((state) => state.clearToast);

  if (!toast.text) return null;

  return (
    <Toast
      key={toast.id}
      open
      className="px-2 py-1"
      duration={toast.options?.duration ?? 3000}
      placement={toast.options?.placement ?? 'BottomCenter'}
      onClose={clearToast}
    >
      {toast.text}
    </Toast>
  );
};
