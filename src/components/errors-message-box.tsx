import { cn } from '@/libs/utils';
import { useAppStore } from '@/stores/app-store';
import { MessageBox } from '@ui5/webcomponents-react/MessageBox';

export function ErrorsMessageBox() {
  const errors = useAppStore((state) => state.errors);
  const setErrors = useAppStore((state) => state.setErrors);

  if (errors.length === 0) return null;

  const uniqueErrors = Array.from(new Set(errors));

  return (
    <MessageBox
      open
      titleText="Error(s)"
      type="Error"
      onClose={() => {
        setErrors(() => []);
      }}
    >
      <ul className={cn({ 'list-disc list-inside': uniqueErrors.length > 1 })}>
        {uniqueErrors.map((message, index) => (
          <li key={message + index}>{message}</li>
        ))}
      </ul>
    </MessageBox>
  );
}
