import { cn } from '@/libs/utils';
import { Link } from 'react-router';
import '@ui5/webcomponents-icons/log.js';
import '@ui5/webcomponents-icons/home.js';
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

const BUSINESS_SUB_TILES: LaunchpadSubTileConfig[] = [
  {
    title: 'Attachments Overview',
    route: '/attachments',
  },
  {
    title: 'Business Object Registry',
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
    title: 'System Overview',
    route: '/dashboard',
  },
  {
    title: 'User Access',
    route: '/dashboard/users',
  },
  {
    title: 'File Rules',
    route: '/dashboard/configurations',
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
    <main className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#d9eafb_0%,#dceaf7_44%,#e1ecf6_100%)]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.16),transparent_35%),linear-gradient(320deg,rgba(255,255,255,0.14),transparent_42%)] opacity-95" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_0_14%,transparent_14%_100%)]" />
        <div className="absolute -left-32 -top-8 h-176 w-176 rotate-24 rounded-[42%_58%_51%_49%/46%_39%_61%_54%] bg-white/20" />
        <div className="absolute left-1/2 -top-88 h-208 w-208 -translate-x-1/2 rounded-[54%_46%_39%_61%/40%_55%_45%_60%] bg-white/20" />
        <div className="absolute -bottom-8 -right-32 h-136 w-3xl rotate-28 rounded-[60%_40%_47%_53%/38%_48%_52%_62%] bg-white/20" />
      </div>
      <div className="mx-auto flex w-full flex-col gap-10 p-8 pb-20">
        <LaunchpadSection mainTiles={BUSINESS_MAIN_TILES} subTiles={BUSINESS_SUB_TILES} />
        {isAdmin && (
          <LaunchpadSection title="System Administration" mainTiles={ADMIN_MAIN_TILES} subTiles={ADMIN_SUB_TILES} />
        )}
      </div>
      <footer className="absolute bottom-4 left-4 right-4 z-10 text-center text-xs text-muted-foreground sm:left-auto sm:right-5 sm:text-left">
        Copyright (c) {new Date().getFullYear()} SAP SE All Rights Reserved.
      </footer>
    </main>
  );
}
