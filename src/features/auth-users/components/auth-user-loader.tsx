import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { currentUserQueryOptions } from '../options/query';
import { pushApiErrorMessages, pushErrorMessages } from '@/libs/errors';

const ADMIN_ROLE = 'ADMIN';

export function AuthUserLoader() {
  const setIsAdmin = useAuthStore((state) => state.setIsAdmin);
  const { data, isError, error } = useQuery(currentUserQueryOptions());

  React.useEffect(() => {
    if (isError) {
      pushApiErrorMessages(error);
      setIsAdmin(false);
      return;
    }

    try {
      const role = data?.value[0].Role?.trim().toUpperCase();

      if (role === undefined) {
        return;
      }
      setIsAdmin(role === ADMIN_ROLE);
    } catch {
      pushErrorMessages(['Failed to load current user information']);
      setIsAdmin(false);
    }
  }, [isError, setIsAdmin, error, data]);

  return null;
}
