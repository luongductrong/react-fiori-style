import * as React from 'react';
import { StatCard } from './stat-card';
import { formatCount } from '../helpers';
import { useQueries } from '@tanstack/react-query';
import { pushApiErrorMessages } from '@/libs/errors';
import { BusyIndicator } from '@/components/busy-indicator';
import { dashboardLinkOverviewQueryOptions } from '../options/query';
import { dashboardAuthOverviewQueryOptions } from '../options/query';
import { dashboardConfigOverviewQueryOptions } from '../options/query';
import { dashboardAttachmentOverviewQueryOptions } from '../options/query';
import { dashboardAdminDashboardStatsQueryOptions } from '../options/query';
import { dashboardBusinessObjectOverviewQueryOptions } from '../options/query';

function formatStatValue(value: number | null | undefined, hasData: boolean) {
  return hasData ? formatCount(value) : '-';
}

export function DashboardOverviewCards() {
  const [
    adminDashboardStatsQuery,
    attachmentOverviewQuery,
    authOverviewQuery,
    businessObjectOverviewQuery,
    configOverviewQuery,
    linkOverviewQuery,
  ] = useQueries({
    queries: [
      dashboardAdminDashboardStatsQueryOptions(),
      dashboardAttachmentOverviewQueryOptions(),
      dashboardAuthOverviewQueryOptions(),
      dashboardBusinessObjectOverviewQueryOptions(),
      dashboardConfigOverviewQueryOptions(),
      dashboardLinkOverviewQueryOptions(),
    ] as const,
  });

  const isFetching = React.useMemo(
    () =>
      adminDashboardStatsQuery.isFetching ||
      attachmentOverviewQuery.isFetching ||
      authOverviewQuery.isFetching ||
      businessObjectOverviewQuery.isFetching ||
      configOverviewQuery.isFetching ||
      linkOverviewQuery.isFetching,
    [
      adminDashboardStatsQuery.isFetching,
      attachmentOverviewQuery.isFetching,
      authOverviewQuery.isFetching,
      businessObjectOverviewQuery.isFetching,
      configOverviewQuery.isFetching,
      linkOverviewQuery.isFetching,
    ],
  );

  React.useEffect(() => {
    if (adminDashboardStatsQuery.error) {
      pushApiErrorMessages(adminDashboardStatsQuery.error);
    }
    if (attachmentOverviewQuery.error) {
      pushApiErrorMessages(attachmentOverviewQuery.error);
    }
    if (authOverviewQuery.error) {
      pushApiErrorMessages(authOverviewQuery.error);
    }
    if (businessObjectOverviewQuery.error) {
      pushApiErrorMessages(businessObjectOverviewQuery.error);
    }
    if (configOverviewQuery.error) {
      pushApiErrorMessages(configOverviewQuery.error);
    }
    if (linkOverviewQuery.error) {
      pushApiErrorMessages(linkOverviewQuery.error);
    }
  }, [
    adminDashboardStatsQuery.error,
    attachmentOverviewQuery.error,
    authOverviewQuery.error,
    businessObjectOverviewQuery.error,
    configOverviewQuery.error,
    linkOverviewQuery.error,
  ]);

  const totalUsers = (authOverviewQuery.data?.AdminCount ?? 0) + (authOverviewQuery.data?.UserCount ?? 0);
  const attentionItems =
    (adminDashboardStatsQuery.data?.UnlinkedAttachments ?? 0) +
    (adminDashboardStatsQuery.data?.BoWithoutAttachments ?? 0);
  const hasAdminDashboardStats = adminDashboardStatsQuery.data != null;
  const hasAttachmentOverview = attachmentOverviewQuery.data != null;
  const hasAuthOverview = authOverviewQuery.data != null;
  const hasBusinessObjectOverview = businessObjectOverviewQuery.data != null;
  const hasConfigOverview = configOverviewQuery.data != null;
  const hasLinkOverview = linkOverviewQuery.data != null;

  return (
    <div className="relative grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard
        title="Attachments"
        value={formatStatValue(attachmentOverviewQuery.data?.TotalAttachments, hasAttachmentOverview)}
        subtitle="Repository volume"
        details={[
          {
            label: 'Active',
            value: formatStatValue(attachmentOverviewQuery.data?.ActiveAttachments, hasAttachmentOverview),
          },
          {
            label: 'Inactive',
            value: formatStatValue(attachmentOverviewQuery.data?.InactiveAttachments, hasAttachmentOverview),
          },
        ]}
      />
      <StatCard
        title="Business Objects"
        value={formatStatValue(businessObjectOverviewQuery.data?.TotalBusinessObjects, hasBusinessObjectOverview)}
        subtitle="Managed records"
        details={[
          {
            label: 'Without attachments',
            value: formatStatValue(adminDashboardStatsQuery.data?.BoWithoutAttachments, hasAdminDashboardStats),
          },
          {
            label: 'Created this month',
            value: formatStatValue(adminDashboardStatsQuery.data?.BoCreatedMonth, hasAdminDashboardStats),
          },
        ]}
      />
      <StatCard
        title="Links"
        value={formatStatValue(linkOverviewQuery.data?.TotalLinks, hasLinkOverview)}
        subtitle="Attachment relations"
        details={[
          {
            label: 'Unlinked attachments',
            value: formatStatValue(adminDashboardStatsQuery.data?.UnlinkedAttachments, hasAdminDashboardStats),
          },
          {
            label: 'Created this month',
            value: formatStatValue(adminDashboardStatsQuery.data?.LinksCreatedMonth, hasAdminDashboardStats),
          },
        ]}
      />
      <StatCard
        title="Users"
        value={formatStatValue(totalUsers, hasAuthOverview)}
        subtitle="Authorized accounts"
        details={[{ label: 'Admins', value: formatStatValue(authOverviewQuery.data?.AdminCount, hasAuthOverview) }]}
      />
      <StatCard
        title="Configurations"
        value={formatStatValue(configOverviewQuery.data?.TotalConfigs, hasConfigOverview)}
        subtitle="Allowed file rules"
        details={[
          {
            label: 'Active',
            value: formatStatValue(configOverviewQuery.data?.ActiveConfigs, hasConfigOverview),
          },
          {
            label: 'Inactive',
            value: formatStatValue(
              (configOverviewQuery.data?.TotalConfigs ?? 0) - (configOverviewQuery.data?.ActiveConfigs ?? 0),
              hasConfigOverview,
            ),
          },
        ]}
      />
      <StatCard
        title="Attention Items"
        value={formatStatValue(attentionItems, hasAdminDashboardStats)}
        subtitle="Open structural gaps"
        details={[
          {
            label: 'Deleted this month',
            value: formatStatValue(adminDashboardStatsQuery.data?.DeletedAttachmentsMonth, hasAdminDashboardStats),
          },
          {
            label: 'Reactivated this month',
            value: formatStatValue(adminDashboardStatsQuery.data?.ReactivatedAttachmentsMonth, hasAdminDashboardStats),
          },
        ]}
      />
      <BusyIndicator type="pending" show={isFetching} />
    </div>
  );
}
