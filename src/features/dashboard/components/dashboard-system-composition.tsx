import * as React from 'react';
import { cn } from '@/libs/utils';
import { formatCount } from '../helpers';
import { SectionCard } from './section-card';
import { formatFileSize } from '@/libs/utils';
import { useQuery } from '@tanstack/react-query';
import { pushApiErrorMessages } from '@/libs/errors';
import { Text } from '@ui5/webcomponents-react/Text';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { BusyIndicator } from '@/components/busy-indicator';
import { dashboardAttachmentStatsByTypeQueryOptions } from '../options/query';

function buildFileTypeItems(items: { FileExt: string; VersionCount: number; TotalSize: number }[]) {
  const totalSize = items.reduce((sum, item) => sum + item.TotalSize, 0);

  return items.slice(0, 6).map((item) => ({
    label: `.${item.FileExt}`,
    value: formatFileSize(item.TotalSize),
    meta: `${formatCount(item.VersionCount)} files`,
    percent: totalSize > 0 ? (item.TotalSize / totalSize) * 100 : 0,
  }));
}

export function DashboardSystemComposition({ className }: { className?: string }) {
  const { data, error, isFetching } = useQuery(dashboardAttachmentStatsByTypeQueryOptions());

  React.useEffect(() => {
    if (error) {
      pushApiErrorMessages(error);
    }
  }, [error]);

  const fileTypeItems = React.useMemo(() => buildFileTypeItems(data ?? []), [data]);

  const isLoading = !data && isFetching;

  return (
    <SectionCard
      title="System Composition"
      subtitle="Who is using the system and which file types carry the most weight"
      className={cn('relative', className)}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Text className="text-xs font-semibold uppercase tracking-widest">Storage by Extension</Text>
          {fileTypeItems.length === 0 ? (
            <Text className="text-sm">No attachment type usage available.</Text>
          ) : (
            <div className="space-y-3">
              {fileTypeItems.map((item) => (
                <div key={item.label} className="space-y-1.5 rounded-2xl border p-3">
                  <FlexBox justifyContent="SpaceBetween" alignItems="Center" className="gap-3">
                    <div>
                      <Text className="block text-sm font-medium">{item.label}</Text>
                      {item.meta && <Text className="block text-xs">{item.meta}</Text>}
                    </div>
                    <Text className="text-sm font-semibold">{item.value}</Text>
                  </FlexBox>
                  <div className="h-2 rounded-full border">
                    <div
                      className={cn('h-2 rounded-full transition-all bg-primary')}
                      style={{
                        width: `${item.percent && item.percent > 0 ? Math.max(6, Math.min(item.percent, 100)) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BusyIndicator type="pending" show={isLoading} />
    </SectionCard>
  );
}
