import { ODATA_SERVICE } from '@/app-constant';
import { axiosInstance } from './axios-instance';

export function getCsrfToken() {
  return sessionStorage.getItem('x-csrf-token');
}

export function fetchCsrfToken(serviceRoot: string = ODATA_SERVICE.ATTACHMENT) {
  return axiosInstance.get(`${serviceRoot}/$metadata`, {
    headers: {
      'x-csrf-token': 'Fetch',
    },
  });
}
