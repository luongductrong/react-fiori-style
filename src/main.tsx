import '@/index.css';
import { StrictMode } from 'react';
import '@ui5/webcomponents/dist/Assets.js';
import { Toaster } from '@/components/toast';
import { createRoot } from 'react-dom/client';
import { AppLayout } from '@/components/layouts/app-layout';
import '@ui5/webcomponents-react/dist/json-imports/i18n.js';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { PrivateRoute } from '@/components/layouts/private-route';
import { ErrorsMessageBox } from '@/components/errors-message-box';
import { QueryProvider } from '@/context-providers/query-provider';
import { HashRouter, Navigate, Route, Routes } from 'react-router';
import { ThemeProvider } from '@ui5/webcomponents-react/ThemeProvider';
import { BoDetailView, BoListView, UserListView, LaunchpadView, DashboardView } from '@/views';
import { AttachmentListView, AttachmentDetailView, VersionDetailView, ConfigFileListView } from '@/views';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <Toaster />
        <ErrorsMessageBox />
        <HashRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/launchpad" element={<LaunchpadView />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <Navigate replace to="/dashboard" />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <AdminLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<DashboardView />} />
                <Route path="users" element={<UserListView />} />
                <Route path="configurations" element={<ConfigFileListView />} />
              </Route>
              {/*  */}
              <Route path="/business-objects" element={<BoListView />} />
              <Route path="/business-objects/:id" element={<BoDetailView />} />
              {/*  */}
              <Route path="/users" element={<Navigate replace to="/dashboard/users" />} />
              <Route path="/configurations" element={<Navigate replace to="/dashboard/configurations" />} />
              {/* Attachments */}
              <Route path="/attachments" element={<AttachmentListView />} />
              <Route path="/attachments/:id" element={<AttachmentDetailView />} />
              <Route path="/attachments/:id/versions/:versionNo" element={<VersionDetailView />} />
              {/* TODO: Handle 404 page */}
              <Route path="*" element={<Navigate replace to="/launchpad" />} />
            </Route>
          </Routes>
        </HashRouter>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>,
);
