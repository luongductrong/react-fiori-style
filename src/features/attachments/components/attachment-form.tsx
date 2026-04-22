import * as React from 'react';
import { cn } from '@/libs/utils';
import { Text } from '@ui5/webcomponents-react/Text';
import { Input } from '@ui5/webcomponents-react/Input';
import { Label } from '@ui5/webcomponents-react/Label';
import { CheckBox } from '@ui5/webcomponents-react/CheckBox';

export type AttachmentFormValues = {
  title: string;
  editLock: boolean;
};

interface AttachmentFormProps {
  value: AttachmentFormValues;
  onChange: (nextValue: AttachmentFormValues) => void;
  className?: string;
  fieldClassName?: string;
  inputClassName?: string;
  titleError?: string;
  titleLabel?: string;
  canChangeLockEdit?: boolean;
}

export function AttachmentForm({
  value,
  onChange,
  className,
  fieldClassName,
  inputClassName,
  titleError,
  titleLabel = 'Title',
  canChangeLockEdit = false,
}: AttachmentFormProps) {
  const id = React.useId();

  return (
    <div className={cn('space-y-2', className)}>
      <div className={cn('flex flex-col', fieldClassName)}>
        <Label showColon required for={`${id}-title`}>
          {titleLabel}
        </Label>
        <Input
          id={`${id}-title`}
          required
          className={cn('w-full md:w-8/10', inputClassName)}
          value={value.title}
          valueState={titleError ? 'Negative' : 'None'}
          valueStateMessage={titleError ? <Text>{titleError}</Text> : undefined}
          onInput={(event) =>
            onChange({
              ...value,
              title: event.target.value,
            })
          }
        />
      </div>
      <div className={cn('flex flex-col', fieldClassName)}>
        <Label for={`${id}-edit-lock`} showColon>
          Edit Lock
        </Label>
        <CheckBox
          id={`${id}-edit-lock`}
          checked={value.editLock}
          text="Prevent others from editing"
          disabled={!canChangeLockEdit}
          onChange={(event) =>
            onChange({
              ...value,
              editLock: event.target.checked ?? false,
            })
          }
        />
      </div>
    </div>
  );
}
