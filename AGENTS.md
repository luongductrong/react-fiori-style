# AGENTS.md

## 1. Project Snapshot

This repository is a `React + TypeScript + Vite` frontend for SAP-based file attachment operations.

It is no longer attachment-only. The current app is a multi-domain portal with:

- business flows (attachments and business objects)
- admin flows (dashboard, auth users, configuration files, deleted attachments)
- role-based navigation from a launchpad (`/launchpad`)

The app already runs real OData-backed workflows with feature modules and route composition in place.

## 2. Tech Stack

- UI runtime: `React 18`, `ReactDOM 18`
- Language: `TypeScript` (`strict`)
- Build tool: `Vite`
- Styling: `Tailwind CSS v4`
- SAP UI layer: `@ui5/webcomponents`, `@ui5/webcomponents-fiori`, `@ui5/webcomponents-react`
- Routing: `react-router` + `HashRouter` (no `react-router-dom`)
- Server state: `@tanstack/react-query`
- Local state: `zustand`
- HTTP client: `axios` + `qs`
- External upload integration: `@googleworkspace/drive-picker-react`
- Deployment: `@ui5/cli`, `@sap/ux-ui5-tooling`, `fiori deploy`

## 3. Current App Architecture

The runtime is route-driven and feature-oriented.

Important files:

- `src/main.tsx`
  Entry point and full router definition.
  Wraps app with `ThemeProvider`, `QueryProvider`, global `Toaster`, global `ErrorsMessageBox`, and `HashRouter`.

- `src/components/layouts/app-layout.tsx`
  Main shell layout with `AppHeader` and route outlet.

- `src/components/layouts/app-header.tsx`
  Top shell bar with back navigation, SAP logo, current user profile menu, and logout.

- `src/components/layouts/admin-layout.tsx`
  Left-side admin navigation for dashboard sub-routes.

- `src/components/layouts/private-route.tsx`
  Protects admin routes by checking `isAdmin` from auth query.

- `src/views/`
  Route-level pages:
  - `launchpad.tsx`
  - `dashboard.tsx`
  - `attachment-list.tsx`
  - `attachment-detail.tsx`
  - `version-detail.tsx`
  - `bo-list.tsx`
  - `bo-detail.tsx`
  - `user-list.tsx`
  - `config-file-list.tsx`
  - `deleted-attachment-list.tsx`
  - `not-found.tsx`

- `src/features/`
  Domain modules:
  - `attachments/`
  - `business-objects/`
  - `auth-users/`
  - `config-files/`
  - `dashboard/`

- `src/context-providers/query-provider.tsx`
  React Query client setup and devtools lazy-load in development.

- `src/libs/axios-instance.ts`
  Shared HTTP client:
  - base URL selection
  - automatic `sap-client` query param injection
  - CSRF token capture from response headers
  - returns `response.data` (not full Axios response)

- `src/stores/`
  Zustand stores:
  - `app-store.ts` (view mode, toast, global error list)
  - `auth-store.ts` (CSRF token, Google access token)
  - `view-store.ts` (visible columns for attachment/BO lists)

## 4. Current Routes

Routes are defined in `src/main.tsx` and use hash-based URLs.

- `/launchpad`
  `LaunchpadView`
  Entry screen with business tiles and conditional admin section.

- `/dashboard`
  `PrivateRoute -> AdminLayout`
  Admin-only parent route.

- `/dashboard` (index)
  `DashboardView`

- `/dashboard/users`
  `UserListView`

- `/dashboard/configurations`
  `ConfigFileListView`

- `/dashboard/deleted-attachments`
  `DeletedAttachmentListView`

- `/business-objects`
  `BoListView`

- `/business-objects/:id`
  `BoDetailView`

- `/attachments`
  `AttachmentListView`

- `/attachments/:id`
  `AttachmentDetailView`

- `/attachments/:id/versions/:versionNo`
  `VersionDetailView`

- `/`
  Redirects to `/launchpad`

- `*`
  `NotFoundView`

## 5. Environment and Runtime Config Rules

Environment is handled in `src/app-env.ts` and `src/app-constant.ts`.

Required environment variables:

- `VITE_ODATA_ORIGIN`
- `VITE_ODATA_SAP_CLIENT`
- `VITE_GOOGLE_APP_ID`
- `VITE_GOOGLE_CLIENT_ID`

Behavior:

- In development, frontend calls `/api` and Vite proxies to `VITE_ODATA_ORIGIN`.
- In production, frontend calls `VITE_ODATA_ORIGIN` directly.
- `base: './'` in `vite.config.ts` is deployment-critical for SAP hosting.
- `HashRouter` is intentional and should not be replaced casually.

## 6. Service Roots and Metadata Sources

Service roots are centralized in `src/app-constant.ts`:

- `ODATA_SERVICE.ATTACHMENT`
- `ODATA_SERVICE.AUTH`
- `ODATA_SERVICE.BIZ`
- `ODATA_SERVICE.CONFIG_FILE`
- `ODATA_SERVICE.DASHBOARD`

Public service paths in use:

- `ODATA_PUBLIC_SERVICE.LOG_OUT_ACTION`
- `ODATA_PUBLIC_SERVICE.USER`

Metadata is split by domain (no single `metadata.xml` now):

- `metadata.attachments.xml`
- `metadata.auth-users.xml`
- `metadata.business-objects.xml`
- `metadata.config-files.xml`
- `metadata.dashboard.xml`

When adding or changing OData calls, verify the corresponding metadata file first.

## 7. Domain Module Conventions

Each feature follows this structure:

- `constants.ts` for endpoints/actions
- `types.ts` for payload and response contracts
- `options/query.ts` for React Query reads
- `options/mutation.ts` for React Query writes
- `components/` for reusable feature UI
- `helpers/` and `hooks/` for feature utilities

Do not call Axios directly inside route views unless there is a strong reason.

### 7.1 Attachments

Location: `src/features/attachments/`

Current coverage:

- list (table/grid)
- filter/search
- create attachment
- upload version
- detail + preview
- version detail + set current version
- link/unlink business object
- delete/restore
- audit history
- local file + Google Drive picker upload paths

### 7.2 Business Objects

Location: `src/features/business-objects/`

Current coverage:

- BO list (table/grid)
- create, edit, delete BO
- BO detail
- linked attachments list
- link/unlink attachment from BO side

### 7.3 Auth Users

Location: `src/features/auth-users/`

Current coverage:

- admin user list
- create/delete auth users
- current user role check (`CurrentUserRole`)
- current SAP public profile fetch for header display

### 7.4 Config Files

Location: `src/features/config-files/`

Current coverage:

- list configuration entries
- create/view/edit
- enable/disable via bound actions
- upload rule source for file extension/mime/max-size checks

### 7.5 Dashboard

Location: `src/features/dashboard/`

Current coverage:

- overview cards
- operational/system composition sections
- configuration coverage
- recent audit panel
- refresh via query invalidation

## 8. Auth, Role, and Access Rules

- Admin gating is implemented in `PrivateRoute`.
- `useCurrentAuthUser` normalizes role and checks `ADMIN`.
- Non-admin access to `/dashboard/*` is redirected to `/launchpad`.
- Launchpad shows admin tiles only for admin users.
- User self-delete is blocked in user management UI.

## 9. Data Layer Rules

Follow existing transport pattern:

- Use `axiosInstance` from `src/libs/axios-instance.ts`.
- CSRF token helpers are in `src/libs/helpers/csrf-token.ts`.
- Mutation flows should fetch CSRF token when missing.
- Use `pushApiErrorMessages` for consistent global error handling.

React Query patterns currently used:

- list screens use query key groups per domain (`['attachments', ...]`, `['biz-objects', ...]`, etc.)
- many list queries use infinite pagination with manual `More`
- stale/gc policies are already tuned per query file

## 10. UI and Interaction Conventions

- Prefer `@ui5/webcomponents-react` for business screens.
- Use Tailwind mainly for layout and spacing.
- Keep view files focused on composition and orchestration.
- Move reusable domain UI to feature `components/` folders.
- Reuse existing preview/download/upload helpers for file behavior.
- Keep table/grid toggle behavior aligned with `app-store` and view settings in `view-store`.

## 11. Known Gaps and Active TODO Areas

Based on current code comments, notable gaps include:

- timezone display normalization in BO and related screens
- edit-lock author checks in version detail flow
- some refresh/loading UX refinements
- BO unlink constraints when linked data rules should block action
- i18n hardcoded language headers in mutations
- config-file access assumptions for non-admin users still need verification
- whitelist/mime sync with backend still marked for re-check

Do not remove TODO markers blindly; validate backend and UX requirements first.

## 12. Build, Lint, Deploy

- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Preview: `npm run preview`
- Deploy: `npm run deploy`
- CI deploy command exists: `npm run deploy:ci`

Lint note:

- `scripts/check-eslint-disable.js` runs before ESLint and fails if `eslint-disable` appears under `src/`.

## 13. Working Rules for Agents

- Start from `src/main.tsx`, `src/app-env.ts`, `src/app-constant.ts`, then target feature module.
- Keep service roots centralized in `src/app-constant.ts`.
- Keep per-domain endpoints in each feature `constants.ts`.
- Keep read/write logic in `options/query.ts` and `options/mutation.ts`.
- Verify contract changes against the correct `metadata.*.xml` file.
- Preserve `HashRouter`, Vite `base: './'`, and SAP deployment assumptions unless task explicitly requires otherwise.
- Avoid editing `ui5-deploy.yaml` unless deployment behavior is part of the request.

## 14. Quick Orientation Path

For fast onboarding, read in this order:

1. `src/main.tsx`
2. `src/app-env.ts`
3. `src/app-constant.ts`
4. `src/libs/axios-instance.ts`
5. `src/components/layouts/private-route.tsx`
6. `src/features/auth-users/options/query.ts`
7. `src/features/attachments/options/query.ts`
8. `src/features/attachments/options/mutation.ts`
9. `src/features/business-objects/options/query.ts`
10. `src/features/config-files/options/query.ts`
11. `src/features/dashboard/options/query.ts`
12. `metadata.attachments.xml`
13. `metadata.auth-users.xml`
14. `metadata.business-objects.xml`
15. `metadata.config-files.xml`
16. `metadata.dashboard.xml`
17. `vite.config.ts`
18. `ui5-deploy.yaml`
