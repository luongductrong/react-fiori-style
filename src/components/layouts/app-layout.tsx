import { Outlet, useLocation } from 'react-router';
import { AppHeader } from '@/components/layouts/app-header';

function getHeaderTitle(pathname: string) {
  if (pathname.startsWith('/dashboard/users')) {
    return 'Users Management';
  }

  if (pathname.startsWith('/dashboard/configurations')) {
    return 'Configurations Management';
  }

  if (pathname === '/launchpad') {
    return 'Home';
  }

  if (pathname.startsWith('/attachments')) {
    return 'Attachments';
  }

  if (pathname.startsWith('/business-objects')) {
    return 'Business Objects';
  }

  if (pathname.startsWith('/dashboard')) {
    return 'Dashboard';
  }

  if (pathname.startsWith('/admin')) {
    return 'Administration';
  }

  return 'Corporate Portal';
}

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader primaryTitle={getHeaderTitle(location.pathname)} />
      <Outlet />
    </div>
  );
}
