import { MIME_TYPE_SEPARATOR } from '@/app-constant';

const MIME_TYPE_PATTERN = /^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/i;

function normalizeMimeTypeToken(value: string) {
  return value.trim().toLowerCase();
}

function dedupeMimeTypes(values: string[]) {
  return [...new Set(values)];
}

function splitMimeTypes(value?: string): string[] {
  if (typeof value !== 'string') {
    return [];
  }

  return dedupeMimeTypes(value.split(MIME_TYPE_SEPARATOR).map(normalizeMimeTypeToken).filter(Boolean));
}

function isValidMimeType(value: string) {
  return MIME_TYPE_PATTERN.test(value);
}

function parseMimeTypes(value?: string): string[] {
  return splitMimeTypes(value).filter(isValidMimeType);
}

function findInvalidMimeTypes(value?: string | string[]): string[] {
  const mimeTypes = Array.isArray(value) ? value.map(normalizeMimeTypeToken).filter(Boolean) : splitMimeTypes(value);

  return dedupeMimeTypes(mimeTypes.filter((mimeType) => !isValidMimeType(mimeType)));
}

function getMimeTypeInputValues(value?: string): string[] {
  const mimeTypes = splitMimeTypes(value);

  return mimeTypes.length > 0 ? mimeTypes : [''];
}

function normalizeMimeTypesForStorage(value?: string | string[]): string {
  const mimeTypes = Array.isArray(value)
    ? dedupeMimeTypes(value.map(normalizeMimeTypeToken).filter(isValidMimeType))
    : parseMimeTypes(value);

  return mimeTypes.join(`${MIME_TYPE_SEPARATOR} `);
}

function formatMimeTypesForDisplay(value?: string): string {
  const mimeTypes = splitMimeTypes(value);

  return mimeTypes.join(`${MIME_TYPE_SEPARATOR} `);
}

export {
  splitMimeTypes,
  parseMimeTypes,
  findInvalidMimeTypes,
  normalizeMimeTypeToken,
  getMimeTypeInputValues,
  formatMimeTypesForDisplay,
  normalizeMimeTypesForStorage,
};
