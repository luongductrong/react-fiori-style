import type { ApiError } from '@/types/common';
import { ODATA_SERVICE } from '@/app-constant';
import { API, MUTATION_API } from '../constants';
import { axiosInstance } from '@/libs/axios-instance';
import { mutationOptions } from '@tanstack/react-query';
import { fetchCsrfToken, getCsrfToken } from '@/libs/helpers';
import type { CreateBizObjectPayload, CreateBizObjectResponse } from '../types';
import type { LinkAttachmentPayload, UpdateBizObjectPayload, UnlinkAttachmentPayload } from '../types';

type CreateBizObjectMutationParams = {
  onSuccess?: (data: CreateBizObjectResponse) => void;
  onError?: (error: Error) => void;
};

type UpdateBizObjectMutationParams = {
  boId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

type DeleteBizObjectMutationParams = {
  boId: string;
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
};

type LinkAttachmentMutationParams = {
  boId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

type UnlinkAttachmentMutationParams = {
  boId: string;
  onSuccess?: () => void;
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
      const res = await axiosInstance.delete(`${ODATA_SERVICE.BIZ}${API.endpoint}(BoId=${boId})?sap-client=324`, {
        headers: {
          'accept-language': 'en',
          ...(token ? { 'x-csrf-token': token } : {}),
        },
      });
      return res;
    },
    onSuccess,
    onError,
  });
}

export function linkAttachmentToBoMutationOptions({ boId, onSuccess, onError }: LinkAttachmentMutationParams) {
  return mutationOptions({
    mutationFn: async (payload: LinkAttachmentPayload) => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.BIZ);
        token = getCsrfToken();
      }

      const res = await axiosInstance.post(`${ODATA_SERVICE.BIZ}${MUTATION_API.linkAttachment(boId)}`, payload, {
        headers: {
          'accept-language': 'en',
          ...(token ? { 'x-csrf-token': token } : {}),
        },
      });
      return res;
    },
    onSuccess,
    onError,
  });
}

export function unlinkAttachmentFromBoMutationOptions({ boId, onSuccess, onError }: UnlinkAttachmentMutationParams) {
  return mutationOptions({
    mutationFn: async (payload: UnlinkAttachmentPayload) => {
      const { file_id } = payload;
      let token = getCsrfToken();
      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.BIZ);
        token = getCsrfToken();
      }
      const res = await axiosInstance.delete(`${ODATA_SERVICE.BIZ}${MUTATION_API.unlinkAttachment(boId, file_id)}`, {
        headers: {
          'accept-language': 'en', // TODO: handle i18n
          ...(token ? { 'x-csrf-token': token } : {}),
        },
      });
      return res;
    },
    onSuccess,
    onError,
  });
}

// TODO: handle csrf token deletion
