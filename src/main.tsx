import "@/index.css";
import { App } from "@/App";
import { StrictMode } from "react";
import "@ui5/webcomponents/dist/Assets.js";
import { createRoot } from "react-dom/client";
import "@ui5/webcomponents-react/dist/json-imports/i18n.js";
import { QueryProvider } from "@/context-providers/query-provider";
import { HashRouter, Navigate, Route, Routes } from "react-router";
import { ThemeProvider } from "@ui5/webcomponents-react/ThemeProvider";
import { AttachmentsView } from "@/features/attachments/components/attachments-view";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route
              path="/Attachments"
              element={<AttachmentsView />}
              caseSensitive
            />
            <Route path="*" element={<Navigate replace to="/Attachments" />} />
          </Routes>
        </HashRouter>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>,
);
