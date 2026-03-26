import { API } from '../biz-constants';
import { ODATA_SERVICE } from '@/app-constant';
import { axiosInstance } from '@/libs/axios-instance';
import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import type { AttachmentBizObjectsParams, AttachmentBizObjectsResponse } from '../types';

export function attachmentBOsQueryOptions(fileId: string, params: AttachmentBizObjectsParams) {
  return queryOptions({
    queryKey: ['attachments', fileId, 'biz-objects', params],
    queryFn: () => {
      const res = axiosInstance.get<AttachmentBizObjectsResponse>(
        `${ODATA_SERVICE.BIZ}${API.bizObjectsLinkedEndpoint(fileId)}`,
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
