import { API } from '../constants';
import { ODATA_SERVICE } from '@/app-constant';
import { queryOptions } from '@tanstack/react-query';
import { axiosInstance } from '@/libs/axios-instance';
import type { AuthUserListParams, AuthUserListResponse, CurrentUser } from '../types';

export function getAuthUsersQueryOptions(params: AuthUserListParams) {
  return queryOptions({
    queryKey: ['auth-users', params],
    queryFn: async () => {
      const res = await axiosInstance.get<AuthUserListResponse>(`${ODATA_SERVICE.AUTH}${API.endpoint}`, {
        params,
      });

      return res;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function currentUserQueryOptions() {
  return queryOptions({
    queryKey: ['auth-users', 'current-user'],
    queryFn: () => {
      const res = axiosInstance.get<CurrentUser>(`${ODATA_SERVICE.AUTH}${API.currentUserEndpoint}`, {
        params: {
          'sap-client': 324,
        },
      });
      return res;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}
