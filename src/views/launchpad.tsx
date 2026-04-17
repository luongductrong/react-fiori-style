import { cn } from '@/libs/utils';
import { Link } from 'react-router';
import '@ui5/webcomponents-icons/document.js';
import '@ui5/webcomponents-icons/bar-chart.js';
import '@ui5/webcomponents-icons/attachment.js';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { Text } from '@ui5/webcomponents-react/Text';
import { Title } from '@ui5/webcomponents-react/Title';
import '@ui5/webcomponents-icons/person-placeholder.js';
import { BusyIndicator } from '@/components/busy-indicator';
import '@ui5/webcomponents-icons/business-objects-mobile.js';
import { Link as UI5Link } from '@ui5/webcomponents-react/Link';
import { useCurrentAuthUser } from '@/features/auth-users/hooks';

type LaunchpadMainTileConfig = {
  title: string;
  subtitle?: string;
  icon: string;
  route: string;
};

type LaunchpadSubTileConfig = {
  title: string;
  route: string;
};

function LaunchpadMainTile({ title, subtitle, icon, route }: LaunchpadMainTileConfig) {
  return (
    <Link
      to={route}
      className={cn(
        'group flex aspect-square w-44 flex-col justify-between rounded-md border bg-background p-4 text-left',
        'shadow-sm hover:shadow-lg',
      )}
    >
      <div>
        <Title level="H4" className="leading-snug">
          {title}
        </Title>
        {subtitle && <Text className="text-sm">{subtitle}</Text>}
      </div>
      <Icon name={icon} className="size-9 text-primary transition duration-200" />
    </Link>
  );
}

function LaunchpadSubTile({ title, route }: LaunchpadSubTileConfig) {
  return (
    <Link to={route} className="rounded-md border bg-background px-4 py-2 text-left text-sm shadow-sm">
      <UI5Link>{title}</UI5Link>
    </Link>
  );
}

function LaunchpadSection({
  title,
  mainTiles,
  subTiles = [],
}: {
  title?: string;
  mainTiles: LaunchpadMainTileConfig[];
  subTiles?: LaunchpadSubTileConfig[];
}) {
  return (
    <section className="space-y-4">
      {title && <Title level="H3">{title}</Title>}
      <div className="flex flex-wrap gap-4">
        {mainTiles.map((tile) => (
          <LaunchpadMainTile key={tile.title} {...tile} />
        ))}
      </div>
      {subTiles.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {subTiles.map((tile) => (
            <LaunchpadSubTile key={tile.title} {...tile} />
          ))}
        </div>
      )}
    </section>
  );
}

const BUSINESS_MAIN_TILES: LaunchpadMainTileConfig[] = [
  {
    title: 'Manage File Attachments',
    icon: 'attachment',
    route: '/attachments',
  },
  {
    title: 'Manage Business Objects',
    icon: 'business-objects-mobile',
    route: '/business-objects',
  },
];

const ADMIN_MAIN_TILES: LaunchpadMainTileConfig[] = [
  {
    title: 'Dashboard',
    subtitle: 'System Overview',
    icon: 'bar-chart',
    route: '/dashboard',
  },
  {
    title: 'Manage Administrators',
    icon: 'person-placeholder',
    route: '/dashboard/users',
  },
  {
    title: 'Manage Configuration Files',
    icon: 'document',
    route: '/dashboard/configurations',
  },
];

const ADMIN_SUB_TILES: LaunchpadSubTileConfig[] = [
  {
    title: 'Deleted Attachments',
    route: '/dashboard/deleted-attachments',
  },
];

export function LaunchpadView() {
  const { data: currentAuthUser, isPending: isAuthPending } = useCurrentAuthUser();
  const isAdmin = currentAuthUser?.isAdmin ?? false;

  if (isAuthPending) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <BusyIndicator type="loading" />
      </div>
    );
  }

  return (
    <div className="flex-1 relative isolate overflow-x-hidden overflow-y-auto bg-[linear-gradient(180deg,#d9eafb_0%,#dceaf7_44%,#e1ecf6_100%)]">
      <div className="mx-auto flex w-full flex-col gap-10 p-8 pb-20">
        <LaunchpadSection mainTiles={BUSINESS_MAIN_TILES} />
        {isAdmin && (
          <LaunchpadSection title="System Administration" mainTiles={ADMIN_MAIN_TILES} subTiles={ADMIN_SUB_TILES} />
        )}
      </div>
    </div>
  );
}
