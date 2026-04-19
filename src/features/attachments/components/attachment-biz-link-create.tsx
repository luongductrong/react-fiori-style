import * as React from 'react';
import { toast } from '@/libs/helpers/toast';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { Title } from '@ui5/webcomponents-react/Title';
import { Dialog } from '@ui5/webcomponents-react/Dialog';
import { Button } from '@ui5/webcomponents-react/Button';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { BusyIndicator } from '@/components/busy-indicator';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { linkBoToAttachmentMutationOptions } from '../options/mutation';
import { BizObjectsFilterBar } from '@/features/business-objects/components';
import { bizObjectsQueryOptions } from '@/features/business-objects/options/query';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { displayBoStatus, displayBoType } from '@/features/business-objects/helpers/formatter';
import { AnalyticalTable, type AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

interface AttachmentBizLinkCreateProps {
  fileId: string;
  linkedBizObjectIds: string[];
  disabled?: boolean;
}

const columns = [
  {
    Header: 'ID',
    accessor: 'BoId',
  },
  {
    Header: 'Title',
    accessor: 'BoTitle',
  },
  {
    Header: 'Type',
    accessor: 'BoType',
    Cell: (props: AnalyticalTableCellInstance) => displayBoType(props.value),
  },
  {
    Header: 'Status',
    accessor: 'Status',
    Cell: (props: AnalyticalTableCellInstance) => displayBoStatus(props.value),
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

export function AttachmentBizLinkCreate(props: AttachmentBizLinkCreateProps) {
  return <AttachmentBizLinkCreateImpl key={props.fileId} {...props} />;
}

function AttachmentBizLinkCreateImpl({ fileId, linkedBizObjectIds, disabled }: AttachmentBizLinkCreateProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [selectedBizObject, setSelectedBizObject] = React.useState<{
    id: string;
    title: string;
  } | null>(null);

  const { mutate: linkBoToAttachment, isPending } = useMutation(
    linkBoToAttachmentMutationOptions({
      onSuccess: () => {
        toast('Business object linked successfully');
        setSelectedBizObject(null);
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ['attachments', fileId, 'detail'] });
        queryClient.invalidateQueries({ queryKey: ['attachments', fileId, 'audit'] });
        queryClient.invalidateQueries({ queryKey: ['attachments', fileId, 'biz-objects'] });
      },
    }),
  );

  const { data, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    ...bizObjectsQueryOptions({
      $skip: 0,
      $top: 10,
      $count: true,
      $select:
        'BoId,BoType,BoTitle,Status,Erdat,Erzet,Ernam,Aedat,Aezet,Aenam,__EntityControl/Deletable,__EntityControl/Updatable',
      $orderby: 'Erdat desc,Erzet desc',
      $filter: filter || undefined,
      $search: search || undefined,
    }),
    enabled: open,
  });

  const bizObjects = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.value).filter((item) => !linkedBizObjectIds.includes(item.BoId)) ?? [];
  }, [data, linkedBizObjectIds]);

  const totalCount = Number(data?.pages[0]?.['@odata.count'] ?? 0);
  const remainingCount = Math.max(totalCount - linkedBizObjectIds.length, 0);

  const handleClose = function () {
    setSelectedBizObject(null);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <ToolbarButton
        design="Transparent"
        text="Add new Link"
        onClick={() => setOpen(true)}
        disabled={disabled || !fileId}
        className="h-8"
      />
      <Dialog
        open={open}
        draggable
        headerText="Link Business Object"
        className="relative w-full lg:w-4/5"
        footer={
          <Bar
            design="Footer"
            startContent={
              selectedBizObject ? (
                <Title level="H4">
                  Selected: {selectedBizObject.title} ({selectedBizObject.id})
                </Title>
              ) : undefined
            }
            endContent={
              <React.Fragment>
                <Button
                  design="Emphasized"
                  disabled={!selectedBizObject || isPending}
                  onClick={() => {
                    if (!selectedBizObject) {
                      return;
                    }
                    linkBoToAttachment({
                      BoId: selectedBizObject.id,
                      FileId: fileId,
                    });
                  }}
                  className="h-8"
                >
                  Add
                </Button>
                <Button design="Transparent" onClick={handleClose} disabled={isPending} className="h-8">
                  Cancel
                </Button>
              </React.Fragment>
            }
          />
        }
        onClose={handleClose}
      >
        <div className="sticky top-4 left-4 right-4 z-10">
          <BizObjectsFilterBar onFilterChange={setFilter} onSearchChange={setSearch} />
        </div>
        <AnalyticalTable
          header={
            <Toolbar className="rounded-t-xl px-4 py-2">
              <Title level="H4">Objects {remainingCount ? `(${remainingCount})` : ''}</Title>
              <ToolbarSpacer />
            </Toolbar>
          }
          data={bizObjects}
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
            if (!item?.BoId) {
              return;
            }
            setSelectedBizObject({
              id: item.BoId,
              title: item.BoTitle,
            });
          }}
        />
        {hasNextPage && (
          <Bar>
            <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} design="Transparent" className="h-8">
              More [{bizObjects.length}/{remainingCount}]
            </Button>
          </Bar>
        )}
        <BusyIndicator type="pending" show={isPending} />
      </Dialog>
    </React.Fragment>
  );
}
