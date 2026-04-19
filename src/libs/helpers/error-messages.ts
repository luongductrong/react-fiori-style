import axios from 'axios';
import { useAppStore } from '@/stores/app-store';
import type { AxiosApiError } from '@/types/common';

function isAxiosApiError(error: unknown): error is AxiosApiError {
  return axios.isAxiosError(error);
}

function setErrors(updater: (prev: string[]) => string[]) {
  useAppStore.getState().setErrors(updater);
}

function getError(error: unknown, fallback = 'Something went wrong.'): string[] {
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

function pushErrorMessages(error: string[]) {
  setErrors((prev) => [...prev, ...error]);
}

function pushApiErrorMessages(error: unknown) {
  setErrors((prev) => [...prev, ...getError(error)]);
}

export { getError, pushApiErrorMessages, pushErrorMessages };
