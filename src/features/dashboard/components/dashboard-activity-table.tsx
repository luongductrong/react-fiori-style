import { formatCount } from '@/libs/utils';
import { Text } from '@ui5/webcomponents-react/Text';
import type { AdminDashboardStatsItem } from '../types';

interface DashboardActivityTableProps {
  stats: AdminDashboardStatsItem;
}

const columns = [
  { key: 'metric', label: 'Metric' },
  { key: 'day', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
] as const;

const rows = function (stats: AdminDashboardStatsItem) {
  return [
    {
      metric: 'Attachments Created',
      day: formatCount(stats.AttachmentsCreatedDay),
      week: formatCount(stats.AttachmentsCreatedWeek),
      month: formatCount(stats.AttachmentsCreatedMonth),
      year: formatCount(stats.AttachmentsCreatedYear),
    },
    {
      metric: 'Business Objects Created',
      day: formatCount(stats.BoCreatedDay),
      week: formatCount(stats.BoCreatedWeek),
      month: formatCount(stats.BoCreatedMonth),
      year: formatCount(stats.BoCreatedYear),
    },
    {
      metric: 'Links Created',
      day: formatCount(stats.LinksCreatedDay),
      week: formatCount(stats.LinksCreatedWeek),
      month: formatCount(stats.LinksCreatedMonth),
      year: formatCount(stats.LinksCreatedYear),
    },
    {
      metric: 'Attachments Deleted',
      day: formatCount(stats.DeletedAttachmentsDay),
      week: formatCount(stats.DeletedAttachmentsWeek),
      month: formatCount(stats.DeletedAttachmentsMonth),
      year: formatCount(stats.DeletedAttachmentsYear),
    },
    {
      metric: 'Attachments Reactivated',
      day: formatCount(stats.ReactivatedAttachmentsDay),
      week: formatCount(stats.ReactivatedAttachmentsWeek),
      month: formatCount(stats.ReactivatedAttachmentsMonth),
      year: formatCount(stats.ReactivatedAttachmentsYear),
    },
  ];
};

export function DashboardActivityTable({ stats }: DashboardActivityTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border">
      <div className="grid grid-cols-[minmax(12rem,1.6fr)_repeat(4,minmax(0,1fr))]">
        {columns.map((column) => (
          <div
            key={column.key}
            className={`px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] ${
              column.key !== 'metric' ? 'text-right' : ''
            }`}
          >
            {column.label}
          </div>
        ))}
      </div>
      {rows(stats).map((row, index) => (
        <div
          key={row.metric}
          className={`grid grid-cols-[minmax(12rem,1.6fr)_repeat(4,minmax(0,1fr))] border-t ${
            index % 2 === 0 ? 'bg-background' : 'bg-muted'
          }`}
        >
          <div className="px-4 py-3">
            <Text className="text-sm font-medium">{row.metric}</Text>
          </div>
          <div className="px-4 py-3 text-right text-sm font-medium">{row.day}</div>
          <div className="px-4 py-3 text-right text-sm font-medium">{row.week}</div>
          <div className="px-4 py-3 text-right text-sm font-medium">{row.month}</div>
          <div className="px-4 py-3 text-right text-sm font-medium">{row.year}</div>
        </div>
      ))}
    </div>
  );
}
