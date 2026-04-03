import * as React from 'react';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import { DynamicPageHeader } from '@ui5/webcomponents-react/DynamicPageHeader';
import { DynamicPageTitle } from '@ui5/webcomponents-react/DynamicPageTitle';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { Input } from '@ui5/webcomponents-react/Input';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { Label } from '@ui5/webcomponents-react/Label';
import { Toast } from '@ui5/webcomponents-react/Toast';
import { BusyIndicator } from '@ui5/webcomponents-react/BusyIndicator';
import { ObjectPage } from '@ui5/webcomponents-react/ObjectPage';
import { ObjectPageHeader } from '@ui5/webcomponents-react/ObjectPageHeader';
import { ObjectPageSection } from '@ui5/webcomponents-react/ObjectPageSection';
import { Icon } from '@ui5/webcomponents-react/Icon';
import '@ui5/webcomponents-icons/decline.js';
import '@ui5/webcomponents-icons/document.js';
import { createBizObjectMutationOptions } from '@/features/biz-object/options/mutation';
import { getBackendErrorMessage } from '@/libs/error-message';

type FormState = {
  BoType: string;
  BoTitle: string;
  Status: string;
};

const DEFAULT_FORM: FormState = {
  BoType: '',
  BoTitle: '',
  Status: '',
};

const STATUS_OPTIONS = ['NEW', 'APPROVED', 'ACTIVE', 'REJECTED', 'ERROR'];
const BO_TYPE_MAX_LENGTH = 10;

export function BoCreateView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = React.useState<FormState>(DEFAULT_FORM);
  const [toastVisible, setToastVisible] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [navigateAfterToast, setNavigateAfterToast] = React.useState(false);

  const { mutate: createBizObject, isPending } = useMutation(
    createBizObjectMutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['biz-objects'] });
        setToastMessage('Business Object created successfully');
        setNavigateAfterToast(true);
        setToastVisible(true);
      },
      onError: (error) => {
        setNavigateAfterToast(false);
        setToastMessage(getBackendErrorMessage(error, 'Cannot create Business Object'));
        setToastVisible(true);
      },
    }),
  );

  const canSubmit = form.BoType.trim() && form.BoTitle.trim() && form.Status.trim();

  return (
    <DynamicPage
      headerArea={
        <DynamicPageHeader>
          <div className="p-4"></div>
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
                <div className="text-lg font-semibold text-slate-900">Create Business Object</div>
                <div className="text-sm text-slate-500">Create a BizObject record in the BIZ service</div>
              </div>
            </div>
          }
          style={{ minHeight: '0px' }}
        />
      }
      style={{
        height: '100dvh',
        overflow: 'hidden',
        position: 'relative',
        background: 'linear-gradient(180deg,rgba(243,248,252,0.95) 0%,rgba(231,240,248,0.95) 100%)',
      }}
    >
      <div className="mx-auto w-full max-w-5xl p-4">
        <ObjectPage
          mode="Default"
          hidePinButton
          onBeforeNavigate={() => undefined}
          onSelectedSectionChange={() => undefined}
          onToggleHeaderArea={() => undefined}
          headerArea={
            <ObjectPageHeader>
              <FlexBox alignItems="End" justifyContent="Start" wrap="Wrap" className="p-2" style={{ gap: '1rem' }}>
                <FlexBox direction="Column" style={{ minWidth: '18rem', flex: 1 }}>
                  <Label>BO Type</Label>
                  <Input
                    value={form.BoType}
                    maxlength={BO_TYPE_MAX_LENGTH}
                    placeholder="Enter BO type"
                    onInput={(event) =>
                      setForm((prev) => ({ ...prev, BoType: event.target.value.slice(0, BO_TYPE_MAX_LENGTH) }))
                    }
                  />
                </FlexBox>

                <FlexBox direction="Column" style={{ minWidth: '24rem', flex: 2 }}>
                  <Label>BO Title</Label>
                  <Input
                    value={form.BoTitle}
                    placeholder="Enter business object title"
                    onInput={(event) => setForm((prev) => ({ ...prev, BoTitle: event.target.value }))}
                  />
                </FlexBox>

                <FlexBox direction="Column" style={{ minWidth: '14rem' }}>
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
                </FlexBox>
              </FlexBox>
            </ObjectPageHeader>
          }
          titleArea={
            <div className="rounded-2xl border border-white/80 bg-white/90 shadow-sm">
              <Toolbar design="Transparent" className="px-4 py-3">
                <ToolbarButton
                  design="Emphasized"
                  text="Create"
                  onClick={() => {
                    createBizObject({
                      BoType: form.BoType.trim(),
                      BoTitle: form.BoTitle.trim(),
                      Status: form.Status.trim(),
                    });
                  }}
                  disabled={isPending || !canSubmit}
                />
                <ToolbarButton
                  design="Transparent"
                  text="Cancel"
                  onClick={() => navigate('/business-objects')}
                  disabled={isPending}
                />
                <ToolbarSpacer />
                <ToolbarButton
                  design="Transparent"
                  icon="decline"
                  text="Back to list"
                  onClick={() => navigate('/business-objects')}
                />
              </Toolbar>
            </div>
          }
        >
          <ObjectPageSection aria-label="Summary" id="summary" titleText="Summary">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">BoType</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{form.BoType || '-'}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">BoTitle</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{form.BoTitle || '-'}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{form.Status || '-'}</div>
              </div>
            </div>
          </ObjectPageSection>
        </ObjectPage>
      </div>

      {isPending ? (
        <FlexBox
          alignItems="Center"
          justifyContent="Center"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <BusyIndicator delay={0} active size="L" />
        </FlexBox>
      ) : null}

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
    </DynamicPage>
  );
}
