import '@ui5/webcomponents-icons/home.js';
import '@ui5/webcomponents-icons/refresh.js';
import { useAuthStore } from '@/stores/auth-store';
import { useNavigate, Navigate } from 'react-router';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { useQueryClient } from '@tanstack/react-query';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { DashboardRecentAudit } from '@/features/dashboard/components';
import { DashboardOverviewCards } from '@/features/dashboard/components';
import { DashboardOperationalPulse } from '@/features/dashboard/components';
import { DashboardSystemComposition } from '@/features/dashboard/components';
import { DynamicPageHeader } from '@ui5/webcomponents-react/DynamicPageHeader';
import { DashboardConfigurationCoverage } from '@/features/dashboard/components';

export function DashboardView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAdmin = useAuthStore((state) => state.isAdmin);

  if (!isAdmin) {
    return <Navigate to="/shell-home" />;
  }
  // TODO: Change this logic

  return (
    <DynamicPage
      headerArea={
        <DynamicPageHeader className="py-4 px-8">
          <Button
            design="Transparent"
            tooltip="Click to go to home page"
            onClick={() => {
              navigate('/shell-home');
            }}
            className="cursor-pointer"
          >
            <FlexBox alignItems="Center" className="text-primary gap-2">
              <Icon name="home" className="text-primary" mode="Interactive" />
              <Title level="H1" className="text-primary cursor-pointer">
                Admin Dashboard
              </Title>
            </FlexBox>
          </Button>
        </DynamicPageHeader>
      }
      className="h-dvh"
      showFooter={true}
    >
      <div className="space-y-6 p-4 md:p-6">
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
      </div>
    </DynamicPage>
  );
}
