import { MUTATION_API } from '../constants';
import { ODATA_SERVICE } from '@/app-constant';
import { pushApiErrorMessages } from '@/libs/errors';
import { axiosInstance } from '@/libs/axios-instance';
import { mutationOptions } from '@tanstack/react-query';
import { fetchCsrfToken, getCsrfToken } from '@/libs/helpers';
import type { EnableConfigFileParams, EnableConfigFileResponse } from '../types';
import type { CreateConfigFilePayload, CreateConfigFileResponse } from '../types';
import type { UpdateConfigFilePayload, UpdateConfigFileResponse } from '../types';
import type { DisableConfigFileParams, DisableConfigFileResponse } from '../types';

type CreateConfigFileMutationParams = {
  onSuccess?: (data: CreateConfigFileResponse) => void;
  onError?: (error: unknown) => void;
};

type EnableConfigFileMutationParams = {
  onSuccess?: (data: EnableConfigFileResponse) => void;
  onError?: (error: unknown) => void;
};

type UpdateConfigFileMutationParams = {
  fileExt: string;
  onSuccess?: (data: UpdateConfigFileResponse) => void;
  onError?: (error: unknown) => void;
};

type DisableConfigFileMutationParams = {
  onSuccess?: (data: DisableConfigFileResponse) => void;
  onError?: (error: unknown) => void;
};

export function createConfigFileMutationOptions({ onSuccess, onError }: CreateConfigFileMutationParams) {
  return mutationOptions({
    mutationFn: async (payload: CreateConfigFilePayload) => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.CONFIG_FILE);
        token = getCsrfToken();
      }

      const res = await axiosInstance.post<CreateConfigFileResponse>(
        `${ODATA_SERVICE.CONFIG_FILE}${MUTATION_API.create}`,
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

export function enableConfigFileMutationOptions({ onSuccess, onError }: EnableConfigFileMutationParams) {
  return mutationOptions({
    mutationFn: async (params: EnableConfigFileParams) => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.CONFIG_FILE);
        token = getCsrfToken();
      }

      const res = await axiosInstance.post<EnableConfigFileResponse>(
        `${ODATA_SERVICE.CONFIG_FILE}${MUTATION_API.enable(params.FileExt)}`,
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

export function updateConfigFileMutationOptions({ fileExt, onSuccess, onError }: UpdateConfigFileMutationParams) {
  return mutationOptions({
    mutationFn: async (payload: UpdateConfigFilePayload) => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.CONFIG_FILE);
        token = getCsrfToken();
      }

      const res = await axiosInstance.patch<UpdateConfigFileResponse>(
        `${ODATA_SERVICE.CONFIG_FILE}${MUTATION_API.update(fileExt)}`,
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

export function disableConfigFileMutationOptions({ onSuccess, onError }: DisableConfigFileMutationParams) {
  return mutationOptions({
    mutationFn: async (params: DisableConfigFileParams) => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken(ODATA_SERVICE.CONFIG_FILE);
        token = getCsrfToken();
      }

      const res = await axiosInstance.post<DisableConfigFileResponse>(
        `${ODATA_SERVICE.CONFIG_FILE}${MUTATION_API.disable(params.FileExt)}`,
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
