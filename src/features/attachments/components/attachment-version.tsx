import * as React from 'react';
import '@ui5/webcomponents-icons/add.js';
import { useNavigate } from 'react-router';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { pushApiErrorMessages } from '@/libs/errors';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { Title } from '@ui5/webcomponents-react/Title';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Button } from '@ui5/webcomponents-react/Button';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import '@ui5/webcomponents-icons/navigation-right-arrow.js';
import { attachmentVersionsQueryOptions } from '../options/query';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { AnalyticalTable } from '@ui5/webcomponents-react/AnalyticalTable';

const versionColumns = [
  {
    Header: 'Version',
    accessor: 'VersionNo',
  },
  {
    Header: 'File Name',
    accessor: 'FileName',
  },
  {
    Header: 'Created On',
    accessor: 'Erdat',
  },
  {
    Header: 'Created By',
    accessor: 'Ernam',
  },
  {
    Header: '',
    id: 'nav',
    width: 60,
    disableSortBy: true,
    disableGroupBy: true,
    Cell: () => <Icon name="navigation-right-arrow" />,
  },
];

export function AttachmentVersion({ fileId, isActive }: { fileId: string; isActive: boolean }) {
  const navigate = useNavigate();
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
      $select: 'Erdat,Ernam,FileId,FileName,VersionNo,__EntityControl/Deletable,__EntityControl/Updatable',
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

  return (
    <>
      <AnalyticalTable
        header={
          <Toolbar className="py-2 px-4 rounded-t-xl">
            <Title level="H4">Versions {totalCount ? `(${totalCount})` : ''}</Title>
            <ToolbarSpacer />
            <Button
              design="Emphasized"
              icon="add"
              onClick={() => navigate(`/attachments/${fileId}/upload`)}
              disabled={!isActive}
              className="h-8"
            >
              Upload
            </Button>
          </Toolbar>
        }
        data={versions}
        columns={versionColumns}
        loading={isFetching || isFetchingNextPage}
        rowHeight={36}
        selectionMode="None"
        visibleRows={10}
        sortable
        onRowClick={(e) => {
          const item = e.detail.row.original;
          if (!item?.FileId) return;
          navigate(`/attachments/${item.FileId}/versions/${item.VersionNo}`);
        }}
        groupable
        scaleWidthMode="Smart"
      />
      {hasNextPage && (
        <Bar>
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            More [{versions.length}/{totalCount}]
          </Button>
        </Bar>
      )}
    </>
  );
}
