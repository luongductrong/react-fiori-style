import * as React from 'react';
import { cn } from '@/libs/utils';
import '@ui5/webcomponents-icons/list.js';
import { useNavigate } from 'react-router';
import '@ui5/webcomponents-icons/table-view.js';
import { useAppStore } from '@/stores/app-stores';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { Grid } from '@ui5/webcomponents-react/Grid';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import '@ui5/webcomponents-icons/navigation-right-arrow.js';
import '@ui5/webcomponents-fiori/dist/illustrations/NoData.js';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import { VariantItem } from '@ui5/webcomponents-react/VariantItem';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { AnalyticalTable } from '@ui5/webcomponents-react/AnalyticalTable';
import { DynamicPageTitle } from '@ui5/webcomponents-react/DynamicPageTitle';
import { attachmentsQueryOptions } from '@/features/attachments/options/query';
import { DynamicPageHeader } from '@ui5/webcomponents-react/DynamicPageHeader';
import { VariantManagement } from '@ui5/webcomponents-react/VariantManagement';
import { IllustratedMessage } from '@ui5/webcomponents-react/IllustratedMessage';
import { AttachmentsFilterBar, AttachmentCard } from '@/features/attachments/components';

const rawColumns = [
  {
    Header: 'Title',
    accessor: 'Title',
  },
  {
    Header: 'Version',
    accessor: 'CurrentVersion',
  },
  {
    Header: 'Is Active',
    accessor: 'IsActive',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Cell: (props: any) => (props.value ? 'Yes' : 'No'),
  },
  {
    Header: 'Created On',
    accessor: 'Erdat',
  },
  {
    Header: 'Created By',
    accessor: 'Ernam',
  },
];

export function AttachmentsView() {
  const navigate = useNavigate();
  const viewMode = useAppStore((state) => state.viewMode);
  const setViewMode = useAppStore((state) => state.setViewMode);
  const [search, setSearch] = React.useState<string>('');
  const [filter, setFilter] = React.useState<string>('');
  const [selectedIds, setSelectedIds] = React.useState<Record<string, boolean>>({});
  const selectedCount = React.useMemo(() => Object.keys(selectedIds).length, [selectedIds]);
  const { data, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    attachmentsQueryOptions({
      'sap-client': 324,
      $skip: 0,
      $top: 10,
      $count: true,
      $select: 'CurrentVersion,Erdat,Ernam,FileId,IsActive,Title,__EntityControl/Deletable,__EntityControl/Updatable',
      $filter: filter || undefined,
      $search: search || undefined,
    }),
  );

  const attachments = data?.pages.flatMap((page) => page.value) || [];
  const totalCount = data?.pages[data.pages.length - 1]['@odata.count'] ?? 0;

  const columns = React.useMemo(() => {
    return [
      ...rawColumns,
      {
        Header: '',
        id: 'nav',
        width: 60,
        disableSortBy: true,
        disableGroupBy: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Cell: ({ row }: any) => (
          <button
            onClick={() => {
              const item = row.original;
              if (!item?.FileId) return;
              navigate(`/Attachments/${item.FileId}`);
            }}
          >
            <Icon name="navigation-right-arrow" />
          </button>
        ),
      },
    ];
  }, [navigate]);

  return (
    <DynamicPage
      headerArea={
        <DynamicPageHeader style={{ padding: '1rem 2rem' }}>
          <AttachmentsFilterBar onFilterChange={setFilter} onSearchChange={setSearch} />
        </DynamicPageHeader>
      }
      style={{
        height: '100dvh',
      }}
      showFooter={true}
      titleArea={
        <DynamicPageTitle
          heading={
            <VariantManagement onClick={function fQ() {}}>
              <VariantItem selected>Standard</VariantItem>
            </VariantManagement>
          }
          snappedHeading={
            <VariantManagement onClick={function fQ() {}}>
              <VariantItem selected>Standard</VariantItem>
            </VariantManagement>
          }
          style={{ minHeight: '0px', padding: '0rem 2rem' }}
        />
      }
    >
      {viewMode === 'table' && (
        <AnalyticalTable
          header={
            <Toolbar className="py-2 px-4 rounded-t-xl">
              <Title level="H2">Attachments {totalCount ? `(${totalCount})` : ''}</Title>
              <ToolbarSpacer />
              <ToolbarButton design="Transparent" text="New" onClick={() => navigate('/Attachments/New')} />
              <ToolbarButton design="Transparent" text="Delete" disabled={selectedCount === 0} />
              <ToolbarButton
                icon="table-view"
                tooltip="Toggle grid view"
                disabled={isFetching || attachments.length === 0}
                onClick={() => setViewMode('grid')}
              />
            </Toolbar>
          }
          data={attachments}
          columns={columns}
          sortable
          groupable
          selectionMode="Multiple"
          loading={isFetching || isFetchingNextPage}
          rowHeight={36}
          selectionBehavior="RowSelector"
          scaleWidthMode="Smart"
          selectedRowIds={selectedIds}
          onRowSelect={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectedIds(e.detail.selectedRowIds ?? {});
          }}
          visibleRowCountMode="Auto"
        />
      )}
      {viewMode === 'grid' && (
        <FlexBox direction="Column" style={{ width: '100%', gap: '1rem' }}>
          <Toolbar className="py-2 px-4 rounded-xl">
            <Title level="H2">Attachments {totalCount ? `(${totalCount})` : ''}</Title>
            <ToolbarSpacer />
            <ToolbarButton design="Transparent" text="New" onClick={() => navigate('/Attachments/New')} />
            <ToolbarButton design="Transparent" text="Delete" disabled={selectedCount === 0} />
            <ToolbarButton
              icon="list"
              tooltip="Toggle list view"
              onClick={() => setViewMode('table')}
              disabled={isFetching || attachments.length === 0}
            />
          </Toolbar>
          {attachments.length === 0 && <IllustratedMessage name="NoData" />}
          <Grid defaultSpan="XL3 L4 M6 S12" hSpacing="1.5rem" vSpacing="1.5rem" className="px-3 md:px-0">
            {attachments.map((attachment, index) => (
              <AttachmentCard
                key={attachment.FileId}
                data={attachment}
                selected={selectedIds[index]}
                onSelectChange={(checked) => {
                  if (checked) {
                    setSelectedIds((prev) => ({
                      ...prev,
                      [index]: true,
                    }));
                  } else {
                    setSelectedIds((prev) => {
                      const { [index]: _, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                loading={isFetching || isFetchingNextPage}
              />
            ))}
          </Grid>
        </FlexBox>
      )}
      {hasNextPage && (
        <Bar className={cn({ 'rounded-xl mt-4': viewMode === 'grid' })}>
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            More [{attachments.length}/{totalCount}]
          </Button>
        </Bar>
      )}
    </DynamicPage>
  );
}
