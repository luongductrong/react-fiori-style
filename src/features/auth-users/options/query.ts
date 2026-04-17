import { API } from '../constants';
import type { AxiosApiError } from '@/types/common';
import { queryOptions } from '@tanstack/react-query';
import { axiosInstance } from '@/libs/axios-instance';
import { ODATA_PUBLIC_SERVICE, ODATA_SERVICE } from '@/app-constant';
import type { CurrentPublicUserProfile, CurrentPublicUserProfileResponse } from '../types';
import type { AuthUsersQueryParams, AuthUsersResponse, CurrentAuthUserResponse } from '../types';

export function authUsersQueryOptions(params: AuthUsersQueryParams) {
  return queryOptions<AuthUsersResponse, AxiosApiError>({
    queryKey: ['auth-users', params],
    queryFn: () => {
      const res = axiosInstance.get<AuthUsersResponse>(`${ODATA_SERVICE.AUTH}${API.endpoint}`, {
        params,
      });
      return res;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function currentAuthUserQueryOptions() {
  return queryOptions<CurrentAuthUserResponse, AxiosApiError>({
    queryKey: ['auth-users', 'current-user'],
    queryFn: () => {
      const res = axiosInstance.get<CurrentAuthUserResponse>(`${ODATA_SERVICE.AUTH}${API.currentUserEndpoint}`, {
        params: {
          'sap-client': 324,
        },
      });
      return res;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: Infinity,
  });
}

export function currentPublicUserProfileQueryOptions() {
  return queryOptions<CurrentPublicUserProfile, AxiosApiError>({
    queryKey: ['auth-users', 'current-public-user-profile'],
    queryFn: async () => {
      const response = await axiosInstance.get<CurrentPublicUserProfileResponse>(ODATA_PUBLIC_SERVICE.USER, {
        params: {
          $format: 'json',
          'sap-client': ODATA_PUBLIC_SERVICE.SAP_CLIENT,
        },
      });

      return response.d;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
