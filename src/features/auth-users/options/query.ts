import { API, QUERY_KEYS } from '../constants';
import type { AxiosApiError } from '@/types/common';
import { axiosInstance } from '@/libs/axios-instance';
import { queryOptions, keepPreviousData } from '@tanstack/react-query';
import { ODATA_PUBLIC_SERVICE, ODATA_SERVICE, ODATA_SAP_CLIENT } from '@/app-constant';
import type { CurrentPublicUserProfile, CurrentPublicUserProfileResponse } from '../types';
import type { AuthUsersQueryParams, AuthUsersResponse, CurrentAuthUserResponse } from '../types';

export function authUsersQueryOptions(params: AuthUsersQueryParams) {
  return queryOptions<AuthUsersResponse, AxiosApiError>({
    queryKey: QUERY_KEYS.authUserListWithParams(params),
    queryFn: () => {
      const res = axiosInstance.get<AuthUsersResponse>(`${ODATA_SERVICE.AUTH}${API.endpoint}`, {
        params,
      });
      return res;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

export function currentAuthUserQueryOptions() {
  return queryOptions<CurrentAuthUserResponse, AxiosApiError>({
    queryKey: QUERY_KEYS.currentAuthUser(),
    queryFn: () => {
      const res = axiosInstance.get<CurrentAuthUserResponse>(`${ODATA_SERVICE.AUTH}${API.currentUserEndpoint}`);
      return res;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: Infinity,
  });
}

export function currentPublicUserProfileQueryOptions() {
  return queryOptions<CurrentPublicUserProfile, AxiosApiError>({
    queryKey: QUERY_KEYS.currentPublicAuthUser(),
    queryFn: async () => {
      const response = await axiosInstance.get<CurrentPublicUserProfileResponse>(ODATA_PUBLIC_SERVICE.USER, {
        params: {
          $format: 'json',
          'sap-client': ODATA_SAP_CLIENT,
        },
      });

      return response.d;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
