import { toDataUrl } from './preview-file';

function downloadFile(base64?: string, fileName?: string, mimeType?: string) {
  try {
    const url = toDataUrl(mimeType, base64);
    if (!url) return false;

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'download';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch {
    return false;
  }
}

export { downloadFile };
