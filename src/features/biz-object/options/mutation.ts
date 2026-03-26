import { mutationOptions } from '@tanstack/react-query';
import { ODATA_SERVICE } from '@/app-constant';
import { axiosInstance } from '@/libs/axios-instance';
import { fetchCsrfToken, getCsrfToken } from '@/libs/helpers';
import { API, LINK_ATTACHMENT_API, UNLINK_ATTACHMENT_API } from '../constants';
import type {
  CreateBizObjectPayload,
  CreateBizObjectResponse,
  DeleteBizObjectResponse,
  LinkAttachmentPayload,
  LinkAttachmentResponse,
  UnlinkAttachmentLinkResponse,
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

type LinkAttachmentMutationParams = {
  boId: string;
  onSuccess?: (data: LinkAttachmentResponse) => void;
  onError?: (error: Error) => void;
};

type UnlinkAttachmentMutationParams = {
  boId: string;
  fileId: string;
  onSuccess?: (data: UnlinkAttachmentLinkResponse) => void;
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

export function linkAttachmentToBoMutationOptions({ boId, onSuccess, onError }: LinkAttachmentMutationParams) {
  return mutationOptions({
    mutationFn: async (payload: LinkAttachmentPayload) => {
      const { file_id } = payload;
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.BIZ);
        token = getCsrfToken();
      }

      const res = await axiosInstance.post<LinkAttachmentResponse>(
        `${ODATA_SERVICE.BIZ}${LINK_ATTACHMENT_API.linkToBo(file_id)}`,
        { bo_id: boId },
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

export function unlinkAttachmentFromBoMutationOptions({ boId, fileId, onSuccess, onError }: UnlinkAttachmentMutationParams) {
  return mutationOptions({
    mutationFn: async () => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.BIZ);
        token = getCsrfToken();
      }

      const res = await axiosInstance.delete<UnlinkAttachmentLinkResponse>(
        `${ODATA_SERVICE.BIZ}${UNLINK_ATTACHMENT_API.unlinkFromBo(boId, fileId)}`,
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