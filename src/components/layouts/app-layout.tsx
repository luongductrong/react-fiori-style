import { Outlet, useLocation } from 'react-router';
import { AppHeader } from '@/components/layouts/app-header';

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function getHeaderTitle(pathname: string) {
  if (matchesRoute(pathname, '/dashboard/users')) {
    return 'Users Management';
  }

  if (matchesRoute(pathname, '/dashboard/configurations')) {
    return 'Configurations Management';
  }

  if (matchesRoute(pathname, '/dashboard/deleted-attachments')) {
    return 'Deleted Attachments Management';
  }

  if (pathname === '/launchpad') {
    return 'Home';
  }

  if (matchesRoute(pathname, '/attachments')) {
    return 'Attachments';
  }

  if (matchesRoute(pathname, '/business-objects')) {
    return 'Business Objects';
  }

  if (matchesRoute(pathname, '/dashboard')) {
    return 'Dashboard';
  }

  return 'Not Found';
}

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <AppHeader primaryTitle={getHeaderTitle(location.pathname)} />
      <Outlet />
    </div>
  );
}
