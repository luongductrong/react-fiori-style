import * as React from 'react';
import '@ui5/webcomponents-icons/decline.js';
import type { ConfigFileItem } from '../types';
import { cn, formatFileSize } from '@/libs/utils';
import { Text } from '@ui5/webcomponents-react/Text';
import { Input } from '@ui5/webcomponents-react/Input';
import { Label } from '@ui5/webcomponents-react/Label';
import { Button } from '@ui5/webcomponents-react/Button';
import { Select } from '@ui5/webcomponents-react/Select';
import { Option } from '@ui5/webcomponents-react/Option';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { findInvalidMimeTypes, normalizeMimeTypeToken } from '../helpers/mime-types';

export type ConfigFileFormValues = {
  fileExt: string;
  mimeTypes: string[];
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
  const mimeTypes = React.useMemo(() => (value.mimeTypes.length > 0 ? value.mimeTypes : ['']), [value.mimeTypes]);
  const invalidMimeTypes = React.useMemo(() => findInvalidMimeTypes(mimeTypes), [mimeTypes]);

  const handleMimeTypeChange = function (index: number, nextMimeType: string) {
    const nextMimeTypes = mimeTypes.map((mimeType, mimeTypeIndex) =>
      mimeTypeIndex === index ? nextMimeType : mimeType,
    );

    onChange({
      ...value,
      mimeTypes: nextMimeTypes,
    });
  };

  const handleAddMimeType = function () {
    onChange({
      ...value,
      mimeTypes: [...mimeTypes, ''],
    });
  };

  const handleRemoveMimeType = function (index: number) {
    const nextMimeTypes = mimeTypes.filter((_, mimeTypeIndex) => mimeTypeIndex !== index);

    onChange({
      ...value,
      mimeTypes: nextMimeTypes.length > 0 ? nextMimeTypes : [''],
    });
  };

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
        <FlexBox justifyContent="SpaceBetween" alignItems="Center" className="gap-2">
          <Label showColon required for={`${id}-mime-type-0`}>
            Mime Types
          </Label>
          <Button design="Transparent" onClick={handleAddMimeType}>
            Add MIME Type
          </Button>
        </FlexBox>
        <div className="mt-2 space-y-2">
          {mimeTypes.map((mimeType, index) => {
            const normalizedMimeType = normalizeMimeTypeToken(mimeType);
            const isInvalidMimeType = !!normalizedMimeType && invalidMimeTypes.includes(normalizedMimeType);

            return (
              <FlexBox key={`${id}-mime-type-${index}`} alignItems="Start" className="gap-2">
                <Input
                  id={`${id}-mime-type-${index}`}
                  required={index === 0}
                  className={cn('w-full', inputClassName)}
                  value={mimeType}
                  placeholder="application/pdf"
                  valueState={isInvalidMimeType ? 'Negative' : 'None'}
                  valueStateMessage={
                    isInvalidMimeType ? <Text>Invalid MIME type: {normalizedMimeType}</Text> : undefined
                  }
                  onInput={(event) => handleMimeTypeChange(index, event.target.value)}
                />
                <Button
                  design="Transparent"
                  icon="decline"
                  onClick={() => handleRemoveMimeType(index)}
                  disabled={mimeTypes.length === 1}
                />
              </FlexBox>
            );
          })}
        </div>
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
