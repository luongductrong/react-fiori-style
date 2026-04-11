import * as React from 'react';
import { toast } from '@/libs/toast';
import { Link } from 'react-router';
import '@ui5/webcomponents-icons/delete.js';
import { getError } from '@/libs/error-message';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { MessageBox } from '@ui5/webcomponents-react/MessageBox';
import { Link as UI5Link } from '@ui5/webcomponents-react/Link';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { BizAttachmentLinkCreate } from './biz-attachment-link-create';
import { bizObjectLinkedAttachmentsQueryOptions } from '../options/query';
import { AnalyticalTable } from '@ui5/webcomponents-react/AnalyticalTable';
import { unlinkAttachmentFromBoMutationOptions } from '../options/mutation';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

type BizObjectLinkedAttachmentsProps = {
  boId: string;
  disabled?: boolean;
};

const rawColumns = [
  {
    Header: 'Attachment ID',
    accessor: '_Attach.FileId',
    Cell: (props: AnalyticalTableCellInstance) => (
      <Link to={`/attachments/${props.value}`}>
        <UI5Link>{props.value}</UI5Link>
      </Link>
    ),
  },
  {
    Header: 'Title',
    accessor: '_Attach.Title',
  },
  {
    Header: 'Version',
    accessor: '_Attach.CurrentVersion',
  },
  {
    Header: 'Is Active',
    accessor: '_Attach.IsActive',
    Cell: (props: AnalyticalTableCellInstance) => (props.value ? 'Yes' : 'No'),
  },
  {
    Header: 'Linked At',
    Cell: (props: AnalyticalTableCellInstance) => `${props.row.original.Erdat} ${props.row.original.Erzet}`,
  },
  {
    Header: 'Linked By',
    accessor: 'Ernam',
  },
];

export function BizObjectLinkedAttachments({ boId, disabled }: BizObjectLinkedAttachmentsProps) {
  const queryClient = useQueryClient();
  const [errorBoxOpen, setErrorBoxOpen] = React.useState(false);
  const [errorBoxMessages, setErrorBoxMessages] = React.useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = React.useState<{
    fileId: string;
    title?: string;
  } | null>(null);

  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    bizObjectLinkedAttachmentsQueryOptions(boId, {
      'sap-client': 324,
      $count: true,
      $expand: '_Attach',
      $skip: 0,
      $top: 5,
    }),
  );

  const { mutate: unlinkAttachmentFromBo, isPending } = useMutation(
    unlinkAttachmentFromBoMutationOptions({
      boId,
      onSuccess: () => {
        toast('Attachment unlinked successfully');
        queryClient.invalidateQueries({ queryKey: ['biz-objects', boId, 'linked-attachments'] });
      },
      onError: (error) => {
        const messages = getError(error);
        setErrorBoxMessages((prev) => [...messages, ...prev]);
        setErrorBoxOpen(true);
      },
    }),
  );

  const linkedAttachments = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.value) ?? [];
  }, [data?.pages]);

  const linkedAttachmentIds = React.useMemo(() => {
    return linkedAttachments.map((attachment) => attachment.FileId);
  }, [linkedAttachments]);

  const totalCount = Number(data?.pages[0]?.['@odata.count'] ?? 0);

  const columns = React.useMemo(
    () => [
      ...rawColumns,
      {
        Header: 'Actions',
        Cell: (props: AnalyticalTableCellInstance) => (
          <Button
            design="Transparent"
            icon="delete"
            className="h-6.5"
            onClick={(e) => {
              e.stopPropagation();
              setAttachmentToDelete({
                fileId: props.row.original.FileId,
                title: props.row.original._Attach?.Title,
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
        data={linkedAttachments}
        columns={columns}
        loading={isFetching || isFetchingNextPage || isPending}
        rowHeight={36}
        selectionMode="None"
        visibleRows={10}
        sortable
        groupable
        scaleWidthMode="Smart"
        header={
          <Toolbar className="py-2 px-4 rounded-t-xl">
            <Title level="H4">Attachments {totalCount ? `(${totalCount})` : ''}</Title>
            <ToolbarSpacer />
            <BizAttachmentLinkCreate
              boId={boId}
              linkedAttachmentIds={linkedAttachmentIds}
              disabled={disabled || !boId}
            />
          </Toolbar>
        }
      />
      {hasNextPage && (
        <Bar>
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} design="Transparent">
            More [{linkedAttachments.length}/{totalCount}]
          </Button>
        </Bar>
      )}
      <MessageBox
        open={deleteDialogOpen && !!attachmentToDelete?.fileId}
        type="Confirm"
        titleText="Delete Linked Attachment"
        actions={['Cancel', 'OK']}
        onClose={(action) => {
          setDeleteDialogOpen(false);
          if (action === 'OK' && attachmentToDelete?.fileId) {
            unlinkAttachmentFromBo({
              file_id: attachmentToDelete.fileId,
            });
          }
          setAttachmentToDelete(null);
        }}
      >
        {attachmentToDelete
          ? `Are you sure you want to unlink attachment "${attachmentToDelete.title || attachmentToDelete.fileId}"?`
          : 'Are you sure you want to unlink this attachment?'}
      </MessageBox>
      {errorBoxOpen && errorBoxMessages.length > 0 && (
        <MessageBox
          open
          title="Error"
          type="Error"
          onClose={() => {
            setErrorBoxOpen(false);
            setErrorBoxMessages([]);
          }}
        >
          <ul className="list-disc list-inside">
            {errorBoxMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </MessageBox>
      )}
    </>
  );
}
