import { API, QUERY_KEYS } from '../constants';
import { ODATA_SERVICE } from '@/app-constant';
import { axiosInstance } from '@/libs/axios-instance';
import type { AttachmentVersionsResponse } from '../types';
import type { VersionDetail, AttachmentAuditsResponse } from '../types';
import type { AttachmentListParams, AttachmentListResponse } from '../types';
import type { AttachmentAuditsParams, AttachmentDetailParams } from '../types';
import type { AttachmentCurrentVersion, AttachmentTitleResponse } from '../types';
import type { AttachmentDetailResponse, AttachmentVersionsParams } from '../types';
import type { AttachmentBizObjectsResponse, AttachmentBizObjectsParams } from '../types';
import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';

export function attachmentsQueryOptions(params: AttachmentListParams) {
  return infiniteQueryOptions({
    queryKey: QUERY_KEYS.attachmentListWithParams(params),
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
    queryKey: QUERY_KEYS.attachmentDetailWithParams(id, params),
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
  });
}

export function attachmentVersionsQueryOptions(fileId: string, params: AttachmentVersionsParams) {
  return infiniteQueryOptions({
    queryKey: QUERY_KEYS.attachmentVersionsWithParams(fileId, params),
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
  });
}

export function attachmentAuditsQueryOptions(fileId: string, params: AttachmentAuditsParams) {
  return infiniteQueryOptions({
    queryKey: QUERY_KEYS.attachmentAuditWithParams(fileId, params),
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
  });
}

export function attachmentVersionDetailQueryOptions(fileId: string, versionNo: string) {
  return queryOptions({
    queryKey: QUERY_KEYS.attachmentVersionDetail(fileId, versionNo),
    queryFn: () => {
      const res = axiosInstance.get<VersionDetail>(
        `${ODATA_SERVICE.ATTACHMENT}${API.versionDetailEndpoint(fileId, versionNo)}`,
      );
      return res;
    },
    enabled: !!fileId && !!versionNo,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 1 * 60 * 1000, // 1 minutes
    refetchOnWindowFocus: false,
  });
}

export function attachmentTitleQueryOptions(id: string) {
  return queryOptions({
    queryKey: QUERY_KEYS.attachmentTitle(id),
    queryFn: () => {
      const res = axiosInstance.get<AttachmentTitleResponse>(
        `${ODATA_SERVICE.ATTACHMENT}${API.attachmentTitleEndpoint(id)}`,
      );
      return res;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function attachmentCurrentVersionQueryOptions(id: string) {
  return queryOptions({
    queryKey: QUERY_KEYS.attachmentCurrentVersion(id),
    queryFn: () => {
      const res = axiosInstance.get<AttachmentCurrentVersion>(
        `${ODATA_SERVICE.ATTACHMENT}${API.attachmentCurrentVersionEndpoint(id)}`,
      );
      return res;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function attachmentBOsQueryOptions(fileId: string, params: AttachmentBizObjectsParams) {
  return infiniteQueryOptions({
    queryKey: QUERY_KEYS.attachmentBoLinksWithParams(fileId, params),
    initialPageParam: params.$skip ?? 0,
    queryFn: ({ pageParam }) => {
      const res = axiosInstance.get<AttachmentBizObjectsResponse>(
        `${ODATA_SERVICE.ATTACHMENT}${API.linkBoEndpoint(fileId)}`,
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
    enabled: !!fileId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
