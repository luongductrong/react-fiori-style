import * as React from 'react';
import { Link } from 'react-router';
import { toast } from '@/libs/helpers/toast';
import '@ui5/webcomponents-icons/refresh.js';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { useViewStore } from '@/stores/view-store';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { ViewSettings } from '@/components/view-settings';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { Link as UI5Link } from '@ui5/webcomponents-react/Link';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import type { AttachmentItem } from '@/features/attachments/types';
import { pushApiErrorMessages } from '@/libs/helpers/error-messages';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { AttachmentsFilterBar } from '@/features/attachments/components';
import { attachmentsQueryOptions } from '@/features/attachments/options/query';
import { DynamicPageHeader } from '@ui5/webcomponents-react/DynamicPageHeader';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restoreAttachmentMutationOptions } from '@/features/attachments/options/mutation';
import { ATTACHMENT_LIST_FIELDS, type AttachmentListFieldId } from '@/features/attachments/view-config';
import { AnalyticalTable, type AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

type AttachmentListColumn = {
  id: AttachmentListFieldId;
} & Record<string, unknown>;

const ALL_COLUMNS = [
  {
    Header: 'File ID',
    accessor: 'FileId',
    id: 'FileId',
    Cell: (props: AnalyticalTableCellInstance) => (
      <Link to={`/attachments/${props.value}`}>
        <UI5Link>{props.value}</UI5Link>
      </Link>
    ),
  },
  { Header: 'Title', accessor: 'Title', id: 'Title' },
  { Header: 'Version', accessor: 'CurrentVersion', id: 'CurrentVersion' },
  { Header: 'Created On', accessor: 'Erdat', id: 'Erdat' },
  { Header: 'Created At', accessor: 'Erzet', id: 'Erzet' },
  { Header: 'Created By', accessor: 'Ernam', id: 'Ernam' },
  { Header: 'Changed On', accessor: 'Aedat', id: 'Aedat' },
  { Header: 'Changed At', accessor: 'Aezet', id: 'Aezet' },
  { Header: 'Changed By', accessor: 'Aenam', id: 'Aenam' },
  {
    Header: 'Edit Lock',
    accessor: 'EditLock',
    id: 'EditLock',
    Cell: (props: AnalyticalTableCellInstance) => (props.value ? 'Enabled' : 'Disabled'),
  },
] as const satisfies readonly AttachmentListColumn[];

function RestoreAttachmentButton({
  attachment,
  disabled,
  onRestore,
}: {
  attachment: AttachmentItem;
  disabled: boolean;
  onRestore: (_fileId: string) => void;
}) {
  return (
    <Button
      design="Transparent"
      className="h-6.5"
      disabled={!attachment.__OperationControl?.Reactivate || disabled}
      onClick={() => {
        onRestore(attachment.FileId);
      }}
    >
      Restore
    </Button>
  );
}

export function DeletedAttachmentListView() {
  const queryClient = useQueryClient();
  const selectedFieldIds = useViewStore((state) => state.attachmentListVisibleFieldIds);
  const setSelectedFieldIds = useViewStore((state) => state.setAttachmentListVisibleFieldIds);
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('');
  const attachmentListSelect = React.useMemo(
    () => Array.from(new Set([...selectedFieldIds, 'FileId', '__OperationControl/Reactivate'])).join(','),
    [selectedFieldIds],
  );
  const visibleColumns = React.useMemo(
    () => ALL_COLUMNS.filter((col) => selectedFieldIds.includes(col.id)),
    [selectedFieldIds],
  );

  const attachmentListParams = React.useMemo(
    () => ({
      $skip: 0,
      $top: 10,
      $count: true,
      $select: attachmentListSelect,
      $orderby: 'Erdat desc,Erzet desc',
      $filter: filter ? `IsActive eq false and ${filter}` : 'IsActive eq false',
      $search: search || undefined,
    }),
    [attachmentListSelect, filter, search],
  );

  const { data, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage, refetch, error } = useInfiniteQuery({
    ...attachmentsQueryOptions(attachmentListParams),
    enabled: selectedFieldIds.length > 0,
  });

  const attachments = data?.pages.flatMap((page) => page.value) ?? [];
  const lastPage = data ? data.pages[data.pages.length - 1] : undefined;
  const totalCount = lastPage?.['@odata.count'] ?? 0;
  const {
    mutate: restoreAttachment,
    isPending: isRestoring,
    variables: restoringFileId,
  } = useMutation(
    restoreAttachmentMutationOptions({
      onSuccess: () => {
        toast('Attachment restored successfully');
        queryClient.invalidateQueries({ queryKey: ['attachments'] });
      },
    }),
  );

  const handleRestore = React.useCallback(
    (fileId: string) => {
      restoreAttachment(fileId);
    },
    [restoreAttachment],
  );

  const columns = React.useMemo(
    () => [
      ...visibleColumns,
      {
        Header: 'Actions',
        id: 'Actions',
        width: 100,
        Cell: (props: AnalyticalTableCellInstance) => {
          const attachment = props.row.original;

          return (
            <RestoreAttachmentButton
              attachment={attachment}
              disabled={isRestoring && restoringFileId === attachment.FileId}
              onRestore={handleRestore}
            />
          );
        },
      },
    ],
    [handleRestore, isRestoring, restoringFileId, visibleColumns],
  );

  React.useEffect(() => {
    if (error) {
      pushApiErrorMessages(error);
    }
  }, [error]);

  return (
    <DynamicPage
      headerArea={
        <DynamicPageHeader className="py-4 px-8">
          <AttachmentsFilterBar onFilterChange={setFilter} onSearchChange={setSearch} showActiveFilter={false} />
        </DynamicPageHeader>
      }
      className="flex-1"
      showFooter={true}
    >
      <AnalyticalTable
        header={
          <Toolbar className="py-2 px-4 rounded-t-xl">
            <Title level="H2">Deleted Attachments {totalCount ? `(${totalCount})` : ''}</Title>
            <ToolbarSpacer />
            <ToolbarButton
              design="Transparent"
              icon="refresh"
              text="Refresh"
              onClick={() => {
                refetch();
              }}
            />
            <ViewSettings
              fields={ATTACHMENT_LIST_FIELDS}
              selectedIds={selectedFieldIds}
              setSelectedIds={setSelectedFieldIds}
            />
          </Toolbar>
        }
        data={selectedFieldIds.length > 0 ? attachments : []}
        columns={selectedFieldIds.length > 0 ? columns : []}
        sortable
        groupable={false}
        loading={isFetching || isFetchingNextPage || isRestoring}
        noDataText={
          selectedFieldIds.length === 0
            ? 'There are no visible columns in the table right now. Please select the columns you need in the table settings.'
            : filter || search
              ? 'No deleted attachments match the current filters.'
              : 'No deleted attachments found.'
        }
        rowHeight={36}
        scaleWidthMode="Smart"
        visibleRowCountMode="Auto"
      />
      {hasNextPage && (
        <Bar>
          <Button
            design="Transparent"
            disabled={isFetchingNextPage}
            onClick={() => {
              fetchNextPage();
            }}
          >
            More [{attachments.length}/{totalCount}]
          </Button>
        </Bar>
      )}
    </DynamicPage>
  );
}
