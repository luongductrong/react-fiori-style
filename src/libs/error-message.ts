import axios from 'axios';
import type { AxiosApiError } from '@/types/common';

type BackendErrorPayload = {
  error?: {
    message?: unknown;
    innererror?: {
      errordetails?: Array<{
        message?: unknown;
      }>;
    };
  };
  message?: unknown;
};

function getStringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function getBackendErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data as BackendErrorPayload | string | undefined;

      if (typeof data === 'string') {
        return getStringValue(data) || fallback;
      }

      const nestedMessage =
        getStringValue(data?.error?.message) ||
        getStringValue(data?.message) ||
        getStringValue(data?.error?.innererror?.errordetails?.[0]?.message);

      if (nestedMessage) {
        return nestedMessage;
      }

      return getStringValue(error.response.statusText) || fallback;
    }

    return getStringValue(error.message) || fallback;
  }

  if (error instanceof Error) {
    return getStringValue(error.message) || fallback;
  }

  if (typeof error === 'string') {
    return getStringValue(error) || fallback;
  }

  return fallback;
}

function isAxiosApiError(error: unknown): error is AxiosApiError {
  return axios.isAxiosError(error);
}

export function getError(error: unknown, fallback = 'Something went wrong.'): string[] {
  if (isAxiosApiError(error)) {
    const sapDetails =
      error.response?.data?.error?.details
        ?.map((d) => d.message)
        .filter((message): message is string => Boolean(message)) ?? [];

    const sapMessage = error.response?.data?.error?.message;

    if (sapDetails.length > 0) return sapDetails;
    return [sapMessage || error.message || fallback];
  }

  if (error instanceof Error) {
    return [error.message];
  }

  return [fallback];
}
