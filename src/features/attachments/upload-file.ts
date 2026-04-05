import type { GoogleWorkspaceMimeType } from '@/types/common';
import type { UploadedFileData, GooglePickerDocument } from './types';
import { FALLBACK_EXTENSION, FALLBACK_MIME_TYPE, MAX_FILE_SIZE, GOOGLE_WORKSPACE_EXPORTS } from '@/app-constant';

type GoogleDriveImportOptions = {
  accessToken: string;
  file: GooglePickerDocument;
  maxFileSize?: number;
};

type BlobToUploadFileOptions = {
  blob: Blob;
  fileName: string;
  mimeType?: string;
};

export function getFileExtension(fileName: string) {
  const lastDot = fileName.lastIndexOf('.');

  if (lastDot === -1) return '';

  return fileName.slice(lastDot + 1);
}

function assertFileSize(fileSize: number, maxFileSize = MAX_FILE_SIZE) {
  if (fileSize > maxFileSize) {
    throw new Error(`File exceeds ${maxFileSize / 1024 / 1024}MB, please select a smaller file.`);
  }
}

function ensureFileExtension(fileName: string, extension: string) {
  const normalizedExtension = extension.replace(/^\./, ''); // Remove leading dot if present

  if (!normalizedExtension) return fileName;
  if (getFileExtension(fileName).toLowerCase() === normalizedExtension.toLowerCase()) {
    return fileName;
  }

  return `${fileName}.${normalizedExtension}`;
}

function isGoogleWorkspaceMimeType(mimeType: string): mimeType is GoogleWorkspaceMimeType {
  return mimeType in GOOGLE_WORKSPACE_EXPORTS;
}

async function responseToError(response: Response, fallbackMessage: string) {
  try {
    const data = (await response.json()) as {
      error?: {
        message?: string;
      };
    };
    const message = data?.error?.message;

    return new Error(typeof message === 'string' && message.length > 0 ? message : fallbackMessage);
  } catch {
    return new Error(fallbackMessage);
  }
}

async function fileLikeToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Cannot read file'));
        return;
      }

      resolve(result.split(',')[1] ?? '');
    };

    reader.onerror = () => reject(reader.error ?? new Error('Cannot read file'));
    reader.readAsDataURL(file);
  });
}

async function fetchGoogleDriveBlob(url: string, accessToken: string, fallbackMessage: string) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw await responseToError(response, fallbackMessage);
  }
  return response.blob();
}

export async function blobToUploadedFileData({
  blob,
  fileName,
  mimeType,
}: BlobToUploadFileOptions): Promise<UploadedFileData> {
  const base64 = await fileLikeToBase64(blob);

  return {
    FileName: fileName,
    FileExtension: getFileExtension(fileName) || FALLBACK_EXTENSION,
    MimeType: mimeType || blob.type || FALLBACK_MIME_TYPE,
    FileSize: blob.size,
    FileContent: base64,
  };
}

export async function fileToUploadedFileData(file: File, maxFileSize = MAX_FILE_SIZE) {
  assertFileSize(file.size, maxFileSize);

  return blobToUploadedFileData({
    blob: file,
    fileName: file.name,
    mimeType: file.type || FALLBACK_MIME_TYPE,
  });
}

export async function googleDriveFileToUploadedFileData({
  accessToken,
  file,
  maxFileSize = MAX_FILE_SIZE,
}: GoogleDriveImportOptions) {
  if (!file?.id || !file?.name || !file?.mimeType) {
    throw new Error('Selected Google Drive file is missing required metadata.');
  }

  if (file.mimeType === 'application/vnd.google-apps.folder') {
    throw new Error('Google Drive folders cannot be uploaded as attachment versions.');
  }

  if (!isGoogleWorkspaceMimeType(file.mimeType) && file.sizeBytes) {
    assertFileSize(Number(file.sizeBytes), maxFileSize);
  }

  if (isGoogleWorkspaceMimeType(file.mimeType)) {
    const exportConfig = GOOGLE_WORKSPACE_EXPORTS[file.mimeType];
    const exportUrl = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(file.id)}/export?mimeType=${encodeURIComponent(exportConfig.exportMimeType)}`;
    const blob = await fetchGoogleDriveBlob(exportUrl, accessToken, 'Cannot export this Google Workspace file.');

    assertFileSize(blob.size, maxFileSize);

    return blobToUploadedFileData({
      blob,
      fileName: ensureFileExtension(file.name, exportConfig.extension),
      mimeType: exportConfig.exportMimeType,
    });
  }

  if (file.mimeType.startsWith('application/vnd.google-apps.')) {
    throw new Error('This Google Workspace file type is not supported for import yet.');
  }

  const downloadUrl = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(file.id)}?alt=media`;
  const blob = await fetchGoogleDriveBlob(downloadUrl, accessToken, 'Cannot download this Google Drive file.');

  assertFileSize(blob.size, maxFileSize);

  return blobToUploadedFileData({
    blob,
    fileName: file.name,
    mimeType: blob.type || file.mimeType,
  });
}
