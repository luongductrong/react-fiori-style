import * as React from 'react';
import { toast } from '@/libs/toast';
import { GoogleDriveIcon } from '@/components/icons';
import { GOOGLE_APP_ID, GOOGLE_CLIENT_ID } from '@/app-env';
import { googleDriveFileToUploadedFileData } from '../upload-file';
import type { UploadedFileData, GooglePickerDocument } from '../types';
import { Button, type ButtonPropTypes } from '@ui5/webcomponents-react/Button';
import { DrivePicker, DrivePickerDocsView, type DrivePickerEventHandlers } from '@googleworkspace/drive-picker-react';

interface GoogleDrivePickerProps {
  disabled?: boolean;
  onPick?: (fileData: UploadedFileData) => void | Promise<void>;
  onLoadingChange?: (loading: boolean) => void;
  onImportError?: (message: string) => void;
}

export function GoogleDrivePicker({ disabled, onPick, onLoadingChange, onImportError }: GoogleDrivePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [accessToken, setAccessToken] = React.useState<string>();

  const handleButtonClick: ButtonPropTypes['onClick'] = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setOpen(true);
  };

  const handleOAuthError: DrivePickerEventHandlers['onOauthError'] = function (e) {
    logEvent(e.detail);
    setOpen(false);
    onLoadingChange?.(false);
    setAccessToken(undefined);

    const errorType = e.detail.type;
    if (errorType === 'popup_failed_to_open') {
      toast('Popup failed to open. Please allow popups for this website.');
    } else if (errorType === 'popup_closed') {
      toast('Popup closed by user or browser.');
    } else {
      toast('An unexpected error occurred. Please try again.');
    }
  };

  const handleOAuthResponse: DrivePickerEventHandlers['onOauthResponse'] = function (e) {
    logEvent(e.detail);
    setAccessToken(e.detail.access_token);
  };

  const handleCanceled: DrivePickerEventHandlers['onCanceled'] = function () {
    setOpen(false);
    onLoadingChange?.(false);
  };

  const handleFilePicked: DrivePickerEventHandlers['onPicked'] = async function (e) {
    logEvent(e.detail);
    setOpen(false);
    const selectedDocument = e.detail.docs?.[0] as GooglePickerDocument | undefined;

    if (!selectedDocument?.id) {
      const message = 'No Google Drive file was selected.';
      onImportError?.(message);
      toast(message);
      return;
    }

    if (!accessToken) {
      const message = 'Google Drive authorization is unavailable. Please try again.';
      onImportError?.(message);
      toast(message);
      return;
    }

    try {
      onLoadingChange?.(true);
      const fileData = await googleDriveFileToUploadedFileData({
        accessToken,
        file: selectedDocument,
      });
      onImportError?.('');
      await onPick?.(fileData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Cannot import file from Google Drive.';
      onImportError?.(message);
      toast(message);
    } finally {
      onLoadingChange?.(false);
    }
  };

  return (
    <React.Fragment>
      <Button onClick={handleButtonClick} className="inline-flex items-center" design="Transparent" disabled={disabled}>
        <GoogleDriveIcon className="inline-block mr-1 size-5" />
        <span className="text-sm">Google Drive</span>
      </Button>
      {open && (
        <DrivePicker
          app-id={GOOGLE_APP_ID}
          client-id={GOOGLE_CLIENT_ID}
          oauth-token={accessToken}
          max-items={1}
          onCanceled={handleCanceled}
          onPicked={handleFilePicked}
          onOauthError={handleOAuthError}
          onOauthResponse={handleOAuthResponse}
        >
          <DrivePickerDocsView include-folders="true" select-folder-enabled="false" />
          <DrivePickerDocsView include-folders="true" select-folder-enabled="false" owned-by-me="true" />
          <DrivePickerDocsView include-folders="true" select-folder-enabled="false" enable-drives="true" />
        </DrivePicker>
      )}
    </React.Fragment>
  );
}

// TODO: Move accessToken to global state

function logEvent(event: unknown) {
  // TODO: Remove this
  console.log(event);
}
