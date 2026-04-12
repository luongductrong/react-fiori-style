import { getError } from './error-message';
import { useAppStore } from '@/stores/app-store';

export function setErrors(updater: (prev: string[]) => string[]) {
  useAppStore.getState().setErrors(updater);
}

export function pushErrorMessages(error: string[]) {
  setErrors((prev) => [...prev, ...error]);
}

export function pushApiErrorMessages(error: unknown) {
  setErrors((prev) => [...prev, ...getError(error)]);
}
