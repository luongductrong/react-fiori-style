import * as React from 'react';
import { Navigate } from 'react-router';
import { BusyIndicator } from '@/components/busy-indicator';
import { useCurrentAuthUser } from '@/features/auth-users/hooks';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useCurrentAuthUser();

  if (isPending) {
    return (
      <div className="flex h-dvh w-screen items-center justify-center">
        <BusyIndicator type="loading" />
      </div>
    );
  }

  if (!data?.isAdmin) {
    return <Navigate replace to="/launchpad" />;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
