import * as React from 'react';
import { toast } from '@/libs/toast';
import { Link } from 'react-router';
import '@ui5/webcomponents-icons/delete.js';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { attachmentBOsQueryOptions } from '../options/query';
import { Link as UI5Link } from '@ui5/webcomponents-react/Link';
import { MessageBox } from '@ui5/webcomponents-react/MessageBox';
import { pushApiErrorMessages } from '@/libs/helpers/error-messages';
import { AttachmentBizLinkCreate } from './attachment-biz-link-create';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { unlinkBoFromAttachmentMutationOptions } from '../options/mutation';
import { displayBoStatus, displayBoType } from '@/features/business-objects/helpers';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnalyticalTable, type AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

export function AttachmentBizList({ fileId, disabled }: { fileId: string; disabled: boolean }) {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [bizObjectToDelete, setBizObjectToDelete] = React.useState<{
    boId: string;
    title?: string;
  } | null>(null);
  const {
    data: bizObjectsData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery(
    attachmentBOsQueryOptions(fileId, {
      $count: true,
      $skip: 0,
      $top: 5,
      $orderby: 'Erdat desc,Erzet desc',
      // TODO: Move to constants
      $expand: '_Bo',
    }),
  );

  const { mutate: unlinkBoFromAttachment, isPending } = useMutation(
    unlinkBoFromAttachmentMutationOptions({
      onSuccess: () => {
        toast('Business object unlinked successfully');
        queryClient.invalidateQueries({ queryKey: ['attachments', fileId, 'detail'] });
        queryClient.invalidateQueries({ queryKey: ['attachments', fileId, 'audit'] });
        queryClient.invalidateQueries({ queryKey: ['attachments', fileId, 'biz-objects'] });
      },
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
      {
        Header: 'Actions',
        id: 'actions',
        Cell: (props: AnalyticalTableCellInstance) => (
          <Button
            design="Transparent"
            icon="delete"
            className="h-6.5"
            onClick={(e) => {
              e.stopPropagation();
              setBizObjectToDelete({
                boId: props.row.original.BoId,
                title: props.row.original._Bo?.BoTitle,
              });
              setDeleteDialogOpen(true);
            }}
            disabled={isPending}
          >
            Delete
          </Button>
        ),
      },
    ],
    [isPending],
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
              disabled={disabled}
            />
          </Toolbar>
        }
        data={bizObjects}
        columns={columns}
        loading={isFetching || isFetchingNextPage || isPending}
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
      <MessageBox
        open={deleteDialogOpen && !!bizObjectToDelete?.boId}
        type="Confirm"
        titleText="Delete Linked Business Object"
        actions={['Cancel', 'OK']}
        onClose={(action) => {
          setDeleteDialogOpen(false);
          if (action === 'OK' && bizObjectToDelete?.boId) {
            unlinkBoFromAttachment({
              FileId: fileId,
              BoId: bizObjectToDelete.boId,
            });
          }
          setBizObjectToDelete(null);
        }}
      >
        {bizObjectToDelete
          ? `Are you sure you want to unlink business object "${bizObjectToDelete.title || bizObjectToDelete.boId}"?`
          : 'Are you sure you want to unlink this business object?'}
      </MessageBox>
    </>
  );
}
