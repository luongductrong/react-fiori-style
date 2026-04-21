import * as React from 'react';
import '@ui5/webcomponents-icons/list.js';
import '@ui5/webcomponents-icons/refresh.js';
import '@ui5/webcomponents-icons/table-view.js';
import { useAppStore } from '@/stores/app-store';
import { Link, useNavigate } from 'react-router';
import { useViewStore } from '@/stores/view-store';
import { Grid } from '@ui5/webcomponents-react/Grid';
import { Title } from '@ui5/webcomponents-react/Title';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Button } from '@ui5/webcomponents-react/Button';
import { ViewSettings } from '@/components/view-settings';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import '@ui5/webcomponents-icons/navigation-right-arrow.js';
import '@ui5/webcomponents-fiori/dist/illustrations/NoData.js';
import { Link as UI5Link } from '@ui5/webcomponents-react/Link';
import { LoadMoreTrigger } from '@/components/load-more-trigger';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import { pushApiErrorMessages } from '@/libs/helpers/error-messages';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { buildSelectWithDateTimeFields } from '@/libs/helpers/odata-select';
import { displayListDate, displayListTime } from '@/libs/helpers/date-time';
import { DynamicPageHeader } from '@ui5/webcomponents-react/DynamicPageHeader';
import { IllustratedMessage } from '@ui5/webcomponents-react/IllustratedMessage';
import { bizObjectsQueryOptions } from '@/features/business-objects/options/query';
import { BO_LIST_FIELDS, type BoListFieldId } from '@/features/business-objects/view-config';
import { displayBoType, displayBoStatus } from '@/features/business-objects/helpers/formatter';
import { BizObjectCard, BizObjectsFilterBar, BizCreate } from '@/features/business-objects/components';
import { AnalyticalTable, type AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

type BoListColumn = {
  id: BoListFieldId;
} & Record<string, unknown>;

const ALL_COLUMNS = [
  {
    Header: 'ID',
    accessor: 'BoId',
    id: 'BoId',
    Cell: (props: AnalyticalTableCellInstance) => (
      <Link to={`/business-objects/${props.value}`}>
        <UI5Link>{props.value}</UI5Link>
      </Link>
    ),
  },
  { Header: 'Title', accessor: 'BoTitle', id: 'BoTitle' },
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
  { Header: 'Created By', accessor: 'Ernam', id: 'Ernam' },
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
  { Header: 'Changed By', accessor: 'Aenam', id: 'Aenam' },
] as const satisfies readonly BoListColumn[];

export function BoListView() {
  const navigate = useNavigate();
  const viewMode = useAppStore((state) => state.viewMode);
  const setViewMode = useAppStore((state) => state.setViewMode);
  const boListVisibleFieldIds = useViewStore((state) => state.boListVisibleFieldIds);
  const setBoListVisibleFieldIds = useViewStore((state) => state.setBoListVisibleFieldIds);
  const visibleColumns = React.useMemo(
    () => ALL_COLUMNS.filter((col) => boListVisibleFieldIds.includes(col.id)),
    [boListVisibleFieldIds],
  );
  const boListSelect = React.useMemo(
    () => buildSelectWithDateTimeFields(boListVisibleFieldIds),
    [boListVisibleFieldIds],
  );
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('');

  const { data, isFetching, isFetchingNextPage, error, refetch, hasNextPage, fetchNextPage } = useInfiniteQuery({
    ...bizObjectsQueryOptions({
      $skip: 0,
      $top: 20,
      $count: true,
      $select: boListSelect,
      $orderby: 'Erdat desc,Erzet desc',
      $filter: filter || undefined,
      $search: search || undefined,
    }),
    enabled: boListVisibleFieldIds.length > 0,
  });

  const totalCount = data?.pages[data.pages.length - 1]['@odata.count'] ?? 0;
  const bizObjects = React.useMemo(() => data?.pages.flatMap((page) => page.value) ?? [], [data?.pages]);
  const columns = React.useMemo(
    () => [
      ...visibleColumns,
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
    [navigate, visibleColumns],
  );

  React.useEffect(() => {
    if (!error) {
      return;
    }
    pushApiErrorMessages(error);
  }, [error]);

  return (
    <DynamicPage
      headerArea={
        <DynamicPageHeader className="py-4 px-8">
          <BizObjectsFilterBar onFilterChange={setFilter} onSearchChange={setSearch} />
        </DynamicPageHeader>
      }
      className="flex-1"
      showFooter={true}
    >
      {viewMode === 'table' && (
        <AnalyticalTable
          header={
            <Toolbar className="py-2 px-4 rounded-t-xl">
              <Title level="H2">Business Objects {totalCount ? `(${totalCount})` : ''}</Title>
              <ToolbarSpacer />
              <BizCreate />
              <ToolbarButton
                design="Transparent"
                icon="refresh"
                text="Refresh"
                onClick={() => {
                  refetch();
                }}
              />
              <ToolbarButton
                icon="table-view"
                design="Transparent"
                tooltip="Toggle grid view"
                onClick={() => setViewMode('grid')}
              />
              <ViewSettings
                fields={BO_LIST_FIELDS}
                selectedIds={boListVisibleFieldIds}
                setSelectedIds={setBoListVisibleFieldIds}
              />
            </Toolbar>
          }
          data={boListVisibleFieldIds.length > 0 ? bizObjects : []}
          columns={boListVisibleFieldIds.length > 0 ? columns : []}
          noDataText={
            boListVisibleFieldIds.length === 0
              ? 'There are no visible columns in the table right now. Please select the columns you need in the table settings.'
              : 'No data'
          }
          sortable
          groupable={false}
          loading={isFetching || isFetchingNextPage}
          rowHeight={36}
          scaleWidthMode="Smart"
          visibleRowCountMode="Auto"
        />
      )}
      {viewMode === 'grid' && (
        <FlexBox direction="Column" style={{ width: '100%', gap: '1rem' }}>
          <Toolbar className="py-2 px-4 rounded-xl">
            <Title level="H2">Business Objects {totalCount ? `(${totalCount})` : ''}</Title>
            <ToolbarSpacer />
            <BizCreate />
            <ToolbarButton
              design="Transparent"
              icon="refresh"
              text="Refresh"
              onClick={() => {
                refetch();
              }}
            />
            <ToolbarButton
              icon="list"
              design="Transparent"
              tooltip="Toggle list view"
              onClick={() => setViewMode('table')}
            />
            <ViewSettings
              fields={BO_LIST_FIELDS}
              selectedIds={boListVisibleFieldIds}
              setSelectedIds={setBoListVisibleFieldIds}
            />
          </Toolbar>
          {bizObjects.length === 0 && boListVisibleFieldIds.length > 0 && <IllustratedMessage name="NoData" />}
          {boListVisibleFieldIds.length === 0 && (
            <h4 className="text-center">
              There are no visible fields in the table right now. Please select the fields you need in the table
              settings.
            </h4>
          )}
          <Grid defaultSpan="XL3 L4 M6 S12" hSpacing="1.5rem" vSpacing="1.5rem" className="px-3 md:px-0">
            {boListVisibleFieldIds.length > 0 &&
              bizObjects.map((bizObject) => (
                <BizObjectCard key={bizObject.BoId} data={bizObject} loading={isFetching || isFetchingNextPage} />
              ))}
          </Grid>
        </FlexBox>
      )}
      <LoadMoreTrigger
        hasMore={hasNextPage}
        isLoading={isFetchingNextPage}
        enabled={boListVisibleFieldIds.length > 0}
        onLoadMore={() => fetchNextPage()}
      />
    </DynamicPage>
  );
}
// TODO: Handle time zone display
// TODO: Handle default orderby
