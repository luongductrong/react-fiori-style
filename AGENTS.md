# AGENTS.md

## 1. Project Snapshot

This repository is a `React + TypeScript + Vite` frontend for SAP attachment management.

It is no longer just a single demo screen. The current application already contains routed flows for:

- browsing attachments
- switching between table and grid list views
- creating a new attachment
- viewing attachment details
- uploading a new version
- viewing a specific version
- reviewing audit and version history

There is also a styled landing/login-like screen at `/`, but it is currently only a UI shell and is not wired to backend authentication yet.

Agents should treat this repo as an active application with an attachment domain module already in place, not as an empty scaffold.

## 2. Tech Stack

- UI runtime: `React 18`, `ReactDOM 18`
- Language: `TypeScript` with `strict` mode
- Build tool: `Vite`
- Styling: `Tailwind CSS v4`
- SAP UI layer: `@ui5/webcomponents`, `@ui5/webcomponents-fiori`, `@ui5/webcomponents-react`
- Routing: `react-router` with `HashRouter`
- Server state: `@tanstack/react-query`
- Local UI state: `zustand`
- Forms: `react-hook-form`
- HTTP client: `axios` + `qs`
- Deployment: `@ui5/cli`, `@sap/ux-ui5-tooling`, `fiori deploy`

## 3. Current App Architecture

The current app is organized around route-level views and an attachment feature module.

Important files and folders:

- `src/main.tsx`
  React entry point. Imports UI5 assets, wraps the app with `ThemeProvider` and `QueryProvider`, and defines the router directly.
  There is no central `src/App.tsx` in the current app flow.

- `src/views/`
  Route-level pages:
  - `home-view.tsx`
  - `attachments-view.tsx`
  - `attachment-new-view.tsx`
  - `attachments-detail-view.tsx`
  - `upload-version-view.tsx`
  - `version-detail-view.tsx`

- `src/features/attachments/`
  Main domain module for attachment logic. Contains:
  - `types.ts` for OData response/payload types
  - `constants.ts` for attachment endpoints
  - `options/query.ts` for React Query query factories
  - `options/mutation.ts` for React Query mutation factories
  - `components/` for attachment UI pieces
  - `helpers.ts` and `hooks/use-file-preview.ts` for file preview/download behavior

- `src/context-providers/query-provider.tsx`
  Creates the `QueryClient` and loads React Query Devtools only in development.

- `src/libs/axios-instance.ts`
  Shared Axios client. Handles base URL, query param serialization, response normalization, and CSRF token capture from response headers.

- `src/libs/helpers.ts`
  CSRF token helpers used by mutations.

- `src/stores/app-stores.ts`
  Zustand store for app-level UI state. Right now it stores the attachment list `viewMode` (`table` or `grid`).

- `src/app-env.ts`
  Environment resolution for dev/prod and OData origin selection.

- `src/app-constant.ts`
  Central service root constants for `ATTACHMENT`, `AUTH`, and `BIZ`.

- `metadata.xml`
  Backend metadata reference. Use this before adding fields, navigation paths, or actions.

- `ui5-deploy.yaml`
  ABAP deployment configuration.

## 4. Current Routes

Routes are defined in `src/main.tsx`.

- `/`
  `HomeView`
  A styled login-like screen built with Tailwind and `react-hook-form`. It currently validates inputs and shows a toast only.

- `/Attachments`
  `AttachmentsView`
  Main attachment list page. Uses React Query to load attachments and supports table/grid presentation.

- `/Attachments/New`
  `AttachmentNewView`
  Creates a new attachment.

- `/Attachments/:id`
  `AttachmentsDetailView`
  Shows attachment metadata, preview, version list, audit list, title editing, deletion, and current-version download.

- `/Attachments/:id/Upload`
  `UploadVersionView`
  Uploads a new attachment version.

- `/Attachments/:id/Versions/:versionNo`
  `VersionDetailView`
  Displays version details, preview, download, and rollback/set-current-version behavior.

- `*`
  Redirects to `/Attachments`

## 5. Environment and API Rules

Environment behavior is split between `src/app-env.ts`, `src/app-constant.ts`, and `vite.config.ts`.

- `VITE_ODATA_ORIGIN` is required.
- In development, the frontend calls `/api` and Vite proxies that path to `VITE_ODATA_ORIGIN`.
- In production, the frontend calls `VITE_ODATA_ORIGIN` directly.
- `base: "./"` in `vite.config.ts` is important for SAP deployment and should not be changed casually.
- `HashRouter` is intentional and helps avoid server-side route rewrite issues in the SAP hosting environment.

Current OData service roots are:

- `ATTACHMENT`
- `AUTH`
- `BIZ`

At the moment, only the attachment service is actively used in the frontend code.

Attachment entity/action references verified from `metadata.xml`:

- Entity sets:
  - `Attachments`
  - `AttachmentVersions`
  - `Audit`
- Bound actions:
  - `reactivate`
  - `deactivate`
  - `link_to_bo`
  - `download_version`

When changing OData calls:

- check `metadata.xml` first
- keep service roots centralized in `src/app-constant.ts`
- keep attachment-specific endpoints centralized in `src/features/attachments/constants.ts`
- do not hardcode new SAP hosts in views or feature files

## 6. Data Layer Conventions

The repo already has a clear pattern for data access. Follow it instead of calling Axios directly from view components.

- Read operations belong in `src/features/attachments/options/query.ts`
- Write operations belong in `src/features/attachments/options/mutation.ts`
- Shared transport concerns belong in `src/libs/axios-instance.ts` and `src/libs/helpers.ts`
- Strong TypeScript payload/response types belong in `src/features/attachments/types.ts`

Important behavior to remember:

- `axiosInstance` returns `response.data`, not the full Axios response
- query keys are already structured around attachment resources; preserve that pattern when invalidating or extending cache logic
- CSRF token handling is session-based and already wired into the shared helpers/mutations
- `sap-client` is currently passed explicitly as `324` in attachment queries and mutations; if this ever becomes configurable, centralize it instead of duplicating more literals

## 7. UI Conventions

- For business screens, prefer `@ui5/webcomponents-react`
- Use Tailwind mainly for layout and lightweight styling adjustments
- Keep route views focused on page composition; move reusable attachment UI into `src/features/attachments/components`
- Reuse existing preview/download helpers instead of reimplementing base64, PDF, text, or image preview logic
- Preserve the current Fiori-oriented structure unless the task explicitly asks for a redesign

Note:

- `HomeView` is the main exception to the UI5-heavy pattern. It is currently a custom Tailwind-based shell rather than a fully integrated SAP login flow.

## 8. Current State and Known Gaps

Before modifying the app, assume these points are true:

- The attachment domain is already modularized; avoid moving logic back into a monolithic page component
- The filter bar in `AttachmentsView` is still mostly a placeholder UI and is not yet wired into a full filtering workflow
- `AUTH` and `BIZ` service constants exist but are not yet integrated into actual screens
- No dedicated test framework is configured
- `.gitignore` still contains `*test*`, so test files may be hidden or ignored if you add them without adjusting naming or ignore rules
- Deployment is already configured for an ABAP target; avoid changing deployment config unless explicitly requested

## 9. Working Rules for Agents

- Start by checking `src/main.tsx`, `src/app-env.ts`, `src/app-constant.ts`, and the relevant feature module before changing behavior
- If you add new attachment functionality, keep it under `src/features/attachments/` unless there is a strong reason to create a new feature module
- If you add a new OData call, verify the entity shape and action contract in `metadata.xml` first
- If you change routes, preserve the current hash-based routing strategy unless the deployment model is also being changed
- If you introduce more shared app state, extend the Zustand store deliberately rather than adding duplicated local state across views
- If you touch mutation flows, review cache invalidation and CSRF handling together
- Do not modify `ui5-deploy.yaml` or environment host behavior unless the task explicitly requires it

## 10. Run, Build, and Deploy

- Dev server: `npm run dev`
- Production build: `npm run build`
- Lint: `npm run lint`
- Preview build: `npm run preview`
- SAP deployment: `npm run deploy`

## 11. Pre-commit Checklist for Major Changes

- Ran `npm run lint`
- Ran `npm run build`
- Checked whether `metadata.xml` needs to be updated or re-read for any new OData usage
- Kept SAP service roots centralized in `src/app-constant.ts`
- Kept attachment endpoints/query/mutation logic inside the attachment feature module
- Reviewed whether route, proxy, or `base: "./"` changes would affect SAP deployment

## 12. Quick Orientation

If you need to understand this repo fast, start with these files in order:

1. `src/main.tsx`
2. `src/app-env.ts`
3. `src/app-constant.ts`
4. `src/features/attachments/types.ts`
5. `src/features/attachments/options/query.ts`
6. `src/features/attachments/options/mutation.ts`
7. `metadata.xml`
8. `vite.config.ts`
9. `ui5-deploy.yaml`

That path will give you the real runtime structure, environment rules, and attachment domain behavior faster than reading the whole repo at random.
