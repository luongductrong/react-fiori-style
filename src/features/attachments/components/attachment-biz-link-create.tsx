import * as React from 'react';
import { toast } from '@/libs/helpers/toast';
import { useViewStore } from '@/stores/view-store';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { Title } from '@ui5/webcomponents-react/Title';
import { Dialog } from '@ui5/webcomponents-react/Dialog';
import { Button } from '@ui5/webcomponents-react/Button';
import { ViewSettings } from '@/components/view-settings';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { BusyIndicator } from '@/components/busy-indicator';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { linkBoToAttachmentMutationOptions } from '../options/mutation';
import { buildSelectWithDateTimeFields } from '@/libs/helpers/odata-select';
import { displayListDate, displayListTime } from '@/libs/helpers/date-time';
import { BizObjectsFilterBar } from '@/features/business-objects/components';
import { bizObjectsQueryOptions } from '@/features/business-objects/options/query';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BO_LIST_FIELDS, type BoListFieldId } from '@/features/business-objects/view-config';
import { displayBoStatus, displayBoType } from '@/features/business-objects/helpers/formatter';
import { AnalyticalTable, type AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

interface AttachmentBizLinkCreateProps {
  fileId: string;
  linkedBizObjectIds: string[];
  disabled?: boolean;
}

type BoListColumn = {
  id: BoListFieldId;
} & Record<string, unknown>;

const ALL_COLUMNS = [
  {
    Header: 'ID',
    accessor: 'BoId',
    id: 'BoId',
  },
  {
    Header: 'Title',
    accessor: 'BoTitle',
    id: 'BoTitle',
  },
  {
    Header: 'Type',
    accessor: 'BoType',
    id: 'BoType',
    Cell: (props: AnalyticalTableCellInstance) => displayBoType(props.value),
  },
  {
    Header: 'Status',
    accessor: 'Status',
    id: 'Status',
    Cell: (props: AnalyticalTableCellInstance) => displayBoStatus(props.value),
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
] as const satisfies readonly BoListColumn[];

export function AttachmentBizLinkCreate(props: AttachmentBizLinkCreateProps) {
  return <AttachmentBizLinkCreateImpl key={props.fileId} {...props} />;
}

function AttachmentBizLinkCreateImpl({ fileId, linkedBizObjectIds, disabled }: AttachmentBizLinkCreateProps) {
  const queryClient = useQueryClient();
  const selectedFieldIds = useViewStore((state) => state.boListVisibleFieldIds);
  const setSelectedFieldIds = useViewStore((state) => state.setBoListVisibleFieldIds);
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [selectedBizObject, setSelectedBizObject] = React.useState<{
    id: string;
    title: string;
  } | null>(null);
  const boListSelect = React.useMemo(
    () => buildSelectWithDateTimeFields([...selectedFieldIds, 'BoId', 'BoTitle']),
    [selectedFieldIds],
  );
  const visibleColumns = React.useMemo(
    () => ALL_COLUMNS.filter((col) => selectedFieldIds.includes(col.id)),
    [selectedFieldIds],
  );

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
      $select: boListSelect,
      $orderby: 'Erdat desc,Erzet desc',
      $filter: filter || undefined,
      $search: search || undefined,
    }),
    enabled: open && selectedFieldIds.length > 0,
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
              <ViewSettings
                fields={BO_LIST_FIELDS}
                selectedIds={selectedFieldIds}
                setSelectedIds={setSelectedFieldIds}
              />
            </Toolbar>
          }
          data={selectedFieldIds.length > 0 ? bizObjects : []}
          columns={selectedFieldIds.length > 0 ? visibleColumns : []}
          noDataText={
            selectedFieldIds.length === 0
              ? 'There are no visible columns in the table right now. Please select the columns you need in the table settings.'
              : 'No business objects available to link.'
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
            if (!item?.BoId) {
              return;
            }
            setSelectedBizObject({
              id: item.BoId,
              title: item.BoTitle ?? item.BoId,
            });
          }}
        />
        {hasNextPage && selectedFieldIds.length > 0 && (
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
