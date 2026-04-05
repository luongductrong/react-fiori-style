import * as React from 'react';
import { cn } from '@/libs/utils';
import '@ui5/webcomponents-icons/add.js';
import { FilePreview } from './file-preview';
import '@ui5/webcomponents-icons/decline.js';
import { MAX_FILE_SIZE } from '@/app-constant';
import type { UploadedFileData } from '../types';
import { GoogleDrivePicker } from '../components';
import '@ui5/webcomponents-icons/upload-to-cloud.js';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { fileToUploadedFileData } from '../upload-file';
import { Button } from '@ui5/webcomponents-react/Button';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { MessageStrip } from '@ui5/webcomponents-react/MessageStrip';
import { FileUploader, type FileUploaderPropTypes } from '@ui5/webcomponents-react/FileUploader';

interface UploadVersionProps {
  className?: string;
  onUpload?: (fileData: UploadedFileData) => void;
  onCancel?: () => void;
}

export function UploadVersion({ className, onUpload, onCancel }: UploadVersionProps) {
  const [fileData, setFileData] = React.useState<UploadedFileData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const applySelectedFile = function (nextFileData: UploadedFileData) {
    setError(null);
    setFileData(nextFileData);
    onUpload?.(nextFileData);
  };

  const handleChange: FileUploaderPropTypes['onChange'] = async function (event) {
    const file: File | undefined = event.target?.files?.[0];
    if (!file) return;

    setError(null);
    setFileData(null);

    try {
      setLoading(true);
      const payload = await fileToUploadedFileData(file, MAX_FILE_SIZE);
      applySelectedFile(payload);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Can't read file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlexBox
      direction="Column"
      alignItems="Center"
      justifyContent="Center"
      style={{ gap: '1rem' }}
      className={cn('w-full', className)}
    >
      {error && (
        <MessageStrip design="Negative" hideCloseButton>
          {error}
        </MessageStrip>
      )}
      {!fileData && (
        <FileUploader hideInput onChange={handleChange} className="w-full" disabled={loading}>
          <div className="w-full min-h-[50dvh] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer p-6">
            <div className="text-base text-center font-medium">
              <Icon className="size-10 text-primary" name="upload-to-cloud" />
              {loading ? (
                <p className="text-lg font-semibold text-muted-foreground">Processing...</p>
              ) : (
                <>
                  <p className="text-lg font-semibold">Drop file here</p>
                  <p className="text-muted-foreground text-sm">or click to choose</p>
                  <p className="text-muted-foreground text-sm">or from</p>
                  <GoogleDrivePicker
                    disabled={loading}
                    onPick={applySelectedFile}
                    onImportError={(message) => {
                      setError(message || null);
                    }}
                    onLoadingChange={(nextLoading) => {
                      setLoading(nextLoading);
                      if (nextLoading) {
                        setError(null);
                        setFileData(null);
                      }
                    }}
                  />
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Maximum size: {MAX_FILE_SIZE / 1024 / 1024}MB</p>
          </div>
        </FileUploader>
      )}
      {fileData && (
        <FlexBox direction="Row" alignItems="Center" justifyContent="SpaceBetween">
          <Button
            design="Negative"
            icon="decline"
            onClick={() => {
              setFileData(null);
              setError(null);
              onCancel?.();
            }}
          >
            Cancel
          </Button>
        </FlexBox>
      )}
      {fileData && (
        <FilePreview mimeType={fileData.MimeType} fileContent={fileData.FileContent} fileName={fileData.FileName} />
      )}
    </FlexBox>
  );
}
