import * as React from 'react';
import { cn } from '@/libs/utils';
import type { UploadedFileData } from '../types';
import { useQuery } from '@tanstack/react-query';
import { pushErrorMessages } from '@/libs/errors';
import { GoogleDriveIcon } from '@/components/icons';
import '@ui5/webcomponents-icons/upload-to-cloud.js';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { fileToUploadedFileData } from '../upload-file';
import { BusyIndicator } from '@/components/busy-indicator';
import { Button, type ButtonPropTypes } from '@ui5/webcomponents-react/Button';
import { configFilesQueryOptions } from '@/features/config-files/options/query';
import { buildUploadAcceptValue, findMatchingUploadConfig } from '../upload-config';
import { getAllowedUploadExtensions, validateUploadFileData } from '../upload-config';
import { FileUploader, type FileUploaderPropTypes } from '@ui5/webcomponents-react/FileUploader';

interface FilePickerProps {
  disabled: boolean;
  onGoogleBtnClick: () => void;
  onPick: (fileData: UploadedFileData) => void;
  className?: string;
}

export function FilePicker({ disabled, onPick, onGoogleBtnClick, className }: FilePickerProps) {
  const [loading, setLoading] = React.useState(false);
  const { data: configFilesData } = useQuery(
    configFilesQueryOptions({
      'sap-client': 324,
    }),
  );
  const acceptedFileTypes = React.useMemo(
    () => buildUploadAcceptValue(configFilesData?.value),
    [configFilesData?.value],
  );
  const allowedExtensions = React.useMemo(
    () => getAllowedUploadExtensions(configFilesData?.value),
    [configFilesData?.value],
  );
  const allowedTypesLabel = !configFilesData
    ? 'Loading upload configuration...'
    : allowedExtensions.length > 0
      ? allowedExtensions.join(', ')
      : 'No active upload configuration';

  const handleDriveBtnClick: ButtonPropTypes['onClick'] = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    onGoogleBtnClick();
  };

  const handleChange: FileUploaderPropTypes['onChange'] = async function (event) {
    if (disabled || loading) return;
    const file: File | undefined = event.target?.files?.[0];
    if (!file) return;

    const matchedConfig = findMatchingUploadConfig(
      {
        fileName: file.name,
        mimeType: file.type,
      },
      configFilesData?.value,
    );
    const validationMessage = validateUploadFileData(
      {
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
      },
      configFilesData?.value,
    );

    if (validationMessage) {
      pushErrorMessages([validationMessage]);
      if (event.target) {
        event.target.value = '';
      }
      return;
    }

    try {
      setLoading(true);
      const fileData = await fileToUploadedFileData(file, matchedConfig?.MaxBytes);
      onPick(fileData);
    } catch (err) {
      console.error(err);
      pushErrorMessages([err instanceof Error ? err.message : "Can't read file"]);
    } finally {
      // Clear the input so selecting the same file again still fires onChange.
      if (event.target) {
        event.target.value = '';
      }
      setLoading(false);
    }
  };

  return (
    <div className={cn('w-full relative', className)}>
      <FileUploader
        accept={acceptedFileTypes || undefined}
        hideInput
        onChange={handleChange}
        className="w-full"
        disabled={disabled || loading}
      >
        <div className="w-full min-h-[50dvh] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer p-6">
          <div className="text-base text-center font-medium">
            <Icon className="size-10 text-primary" name="upload-to-cloud" />
            <p className="text-lg font-semibold">Drop file here</p>
            <p className="text-muted-foreground text-sm">or click to choose</p>
            <p className="text-muted-foreground text-sm">or from</p>
            <Button
              onClick={handleDriveBtnClick}
              className="inline-flex items-center"
              design="Transparent"
              disabled={disabled || loading}
            >
              <GoogleDriveIcon className="inline-block mr-1 size-5" />
              <span className="text-sm">Google Drive</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Size limits are applied from server configuration.</p>
          <p className="text-sm text-muted-foreground mt-1">Allowed types: {allowedTypesLabel}</p>
        </div>
      </FileUploader>
      <BusyIndicator type="pending" show={loading} />
    </div>
  );
}
