import * as React from 'react';
import { useViewStore } from '@/stores/view-store';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { ViewSettings } from '@/components/view-settings';
import { useInfiniteQuery } from '@tanstack/react-query';
import { displayAuditAction } from '../helpers/formatter';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { attachmentAuditsQueryOptions } from '../options/query';
import { pushApiErrorMessages } from '@/libs/helpers/error-messages';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { buildSelectWithDateTimeFields } from '@/libs/helpers/odata-select';
import { displayListDate, displayListTime } from '@/libs/helpers/date-time';
import { ATTACHMENT_AUDIT_FIELDS, type AttachmentAuditFieldId } from '../view-config';
import { AnalyticalTable, type AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

type AttachmentAuditColumn = {
  id: AttachmentAuditFieldId;
} & Record<string, unknown>;

const ALL_COLUMNS = [
  {
    Header: 'Action',
    accessor: 'Action',
    id: 'Action',
    Cell: (props: AnalyticalTableCellInstance) => displayAuditAction(props.value),
  },
  {
    Header: 'Note',
    accessor: 'Note',
    id: 'Note',
  },
  {
    Header: 'Performed On',
    accessor: 'Erdat',
    id: 'Erdat',
    Cell: (props: AnalyticalTableCellInstance) => displayListDate(props.row.original.Erdat, props.row.original.Erzet),
  },
  {
    Header: 'Performed At',
    accessor: 'Erzet',
    id: 'Erzet',
    Cell: (props: AnalyticalTableCellInstance) => displayListTime(props.row.original.Erdat, props.row.original.Erzet),
  },
  {
    Header: 'Performed By',
    accessor: 'Ernam',
    id: 'Ernam',
  },
] as const satisfies readonly AttachmentAuditColumn[];

export function AttachmentAudit({ fileId }: { fileId: string }) {
  const selectedFieldIds = useViewStore((state) => state.attachmentAuditVisibleFieldIds);
  const setSelectedFieldIds = useViewStore((state) => state.setAttachmentAuditVisibleFieldIds);
  const attachmentAuditSelect = React.useMemo(() => buildSelectWithDateTimeFields(selectedFieldIds), [selectedFieldIds]);
  const visibleColumns = React.useMemo(
    () => ALL_COLUMNS.filter((col) => selectedFieldIds.includes(col.id)),
    [selectedFieldIds],
  );
  const {
    data: auditsData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    ...attachmentAuditsQueryOptions(fileId, {
      $count: true,
      $select: attachmentAuditSelect,
      $orderby: 'Erdat desc,Erzet desc',
      $skip: 0,
      $top: 5,
    }),
    enabled: !!fileId && selectedFieldIds.length > 0,
  });

  const audits = auditsData?.pages.flatMap((page) => page.value) ?? [];
  const totalCount = auditsData?.pages[0]['@odata.count'] ?? 0;

  React.useEffect(() => {
    if (error) {
      pushApiErrorMessages(error);
    }
  }, [error]);

  return (
    <>
      <AnalyticalTable
        header={
          <Toolbar className="py-2 px-4 rounded-t-xl">
            <Title level="H4">Audit {totalCount ? `(${totalCount})` : ''}</Title>
            <ToolbarSpacer />
            <ViewSettings
              fields={ATTACHMENT_AUDIT_FIELDS}
              selectedIds={selectedFieldIds}
              setSelectedIds={setSelectedFieldIds}
            />
          </Toolbar>
        }
        data={selectedFieldIds.length > 0 ? audits : []}
        columns={selectedFieldIds.length > 0 ? visibleColumns : []}
        loading={isFetching || isFetchingNextPage}
        noDataText={
          selectedFieldIds.length === 0
            ? 'There are no visible columns in the table right now. Please select the columns you need in the table settings.'
            : 'No audit records found.'
        }
        rowHeight={36}
        selectionMode="None"
        visibleRows={10}
        sortable
        groupable={false}
        scaleWidthMode="Smart"
      />
      {hasNextPage && (
        <Bar>
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} design="Transparent">
            More [{audits.length}/{totalCount}]
          </Button>
        </Bar>
      )}
    </>
  );
}
