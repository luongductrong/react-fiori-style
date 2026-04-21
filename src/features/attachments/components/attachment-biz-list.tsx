import * as React from 'react';
import '@ui5/webcomponents-icons/delete.js';
import { toast } from '@/libs/helpers/toast';
import { Link, useNavigate } from 'react-router';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { useViewStore } from '@/stores/view-store';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { ViewSettings } from '@/components/view-settings';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import '@ui5/webcomponents-icons/navigation-right-arrow.js';
import { attachmentBOsQueryOptions } from '../options/query';
import { Link as UI5Link } from '@ui5/webcomponents-react/Link';
import { MessageBox } from '@ui5/webcomponents-react/MessageBox';
import { pushApiErrorMessages } from '@/libs/helpers/error-messages';
import { AttachmentBizLinkCreate } from './attachment-biz-link-create';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { unlinkBoFromAttachmentMutationOptions } from '../options/mutation';
import { displayListDate, displayListTime } from '@/libs/helpers/date-time';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ATTACHMENT_BIZ_LIST_FIELDS, type AttachmentBizListFieldId } from '../view-config';
import { displayBoStatus, displayBoType } from '@/features/business-objects/helpers/formatter';
import { AnalyticalTable, type AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

type AttachmentBizListColumn = {
  id: AttachmentBizListFieldId;
} & Record<string, unknown>;

const ALL_COLUMNS = [
  {
    Header: 'BO ID',
    accessor: 'BoId',
    id: 'BoId',
    Cell: (props: AnalyticalTableCellInstance) => (
      <Link to={`/business-objects/${props.value}`}>
        <UI5Link>{props.value}</UI5Link>
      </Link>
    ),
  },
  {
    Header: 'BO Title',
    accessor: '_Bo.BoTitle',
    id: 'BoTitle',
  },
  {
    Header: 'BO Type',
    accessor: '_Bo.BoType',
    id: 'BoType',
    Cell: (props: AnalyticalTableCellInstance) => displayBoType(props.value),
  },
  {
    Header: 'BO Status',
    accessor: '_Bo.Status',
    id: 'Status',
    Cell: (props: AnalyticalTableCellInstance) => displayBoStatus(props.value),
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
    Header: 'Link By',
    accessor: 'Ernam',
    id: 'LinkErnam',
  },
] as const satisfies readonly AttachmentBizListColumn[];

export function AttachmentBizList({ fileId, disabled }: { fileId: string; disabled: boolean }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const selectedFieldIds = useViewStore((state) => state.attachmentBizListVisibleFieldIds);
  const setSelectedFieldIds = useViewStore((state) => state.setAttachmentBizListVisibleFieldIds);
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
  const visibleColumns = React.useMemo(
    () => ALL_COLUMNS.filter((col) => selectedFieldIds.includes(col.id)),
    [selectedFieldIds],
  );

  React.useEffect(() => {
    if (error) {
      pushApiErrorMessages(error);
    }
  }, [error]);

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
      {
        Header: '',
        id: 'navigation',
        width: 60,
        Cell: (props: AnalyticalTableCellInstance) => (
          <Button
            design="Transparent"
            icon="navigation-right-arrow"
            onClick={() => navigate(`/business-objects/${props.row.original.BoId}`)}
          />
        ),
      },
    ],
    [isPending, navigate, visibleColumns],
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
            <ViewSettings
              fields={ATTACHMENT_BIZ_LIST_FIELDS}
              selectedIds={selectedFieldIds}
              setSelectedIds={setSelectedFieldIds}
            />
          </Toolbar>
        }
        data={selectedFieldIds.length > 0 ? bizObjects : []}
        columns={selectedFieldIds.length > 0 ? columns : []}
        loading={isFetching || isFetchingNextPage || isPending}
        noDataText={
          selectedFieldIds.length === 0
            ? 'There are no visible columns in the table right now. Please select the columns you need in the table settings.'
            : 'No linked business objects found.'
        }
        rowHeight={36}
        selectionMode="None"
        visibleRows={10}
        sortable
        groupable={false}
        scaleWidthMode="Smart"
      />
      {hasNextPage && selectedFieldIds.length > 0 && (
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
