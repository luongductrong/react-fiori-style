import * as React from 'react';
import { cn } from '@/libs/utils';
import { SectionCard } from './section-card';
import { formatFileSize } from '@/libs/utils';
import { Tag } from '@ui5/webcomponents-react/Tag';
import { useQueries } from '@tanstack/react-query';
import { Text } from '@ui5/webcomponents-react/Text';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { BusyIndicator } from '@/components/busy-indicator';
import { pushApiErrorMessages } from '@/libs/helpers/error-messages';
import { dashboardFileConfigListQueryOptions } from '../options/query';
import { dashboardConfigOverviewQueryOptions } from '../options/query';
import { formatMimeTypesForDisplay } from '@/features/config-files/helpers/mime-types';

export function DashboardConfigurationCoverage({ className }: { className?: string }) {
  const [configOverviewQuery, fileConfigListQuery] = useQueries({
    queries: [dashboardConfigOverviewQueryOptions(), dashboardFileConfigListQueryOptions()] as const,
  });

  React.useEffect(() => {
    if (configOverviewQuery.error) {
      pushApiErrorMessages(configOverviewQuery.error);
    }
    if (fileConfigListQuery.error) {
      pushApiErrorMessages(fileConfigListQuery.error);
    }
  }, [configOverviewQuery.error, fileConfigListQuery.error]);

  const isLoading =
    !configOverviewQuery.data &&
    !fileConfigListQuery.data &&
    (configOverviewQuery.isFetching || fileConfigListQuery.isFetching);

  const items = fileConfigListQuery.data ?? [];

  return (
    <SectionCard
      title="Configuration Coverage"
      subtitle="Allowed file extensions and current activation state"
      className={cn('relative', className)}
    >
      <FlexBox wrap="Wrap" className="gap-2">
        <Tag design="Positive">Active {configOverviewQuery.data?.ActiveConfigs ?? 0}</Tag>
        <Tag design="Information">Total {configOverviewQuery.data?.TotalConfigs ?? 0}</Tag>
      </FlexBox>
      {items.length === 0 ? (
        <Text className="text-sm">No configuration data available.</Text>
      ) : (
        <div className="space-y-2 max-h-[150vh] overflow-y-scroll p-2">
          {items.map((item) => (
            <div key={item.FileExt} className="grid gap-3 rounded-2xl border p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Text className="block text-sm font-semibold">.{item.FileExt}</Text>
                  <Text className="block text-xs">{item.Description}</Text>
                </div>
                <Tag design={item.IsActive ? 'Positive' : 'Negative'}>{item.IsActive ? 'Active' : 'Inactive'}</Tag>
              </div>
              <div className="grid gap-1 text-xs">
                <span>{formatMimeTypesForDisplay(item.MimeType) || '-'}</span>
                <span>Max size {formatFileSize(item.MaxBytes, 'N/A')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <BusyIndicator type="pending" show={isLoading} />
    </SectionCard>
  );
}
