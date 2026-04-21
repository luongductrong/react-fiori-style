import * as React from 'react';
import { Link } from 'react-router';
import { FileUpload } from './file-upload';
import { formatFileSize } from '@/libs/utils';
import { useViewStore } from '@/stores/view-store';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { Title } from '@ui5/webcomponents-react/Title';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Button } from '@ui5/webcomponents-react/Button';
import { ViewSettings } from '@/components/view-settings';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import '@ui5/webcomponents-icons/navigation-right-arrow.js';
import { Link as UI5Link } from '@ui5/webcomponents-react/Link';
import { attachmentVersionsQueryOptions } from '../options/query';
import { pushApiErrorMessages } from '@/libs/helpers/error-messages';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { VERSION_LIST_FIELDS, type AttachmentVersionListFieldId } from '../view-config';
import { AnalyticalTable, type AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

interface AttachmentVersionListProps {
  fileId: string;
  disabled: boolean;
  currentVersionNo: string;
  currentExtension: string;
}

type AttachmentVersionListColumn = {
  id: AttachmentVersionListFieldId;
} & Record<string, unknown>;

const ALL_COLUMNS = [
  {
    Header: 'Version',
    accessor: 'VersionNo',
    id: 'VersionNo',
  },
  {
    Header: 'File Name',
    accessor: 'FileName',
    id: 'FileName',
  },
  {
    Header: 'File Extension',
    accessor: 'FileExtension',
    id: 'FileExtension',
  },
  {
    Header: 'MIME Type',
    accessor: 'MimeType',
    id: 'MimeType',
  },
  {
    Header: 'File Size',
    accessor: 'FileSize',
    id: 'FileSize',
    Cell: (props: AnalyticalTableCellInstance) => formatFileSize(props.value),
  },
  {
    Header: 'Created On',
    accessor: 'Erdat',
    id: 'Erdat',
  },
  {
    Header: 'Created At',
    accessor: 'Erzet',
    id: 'Erzet',
  },
  {
    Header: 'Created By',
    accessor: 'Ernam',
    id: 'Ernam',
  },
] as const satisfies readonly AttachmentVersionListColumn[];

export function AttachmentVersionList({
  fileId,
  disabled,
  currentVersionNo,
  currentExtension,
}: AttachmentVersionListProps) {
  const selectedFieldIds = useViewStore((state) => state.versionListVisibleFieldIds);
  const setSelectedFieldIds = useViewStore((state) => state.setVersionListVisibleFieldIds);
  const attachmentVersionListSelect = React.useMemo(
    () => Array.from(new Set([...selectedFieldIds, 'VersionNo'])).join(','),
    [selectedFieldIds],
  );
  const visibleColumns = React.useMemo(
    () => ALL_COLUMNS.filter((col) => selectedFieldIds.includes(col.id)),
    [selectedFieldIds],
  );
  const {
    data: versionsData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    ...attachmentVersionsQueryOptions(fileId, {
      $count: true,
      $select: attachmentVersionListSelect,
      $skip: 0,
      $top: 5,
    }),
    enabled: !!fileId && selectedFieldIds.length > 0,
  });

  const versions = versionsData?.pages.flatMap((page) => page.value) ?? [];
  const totalCount = versionsData?.pages[0]['@odata.count'] ?? 0;

  React.useEffect(() => {
    if (error) {
      pushApiErrorMessages(error);
    }
  }, [error]);

  const columns = React.useMemo(
    () => [
      ...visibleColumns.map((column) => {
        if (column.id === 'VersionNo') {
          return {
            ...column,
            Cell: (props: AnalyticalTableCellInstance) => (
              <Link to={`/attachments/${fileId}/versions/${props.value}`}>
                <UI5Link>{`${props.value ?? 'N/A'}${props.value === currentVersionNo ? ' (Current)' : ''}`}</UI5Link>
              </Link>
            ),
          };
        }

        if (column.id === 'FileName') {
          return {
            ...column,
            Cell: (props: AnalyticalTableCellInstance) => (
              <Link to={`/attachments/${fileId}/versions/${props.row.original.VersionNo}`}>
                <UI5Link>{props.value ?? 'N/A'}</UI5Link>
              </Link>
            ),
          };
        }

        return column;
      }),
    ],
    [currentVersionNo, fileId, visibleColumns],
  );

  return (
    <>
      <AnalyticalTable
        header={
          <Toolbar className="py-2 px-4 rounded-t-xl">
            <Title level="H4">Versions {totalCount ? `(${totalCount})` : ''}</Title>
            <ToolbarSpacer />
            {/* ToolbarButton - FileUpload */}
            <FileUpload fileId={fileId} currentExtension={currentExtension} disabled={disabled} />
            <ViewSettings
              fields={VERSION_LIST_FIELDS}
              selectedIds={selectedFieldIds}
              setSelectedIds={setSelectedFieldIds}
            />
          </Toolbar>
        }
        data={selectedFieldIds.length > 0 ? versions : []}
        columns={selectedFieldIds.length > 0 ? columns : []}
        loading={isFetching || isFetchingNextPage}
        noDataText={
          selectedFieldIds.length === 0
            ? 'There are no visible columns in the table right now. Please select the columns you need in the table settings.'
            : 'No versions found.'
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
            More [{versions.length}/{totalCount}]
          </Button>
        </Bar>
      )}
    </>
  );
}
