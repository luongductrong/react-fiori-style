import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ObjectPage } from '@ui5/webcomponents-react/ObjectPage';
import { ObjectPageHeader } from '@ui5/webcomponents-react/ObjectPageHeader';
import { ObjectPageTitle } from '@ui5/webcomponents-react/ObjectPageTitle';
import { Breadcrumbs } from '@ui5/webcomponents-react/Breadcrumbs';
import { BreadcrumbsItem } from '@ui5/webcomponents-react/BreadcrumbsItem';
import { BusyIndicator } from '@ui5/webcomponents-react/BusyIndicator';
import { Button } from '@ui5/webcomponents-react/Button';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { Input } from '@ui5/webcomponents-react/Input';
import { Label } from '@ui5/webcomponents-react/Label';
import { List } from '@ui5/webcomponents-react/List';
import { ListItemStandard } from '@ui5/webcomponents-react/ListItemStandard';
import { Text } from '@ui5/webcomponents-react/Text';
import { Toast } from '@ui5/webcomponents-react/Toast';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { MessageBox } from '@ui5/webcomponents-react/MessageBox';
import { TabContainer } from '@ui5/webcomponents-react/TabContainer';
import { Tab } from '@ui5/webcomponents-react/Tab';
import '@ui5/webcomponents-icons/decline.js';
import '@ui5/webcomponents-icons/document.js';
import '@ui5/webcomponents-icons/edit.js';
import '@ui5/webcomponents-icons/delete.js';
import '@ui5/webcomponents-icons/list.js';
import '@ui5/webcomponents-icons/refresh.js';
import { getBizObjectsQueryOptions } from '@/features/biz-object/options/query';
import { deleteBizObjectMutationOptions, updateBizObjectMutationOptions } from '@/features/biz-object/options/mutation';
import type { BizObjectItem } from '@/features/biz-object/types';

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

function getStatusTone(status?: string) {
  const normalized = (status || '').toUpperCase();

  if (normalized === 'NEW') return 'bg-emerald-500/15 text-emerald-700 border-emerald-500/25';
  if (normalized === 'APPROVED' || normalized === 'ACTIVE') {
    return 'bg-sky-500/15 text-sky-700 border-sky-500/25';
  }
  if (normalized === 'REJECTED' || normalized === 'ERROR') {
    return 'bg-rose-500/15 text-rose-700 border-rose-500/25';
  }

  return 'bg-slate-500/15 text-slate-700 border-slate-500/25';
}

function getBooleanTone(value: boolean) {
  return value
    ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/25'
    : 'bg-slate-500/15 text-slate-700 border-slate-500/25';
}

const sectionCardClass = 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm';

export function BoDetailView() {
  const { boId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = React.useState(false);
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

  const canSave = Boolean(selectedBo && form.BoType.trim() && form.BoTitle.trim() && form.Status.trim());
  const boMessages = selectedBo?.SAP__Messages ?? [];
  const linkedAttachmentsEnabled = Boolean(selectedBo?.__OperationControl?.link_attachment);

  React.useEffect(() => {
    if (!isEditMode || !selectedBo) {
      return;
    }

    setForm({
      BoType: selectedBo.BoType || '',
      BoTitle: selectedBo.BoTitle || '',
      Status: selectedBo.Status || '',
    });
  }, [isEditMode, selectedBo]);

  React.useEffect(() => {
    if (!error) {
      return;
    }

    setToastMessage(error instanceof Error ? error.message : 'Cannot load Business Object data.');
    setToastVisible(true);
  }, [error]);

  const { mutate: updateBizObject, isPending: isUpdating } = useMutation(
    updateBizObjectMutationOptions({
      boId: boId || '',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['biz-objects'] });
        setToastMessage('Business Object updated successfully');
        setToastVisible(true);
        setIsEditMode(false);
      },
      onError: (updateError) => {
        setToastMessage(updateError.message || 'Cannot update Business Object');
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
        setToastMessage(deleteError.message || 'Cannot delete Business Object');
        setToastVisible(true);
      },
    }),
  );

  return (
    <div className="relative">
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
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600/10 text-sky-700">
                  <Icon name="document" />
                </span>
                <div>
                  <div className="text-lg font-semibold text-slate-900">{isLoading ? 'Loading...' : selectedBo?.BoTitle || 'Unnamed Business Object'}</div>
                  <div className="text-sm text-slate-500">
                    BO ID {selectedBo?.BoId } 
                  </div>
                </div>
              </div>
            }
           
            actionsBar={
              <Toolbar design="Transparent" style={{ height: 'auto' }}>
                {!isEditMode ? (
                  <>
                    <ToolbarButton
                      design="Transparent"
                      icon="refresh"
                      text="Refresh"
                      onClick={() => queryClient.invalidateQueries({ queryKey: ['biz-objects'] })}
                    />
                    <ToolbarButton
                      design="Emphasized"
                      icon="edit"
                      text="Edit"
                      onClick={() => setIsEditMode(true)}
                      disabled={!selectedBo?.__EntityControl?.Updatable}
                    />
                    <ToolbarButton
                      design="Transparent"
                      icon="list"
                      text="Linked Attachments"
                      onClick={() => navigate(`/business-objects/${boId}/attachments`)}
                      disabled={!boId}
                    />
                    <ToolbarButton
                      design="Transparent"
                      icon="delete"
                      text="Delete"
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={!selectedBo?.__EntityControl?.Deletable || isDeleting}
                    />
                  </>
                ) : (
                  <>
                    <ToolbarButton
                      design="Emphasized"
                      text="Save"
                      onClick={() => {
                        if (!selectedBo) return;
                        updateBizObject({
                          BoType: form.BoType.trim(),
                          BoTitle: form.BoTitle.trim(),
                          Status: form.Status.trim(),
                        });
                      }}
                      disabled={!canSave || isUpdating}
                    />
                    <ToolbarButton design="Transparent" text="Cancel" onClick={() => setIsEditMode(false)} disabled={isUpdating} />
                  </>
                )}
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
          <div className="p-2">
            <TabContainer headerBackgroundDesign="Solid" tabLayout="Standard" overflowMode="End">
              <Tab text="Overview"selected>
                <div className="space-y-4 p-2">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className={sectionCardClass}>
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Type</div>
                      <div className="mt-2 text-lg font-semibold text-slate-900">{selectedBo.BoType || '-'}</div>
                    </div>
                    <div className={sectionCardClass}>
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</div>
                      <div className="mt-2 text-lg font-semibold text-slate-900">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusTone(selectedBo.Status)}`}>
                          {selectedBo.Status || '-'}
                        </span>
                      </div>
                    </div>
                    <div className={sectionCardClass}>
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Attachment Link</div>
                      <div className="mt-2 text-lg font-semibold text-slate-900">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getBooleanTone(linkedAttachmentsEnabled)}`}>
                          {linkedAttachmentsEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className={sectionCardClass}>
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Created</div>
                      <div className="mt-2 text-sm text-slate-700">{formatDateTime(selectedBo.Erdat, selectedBo.Erzet)}</div>
                      <div className="mt-1 text-sm text-slate-700">By {selectedBo.Ernam || '-'}</div>
                    </div>
                    <div className={sectionCardClass}>
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Changed</div>
                      <div className="mt-2 text-sm text-slate-700">{formatDateTime(selectedBo.Aedat, selectedBo.Aezet)}</div>
                      <div className="mt-1 text-sm text-slate-700">By {selectedBo.Aenam || '-'}</div>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab text="Edit Details" >
                <div className="p-2">
                  {isEditMode ? (
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="flex flex-col gap-1.5">
                        <Label>BoType</Label>
                        <Input
                          value={form.BoType}
                          maxlength={BO_TYPE_MAX_LENGTH}
                          placeholder="Enter BO type"
                          onInput={(event) =>
                            setForm((prev) => ({ ...prev, BoType: event.target.value.slice(0, BO_TYPE_MAX_LENGTH) }))
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <Label>BoTitle</Label>
                        <Input
                          value={form.BoTitle}
                          placeholder="Enter BO title"
                          onInput={(event) => setForm((prev) => ({ ...prev, BoTitle: event.target.value }))}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label>Status</Label>
                        <select
                          className="h-[2.625rem] rounded-[0.55rem] border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
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
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      Click <span className="font-semibold text-slate-900">Edit</span> in the header to modify BoType, BoTitle, or Status.
                    </div>
                  )}
                </div>
              </Tab>

              <Tab text="Permissions" >
                <div className="grid gap-4 p-2 md:grid-cols-3">
                  <div className={sectionCardClass}>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Editable</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getBooleanTone(Boolean(selectedBo.__EntityControl?.Updatable))}`}>
                        {selectedBo.__EntityControl?.Updatable ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  <div className={sectionCardClass}>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Deletable</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getBooleanTone(Boolean(selectedBo.__EntityControl?.Deletable))}`}>
                        {selectedBo.__EntityControl?.Deletable ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  <div className={sectionCardClass}>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Messages</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{boMessages.length}</div>
                  </div>
                </div>
              </Tab>
            </TabContainer>
          </div>
        ) : (
          <div className="p-6 text-sm text-slate-500">No business object is selected.</div>
        )}
      </ObjectPage>

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
