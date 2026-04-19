import * as React from 'react';
import { cn } from '@/libs/utils';
import { SectionCard } from './section-card';
import { useQuery } from '@tanstack/react-query';
import { Text } from '@ui5/webcomponents-react/Text';
import { BusyIndicator } from '@/components/busy-indicator';
import { DashboardActivityTable } from './dashboard-activity-table';
import { pushApiErrorMessages } from '@/libs/helpers/error-messages';
import { dashboardAdminDashboardStatsQueryOptions } from '../options/query';

export function DashboardOperationalPulse({ className }: { className?: string }) {
  const { data, error, isFetching } = useQuery(dashboardAdminDashboardStatsQueryOptions());

  React.useEffect(() => {
    if (error) {
      pushApiErrorMessages(error);
    }
  }, [error]);

  return (
    <SectionCard
      title="Operational Pulse"
      subtitle="Creation, deletion and reactivation trends by time window"
      className={cn('relative', className)}
    >
      {data ? <DashboardActivityTable stats={data} /> : <Text className="text-sm">No activity data available.</Text>}
      <BusyIndicator type="pending" show={isFetching} />
    </SectionCard>
  );
}
