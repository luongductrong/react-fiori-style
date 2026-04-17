import '@ui5/webcomponents-icons/log.js';
import { ODATA_BASE_URL } from '@/app-env';
import { useNavigate } from 'react-router';
import '@ui5/webcomponents-icons/attachment.js';
import { Card } from '@ui5/webcomponents-react/Card';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { Title } from '@ui5/webcomponents-react/Title';
import '@ui5/webcomponents-icons/person-placeholder.js';
import { Button } from '@ui5/webcomponents-react/Button';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { BusyIndicator } from '@/components/busy-indicator';
import '@ui5/webcomponents-icons/business-objects-mobile.js';
import { useCurrentAuthUser } from '@/features/auth-users/hooks';
import { CardHeader } from '@ui5/webcomponents-react/CardHeader';

export function ShellHomeView() {
  const navigate = useNavigate();
  const { data: currentAuthUser, isPending: isAuthPending } = useCurrentAuthUser();
  const isAdmin = currentAuthUser?.isAdmin ?? false;

  if (isAuthPending) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <BusyIndicator type="loading" />
      </div>
    );
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[linear-gradient(180deg,#d9eafb_0%,#dceaf7_44%,#e1ecf6_100%)] text-[#16314d]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.16),transparent_35%),linear-gradient(320deg,rgba(255,255,255,0.14),transparent_42%)] opacity-95" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_0_14%,transparent_14%_100%)]" />
        <div className="absolute -left-32 -top-8 h-176 w-176 rotate-24 rounded-[42%_58%_51%_49%/46%_39%_61%_54%] bg-white/20" />
        <div className="absolute left-1/2 -top-88 h-208 w-208 -translate-x-1/2 rounded-[54%_46%_39%_61%/40%_55%_45%_60%] bg-white/20" />
        <div className="absolute -bottom-8 -right-32 h-136 w-3xl rotate-28 rounded-[60%_40%_47%_53%/38%_48%_52%_62%] bg-white/20" />
      </div>
      <header
        className="absolute left-[1.1rem] top-[0.95rem] z-10 inline-flex items-center gap-[0.55rem]"
        aria-label="System brand"
      >
        <div className="hidden flex-col leading-none text-[#16507b] sm:flex">
          <strong className="text-[0.74rem] font-bold">SAP Digital</strong>
          <span className="text-[0.66rem] opacity-80">Gateway Access</span>
        </div>
      </header>
      <div className="absolute right-[1.1rem] top-[0.95rem] z-10" aria-label="System brand">
        <a href={`${ODATA_BASE_URL}/sap/public/bc/icf/logoff?sap-client=324`}>
          <Button design="Transparent" icon="log">
            Logout
          </Button>
        </a>
      </div>
      <FlexBox justifyContent="Center" alignItems="Center" className="h-screen w-screen p-8">
        <FlexBox direction="Column" alignItems="Center" justifyContent="Center" style={{ gap: '1rem' }}>
          <Title level="H1">Select an application</Title>
          <Card
            header={
              <CardHeader
                interactive
                onClick={() => navigate('/attachments')}
                avatar={<Icon name="attachment" />}
                subtitleText="File Attachments Management"
                titleText="File Attachments"
              />
            }
          />
          <Card
            header={
              <CardHeader
                interactive
                onClick={() => navigate('/business-objects')}
                avatar={<Icon name="business-objects-mobile" />}
                subtitleText="Business Objects Management"
                titleText="Business Objects"
              />
            }
          />
          {isAdmin && (
            <Card
              header={
                <CardHeader
                  interactive
                  onClick={() => navigate('/admin')}
                  avatar={<Icon name="person-placeholder" />}
                  subtitleText="Users Management and Configuration Files"
                  titleText="Admin"
                />
              }
            />
          )}
        </FlexBox>
      </FlexBox>
      <footer className="absolute bottom-[0.95rem] left-4 right-4 z-10 text-center text-[0.7rem] text-muted-foreground sm:left-auto sm:right-5 sm:text-left">
        Copyright (c) {new Date().getFullYear()} SAP SE All Rights Reserved.
      </footer>
    </main>
  );
}
// TODO: Remove file
