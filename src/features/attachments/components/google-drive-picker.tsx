import * as React from 'react';
import { toast } from '@/libs/toast';
import { useQuery } from '@tanstack/react-query';
import { pushErrorMessages } from '@/libs/errors';
import { useAuthStore } from '@/stores/auth-store';
import { GOOGLE_APP_ID, GOOGLE_CLIENT_ID } from '@/app-env';
import type { ConfigFileItem } from '@/features/config-files/types';
import type { UploadedFileData, GooglePickerDocument } from '../types';
import { configFilesQueryOptions } from '@/features/config-files/options/query';
import { getGoogleDriveUploadMetadata, googleDriveFileToUploadedFileData } from '../upload-file';
import { findMatchingUploadConfig, type UploadConfigType, validateUploadFileData } from '../upload-config';
import { DrivePicker, DrivePickerDocsView, type DrivePickerEventHandlers } from '@googleworkspace/drive-picker-react';

interface GoogleDrivePickerProps {
  onLoadingChange: (loading: boolean) => void;
  onPick: (fileData: UploadedFileData) => void;
  onPickCancel: () => void;
  requiredType?: UploadConfigType;
}

export function GoogleDrivePicker({ onPick, onPickCancel, onLoadingChange, requiredType }: GoogleDrivePickerProps) {
  const googleAccessToken = useAuthStore((state) => state.googleAccessToken);
  const setGoogleAccessToken = useAuthStore((state) => state.setGoogleAccessToken);
  const { data: configFilesData } = useQuery(
    configFilesQueryOptions({
      'sap-client': 324,
    }),
  );
  const filteredConfigFiles = React.useMemo<ConfigFileItem[] | undefined>(() => {
    if (!configFilesData?.value) {
      return undefined;
    }

    return requiredType
      ? configFilesData.value.filter((config) => config.Type === requiredType)
      : configFilesData.value;
  }, [configFilesData?.value, requiredType]);

  const handleOAuthError: DrivePickerEventHandlers['onOauthError'] = function (e) {
    const errorType = e.detail.type;
    if (errorType === 'popup_failed_to_open') {
      pushErrorMessages(['Popup failed to open. Please allow popups for this website.']);
    } else if (errorType === 'popup_closed') {
      toast('Popup closed by user or browser.');
    } else {
      pushErrorMessages(['An unexpected error occurred. Please try again.']);
    }
    setGoogleAccessToken(null);
    onPickCancel();
  };

  const handleOAuthResponse: DrivePickerEventHandlers['onOauthResponse'] = function (e) {
    setGoogleAccessToken(e.detail.access_token);
  };

  const handleCanceled: DrivePickerEventHandlers['onCanceled'] = function () {
    onPickCancel();
  };

  const handleFilePicked: DrivePickerEventHandlers['onPicked'] = async function (e) {
    const selectedDocument = e.detail.docs?.[0] as GooglePickerDocument | undefined;

    if (!selectedDocument?.id) {
      pushErrorMessages(['No Google Drive file was selected.']);
      onPickCancel();
      return;
    }

    if (!googleAccessToken) {
      pushErrorMessages(['Google Drive authorization is unavailable. Please try again.']);
      onPickCancel();
      return;
    }

    if (!filteredConfigFiles) {
      pushErrorMessages(['Upload configuration is unavailable. Please try again.']);
      onPickCancel();
      return;
    }

    try {
      onLoadingChange(true);
      const uploadMetadata = getGoogleDriveUploadMetadata(selectedDocument);
      const preValidationMessage = validateUploadFileData(uploadMetadata, filteredConfigFiles);

      if (preValidationMessage) {
        pushErrorMessages([preValidationMessage]);
        onPickCancel();
        return;
      }

      const matchedConfig = findMatchingUploadConfig(uploadMetadata, filteredConfigFiles);
      const fileData = await googleDriveFileToUploadedFileData({
        accessToken: googleAccessToken,
        file: selectedDocument,
        maxFileSize: matchedConfig?.MaxBytes,
      });
      const validationMessage = validateUploadFileData(
        {
          fileName: fileData.FileName,
          fileExtension: fileData.FileExtension,
          mimeType: fileData.MimeType,
          fileSize: fileData.FileSize,
        },
        filteredConfigFiles,
      );

      if (validationMessage) {
        pushErrorMessages([validationMessage]);
        onPickCancel();
        return;
      }
      onPick?.(fileData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Cannot import file from Google Drive.';
      pushErrorMessages([message]);
      onPickCancel();
    } finally {
      onLoadingChange(false);
    }
    // TODO: using axios + query (Importance: low)
  };

  return (
    <DrivePicker
      app-id={GOOGLE_APP_ID}
      client-id={GOOGLE_CLIENT_ID}
      oauth-token={googleAccessToken ?? undefined}
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
  );
}
