export function normalizeBase64(value?: string): string {
  return typeof value === 'string' ? value.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/') : '';
}

export function hasValue(value?: string): boolean {
  return !!normalizeBase64(value);
}

export function isMimeType(mimeType?: string, pattern?: RegExp): boolean {
  return typeof mimeType === 'string' && !!pattern?.test(mimeType);
}

export function toDataUrl(mimeType?: string, fileContent?: string): string {
  const normalized = normalizeBase64(fileContent);

  if (!mimeType || !normalized) return '';

  return `data:${mimeType};base64,${normalized}`;
}

export function decodeBase64ToText(fileContent?: string): string {
  const normalized = normalizeBase64(fileContent);
  if (!normalized) return '';

  try {
    const binary = atob(normalized);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    if (window.TextDecoder) {
      return new TextDecoder('utf-8').decode(bytes);
    }

    let escaped = '';
    for (let i = 0; i < bytes.length; i++) {
      escaped += '%' + ('00' + bytes[i].toString(16)).slice(-2);
    }

    return decodeURIComponent(escaped);
  } catch {
    return '';
  }
}

export function escapeHtml(value?: string): string {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ===== preview type checks =====

export function isImagePreviewable(mime?: string, content?: string) {
  return hasValue(content) && isMimeType(mime, /^image\//i);
}

export function isPdfPreviewable(mime?: string, content?: string) {
  return hasValue(content) && isMimeType(mime, /^application\/pdf$/i);
}

export function isTextPreviewable(mime?: string, content?: string) {
  return hasValue(content) && isMimeType(mime, /^(text\/|application\/(?:json|xml|javascript|xhtml\+xml))/i);
}

export function isUnsupportedPreview(mime?: string, content?: string) {
  return (
    hasValue(content) &&
    !isImagePreviewable(mime, content) &&
    !isPdfPreviewable(mime, content) &&
    !isTextPreviewable(mime, content)
  );
}

// ===== render helpers =====

export function toPdfHtml(mime?: string, content?: string, fileName?: string) {
  const src = toDataUrl(mime, content);

  if (!src || !isPdfPreviewable(mime, content)) return '';

  return `
    <div style="height:70vh;min-height:28rem;">
      <iframe 
        src="${src}#toolbar=1&navpanes=0"
        title="${escapeHtml(fileName || 'PDF preview')}"
        style="width:100%;height:100%;border:none;background:#fff;"
      ></iframe>
    </div>
  `;
}

export function toTextContent(mime?: string, content?: string) {
  if (!isTextPreviewable(mime, content)) return '';
  return decodeBase64ToText(content);
}

export function downloadFile(base64?: string, fileName?: string, mimeType?: string) {
  const url = toDataUrl(mimeType, base64);
  if (!url) return false;

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'download';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
}

// TODO: Separate the above section into a separate file.

// Returns the editable file name by removing the extension suffix (if present).
// This is typically used for UI input fields where users should only edit
// the base name without the file extension.
function getEditableFileName(fileName: string, extension: string) {
  if (!extension) return fileName;

  const suffix = `.${extension}`;

  if (fileName.length > suffix.length && fileName.toLowerCase().endsWith(suffix.toLowerCase())) {
    return fileName.slice(0, -suffix.length);
  }

  return fileName;
}

// Builds the full file name by ensuring the correct extension is appended.
// If the file name already ends with the given extension (case-insensitive),
// it will not be duplicated.
function buildFileName(fileName: string, extension: string) {
  if (!extension) return fileName;

  const suffix = `.${extension}`;

  if (fileName.toLowerCase().endsWith(suffix.toLowerCase())) {
    return fileName;
  }

  return `${fileName}${suffix}`;
}

// CREATE
// UPDATE_TITLE
// SET_CURRENT_VERSION
// DELETE
// REACTIVATE
// LINK_BO
// UNLINK_BO
// CREATE_VERSION
function displayAuditAction(action?: string) {
  switch (action) {
    case 'CREATE':
      return 'Create';
    case 'UPDATE_TITLE':
      return 'Update Title';
    case 'SET_CURRENT_VERSION':
      return 'Set Current Version';
    case 'DELETE':
      return 'Delete';
    case 'REACTIVATE':
      return 'Restore';
    case 'LINK_BO':
      return 'Link to Business Object';
    case 'UNLINK_BO':
      return 'Unlink from Business Object';
    case 'CREATE_VERSION':
      return 'Upload New Version';
    default:
      return action ? `"${action}"` : '-';
  }
}

export { getEditableFileName, buildFileName, displayAuditAction };
