import * as React from 'react';
import '@ui5/webcomponents-icons/decline.js';
import { MAX_FILE_SIZE } from '@/app-constant';
import type { ConfigFileItem } from '../types';
import { cn, formatFileSize } from '@/libs/utils';
import { Text } from '@ui5/webcomponents-react/Text';
import { Input } from '@ui5/webcomponents-react/Input';
import { Label } from '@ui5/webcomponents-react/Label';
import { Button } from '@ui5/webcomponents-react/Button';
import { Select } from '@ui5/webcomponents-react/Select';
import { Option } from '@ui5/webcomponents-react/Option';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { normalizeMimeTypeToken } from '../helpers/mime-types';
import { EMPTY_CONFIG_FILE_FORM_VALIDATION, type ConfigFileFormValidation } from '../validate';

export type ConfigFileFormValues = {
  fileExt: string;
  mimeTypes: string[];
  maxBytes: string;
  description: string;
  type: ConfigFileItem['Type'];
};

export type ConfigFileFormTouchedFields = {
  fileExt: boolean;
  mimeTypes: boolean;
  maxBytes: boolean;
  description: boolean;
};

interface ConfigFileFormProps {
  value: ConfigFileFormValues;
  validation: ConfigFileFormValidation;
  touchedFields: ConfigFileFormTouchedFields;
  showAllValidation?: boolean;
  onFieldTouch: (_field: keyof ConfigFileFormTouchedFields) => void;
  onChange: (_nextValue: ConfigFileFormValues) => void;
  className?: string;
  fieldClassName?: string;
  inputClassName?: string;
  disableFileExt?: boolean;
}

export function ConfigFileForm({
  value,
  validation,
  touchedFields,
  showAllValidation = false,
  onFieldTouch,
  onChange,
  className,
  fieldClassName,
  inputClassName,
  disableFileExt = false,
}: ConfigFileFormProps) {
  const id = React.useId();
  const mimeTypes = React.useMemo(() => (value.mimeTypes.length > 0 ? value.mimeTypes : ['']), [value.mimeTypes]);
  const visibleValidation = React.useMemo(
    () => ({
      fileExt:
        showAllValidation || touchedFields.fileExt ? validation.fileExt : EMPTY_CONFIG_FILE_FORM_VALIDATION.fileExt,
      mimeTypes:
        showAllValidation || touchedFields.mimeTypes
          ? validation.mimeTypes
          : EMPTY_CONFIG_FILE_FORM_VALIDATION.mimeTypes,
      maxBytes:
        showAllValidation || touchedFields.maxBytes ? validation.maxBytes : EMPTY_CONFIG_FILE_FORM_VALIDATION.maxBytes,
      description:
        showAllValidation || touchedFields.description
          ? validation.description
          : EMPTY_CONFIG_FILE_FORM_VALIDATION.description,
    }),
    [showAllValidation, touchedFields, validation],
  );

  const handleMimeTypeChange = function (index: number, nextMimeType: string) {
    const nextMimeTypes = mimeTypes.map((mimeType, mimeTypeIndex) =>
      mimeTypeIndex === index ? nextMimeType : mimeType,
    );

    onFieldTouch('mimeTypes');
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
          valueState={visibleValidation.fileExt ? 'Negative' : 'None'}
          valueStateMessage={visibleValidation.fileExt ? <Text>{visibleValidation.fileExt}</Text> : undefined}
          onInput={(event) => (
            onFieldTouch('fileExt'),
            onChange({
              ...value,
              fileExt: event.target.value,
            })
          )}
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
            valueState={visibleValidation.maxBytes ? 'Negative' : 'None'}
            valueStateMessage={visibleValidation.maxBytes ? <Text>{visibleValidation.maxBytes}</Text> : undefined}
            onInput={(event) => (
              onFieldTouch('maxBytes'),
              onChange({
                ...value,
                maxBytes: event.target.value,
              })
            )}
          />
          <Text>{value.maxBytes.trim() ? formatFileSize(value.maxBytes) : '-'}</Text>
        </FlexBox>
        <Text className="mt-1 text-xs text-muted-foreground">System limit: {formatFileSize(MAX_FILE_SIZE)}</Text>
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
            const isInvalidMimeType =
              !!normalizedMimeType && visibleValidation.mimeTypes.invalidMimeTypes.includes(normalizedMimeType);

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
                  tooltip="Remove MIME type"
                  onClick={() => handleRemoveMimeType(index)}
                  disabled={mimeTypes.length === 1}
                />
              </FlexBox>
            );
          })}
        </div>
        {visibleValidation.mimeTypes.error ? (
          <Text className="mt-1 text-xs text-red-600">{visibleValidation.mimeTypes.error}</Text>
        ) : null}
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
          valueState={visibleValidation.description ? 'Negative' : 'None'}
          valueStateMessage={visibleValidation.description ? <Text>{visibleValidation.description}</Text> : undefined}
          onInput={(event) => (
            onFieldTouch('description'),
            onChange({
              ...value,
              description: event.target.value,
            })
          )}
        />
      </div>
    </div>
  );
}
