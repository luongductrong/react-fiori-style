import '@/index.css';
import { StrictMode } from 'react';
import '@ui5/webcomponents/dist/Assets.js';
import { Toaster } from '@/components/toast';
import { createRoot } from 'react-dom/client';
import { AppLayout } from '@/components/layouts/app-layout';
import '@ui5/webcomponents-react/dist/json-imports/i18n.js';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { PrivateRoute } from '@/components/layouts/private-route';
import { HashRouter, Route, Routes, Navigate } from 'react-router';
import { ErrorsMessageBox } from '@/components/errors-message-box';
import { QueryProvider } from '@/context-providers/query-provider';
import { ThemeProvider } from '@ui5/webcomponents-react/ThemeProvider';
import { AttachmentListView, AttachmentDetailView, NotFoundView } from '@/views';
import { VersionDetailView, ConfigFileListView, DeletedAttachmentListView } from '@/views';
import { BoDetailView, BoListView, UserListView, LaunchpadView, DashboardView } from '@/views';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <Toaster />
        <ErrorsMessageBox />
        <HashRouter>
          <Routes>
            <Route element={<AppLayout />}>
              {/* Launchpad */}
              <Route path="/launchpad" element={<LaunchpadView />} />
              {/* Dashboard */}
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
                <Route path="deleted-attachments" element={<DeletedAttachmentListView />} />
              </Route>
              {/* Business Objects */}
              <Route path="/business-objects">
                <Route index element={<BoListView />} />
                <Route path=":id" element={<BoDetailView />} />
              </Route>
              {/* Attachments */}
              <Route path="/attachments">
                <Route index element={<AttachmentListView />} />
                <Route path=":id">
                  <Route index element={<AttachmentDetailView />} />
                  <Route path="versions/:versionNo" element={<VersionDetailView />} />
                </Route>
              </Route>
              {/* Redirect */}
              <Route path="/" element={<Navigate to="/launchpad" replace />} />
              {/* Not Found */}
              <Route path="*" element={<NotFoundView />} />
            </Route>
          </Routes>
        </HashRouter>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>,
);
