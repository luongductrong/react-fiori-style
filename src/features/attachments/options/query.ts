import { API } from '../constants';
import { ODATA_SERVICE } from '@/app-constant';
import { axiosInstance } from '@/libs/axios-instance';
import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';
import type { VersionDetail, AttachmentAuditsResponse } from '../types';
import type { AttachmentListParams, AttachmentListResponse } from '../types';
import type { AttachmentAuditsParams, AttachmentDetailParams } from '../types';
import type { AttachmentTitleParams, AttachmentTitleResponse } from '../types';
import type { AttachmentVersionsResponse, VersionDetailParams } from '../types';
import type { AttachmentDetailResponse, AttachmentVersionsParams } from '../types';

export function attachmentsQueryOptions(params: AttachmentListParams) {
  return infiniteQueryOptions({
    queryKey: ['attachments', params],
    initialPageParam: params.$skip,
    queryFn: ({ pageParam }) => {
      const res = axiosInstance.get<AttachmentListResponse>(`${ODATA_SERVICE.ATTACHMENT}${API.endpoint}`, {
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

      if (fetchedCount >= totalCount || lastPage.value.length < params.$top) {
        return undefined;
      }

      return params.$skip + fetchedCount;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

export function attachmentDetailQueryOptions(id: string, params: AttachmentDetailParams) {
  return queryOptions({
    queryKey: ['attachments', id, params],
    queryFn: () => {
      const res = axiosInstance.get<AttachmentDetailResponse>(`${ODATA_SERVICE.ATTACHMENT}${API.endpoint}(${id})`, {
        params,
      });
      return res;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

export function attachmentVersionsQueryOptions(fileId: string, params: AttachmentVersionsParams) {
  return infiniteQueryOptions({
    queryKey: ['attachments', fileId, 'versions', params],
    initialPageParam: params.$skip,
    queryFn: ({ pageParam }) => {
      const res = axiosInstance.get<AttachmentVersionsResponse>(
        `${ODATA_SERVICE.ATTACHMENT}${API.versionsEndpoint(fileId)}`,
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

      if (fetchedCount >= totalCount || lastPage.value.length < params.$top) {
        return undefined;
      }

      return params.$skip + fetchedCount;
    },
    enabled: !!fileId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

export function attachmentAuditsQueryOptions(fileId: string, params: AttachmentAuditsParams) {
  return infiniteQueryOptions({
    queryKey: ['attachments', fileId, 'audit', params],
    initialPageParam: params.$skip,
    queryFn: ({ pageParam }) => {
      const res = axiosInstance.get<AttachmentAuditsResponse>(
        `${ODATA_SERVICE.ATTACHMENT}${API.auditEndpoint(fileId)}`,
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

      if (fetchedCount >= totalCount || lastPage.value.length < params.$top) {
        return undefined;
      }

      return params.$skip + fetchedCount;
    },
    enabled: !!fileId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

export function attachmentVersionDetailQueryOptions(fileId: string, versionNo: string, params: VersionDetailParams) {
  return queryOptions({
    queryKey: ['attachments', fileId, 'versions', versionNo, params],
    queryFn: () => {
      const res = axiosInstance.get<VersionDetail>(
        `${ODATA_SERVICE.ATTACHMENT}${API.versionDetailEndpoint(fileId, versionNo)}`,
        {
          params,
        },
      );
      return res;
    },
    enabled: !!fileId && !!versionNo,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 1 * 60 * 1000, // 1 minutes
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

export function attachmentTitleQueryOptions(id: string, params: AttachmentTitleParams) {
  return queryOptions({
    queryKey: ['attachments', id, 'title', params],
    queryFn: () => {
      const res = axiosInstance.get<AttachmentTitleResponse>(
        `${ODATA_SERVICE.ATTACHMENT}${API.attachmentTitleEndpoint(id)}`,
        {
          params,
        },
      );
      return res;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}
