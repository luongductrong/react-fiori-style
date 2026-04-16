import { formatFileSize } from '@/libs/utils';
import { getFileExtension } from './upload-file';
import type { ConfigFileItem } from '@/features/config-files/types';

export type UploadValidationInput = {
  fileName?: string;
  fileExtension?: string;
  mimeType?: string;
  fileSize?: number;
};

export type UploadConfigType = ConfigFileItem['Type'];

export type ActiveUploadConfig = {
  FileExt: string;
  MimeType: string;
  MaxBytes: number;
};

function normalizeExtension(value?: string) {
  return typeof value === 'string' ? value.trim().toLowerCase().replace(/^\./, '') : ''; // remove dot at the beginning
}

function normalizeMimeType(value?: string) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.split(';', 1)[0]?.trim().toLowerCase() ?? '';
}

function isActiveConfig(config: Pick<ConfigFileItem, 'IsActive'>) {
  return config.IsActive === true || config.IsActive === 'X';
}

function normalizeConfigType(value?: ConfigFileItem['Type']): UploadConfigType {
  return value === 'IMAGE' ? 'IMAGE' : 'DOCUMENT';
}

export function resolveUploadTypeByExtension(
  fileExtension?: string,
  configFiles?: ConfigFileItem[],
  fallbackType: UploadConfigType = 'DOCUMENT',
) {
  const normalizedExtension = normalizeExtension(fileExtension);

  if (!normalizedExtension) {
    return fallbackType;
  }

  const config = (configFiles ?? []).find((item) => normalizeExtension(item.FileExt) === normalizedExtension);

  return config ? normalizeConfigType(config.Type) : fallbackType;
}

export function getActiveUploadConfigs(configFiles?: ConfigFileItem[]): ActiveUploadConfig[] {
  return (configFiles ?? []).flatMap((config) => {
    const fileExt = normalizeExtension(config.FileExt);
    const mimeType = normalizeMimeType(config.MimeType);

    if (!isActiveConfig(config) || !fileExt || !mimeType) {
      return [];
    }

    return [
      {
        FileExt: fileExt,
        MimeType: mimeType,
        MaxBytes: Number(config.MaxBytes) || 0,
      },
    ];
  });
}

export function getAllowedUploadExtensions(configFiles?: ConfigFileItem[]) {
  return [...new Set(getActiveUploadConfigs(configFiles).map((config) => `.${config.FileExt}`))];
}

export function buildUploadAcceptValue(configFiles?: ConfigFileItem[]) {
  return getAllowedUploadExtensions(configFiles).join(',');
}

export function findMatchingUploadConfig(input: UploadValidationInput, configFiles?: ConfigFileItem[]) {
  const fileExtension = normalizeExtension(input.fileExtension || getFileExtension(input.fileName || ''));
  const mimeType = normalizeMimeType(input.mimeType);

  if (!fileExtension || !mimeType) {
    return null;
  }

  return (
    getActiveUploadConfigs(configFiles).find(
      (config) => config.FileExt === fileExtension && config.MimeType === mimeType,
    ) ?? null
  );
}

export function validateUploadFileData(input: UploadValidationInput, configFiles?: ConfigFileItem[]) {
  if (!configFiles) {
    return 'Upload configuration is unavailable. Please try again.';
  }

  const activeConfigs = getActiveUploadConfigs(configFiles);

  if (activeConfigs.length === 0) {
    return 'No active upload configuration is available.';
  }

  const fileExtension = normalizeExtension(input.fileExtension || getFileExtension(input.fileName || ''));
  const mimeType = normalizeMimeType(input.mimeType);

  if (!fileExtension) {
    return 'Selected file does not have a valid extension.';
  }

  if (!mimeType) {
    return 'Selected file does not have a valid MIME type.';
  }

  const matchedConfig = activeConfigs.find(
    (config) => config.FileExt === fileExtension && config.MimeType === mimeType,
  );

  if (!matchedConfig) {
    const hasActiveExtension = activeConfigs.some((config) => config.FileExt === fileExtension);

    if (hasActiveExtension) {
      return `MIME type "${mimeType}" does not match the active configuration for ".${fileExtension}" files.`;
    }

    return `File extension ".${fileExtension}" is not enabled for upload.`;
  }

  if (
    typeof input.fileSize === 'number' &&
    Number.isFinite(input.fileSize) &&
    matchedConfig.MaxBytes > 0 &&
    input.fileSize > matchedConfig.MaxBytes
  ) {
    return `File exceeds the configured limit of ${formatFileSize(matchedConfig.MaxBytes)} for ".${fileExtension}" files.`;
  }

  return '';
}
