import * as React from 'react';
import '@ui5/webcomponents-icons/list.js';
import '@ui5/webcomponents-icons/refresh.js';
import '@ui5/webcomponents-icons/table-view.js';
import { Link, useNavigate } from 'react-router';
import { useAppStore } from '@/stores/app-store';
import { useViewStore } from '@/stores/view-store';
import { Grid } from '@ui5/webcomponents-react/Grid';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { useInfiniteQuery } from '@tanstack/react-query';
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
import { displayVersion } from '@/features/attachments/helpers/formatter';
import { displayListDate, displayListTime } from '@/libs/helpers/date-time';
import { useInvalidateAttachmentQuery } from '@/features/attachments/hooks';
import { buildSelectWithDateTimeFields } from '@/libs/helpers/odata-select';
import { useInvalidateConfigFileQuery } from '@/features/config-files/hooks';
import { attachmentsQueryOptions } from '@/features/attachments/options/query';
import { DynamicPageHeader } from '@ui5/webcomponents-react/DynamicPageHeader';
import { IllustratedMessage } from '@ui5/webcomponents-react/IllustratedMessage';
import { ToolbarButton, type ToolbarButtonPropTypes } from '@ui5/webcomponents-react/ToolbarButton';
import { ATTACHMENT_LIST_FIELDS, type AttachmentListFieldId } from '@/features/attachments/view-config';
import { AttachmentsFilterBar, AttachmentCard, AttachmentCreate } from '@/features/attachments/components';
import { AnalyticalTable, type AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

type AttachmentListColumn = {
  id: AttachmentListFieldId;
} & Record<string, unknown>;

const ALL_COLUMNS = [
  {
    Header: 'File ID',
    accessor: 'FileId',
    id: 'FileId',
    Cell: (props: AnalyticalTableCellInstance) => (
      <Link to={`/attachments/${props.value}`}>
        <UI5Link>{props.value}</UI5Link>
      </Link>
    ),
  },
  { Header: 'Title', accessor: 'Title', id: 'Title' },
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
  {
    Header: 'Edit Lock',
    accessor: 'EditLock',
    id: 'EditLock',
    Cell: (props: AnalyticalTableCellInstance) => (props.value ? 'Enabled' : 'Disabled'),
  },
] as const satisfies readonly AttachmentListColumn[];

export function AttachmentListView() {
  const navigate = useNavigate();
  const invalidateAtt = useInvalidateAttachmentQuery();
  const invalidateConfig = useInvalidateConfigFileQuery();
  const viewMode = useAppStore((state) => state.viewMode);
  const setViewMode = useAppStore((state) => state.setViewMode);
  const selectedFieldIds = useViewStore((state) => state.attachmentListVisibleFieldIds);
  const setSelectedFieldIds = useViewStore((state) => state.setAttachmentListVisibleFieldIds);
  const [search, setSearch] = React.useState<string>('');
  const [filter, setFilter] = React.useState<string>('');
  const attachmentListSelect = React.useMemo(() => buildSelectWithDateTimeFields(selectedFieldIds), [selectedFieldIds]);
  const visibleColumns = React.useMemo(
    () => ALL_COLUMNS.filter((col) => selectedFieldIds.includes(col.id)),
    [selectedFieldIds],
  );
  const attachmentListParams = React.useMemo(
    () => ({
      $skip: 0,
      $top: 20,
      $count: true,
      $select: attachmentListSelect,
      $orderby: 'Erdat desc,Erzet desc',
      $filter: filter ? `IsActive eq true and ${filter}` : 'IsActive eq true',
      $search: search || undefined,
    }),
    [attachmentListSelect, filter, search],
  );
  const { data, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage, error } = useInfiniteQuery({
    ...attachmentsQueryOptions(attachmentListParams),
    enabled: selectedFieldIds.length > 0,
  });

  const attachments = data?.pages.flatMap((page) => page.value) ?? [];
  const lastPage = data ? data.pages[data.pages.length - 1] : undefined;
  const totalCount = lastPage?.['@odata.count'] ?? 0;

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
            onClick={() => navigate(`/attachments/${props.row.original.FileId}`)}
          />
        ),
      },
    ],
    [navigate, visibleColumns],
  );

  const handleRefresh: ToolbarButtonPropTypes['onClick'] = React.useCallback(() => {
    invalidateAtt.invalidateAttachmentList();
    invalidateConfig.invalidateConfigFileList();
  }, [invalidateAtt, invalidateConfig]);

  React.useEffect(() => {
    if (error) {
      pushApiErrorMessages(error);
    }
  }, [error]);

  return (
    <DynamicPage
      headerArea={
        <DynamicPageHeader className="px-8 py-4">
          <AttachmentsFilterBar onFilterChange={setFilter} onSearchChange={setSearch} />
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
              <ToolbarButton design="Transparent" icon="refresh" text="Refresh" onClick={handleRefresh} />
              <ToolbarButton
                icon="table-view"
                design="Transparent"
                tooltip="Toggle grid view"
                onClick={() => setViewMode('grid')}
              />
              <ViewSettings
                fields={ATTACHMENT_LIST_FIELDS}
                selectedIds={selectedFieldIds}
                setSelectedIds={setSelectedFieldIds}
              />
            </Toolbar>
          }
          data={selectedFieldIds.length > 0 ? attachments : []}
          columns={selectedFieldIds.length > 0 ? columns : []}
          noDataText={
            selectedFieldIds.length === 0
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
            <Title level="H2">Attachments {totalCount ? `(${totalCount})` : ''}</Title>
            <ToolbarSpacer />
            {/* ToolbarButton - AttachmentCreate */}
            <AttachmentCreate />
            <ToolbarButton design="Transparent" icon="refresh" text="Refresh" onClick={handleRefresh} />
            <ToolbarButton
              icon="list"
              design="Transparent"
              tooltip="Toggle list view"
              onClick={() => setViewMode('table')}
            />
            <ViewSettings
              fields={ATTACHMENT_LIST_FIELDS}
              selectedIds={selectedFieldIds}
              setSelectedIds={setSelectedFieldIds}
            />
          </Toolbar>
          {attachments.length === 0 && selectedFieldIds.length > 0 && <IllustratedMessage name="NoData" />}
          {selectedFieldIds.length === 0 && (
            <h4 className="text-center">
              There are no visible fields in the table right now. Please select the fields you need in the table
              settings.
            </h4>
          )}
          <Grid defaultSpan="XL3 L4 M6 S12" hSpacing="1.5rem" vSpacing="1.5rem" className="px-3 md:px-0">
            {selectedFieldIds.length > 0 &&
              attachments.map((attachment) => (
                <AttachmentCard key={attachment.FileId} data={attachment} loading={isFetching || isFetchingNextPage} />
              ))}
          </Grid>
        </FlexBox>
      )}
      <LoadMoreTrigger
        hasMore={hasNextPage}
        isLoading={isFetching || isFetchingNextPage}
        enabled={selectedFieldIds.length > 0}
        onLoadMore={() => fetchNextPage()}
      />
    </DynamicPage>
  );
}
