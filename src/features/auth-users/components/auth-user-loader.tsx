import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { currentUserQueryOptions } from '../options/query';
import { pushApiErrorMessages, pushErrorMessages } from '@/libs/errors';

const ADMIN_ROLE = 'ADMIN';

export function AuthUserLoader() {
  const setIsAdmin = useAuthStore((state) => state.setIsAdmin);
  const setUsername = useAuthStore((state) => state.setUsername);
  const { data, isError, error } = useQuery(currentUserQueryOptions());

  React.useEffect(() => {
    if (isError) {
      pushApiErrorMessages(error);
      setIsAdmin(false);
      setUsername(null);
      return;
    }

    try {
      const currentUser = data?.value?.[0];
      const username = currentUser?.Uname ?? null;
      const normalizedRole = currentUser?.Role?.trim().toUpperCase() || undefined;

      if (!normalizedRole) {
        setIsAdmin(false);
        setUsername(username);
        return;
      }

      setUsername(username);
      setIsAdmin(normalizedRole === ADMIN_ROLE);
    } catch {
      pushErrorMessages(['Failed to load current user information']);
      setIsAdmin(false);
      setUsername(null);
    }
  }, [data, error, isError, setIsAdmin, setUsername]);

  return null;
}
