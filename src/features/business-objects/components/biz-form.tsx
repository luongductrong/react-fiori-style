import * as React from 'react';
import { cn } from '@/libs/utils';
import { BO_TYPES, BO_STATUS } from '../constants';
import { Input } from '@ui5/webcomponents-react/Input';
import { Label } from '@ui5/webcomponents-react/Label';
import { Option } from '@ui5/webcomponents-react/Option';
import { Select } from '@ui5/webcomponents-react/Select';
import { displayBoType, displayBoStatus } from '../helpers/formatter';

export type BizFormValues = {
  title: string;
  type: string;
  status: string;
};

interface BizFormProps {
  value: BizFormValues;
  onChange: (_nextValue: BizFormValues) => void;
  className?: string;
  fieldClassName?: string;
  inputClassName?: string;
}

export function BizForm({ value, onChange, className, fieldClassName, inputClassName }: BizFormProps) {
  const id = React.useId();

  return (
    <div className={cn('space-y-2', className)}>
      <div className={cn('flex flex-col', fieldClassName)}>
        <Label showColon required for={`${id}-title`}>
          Title
        </Label>
        <Input
          id={`${id}-title`}
          required
          className={cn('w-full md:w-8/10', inputClassName)}
          value={value.title}
          onInput={(event) =>
            onChange({
              ...value,
              title: event.target.value,
            })
          }
        />
      </div>
      <div className={cn('flex flex-col', fieldClassName)}>
        <Label for={`${id}-type`} showColon required>
          Type
        </Label>
        <Select
          id={`${id}-type`}
          required
          className={cn('w-full md:w-8/10', inputClassName)}
          value={value.type || ''}
          onChange={(event) =>
            onChange({
              ...value,
              type: event.detail.selectedOption?.value || '',
            })
          }
        >
          <Option value="">Select type</Option>
          {BO_TYPES.map((type) => (
            <Option key={type} value={type}>
              {displayBoType(type)}
            </Option>
          ))}
        </Select>
      </div>
      <div className={cn('flex flex-col', fieldClassName)}>
        <Label for={`${id}-status`} showColon required>
          Status
        </Label>
        <Select
          id={`${id}-status`}
          required
          className={cn('w-full md:w-8/10', inputClassName)}
          value={value.status || ''}
          onChange={(event) =>
            onChange({
              ...value,
              status: event.detail.selectedOption?.value || '',
            })
          }
        >
          <Option value="">Select status</Option>
          {BO_STATUS.map((status) => (
            <Option key={status} value={status}>
              {displayBoStatus(status)}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
}
