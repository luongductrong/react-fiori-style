import { API } from '../constants';
import { ODATA_SERVICE } from '@/app-constant';
import { queryOptions } from '@tanstack/react-query';
import { axiosInstance } from '@/libs/axios-instance';
import type { ConfigFileListParams, ConfigFileListResponse } from '../types';

export function configFilesQueryOptions(params: ConfigFileListParams) {
  return queryOptions({
    queryKey: ['config-files', params],
    queryFn: () => {
      const res = axiosInstance.get<ConfigFileListResponse>(`${ODATA_SERVICE.CONFIG_FILE}${API.endpoint}`, {
        params,
      });
      return res;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
