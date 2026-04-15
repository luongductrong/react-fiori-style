import '@/index.css';
import { StrictMode } from 'react';
import '@ui5/webcomponents/dist/Assets.js';
import { Toaster } from '@/components/toast';
import { createRoot } from 'react-dom/client';
import { ToastDemoView } from '@/views/toast-demo';
import { ShellHomeView, AdminHomeView } from '@/views';
import '@ui5/webcomponents-react/dist/json-imports/i18n.js';
import { AuthUserLoader } from '@/features/auth-users/components';
import { ErrorsMessageBox } from '@/components/errors-message-box';
import { QueryProvider } from '@/context-providers/query-provider';
import { HashRouter, Navigate, Route, Routes } from 'react-router';
import { ThemeProvider } from '@ui5/webcomponents-react/ThemeProvider';
import { BoDetailView, BoListView, UserCreateView, UserListView } from '@/views';
import { AttachmentListView, AttachmentDetailView, VersionDetailView } from '@/views';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <Toaster />
        <AuthUserLoader />
        <ErrorsMessageBox />
        {/* TODO: Move to Layout */}
        <HashRouter>
          <Routes>
            <Route path="/demo" element={<ToastDemoView />} /> {/* TODO: Remove */}
            <Route path="/shell-home" element={<ShellHomeView />} />
            <Route path="/admin" element={<AdminHomeView />} />
            {/*  */}
            <Route path="/business-objects" element={<BoListView />} />
            <Route path="/business-objects/:id" element={<BoDetailView />} />
            {/*  */}
            <Route path="/users" element={<UserListView />} />
            <Route path="/UserList" element={<Navigate replace to="/users" />} />
            <Route path="/users/create" element={<UserCreateView />} />
            <Route path="/UserCreate" element={<Navigate replace to="/users/create" />} />
            <Route path="/configuration-files" element={<Navigate replace to="/admin" />} />
            <Route path="/config-files" element={<Navigate replace to="/admin" />} />
            {/* Attachments */}
            <Route path="/attachments" element={<AttachmentListView />} />
            <Route path="/attachments/:id" element={<AttachmentDetailView />} />
            <Route path="/attachments/:id/versions/:versionNo" element={<VersionDetailView />} />
            <Route path="*" element={<Navigate replace to="/shell-home" />} />
            {/* TODO: Handle 404 page */}
          </Routes>
        </HashRouter>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>,
);
