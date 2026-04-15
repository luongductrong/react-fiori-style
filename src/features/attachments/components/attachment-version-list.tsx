import * as React from 'react';
import { Link } from 'react-router';
import { FileUpload } from './file-upload';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { pushApiErrorMessages } from '@/libs/errors';
import { Title } from '@ui5/webcomponents-react/Title';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Button } from '@ui5/webcomponents-react/Button';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import '@ui5/webcomponents-icons/navigation-right-arrow.js';
import { Link as UI5Link } from '@ui5/webcomponents-react/Link';
import { attachmentVersionsQueryOptions } from '../options/query';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { AnalyticalTable, type AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

interface AttachmentVersionListProps {
  fileId: string;
  isActive: boolean;
  currentVersionNo: string;
  currentExtension: string;
}

export function AttachmentVersionList({
  fileId,
  isActive,
  currentVersionNo,
  currentExtension,
}: AttachmentVersionListProps) {
  const {
    data: versionsData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery(
    attachmentVersionsQueryOptions(fileId, {
      'sap-client': 324,
      $count: true,
      $select: 'Erdat,Ernam,Erzet,FileId,FileName,VersionNo',
      $skip: 0,
      $top: 5,
    }),
  );

  const versions = versionsData?.pages.flatMap((page) => page.value) ?? [];
  const totalCount = versionsData?.pages[0]['@odata.count'] ?? 0;

  React.useEffect(() => {
    if (error) {
      pushApiErrorMessages(error);
    }
  }, [error]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Version',
        accessor: 'VersionNo',
        Cell: (props: AnalyticalTableCellInstance) => (
          <Link to={`/attachments/${fileId}/versions/${props.value}`}>
            <UI5Link>{`${props.value ?? 'N/A'}${props.value === currentVersionNo ? ' (Current)' : ''}`}</UI5Link>
          </Link>
        ),
      },
      {
        Header: 'File Name',
        accessor: 'FileName',
        Cell: (props: AnalyticalTableCellInstance) => (
          <Link to={`/attachments/${fileId}/versions/${props.row.original.VersionNo}`}>
            <UI5Link>{props.value ?? 'N/A'}</UI5Link>
          </Link>
        ),
      },
      {
        Header: 'Created At',
        id: 'created-at',
        Cell: (props: AnalyticalTableCellInstance) => `${props.row.original.Erdat} ${props.row.original.Erzet}`,
      },
      {
        Header: 'Created By',
        accessor: 'Ernam',
      },
    ],
    [fileId, currentVersionNo],
  );

  return (
    <>
      <AnalyticalTable
        header={
          <Toolbar className="py-2 px-4 rounded-t-xl">
            <Title level="H4">Versions {totalCount ? `(${totalCount})` : ''}</Title>
            <ToolbarSpacer />
            {/* ToolbarButton - FileUpload */}
            <FileUpload fileId={fileId} currentExtension={currentExtension} disabled={!isActive} />
          </Toolbar>
        }
        data={versions}
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
            More [{versions.length}/{totalCount}]
          </Button>
        </Bar>
      )}
    </>
  );
}
