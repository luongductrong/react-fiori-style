import * as React from 'react';
import { cn } from '@/libs/utils';
import { Link } from 'react-router';
import { SectionCard } from './section-card';
import { useQuery } from '@tanstack/react-query';
import { Tag } from '@ui5/webcomponents-react/Tag';
import { Text } from '@ui5/webcomponents-react/Text';
import { BusyIndicator } from '@/components/busy-indicator';
import { Link as UI5Link } from '@ui5/webcomponents-react/Link';
import { pushApiErrorMessages } from '@/libs/helpers/error-messages';
import { dashboardRecentAuditLogsQueryOptions } from '../options/query';
import { displayListDate, displayListTime } from '@/libs/helpers/date-time';

function displayAuditAction(action?: string) {
  switch (action) {
    case 'CREATE':
      return 'Create';
    case 'UPDATE_TITLE':
      return 'Update Title';
    case 'SET_CURRENT_VERSION':
      return 'Set Current Version';
    case 'DELETE':
      return 'Delete';
    case 'REACTIVATE':
      return 'Restore';
    case 'LINK_BO':
    case 'LINK_TO_BO':
      return 'Link to Business Object';
    case 'UNLINK_BO':
    case 'UNLINK_FROM_BO':
      return 'Unlink from Business Object';
    case 'CREATE_VERSION':
    case 'UPLOAD_NEW_VERSION':
      return 'Upload New Version';
    default:
      return action ? `"${action}"` : '-';
  }
}

function formatGuid(value: string) {
  return value ? value.slice(0, 8) : '-';
}

export function DashboardRecentAudit({ className }: { className?: string }) {
  const { data: items, error, isFetching, isLoading } = useQuery(dashboardRecentAuditLogsQueryOptions());

  React.useEffect(() => {
    if (error) {
      pushApiErrorMessages(error);
    }
  }, [error]);

  return (
    <SectionCard
      title="Recent Audit Logs"
      subtitle="Latest attachment-related activity captured by the service"
      className={cn('relative', className)}
    >
      {isLoading && <BusyIndicator type="loading" show={isFetching} />}
      {items && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={`${item.FileId}-${item.Erdat}-${item.Erzet}-${item.Action}`} className="rounded-2xl border p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <Tag design="Information">{displayAuditAction(item.Action)}</Tag>
                  <Text className="block text-sm font-medium">{item.Note}</Text>
                </div>
                <Text className="text-xs">
                  {[displayListDate(item.Erdat, item.Erzet), displayListTime(item.Erdat, item.Erzet)]
                    .filter(Boolean)
                    .join(' ')}
                </Text>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                <Link to={`/attachments/${item.FileId}`}>
                  <UI5Link>File {formatGuid(item.FileId)}</UI5Link>
                </Link>
                <span>By {item.Ernam}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {items && items.length === 0 && !isLoading && (
        <Text className="text-sm">No recent audit activity available.</Text>
      )}
      <BusyIndicator type="pending" show={!isLoading && isFetching} />
    </SectionCard>
  );
}
