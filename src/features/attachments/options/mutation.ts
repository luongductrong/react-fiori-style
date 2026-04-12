import { MUTATION_API } from '../constants';
import { ODATA_SERVICE } from '@/app-constant';
import type { AxiosApiError } from '@/types/common';
import { axiosInstance } from '@/libs/axios-instance';
import type { CreateAttachmentPayload } from '../types';
import { mutationOptions } from '@tanstack/react-query';
import { fetchCsrfToken, getCsrfToken } from '@/libs/helpers';
import type { RollbackVersionPayload, UploadVersionResponse } from '../types';
import type { UploadVersionPayload, CreateAttachmentResponse } from '../types';

type Params = {
  fileId: string;
  onSuccess?: () => void;
  onError?: (_error: AxiosApiError) => void;
};

type CreateAttachmentParams = {
  onSuccess?: (data: CreateAttachmentResponse) => void;
  onError?: (_error: AxiosApiError) => void;
};

export function rollbackVersionMutationOptions({ fileId, onSuccess, onError }: Params) {
  return mutationOptions({
    mutationFn: async (payload: RollbackVersionPayload) => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.ATTACHMENT);
        token = getCsrfToken();
      }

      const res = await axiosInstance.patch<unknown>(
        `${ODATA_SERVICE.ATTACHMENT}${MUTATION_API.rollbackVersion(fileId)}`,
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

export function deleteAttachmentMutationOptions({ fileId, onSuccess, onError }: Params) {
  return mutationOptions({
    mutationFn: async () => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.ATTACHMENT);
        token = getCsrfToken();
      }

      const res = await axiosInstance.delete<unknown>(
        `${ODATA_SERVICE.ATTACHMENT}${MUTATION_API.deleteAttachment(fileId)}`,
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

export function updateAttachmentTitleMutationOptions({ fileId, onSuccess, onError }: Params) {
  return mutationOptions({
    mutationFn: async (payload: { Title: string }) => {
      let token = getCsrfToken();
      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.ATTACHMENT);
        token = getCsrfToken();
      }
      const res = await axiosInstance.put<unknown>(
        `${ODATA_SERVICE.ATTACHMENT}${MUTATION_API.updateAttachmentTitle(fileId)}`,
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

export function uploadVersionMutationOptions({
  onSuccess,
  onError,
}: Omit<Params, 'fileId' | 'onSuccess'> & {
  onSuccess?: (data: UploadVersionResponse) => void;
}) {
  return mutationOptions({
    mutationFn: async (payload: UploadVersionPayload) => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.ATTACHMENT);
        token = getCsrfToken();
      }

      const res = await axiosInstance.post<UploadVersionResponse>(
        `${ODATA_SERVICE.ATTACHMENT}${MUTATION_API.uploadVersion}`,
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

export function createAttachmentMutationOptions({ onSuccess, onError }: CreateAttachmentParams) {
  return mutationOptions({
    mutationFn: async (payload: CreateAttachmentPayload) => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.ATTACHMENT);
        token = getCsrfToken();
      }

      const res = await axiosInstance.post<CreateAttachmentResponse>(
        `${ODATA_SERVICE.ATTACHMENT}${MUTATION_API.createAttachment}`,
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
