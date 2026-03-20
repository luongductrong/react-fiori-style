import { API } from "../constants";
import { ODATA_SERVICE } from "@/app-constant";
import { axiosInstance } from "@/libs/axios-instance";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import type { AttachmentListParams, AttachmentListResponse } from "../types";
import type {
  AttachmentAuditsParams,
  AttachmentAuditsResponse,
  AttachmentDetailParams,
  AttachmentDetailResponse,
  AttachmentVersionsParams,
  AttachmentVersionsResponse,
  VersionDetail,
  VersionDetailParams,
  AttachmentTitleParams,
  AttachmentTitleResponse,
} from "../types";

export function getAttachmentsQueryOptions(params: AttachmentListParams) {
  return queryOptions({
    queryKey: ["attachments", params],
    queryFn: () => {
      const res = axiosInstance.get<AttachmentListResponse>(
        `${ODATA_SERVICE.ATTACHMENT}${API.endpoint}`,
        {
          params,
        },
      );
      return res;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

export function getAttachmentDetailQueryOptions(
  id: string,
  params: AttachmentDetailParams,
) {
  return queryOptions({
    queryKey: ["attachments", id, params],
    queryFn: () => {
      const res = axiosInstance.get<AttachmentDetailResponse>(
        `${ODATA_SERVICE.ATTACHMENT}${API.endpoint}(${id})`,
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

export function getAttachmentVersionsQueryOptions(
  fileId: string,
  params: AttachmentVersionsParams,
) {
  return queryOptions({
    queryKey: ["attachments", fileId, "versions", params],
    queryFn: () => {
      const res = axiosInstance.get<AttachmentVersionsResponse>(
        `${ODATA_SERVICE.ATTACHMENT}${API.versionsEndpoint(fileId)}`,
        {
          params,
        },
      );
      return res;
    },
    enabled: !!fileId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

export function getAttachmentAuditsQueryOptions(
  fileId: string,
  params: AttachmentAuditsParams,
) {
  return queryOptions({
    queryKey: ["attachments", fileId, "audit", params],
    queryFn: () => {
      const res = axiosInstance.get<AttachmentAuditsResponse>(
        `${ODATA_SERVICE.ATTACHMENT}${API.auditEndpoint(fileId)}`,
        {
          params,
        },
      );
      return res;
    },
    enabled: !!fileId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

export function getAttachmentVersionDetailQueryOptions(
  fileId: string,
  versionNo: string,
  params: VersionDetailParams,
) {
  return queryOptions({
    queryKey: ["attachments", fileId, "versions", versionNo, params],
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
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

export function getAttachmentTitleQueryOptions(
  id: string,
  params: AttachmentTitleParams,
) {
  return queryOptions({
    queryKey: ["attachments", id, "title", params],
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
