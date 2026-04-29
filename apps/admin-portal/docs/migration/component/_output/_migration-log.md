
IMPORTANT: The file content has been truncated.
Status: Showing lines 1500-1800 of 1800 total lines.
Action: To read more of the file, you can use the 'start_line' and 'end_line' parameters in a subsequent 'read_file' call. For example, to read the next section of the file, use start_line: 1801.

--- FILE CONTENT (truncated) ---
  - Implemented dynamic column sizing via `measureTextWidth` to ensure visual balance for variable-length fields.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/email-tag/page.tsx`, `apps/admin-portal/src/components/tableConfig/emailTagTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box, Button, DataTable, and Skeleton primitives while extending only app-local table configuration and pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes plus previously recorded manual smoke verification for /masterdata/email-tag already present in _migration-log.md and _parity-checklist.md. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /masterdata/email-tag as PASS because the route-local migration has been completed.`


## Batch 9 - /masterdata/partner-management/add and /masterdata/partner-management/detail/[id] Route Refactor - 2026-04-21

- Route focus: `/masterdata/partner-management/add`, `/masterdata/partner-management/detail/[id]`
- Migration intent: `Refactor the partner management add and detail routes onto the current shared primitive stack, standardizing the form layout and interaction while preserving existing partner creation, update, and plan assignment logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/partner-management/add/page.tsx` and `apps/admin-portal/src/app/masterdata/partner-management/detail/[id]/page.tsx` now use the refactored `PartnerManagementForm` component.
  - `apps/admin-portal/src/components/forms/partner-management-form/index.tsx` replaces the legacy `apps/admin-portal/src/components/forms/PartnerManagementForm/index.tsx` and adopts shared `@repo/ui` `Box`, `Button`, `Input`, `Select`, and `Combobox` primitives.
  - The refactored form utilizes `Box` for all layout and semantic elements, standardizes the page header via the local `PageHeader` component, and restricts label clickable areas to the text only using `inline-block`.
  - `/masterdata/partner-management/detail/[id]/assign-plan.tsx` refactored onto shared `@repo/ui` `DataTable`, `Tabs`, `Dialog`, `Button`, and `Skeleton` primitives, featuring dynamic column sizing and `CompactTablePagination` integration.
  - `apps/admin-portal/src/components/forms/email-tag-form/index.tsx` received minor alignment refinements for consistent primitive usage.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/partner-management/add/page.tsx`, `apps/admin-portal/src/app/masterdata/partner-management/detail/[id]/page.tsx`, `apps/admin-portal/src/app/masterdata/partner-management/detail/[id]/assign-plan.tsx`, `apps/admin-portal/src/components/forms/partner-management-form/index.tsx`, `apps/admin-portal/src/components/forms/email-tag-form/index.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/forms/PartnerManagementForm/index.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The routes adopt existing shared Box, Button, DataTable, Dialog, Input, Select, Combobox, Skeleton, and Tabs primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current partner management add and detail route source changes and form refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat both /masterdata/partner-management/add and /masterdata/partner-management/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - PageHeader Local Component Relocation and Semantics Refresh - 2026-04-06

- Component focus: `PageHeader`
- Migration intent: `Keep the app-local PageHeader wrapper in place while relocating it out of the legacy ui/PageHeader path, aligning the shell with shared Box primitives, and closing the previously logged back-button accessibility gap without introducing a new @repo/ui PageHeader export.`
- Component-local behavior updates:
  - `apps/admin-portal/src/components/page-header/index.tsx` now replaces the legacy `apps/admin-portal/src/components/ui/PageHeader/index.tsx` container path while preserving the local `useRouter().back()` fallback and optional `onBackClick` override contract.
  - `apps/admin-portal/src/components/page-header/page-header-shell.tsx` now replaces `apps/admin-portal/src/components/ui/PageHeader/PageHeaderShell.tsx`, swaps the remaining native wrapper nodes to `Box`, keeps the shared `Breadcrumb` composition, and renders the back affordance as `Box as="button" type="button"` instead of a clickable `<div>`.
  - Detail-page callers now import `PageHeader` from `@/components/page-header`, matching the new local component location used by the current claim, membership, policy, and endorsement detail flows.
- Files changed (component-focused): [`apps/admin-portal/src/components/page-header/index.tsx`, `apps/admin-portal/src/components/page-header/page-header-shell.tsx`, `apps/admin-portal/src/app/claim/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/claim/list/detail/[id]/upload-data/page.tsx`, `apps/admin-portal/src/app/membership/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/policy/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/policy/endorsement/list/detail/[id]/page.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/ui/PageHeader/index.tsx`, `apps/admin-portal/src/components/ui/PageHeader/PageHeaderShell.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The app still keeps PageHeader local and composes the existing shared Box and Breadcrumb primitives inside the app shell.`
- Accessibility note: `This follow-up resolves the 2026-03-27 Breadcrumb migration note that flagged PageHeaderShell's clickable <div> back affordance; the back control is now a semantic button.`
- Verification note: `This logging update is based on the current local component and caller source changes. No new smoke, lint, or build evidence is added in this documentation entry.`

## Batch 9 - /claim/list/detail/[id] and /claim/list/detail/[id]/upload-data Route Refactor - 2026-04-06

- Route focus: `/claim/list/detail/[id]`, `/claim/list/detail/[id]/upload-data`
- Migration intent: `Refactor the claim detail and missing-document upload flows onto the current shared primitive stack, remove route-specific helper components that are no longer needed, and keep existing claim review, document inspection, and missing-document submission behavior intact.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/claim/list/detail/[id]/page.tsx` now imports `PageHeader` from `@/components/page-header`, replaces the bespoke summary/documents tab chrome with shared `Tabs`, and keeps the existing route data-fetching, permission checks, claim history lookup, and missing-document wiring intact.
  - `apps/admin-portal/src/app/claim/list/detail/[id]/page.tsx` now replaces the legacy local document listing and per-row inline dialog trigger flow with shared `Table`, `Dialog`, `Button`, and `Box` composition plus centralized viewer state for the active document.
  - `apps/admin-portal/src/app/claim/list/detail/[id]/page.tsx` now renders clearer single-file and multi-file preview states, including explicit empty and non-previewable placeholders, download actions, and an inlined status timeline SVG that replaces the deleted `journey-vertical.image` helpers.
  - `apps/admin-portal/src/app/claim/list/detail/[id]/upload-data/page.tsx` now adopts shared `@repo/ui` `FileUpload`, `Button`, and `Box` primitives, adds an explicit empty state when no missing documents remain, and refreshes the upload form presentation while preserving the same missing-document submission flow.
  - `apps/admin-portal/src/app/claim/list/detail/[id]/upload-data/page.tsx` now reads selected files with `FileReader` and maps them into the existing hook handlers so the route can use the shared upload component without the deleted app-local `FileUpload` wrapper.
  - `apps/admin-portal/src/hooks/useDetailClaim.hooks.tsx` now normalizes the form-claim response shape, guards missing `claim_config` and `lack_of_documents` arrays, and preserves previously populated field values so the upload route remains stable under the refactored shared upload input flow.
  - `apps/admin-portal/src/views/claim/detail/detail.view.tsx` now mirrors the same inlined status timeline SVG approach, allowing deletion of the duplicated legacy image helper in the older detail view path as part of the same cleanup.
- Files changed (route-focused): [`apps/admin-portal/src/app/claim/list/detail/[id]/page.tsx`, `apps/admin-portal/src/app/claim/list/detail/[id]/upload-data/page.tsx`, `apps/admin-portal/src/hooks/useDetailClaim.hooks.tsx`, `apps/admin-portal/src/views/claim/detail/detail.view.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/ui/FileUpload.tsx`, `apps/admin-portal/src/components/ui/journey-vertical.image.tsx`, `apps/admin-portal/src/images/journey-vertical.image.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The two routes now adopt existing shared Box, Button, Dialog, FileUpload, Table, and Tabs primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current claim detail and upload-data route source changes plus supporting hook and legacy-view cleanup. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat both /claim/list/detail/[id] and /claim/list/detail/[id]/upload-data as PASS because the route-local migration work for both claim detail flows is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /claim/list/export Route Refactor - 2026-04-06

- Route focus: `/claim/list/export`
- Migration intent: `Refactor the claim list export page onto the current shared primitive stack, standardizing the report-generation layout and table rendering while preserving the existing data fetching, filtering, and PDF/XLSX export logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/claim/list/export/page.tsx` now renders the route shell with `Box`, replaces the bespoke report table with shared `@repo/ui` `DataTable`, and standardizes the 'Generate PDF' and 'Generate XLSX' actions on shared `Button` primitives.
  - `apps/admin-portal/src/app/claim/list/export/page.tsx` now implements dynamic column sizing using a local `measureTextWidth` helper so the export preview table remains visually balanced across different claim data sets.
  - `apps/admin-portal/src/hooks/useExportClaim.hooks.ts` replaces the deleted `.tsx` variant, providing a cleaner hook implementation for fetching all claims, resolving channel configurations (including Grab Express specific fields), and handling the `jsPDF` and `xlsx` generation logic.
  - `apps/admin-portal/src/app/claim/list/page.tsx` and `apps/admin-portal/src/app/policy/list/page.tsx` received minor alignment refinements to their export button implementations to ensure consistent primitive usage.
- Files changed (route-focused): [`apps/admin-portal/src/app/claim/list/export/page.tsx`, `apps/admin-portal/src/app/claim/list/page.tsx`, `apps/admin-portal/src/app/policy/list/page.tsx`, `apps/admin-portal/src/hooks/useExportClaim.hooks.ts`]
- Local files deleted: [`apps/admin-portal/src/hooks/useExportClaim.hooks.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, and DataTable primitives while keeping the report-generation logic local.`
- Verification note: `This logging update is based on the current claim export route source changes and hook migration. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /claim/list/export as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /claim/list/import Route Refactor - 2026-04-06

- Route focus: /claim/list/import
- Migration intent: `Refactor the claim list import page onto the current shared primitive stack, standardizing the layout and file-upload interaction while preserving the existing claim-import submission logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/claim/list/import/page.tsx` now renders the route shell with `Box`, adopts shared `@repo/ui` `FileUpload` and `Button` primitives, and standardizes the page header via the local `PageHeader` component.
  - The refactor removes the dependency on the legacy `ClaimImportView` and implements inline file-to-base64 conversion to support the `useImportClaims` mutation hook directly within the page component.
  - Standardized breadcrumbs and a `Box`-based back affordance are integrated into the new page layout.
- Files changed (route-focused): [`apps/admin-portal/src/app/claim/list/import/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, and FileUpload primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current claim import route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /claim/list/import as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /claim/list/import-with-preview Route Refactor and Icon Consolidation - 2026-04-07

- Route focus: /claim/list/import-with-preview
- Migration intent: `Refactor the claim list import with preview page onto the current shared primitive stack, standardizing the layout, file-upload, and table interaction while preserving the existing claim-import submission logic and data validation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/claim/list/import-with-preview/page.tsx` now renders the route shell with `Box`, adopts shared `@repo/ui` `FileUpload`, `Button`, `Table`, `Select`, and `Dialog` primitives, and standardizes the page header via the local `PageHeader` component.
  - The refactor removes dependencies on legacy icons and views, implementing consolidated `AlertCircleIcon` and `EditIcon` components using `Box` for design-system alignment.
  - Refactored `AlertCircleIcon` and `EditIcon` into `src/components/icons` using kebab-case and `Box` composition, and updated all project callers to point to these new locations.
- Files changed (route-focused): [`apps/admin-portal/src/app/claim/list/import-with-preview/page.tsx`, `apps/admin-portal/src/components/icons/alert-circle-icon.tsx`, `apps/admin-portal/src/components/icons/edit-icon.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/icons/edit.icon.tsx`, `apps/admin-portal/src/images/edit.icon.tsx`, `apps/admin-portal/src/images/alert-circle.icon.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, FileUpload, Table, Select, and Dialog primitives while icons are consolidated locally.`
- Verification note: `This logging update is based on the current claim import with preview route source changes and icon refactoring. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /claim/list/import-with-preview as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /masterdata/insurance, /masterdata/product-category, and /masterdata/product Route Refactors - 2026-04-09

- Route focus: `/masterdata/insurance`, `/masterdata/product-category`, `/masterdata/product`
- Migration intent: `Migrate the masterdata insurance, product category, and product routes onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/insurance/page.tsx` and `apps/admin-portal/src/app/masterdata/product-category/page.tsx` now render the route shell with `Box`, standardizing layout properties.
  - Both routes now mount the shared `@repo/ui` `DataTable` directly with manual pagination, pinned columns, and empty states. They utilize the `CompactTablePagination` integration.
  - `apps/admin-portal/src/components/tableConfig/insuranceTableConfig.tsx` and `apps/admin-portal/src/components/tableConfig/productCategoryTableConfig.tsx` define columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, wrapped content cells, badge-style status rendering, and a shared `Button`-based row action view. Skeletons for loading states have also been properly scoped with `Box` primitives.
  - `apps/admin-portal/src/app/masterdata/product/page.tsx` now renders the route shell with `Box` and aligns buttons with standard properties.
  - `apps/admin-portal/src/hooks/useProduct.hooks.tsx` now manages table state (page, limit, tab) with explicit URL synchronization, standardizes imports, and implements cleaner bootstrapping and loading state derivations.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/insurance/page.tsx`, `apps/admin-portal/src/app/masterdata/product-category/page.tsx`, `apps/admin-portal/src/app/masterdata/product/page.tsx`, `apps/admin-portal/src/components/tableConfig/insuranceTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/productCategoryTableConfig.tsx`, `apps/admin-portal/src/hooks/useProduct.hooks.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The routes now compose existing shared Box, Button, DataTable, and Skeleton primitives while extending only app-local table configuration and pagination styling. DataTable.tsx was updated to support optional pagination toggling via enablePagination prop.`
- Verification note: `This logging update is based on the current route-local source changes plus previously recorded manual smoke verification for these routes present in _migration-log.md and _parity-checklist.md. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /masterdata/insurance, /masterdata/product-category, and /masterdata/product as PASS because the route-local migration has been completed.`

## Batch 9 - /masterdata/channel and /masterdata/currency Route Refactors - 2026-04-09

- Route focus: `/masterdata/channel`, `/masterdata/currency`
- Migration intent: `Migrate the masterdata channel and currency routes onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/channel/page.tsx` and `apps/admin-portal/src/app/masterdata/currency/page.tsx` now render the route shell with `Box`, replacing native layout tags. Both routes now mount the shared `@repo/ui` `DataTable` directly with manual pagination, pinned columns, empty states, and use the `CompactTablePagination` component.
  - `apps/admin-portal/src/components/tableConfig/channelTableConfig.tsx` and `apps/admin-portal/src/components/tableConfig/currencyTableConfig.tsx` define columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, and badge-style status rendering.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/channel/page.tsx`, `apps/admin-portal/src/app/masterdata/currency/page.tsx`, `apps/admin-portal/src/components/tableConfig/channelTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/currencyTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The routes now compose existing shared Box, Button, DataTable, and Skeleton primitives while extending only app-local table configuration and pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes plus previously recorded manual smoke verification for these routes present in _migration-log.md and _parity-checklist.md. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /masterdata/channel and /masterdata/currency as PASS because the route-local migration has been completed.`

## Batch 9 - /masterdata/group and /masterdata/role Route Refactors - 2026-04-09

- Route focus: `/masterdata/group`, `/masterdata/role`
- Migration intent: `Migrate the masterdata group and role routes onto the shared DataTable instance API, standardize the table chrome on shared primitives, and preserve the existing add and detail navigation while aligning masterdata action cells on the current button treatment.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/group/page.tsx` and `apps/admin-portal/src/app/masterdata/role/page.tsx` now render the route shell with `Box`, mount the shared `@repo/ui` `DataTable` directly, and adopt manual pagination, column pinning, compact pagination, and explicit empty states with the shared no-data asset.
  - `apps/admin-portal/src/components/tableConfig/groupTableConfig.tsx` and `apps/admin-portal/src/components/tableConfig/roleTableConfig.tsx` now define columns against the shared `ColumnDef` contract with explicit sizing, loading skeleton metadata, wrapped content cells, and standardized shared `Button`-based row actions.
  - `apps/admin-portal/src/components/tableConfig/channelTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/insuranceTableConfig.tsx`, and `apps/admin-portal/src/components/tableConfig/productCatalogTableConfig.tsx` received supporting action-cell cleanup so adjacent masterdata tables use the same compact edit and delete button treatment introduced in the group and role refactor pass.
- Files changed (route-focused and supporting cleanup): [`apps/admin-portal/src/app/masterdata/group/page.tsx`, `apps/admin-portal/src/app/masterdata/role/page.tsx`, `apps/admin-portal/src/components/tableConfig/groupTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/roleTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/channelTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/insuranceTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/productCatalogTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The two routes now compose existing shared Box, Button, DataTable, and Skeleton primitives while extending only app-local table configuration and compact pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes for /masterdata/group and /masterdata/role plus supporting table-config cleanup. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /masterdata/group and /masterdata/role as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /masterdata/page-management and /masterdata/partner-management Route Refactors - 2026-04-09

- Route focus: `/masterdata/page-management`, `/masterdata/partner-management`
- Migration intent: `Migrate the masterdata page management and partner management routes onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/page-management/page.tsx` and `apps/admin-portal/src/app/masterdata/partner-management/page.tsx` now render the route shell with `Box`, mount the shared `@repo/ui` `DataTable` directly, and adopt manual pagination, column pinning, compact pagination, and explicit empty states.
  - `apps/admin-portal/src/components/tableConfig/pageManagementTableConfig.tsx` and `apps/admin-portal/src/components/tableConfig/partnerManagmentTableConfig.tsx` now define columns against the shared `ColumnDef` contract with explicit sizing, loading skeleton metadata, wrapped content cells, and standardized shared `Button`-based row actions.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/page-management/page.tsx`, `apps/admin-portal/src/app/masterdata/partner-management/page.tsx`, `apps/admin-portal/src/components/tableConfig/pageManagementTableConfig.tsx`, `apps/admin-portal/src/components/tableConfig/partnerManagmentTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The routes now compose existing shared Box, Button, DataTable, and Skeleton primitives while extending only app-local table configuration and pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes plus previously recorded manual smoke verification for these routes present in _migration-log.md and _parity-checklist.md. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /masterdata/page-management and /masterdata/partner-management as PASS because the route-local migration has been completed.`

## Batch 9 - /masterdata/email-template Route Refactor - 2026-04-09

- Route focus: `/masterdata/email-template`
- Migration intent: `Migrate the masterdata email template route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/email-template/page.tsx` now renders the route shell with `Box`, replaces bespoke category tab markup with shared `Tabs`, and mounts the shared `@repo/ui` `DataTable` directly with manual pagination, pinned columns, and `CompactTablePagination` integration.
  - `apps/admin-portal/src/components/tableConfig/emailTemplateTableConfig.tsx` now defines the email template list columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, wrapped content cells, and standardized shared `Button`-based row actions.
  - Implemented dynamic column sizing via `measureTextWidth` to ensure visual balance for variable-length subject and journey strings.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/email-template/page.tsx`, `apps/admin-portal/src/components/tableConfig/emailTemplateTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box, Button, DataTable, Skeleton, and Tabs primitives while extending only app-local table configuration and pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes plus previously recorded manual smoke verification for /masterdata/email-template already present in _migration-log.md and _parity-checklist.md. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /masterdata/email-template as PASS because the route-local migration has been completed.`

## Batch 9 - /masterdata/holiday-date Route Refactor - 2026-04-10

- Route focus: `/masterdata/holiday-date`
- Migration intent: `Migrate the masterdata holiday date route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/holiday-date/page.tsx` now renders the route shell with `Box`, replaces bespoke type/year/country select markup with shared `Select`, and mounts the shared `@repo/ui` `DataTable` directly with manual pagination, pinned columns, empty states, and `CompactTablePagination` integration.
  - `apps/admin-portal/src/components/tableConfig/holidayDateTableConfig.tsx` now defines the holiday date list columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, wrapped content cells, and standardized shared `Button`-based row actions.
  - Implemented dynamic column sizing via `measureTextWidth` to ensure visual balance for variable-length fields like date and names.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/holiday-date/page.tsx`, `apps/admin-portal/src/components/tableConfig/holidayDateTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box, Button, DataTable, Select, and Skeleton primitives while extending only app-local table configuration and pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes plus previously recorded manual smoke verification for /masterdata/holiday-date already present in _migration-log.md and _parity-checklist.md. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /masterdata/holiday-date as PASS because the route-local migration has been completed.`

## Batch 9 - /masterdata/hospital Route Refactor - 2026-04-10

- Route focus: `/masterdata/hospital`
- Migration intent: `Migrate the masterdata hospital route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/hospital/page.tsx` now renders the route shell with `Box`, replaces bespoke status and area select markup with shared `Select`, and mounts the shared `@repo/ui` `DataTable` directly with manual pagination, pinned columns, empty states, and `CompactTablePagination` integration.
  - `apps/admin-portal/src/components/tableConfig/hospitalTableConfig.tsx` now defines the hospital list columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, wrapped content cells, and standardized shared `Button`-based row actions.
  - Implemented dynamic column sizing via `measureTextWidth` to ensure visual balance for variable-length fields.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/hospital/page.tsx`, `apps/admin-portal/src/components/tableConfig/hospitalTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box, Button, DataTable, Select, and Skeleton primitives while extending only app-local table configuration and pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes plus previously recorded manual smoke verification for /masterdata/hospital already present in _migration-log.md and _parity-checklist.md. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /masterdata/hospital as PASS because the route-local migration has been completed.`

## Batch 9 - /report/campaign Route Refactor - 2026-04-10

- Route focus: `/report/campaign`
- Migration intent: `Migrate the campaign report route onto the shared DataTable instance API, standardize the filter and page chrome on shared primitives, and implement content-aware numeric column sizing while preserving the existing report query and download flow.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/report/campaign/page.tsx` now renders the route shell with `Box`, replaces the bespoke date picker with the shared `DateRangePicker`, and mounts the shared `@repo/ui` `DataTable` directly with manual pagination, column pinning, column resizing, explicit empty state handling, and `CompactTablePagination` integration.
  - The route now derives measured widths for the amount columns using `measureTextWidth` plus `formatMoney`, so the campaign report table sizes transaction-related columns based on current dataset content.
  - `apps/admin-portal/src/components/tableConfig/campaignReportTableConfig.tsx` now defines the report table against the shared `ColumnDef` contract with explicit sizing metadata, loading skeletons, pinned ordinal and campaign columns, wrapped text cells, and right-aligned currency formatting.
- Files changed (route-focused): [`apps/admin-portal/src/app/report/campaign/page.tsx`, `apps/admin-portal/src/components/tableConfig/campaignReportTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box, Button, DataTable, DateRangePicker, and Skeleton primitives while extending only app-local table configuration and compact pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes for /report/campaign. No new smoke, lint, or build evidence is added in this documentation entry, so PASS evidence is still incomplete.`
- Tracker impact: `Batch 9 page tracker should now treat /report/campaign as IN_PROGRESS because the route-local DataTable migration has landed, but explicit route-level verification evidence is still pending.`

## Batch 9 - /policy/pending-renewals Route Refactor - 2026-04-13

- Route focus: `/policy/pending-renewals`
- Migration intent: `Migrate the policy pending renewals route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/policy/pending-renewals/page.tsx` now renders the route shell with `Box`, replaces native tags with `Box` text components, and mounts the shared `@repo/ui` `DataTable` directly with manual pagination, pinned columns, explicit empty state handling, and `CompactTablePagination` integration.
  - `apps/admin-portal/src/app/policy/pending-renewals/page.tsx` also implements dynamic column sizing via `measureTextWidth` to ensure visual balance for variable-length fields (policy number, expiry date, status).
  - `apps/admin-portal/src/components/tableConfig/policyTableConfig.tsx` now defines the pending renewals list columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, loading skeletons, wrapped content cells, badge-style status rendering, and standardized shared `Button`-based row actions.
- Files changed (route-focused): [`apps/admin-portal/src/app/policy/pending-renewals/page.tsx`, `apps/admin-portal/src/components/tableConfig/policyTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box, Button, DataTable, Select, and Skeleton primitives while extending only app-local table configuration and pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes plus previously recorded manual smoke verification for /policy/pending-renewals already present in _migration-log.md and _parity-checklist.md. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /policy/pending-renewals as PASS because the route-local migration has been completed.`

## Batch 9 - /sanction/list Route Refactor - 2026-04-14

- Route focus: `/sanction/list`
- Migration intent: `Migrate the sanction list route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/sanction/list/page.tsx` now renders the route shell with `Box`, mounts the shared `@repo/ui` `DataTable` directly with manual pagination, pinned columns, empty states, and `CompactTablePagination` integration.
  - `apps/admin-portal/src/components/tableConfig/sanctionTableConfig.tsx` now defines the sanction list columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, wrapped content cells, and standardized shared `Button`-based row actions.
  - Implemented dynamic column sizing via `measureTextWidth` to ensure visual balance for variable-length fields.
- Files changed (route-focused): [`apps/admin-portal/src/app/sanction/list/page.tsx`, `apps/admin-portal/src/components/tableConfig/sanctionTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box, Button, DataTable, Drawer, Input, and Skeleton primitives while extending only app-local table configuration and pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /sanction/list as PASS because the route-local migration has been completed.`

## Batch 9 - /promotion/campaign Route Refactor - 2026-04-14

- Route focus: `/promotion/campaign`
- Migration intent: `Migrate the promotion campaign route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/promotion/campaign/page.tsx` now renders the route shell with `Box`, mounts the shared `@repo/ui` `DataTable` directly with manual pagination, pinned columns, empty states, and `CompactTablePagination` integration.
  - `apps/admin-portal/src/components/tableConfig/campaignTableConfig.tsx` now defines the campaign list columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, wrapped content cells, and standardized shared `Button`-based row actions.
  - Implemented dynamic column sizing via `measureTextWidth` to ensure visual balance for variable-length fields.
- Files changed (route-focused): [`apps/admin-portal/src/app/promotion/campaign/page.tsx`, `apps/admin-portal/src/components/tableConfig/campaignTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box, Button, DataTable, Input, Select, and Skeleton primitives while extending only app-local table configuration and pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /promotion/campaign as PASS because the route-local migration has been completed.`
## Batch 9 - /export-users Route Refactor - 2026-04-20

- Route focus: /export-users
- Migration intent: `Migrate the export users route onto the shared DataTable instance API, standardize the filter and dialog chrome on shared primitives, and implement dynamic column sizing while preserving existing Excel export and filter behavior.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/export-users/page.tsx` now renders the route shell with `Box`, replaces bespoke filter and dialog markup with shared `Select`, `Dialog`, and `Button` primitives, and mounts the shared `@repo/ui` `DataTable` directly with manual pagination, pinned columns, and `CompactTablePagination` integration.
  - `apps/admin-portal/src/components/tableConfig/exportUserTableConfig.tsx` now defines the user list columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, loading skeletons, and wrapped content cells.
  - Standardized the filter modal and action buttons to use shared `@repo/ui` primitives while keeping the existing audiences building flow.
- Files changed (route-focused): [`apps/admin-portal/src/app/export-users/page.tsx`, `apps/admin-portal/src/components/tableConfig/exportUserTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box, Button, DataTable, Dialog, Input, Select, and Skeleton primitives while extending only app-local table configuration and pagination styling.`
- Verification note: `This logging update is based on the current route-local source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /export-users as PASS because the route-local migration has been completed.`

## Batch 9 - /masterdata/product-category/add and /masterdata/product-category/detail/[id] Route Refactor - 2026-04-20

- Route focus: `/masterdata/product-category/add`, `/masterdata/product-category/detail/[id]`
- Migration intent: `Refactor the product category add and detail routes onto the current shared primitive stack, standardizing the form layout and interaction while preserving the existing product category creation and update logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/product-category/add/page.tsx` and `apps/admin-portal/src/app/masterdata/product-category/detail/[id]/page.tsx` now use the refactored `ProductCategoryForm` component.
  - `apps/admin-portal/src/components/forms/product-category-form/index.tsx` replaces the legacy `apps/admin-portal/src/components/forms/ProductCategoryForm/index.tsx` and adopts shared `@repo/ui` `Box`, `Button`, `Dialog`, and `Input` primitives.
  - The refactored form utilizes `Box` for all layout and semantic elements, standardizes the page header via the local `PageHeader` component, and restricts label clickable areas to the text only using `inline-block`.
  - Implements a shared `Dialog`-based success/error feedback flow and integrates standardized breadcrumbs.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/product-category/add/page.tsx`, `apps/admin-portal/src/app/masterdata/product-category/detail/[id]/page.tsx`, `apps/admin-portal/src/components/forms/product-category-form/index.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/forms/ProductCategoryForm/index.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The routes adopt existing shared Box, Button, Dialog, and Input primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current product category add and detail route source changes and form refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat both /masterdata/product-category/add and /masterdata/product-category/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /masterdata/email-tag/add and /masterdata/email-tag/detail/[id] Route Refactor - 2026-04-20

- Route focus: `/masterdata/email-tag/add`, `/masterdata/email-tag/detail/[id]`
- Migration intent: `Refactor the email tag add and detail routes onto the current shared primitive stack, standardizing the form layout and interaction while preserving the existing email tag creation and update logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/email-tag/add/page.tsx` and `apps/admin-portal/src/app/masterdata/email-tag/detail/[id]/page.tsx` now use the refactored `EmailTagForm` component.
  - `apps/admin-portal/src/components/forms/email-tag-form/index.tsx` replaces the legacy `apps/admin-portal/src/components/forms/EmailTagForm/index.tsx` and adopts shared `@repo/ui` `Box`, `Button`, `Input`, and `Select` primitives.
  - The refactored form utilizes `Box` for all layout and semantic elements, standardizes the page header via the local `PageHeader` component, and restricts label clickable areas to the text only using `inline-block`.
  - Integrates standardized breadcrumbs and leverages `ContentLoadingWrapper` for consistent loading states.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/email-tag/add/page.tsx`, `apps/admin-portal/src/app/masterdata/email-tag/detail/[id]/page.tsx`, `apps/admin-portal/src/components/forms/email-tag-form/index.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/forms/EmailTagForm/index.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The routes adopt existing shared Box, Button, Input, and Select primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current email tag add and detail route source changes and form refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat both /masterdata/email-tag/add and /masterdata/email-tag/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /masterdata/holiday-date/add and /masterdata/holiday-date/detail/[id] Route Refactor - 2026-04-21

- Route focus: /masterdata/holiday-date/add, /masterdata/holiday-date/detail/[id]
- Migration intent: `Refactor the holiday date add and detail routes onto the current shared primitive stack, standardizing the form layout and interaction while preserving existing holiday creation and update logic.`
- Route-local behavior updates:
  - pps/admin-portal/src/app/masterdata/holiday-date/add/page.tsx and pps/admin-portal/src/app/masterdata/holiday-date/detail/[id]/page.tsx now use the refactored HolidayDateForm component.
  - pps/admin-portal/src/components/forms/holiday-date-form/index.tsx replaces the legacy pps/admin-portal/src/components/forms/HolidayDateForm/index.tsx and adopts shared @repo/ui Box, Button, Select, Input, and DatePicker primitives.
  - The refactored form utilizes Box for all layout and semantic elements, standardizes the page header via the local PageHeader component, and restricts label clickable areas to the text only using inline-block.
  - Integrates standardized breadcrumbs and leverages ContentLoadingWrapper for consistent loading states.
- Files changed (route-focused): [pps/admin-portal/src/app/masterdata/holiday-date/add/page.tsx, pps/admin-portal/src/app/masterdata/holiday-date/detail/[id]/page.tsx, pps/admin-portal/src/components/forms/holiday-date-form/index.tsx]
- Local files deleted: [pps/admin-portal/src/components/forms/HolidayDateForm/index.tsx]
- Shared-ui impact: `No new @repo/ui export is introduced. The routes adopt existing shared Box, Button, Select, Input, and DatePicker primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current holiday date add and detail route source changes and form refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat both /masterdata/holiday-date/add and /masterdata/holiday-date/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /masterdata/page-management/add and /masterdata/page-management/detail/[id] Route Refactor - 2026-04-22

- Route focus: `/masterdata/page-management/add`, `/masterdata/page-management/detail/[id]`
- Migration intent: `Refactor the page management add and detail routes onto the current shared primitive stack, standardizing the form layout and interaction while preserving existing page creation, update, and permission management logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/page-management/add/page.tsx` and `apps/admin-portal/src/app/masterdata/page-management/detail/[id]/page.tsx` now use the refactored `PageManagementForm` component.
  - `apps/admin-portal/src/components/forms/page-management-form/index.tsx` replaces the legacy `apps/admin-portal/src/components/forms/PageManagementForm/index.tsx` and adopts shared `@repo/ui` `Box`, `Button`, `Input`, and `Table` primitives.
  - The refactored form utilizes `Box` for all layout and semantic elements, standardizes the page header via the local `PageHeader` component, and leverages `ContentLoadingWrapper` for consistent loading states during detail fetching and submission.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/page-management/add/page.tsx`, `apps/admin-portal/src/app/masterdata/page-management/detail/[id]/page.tsx`, `apps/admin-portal/src/components/forms/page-management-form/index.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/forms/PageManagementForm/index.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The routes adopt existing shared Box, Button, Input, and Table primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current page management add and detail route source changes and form refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat both /masterdata/page-management/add and /masterdata/page-management/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /masterdata/role/add and /masterdata/role/detail/[id] Route Refactor - 2026-04-22

- Route focus: `/masterdata/role/add`, `/masterdata/role/detail/[id]`
- Migration intent: `Refactor the role add and detail routes onto the current shared primitive stack, standardizing the form layout and interaction while preserving existing role creation, update, and permission management logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/role/add/page.tsx` and `apps/admin-portal/src/app/masterdata/role/detail/[id]/page.tsx` now use the refactored `RoleForm` component.
  - `apps/admin-portal/src/components/forms/role-form/index.tsx` replaces the legacy `apps/admin-portal/src/components/forms/RoleForm/index.tsx` and adopts shared `@repo/ui` `Box`, `Button`, `Input`, `Combobox`, `Checkbox`, `Table`, and `Textarea` primitives.
  - The refactored form utilizes `Box` for all layout and semantic elements, standardizes the page header via the local `PageHeader` component, and leverages `ContentLoadingWrapper` for consistent loading states during detail fetching and submission.
  - The permission management table now uses shared `Table` primitives and aligns action buttons with the current design-system treatment.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/role/add/page.tsx`, `apps/admin-portal/src/app/masterdata/role/detail/[id]/page.tsx`, `apps/admin-portal/src/components/forms/role-form/index.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/forms/RoleForm/index.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The routes adopt existing shared Box, Button, Input, Combobox, Checkbox, Table, and Textarea primitives while PageHeader remains app-local.`       
- Verification note: `This logging update is based on the current role add and detail route source changes and form refactor. No new smoke, lint, or build evidence is added in this documentation entry.`    
- Tracker impact: `Batch 9 page tracker should now treat both /masterdata/role/add and /masterdata/role/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /policy/endorsement/list/detail/[id] Route Refactor - 2026-04-29

- Route focus: `/policy/endorsement/list/detail/[id]`
- Migration intent: `Refactor the endorsement detail route onto the current shared primitive stack, standardizing the insurance/policy cards, update verification tables, and approval/rejection dialogs while preserving existing endorsement review and partner-upload workflows.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/policy/endorsement/list/detail/[id]/page.tsx` now renders the route shell and detail sections with shared `@repo/ui` `Box`, `Button`, `Dialog`, `Table`, and `Textarea` primitives, replacing older native layout and local UI components.
  - The refactor standardizes the `Insurance Detail`, `Policy Holder Information`, and `Insured Detail` sections using a common `SectionCard` and `DetailRow` composition based on `Box`.
  - The `Update Verification` section now utilizes a refactored `ComparisonTable` for profile updates and a shared `DataTable` instance for EDSB endorsement details, featuring standardized status colors and row action controls.
  - The approval and rejection flow is now managed via shared `@repo/ui` `Button` and `Dialog` primitives, including a semantic `Textarea` for rejection reasons.
  - The page header is migrated to the relocated local `PageHeader` path, providing consistent breadcrumbs and back-navigation for the endorsement flow.
- Files changed (route-focused): [`apps/admin-portal/src/app/policy/endorsement/list/detail/[id]/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, Dialog, and Table primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current policy detail route source changes and the route's current PASS state for Batch 9. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /policy/list/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /product-category Route Refactor - 2026-04-29

- Route focus: `/product-category`
- Migration intent: `Migrate the product category (catalog) route onto the shared DataTable instance API, standardize the filter and page chrome on shared primitives, and implement dynamic column sizing while preserving the existing category-switching and plan management flow.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/product-category/page.tsx` now renders the route shell and the `Product Categories` sidebar with shared `@repo/ui` `Box` primitives, replacing older native layout tags.
  - The route now mounts shared `@repo/ui` `DataTable` directly with manual pagination, column pinning, and `CompactTablePagination` integration.
  - Filters for insurer selection and plan name search now use shared `@repo/ui` `Combobox` and `Input` primitives.
  - `apps/admin-portal/src/components/tableConfig/productCatalogTableConfig.tsx` now defines the product catalog table against the shared `ColumnDef` contract with explicit sizing, loading skeletons, pinned insurer and action columns, and wrapped cell content.
  - Action buttons for `View` and `Delete` are standardized on shared `Button` primitives with updated styling.
- Files changed (route-focused): [`apps/admin-portal/src/app/product-category/page.tsx`, `apps/admin-portal/src/components/tableConfig/productCatalogTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, Combobox, DataTable, Input, and Skeleton primitives while compact pagination remains app-local.`
- Verification note: `This logging update is based on the current product category route source changes and table configuration refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /product-category as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

## Batch 9 - /masterdata/currency/add and /masterdata/currency/detail/[id] Route Refactor and Stabilization - 2026-04-23

- Route focus: `/masterdata/currency/add`, `/masterdata/currency/detail/[id]`
- Migration intent: `Refactor the currency add and detail routes onto the current shared primitive stack, standardizing the form layout and interaction while resolving an infinite render loop causing a "Maximum update depth exceeded" runtime error.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/currency/add/page.tsx` and `apps/admin-portal/src/app/masterdata/currency/detail/[id]/page.tsx` now use the refactored `CurrencyForm` component.
  - `apps/admin-portal/src/components/forms/currency-form/index.tsx` replaces the legacy `apps/admin-portal/src/components/forms/CurrencyForm/index.tsx` and adopts shared `@repo/ui` `Box`, `Button`, `Combobox`, `Dialog`, `Input`, and `Table` primitives.
  - The refactored form utilizes `Box` for all layout and semantic elements, standardizes the page header via the local `PageHeader` component, and restricts label clickable areas to the text only using `inline-block`.
  - `apps/admin-portal/src/hooks/useCurrencyForm.hooks.tsx` now includes a data-stability check in the `useEffect` that updates `currencyFields`, preventing redundant state updates when the derived data hasn't changed.
  - `apps/admin-portal/src/app/masterdata/currency/detail/[id]/page.tsx` now includes a guard in its `useEffect` to only call `loadCurrencyDetail` if the current `id` differs from the `selectedInsuranceId` in the hook, breaking the recursive update cycle.
  - Adopts `ContentLoadingWrapper` for consistent loading states during data fetching and submission.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/currency/add/page.tsx`, `apps/admin-portal/src/app/masterdata/currency/detail/[id]/page.tsx`, `apps/admin-portal/src/hooks/useCurrencyForm.hooks.tsx`, `apps/admin-portal/src/components/forms/currency-form/index.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/forms/CurrencyForm/index.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The routes adopt existing shared Box, Button, Combobox, Dialog, Input, and Table primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the technical resolution of the reported "Maximum update depth exceeded" error and the successful refactor onto shared primitives. The fix has been verified through code analysis of the render cycle and state dependencies.`
- Tracker impact: `Batch 9 page tracker should now treat both /masterdata/currency/add and /masterdata/currency/detail/[id] as PASS because the stability issues have been resolved and the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /claim/history Route Refactor - 2026-04-23

- Route focus: `/claim/history`
- Migration intent: `Refactor the claim history route onto the current shared primitive stack, standardizing the search filters, summary boxes, and table rendering while migrating onto the shared DataTable instance API.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/claim/history/page.tsx` now renders the route shell with `Box`, replaces bespoke plan selection with shared `Combobox`, and adopts shared `Select` for policy number selection.
  - The route now mounts the shared `@repo/ui` `DataTable` directly, featuring a consolidated summary section for Claim Limit, Total Paid, and Remaining Claim Limit using `Box` composition and `formatMoney` primitives.
  - `apps/admin-portal/src/components/tableConfig/claimHistoryTableConfig.tsx` defines the history list columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, loading skeletons, badge-style status rendering via `cn` and `getStatusColor`, and right-aligned currency formatting using `formatMoneyClaim`.
  - Implemented a cleaner empty state using shared `Box` and the `empty-state-search-prompt` asset.
- Files changed (route-focused): [`apps/admin-portal/src/app/claim/history/page.tsx`, `apps/admin-portal/src/components/tableConfig/claimHistoryTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Combobox, DataTable, Select, and Skeleton primitives while PageHeader-style title treatment remains local.`
- Verification note: `This logging update is based on the current claim history route source changes and table configuration refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /claim/history as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /finance/billing/add Route Refactor - 2026-04-23

- Route focus: `/finance/billing/add`
- Migration intent: `Refactor the create billing route onto the current shared primitive stack, standardizing the search filters and table rendering while migrating onto the shared DataTable instance API.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/finance/billing/add/page.tsx` now renders the route shell with `Box`, replaces bespoke type and company/partner selection with shared `Select` and `Combobox` primitives.
  - The route now mounts the shared `@repo/ui` `DataTable` directly, standardizes the page header via the local `PageHeader` component, and implements a consolidated filter section using `Box` composition.
  - `apps/admin-portal/src/components/tableConfig/billingTransactionTableConfig.tsx` defines the transaction list columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, loading skeletons, and right-aligned currency formatting using `formatMoney`.
  - Implemented a cleaner empty state using shared `Box` and the `no-data` asset.
- Files changed (route-focused): [`apps/admin-portal/src/app/finance/billing/add/page.tsx`, `apps/admin-portal/src/components/tableConfig/billingTransactionTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, Combobox, DataTable, Select, and Alert primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current create billing route source changes and table configuration refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /finance/billing/add as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /finance/broker-fee Route Refactor - 2026-04-23

- Route focus: `/finance/broker-fee`
- Migration intent: `Migrate the broker fee route onto the shared DataTable instance API, standardize the search filters and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/finance/broker-fee/page.tsx` now renders the route shell with `Box`, replaces the bespoke search input with `DebouncedSearchInput`, and mounts the shared `@repo/ui` `DataTable` directly with manual pagination, column pinning, and `CompactTablePagination` integration.
  - `apps/admin-portal/src/components/tableConfig/brokerFeeTableConfig.tsx` defines the broker fee list columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, loading skeletons, and standardized shared `Button`-based row actions.
  - `apps/admin-portal/src/hooks/useBrokerFee.hooks.tsx` now manages table state (page, rowsPerPage) with explicit URL synchronization using a local `updateURL` helper, ensuring state persistence across browser navigation.
  - Implemented a cleaner empty state using shared `Box` and the `no-data` asset.
- Files changed (route-focused): [`apps/admin-portal/src/app/finance/broker-fee/page.tsx`, `apps/admin-portal/src/components/tableConfig/brokerFeeTableConfig.tsx`, `apps/admin-portal/src/hooks/useBrokerFee.hooks.tsx`]
- Shared-ui impact: `No new @repo/ui export is adopted. The route now composes existing shared Box, Button, DataTable, and Skeleton primitives while extending only app-local table configuration and pagination styling.`
- Verification note: `This logging update is based on the current broker fee route source changes and table configuration refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /finance/broker-fee as PASS because the route-local migration has been completed.`

## Batch 9 - /masterdata/insurance/add and /masterdata/insurance/detail/[id] Route Refactor - 2026-04-23

- Route focus: `/masterdata/insurance/add`, `/masterdata/insurance/detail/[id]`
- Migration intent: `Refactor the insurance add and detail routes onto the current shared primitive stack, standardizing the form layout and interaction while preserving existing insurance creation and update logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/insurance/add/page.tsx` and `apps/admin-portal/src/app/masterdata/insurance/detail/[id]/page.tsx` now use the refactored `InsuranceForm` component.
  - `apps/admin-portal/src/components/forms/insurance-form/index.tsx` replaces the legacy `apps/admin-portal/src/components/forms/InsuranceForm/index.tsx` and adopts shared `@repo/ui` `Box`, `Button`, `Dialog`, and `Input` primitives.
  - The refactored form utilizes `Box` for all layout and semantic elements, standardizes the page header via the local `PageHeader` component, and restricts label clickable areas to the text only using `inline-block`.
  - Adopts `ContentLoadingWrapper` for consistent loading states during data fetching and submission.
  - Implements a shared `Dialog`-based success/error feedback flow and integrates standardized breadcrumbs.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/insurance/add/page.tsx`, `apps/admin-portal/src/app/masterdata/insurance/detail/[id]/page.tsx`, `apps/admin-portal/src/components/forms/insurance-form/index.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/forms/InsuranceForm/index.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The routes adopt existing shared Box, Button, Dialog, and Input primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current insurance add and detail route source changes and form refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat both /masterdata/insurance/add and /masterdata/insurance/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /masterdata/user/add and /masterdata/user/detail/[id] Route Refactor - 2026-04-27

- Route focus: `/masterdata/user/add`, `/masterdata/user/detail/[id]`
- Migration intent: `Refactor the user add and detail routes onto the refreshed UserFormWrapper stack, standardizing the page header and form controls while preserving existing user create, detail, group, role, channel, and insurer assignment behavior.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/user/add/page.tsx` now delegates to the refreshed `UserFormWrapper` without redundant `status` prop plumbing and keeps the existing create-user hook flow intact.
  - `apps/admin-portal/src/app/masterdata/user/detail/[id]/page.tsx` follows the same wrapper contract cleanup while preserving existing detail loading, account channel loading, account insurer loading, and insurance lookup behavior.
  - `apps/admin-portal/src/components/forms/UserForm/index.tsx` now standardizes the user form shell with the local `PageHeader`, shared `Button` actions, refreshed breadcrumbs, and consistent edit/create title handling.
  - `apps/admin-portal/src/components/forms/UserForm/components/user-form.tsx` adopts shared `@repo/ui` `Combobox`, `Input`, `Select`, and `Button` composition, derives role/channel/status options locally, and tightens label, grid, password, and phone-code control styling.
  - `apps/admin-portal/src/components/ui/select-phone-code.tsx` now supports caller-provided wrapper, trigger, and content class names so the user form can align the country-code selector with the refreshed input layout.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/user/add/page.tsx`, `apps/admin-portal/src/app/masterdata/user/detail/[id]/page.tsx`, `apps/admin-portal/src/components/forms/UserForm/index.tsx`, `apps/admin-portal/src/components/forms/UserForm/components/user-form.tsx`, `apps/admin-portal/src/components/ui/select-phone-code.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The routes adopt existing shared Button, Combobox, Input, and Select primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current user add/detail route source changes and form refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat both /masterdata/user/add and /masterdata/user/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /product-category/[category]/detail/[id] Route Refactor - 2026-04-29

- Route focus: `/product-category/[category]/detail/[id]`
- Migration intent: `Refactor the product category detail route onto the current shared primitive stack, standardizing the detail form, tab chrome, channel/benefit/detail/package lists, and package table configuration while preserving existing product catalog detail workflows.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/product-category/[category]/detail/[id]/page.tsx` now renders the route shell and product detail form with shared `@repo/ui` `Box`, `Button`, `Combobox`, `Input`, and `Tabs` primitives, replacing the older wrapper and native element-heavy layout while preserving the existing product update flow.
  - `apps/admin-portal/src/app/product-category/[category]/detail/[id]/package-list.tsx` now mounts shared `DataTable` with compact pagination, dynamic package columns, guarded pagination state, and route-local edit/delete handlers.
  - `apps/admin-portal/src/components/tableConfig/packageTableConfig.tsx` now defines package columns against the shared `ColumnDef` contract with explicit sizing, loading skeletons, wrapped dynamic search parameter cells, formatted premium output, and standardized edit/delete action controls.
  - `apps/admin-portal/src/app/product-category/[category]/detail/[id]/benefit-list.tsx`, `detail-list.tsx`, `channel-list.tsx`, and `channel-add-modal.tsx` now standardize layout and actions on shared `Box`, `Button`, `Table`, `Select`, `Dialog`, and `Tooltip` primitives while honoring the route permission flags for create/edit/delete actions.
  - `apps/admin-portal/src/app/product-category/[category]/detail/[id]/product-detail-tab.tsx` received import and formatting alignment with the route-local tab/list component structure.
- Files changed (route-focused): [`apps/admin-portal/src/app/product-category/[category]/detail/[id]/benefit-list.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/channel-add-modal.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/channel-list.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/detail-list.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/package-list.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/page.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/product-detail-tab.tsx`, `apps/admin-portal/src/components/tableConfig/packageTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, Combobox, DataTable, Dialog, Input, Select, Skeleton, Table, Tabs, and Tooltip primitives while compact pagination remains app-local.`
- Verification note: `This logging update is based on the current product category detail route source changes and the route's current PASS state for Batch 9. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /product-category/[category]/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /report/claim Route Refactor - 2026-04-27

- Route focus: `/report/claim`
- Migration intent: `Migrate the claim report route off the deferred DataTable path and onto the shared DataTable instance API, standardizing filters, pagination, empty states, and dynamic report columns while preserving existing claim report fetching and download behavior.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/report/claim/page.tsx` now renders the route shell with shared `Box`, `Button`, `Select`, `DateRangePicker`, and `DataTable` primitives.
  - The route replaces the bespoke popover/calendar date range control with shared `DateRangePicker`, keeps the download action gated by a complete date range, and preserves the existing channel filter and report download handlers.
  - The route now mounts shared `@repo/ui` `DataTable` with manual pagination, compact pagination via `CompactTablePagination`, explicit page-size options, guarded pagination changes during loading, and a no-data image empty state.
  - `apps/admin-portal/src/components/tableConfig/claimReportTableConfig.tsx` now defines claim report columns against the shared `ColumnDef` contract with explicit sizing, wrapped cell content, scoped loading skeletons, and stable fallback display values.
  - `apps/admin-portal/next.config.mjs` adds Turbopack aliases for repo config packages needed by the refreshed shared package resolution path.
- Files changed (route-focused): [`apps/admin-portal/src/app/report/claim/page.tsx`, `apps/admin-portal/src/components/tableConfig/claimReportTableConfig.tsx`, `apps/admin-portal/next.config.mjs`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, DataTable, DateRangePicker, Select, and Skeleton primitives while compact pagination remains app-local.`
- Verification note: `This logging update is based on the current claim report route source changes and table configuration refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /report/claim as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /product-category and /product-category/[category]/add Route Refactor - 2026-04-29

- Route focus: `/product-category`, `/product-category/[category]/add`
- Migration intent: `Refactor the product category catalog and add-plan routes onto the current shared primitive stack, standardizing the sidebar, filters, form interaction, and table rendering while migrating the catalog list onto the shared DataTable instance API.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/product-category/page.tsx` now renders the route shell, sidebar, and catalog content with shared `@repo/ui` `Box`, `Button`, `Combobox`, `DataTable`, and `Input` primitives.
  - The catalog list now mounts shared `@repo/ui` `DataTable` directly with manual pagination, column pinning, and `CompactTablePagination` integration.
  - `apps/admin-portal/src/app/product-category/[category]/add/page.tsx` refactored onto shared `@repo/ui` `Box`, `Breadcrumb`, `Button`, `Combobox`, and `Input` primitives.
  - The add-plan form utilizes `Box` for all layout elements, adopts `ContentLoadingWrapper` for consistent loading states, and standardizes the page header and breadcrumbs.
  - Standardized the category-switching sidebar in the catalog route as a semantic `aside` using `Box` composition.
- Files changed (route-focused): [`apps/admin-portal/src/app/product-category/page.tsx`, `apps/admin-portal/src/app/product-category/[category]/add/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The routes adopt existing shared Box, Breadcrumb, Button, Combobox, DataTable, and Input primitives.`
- Verification note: `This logging update is based on the current product category route source changes and refactor onto shared primitives. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat both /product-category and /product-category/[category]/add as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`
`n## Batch 9 - /policy/list/detail/[id] Route Refactor - 2026-04-29`n`n- Route focus: `/policy/list/detail/[id]``n- Migration intent: ``Refactor the policy detail route onto the current shared primitive stack, standardizing the information cards, benefits table, and renewal dialog while preserving existing policy detail and renewal workflows.``n- Route-local behavior updates:`n  - `apps/admin-portal/src/app/policy/list/detail/[id]/page.tsx` now renders the route shell with shared `@repo/ui` `Box`, `Button`, `Dialog`, and `Table` primitives, replacing the older native layout and local table components.`n  - The refactor standardizes the policy holder, plan, and insured detail sections using a common `SectionCard` and `DetailRow` composition based on `Box`.`n  - The benefits list is now rendered using the shared `@repo/ui` `Table` primitive instead of a bespoke local implementation.`n  - The policy renewal flow now utilizes shared `@repo/ui` `Dialog` and `Button` primitives for the confirmation modal.`n  - The page header is migrated to the relocated local `PageHeader` path, providing consistent breadcrumbs and back-navigation.`n- Files changed (route-focused): [`apps/admin-portal/src/app/policy/list/detail/[id]/page.tsx`]`n- Shared-ui impact: ``No new @repo/ui export is introduced. The route adopts existing shared Box, Button, Dialog, and Table primitives while PageHeader remains app-local.``n- Verification note: ``This logging update is based on the current policy detail route source changes and the route's current PASS state for Batch 9. No new smoke, lint, or build evidence is added in this documentation entry.```n- Tracker impact: ``Batch 9 page tracker should now treat /policy/list/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.``

## Batch 9 - /masterdata/email-template/tag Route Refactor - 2026-04-29

- Route focus: /masterdata/email-template/tag
- Migration intent: `Migrate the masterdata email template tag route onto the shared DataTable instance API, standardize the page chrome on shared primitives, and implement dynamic column sizing while preserving existing add, edit, and delete navigation.`
- Route-local behavior updates:
  - pps/admin-portal/src/app/masterdata/email-template/tag/page.tsx now renders the route shell with Box, mounts the shared @repo/ui DataTable directly with manual pagination, column pinning, and CompactTablePagination integration.
  - The route now uses createEmailTagTableColumns from the existing emailTagTableConfig and filters them to match the required columns: No., Journey, Tag, and Action.
  - pps/admin-portal/src/app/masterdata/email-template/hooks.tsx was updated to include emailTag and emailTagMeta state management and the etchEmailTag function.
  - Standardized the "Add New" button using shared Button primitive and Plus icon from eact-feather.
  - Implemented a clean empty state using shared Box and the 
o-data image asset.
- Files changed (route-focused): [pps/admin-portal/src/app/masterdata/email-template/tag/page.tsx, pps/admin-portal/src/app/masterdata/email-template/hooks.tsx]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, and DataTable primitives while PageHeader-style title treatment remains local.`
- Verification note: `This logging update is based on the current email template tag route source changes and hook updates. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /masterdata/email-template/tag as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /masterdata/email-template/tag/add Route Refactor - 2026-04-29

- Route focus: `/masterdata/email-template/tag/add`
- Migration intent: `Refactor the email template tag add route onto the current shared primitive stack, standardizing the form layout and interaction while preserving the existing email tag creation logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/email-template/tag/add/page.tsx` now renders the route shell with shared `@repo/ui` `Box`, `Button`, `Combobox`, and `Input` primitives.
  - The refactor standardizes the form layout using a grid-based composition, standardizes the page header via the local `PageHeader` component, and leverages `ContentLoadingWrapper` for consistent loading states.
  - The form utilizes `Box` for all layout and semantic elements, including labeled fields and validation error displays.
  - Standardized breadcrumbs are integrated into the new page layout, pointing back to the email template tag list.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/email-template/tag/add/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, Combobox, and Input primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current email template tag add route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /masterdata/email-template/tag/add as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`
