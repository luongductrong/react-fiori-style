import * as React from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import { DynamicPageHeader } from '@ui5/webcomponents-react/DynamicPageHeader';
import { DynamicPageTitle } from '@ui5/webcomponents-react/DynamicPageTitle';
import { AnalyticalTable } from '@ui5/webcomponents-react/AnalyticalTable';
import type { AnalyticalTableCellInstance, AnalyticalTableColumnDefinition } from '@ui5/webcomponents-react/AnalyticalTable';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { Toast } from '@ui5/webcomponents-react/Toast';
import { IllustratedMessage } from '@ui5/webcomponents-react/IllustratedMessage';
import '@ui5/webcomponents-fiori/dist/illustrations/NoData.js';
import '@ui5/webcomponents-icons/document.js';
import '@ui5/webcomponents-icons/home.js';
import '@ui5/webcomponents-icons/list.js';
import '@ui5/webcomponents-icons/refresh.js';
import { getBizObjectsQueryOptions } from '@/features/biz-object/options/query';
import type { BizObjectItem } from '@/features/biz-object/types';
import { BizObjectFilterBar } from '@/features/biz-object/components/biz-object-filter-bar';
import { getBackendErrorMessage } from '@/libs/error-message';

const rawColumns: AnalyticalTableColumnDefinition[] = [
  { Header: 'BO ID', accessor: 'BoId', width: 260 },
  { Header: 'Type', accessor: 'BoType', width: 140 },
  { Header: 'Title', accessor: 'BoTitle' },
  { Header: 'Status', accessor: 'Status', width: 120 },
  { Header: 'Created On', accessor: 'Erdat', width: 140 },
  { Header: 'Created By', accessor: 'Ernam', width: 140 },
  { id: 'actions', Header: 'Actions', accessor: 'BoId', width: 320 },
];

type BizObjectTableItem = BizObjectItem & {
  LinkAttachmentText: string;
};

function BusinessObjectActionCell({ row }: AnalyticalTableCellInstance) {
  const navigate = useNavigate();
  const item = row.original as BizObjectTableItem;

  return (
    <div className="flex items-center justify-end gap-2">
      <Button design="Emphasized" icon="list" onClick={() => navigate(`/business-objects/${item.BoId}/attachments`)}>
        Linked Attachments
      </Button>
    </div>
  );
}

export function BoView() {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('');
  const [toastVisible, setToastVisible] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 10;

  const { data, isFetching, isLoading, error, refetch } = useQuery(
    getBizObjectsQueryOptions({
      'sap-client': 324,
      $select:
        'BoId,BoType,BoTitle,Status,Erdat,Erzet,Ernam,Aedat,Aezet,Aenam,__EntityControl/Deletable,__EntityControl/Updatable,__OperationControl/link_attachment',
      $top: 100,
      $filter: filter || undefined,
    }),
  );

  const bizObjects = React.useMemo(() => data?.value ?? [], [data]);

  const filteredBizObjects = React.useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return bizObjects;

    return bizObjects.filter((item) => {
      return [item.BoId, item.BoType, item.BoTitle, item.Status, item.Ernam, item.Aenam]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch));
    });
  }, [bizObjects, search]);

  const tableRows = React.useMemo<BizObjectTableItem[]>(() => {
    return filteredBizObjects.map((item) => ({
      ...item,
      LinkAttachmentText: item.__OperationControl?.link_attachment ? 'Yes' : 'No',
    }));
  }, [filteredBizObjects]);

  const totalRows = tableRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter, search, rowsPerPage]);

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedRows = React.useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return tableRows.slice(startIndex, startIndex + rowsPerPage);
  }, [currentPage, rowsPerPage, tableRows]);

  React.useEffect(() => {
    if (!error) {
      return;
    }

    setToastMessage(getBackendErrorMessage(error, 'Cannot load BizObject data.'));
    setToastVisible(true);
  }, [error]);

  const columns = React.useMemo(() => {
    return rawColumns.map((column) => {
      if (column.id === 'actions') {
        return {
          ...column,
          Cell: BusinessObjectActionCell,
        };
      }

      return column;
    });
  }, []);

  return (
    <DynamicPage
      headerArea={
        <DynamicPageHeader>
          <div className="flex flex-col gap-4 p-4">
            <div className="rounded-3xl border border-slate-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(239,246,255,0.92))] p-4 shadow-sm">
              <Toolbar className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm">
                <Title level="H2">Business Object</Title>
                <ToolbarSpacer />
                <ToolbarButton
                  design="Transparent"
                  icon="refresh"
                  text="Refresh"
                  onClick={() => {
                    refetch();
                  }}
                />
                <ToolbarButton design="Transparent" icon="home" text="Home" onClick={() => navigate('/')} />
                <ToolbarButton design="Emphasized" text="Create Business Object" onClick={() => navigate('/business-objects/create')} />
              </Toolbar>

              <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm">
                <BizObjectFilterBar onFilterChange={setFilter} onSearchChange={setSearch} />
              </div>
            </div>
          </div>
        </DynamicPageHeader>
      }
      titleArea={
        <DynamicPageTitle
          className="p-3"
          heading={
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600/10 text-sky-700">
                <Icon name="document" />
              </span>
              <div>
                <div className="text-lg font-semibold text-slate-900">Business Object View</div>
                <div className="text-sm text-slate-500">List and inspect BizObject records from the BIZ service</div>
              </div>
            </div>
          }
          snappedHeading={
            <div className="flex items-center gap-2 text-slate-900">
              <Icon name="document" />
              <span>Business Object View</span>
            </div>
          }
          style={{ minHeight: '0px' }}
        />
      }
      style={{
        height: '100dvh',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 0,
        background:
          'linear-gradient(180deg,rgba(243,248,252,0.95) 0%,rgba(239,245,250,0.95) 55%,rgba(231,240,248,0.95) 100%)',
      }}
    >
      <div className="w-full p-4">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-[0_16px_40px_rgba(84,104,130,0.08)]">
          <AnalyticalTable
            data={pagedRows}
            columns={columns}
            loading={isFetching || isLoading}
            rowHeight={44}
            selectionMode="None"
            visibleRows={rowsPerPage}
            sortable
            groupable
            scaleWidthMode="Smart"
            onRowClick={(event) => {
              const item = event.detail.row.original as BizObjectTableItem;
              if (item?.BoId) {
                navigate(`/business-objects/${item.BoId}`);
              }
            }}
          />

          {!isFetching && tableRows.length === 0 ? (
            <div className="border-t border-slate-200/80 p-6">
              <IllustratedMessage name="NoData" />
            </div>
          ) : null}

          {tableRows.length > 0 ? (
            <Bar className="border-t border-slate-200/80 bg-white px-4 py-3">
              <div className="flex w-full flex-wrap items-center gap-3">
               
               
                <div className="ml-auto flex items-center gap-2">
                  <Button design="Transparent" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  <div className="min-w-24 text-center text-sm font-medium text-slate-700">
                    Page {currentPage} / {totalPages}
                  </div>
                  <Button
                    design="Transparent"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Bar>
          ) : null}
        </div>
      </div>

      <Toast open={toastVisible} duration={2500} onClose={() => setToastVisible(false)}>
        {toastMessage}
      </Toast>
    </DynamicPage>
  );
}
