import * as React from 'react';
import { FileUpload } from './file-upload';
import { formatFileSize } from '@/libs/utils';
import { Link, useNavigate } from 'react-router';
import { useViewStore } from '@/stores/view-store';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { displayVersion } from '../helpers/formatter';
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
import { buildSelectWithDateTimeFields } from '@/libs/helpers/odata-select';
import { displayListDate, displayListTime } from '@/libs/helpers/date-time';
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
    Cell: (props: AnalyticalTableCellInstance) => formatFileSize(props.value, ''),
  },
  {
    Header: 'Created On',
    accessor: 'Erdat',
    id: 'Erdat',
    Cell: (props: AnalyticalTableCellInstance) => displayListDate(props.row.original.Erdat, props.row.original.Erzet),
  },
  {
    Header: 'Created At',
    accessor: 'Erzet',
    id: 'Erzet',
    Cell: (props: AnalyticalTableCellInstance) => displayListTime(props.row.original.Erdat, props.row.original.Erzet),
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
  const navigate = useNavigate();
  const selectedFieldIds = useViewStore((state) => state.versionListVisibleFieldIds);
  const setSelectedFieldIds = useViewStore((state) => state.setVersionListVisibleFieldIds);
  const attachmentVersionListSelect = React.useMemo(
    () => buildSelectWithDateTimeFields([...selectedFieldIds, 'VersionNo']),
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
                <UI5Link>{`${displayVersion(props.value)}${props.value === currentVersionNo ? ' (Current)' : ''}`}</UI5Link>
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
      {
        Header: '',
        id: 'navigation',
        width: 60,
        Cell: (props: AnalyticalTableCellInstance) => (
          <Button
            design="Transparent"
            icon="navigation-right-arrow"
            onClick={() => navigate(`/attachments/${fileId}/versions/${props.row.original.VersionNo}`)}
          />
        ),
      },
    ],
    [currentVersionNo, fileId, navigate, visibleColumns],
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
