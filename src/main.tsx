import '@/index.css';
import { StrictMode } from 'react';
import '@ui5/webcomponents/dist/Assets.js';
import { Toaster } from '@/components/toast';
import { createRoot } from 'react-dom/client';
import { ToastDemoView } from '@/views/toast-demo';
import '@ui5/webcomponents-react/dist/json-imports/i18n.js';
import { QueryProvider } from '@/context-providers/query-provider';
import { HashRouter, Navigate, Route, Routes } from 'react-router';
import { ThemeProvider } from '@ui5/webcomponents-react/ThemeProvider';
import { AttachmentsView, VersionDetailView, UploadVersionView } from '@/views';
import { BoDetailView, BoListView, UserCreateView, UserListView } from '@/views';
import { AttachmentNewView, AttachmentsDetailView, ShellHomeView, AdminHomeView } from '@/views';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <Toaster />
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
            <Route path="/attachments" element={<AttachmentsView />} />
            <Route path="/attachments/new" element={<AttachmentNewView />} />
            <Route path="/attachments/:id" element={<AttachmentsDetailView />} />
            <Route path="/attachments/:id/upload" element={<UploadVersionView />} />
            <Route path="/attachments/:id/versions/:versionNo" element={<VersionDetailView />} />
            <Route path="*" element={<Navigate replace to="/shell-home" />} />
            {/* TODO: Handle 404 page */}
          </Routes>
        </HashRouter>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>,
);
