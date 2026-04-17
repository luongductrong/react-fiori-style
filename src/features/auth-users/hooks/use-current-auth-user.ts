import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { pushApiErrorMessages } from '@/libs/errors';
import type { CurrentAuthUserState } from '../types';
import { currentAuthUserQueryOptions } from '../options/query';

const ADMIN_ROLE = 'ADMIN';

export function useCurrentAuthUser() {
  const query = useQuery({
    ...currentAuthUserQueryOptions(),
    select: (response): CurrentAuthUserState => {
      const currentUser = response.value?.[0] ?? null;
      const normalizedRole = currentUser?.Role?.trim().toUpperCase() ?? '';

      return {
        currentUser,
        username: currentUser?.Uname ?? null,
        isAdmin: normalizedRole === ADMIN_ROLE,
      };
    },
  });

  React.useEffect(() => {
    if (query.isError) {
      pushApiErrorMessages(query.error);
    }
  }, [query.error, query.isError]);

  return query;
}
