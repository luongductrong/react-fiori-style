import { twMerge } from 'tailwind-merge';
import clsx, { type ClassValue } from 'clsx';

const locale = navigator.language || 'en-US';
const countFormatter = new Intl.NumberFormat(locale);
const sizeFormatter = new Intl.NumberFormat(locale, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatFileSize(bytes: number | string | undefined) {
  const numBytes = typeof bytes === 'string' ? Number(bytes) : bytes;
  if (!numBytes || isNaN(numBytes)) return '0 Bytes';

  const k = 1024;

  if (numBytes < k) {
    return sizeFormatter.format(numBytes) + ' Bytes';
  }

  if (numBytes < k * k) {
    return sizeFormatter.format(numBytes / k) + ' KB';
  }

  return sizeFormatter.format(numBytes / (k * k)) + ' MB';
}

function formatCount(value: number | null | undefined) {
  return countFormatter.format(value ?? 0);
}

export { cn, formatFileSize, formatCount };
