import { API } from '../constants';
import { ODATA_SERVICE } from '@/app-constant';
import { pushApiErrorMessages } from '@/libs/errors';
import { axiosInstance } from '@/libs/axios-instance';
import { mutationOptions } from '@tanstack/react-query';
import { fetchCsrfToken, getCsrfToken } from '@/libs/helpers';
import type { DeleteAuthUserParams, DeleteAuthUserResponse } from '../types';
import type { CreateAuthUserPayload, CreateAuthUserResponse } from '../types';

type CreateAuthUserMutationParams = {
  onSuccess?: (data: CreateAuthUserResponse) => void;
  onError?: (error: unknown) => void;
};

type DeleteAuthUserMutationParams = {
  onSuccess?: (data: DeleteAuthUserResponse) => void;
  onError?: (error: unknown) => void;
};

export function createAuthUserMutationOptions({ onSuccess, onError }: CreateAuthUserMutationParams) {
  return mutationOptions({
    mutationFn: async (payload: CreateAuthUserPayload) => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.AUTH);
        token = getCsrfToken();
      }

      const res = axiosInstance.post<CreateAuthUserResponse>(
        `${ODATA_SERVICE.AUTH}${API.endpoint}?sap-client=324`,
        payload,
        {
          headers: {
            'accept-language': 'en',
            ...(token ? { 'x-csrf-token': token } : {}),
          },
        },
      );

      return res;
    },
    onSuccess,
    onError: (error) => {
      pushApiErrorMessages(error);
      onError?.(error);
    },
  });
}

export function deleteAuthUserMutationOptions({ onSuccess, onError }: DeleteAuthUserMutationParams) {
  return mutationOptions({
    mutationFn: async (params: DeleteAuthUserParams) => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.AUTH);
        token = getCsrfToken();
      }

      const res = await axiosInstance.delete<DeleteAuthUserResponse>(
        `${ODATA_SERVICE.AUTH}${API.endpoint}(Uname='${params.Uname}')?sap-client=324`,
        {
          headers: {
            'accept-language': 'en',
            ...(token ? { 'x-csrf-token': token } : {}),
          },
        },
      );

      return res;
    },
    onSuccess,
    onError: (error) => {
      pushApiErrorMessages(error);
      onError?.(error);
    },
  });
}
