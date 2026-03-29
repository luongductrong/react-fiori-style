import * as React from 'react';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import { DynamicPageHeader } from '@ui5/webcomponents-react/DynamicPageHeader';
import { DynamicPageTitle } from '@ui5/webcomponents-react/DynamicPageTitle';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { Title } from '@ui5/webcomponents-react/Title';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { Input } from '@ui5/webcomponents-react/Input';
import { Select } from '@ui5/webcomponents-react/Select';
import { Option } from '@ui5/webcomponents-react/Option';
import { MessageStrip } from '@ui5/webcomponents-react/MessageStrip';
import { BusyIndicator } from '@ui5/webcomponents-react/BusyIndicator';
import { Toast } from '@ui5/webcomponents-react/Toast';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { createAuthUserMutationOptions } from '@/features/auth-users/options/mutation';

type FormState = {
  Uname: string;
  Role: string;
};

const DEFAULT_FORM: FormState = {
  Uname: '',
  Role: '',
};

const ROLE_OPTIONS = ['ADMIN', 'USER'];

export function UserCreateView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = React.useState<FormState>(DEFAULT_FORM);
  const [toastVisible, setToastVisible] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  const canSubmit = form.Uname.trim().length > 0 && form.Role.trim().length > 0;

  const { mutate: createUser, isPending } = useMutation(
    createAuthUserMutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['auth-users'] });
        setToastMessage('User created successfully');
        setToastVisible(true);
        navigate('/users', { replace: true });
      },
      onError: (error) => {
        setErrorMessage(error.message || 'Cannot create user');
      },
    }),
  );

  return (
    <DynamicPage
      titleArea={
        <DynamicPageTitle
          className="p-3"
          heading={
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600/10 text-sky-700">
                <Icon name="person-placeholder" />
              </span>
              <div>
                <div className="text-lg font-semibold text-slate-900">Create User</div>
                <div className="text-sm text-slate-500">Create a new Auth user with CSRF protection</div>
              </div>
            </div>
          }
          style={{ minHeight: '0px' }}
        />
      }
      headerArea={
        <DynamicPageHeader>
          <div className="p-4">
            <Toolbar className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm">
              <Title level="H2">New Auth User</Title>
              <ToolbarSpacer />
              <ToolbarButton design="Transparent" text="Back to list" onClick={() => navigate('/users')} />
            </Toolbar>
          </div>
        </DynamicPageHeader>
      }
      style={{
        height: '100dvh',
        overflow: 'hidden',
        position: 'relative',
        background: 'linear-gradient(180deg,rgba(242,247,251,0.98) 0%,rgba(231,240,248,0.98) 100%)',
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col gap-4 p-4">
        {errorMessage ? (
          <MessageStrip design="Negative" hideCloseButton>
            {errorMessage}
          </MessageStrip>
        ) : null}

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">User name</span>
              <Input
                placeholder="Enter user name"
                value={form.Uname}
                onInput={(event) => setForm((prev) => ({ ...prev, Uname: event.target.value }))}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">Role</span>
              <Select
                value={form.Role}
                onChange={(event) => setForm((prev) => ({ ...prev, Role: event.detail.selectedOption?.value || '' }))}
              >
                <Option value="">Select role</Option>
                {ROLE_OPTIONS.map((role) => (
                  <Option key={role} value={role}>
                    {role}
                  </Option>
                ))}
              </Select>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <ToolbarButton
              design="Emphasized"
              text="Create"
              disabled={!canSubmit || isPending}
              onClick={() => {
                setErrorMessage('');
                createUser({
                  Uname: form.Uname.trim(),
                  Role: form.Role.trim(),
                });
              }}
            />
            <ToolbarButton design="Transparent" text="Cancel" onClick={() => navigate('/users')} disabled={isPending} />
          </div>
        </div>
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

      <Toast open={toastVisible} duration={2000} onClose={() => setToastVisible(false)}>
        {toastMessage}
      </Toast>
    </DynamicPage>
  );
}
