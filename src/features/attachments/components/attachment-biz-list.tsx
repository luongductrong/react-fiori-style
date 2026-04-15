import * as React from 'react';
import { Link } from 'react-router';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { pushApiErrorMessages } from '@/libs/errors';
import { Title } from '@ui5/webcomponents-react/Title';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Button } from '@ui5/webcomponents-react/Button';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { attachmentBOsQueryOptions } from '../options/query';
import { Link as UI5Link } from '@ui5/webcomponents-react/Link';
import { AttachmentBizLinkCreate } from './attachment-biz-link-create';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { displayBoStatus, displayBoType } from '@/features/business-objects/helpers';
import { AnalyticalTable, type AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

export function AttachmentBizList({ fileId, isActive }: { fileId: string; isActive: boolean }) {
  const {
    data: bizObjectsData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery(
    attachmentBOsQueryOptions(fileId, {
      'sap-client': 324,
      $count: true,
      $skip: 0,
      $top: 5,
      // TODO: Move to constants
      $expand: '_Bo',
    }),
  );

  const bizObjects = bizObjectsData?.pages.flatMap((page) => page.value) ?? [];
  const totalCount = bizObjectsData?.pages[0]['@odata.count'] ?? 0;

  React.useEffect(() => {
    if (error) {
      pushApiErrorMessages(error);
    }
  }, [error]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Object ID',
        accessor: 'BoId',
        Cell: (props: AnalyticalTableCellInstance) => (
          <Link to={`/business-objects/${props.value}`}>
            <UI5Link>{props.value}</UI5Link>
          </Link>
        ),
      },
      {
        Header: 'Object Title',
        accessor: '_Bo.BoTitle',
      },
      {
        Header: 'Object Type',
        accessor: '_Bo.BoType',
        Cell: (props: AnalyticalTableCellInstance) => displayBoType(props.value),
      },
      {
        Header: 'Object Status',
        accessor: '_Bo.Status',
        Cell: (props: AnalyticalTableCellInstance) => displayBoStatus(props.value),
      },
      {
        Header: 'Linked At',
        id: 'linked-at',
        Cell: (props: AnalyticalTableCellInstance) => `${props.row.original.Erdat} ${props.row.original.Erzet}`,
      },
      {
        Header: 'Linked By',
        accessor: 'Ernam',
      },
    ],
    [],
  );

  return (
    <>
      <AnalyticalTable
        header={
          <Toolbar className="py-2 px-4 rounded-t-xl">
            <Title level="H4">Objects {totalCount ? `(${totalCount})` : ''}</Title>
            <ToolbarSpacer />
            <AttachmentBizLinkCreate
              fileId={fileId}
              linkedBizObjectIds={bizObjects.map((bo) => bo.BoId)}
              disabled={!isActive}
            />
          </Toolbar>
        }
        data={bizObjects}
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
            More [{bizObjects.length}/{totalCount}]
          </Button>
        </Bar>
      )}
    </>
  );
}
