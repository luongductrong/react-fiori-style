import * as React from 'react';
import { toast } from '@/libs/toast';
import { useNavigate } from 'react-router';
import { FilePicker } from './file-picker';
import { FilePreview } from './file-preview';
import { formatFileSize } from '@/libs/utils';
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
import { validateFileTitle, validateFileName } from '../validate';
import { uploadVersionMutationOptions } from '../options/mutation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAttachmentMutationOptions } from '../options/mutation';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { AttachmentForm, type AttachmentFormValues } from './attachment-form';

export function AttachmentCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [driveLoading, setDriveLoading] = React.useState(false);
  const [open, setOpen] = React.useState<'local' | 'drive' | null>(null);
  const [fileData, setFileData] = React.useState<UploadedFileData | null>(null);
  const [formValues, setFormValues] = React.useState<AttachmentFormValues>({
    title: '',
    editLock: false,
  });
  const [titleError, setTitleError] = React.useState('');
  const [fileNameDraft, setFileNameDraft] = React.useState('');
  const [fileNameError, setFileNameError] = React.useState('');

  const { mutateAsync: createAttachment, isPending: isCreatingAttachment } = useMutation(
    createAttachmentMutationOptions({}),
  );
  const { mutateAsync: uploadVersion, isPending: isUploadingFile } = useMutation(uploadVersionMutationOptions({}));

  const isPending = isCreatingAttachment || isUploadingFile;

  const resetState = function () {
    setDriveLoading(false);
    setOpen(null);
    setFileData(null);
    setFormValues({
      title: '',
      editLock: false,
    });
    setTitleError('');
    setFileNameDraft('');
    setFileNameError('');
  };

  const finalizeCreateFlow = function (fileId: string) {
    queryClient.invalidateQueries({
      queryKey: ['attachments'],
    });
    queryClient.invalidateQueries({
      queryKey: ['attachments', fileId],
    });
    resetState();
    navigate(`/attachments/${fileId}`);
  };

  const handleFilePick = function (nextFileData: UploadedFileData | null) {
    setFileData(nextFileData);
    if (!nextFileData) {
      setFileNameDraft('');
      setFileNameError('');
      return;
    }
    setFileNameDraft(getEditableFileName(nextFileData.FileName, nextFileData.FileExtension));
    setFileNameError(validateFileName(nextFileData.FileName));
  };

  const handleSubmit = async function () {
    if (!fileData) {
      pushErrorMessages(['Please select a file to upload']);
      return;
    }

    const nextTitleError = validateFileTitle(formValues.title);
    const nextFileName = buildFileName(fileNameDraft, fileData.FileExtension);
    const nextFileNameError = validateFileName(nextFileName);

    setTitleError(nextTitleError);
    if (nextFileNameError) {
      setFileNameError(nextFileNameError);
    }

    if (nextTitleError || nextFileNameError) {
      return;
    }

    try {
      const createdAttachment = await createAttachment({
        Title: formValues.title.trim(),
        EditLock: formValues.editLock,
      });

      try {
        await uploadVersion({
          FileId: createdAttachment.FileId,
          FileName: nextFileName,
          FileContent: fileData.FileContent,
          FileExtension: fileData.FileExtension,
          MimeType: fileData.MimeType,
          FileSize: fileData.FileSize,
        });
        toast('Attachment created and file uploaded successfully');
      } catch {
        toast('Attachment created. Try to upload file later');
      }

      finalizeCreateFlow(createdAttachment.FileId);
    } catch {
      // Error messages are handled by the mutation options.
    }
  };

  const handleClose = function () {
    if (isPending) {
      return;
    }
    resetState();
  };

  const handleAttachmentFormChange = function (nextValues: AttachmentFormValues) {
    setFormValues(nextValues);
    if (nextValues.title !== formValues.title) {
      setTitleError(validateFileTitle(nextValues.title));
    }
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
        headerText="Create Attachment"
        className="md:min-w-4xl relative"
        footer={
          <Bar
            design="Footer"
            endContent={
              <React.Fragment>
                <Button
                  design="Emphasized"
                  onClick={handleSubmit}
                  disabled={isPending || !fileData || !formValues.title.trim() || !!titleError || !!fileNameError}
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
        <AttachmentForm
          value={formValues}
          onChange={handleAttachmentFormChange}
          titleError={titleError}
          titleLabel="File Title"
          className="mb-4 flex flex-wrap gap-8"
          inputClassName="w-4/5 md:w-lg h-8"
        />
        <FlexBox direction="Column" className="gap-1 mb-4">
          <Label showColon required>
            File Name
          </Label>
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
        onPick={(nextFileData) => {
          handleFilePick(nextFileData);
        }}
        onPickCancel={() => setOpen('local')}
      />
    );
  }

  return (
    <React.Fragment>
      <ToolbarButton design="Transparent" text="Create" onClick={() => setOpen('local')} className="h-8" />
      <Dialog
        open={open === 'local' || driveLoading}
        resizable
        draggable
        headerText="Create Attachment"
        className="md:min-w-4xl relative"
        footer={
          <Bar
            design="Footer"
            endContent={
              <React.Fragment>
                <Button
                  design="Emphasized"
                  onClick={handleSubmit}
                  disabled={
                    driveLoading ||
                    isPending ||
                    !fileData ||
                    !formValues.title.trim() ||
                    !!titleError ||
                    !!fileNameError
                  }
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
          onGoogleBtnClick={() => setOpen('drive')}
          onPick={(nextFileData) => {
            handleFilePick(nextFileData);
          }}
        />
        <BusyIndicator type="pending" show={driveLoading || isPending} />
      </Dialog>
    </React.Fragment>
  );
}

// TODO: Allows uploading attachments directly within the BO.
