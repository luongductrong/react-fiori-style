import '@ui5/webcomponents-icons/refresh.js';
import { useQueryClient } from '@tanstack/react-query';
import { Title } from '@ui5/webcomponents-react/Title';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { DashboardRecentAudit } from '@/features/dashboard/components';
import { DashboardOverviewCards } from '@/features/dashboard/components';
import { DashboardOperationalPulse } from '@/features/dashboard/components';
import { DashboardSystemComposition } from '@/features/dashboard/components';
import { DashboardConfigurationCoverage } from '@/features/dashboard/components';

export function DashboardView() {
  const queryClient = useQueryClient();

  return (
    <DynamicPage className="flex-1 space-y-6" showFooter={true}>
      <Toolbar className="py-2 px-4 rounded-xl">
        <Title level="H2">System Overview</Title>
        <ToolbarSpacer />
        <ToolbarButton
          design="Transparent"
          icon="refresh"
          text="Refresh"
          onClick={() => {
            void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
          }}
        />
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
