import { API } from '../constants';
import { ODATA_SERVICE } from '@/app-constant';
import type { AxiosApiError } from '@/types/common';
import { axiosInstance } from '@/libs/axios-instance';
import type { BizObjectDetailParams, BizObjectItem } from '../types';
import type { BizObjectListParams, BizObjectListResponse } from '../types';
import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';
import type { BizObjectLinkedAttachmentParams, BizObjectLinkedAttachmentsResponse } from '../types';

export function bizObjectsQueryOptions(params: BizObjectListParams) {
  return infiniteQueryOptions({
    queryKey: ['biz-objects', params],
    initialPageParam: params.$skip ?? 0,
    queryFn: ({ pageParam }) => {
      const res = axiosInstance.get<BizObjectListResponse>(`${ODATA_SERVICE.BIZ}${API.endpoint}`, {
        params: {
          ...params,
          $skip: pageParam,
          $top: params.$top,
        },
      });
      return res;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalCount = Number(lastPage['@odata.count'] ?? 0);
      const fetchedCount = allPages.reduce((total, page) => total + page.value.length, 0);
      const pageSize = params.$top ?? lastPage.value.length;

      if (fetchedCount >= totalCount || lastPage.value.length < pageSize) {
        return undefined;
      }

      return (params.$skip ?? 0) + fetchedCount;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });
}

export function bizObjectDetailQueryOptions(boId: string, params: BizObjectDetailParams) {
  return queryOptions<BizObjectItem, AxiosApiError>({
    queryKey: ['biz-objects', boId, params],
    queryFn: () => {
      const res = axiosInstance.get<BizObjectItem>(`${ODATA_SERVICE.BIZ}${API.endpoint}(${boId})`, {
        params,
      });
      return res;
    },
    enabled: !!boId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function bizObjectLinkedAttachmentsQueryOptions(boId: string, params: BizObjectLinkedAttachmentParams) {
  return infiniteQueryOptions({
    queryKey: ['biz-objects', boId, 'linked-attachments', params],
    initialPageParam: params.$skip ?? 0,
    queryFn: async ({ pageParam }) => {
      const res = await axiosInstance.get<BizObjectLinkedAttachmentsResponse>(
        `${ODATA_SERVICE.BIZ}${API.linkAttachmentEndpoint(boId)}`,
        {
          params: {
            ...params,
            $skip: pageParam,
            $top: params.$top,
          },
        },
      );
      return res;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalCount = Number(lastPage['@odata.count'] ?? 0);
      const fetchedCount = allPages.reduce((total, page) => total + page.value.length, 0);
      const pageSize = params.$top ?? lastPage.value.length;

      if (fetchedCount >= totalCount || lastPage.value.length < pageSize) {
        return undefined;
      }

      return (params.$skip ?? 0) + fetchedCount;
    },
    enabled: !!boId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
}
