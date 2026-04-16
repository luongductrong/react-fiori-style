import * as React from 'react';
import type { ConfigFileItem } from '../types';
import { cn, formatFileSize } from '@/libs/utils';
import { Input } from '@ui5/webcomponents-react/Input';
import { Text } from '@ui5/webcomponents-react/Text';
import { Label } from '@ui5/webcomponents-react/Label';
import { Select } from '@ui5/webcomponents-react/Select';
import { Option } from '@ui5/webcomponents-react/Option';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';

export type ConfigFileFormValues = {
  fileExt: string;
  mimeType: string;
  maxBytes: string;
  description: string;
  type: ConfigFileItem['Type'];
};

interface ConfigFileFormProps {
  value: ConfigFileFormValues;
  onChange: (_nextValue: ConfigFileFormValues) => void;
  className?: string;
  fieldClassName?: string;
  inputClassName?: string;
  disableFileExt?: boolean;
}

export function ConfigFileForm({
  value,
  onChange,
  className,
  fieldClassName,
  inputClassName,
  disableFileExt = false,
}: ConfigFileFormProps) {
  const id = React.useId();

  return (
    <div className={cn('grid gap-4 p-2 md:grid-cols-2', className)}>
      <div className={cn('flex flex-col', fieldClassName)}>
        <Label showColon required for={`${id}-file-ext`}>
          File Extension
        </Label>
        <Input
          id={`${id}-file-ext`}
          required
          disabled={disableFileExt}
          className={inputClassName}
          value={value.fileExt}
          placeholder="Enter file extension, e.g. pdf"
          onInput={(event) =>
            onChange({
              ...value,
              fileExt: event.target.value,
            })
          }
        />
      </div>
      <div className={cn('flex flex-col', fieldClassName)}>
        <Label showColon required for={`${id}-type`}>
          Type
        </Label>
        <Select
          id={`${id}-type`}
          required
          className={inputClassName}
          value={value.type}
          onChange={(event) =>
            onChange({
              ...value,
              type: (event.detail.selectedOption?.value || value.type) as ConfigFileItem['Type'],
            })
          }
        >
          <Option value="DOCUMENT">Document</Option>
          <Option value="IMAGE">Image</Option>
        </Select>
      </div>
      <div className={cn('flex flex-col', fieldClassName)}>
        <Label showColon required for={`${id}-max-bytes`}>
          Max Bytes
        </Label>
        <FlexBox alignItems="Center" className="gap-2">
          <Input
            id={`${id}-max-bytes`}
            required
            type="Number"
            className={inputClassName}
            value={value.maxBytes}
            placeholder="Enter max bytes"
            onInput={(event) =>
              onChange({
                ...value,
                maxBytes: event.target.value,
              })
            }
          />
          <Text>{value.maxBytes.trim() ? formatFileSize(value.maxBytes) : '-'}</Text>
        </FlexBox>
      </div>
      <div className={cn('flex flex-col md:col-span-2', fieldClassName)}>
        <Label showColon required for={`${id}-mime-type`}>
          Mime Type
        </Label>
        <Input
          id={`${id}-mime-type`}
          required
          className={cn('w-full', inputClassName)}
          value={value.mimeType}
          placeholder="Enter MIME type"
          onInput={(event) =>
            onChange({
              ...value,
              mimeType: event.target.value,
            })
          }
        />
      </div>
      <div className={cn('flex flex-col md:col-span-2', fieldClassName)}>
        <Label showColon required for={`${id}-description`}>
          Description
        </Label>
        <Input
          id={`${id}-description`}
          required
          className={cn('w-full', inputClassName)}
          value={value.description}
          placeholder="Enter description"
          onInput={(event) =>
            onChange({
              ...value,
              description: event.target.value,
            })
          }
        />
      </div>
    </div>
  );
}
