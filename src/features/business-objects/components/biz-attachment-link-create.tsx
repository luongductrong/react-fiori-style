import * as React from 'react';
import { toast } from '@/libs/toast';
import { getError } from '@/libs/error-message';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { Title } from '@ui5/webcomponents-react/Title';
import { Dialog } from '@ui5/webcomponents-react/Dialog';
import { Button } from '@ui5/webcomponents-react/Button';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { BusyIndicator } from '@/components/busy-indicator';
import { MessageBox } from '@ui5/webcomponents-react/MessageBox';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { linkAttachmentToBoMutationOptions } from '../options/mutation';
import { attachmentsQueryOptions } from '@/features/attachments/options/query';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AttachmentsFilterBar } from '@/features/attachments/components/attachments-filter-bar';
import { AnalyticalTable, type AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

interface BizAttachmentLinkCreateProps {
  boId: string;
  linkedAttachmentIds: string[];
  disabled?: boolean;
}

const columns = [
  {
    Header: 'File ID',
    accessor: 'FileId',
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
    Header: 'Created At',
    Cell: (props: AnalyticalTableCellInstance) => `${props.row.original.Erdat ?? ''} ${props.row.original.Erzet ?? ''}`,
  },
  {
    Header: 'Created By',
    accessor: 'Ernam',
  },
];

export function BizAttachmentLinkCreate(props: BizAttachmentLinkCreateProps) {
  return <BizAttachmentLinkCreateImpl key={props.boId} {...props} />;
}

function BizAttachmentLinkCreateImpl({ boId, linkedAttachmentIds, disabled }: BizAttachmentLinkCreateProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState('');
  const [errorBoxOpen, setErrorBoxOpen] = React.useState(false);
  const [errorBoxMessages, setErrorBoxMessages] = React.useState<string[]>([]);
  const [selectedAttachment, setSelectedAttachment] = React.useState<{
    id: string;
    title: string;
  } | null>(null);

  const { mutate: linkAttachmentToBo, isPending } = useMutation(
    linkAttachmentToBoMutationOptions({
      boId,
      onSuccess: () => {
        toast('Attachment linked successfully');
        setSelectedAttachment(null);
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ['biz-objects', boId, 'linked-attachments'] });
      },
      onError: (error) => {
        const messages = getError(error);
        setErrorBoxMessages((prev) => [...messages, ...prev]);
        setSelectedAttachment(null);
        setOpen(false);
        setErrorBoxOpen(true);
      },
    }),
  );

  const { data, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    ...attachmentsQueryOptions({
      'sap-client': 324,
      $skip: 0,
      $top: 10,
      $count: true,
      $select: 'FileId,Title,CurrentVersion,Erdat,Ernam,Erzet,IsActive', // TODO: move to constants
      $filter: filter ? `IsActive eq true and ${filter}` : 'IsActive eq true', // Make sure to only fetch active attachments
    }),
    enabled: open,
  });

  const attachments = React.useMemo(() => {
    return (
      data?.pages
        .flatMap((page) => page.value)
        .filter((attachment) => attachment.IsActive && !linkedAttachmentIds.includes(attachment.FileId)) ?? []
    );
  }, [data, linkedAttachmentIds]);

  const totalCount = data?.pages[0]?.['@odata.count'] ?? 0;
  const remainingCount = totalCount - linkedAttachmentIds.length;

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
                      file_id: selectedAttachment.id,
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
          <AttachmentsFilterBar showSearch={false} showActiveFilter={false} onFilterChange={setFilter} />
        </div>
        <AnalyticalTable
          header={
            <Toolbar className="rounded-t-xl px-4 py-2">
              <Title level="H4">Attachments {remainingCount ? `(${remainingCount})` : ''}</Title>
              <ToolbarSpacer />
            </Toolbar>
          }
          data={attachments}
          columns={columns}
          sortable
          groupable
          loading={isFetching || isFetchingNextPage}
          rowHeight={36}
          scaleWidthMode="Smart"
          visibleRows={8}
          selectionMode="Single"
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
        // TODO: Consider turning it into a separate component.
      )}
    </React.Fragment>
  );
}
