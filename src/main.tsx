import '@/index.css';
import { StrictMode } from 'react';
import '@ui5/webcomponents/dist/Assets.js';
import { createRoot } from 'react-dom/client';
import '@ui5/webcomponents-react/dist/json-imports/i18n.js';
import { QueryProvider } from '@/context-providers/query-provider';
import { HashRouter, Navigate, Route, Routes } from 'react-router';
import { AttachmentNewView, AttachmentsDetailView, BoCreateView, BoView, UserCreateView, UserListView } from '@/views';
import { ThemeProvider } from '@ui5/webcomponents-react/ThemeProvider';
import { AttachmentsView, VersionDetailView, UploadVersionView, HomeView } from '@/views';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/Attachments" element={<AttachmentsView />} />
            <Route path="/BO" element={<BoView />} />
            <Route path="/BizObject" element={<BoView />} />
            <Route path="/Users" element={<UserListView />} />
            <Route path="/UserList" element={<UserListView />} />
            <Route path="/Users/Create" element={<UserCreateView />} />
            <Route path="/UserCreate" element={<UserCreateView />} />
            <Route path="/BO/Create" element={<BoCreateView />} />
            <Route path="/Attachments/New" element={<AttachmentNewView />} />
            <Route path="/Attachments/:id" element={<AttachmentsDetailView />} />
            <Route path="/Attachments/:id/Upload" element={<UploadVersionView />} />
            <Route path="/Attachments/:id/Versions/:versionNo" element={<VersionDetailView />} />
            <Route path="*" element={<Navigate replace to="/Attachments" />} />
          </Routes>
        </HashRouter>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>,
);
