import { MUTATION_API } from '../constants';
import { ODATA_SERVICE } from '@/app-constant';
import { pushApiErrorMessages } from '@/libs/errors';
import { axiosInstance } from '@/libs/axios-instance';
import { mutationOptions } from '@tanstack/react-query';
import { fetchCsrfToken, getCsrfToken } from '@/libs/helpers';
import type { RollbackVersionPayload, UploadVersionResponse } from '../types';
import type { UploadVersionPayload, CreateAttachmentResponse } from '../types';
import type { LinkBoPayload, UnlinkBoPayload, CreateAttachmentPayload, UpdateAttachmentPayload } from '../types';

type Params = {
  fileId: string;
  onSuccess?: () => void;
  onError?: (_error: unknown) => void;
};

type CreateAttachmentParams = {
  onSuccess?: (data: CreateAttachmentResponse) => void;
  onError?: (_error: unknown) => void;
};

type RestoreAttachmentParams = {
  onSuccess?: () => void;
  onError?: (_error: unknown) => void;
};

type LinkBoMutationParams = {
  onSuccess?: () => void;
  onError?: (_error: unknown) => void;
};

type UnlinkBoMutationParams = {
  onSuccess?: () => void;
  onError?: (_error: unknown) => void;
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
    onError: (error) => {
      pushApiErrorMessages(error);
      onError?.(error);
    },
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
    onError: (error) => {
      pushApiErrorMessages(error);
      onError?.(error);
    },
  });
}

export function restoreAttachmentMutationOptions({ onSuccess, onError }: RestoreAttachmentParams) {
  return mutationOptions({
    mutationFn: async (fileId: string) => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.ATTACHMENT);
        token = getCsrfToken();
      }

      const res = await axiosInstance.post<unknown>(
        `${ODATA_SERVICE.ATTACHMENT}${MUTATION_API.restoreAttachment(fileId)}`,
        undefined,
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

export function updateAttachmentTitleMutationOptions({ fileId, onSuccess, onError }: Params) {
  return mutationOptions({
    mutationFn: async (payload: UpdateAttachmentPayload) => {
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
    onError: (error) => {
      pushApiErrorMessages(error);
      onError?.(error);
    },
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
    onError: (error) => {
      pushApiErrorMessages(error);
      onError?.(error);
    },
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
    onError: (error) => {
      pushApiErrorMessages(error);
      onError?.(error);
    },
  });
}

export function linkBoToAttachmentMutationOptions({ onSuccess, onError }: LinkBoMutationParams) {
  return mutationOptions({
    mutationFn: async (payload: LinkBoPayload) => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.ATTACHMENT);
        token = getCsrfToken();
      }

      const res = await axiosInstance.post(`${ODATA_SERVICE.ATTACHMENT}${MUTATION_API.linkBo()}`, payload, {
        headers: {
          'accept-language': 'en',
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

export function unlinkBoFromAttachmentMutationOptions({ onSuccess, onError }: UnlinkBoMutationParams) {
  return mutationOptions({
    mutationFn: async (params: UnlinkBoPayload) => {
      const { FileId, BoId } = params;
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.ATTACHMENT);
        token = getCsrfToken();
      }

      const res = await axiosInstance.delete(`${ODATA_SERVICE.ATTACHMENT}${MUTATION_API.unlinkBo(BoId, FileId)}`, {
        headers: {
          'accept-language': 'en',
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
