import * as React from 'react';
import { cn } from '@/libs/utils';
import { Link } from 'react-router';
import '@ui5/webcomponents-icons/home.js';
import '@ui5/webcomponents-icons/list.js';
import { useNavigate } from 'react-router';
import '@ui5/webcomponents-icons/refresh.js';
import '@ui5/webcomponents-icons/table-view.js';
import { useAppStore } from '@/stores/app-store';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { Grid } from '@ui5/webcomponents-react/Grid';
import { pushApiErrorMessages } from '@/libs/errors';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { Title } from '@ui5/webcomponents-react/Title';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Button } from '@ui5/webcomponents-react/Button';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { API } from '@/features/business-objects/constants';
import '@ui5/webcomponents-fiori/dist/illustrations/NoData.js';
import { Link as UI5Link } from '@ui5/webcomponents-react/Link';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { DynamicPageHeader } from '@ui5/webcomponents-react/DynamicPageHeader';
import { IllustratedMessage } from '@ui5/webcomponents-react/IllustratedMessage';
import { bizObjectsQueryOptions } from '@/features/business-objects/options/query';
import { displayBoType, displayBoStatus } from '@/features/business-objects/helpers';
import { BizObjectCard, BizObjectsFilterBar, BizCreate } from '@/features/business-objects/components';
import { AnalyticalTable, type AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

const columns = [
  {
    Header: 'ID',
    accessor: 'BoId',
    Cell: (props: AnalyticalTableCellInstance) => (
      <Link to={`/business-objects/${props.value}`}>
        <UI5Link>{props.value}</UI5Link>
      </Link>
    ),
  },
  { Header: 'Title', accessor: 'BoTitle' },
  { Header: 'Type', accessor: 'BoType', Cell: (props: AnalyticalTableCellInstance) => displayBoType(props.value) },
  { Header: 'Status', accessor: 'Status', Cell: (props: AnalyticalTableCellInstance) => displayBoStatus(props.value) },
  {
    Header: 'Created At',
    id: 'created-at',
    Cell: (props: AnalyticalTableCellInstance) => `${props.row.original.Erdat ?? ''} ${props.row.original.Erzet ?? ''}`,
  },
  { Header: 'Created By', accessor: 'Ernam' },
];

const ROWS_PER_PAGE = 10; // TODO: Move to constants

export function BoListView() {
  const navigate = useNavigate();
  const viewMode = useAppStore((state) => state.viewMode);
  const setViewMode = useAppStore((state) => state.setViewMode);
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('');

  const { data, isFetching, isFetchingNextPage, error, refetch, hasNextPage, fetchNextPage } = useInfiniteQuery(
    bizObjectsQueryOptions({
      'sap-client': 324,
      $skip: 0,
      $top: ROWS_PER_PAGE,
      $count: true,
      $select: API.select,
      $filter: filter || undefined,
      $search: search || undefined,
    }),
  );

  const totalCount = data?.pages[data.pages.length - 1]['@odata.count'] ?? 0;
  const bizObjects = React.useMemo(() => data?.pages.flatMap((page) => page.value) ?? [], [data?.pages]);

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
          <Button
            design="Transparent"
            tooltip="Click to go to home page"
            onClick={() => {
              navigate('/launchpad');
            }}
            className="cursor-pointer"
          >
            <FlexBox alignItems="Center" className="text-primary gap-2">
              <Icon name="home" className="text-primary" mode="Interactive" />
              <Title level="H1" className="text-primary cursor-pointer">
                Business Objects
              </Title>
            </FlexBox>
          </Button>
          <BizObjectsFilterBar onFilterChange={setFilter} onSearchChange={setSearch} />
        </DynamicPageHeader>
      }
      className="h-dvh"
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
                tooltip="Toggle grid view"
                disabled={isFetching || bizObjects.length === 0}
                onClick={() => setViewMode('grid')}
              />
            </Toolbar>
          }
          data={bizObjects}
          columns={columns}
          sortable
          groupable
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
              tooltip="Toggle list view"
              onClick={() => setViewMode('table')}
              disabled={isFetching || bizObjects.length === 0}
            />
          </Toolbar>
          {bizObjects.length === 0 && <IllustratedMessage name="NoData" />}
          <Grid defaultSpan="XL3 L4 M6 S12" hSpacing="1.5rem" vSpacing="1.5rem" className="px-3 md:px-0">
            {bizObjects.map((bizObject) => (
              <BizObjectCard key={bizObject.BoId} data={bizObject} loading={isFetching || isFetchingNextPage} />
            ))}
          </Grid>
        </FlexBox>
      )}
      {hasNextPage && (
        <Bar className={cn({ 'rounded-xl mt-4': viewMode === 'grid' })}>
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} design="Transparent">
            More [{bizObjects.length}/{totalCount}]
          </Button>
        </Bar>
      )}
    </DynamicPage>
  );
}
// TODO: Handle time zone display
// TODO: Handle default orderby
