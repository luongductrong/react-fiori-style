import * as React from 'react';
import { cn } from '@/libs/utils';
import { Link } from 'react-router';
import '@ui5/webcomponents-icons/list.js';
import '@ui5/webcomponents-icons/refresh.js';
import '@ui5/webcomponents-icons/table-view.js';
import { useAppStore } from '@/stores/app-store';
import { API } from '@/features/attachments/constants';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { pushApiErrorMessages } from '@/libs/errors';
import { Grid } from '@ui5/webcomponents-react/Grid';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { BusyIndicator } from '@/components/busy-indicator';
import '@ui5/webcomponents-icons/navigation-right-arrow.js';
import '@ui5/webcomponents-fiori/dist/illustrations/NoData.js';
import { Link as UI5Link } from '@ui5/webcomponents-react/Link';
import { useCurrentAuthUser } from '@/features/auth-users/hooks';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { attachmentsQueryOptions } from '@/features/attachments/options/query';
import { DynamicPageHeader } from '@ui5/webcomponents-react/DynamicPageHeader';
import { IllustratedMessage } from '@ui5/webcomponents-react/IllustratedMessage';
import { AttachmentsFilterBar, AttachmentCard, AttachmentCreate } from '@/features/attachments/components';
import { AnalyticalTable, type AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

export function AttachmentListView() {
  const viewMode = useAppStore((state) => state.viewMode);
  const setViewMode = useAppStore((state) => state.setViewMode);
  const { data: currentAuthUser, isPending: isAuthPending } = useCurrentAuthUser();
  const [search, setSearch] = React.useState<string>('');
  const [filter, setFilter] = React.useState<string>('');
  const isAdmin = currentAuthUser?.isAdmin ?? false;
  const attachmentListParams = React.useMemo(
    () => ({
      'sap-client': 324,
      $skip: 0,
      $top: 10,
      $count: true,
      $select: API.select,
      // If user is admin, show all attachments, otherwise show only active attachments
      $filter: isAdmin ? filter || undefined : filter ? `IsActive eq true and ${filter}` : 'IsActive eq true',
      $search: search || undefined,
    }),
    [filter, isAdmin, search],
  );
  const { data, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage, refetch, error } = useInfiniteQuery({
    ...attachmentsQueryOptions(attachmentListParams),
    enabled: !isAuthPending,
  });

  const attachments = data?.pages.flatMap((page) => page.value) ?? [];
  const lastPage = data ? data.pages[data.pages.length - 1] : undefined;
  const totalCount = lastPage?.['@odata.count'] ?? 0;

  const columns = React.useMemo(
    () => [
      {
        Header: 'File ID',
        accessor: 'FileId',
        Cell: (props: AnalyticalTableCellInstance) => (
          <Link to={`/attachments/${props.value}`}>
            <UI5Link>{props.value}</UI5Link>
          </Link>
        ),
      },
      // TODO: Apply to BO
      {
        Header: 'Title',
        accessor: 'Title',
      },
      {
        Header: 'Version',
        accessor: 'CurrentVersion',
      },
      ...(isAdmin
        ? [
            {
              Header: 'Is Active',
              accessor: 'IsActive',
              Cell: (props: AnalyticalTableCellInstance) => (props.value ? 'Yes' : 'No'),
            },
          ]
        : []),
      {
        Header: 'Created On',
        accessor: 'Erdat',
      },
      {
        Header: 'Created By',
        accessor: 'Ernam',
      },
    ],
    [isAdmin],
  );

  React.useEffect(() => {
    if (error) {
      pushApiErrorMessages(error);
    }
  }, [error]);

  if (isAuthPending) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <BusyIndicator type="loading" />
      </div>
    );
  }

  return (
    <DynamicPage
      headerArea={
        <DynamicPageHeader className="px-8 py-4">
          <AttachmentsFilterBar onFilterChange={setFilter} onSearchChange={setSearch} showActiveFilter={isAdmin} />
        </DynamicPageHeader>
      }
      className="flex-1"
      showFooter={true}
    >
      {viewMode === 'table' && (
        <AnalyticalTable
          header={
            <Toolbar className="py-2 px-4 rounded-t-xl">
              <Title level="H2">Attachments {totalCount ? `(${totalCount})` : ''}</Title>
              <ToolbarSpacer />
              {/* ToolbarButton - AttachmentCreate */}
              <AttachmentCreate />
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
                disabled={isFetching || attachments.length === 0}
                onClick={() => setViewMode('grid')}
              />
            </Toolbar>
          }
          data={attachments}
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
            <Title level="H2">Attachments {totalCount ? `(${totalCount})` : ''}</Title>
            <ToolbarSpacer />
            {/* ToolbarButton - AttachmentCreate */}
            <AttachmentCreate />
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
              disabled={isFetching || attachments.length === 0}
            />
          </Toolbar>
          {attachments.length === 0 && <IllustratedMessage name="NoData" />}
          <Grid defaultSpan="XL3 L4 M6 S12" hSpacing="1.5rem" vSpacing="1.5rem" className="px-3 md:px-0">
            {attachments.map((attachment) => (
              <AttachmentCard
                key={attachment.FileId}
                data={attachment}
                isAdmin={isAdmin}
                loading={isFetching || isFetchingNextPage}
              />
            ))}
          </Grid>
        </FlexBox>
      )}
      {hasNextPage && (
        <Bar className={cn({ 'rounded-xl mt-4': viewMode === 'grid' })}>
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} design="Transparent">
            More [{attachments.length}/{totalCount}]
          </Button>
        </Bar>
      )}
    </DynamicPage>
  );
}
