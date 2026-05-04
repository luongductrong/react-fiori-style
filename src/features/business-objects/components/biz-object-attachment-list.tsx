import * as React from 'react';
import '@ui5/webcomponents-icons/delete.js';
import { toast } from '@/libs/helpers/toast';
import { Link, useNavigate } from 'react-router';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { useViewStore } from '@/stores/view-store';
import { Title } from '@ui5/webcomponents-react/Title';
import { useInvalidateBizObjectQuery } from '../hooks';
import { Button } from '@ui5/webcomponents-react/Button';
import { ViewSettings } from '@/components/view-settings';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import '@ui5/webcomponents-icons/navigation-right-arrow.js';
import { Link as UI5Link } from '@ui5/webcomponents-react/Link';
import { MessageBox } from '@ui5/webcomponents-react/MessageBox';
import { pushApiErrorMessages } from '@/libs/helpers/error-messages';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { BizAttachmentLinkCreate } from './biz-attachment-link-create';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { displayVersion } from '@/features/attachments/helpers/formatter';
import { bizObjectLinkedAttachmentsQueryOptions } from '../options/query';
import { AnalyticalTable } from '@ui5/webcomponents-react/AnalyticalTable';
import { unlinkAttachmentFromBoMutationOptions } from '../options/mutation';
import { displayListDate, displayListTime } from '@/libs/helpers/date-time';
import type { AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';
import { BIZ_OBJECT_LINKED_ATTACHMENT_FIELDS, type BizObjectLinkedAttachmentFieldId } from '../view-config';

type BizObjectAttachmentListProps = {
  boId: string;
  disabled?: boolean;
  onCountChange: (count: number | null) => void;
};

type BizObjectLinkedAttachmentColumn = {
  id: BizObjectLinkedAttachmentFieldId;
} & Record<string, unknown>;

const ALL_COLUMNS = [
  {
    Header: 'File ID',
    accessor: '_Attach.FileId',
    id: 'FileId',
    Cell: (props: AnalyticalTableCellInstance) => (
      <Link to={`/attachments/${props.value}`}>
        <UI5Link>{props.value}</UI5Link>
      </Link>
    ),
  },
  {
    Header: 'Title',
    accessor: '_Attach.Title',
    id: 'Title',
  },
  {
    Header: 'Version',
    accessor: '_Attach.CurrentVersion',
    id: 'CurrentVersion',
    Cell: (props: AnalyticalTableCellInstance) => displayVersion(props.value),
  },
  {
    Header: 'Edit Lock',
    accessor: '_Attach.EditLock',
    id: 'EditLock',
    Cell: (props: AnalyticalTableCellInstance) => (props.value ? 'Enabled' : 'Disabled'),
  },
  {
    Header: 'Linked On',
    accessor: 'Erdat',
    id: 'LinkErdat',
    Cell: (props: AnalyticalTableCellInstance) => displayListDate(props.row.original.Erdat, props.row.original.Erzet),
  },
  {
    Header: 'Linked At',
    accessor: 'Erzet',
    id: 'LinkErzet',
    Cell: (props: AnalyticalTableCellInstance) => displayListTime(props.row.original.Erdat, props.row.original.Erzet),
  },
  {
    Header: 'Linked By',
    accessor: 'Ernam',
    id: 'LinkErnam',
  },
] as const satisfies readonly BizObjectLinkedAttachmentColumn[];

export function BizObjectAttachmentList({ boId, disabled, onCountChange }: BizObjectAttachmentListProps) {
  const navigate = useNavigate();
  const invalidateBiz = useInvalidateBizObjectQuery();
  const selectedFieldIds = useViewStore((state) => state.bizObjectLinkedAttachmentVisibleFieldIds);
  const setSelectedFieldIds = useViewStore((state) => state.setBizObjectLinkedAttachmentVisibleFieldIds);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = React.useState<{
    fileId: string;
    title?: string;
  } | null>(null);

  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage, error } = useInfiniteQuery(
    bizObjectLinkedAttachmentsQueryOptions(boId, {
      $count: true,
      $expand: '_Attach',
      $orderby: 'Erdat desc,Erzet desc',
      $skip: 0,
      $top: 5,
    }),
  );

  const { mutate: unlinkAttachmentFromBo, isPending } = useMutation(
    unlinkAttachmentFromBoMutationOptions({
      onSuccess: () => {
        toast('Attachment unlinked successfully');
        invalidateBiz.invalidateBizObjectDetail(boId);
        invalidateBiz.invalidateBizObjectAttachmentLinks(boId);
      },
    }),
  );

  const linkedAttachments = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.value) ?? [];
  }, [data?.pages]);

  const linkedAttachmentIds = React.useMemo(() => {
    return linkedAttachments.map((attachment) => attachment.FileId);
  }, [linkedAttachments]);

  const firstPage = data?.pages[0];
  const totalCount = Number(firstPage?.['@odata.count'] ?? 0);
  const visibleColumns = React.useMemo(
    () => ALL_COLUMNS.filter((col) => selectedFieldIds.includes(col.id)),
    [selectedFieldIds],
  );

  const columns = React.useMemo(
    () => [
      ...visibleColumns,
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
      {
        Header: '',
        id: 'navigation',
        width: 60,
        Cell: (props: AnalyticalTableCellInstance) => (
          <Button
            design="Transparent"
            icon="navigation-right-arrow"
            onClick={() => navigate(`/attachments/${props.row.original.FileId}`)}
          />
        ),
      },
    ],
    [isPending, navigate, visibleColumns],
  );

  React.useEffect(() => {
    if (error) {
      pushApiErrorMessages(error);
    }
  }, [error]);

  React.useEffect(() => {
    if (error) {
      onCountChange(null);
    } else if (firstPage) {
      onCountChange(totalCount);
    } else {
      onCountChange(null);
    }
  }, [firstPage, totalCount, onCountChange, error]);

  return (
    <>
      <AnalyticalTable
        data={selectedFieldIds.length > 0 ? linkedAttachments : []}
        columns={selectedFieldIds.length > 0 ? columns : []}
        loading={isFetching || isFetchingNextPage || isPending}
        noDataText={
          selectedFieldIds.length === 0
            ? 'There are no visible columns in the table right now. Please select the columns you need in the table settings.'
            : 'No linked attachments found.'
        }
        rowHeight={36}
        selectionMode="None"
        visibleRows={10}
        sortable
        groupable={false}
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
            <ToolbarButton
              design="Transparent"
              text="Manage Attachments"
              onClick={() => navigate('/attachments')}
              className="h-8"
            />
            <ViewSettings
              fields={BIZ_OBJECT_LINKED_ATTACHMENT_FIELDS}
              selectedIds={selectedFieldIds}
              setSelectedIds={setSelectedFieldIds}
            />
          </Toolbar>
        }
      />
      {hasNextPage && selectedFieldIds.length > 0 && (
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
              FileId: attachmentToDelete.fileId,
              BoId: boId,
            });
          }
          setAttachmentToDelete(null);
        }}
      >
        {attachmentToDelete
          ? `Are you sure you want to unlink attachment "${attachmentToDelete.title || attachmentToDelete.fileId}"?`
          : 'Are you sure you want to unlink this attachment?'}
      </MessageBox>
    </>
  );
}
