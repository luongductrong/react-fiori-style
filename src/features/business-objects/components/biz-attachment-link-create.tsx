import * as React from 'react';
import { toast } from '@/libs/helpers/toast';
import { useViewStore } from '@/stores/view-store';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { Title } from '@ui5/webcomponents-react/Title';
import { useInvalidateBizObjectQuery } from '../hooks';
import { Dialog } from '@ui5/webcomponents-react/Dialog';
import { Button } from '@ui5/webcomponents-react/Button';
import { ViewSettings } from '@/components/view-settings';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { BusyIndicator } from '@/components/busy-indicator';
import { pushApiErrorMessages } from '@/libs/helpers/error-messages';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { linkAttachmentToBoMutationOptions } from '../options/mutation';
import { displayVersion } from '@/features/attachments/helpers/formatter';
import { buildSelectWithDateTimeFields } from '@/libs/helpers/odata-select';
import { displayListDate, displayListTime } from '@/libs/helpers/date-time';
import { attachmentsQueryOptions } from '@/features/attachments/options/query';
import { AttachmentsFilterBar } from '@/features/attachments/components/attachments-filter-bar';
import { ATTACHMENT_LIST_FIELDS, type AttachmentListFieldId } from '@/features/attachments/view-config';
import { AnalyticalTable, type AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

interface BizAttachmentLinkCreateProps {
  boId: string;
  linkedAttachmentIds: string[];
  disabled?: boolean;
}

type AttachmentListColumn = {
  id: AttachmentListFieldId;
} & Record<string, unknown>;

const ALL_COLUMNS = [
  {
    Header: 'File ID',
    accessor: 'FileId',
    id: 'FileId',
  },
  {
    Header: 'Title',
    accessor: 'Title',
    id: 'Title',
  },
  {
    Header: 'Version',
    accessor: 'CurrentVersion',
    id: 'CurrentVersion',
    Cell: (props: AnalyticalTableCellInstance) => displayVersion(props.value),
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
  {
    Header: 'Changed On',
    accessor: 'Aedat',
    id: 'Aedat',
    Cell: (props: AnalyticalTableCellInstance) => displayListDate(props.row.original.Aedat, props.row.original.Aezet),
  },
  {
    Header: 'Changed At',
    accessor: 'Aezet',
    id: 'Aezet',
    Cell: (props: AnalyticalTableCellInstance) => displayListTime(props.row.original.Aedat, props.row.original.Aezet),
  },
  {
    Header: 'Changed By',
    accessor: 'Aenam',
    id: 'Aenam',
  },
  {
    Header: 'Edit Lock',
    accessor: 'EditLock',
    id: 'EditLock',
    Cell: (props: AnalyticalTableCellInstance) => (props.value ? 'Enabled' : 'Disabled'),
  },
] as const satisfies readonly AttachmentListColumn[];

export function BizAttachmentLinkCreate(props: BizAttachmentLinkCreateProps) {
  return <BizAttachmentLinkCreateImpl key={props.boId} {...props} />;
}

function BizAttachmentLinkCreateImpl({ boId, linkedAttachmentIds, disabled }: BizAttachmentLinkCreateProps) {
  const invalidateBiz = useInvalidateBizObjectQuery();
  const selectedFieldIds = useViewStore((state) => state.attachmentListVisibleFieldIds);
  const setSelectedFieldIds = useViewStore((state) => state.setAttachmentListVisibleFieldIds);
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState('');
  const [selectedAttachment, setSelectedAttachment] = React.useState<{
    id: string;
    title: string;
  } | null>(null);

  const attachmentListSelect = React.useMemo(
    () => buildSelectWithDateTimeFields([...selectedFieldIds, 'FileId', 'Title']),
    [selectedFieldIds],
  );
  const visibleColumns = React.useMemo(
    () => ALL_COLUMNS.filter((col) => selectedFieldIds.includes(col.id)),
    [selectedFieldIds],
  );

  const { mutate: linkAttachmentToBo, isPending } = useMutation(
    linkAttachmentToBoMutationOptions({
      onSuccess: () => {
        invalidateBiz.invalidateBizObjectDetail(boId);
        invalidateBiz.invalidateBizObjectAttachmentLinks(boId);
        toast('Attachment linked successfully');
        setSelectedAttachment(null);
        setOpen(false);
      },
    }),
  );

  const { data, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage, error } = useInfiniteQuery({
    ...attachmentsQueryOptions({
      $skip: 0,
      $top: 10,
      $count: true,
      $select: attachmentListSelect,
      $orderby: 'Erdat desc,Erzet desc',
      $filter: filter
        ? `IsActive eq true and CurrentVersion ne '0' and ${filter}`
        : "IsActive eq true and CurrentVersion ne '0'", // Make sure to only fetch active attachments
    }),
    enabled: open && selectedFieldIds.length > 0,
  });

  const attachments = React.useMemo(() => {
    return (
      data?.pages
        .flatMap((page) => page.value)
        .filter((attachment) => !linkedAttachmentIds.includes(attachment.FileId)) ?? []
    );
  }, [data, linkedAttachmentIds]);

  const totalCount = data?.pages[0]?.['@odata.count'] ?? 0;
  const remainingCount = Math.max(totalCount - linkedAttachmentIds.length, 0);

  React.useEffect(() => {
    if (error) {
      pushApiErrorMessages(error);
    }
  }, [error]);

  return (
    <React.Fragment>
      <ToolbarButton
        design="Transparent"
        text="Add new Link"
        onClick={() => setOpen(true)}
        disabled={disabled}
        className="h-8"
      />
      <Dialog
        open={open}
        draggable
        headerText="Link Attachment"
        className="relative w-full lg:w-4/5"
        footer={
          <Bar
            design="Footer"
            startContent={
              selectedAttachment ? (
                <Title level="H4">
                  Selected: {selectedAttachment.title} ({selectedAttachment.id})
                </Title>
              ) : undefined
            }
            endContent={
              <>
                <Button
                  design="Emphasized"
                  disabled={!selectedAttachment || isPending}
                  onClick={() => {
                    if (!selectedAttachment) return;
                    linkAttachmentToBo({
                      BoId: boId,
                      FileId: selectedAttachment.id,
                    });
                  }}
                  className="h-8"
                >
                  Add
                </Button>
                <Button design="Transparent" onClick={() => setOpen(false)} disabled={isPending} className="h-8">
                  Cancel
                </Button>
              </>
            }
          />
        }
        onClose={() => setOpen(false)}
      >
        <div className="sticky top-4 left-4 right-4 z-10">
          <AttachmentsFilterBar onFilterChange={setFilter} />
        </div>
        <AnalyticalTable
          header={
            <Toolbar className="rounded-t-xl px-4 py-2">
              <Title level="H4">Attachments {remainingCount ? `(${remainingCount})` : ''}</Title>
              <ToolbarSpacer />
              <ViewSettings
                fields={ATTACHMENT_LIST_FIELDS}
                selectedIds={selectedFieldIds}
                setSelectedIds={setSelectedFieldIds}
              />
            </Toolbar>
          }
          data={selectedFieldIds.length > 0 ? attachments : []}
          columns={selectedFieldIds.length > 0 ? visibleColumns : []}
          noDataText={
            selectedFieldIds.length === 0
              ? 'There are no visible columns in the table right now. Please select the columns you need in the table settings.'
              : 'No attachments available to link.'
          }
          sortable
          groupable={false}
          loading={isFetching || isFetchingNextPage}
          rowHeight={36}
          scaleWidthMode="Smart"
          visibleRows={8}
          selectionMode={selectedFieldIds.length > 0 ? 'Single' : 'None'}
          onRowClick={(event) => {
            const item = event.detail.row.original;
            if (!item?.FileId) return;
            setSelectedAttachment({ id: item.FileId, title: item.Title });
          }}
        />
        {hasNextPage && (
          <Bar>
            <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} design="Transparent" className="h-8">
              More [{attachments.length}/{remainingCount}]
            </Button>
          </Bar>
        )}
        {isPending && <BusyIndicator type="pending" />}
      </Dialog>
    </React.Fragment>
  );
}
