import '@/index.css';
import { StrictMode } from 'react';
import '@ui5/webcomponents/dist/Assets.js';
import { Toaster } from '@/components/toast';
import { createRoot } from 'react-dom/client';
import '@ui5/webcomponents-react/dist/json-imports/i18n.js';
import { PrivateRoute } from '@/components/layouts/private-route';
import { ErrorsMessageBox } from '@/components/errors-message-box';
import { QueryProvider } from '@/context-providers/query-provider';
import { HashRouter, Navigate, Route, Routes } from 'react-router';
import { ThemeProvider } from '@ui5/webcomponents-react/ThemeProvider';
import { AttachmentListView, AttachmentDetailView, VersionDetailView, ConfigFileListView } from '@/views';
import { BoDetailView, BoListView, UserListView, ShellHomeView, AdminHomeView, DashboardView } from '@/views';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <Toaster />
        <ErrorsMessageBox />
        {/* TODO: Move to Layout */}
        <HashRouter>
          <Routes>
            <Route path="/shell-home" element={<ShellHomeView />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminHomeView />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardView />
                </PrivateRoute>
              }
            />
            {/*  */}
            <Route path="/business-objects" element={<BoListView />} />
            <Route path="/business-objects/:id" element={<BoDetailView />} />
            {/*  */}
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <UserListView />
                </PrivateRoute>
              }
            />
            <Route
              path="/configurations"
              element={
                <PrivateRoute>
                  <ConfigFileListView />
                </PrivateRoute>
              }
            />
            {/* Attachments */}
            <Route path="/attachments" element={<AttachmentListView />} />
            <Route path="/attachments/:id" element={<AttachmentDetailView />} />
            <Route path="/attachments/:id/versions/:versionNo" element={<VersionDetailView />} />
            {/* TODO: Handle 404 page */}
            <Route path="*" element={<Navigate replace to="/shell-home" />} />
          </Routes>
        </HashRouter>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>,
);
