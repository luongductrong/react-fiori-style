import * as React from 'react';
import { toast } from '@/libs/toast';
import { useNavigate } from 'react-router';
import { FilePicker } from './file-picker';
import { formatFileSize } from '../helpers';
import { FilePreview } from './file-preview';
import { validateFileName } from '../validate';
import type { UploadedFileData } from '../types';
import { pushErrorMessages } from '@/libs/errors';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { Text } from '@ui5/webcomponents-react/Text';
import { Input } from '@ui5/webcomponents-react/Input';
import { Label } from '@ui5/webcomponents-react/Label';
import { Dialog } from '@ui5/webcomponents-react/Dialog';
import { Button } from '@ui5/webcomponents-react/Button';
import { GoogleDrivePicker } from './google-drive-picker';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { BusyIndicator } from '@/components/busy-indicator';
import { buildFileName, getEditableFileName } from '../helpers';
import { resolveUploadTypeByExtension } from '../upload-config';
import { uploadVersionMutationOptions } from '../options/mutation';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { configFilesQueryOptions } from '@/features/config-files/options/query';

interface FileUploadProps {
  fileId: string;
  currentExtension: string;
  disabled?: boolean;
}

export function FileUpload(props: FileUploadProps) {
  return <FileUploadImpl key={props.fileId} {...props} />;
}

function FileUploadImpl({ fileId, currentExtension, disabled }: FileUploadProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [driveLoading, setDriveLoading] = React.useState(false);
  const [open, setOpen] = React.useState<'local' | 'drive' | null>(null);
  const [fileData, setFileData] = React.useState<UploadedFileData | null>(null);
  const [fileNameDraft, setFileNameDraft] = React.useState('');
  const [fileNameError, setFileNameError] = React.useState('');
  const { data: configFilesData } = useQuery(
    configFilesQueryOptions({
      'sap-client': 324,
    }),
  );
  const requiredType = React.useMemo(
    () => resolveUploadTypeByExtension(currentExtension, configFilesData?.value),
    [configFilesData?.value, currentExtension],
  );

  const { mutate: uploadVersion, isPending } = useMutation(
    uploadVersionMutationOptions({
      onSuccess: (data) => {
        toast('File uploaded successfully');
        setFileData(null);
        setFileNameDraft('');
        setFileNameError('');
        setOpen(null);
        queryClient.invalidateQueries({
          queryKey: ['attachments', fileId],
        });
        navigate(`/attachments/${data.FileId}`);
      },
    }),
  );

  const handleSubmit = function () {
    if (!fileData) {
      pushErrorMessages(['Please select a file to upload']);
      return;
    }

    const nextFileName = buildFileName(fileNameDraft, fileData.FileExtension);
    const nextFileNameError = validateFileName(nextFileName);

    if (nextFileNameError) {
      setFileNameError(nextFileNameError);
      pushErrorMessages([nextFileNameError]);
      return;
    }

    uploadVersion({
      FileId: fileId,
      FileName: nextFileName,
      FileContent: fileData.FileContent,
      FileExtension: fileData.FileExtension,
      MimeType: fileData.MimeType,
      FileSize: fileData.FileSize,
    });
  };

  const handleClose = function () {
    if (isPending) {
      return;
    }
    setFileData(null);
    setFileNameDraft('');
    setFileNameError('');
    setOpen(null);
  };

  const handleFileNameInput = function (value: string) {
    setFileNameDraft(value);
    setFileNameError(fileData ? validateFileName(buildFileName(value, fileData.FileExtension)) : '');
  };

  if (fileData) {
    return (
      <Dialog
        open={true}
        resizable
        draggable
        headerText="Upload New File"
        className="md:min-w-4xl relative"
        footer={
          <Bar
            design="Footer"
            endContent={
              <React.Fragment>
                <Button
                  design="Emphasized"
                  onClick={handleSubmit}
                  disabled={isPending || !fileData || !!fileNameError}
                  className="h-8"
                >
                  Save
                </Button>
                <Button design="Transparent" onClick={handleClose} disabled={isPending} className="h-8">
                  Cancel
                </Button>
              </React.Fragment>
            }
          />
        }
        onClose={handleClose}
      >
        <FlexBox direction="Column" className="gap-1 mb-4">
          <Label showColon>File Name</Label>
          <FlexBox alignItems="Center" className="gap-1 w-full">
            <Input
              className="w-4/5 md:w-lg h-8"
              value={fileNameDraft}
              placeholder="Enter file name"
              valueState={fileNameError ? 'Negative' : 'None'}
              valueStateMessage={fileNameError ? <Text>{fileNameError}</Text> : undefined}
              onInput={(event) => handleFileNameInput(event.target.value)}
            />
            <Text className="font-semibold">{fileData?.FileExtension ? `.${fileData.FileExtension}` : ''}</Text>
          </FlexBox>
        </FlexBox>
        <FlexBox alignItems="Start" justifyContent="Start" wrap="Wrap" className="gap-8 mb-6">
          <FlexBox direction="Column">
            <Label showColon>File Size</Label>
            <Text>{fileData?.FileSize ? formatFileSize(fileData.FileSize) : '-'}</Text>
          </FlexBox>
          <FlexBox direction="Column">
            <Label showColon>Mime Type</Label>
            <Text>{fileData?.MimeType || '-'}</Text>
          </FlexBox>
        </FlexBox>
        <FilePreview
          mimeType={fileData.MimeType}
          fileContent={fileData.FileContent}
          fileName={fileData.FileName}
          fileExtension={fileData.FileExtension}
          className="p-2"
        />
        <BusyIndicator type="pending" show={isPending} />
      </Dialog>
    );
  }

  if (open === 'drive' && !driveLoading) {
    return (
      <GoogleDrivePicker
        onLoadingChange={(loading) => {
          setDriveLoading(loading);
        }}
        requiredType={requiredType}
        onPick={(nextFileData) => {
          setFileData(nextFileData);
          if (nextFileData) {
            setFileNameDraft(getEditableFileName(nextFileData.FileName, nextFileData.FileExtension));
            setFileNameError(validateFileName(nextFileData.FileName));
          }
        }}
        onPickCancel={() => setOpen('local')}
      />
    );
  }

  return (
    <React.Fragment>
      <ToolbarButton
        design="Transparent"
        text="Upload"
        onClick={() => setOpen('local')}
        disabled={disabled || !fileId || !currentExtension}
        className="h-8"
      />
      <Dialog
        open={open === 'local' || driveLoading}
        resizable
        draggable
        headerText="Upload New File"
        className="md:min-w-4xl relative"
        footer={
          <Bar
            design="Footer"
            endContent={
              <React.Fragment>
                <Button
                  design="Emphasized"
                  onClick={handleSubmit}
                  disabled={driveLoading || isPending || !fileData || !!fileNameError}
                  className="h-8"
                >
                  Save
                </Button>
                <Button design="Transparent" onClick={handleClose} disabled={driveLoading || isPending} className="h-8">
                  Cancel
                </Button>
              </React.Fragment>
            }
          />
        }
        onClose={handleClose}
      >
        <FilePicker
          disabled={driveLoading}
          requiredType={requiredType}
          onGoogleBtnClick={() => setOpen('drive')}
          onPick={(nextFileData) => {
            setFileData(nextFileData);
            if (nextFileData) {
              setFileNameDraft(getEditableFileName(nextFileData.FileName, nextFileData.FileExtension));
              setFileNameError(validateFileName(nextFileData.FileName));
            }
          }}
        />
        <BusyIndicator type="pending" show={driveLoading || isPending} />
      </Dialog>
    </React.Fragment>
  );
}

// TODO: Allows uploading attachments directly within the BO.
