import { toast } from '@/libs/toast';
import { Button } from '@ui5/webcomponents-react';

export function ToastDemoView() {
  const handleShowToast = function () {
    toast('Toast message');
  };

  const handleShowToast2 = function () {
    toast('Toast message 2', {
      placement: 'TopCenter',
      duration: 5000,
    });
  };

  const handleShowToast3 = function () {
    toast('Toast message 3', {
      placement: 'TopEnd',
    });
  };

  const handleShowToast4 = function () {
    toast('Toast message 4', {
      duration: 5000,
    });
  };

  return (
    <div className="flex h-screen items-center justify-center gap-6">
      <Button design="Positive" onClick={handleShowToast}>
        Show Toast
      </Button>
      <Button design="Negative" onClick={handleShowToast2}>
        Show Toast 2
      </Button>
      <Button design="Positive" onClick={handleShowToast3}>
        Show Toast 3
      </Button>
      <Button design="Negative" onClick={handleShowToast4}>
        Show Toast 4
      </Button>
    </div>
  );
}
