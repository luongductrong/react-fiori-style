import * as React from 'react';
import '@ui5/webcomponents-icons/refresh.js';
import { Title } from '@ui5/webcomponents-react/Title';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { DashboardRecentAudit } from '@/features/dashboard/components';
import { useInvalidateDashboardQuery } from '@/features/dashboard/hooks';
import { DashboardOverviewCards } from '@/features/dashboard/components';
import { DashboardOperationalPulse } from '@/features/dashboard/components';
import { DashboardSystemComposition } from '@/features/dashboard/components';
import { DashboardConfigurationCoverage } from '@/features/dashboard/components';
import { ToolbarButton, type ToolbarButtonPropTypes } from '@ui5/webcomponents-react/ToolbarButton';

export function DashboardView() {
  const invalidateDashboard = useInvalidateDashboardQuery();

  const handleRefetch: ToolbarButtonPropTypes['onClick'] = React.useCallback(() => {
    invalidateDashboard.invalidateDashboard();
  }, [invalidateDashboard]);

  return (
    <DynamicPage className="flex-1 space-y-6" showFooter={true}>
      <Toolbar className="py-2 px-4 rounded-xl">
        <Title level="H2">System Overview</Title>
        <ToolbarSpacer />
        <ToolbarButton design="Transparent" icon="refresh" text="Refresh" onClick={handleRefetch} />
      </Toolbar>

      <DashboardOverviewCards />

      <div className="grid gap-4 xl:grid-cols-12">
        <DashboardOperationalPulse className="xl:col-span-7" />
        <DashboardSystemComposition className="xl:col-span-5" />
        <DashboardConfigurationCoverage className="xl:col-span-4" />
        <DashboardRecentAudit className="xl:col-span-8" />
      </div>
    </DynamicPage>
  );
}
