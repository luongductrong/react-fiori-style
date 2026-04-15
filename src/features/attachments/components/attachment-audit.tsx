import * as React from 'react';
import { displayAuditAction } from '../helpers';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { pushApiErrorMessages } from '@/libs/errors';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { attachmentAuditsQueryOptions } from '../options/query';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { AnalyticalTable, type AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

const columns = [
  {
    Header: 'Action',
    accessor: 'Action',
    Cell: (props: AnalyticalTableCellInstance) => displayAuditAction(props.value),
  },
  {
    Header: 'Note',
    accessor: 'Note',
  },
  {
    Header: 'Performed At',
    accessor: 'Erzet',
    Cell: (props: AnalyticalTableCellInstance) => `${props.row.original.Erdat} ${props.row.original.Erzet}`,
  },
  {
    Header: 'Performed By',
    accessor: 'Ernam',
  },
];

export function AttachmentAudit({ fileId }: { fileId: string }) {
  const {
    data: auditsData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery(
    attachmentAuditsQueryOptions(fileId, {
      'sap-client': 324,
      $count: true,
      $select: 'Action,Erdat,Ernam,Erzet,FileId,Note,Uname',
      // TODO: ask BE what is the different between Uname and Ernam
      $skip: 0,
      $top: 5,
    }),
  );

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
          </Toolbar>
        }
        data={audits}
        columns={columns}
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
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} design="Transparent">
            More [{audits.length}/{totalCount}]
          </Button>
        </Bar>
      )}
    </>
  );
}
