import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ObjectPage } from '@ui5/webcomponents-react/ObjectPage';
import { ObjectPageTitle } from '@ui5/webcomponents-react/ObjectPageTitle';
import { Breadcrumbs } from '@ui5/webcomponents-react/Breadcrumbs';
import { BreadcrumbsItem } from '@ui5/webcomponents-react/BreadcrumbsItem';
import { BusyIndicator } from '@ui5/webcomponents-react/BusyIndicator';
import { Button } from '@ui5/webcomponents-react/Button';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { Input } from '@ui5/webcomponents-react/Input';
import { Label } from '@ui5/webcomponents-react/Label';
import { AnalyticalTable } from '@ui5/webcomponents-react/AnalyticalTable';
import { Text } from '@ui5/webcomponents-react/Text';
import { Toast } from '@ui5/webcomponents-react/Toast';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { MessageBox } from '@ui5/webcomponents-react/MessageBox';
import { ObjectPageSection } from '@ui5/webcomponents-react/ObjectPageSection';
import '@ui5/webcomponents-icons/decline.js';
import '@ui5/webcomponents-icons/document.js';
import '@ui5/webcomponents-icons/edit.js';
import '@ui5/webcomponents-icons/delete.js';
import '@ui5/webcomponents-icons/list.js';
import '@ui5/webcomponents-icons/refresh.js';
import { getBizObjectLinkedAttachmentsQueryOptions, getBizObjectsQueryOptions } from '@/features/biz-object/options/query';
import { deleteBizObjectMutationOptions, updateBizObjectMutationOptions } from '@/features/biz-object/options/mutation';
import type { AnalyticalTableCellInstance, AnalyticalTableColumnDefinition } from '@ui5/webcomponents-react/AnalyticalTable';
import { getBackendErrorMessage } from '@/libs/error-message';

type LinkedAttachmentRow = {
  FileId: string;
  Title: string;
  CurrentVersion: string;
  IsActive: boolean;
  LinkedOn: string;
  LinkedBy: string;
};

const linkedAttachmentColumns: AnalyticalTableColumnDefinition[] = [
  {
    Header: 'File ID',
    accessor: 'FileId',
    width: 240,
  },
  {
    Header: 'Title',
    accessor: 'Title',
    width: 320,
  },
  {
    Header: 'Version',
    accessor: 'CurrentVersion',
    width: 110,
  },
  {
    Header: 'Status',
    accessor: 'IsActive',
    width: 120,
    Cell: ({ row }: AnalyticalTableCellInstance) => {
      const value = row.original as LinkedAttachmentRow;
      return value.IsActive ? 'Active' : 'Inactive';
    },
  },
  {
    Header: 'Linked On',
    accessor: 'LinkedOn',
    width: 180,
  },
  {
    Header: 'Linked By',
    accessor: 'LinkedBy',
    width: 140,
  },
];

type BizObjectFormState = {
  BoType: string;
  BoTitle: string;
  Status: string;
};

const DEFAULT_FORM: BizObjectFormState = {
  BoType: '',
  BoTitle: '',
  Status: '',
};

const BO_TYPE_MAX_LENGTH = 10;
const STATUS_OPTIONS = ['NEW', 'APPROVED', 'ACTIVE', 'REJECTED', 'ERROR'];

function formatDateTime(date?: string | null, time?: string | null) {
  if (!date && !time) return '-';
  if (!date) return time || '-';
  if (!time) return date;
  return `${date} ${time}`;
}

function getBooleanTone(value: boolean) {
  return value
    ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/25'
    : 'bg-slate-500/15 text-slate-700 border-slate-500/25';
}

function formatLinkedDate(date?: string | null, time?: string | null) {
  if (!date && !time) return '-';
  if (!date) return time || '-';
  if (!time) return date;

  return `${date} ${time}`;
}

export function BoDetailView() {
  const { boId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = React.useState<BizObjectFormState>(DEFAULT_FORM);
  const [toastVisible, setToastVisible] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [navigateAfterToast, setNavigateAfterToast] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const { data, isLoading, error } = useQuery(
    getBizObjectsQueryOptions({
      'sap-client': 324,
      $select:
        'BoId,BoType,BoTitle,Status,Erdat,Erzet,Ernam,Aedat,Aezet,Aenam,__EntityControl/Deletable,__EntityControl/Updatable,__OperationControl/link_attachment,SAP__Messages',
      $top: 200,
    }),
  );

  const selectedBo = React.useMemo(() => {
    if (!boId) return null;
    return data?.value.find((item) => item.BoId === boId) ?? null;
  }, [boId, data]);

  const { data: linkedAttachmentsData, isFetching: isLinkedAttachmentsLoading } = useQuery(
    getBizObjectLinkedAttachmentsQueryOptions(boId || '', {
      'sap-client': 324,
      $expand: '_Links($expand=_Attach)',
    }),
  );

  const linkedAttachments = React.useMemo<LinkedAttachmentRow[]>(() => {
    return linkedAttachmentsData?._Links?.map((link) => ({
      FileId: link._Attach.FileId,
      Title: link._Attach.Title,
      CurrentVersion: link._Attach.CurrentVersion,
      IsActive: link._Attach.IsActive,
      LinkedOn: formatLinkedDate(link.Erdat, link.Erzet),
      LinkedBy: link.Ernam || '-',
    })) ?? [];
  }, [linkedAttachmentsData]);

  const canSave = Boolean(selectedBo && form.BoType.trim() && form.BoTitle.trim() && form.Status.trim());
  const linkedAttachmentsEnabled = Boolean(selectedBo?.__OperationControl?.link_attachment);

  React.useEffect(() => {
    if (!selectedBo) {
      return;
    }

    setForm({
      BoType: selectedBo.BoType || '',
      BoTitle: selectedBo.BoTitle || '',
      Status: selectedBo.Status || '',
    });
  }, [selectedBo]);

  React.useEffect(() => {
    if (!error) {
      return;
    }

    setToastMessage(getBackendErrorMessage(error, 'Cannot load Business Object data.'));
    setToastVisible(true);
  }, [error]);

  const { mutate: updateBizObject, isPending: isUpdating } = useMutation(
    updateBizObjectMutationOptions({
      boId: boId || '',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['biz-objects'] });
        setToastMessage('Business Object updated successfully');
        setToastVisible(true);
      },
      onError: (updateError) => {
        setToastMessage(getBackendErrorMessage(updateError, 'Cannot update Business Object'));
        setToastVisible(true);
      },
    }),
  );

  const { mutate: deleteBizObject, isPending: isDeleting } = useMutation(
    deleteBizObjectMutationOptions({
      boId: boId || '',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['biz-objects'] });
        setToastMessage('Business Object deleted successfully');
        setNavigateAfterToast(true);
        setToastVisible(true);
      },
      onError: (deleteError) => {
        setToastMessage(getBackendErrorMessage(deleteError, 'Cannot delete Business Object'));
        setToastVisible(true);
      },
    }),
  );

  return (
    <div className="relative min-h-screen bg-slate-50">
      <ObjectPage
        mode="Default"
        hidePinButton
        onBeforeNavigate={() => undefined}
        onSelectedSectionChange={() => undefined}
        onToggleHeaderArea={() => undefined}
        titleArea={
          <ObjectPageTitle
            breadcrumbs={
              <Breadcrumbs onItemClick={() => navigate('/business-objects')}>
                <BreadcrumbsItem>Business Objects</BreadcrumbsItem>
                <BreadcrumbsItem>{isLoading ? 'Loading...' : selectedBo?.BoTitle || 'Unnamed Business Object'}</BreadcrumbsItem>
              </Breadcrumbs>
            }
            header={
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600/10 text-sky-700">
                  <Icon name="document" />
                </span>
                <div className="min-w-0">
                  <div className="text-lg font-semibold text-slate-900">
                    {isLoading ? 'Loading...' : selectedBo?.BoTitle || 'Unnamed Business Object'}
                  </div>
                  <div className="text-sm text-slate-500">BO ID {selectedBo?.BoId || '-'}</div>
                </div>
              </div>
            }
            actionsBar={
              <Toolbar design="Transparent" style={{ height: 'auto' }}>
                <ToolbarButton
                  design="Transparent"
                  icon="refresh"
                  text="Refresh"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['biz-objects'] })}
                />
              
                <ToolbarButton
                  design="Transparent"
                  icon="delete"
                  text="Delete"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={!selectedBo?.__EntityControl?.Deletable || isDeleting}
                />
              </Toolbar>
            }
            navigationBar={
              <Button accessibleName="Back" design="Transparent" icon="decline" tooltip="Back" onClick={() => navigate('/business-objects')} />
            }
          />
        }
      >
        {isLoading ? (
          <FlexBox alignItems="Center" justifyContent="Center" style={{ padding: '1rem', minHeight: '50dvh' }}>
            <BusyIndicator delay={0} active size="L" />
          </FlexBox>
        ) : selectedBo ? (
          <div className="space-y-4 p-2">
            <ObjectPageSection id="overview" titleText="Overview" aria-label="Overview">
              <div className="grid gap-4 p-2 lg:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <Label>BO Type</Label>
                    <Input
                      value={form.BoType}
                      placeholder={selectedBo.BoType || 'Enter BO type'}
                      maxlength={BO_TYPE_MAX_LENGTH}
                      onInput={(event) => setForm((prev) => ({ ...prev, BoType: event.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <select
                      className="h-[2.625rem] w-full rounded-[0.55rem] border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
                      value={form.Status}
                      onChange={(event) => setForm((prev) => ({ ...prev, Status: event.target.value }))}
                    >
                      <option value="" disabled>
                        Select status
                      </option>
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Linked Attachments</Label>
                    <div className="pt-2">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getBooleanTone(linkedAttachmentsEnabled)}`}>
                        {linkedAttachmentsEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={form.BoTitle}
                      placeholder={selectedBo.BoTitle || 'Enter BO title'}
                      onInput={(event) => setForm((prev) => ({ ...prev, BoTitle: event.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Create on</Label>
                    <Text>{formatDateTime(selectedBo.Erdat, selectedBo.Erzet)}</Text>
                  </div>
                  <div>
                    <Label>Created By</Label>
                    <Text>{selectedBo.Ernam || '-'}</Text>
                  </div>
                  <div>
                    <Label>Last Changed</Label>
                    <Text>{formatDateTime(selectedBo.Aedat, selectedBo.Aezet)}</Text>
                  </div>
                </div>
              </div>
            </ObjectPageSection>

            <ObjectPageSection id="linked-attachments" titleText="Linked Attachments" aria-label="Linked Attachments">
              <AnalyticalTable
                data={linkedAttachments}
                columns={linkedAttachmentColumns}
                loading={isLinkedAttachmentsLoading}
                selectionMode="None"
                rowHeight={44}
                visibleRows={8}
                sortable={false}
                groupable={false}
                scaleWidthMode="Smart"
                header={
                  <Toolbar design="Transparent" style={{ height: 'auto' }}>
                    <Text className="text-sm font-medium text-slate-900">
                      Linked Attachments {linkedAttachments.length ? `(${linkedAttachments.length})` : ''}
                    </Text>
                    <ToolbarSpacer />
                    <Button
                      design="Transparent"
                      icon="list"
                      onClick={() => navigate(`/business-objects/${boId}/attachments`)}
                      disabled={!boId}
                    >
                      Manage Links
                    </Button>
                  </Toolbar>
                }
                onRowClick={(event) => {
                  const item = event.detail.row.original as LinkedAttachmentRow;
                  if (!item?.FileId) return;
                  navigate(`/attachments/${item.FileId}`);
                }}
              />
            </ObjectPageSection>
          </div>
        ) : (
          <div className="p-6 text-sm text-slate-500">No business object is selected.</div>
        )}
      </ObjectPage>

      {selectedBo ? (
        <div className="fixed bottom-4 right-18 z-30">
          <Button
            design="Emphasized"
            disabled={!canSave || isUpdating}
            onClick={() => {
              if (!selectedBo) return;
              updateBizObject({
                BoType: form.BoType.trim(),
                BoTitle: form.BoTitle.trim(),
                Status: form.Status.trim(),
              });
            }}
          >
            Save
          </Button>
        </div>
      ) : null}

      <MessageBox
        open={deleteDialogOpen}
        type="Confirm"
        titleText="Delete Business Object"
        actions={['Cancel', 'OK']}
        onClose={(action) => {
          setDeleteDialogOpen(false);
          if (action === 'OK' && selectedBo?.BoId) {
            deleteBizObject();
          }
        }}
      >
        <div className="p-2 text-sm text-slate-600">
          Are you sure you want to delete this Business Object? This action cannot be undone.
        </div>
      </MessageBox>

      <Toast
        open={toastVisible}
        duration={2200}
        onClose={() => {
          setToastVisible(false);
          if (navigateAfterToast) {
            setNavigateAfterToast(false);
            navigate('/business-objects', { replace: true });
          }
        }}
      >
        {toastMessage}
      </Toast>
    </div>
  );
}
