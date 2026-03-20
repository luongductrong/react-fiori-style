# AGENTS.md

## 1. Project Goal

This is a frontend application built with `React + TypeScript + Vite`, currently used as a foundation to develop a Fiori-style UI for managing attachments in an SAP system.

Current state of the repository:

- `src/App.tsx` is still an initial demo/prototype screen.
- The application is already connected to real SAP OData services.
- The repo is configured for deployment to an ABAP system via `fiori deploy`.

Agents should not assume this is a fully completed application. Treat it as a foundation that is being gradually expanded.

## 2. Tech Stack

- Runtime/UI: `React 18`, `ReactDOM 18`
- Language: `TypeScript` in `strict` mode
- Build tool: `Vite`
- Styling: `Tailwind CSS v4` via `@tailwindcss/vite`
- SAP UI layer: `@ui5/webcomponents`, `@ui5/webcomponents-fiori`, `@ui5/webcomponents-react`
- Linting: `ESLint 9` + `typescript-eslint`
- Deployment: `@ui5/cli`, `@sap/ux-ui5-tooling`, `fiori deploy`

## 3. Current Structure

- `src/main.tsx`: React entry point.
- `src/App.tsx`: current main screen; performs a test fetch from the attachment service.
- `src/app-constant.ts`: central place for OData host/service constants. This should be the first file to check if endpoints change.
- `src/index.css`: only imports Tailwind; no dedicated styling system yet.
- `metadata.xml`: OData metadata for the attachment service; used to understand entities, navigation, and backend actions.
- `vite.config.ts`: defines alias `@`, `base: "./"`, and proxy `/api` to SAP host during local development.
- `ui5-deploy.yaml`: configuration for deployment to ABAP target.

## 4. Run and Build

- Dev server: `npm run dev`
- Production build: `npm run build`
- Lint: `npm run lint`
- Preview build: `npm run preview`
- SAP deployment: `npm run deploy`

Notes:

- Local development uses proxy `/api` to avoid hardcoding the SAP host.
- In production, the app calls `https://s40lp1.ucc.cit.tum.de` directly.
- `base: "./"` in Vite is important for static asset deployment on SAP.

## 5. Environment and API Rules

Environment logic is defined in `src/app-constant.ts`:

- `import.meta.env.PROD === false`: use `ODATA_HOST = "/api"`
- `import.meta.env.PROD === true`: use real host `https://s40lp1.ucc.cit.tum.de`

Current services:

- `ATTACHMENT`
- `AUTH`
- `BIZ`

The attachment service is actively used in the UI demo. From `metadata.xml`, key elements include:

- Entity sets: `Attachments`, `AttachmentVersions`, `Audit`
- Navigation: `_Versions`, `_CurrentVersion`, `_Audit`
- Bound actions: `reactivate`, `deactivate`, `link_to_bo`, `download_version`

When extending features, always check `metadata.xml` before guessing payloads or field names.

## 6. Current Code State (Important Before Modifying)

- `src/App.tsx` fetches data directly inside `useEffect`; no dedicated data layer yet.
- No clear component/domain structure exists; if scaling up, the agent should refactor instead of piling logic into `App.tsx`.
- No test framework is configured.
- Some Vietnamese/German strings show encoding issues. Avoid blindly copying them during refactoring.
- `.gitignore` includes the rule `*test*`, so test files may be unintentionally ignored. Verify before adding tests.

## 7. Suggested Working Conventions

- Keep endpoints centralized in `src/app-constant.ts`; do not scatter SAP URLs across the codebase.
- For UI changes, prefer `@ui5/webcomponents-react` to align with Fiori instead of building raw HTML.
- For data logic, separate OData calls from UI components once complexity increases.
- Do not modify `ui5-deploy.yaml` or SAP host settings unless explicitly required.
- Always verify entities/actions in `metadata.xml` before calling new OData actions.
- If adding tests, update `.gitignore` or use naming that avoids the `*test*` rule.

## 8. Reasonable Next Steps

If continuing development, a sensible direction would be:

1. Split `App.tsx` into modules based on the attachment domain.
2. Create an `api/` or `services/` layer for OData calls.
3. Move UI to proper Fiori components such as table, dialog, form, toolbar.
4. Add strong typing for OData data instead of using `any`/raw JSON.
5. Introduce error states, loading states, and empty states.

## 9. Pre-commit Checklist for Major Changes

- Ran `npm run lint`
- Ran `npm run build`
- Reviewed `src/app-constant.ts` if API changes were involved
- Avoided hardcoding hosts outside the constants file
- Checked impact on SAP deployment if build/output paths were modified

## 10. Quick Summary for Agents

To understand this repo quickly:

- It is a React/Vite frontend for SAP attachment management.
- The codebase is still at a scaffold/demo stage but already connected to real OData services.
- The four most critical files to avoid architectural or environment mistakes are:
  - `src/app-constant.ts`
  - `vite.config.ts`
  - `metadata.xml`
  - `ui5-deploy.yaml`
