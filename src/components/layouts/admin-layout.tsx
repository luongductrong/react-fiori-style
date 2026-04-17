import '@ui5/webcomponents-icons/bar-chart.js';
import '@ui5/webcomponents-icons/delete.js';
import '@ui5/webcomponents-icons/document.js';
import { Title } from '@ui5/webcomponents-react/Title';
import '@ui5/webcomponents-icons/person-placeholder.js';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { SideNavigation } from '@ui5/webcomponents-react/SideNavigation';
import { SideNavigationItem } from '@ui5/webcomponents-react/SideNavigationItem';

const ADMIN_NAV_ITEMS = [
  {
    icon: 'bar-chart',
    route: '/dashboard',
    text: 'Dashboard',
  },
  {
    icon: 'person-placeholder',
    route: '/dashboard/users',
    text: 'Users',
  },
  {
    icon: 'document',
    route: '/dashboard/configurations',
    text: 'Configuration Files',
  },
  {
    icon: 'delete',
    route: '/dashboard/deleted-attachments',
    text: 'Deleted Attachments',
  },
] as const;

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-1">
      <aside className="border-r">
        <SideNavigation
          accessibleName="Administration navigation"
          className="h-full"
          header={
            <Title level="H5" size="H5" className="p-4">
              Administration
            </Title>
          }
        >
          {ADMIN_NAV_ITEMS.map((item) => (
            <SideNavigationItem
              key={item.route}
              icon={item.icon}
              selected={location.pathname === item.route}
              text={item.text}
              onClick={() => {
                navigate(item.route);
              }}
            />
          ))}
        </SideNavigation>
      </aside>
      <section className="min-w-0 flex-1">
        <Outlet />
      </section>
    </div>
  );
}
