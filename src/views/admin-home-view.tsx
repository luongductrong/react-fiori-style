import { useNavigate } from 'react-router';
import { Tab } from '@ui5/webcomponents-react';
import { TabContainer } from '@ui5/webcomponents-react/TabContainer';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import '@ui5/webcomponents-icons/person-placeholder.js';
import '@ui5/webcomponents-icons/document.js';
import '@ui5/webcomponents-icons/log.js';
import { UserListView } from './user-list';
import { ConfigFileView } from './config-file-view';

export function AdminHomeView() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen bg-[linear-gradient(180deg,rgba(242,247,251,0.98)_0%,rgba(231,240,248,0.98)_100%)]">
      <div className="absolute top-4 left-4 z-20">
        <ToolbarButton design="Transparent" icon="home" text="Home" onClick={() => navigate('/shell-home')} />
      </div>

      <section className="relative z-10 flex min-h-screen flex-col px-4 pb-6 pt-20 sm:px-8">
        <div className="mx-auto flex w-full max-w-384 flex-1 flex-col gap-4">
          <TabContainer
            className="min-h-0 flex-1 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 shadow-[0_16px_40px_rgba(84,104,130,0.08)] backdrop-blur-sm"
            tabLayout="Standard"
          >
            <Tab icon="person-placeholder" text="Users" selected>
              <UserListView />
            </Tab>
            <Tab icon="document" text="Configuration Files">
              <ConfigFileView embedded />
            </Tab>
          </TabContainer>
        </div>
      </section>
    </main>
  );
}
