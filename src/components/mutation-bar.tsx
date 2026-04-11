import { Bar } from '@ui5/webcomponents-react/Bar';
import { Button } from '@ui5/webcomponents-react/Button';

interface MutationBarProps {
  okText?: string;
  cancelText?: string;
  onOk: () => void;
  onCancel: () => void;
  disabledOk?: boolean;
  disabledCancel?: boolean;
}

export function MutationBar({
  okText = 'OK',
  cancelText = 'Cancel',
  onOk,
  onCancel,
  disabledOk,
  disabledCancel,
}: MutationBarProps) {
  return (
    <Bar
      className="fixed left-2 bottom-2 w-[calc(100%-2rem)]"
      design="FloatingFooter"
      endContent={
        <>
          <Button design="Emphasized" onClick={() => onOk()} disabled={disabledOk} className="h-8">
            {okText}
          </Button>
          <Button design="Transparent" onClick={() => onCancel()} disabled={disabledCancel} className="h-8">
            {cancelText}
          </Button>
        </>
      }
    />
  );
}
