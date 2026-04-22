import { twMerge } from 'tailwind-merge';
import { APP_LOCALE } from '@/app-constant';
import clsx, { type ClassValue } from 'clsx';

type SapToIsoParams = {
  date?: string | null; // "2026-04-18"
  time?: string | null; // "02:40:35"
  timeZone?: string; // default: "Europe/Berlin"
};

type FormatDateParams = {
  date?: string | null;
  time?: string | null;
  fallback?: string;
  options?: {
    timeZone?: string;
    mode?: 'date' | 'time' | 'datetime';
    formatOptions?: Intl.DateTimeFormatOptions;
  };
};

const countFormatter = new Intl.NumberFormat(APP_LOCALE);
const sizeFormatter = new Intl.NumberFormat(APP_LOCALE, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function isValidDate(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function isValidTime(time: string) {
  return /^\d{2}:\d{2}:\d{2}$/.test(time);
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatFileSize(bytes: number | string | undefined, fallback = '0 Bytes') {
  const numBytes = typeof bytes === 'string' ? Number(bytes) : bytes;

  if (numBytes === undefined || numBytes === null || isNaN(numBytes)) {
    return fallback;
  }

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

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts = formatter.formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value);

  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));

  return asUtc - date.getTime();
}

function sapToIso({ date, time, timeZone = 'Europe/Berlin' }: SapToIsoParams): string | null {
  const d = date?.trim();
  const t = time?.trim();

  if (!d || !t) return null;
  if (!isValidDate(d) || !isValidTime(t)) return null;

  const [year, month, day] = d.split('-').map(Number);
  const [hour, minute, second] = t.split(':').map(Number);

  // assume UTC to calculate offset
  // month -1 because Date.UTC month is 0-indexed
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

  const offset = getTimeZoneOffsetMs(utcGuess, timeZone);

  const realDate = new Date(utcGuess.getTime() - offset);

  return realDate.toISOString();
}

function formatDate({ date, time, fallback = '', options }: FormatDateParams) {
  const mode = options?.mode ?? 'datetime';
  const formatOptions = options?.formatOptions;
  const iso = sapToIso({
    date,
    time,
    timeZone: options?.timeZone,
  });

  if (!iso) {
    return fallback;
  }

  const parsedDate = new Date(iso);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  if (mode === 'date') {
    return parsedDate.toLocaleDateString(APP_LOCALE, formatOptions);
  }

  if (mode === 'time') {
    return parsedDate.toLocaleTimeString(APP_LOCALE, formatOptions);
  }

  return parsedDate.toLocaleString(APP_LOCALE, formatOptions);
}

export { cn, formatFileSize, formatCount, formatDate };
