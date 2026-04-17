import * as React from 'react';
import { Link } from 'react-router';
import { toast } from '@/libs/toast';
import '@ui5/webcomponents-icons/refresh.js';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { pushApiErrorMessages } from '@/libs/errors';
import { Title } from '@ui5/webcomponents-react/Title';
import { API } from '@/features/attachments/constants';
import { Button } from '@ui5/webcomponents-react/Button';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { Link as UI5Link } from '@ui5/webcomponents-react/Link';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import type { AttachmentListItem } from '@/features/attachments/types';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { AttachmentsFilterBar } from '@/features/attachments/components';
import { DynamicPageHeader } from '@ui5/webcomponents-react/DynamicPageHeader';
import { attachmentsQueryOptions } from '@/features/attachments/options/query';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restoreAttachmentMutationOptions } from '@/features/attachments/options/mutation';
import { AnalyticalTable, type AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

function RestoreAttachmentButton({
  attachment,
  disabled,
  onRestore,
}: {
  attachment: AttachmentListItem;
  disabled: boolean;
  onRestore: (_fileId: string) => void;
}) {
  return (
    <Button
      design="Transparent"
      className="h-6.5"
      disabled={attachment.IsActive || !attachment.__OperationControl?.Reactivate || disabled}
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
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('');

  const attachmentListParams = React.useMemo(
    () => ({
      'sap-client': 324,
      $skip: 0,
      $top: 10,
      $count: true,
      $select: API.select,
      $filter: filter ? `IsActive eq false and ${filter}` : 'IsActive eq false',
      $search: search || undefined,
    }),
    [filter, search],
  );

  const { data, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage, refetch, error } = useInfiniteQuery(
    attachmentsQueryOptions(attachmentListParams),
  );

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
      {
        Header: 'File ID',
        accessor: 'FileId',
        Cell: (props: AnalyticalTableCellInstance) => (
          <Link to={`/attachments/${props.value}`}>
            <UI5Link>{props.value}</UI5Link>
          </Link>
        ),
      },
      {
        Header: 'Title',
        accessor: 'Title',
      },
      {
        Header: 'Version',
        accessor: 'CurrentVersion',
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
        Header: 'Actions',
        Cell: (props: AnalyticalTableCellInstance) => {
          const attachment = props.row.original as AttachmentListItem;

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
    [handleRestore, isRestoring, restoringFileId],
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
          </Toolbar>
        }
        data={attachments}
        columns={columns}
        sortable
        groupable
        loading={isFetching || isFetchingNextPage || isRestoring}
        noDataText={
          filter || search ? 'No deleted attachments match the current filters.' : 'No deleted attachments found.'
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
