import { mutationOptions } from '@tanstack/react-query';
import { ODATA_SERVICE } from '@/app-constant';
import { axiosInstance } from '@/libs/axios-instance';
import { fetchCsrfToken, getCsrfToken } from '@/libs/helpers';
import { API } from '../constants';
import type { CreateAuthUserPayload, CreateAuthUserResponse } from '../types';

type CreateAuthUserMutationParams = {
  onSuccess?: (data: CreateAuthUserResponse) => void;
  onError?: (error: Error) => void;
};

export function createAuthUserMutationOptions({ onSuccess, onError }: CreateAuthUserMutationParams) {
  return mutationOptions({
    mutationFn: async (payload: CreateAuthUserPayload) => {
      let token = getCsrfToken();

      if (!token) {
        try {
          await fetchCsrfToken(ODATA_SERVICE.AUTH);
          token = getCsrfToken();
        } catch {
          throw new Error('CSRF token fetch was blocked. Please check the Auth service access or CORS policy.');
        }
      }

      if (!token) {
        throw new Error('CSRF token is not available. Cannot create user.');
      }

      try {
        const res = await axiosInstance.post<CreateAuthUserResponse>(
          `${ODATA_SERVICE.AUTH}${API.endpoint}?sap-client=324`,
          payload,
          {
            headers: {
              'accept-language': 'en',
              'x-csrf-token': token,
            },
          },
        );

        return res;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        throw new Error('Cannot create user');
      }
    },
    onSuccess,
    onError,
  });
}
