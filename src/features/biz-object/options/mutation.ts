import { mutationOptions } from '@tanstack/react-query';
import { ODATA_SERVICE } from '@/app-constant';
import { axiosInstance } from '@/libs/axios-instance';
import { fetchCsrfToken, getCsrfToken } from '@/libs/helpers';
import { API } from '../constants';
import type {
  CreateBizObjectPayload,
  CreateBizObjectResponse,
  DeleteBizObjectResponse,
  UpdateBizObjectPayload,
} from '../types';

type CreateBizObjectMutationParams = {
  onSuccess?: (data: CreateBizObjectResponse) => void;
  onError?: (error: Error) => void;
};

type UpdateBizObjectMutationParams = {
  boId: string;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
};

type DeleteBizObjectMutationParams = {
  boId: string;
  onSuccess?: (data: DeleteBizObjectResponse) => void;
  onError?: (error: Error) => void;
};

export function createBizObjectMutationOptions({ onSuccess, onError }: CreateBizObjectMutationParams) {
  return mutationOptions({
    mutationFn: async (payload: CreateBizObjectPayload) => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken();
        token = getCsrfToken();
      }

      const res = await axiosInstance.post<CreateBizObjectResponse>(
        `${ODATA_SERVICE.BIZ}${API.endpoint}?sap-client=324`,
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
    onError,
  });
}

export function updateBizObjectMutationOptions({ boId, onSuccess, onError }: UpdateBizObjectMutationParams) {
  return mutationOptions({
    mutationFn: async (payload: UpdateBizObjectPayload) => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.BIZ);
        token = getCsrfToken();
      }

      const res = await axiosInstance.put<unknown>(
        `${ODATA_SERVICE.BIZ}${API.endpoint}(BoId=${boId})?sap-client=324`,
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
    onError,
  });
}

export function deleteBizObjectMutationOptions({ boId, onSuccess, onError }: DeleteBizObjectMutationParams) {
  return mutationOptions({
    mutationFn: async () => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.BIZ);
        token = getCsrfToken();
      }

      const res = await axiosInstance.delete<DeleteBizObjectResponse>(
        `${ODATA_SERVICE.BIZ}${API.endpoint}(BoId=${boId})?sap-client=324`,
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
    onError,
  });
}