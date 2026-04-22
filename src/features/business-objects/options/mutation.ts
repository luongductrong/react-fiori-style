import { ODATA_SERVICE } from '@/app-constant';
import { API, MUTATION_API } from '../constants';
import { axiosInstance } from '@/libs/axios-instance';
import { mutationOptions } from '@tanstack/react-query';
import { pushApiErrorMessages } from '@/libs/helpers/error-messages';
import { fetchCsrfToken, getCsrfToken } from '@/libs/helpers/csrf-token';
import type { CreateBizObjectPayload, CreateBizObjectResponse } from '../types';
import type { LinkAttachmentPayload, UpdateBizObjectPayload, UnlinkAttachmentParams } from '../types';

type CreateBizObjectMutationParams = {
  onSuccess?: (data: CreateBizObjectResponse) => void;
  onError?: (error: unknown) => void;
};

type UpdateBizObjectMutationParams = {
  boId: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

type DeleteBizObjectMutationParams = {
  boId: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

type LinkAttachmentMutationParams = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

type UnlinkAttachmentMutationParams = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function createBizObjectMutationOptions({ onSuccess, onError }: CreateBizObjectMutationParams) {
  return mutationOptions({
    mutationFn: async (payload: CreateBizObjectPayload) => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.BIZ);
        token = getCsrfToken();
      }

      const res = await axiosInstance.post<CreateBizObjectResponse>(`${ODATA_SERVICE.BIZ}${API.endpoint}`, payload, {
        headers: {
          ...(token ? { 'x-csrf-token': token } : {}),
        },
      });
      return res;
    },
    onSuccess,
    onError: (error) => {
      pushApiErrorMessages(error);
      onError?.(error);
    },
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

      const res = await axiosInstance.put<unknown>(`${ODATA_SERVICE.BIZ}${API.endpoint}(BoId=${boId})`, payload, {
        headers: {
          ...(token ? { 'x-csrf-token': token } : {}),
        },
      });
      return res;
    },
    onSuccess,
    onError: (error) => {
      pushApiErrorMessages(error);
      onError?.(error);
    },
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
      const res = await axiosInstance.delete(`${ODATA_SERVICE.BIZ}${API.endpoint}(BoId=${boId})`, {
        headers: {
          ...(token ? { 'x-csrf-token': token } : {}),
        },
      });
      return res;
    },
    onSuccess,
    onError: (error) => {
      pushApiErrorMessages(error);
      onError?.(error);
    },
  });
}

export function linkAttachmentToBoMutationOptions({ onSuccess, onError }: LinkAttachmentMutationParams) {
  return mutationOptions({
    mutationFn: async (payload: LinkAttachmentPayload) => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.BIZ);
        token = getCsrfToken();
      }

      const res = await axiosInstance.post(`${ODATA_SERVICE.BIZ}${MUTATION_API.linkAttachment()}`, payload, {
        headers: {
          ...(token ? { 'x-csrf-token': token } : {}),
        },
      });
      return res;
    },
    onSuccess,
    onError: (error) => {
      pushApiErrorMessages(error);
      onError?.(error);
    },
  });
}

export function unlinkAttachmentFromBoMutationOptions({ onSuccess, onError }: UnlinkAttachmentMutationParams) {
  return mutationOptions({
    mutationFn: async (params: UnlinkAttachmentParams) => {
      const { FileId, BoId } = params;
      let token = getCsrfToken();
      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.BIZ);
        token = getCsrfToken();
      }
      const res = await axiosInstance.delete(`${ODATA_SERVICE.BIZ}${MUTATION_API.unlinkAttachment(BoId, FileId)}`, {
        headers: {
          ...(token ? { 'x-csrf-token': token } : {}),
        },
      });
      return res;
    },
    onSuccess,
    onError: (error) => {
      pushApiErrorMessages(error);
      onError?.(error);
    },
  });
}
