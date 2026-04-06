import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import { AnalyticalTable } from '@ui5/webcomponents-react/AnalyticalTable';
import type { AnalyticalTableCellInstance, AnalyticalTableColumnDefinition } from '@ui5/webcomponents-react/AnalyticalTable';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { Button } from '@ui5/webcomponents-react/Button';
import { Dialog } from '@ui5/webcomponents-react/Dialog';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { IllustratedMessage } from '@ui5/webcomponents-react/IllustratedMessage';
import { Input } from '@ui5/webcomponents-react/Input';
import { Label } from '@ui5/webcomponents-react/Label';
import { MessageBox } from '@ui5/webcomponents-react/MessageBox';
import { Toast } from '@ui5/webcomponents-react/Toast';
import { Title } from '@ui5/webcomponents-react/Title';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { ConfigFileSearchHelpBar } from '@/components/config-file-search-help-bar';
import '@ui5/webcomponents-fiori/dist/illustrations/NoData.js';
import '@ui5/webcomponents-icons/add.js';
import '@ui5/webcomponents-icons/delete.js';
import '@ui5/webcomponents-icons/edit.js';
import '@ui5/webcomponents-icons/document.js';
import '@ui5/webcomponents-icons/home.js';
import '@ui5/webcomponents-icons/refresh.js';
import { createConfigFileMutationOptions, deleteConfigFileMutationOptions, updateConfigFileMutationOptions } from '@/features/config-files/options/mutation';
import { getConfigFilesQueryOptions } from '@/features/config-files/options/query';
import type { ConfigFileItem, CreateConfigFilePayload, UpdateConfigFilePayload } from '@/features/config-files/types';
import { getBackendErrorMessage } from '@/libs/error-message';

type ConfigFileFormState = {
  FileExt: string;
  MimeType: string;
  MaxBytes: string;
  IsActive: string;
  Description: string;
};

const DEFAULT_FORM: ConfigFileFormState = {
  FileExt: '',
  MimeType: '',
  MaxBytes: '',
  IsActive: 'X',
  Description: '',
};

const columns: AnalyticalTableColumnDefinition[] = [
  { Header: 'File Ext', accessor: 'FileExt', width: 140 },
  { Header: 'Mime Type', accessor: 'MimeType', width: 360 },
  { Header: 'Max Bytes', accessor: 'MaxBytes', width: 140 },
  {
    Header: 'Status',
    accessor: 'IsActive',
    width: 120,
    Cell: ({ value }: AnalyticalTableCellInstance) => (value === 'X' ? 'Active' : 'Inactive'),
  },
  { Header: 'Description', accessor: 'Description' },
  { id: 'actions', Header: 'Actions', accessor: 'FileExt', width: 220 },
];

type ConfigFileViewProps = {
  embedded?: boolean;
};

export function ConfigFileView({ embedded = false }: ConfigFileViewProps = {}) {
  const queryClient = useQueryClient();
  const [toastVisible, setToastVisible] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<'create' | 'edit'>('create');
  const [editingKey, setEditingKey] = React.useState('');
  const [deleteTarget, setDeleteTarget] = React.useState<ConfigFileItem | null>(null);
  const [form, setForm] = React.useState<ConfigFileFormState>(DEFAULT_FORM);
  const [filterString, setFilterString] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 10;
  const configFileListParams = React.useMemo(
    () => ({
      'sap-client': 324,
      $filter: filterString || undefined,
    }),
    [filterString],
  );

  const { data, isLoading, isFetching, error, refetch } = useQuery(
    getConfigFilesQueryOptions(configFileListParams),
  );

  const configFiles = React.useMemo(() => data?.value ?? [], [data]);

  const totalRows = configFiles.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));

  React.useEffect(() => {
    if (!error) {
      return;
    }

    setToastMessage(getBackendErrorMessage(error, 'Cannot load configuration files.'));
    setToastVisible(true);
  }, [error]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterString]);

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedRows = React.useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return configFiles.slice(startIndex, startIndex + rowsPerPage);
  }, [configFiles, currentPage, rowsPerPage]);

  const { mutate: createMutation, isPending: isCreating } = useMutation(
    createConfigFileMutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['config-files'] });
        setToastMessage('Configuration file created successfully');
        setToastVisible(true);
        setDialogOpen(false);
      },
      onError: (createError: Error) => {
        setToastMessage(getBackendErrorMessage(createError, 'Cannot create configuration file'));
        setToastVisible(true);
      },
    }),
  );

  const { mutate: updateMutation, isPending: isUpdating } = useMutation(
    updateConfigFileMutationOptions({
      fileExt: editingKey,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['config-files'] });
        setToastMessage('Configuration file updated successfully');
        setToastVisible(true);
        setDialogOpen(false);
      },
      onError: (updateError: Error) => {
        setToastMessage(getBackendErrorMessage(updateError, 'Cannot update configuration file'));
        setToastVisible(true);
      },
    }),
  );

  const { mutate: deleteMutation, isPending: isDeleting } = useMutation(
    deleteConfigFileMutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['config-files'] });
        setToastMessage('Configuration file deleted successfully');
        setToastVisible(true);
        setDeleteTarget(null);
      },
      onError: (deleteError: Error) => {
        setToastMessage(getBackendErrorMessage(deleteError, 'Cannot delete configuration file'));
        setToastVisible(true);
      },
    }),
  );

  const columnsWithActions = React.useMemo(() => {
    return columns.map((column) => {
      if (column.id !== 'actions') return column;

      return {
        ...column,
        Cell: ({ row }: AnalyticalTableCellInstance) => {
          const item = row.original as ConfigFileItem;

          return (
            <div className="flex items-center justify-end gap-2">
              <Button
                design="Transparent"
                icon="edit"
                onClick={() => {
                  setDialogMode('edit');
                  setEditingKey(item.FileExt);
                  setForm({
                    FileExt: item.FileExt,
                    MimeType: item.MimeType,
                    MaxBytes: String(item.MaxBytes),
                    IsActive: item.IsActive ?? 'X',
                    Description: item.Description || '',
                  });
                  setDialogOpen(true);
                }}
                disabled={!item.__EntityControl?.Updatable}
              >
                Edit
              </Button>
              <Button
                design="Negative"
                icon="delete"
                onClick={() => setDeleteTarget(item)}
                disabled={!item.__EntityControl?.Deletable || isDeleting}
              >
                Delete
              </Button>
            </div>
          );
        },
      };
    });
  }, [isDeleting]);

  const openCreateDialog = () => {
    setDialogMode('create');
    setEditingKey('');
    setForm(DEFAULT_FORM);
    setDialogOpen(true);
  };

  const saveConfigFile = () => {
    const trimmedFileExt = form.FileExt.trim();
    const trimmedMimeType = form.MimeType.trim();
    const parsedMaxBytes = Number(form.MaxBytes);
    const trimmedDescription = form.Description.trim();

    if (!trimmedFileExt || !trimmedMimeType || !trimmedDescription || !Number.isFinite(parsedMaxBytes) || parsedMaxBytes <= 0) {
      setToastMessage('Please fill all required fields with valid values.');
      setToastVisible(true);
      return;
    }

    const payload: CreateConfigFilePayload | UpdateConfigFilePayload = {
      MimeType: trimmedMimeType,
      MaxBytes: parsedMaxBytes,
      IsActive: dialogMode === 'create' ? 'X' : form.IsActive || 'X',
      Description: trimmedDescription,
    };

    if (dialogMode === 'create') {
      createMutation({ fileExt: trimmedFileExt, payload });
      return;
    }

    updateMutation(payload);
  };

  const content = (
    <>
      <div className="flex flex-col gap-4">
        <FlexBox alignItems="Center" className="text-primary gap-2">
          <Title level="H1" className="text-primary">
            Configuration Files
          </Title>
        </FlexBox>

        <Toolbar className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm">
          <ToolbarButton design="Emphasized"  text="Create Config File" onClick={openCreateDialog} />
          <ToolbarSpacer />
          <ToolbarButton design="Transparent" icon="refresh" text="Refresh" onClick={() => refetch()} />
        </Toolbar>

        <ConfigFileSearchHelpBar onFilterChange={setFilterString} />
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <AnalyticalTable
          data={pagedRows}
          columns={columnsWithActions}
          loading={isLoading || isFetching}
          rowHeight={44}
          selectionMode="None"
          visibleRows={10}
          sortable
          groupable
          scaleWidthMode="Smart"
          onRowClick={(event) => {
            const item = event.detail.row.original as ConfigFileItem;
            setDialogMode('edit');
            setEditingKey(item.FileExt);
            setForm({
              FileExt: item.FileExt,
              MimeType: item.MimeType,
              MaxBytes: String(item.MaxBytes),
              IsActive: item.IsActive || 'X',
              Description: item.Description || '',
            });
            setDialogOpen(true);
          }}
        />

        {configFiles.length > 0 ? (
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

        {!isLoading && configFiles.length === 0 ? (
          <div className="border-t border-slate-200/80 p-6">
            <IllustratedMessage name="NoData" />
          </div>
        ) : null}
      </div>
    </>
  );

  const dialogs = (
    <>
      <Dialog
        open={dialogOpen}
        headerText={dialogMode === 'create' ? 'Add Configuration File' : 'Edit Configuration File'}
        className="w-[min(92vw,56rem)]"
        footer={
          <Bar
            design="Footer"
            endContent={
              <FlexBox className="gap-2" justifyContent="End">
                <Button design="Emphasized" onClick={saveConfigFile} disabled={isCreating || isUpdating}>
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setDialogOpen(false);
                  }}
                  disabled={isCreating || isUpdating}
                >
                  Cancel
                </Button>
              </FlexBox>
            }
          />
        }
      >
        <div className="grid gap-4 p-2 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>File Ext</Label>
            <Input
              value={form.FileExt}
              placeholder="Enter file extension, e.g. .pdf"
              onInput={(event) => setForm((prev) => ({ ...prev, FileExt: event.target.value }))}
              disabled={dialogMode === 'edit'}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Mime Type</Label>
            <Input
              value={form.MimeType}
              placeholder="Enter MIME type, e.g. application/pdf"
              onInput={(event) => setForm((prev) => ({ ...prev, MimeType: event.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Max Bytes</Label>
            <Input
              type="Number"
              value={form.MaxBytes}
              placeholder="Enter maximum bytes"
              onInput={(event) => setForm((prev) => ({ ...prev, MaxBytes: event.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label>Description</Label>
            <Input
              value={form.Description}
              placeholder="Enter description"
              onInput={(event) => setForm((prev) => ({ ...prev, Description: event.target.value }))}
            />
          </div>
        </div>
      </Dialog>

      <MessageBox
        open={Boolean(deleteTarget)}
        type="Confirm"
        titleText="Delete Configuration File"
        actions={['Cancel', 'OK']}
        onClose={(action) => {
          if (action === 'OK' && deleteTarget) {
            deleteMutation(deleteTarget.FileExt);
          }
          setDeleteTarget(null);
        }}
      >
        Are you sure you want to delete configuration file {deleteTarget?.FileExt || '-'}? This action cannot be undone.
      </MessageBox>

      <Toast open={toastVisible} duration={2500} onClose={() => setToastVisible(false)}>
        {toastMessage}
      </Toast>
    </>
  );

  if (embedded) {
    return <section className="flex min-h-0 flex-1 flex-col gap-4 p-4">{content}{dialogs}</section>;
  }

  return (
    <DynamicPage
      style={{
        height: '100dvh',
        overflow: 'hidden',
        position: 'relative',
        background: 'linear-gradient(180deg,rgba(242,247,251,0.98) 0%,rgba(231,240,248,0.98) 100%)',
      }}
    >
      <section className="mx-auto flex w-full max-w-[96rem] flex-col gap-4 p-4 h-full">{content}</section>
      {dialogs}
    </DynamicPage>
  );
}
