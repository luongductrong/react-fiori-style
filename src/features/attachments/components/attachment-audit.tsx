import { Bar } from '@ui5/webcomponents-react/Bar';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { attachmentAuditsQueryOptions } from '../options/query';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { AnalyticalTable } from '@ui5/webcomponents-react/AnalyticalTable';

const auditColumns = [
  {
    Header: 'Action',
    accessor: 'Action',
  },
  {
    Header: 'Note',
    accessor: 'Note',
  },
  {
    Header: 'Performed By',
    accessor: 'Ernam',
  },
  {
    Header: 'Performed On',
    accessor: 'Erdat',
  },
  {
    Header: 'Performed At',
    accessor: 'Erzet',
  },
];

export function AttachmentAudit({ fileId }: { fileId: string }) {
  const {
    data: auditsData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    attachmentAuditsQueryOptions(fileId, {
      'sap-client': 324,
      $count: true,
      $select: 'Action,Erdat,Ernam,Erzet,FileId,Note,Uname',
      $skip: 0,
      $top: 5,
    }),
  );

  const audits = auditsData?.pages.flatMap((page) => page.value) ?? [];
  const totalCount = auditsData?.pages[0]['@odata.count'] ?? 0;

  return (
    <>
      <AnalyticalTable
        header={
          <Toolbar className="py-2 px-4 rounded-t-xl">
            <Title level="H4">Audit {totalCount ? `(${totalCount})` : ''}</Title>
            <ToolbarSpacer />
          </Toolbar>
        }
        data={audits}
        columns={auditColumns}
        loading={isFetching || isFetchingNextPage}
        rowHeight={36}
        selectionMode="None"
        visibleRows={10}
        sortable
        groupable
        scaleWidthMode="Smart"
      />
      {hasNextPage && (
        <Bar>
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            More [{audits.length}/{totalCount}]
          </Button>
        </Bar>
      )}
    </>
  );
}
