import { QUERY_KEYS } from '../constants';
import { useQueryClient, type QueryKey } from '@tanstack/react-query';

export function useInvalidateAuthUserQuery() {
  const queryClient = useQueryClient();

  const invalidateQuery = function (queryKey: QueryKey) {
    return queryClient.invalidateQueries({ queryKey });
  };

  return {
    invalidateAuthUserList: () => invalidateQuery(QUERY_KEYS.authUserList()),
    invalidateCurrentAuthUser: () => invalidateQuery(QUERY_KEYS.currentAuthUser()),
    invalidateCurrentPublicAuthUser: () => invalidateQuery(QUERY_KEYS.currentPublicAuthUser()),
  };
}
