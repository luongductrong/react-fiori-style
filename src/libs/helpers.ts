import { axiosInstance } from './axios-instance';
import { useAuthStore } from '@/stores/auth-store';

export function getCsrfToken() {
  return useAuthStore.getState().csrfToken;
}

export function setCsrfToken(csrfToken: string) {
  useAuthStore.getState().setCsrfToken(csrfToken);
}

export function fetchCsrfToken(serviceRoot: string) {
  return axiosInstance.get(`${serviceRoot}/$metadata`, {
    headers: {
      'x-csrf-token': 'Fetch',
    },
  });
}
// TODO: rename this file
