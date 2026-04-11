import * as React from 'react';
import '@ui5/webcomponents-icons/home.js';
import { useNavigate } from 'react-router';
import '@ui5/webcomponents-icons/refresh.js';
import '@ui5/webcomponents-icons/document.js';
import { getError } from '@/libs/error-message';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { Title } from '@ui5/webcomponents-react/Title';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Button } from '@ui5/webcomponents-react/Button';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { API } from '@/features/business-objects/constants';
import '@ui5/webcomponents-icons/navigation-right-arrow.js';
import { MessageBox } from '@ui5/webcomponents-react/MessageBox';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { DynamicPageHeader } from '@ui5/webcomponents-react/DynamicPageHeader';
import { bizObjectsQueryOptions } from '@/features/business-objects/options/query';
import { displayBoType, displayBoStatus } from '@/features/business-objects/helpers';
import { BizObjectsFilterBar, BizCreate } from '@/features/business-objects/components';
import { AnalyticalTable, type AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

const rawColumns = [
  { Header: 'ID', accessor: 'BoId' },
  { Header: 'Title', accessor: 'BoTitle' },
  { Header: 'Type', accessor: 'BoType', Cell: (props: AnalyticalTableCellInstance) => displayBoType(props.value) },
  { Header: 'Status', accessor: 'Status', Cell: (props: AnalyticalTableCellInstance) => displayBoStatus(props.value) },
  { Header: 'Created On', accessor: 'Erdat' },
  { Header: 'Created By', accessor: 'Ernam' },
];

const ROWS_PER_PAGE = 10; // TODO: Move to constants

export function BoListView() {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('');
  const [errorBoxOpen, setErrorBoxOpen] = React.useState(false);
  const [errorBoxMessages, setErrorBoxMessages] = React.useState<string[]>([]);

  const { data, isFetching, isFetchingNextPage, error, refetch, hasNextPage, fetchNextPage } = useInfiniteQuery(
    bizObjectsQueryOptions({
      'sap-client': 324,
      $skip: 0,
      $top: ROWS_PER_PAGE,
      $count: true,
      $select: API.select, // TODO: The same handle applies to Attachments.
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
    const messages = getError(error);
    setErrorBoxMessages((prev) => [...messages, ...prev]);
    setErrorBoxOpen(true);
  }, [error]);

  const columns = React.useMemo(
    () => [
      ...rawColumns,
      {
        Header: '',
        id: 'nav',
        width: 60,
        disableSortBy: true,
        disableGroupBy: true,
        Cell: (props: AnalyticalTableCellInstance) => (
          <Icon
            name="navigation-right-arrow"
            onClick={() => navigate(`/business-objects/${props.row.original.BoId}`)}
          />
        ),
        // TODO: Implement the same process to other tables.
      },
    ],
    [navigate],
  );

  return (
    <DynamicPage
      headerArea={
        <DynamicPageHeader className="py-4 px-8">
          <Button
            design="Transparent"
            tooltip="Click to go to home page"
            onClick={() => {
              navigate('/shell-home');
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
      <AnalyticalTable
        header={
          <Toolbar className="py-2 px-4 rounded-t-xl">
            <Title level="H2">Business Objects {totalCount ? `(${totalCount})` : ''}</Title>
            <ToolbarSpacer />
            {/* ToolbarButton - BizCreate */}
            <BizCreate />
            <ToolbarButton
              design="Transparent"
              icon="refresh"
              text="Refresh"
              onClick={() => {
                refetch();
              }}
            />
            {/* <ToolbarButton
              icon="table-view"
              tooltip="Toggle grid view"
              disabled={isFetching || attachments.length === 0}
              onClick={() => setViewMode('grid')}
            /> */}
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
        onRowClick={(event) => {
          const item = event.detail.row.original;
          if (item?.BoId) {
            navigate(`/business-objects/${item.BoId}`);
          }
        }}
      />
      {hasNextPage && (
        <Bar>
          {/* className={cn({ 'rounded-xl mt-4': viewMode === 'grid' })} */}
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} design="Transparent">
            More [{bizObjects.length}/{totalCount}]
          </Button>
        </Bar>
      )}
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
    </DynamicPage>
  );
}

// TODO: Grid View
// TODO: Fix filter by ID
// TODO: Handle time zone display
// TODO: Handle default orderby
