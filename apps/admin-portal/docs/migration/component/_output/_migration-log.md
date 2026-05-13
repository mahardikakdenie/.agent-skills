
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


## Batch 9 - /finance/billing/detail/[id] Route Refactor - 2026-04-30

- Route focus: `/finance/billing/detail/[id]`
- Migration intent: `Refactor the billing detail route onto the current shared primitive stack, standardizing the information cards, action buttons, reconciliation dialogs, and transaction table while migrating the transaction list onto the shared DataTable instance API with dynamic column sizing.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/finance/billing/detail/[id]/page.tsx` now renders the route shell with shared `@repo/ui` `Box`, `Button`, `Breadcrumb`, and `DataTable` primitives, replacing older native layout and local UI components.
  - The root `Box` now uses `flex min-h-0 flex-1` to align with the standard page layout pattern.
  - The route now mounts the shared `@repo/ui` `DataTable` directly, featuring manual pagination, column pinning, and `CompactTablePagination` integration.
  - Maintained the standard `pb-4 md:pb-6` on the `DataTable` `className` to provide consistent spacing at the bottom of the page.
  - Implemented dynamic column sizing via `measureTextWidth` to ensure visual balance for transaction numbers, plan names, insurance companies, and currency/amount fields based on current dataset content.
  - `apps/admin-portal/src/app/finance/billing/detail/[id]/components/BillingDetailInfo.tsx` refactored onto shared `@repo/ui` `Box` and `Badge` primitives, standardizing the billing summary and status presentation.
  - `apps/admin-portal/src/app/finance/billing/detail/[id]/components/BillingDetailActions.tsx` refactored onto shared `@repo/ui` `Box`, `Button`, and `Dialog` primitives, standardizing the payment, cancellation, and reconciliation confirmation flows.
  - `apps/admin-portal/src/components/tableConfig/billingDetailTableConfig.tsx` defines the transaction list columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, loading skeletons, and right-aligned currency formatting.
- Files changed (route-focused): [`apps/admin-portal/src/app/finance/billing/detail/[id]/page.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/components/BillingDetailInfo.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/components/BillingDetailActions.tsx`, `apps/admin-portal/src/components/tableConfig/billingDetailTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, Breadcrumb, DataTable, Dialog, Badge, and Skeleton primitives while PageHeader-style title treatment remains local.`
- Verification note: `This logging update is based on the current billing detail route source changes and table configuration refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /finance/billing/detail/[id] as PASS because the route-local migration has been completed.`

## Batch 9 - /policy/list/detail/[id] Route Refactor - 2026-04-29

- Route focus: `/policy/list/detail/[id]`
- Migration intent: `Refactor the policy detail route onto the current shared primitive stack, standardizing the information cards, benefits table, and renewal dialog while preserving existing policy detail and renewal workflows.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/policy/list/detail/[id]/page.tsx` now renders the route shell with shared `@repo/ui` `Box`, `Button`, `Dialog`, and `Table` primitives, replacing the older native layout and local table components.
  - The refactor standardizes the policy holder, plan, and insured detail sections using a common `SectionCard` and `DetailRow` composition based on `Box`.
  - The benefits list is now rendered using the shared `@repo/ui` `Table` primitive instead of a bespoke local implementation.
  - The policy renewal flow now utilizes shared `@repo/ui` `Dialog` and `Button` primitives for the confirmation modal.
  - The page header is migrated to the relocated local `PageHeader` path, providing consistent breadcrumbs and back-navigation.
- Files changed (route-focused): [`apps/admin-portal/src/app/policy/list/detail/[id]/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, Dialog, and Table primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current policy detail route source changes and the route's current PASS state for Batch 9. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /policy/list/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /masterdata/email-template/tag Route Refactor - 2026-04-29

- Route focus: /masterdata/email-template/tag
- Migration intent: `Migrate the masterdata email template tag route onto the shared DataTable instance API, standardize the page chrome on shared primitives, and implement dynamic column sizing while preserving existing add, edit, and delete navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/email-template/tag/page.tsx` now renders the route shell with `Box`, mounts the shared `@repo/ui` `DataTable` directly with manual pagination, column pinning, and `CompactTablePagination` integration.
  - The route now uses `createEmailTagTableColumns` from the existing `emailTagTableConfig` and filters them to match the required columns: No., Journey, Tag, and Action.
  - `apps/admin-portal/src/app/masterdata/email-template/hooks.tsx` was updated to include `emailTag` and `emailTagMeta` state management and the `fetchEmailTag` function.
  - Standardized the "Add New" button using shared `Button` primitive and Plus icon from `react-feather`.
  - Implemented a clean empty state using shared `Box` and the `no-data` image asset.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/email-template/tag/page.tsx`, `apps/admin-portal/src/app/masterdata/email-template/hooks.tsx`]
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

## Batch 9 - /finance/billing/detail/[id]/export Route Refactor - 2026-04-30

- Route focus: `/finance/billing/detail/[id]/export`
- Migration intent: `Refactor the billing detail export route onto the current shared primitive stack, standardizing the layout, report header, and data table while preserving existing PDF/XLSX generation and data-fetching logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/finance/billing/detail/[id]/export/page.tsx` now adopts shared `@repo/ui` `Box`, `Breadcrumb`, `Badge`, `Spinner`, and `Button` primitives.
  - Transformed all native HTML elements (`div`, `h2`, `button`, `dl`, `dt`, `dd`, `img`, `table`, `thead`, `tr`, `th`, `tbody`, `td`) into the polymorphic `Box` component with appropriate semantic `as` mapping.
  - Standardized the page header with `Breadcrumb` and standardized typography.
  - Replaced the bespoke loading indicator with the shared `Spinner` component.
  - Standardized status rendering using the shared `Badge` primitive with semantic tone mapping.
  - Standardized 'Generate PDF' and 'Generate XLSX' actions on shared `Button` primitives with updated styling and icons.
  - Standardized the back affordance as a semantic button with a left chevron icon.
- Files changed (route-focused): [`apps/admin-portal/src/app/finance/billing/detail/[id]/export/page.tsx`]

- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Breadcrumb, Badge, Spinner, and Button primitives while the PDF/XLSX generation logic remains local.`
- Verification note: `This logging update is based on the current billing detail export route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /finance/billing/detail/[id]/export as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /finance/billing/detail/[id]/import Route Refactor - 2026-05-04

- Route focus: `/finance/billing/detail/[id]/import`
- Migration intent: `Refactor the billing detail import route onto the current shared primitive stack, standardizing the layout and file-upload interaction while preserving the existing billing-transaction import logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/finance/billing/detail/[id]/import/page.tsx` now adopts shared `@repo/ui` `Box`, `Button`, and `FileUpload` primitives.
  - The refactor standardizes the page header via the local `PageHeader` component, featuring consistent breadcrumbs and back-navigation.
  - Standardized the file-upload flow with `FileUpload` component, including validation for Excel formats and 10MB file size limit.
  - Standardized the import instructions and status feedback using shared `Box` primitives with semantic styling.
  - Standardized the primary upload action on a shared `Button` primitive with a loading state.
- Files changed (route-focused): [`apps/admin-portal/src/app/finance/billing/detail/[id]/import/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, and FileUpload primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current billing detail import route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /finance/billing/detail/[id]/import as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /finance/billing/detail/[id]/invoice Route Refactor - 2026-05-04

- Route focus: `/finance/billing/detail/[id]/invoice`
- Migration intent: `Refactor the billing detail invoice route onto the current shared primitive stack, standardizing the layout, page header, and download action while preserving the existing invoice HTML generation and PDF export logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/finance/billing/detail/[id]/invoice/page.tsx` now adopts shared `@repo/ui` `Box`, `Button`, and `Spinner` primitives.
  - The refactor standardizes the page header via the local `PageHeader` component, featuring consistent breadcrumbs and back-navigation.
  - Replaced the bespoke loading indicator with the shared `Spinner` component.
  - Standardized the 'Download PDF' action on a shared `Button` primitive with a Download icon.
  - The invoice content is rendered inside a shared `Box` primitive, maintaining the existing `dangerouslySetInnerHTML` approach for the generated HTML content.
- Files changed (route-focused): [`apps/admin-portal/src/app/finance/billing/detail/[id]/invoice/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, and Spinner primitives while the invoice HTML generation and PDF export logic remains local.`
- Verification note: `This logging update is based on the current billing detail invoice route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /finance/billing/detail/[id]/invoice as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /finance/unmatch-billing Route Refactor - 2026-05-04

- Route focus: `/finance/unmatch-billing`
- Migration intent: `Refactor the unmatched billing reconciliation route onto the shared primitive stack, standardizing the layout and table rendering while migrating onto the shared DataTable instance API with dynamic column sizing.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/finance/unmatch-billing/page.tsx` now renders the route shell with shared `@repo/ui` `Box` and `DataTable` primitives, replacing older native layout and local UI components.
  - The route now mounts the shared `@repo/ui` `DataTable` directly, featuring manual pagination, column pinning, column resizing, and `CompactTablePagination` integration.
  - Implemented dynamic column sizing via `measureTextWidth` to ensure visual balance for billing numbers, transaction numbers, dates, currency, amounts, and status fields based on current dataset content.
  - `apps/admin-portal/src/components/tableConfig/unmatchBillingTableConfig.tsx` (new) defines the unmatched billing columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, loading skeletons, and badge-style status rendering.
  - Standardized the empty state using shared `Box` and the `no-data` image asset.
- Files changed (route-focused): [`apps/admin-portal/src/app/finance/unmatch-billing/page.tsx`, `apps/admin-portal/src/components/tableConfig/unmatchBillingTableConfig.tsx`, `apps/admin-portal/src/lib/formatter.ts`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box and DataTable primitives while compact pagination remains app-local.`
- Verification note: `This logging update is based on the current unmatched billing route source changes and table configuration refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /finance/unmatch-billing as PASS because the route-local migration has been completed.`




## Batch 9 - /finance/broker-fee/add Route Refactor - 2026-05-06

- Route focus: `/finance/broker-fee/add`
- Migration intent: `Refactor the broker fee add route onto the current shared primitive stack, standardizing the form layout and interaction while preserving existing broker fee creation logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/finance/broker-fee/add/page.tsx` now uses the refactored `BrokerFeeForm` component.
  - `apps/admin-portal/src/components/forms/broker-fee-form/index.tsx` replaces the legacy `BrokerFeeForm/index.tsx` and adopts shared `@repo/ui` `Box`, `Button`, `Input`, and `Combobox` primitives.
  - The refactored form utilizes `Box` for all layout and semantic elements, standardizes the page header via the local `PageHeader` component, and leverages `ContentLoadingWrapper` for consistent loading states during data fetching and submission.
  - Standardized breadcrumbs and a `Box`-based back affordance are integrated into the new page layout.
- Files changed (route-focused): [`apps/admin-portal/src/app/finance/broker-fee/add/page.tsx`, `apps/admin-portal/src/components/forms/broker-fee-form/index.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/forms/BrokerFeeForm/index.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, Input, and Combobox primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current broker fee add route source changes and form refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /finance/broker-fee/add as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /finance/partner-comm/add and /finance/partner-comm/detail/[id] Route Refactor - 2026-05-06

- Route focus: `/finance/partner-comm/add`, `/finance/partner-comm/detail/[id]`
- Migration intent: `Refactor the partner communication add and detail routes onto the current shared primitive stack, standardizing the form layout and interaction while preserving existing partner communication creation and update logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/finance/partner-comm/add/page.tsx` and `apps/admin-portal/src/app/finance/partner-comm/detail/[id]/page.tsx` now use the refactored `PartnerCommForm` component.
  - `apps/admin-portal/src/components/forms/partner-comm-form/index.tsx` (new) replaces the legacy `PartnerCommForm/index.tsx` and adopts shared `@repo/ui` `Box`, `Button`, `Input`, and `Combobox` primitives.
  - The refactored form utilizes `Box` for all layout and semantic elements, standardizes the page header via the local `PageHeader` component, and leverages `ContentLoadingWrapper` for consistent loading states during data fetching and submission.
  - Updated `financeService.getBillingById` in `apps/admin-portal/src/services/finance/api/finance.service.ts` to use `withQuery` for consistent parameter handling.
  - Added `id` props to `Combobox` components in `apps/admin-portal/src/components/forms/broker-fee-form/index.tsx` for improved accessibility and field targeting.
  - Improved robustness of the billing detail export route (`/finance/billing/detail/[id]/export`) with enhanced null-checking and fallback logic for PDF and XLSX generation.
- Files changed (route-focused): [`apps/admin-portal/src/app/finance/partner-comm/add/page.tsx`, `apps/admin-portal/src/app/finance/partner-comm/detail/[id]/page.tsx`, `apps/admin-portal/src/components/forms/partner-comm-form/index.tsx`, `apps/admin-portal/src/app/finance/billing/detail/[id]/export/page.tsx`, `apps/admin-portal/src/components/forms/broker-fee-form/index.tsx`, `apps/admin-portal/src/services/finance/api/finance.service.ts`]
- Local files deleted: [`apps/admin-portal/src/components/forms/PartnerCommForm/index.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The routes adopt existing shared Box, Button, Input, and Combobox primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current partner communication add and detail route source changes, form refactor, and supporting service updates. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat both /finance/partner-comm/add and /finance/partner-comm/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /finance/partner-comm Route Refactor - 2026-05-06

- Route focus: `/finance/partner-comm`
- Migration intent: `Migrate the partner communication list route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add, edit, and delete navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/finance/partner-comm/page.tsx` now renders the route shell with `Box`, mounts the shared `@repo/ui` `DataTable` directly with manual pagination, column pinning, and `CompactTablePagination` integration.
  - The route now uses `createPartnerCommTableColumns` which defines columns against the shared `ColumnDef` contract with explicit sizing, loading skeletons, and standardized shared `Button`-based row actions.
  - Implemented dynamic column sizing via `size` and `minSize` to ensure visual balance for channel names and insurance company names.
  - Standardized the "Create Partner Comm" button using shared `Button` primitive and Plus icon.
  - `apps/admin-portal/src/hooks/usePartnerComm.hooks.tsx` now manages table state (page, limit) with explicit URL synchronization using a local `updateURL` helper.
- Files changed (route-focused): [`apps/admin-portal/src/app/finance/partner-comm/page.tsx`, `apps/admin-portal/src/components/tableConfig/partnerCommTableConfig.tsx`, `apps/admin-portal/src/hooks/usePartnerComm.hooks.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, DataTable, Select, and Skeleton primitives while PageHeader-style title treatment remains local.`
- Verification note: `This logging update is based on the current partner communication route source changes, table configuration refactor, and hook updates. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /finance/partner-comm as PASS because the route-local migration has been completed.`


## Batch 9 - /membership/list/export Route Refactor - 2026-05-06

- Route focus: `/membership/list/export`
- Migration intent: `Refactor the membership list export page onto the current shared primitive stack, standardizing the report-generation layout and table rendering while preserving the existing data fetching, localStorage state, and PDF/XLSX export logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/membership/list/export/page.tsx` now adopts shared `@repo/ui` `Box`, `Button`, `Table`, and `Spinner` primitives.
  - Transformed native HTML layout tags into the polymorphic `Box` component and replaced the bespoke loading indicator with the shared `Spinner`.
  - Standardized the 'Generate PDF' and 'Generate XLSX' actions on shared `Button` primitives with updated styling and icons.
  - The refactor preserves the existing `localStorage` integration for export parameters and maintains the `jsPDF` and `xlsx` generation logic for report output.
  - Standardized the back affordance as a semantic `Box` (as a button) with a left chevron icon.
- Files changed (route-focused): [`apps/admin-portal/src/app/membership/list/export/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, Table, and Spinner primitives while the PDF/XLSX generation logic remains local.`
- Verification note: `This logging update is based on the current membership export route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /membership/list/export as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /source/list Route Refactor - 2026-05-06

- Route focus: `/source/list`
- Migration intent: `Migrate the source list route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement a source details drawer while preserving existing add and detail navigation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/source/list/page.tsx` now renders the route shell with shared `Box`, mounts the shared `@repo/ui` `DataTable` directly with manual pagination, column pinning, and `CompactTablePagination` integration.
  - Implemented a details drawer using shared `@repo/ui` `Drawer` primitives, standardizing the information display for selected sources with a grid-based layout.
  - Standardized the "Add Source" action on a shared `Button` primitive with a Plus icon.
  - `apps/admin-portal/src/components/tableConfig/sourceTableConfig.tsx` defines columns against the shared `ColumnDef` contract with explicit sizing/alignment hooks, loading skeletons, and standardized row actions (View and Delete).
  - Implemented `DebouncedSearchInput` for consistent search interaction by Source Name.
- Files changed (route-focused): [`apps/admin-portal/src/app/source/list/page.tsx`, `apps/admin-portal/src/components/tableConfig/sourceTableConfig.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, DataTable, Drawer, Skeleton, and Input primitives.`
- Verification note: `This logging update is based on the current source list route source changes and table configuration refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /source/list as PASS because the route-local migration has been completed.`



## Batch 9 - /membership/list/detail/[id] Route Refactor - 2026-05-06

- Route focus: /membership/list/detail/[id]
- Migration intent: Refactor the membership detail route onto the current shared primitive stack, standardizing the information cards and detail rows while preserving existing membership detail loading and profile display logic.
- Route-local behavior updates:
  - pps/admin-portal/src/app/membership/list/detail/[id]/page.tsx now renders the route shell with shared @repo/ui Box, Card, and Badge primitives, replacing older native layout and local UI components.
  - The refactor standardizes the Policy Holder Information and Insured Detail sections using shared Card and Box-based definition lists (dl, dt, dd).
  - Adopts ContentLoadingWrapper for consistent loading states during data fetching.
  - Standardized status rendering using the shared Badge primitive with semantic tone mapping (Active: success, Pending: warning, Inactive: secondary).
  - The page header is migrated to the relocated local PageHeader path, providing consistent breadcrumbs and back-navigation.
- Files changed (route-focused): [pps/admin-portal/src/app/membership/list/detail/[id]/page.tsx]
- Shared-ui impact: No new @repo/ui export is introduced. The route adopts existing shared Box, Card, Badge, and Spinner primitives while PageHeader remains app-local.
- Verification note: This logging update is based on the current membership detail route source changes. No new smoke, lint, or build evidence is added in this documentation entry.
- Tracker impact: Batch 9 page tracker should now treat /membership/list/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.

## Batch 9 - /policy/endorsement/list/export Route Refactor - 2026-05-06

- Route focus: `/policy/endorsement/list/export`
- Migration intent: `Refactor the endorsement list export page onto the current shared primitive stack, standardizing the report-generation layout and table rendering while preserving the existing data fetching and PDF/XLSX export logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/policy/endorsement/list/export/page.tsx` now adopts shared `@repo/ui` `Box`, `Button`, and `Spinner` primitives.
  - Transformed native HTML layout tags into the polymorphic `Box` component with appropriate semantic mapping.
  - Standardized the 'Generate PDF' and 'Generate XLSX' actions on shared `Button` primitives with updated styling and Download icons.
  - Replaced the bespoke loading indicator with the shared `Spinner` component.
  - Standardized the back affordance as a semantic `Box` (as a button) with a left chevron icon.
  - The refactor preserves the existing `jsPDF` and `xlsx` generation logic for report output while ensuring design-system alignment.
- Files changed (route-focused): [`apps/admin-portal/src/app/policy/endorsement/list/export/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, and Spinner primitives while the PDF/XLSX generation logic remains local.`
- Verification note: `This logging update is based on the current endorsement export route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /policy/endorsement/list/export as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /policy/list/import Route Refactor - 2026-05-06

- Route focus: `/policy/list/import`
- Migration intent: `Refactor the policy list import page onto the current shared primitive stack, standardizing the layout, file-upload, and table interaction while preserving the existing policy-import submission logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/policy/list/import/page.tsx` now renders the route shell with shared `@repo/ui` `Box`, `Button`, `Combobox`, and `Table` primitives.
  - The refactor standardizes the page header via a local `Box`-based implementation, featuring consistent back-navigation.
  - Standardized the file-upload and preview interaction, using `XLSX` to parse and display data in a shared `Table` component.
  - Standardized the channel selection using the shared `Combobox` primitive.
  - Replaced native HTML layout tags with the polymorphic `Box` component for design-system alignment.
- Files changed (route-focused): [`apps/admin-portal/src/app/policy/list/import/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, Combobox, and Table primitives.`
- Verification note: `This logging update is based on the current policy import route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /policy/list/import as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /policy/list/export Route Refactor - 2026-05-06

- Route focus: `/policy/list/export`
- Migration intent: `Refactor the policy list export page onto the current shared primitive stack, standardizing the report-generation layout and table rendering while preserving the existing data fetching and PDF/XLSX export logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/policy/list/export/page.tsx` now adopts shared `@repo/ui` `Box`, `Button`, and `Spinner` primitives.
  - Transformed native HTML layout and table tags into the polymorphic `Box` component with appropriate semantic mapping.
  - Standardized the 'Generate PDF' and 'Generate XLSX' actions on shared `Button` primitives with updated styling and Download icons.
  - Replaced the bespoke loading indicator with the shared `Spinner` component.
  - Standardized the report table rendering using `Box` composition while preserving the existing report template ref and data mapping.
- Files changed (route-focused): [`apps/admin-portal/src/app/policy/list/export/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, and Spinner primitives while the PDF/XLSX generation logic remains local.`
- Verification note: `This logging update is based on the current policy export route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /policy/list/export as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /report/campaign-analytics Route Refactor - 2026-05-06

- Route focus: `/report/campaign-analytics`
- Migration intent: `Refactor the campaign analytics report route onto the current shared primitive stack, standardizing the analytics dashboard, filters, and PDF export while preserving the existing data fetching, recharts visualization, and analytics logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/report/campaign-analytics/page.tsx` now renders the route shell and dashboard with shared `@repo/ui` `Box`, `Button`, and `Combobox` primitives.
  - Standardized the campaign selection filter using the shared `Combobox` primitive and standardized primary actions on shared `Button` primitives.
  - Replaced native HTML layout tags with the polymorphic `Box` component for design-system alignment and semantic mapping.
  - Integrated `ContentLoadingWrapper` for consistent loading states during analytics data fetching.
  - Preserved existing `recharts` integration for complex data visualization (Pie, Bar, Funnel, Area, and Line charts) while wrapping chart containers in `Box` primitives.
  - Standardized the 'Download PDF' action and preserved the `html2canvas`/`jsPDF` report generation logic.
- Files changed (route-focused): [`apps/admin-portal/src/app/report/campaign-analytics/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, and Combobox primitives while analytics visualization remains local.`
- Verification note: `This logging update is based on the current campaign analytics route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /report/campaign-analytics as PASS because the route-local migration has been completed.`

## Batch 9 - /report/performance Route Refactor - 2026-05-06

- Route focus: `/report/performance`
- Migration intent: `Refactor the performance report route onto the current shared primitive stack, standardizing the page layout and breadcrumbs while preserving the existing Looker Studio iframe integration.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/report/performance/page.tsx` now renders the route shell with shared `@repo/ui` `Box` primitives, replacing older native layout tags.
  - Standardized the page header with shared `Breadcrumb` primitives and standardized typography via `Box as="h2"`.
  - The Looker Studio iframe is now wrapped in a `Box` primitive for consistent layout control.
- Files changed (route-focused): [`apps/admin-portal/src/app/report/performance/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box and Breadcrumb primitives while the Looker Studio integration remains local.`
- Verification note: `This logging update is based on the current performance report route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /report/performance as PASS because the route-local migration has been completed.`

## Batch 9 - /transaction/list/export Route Refactor - 2026-05-06

- Route focus: `/transaction/list/export`
- Migration intent: `Refactor the transaction list export page onto the current shared primitive stack, standardizing the report-generation layout and table rendering while preserving the existing data fetching, filtering, and PDF/XLSX export logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/transaction/list/export/page.tsx` now adopts shared `@repo/ui` `Box`, `Button`, `Spinner`, and `Table` primitives.
  - Transformed native HTML layout and table tags into the polymorphic `Box` component with appropriate semantic mapping.
  - Standardized the 'Generate PDF' and 'Generate XLSX' actions on shared `Button` primitives with updated styling and Download icons.
  - Replaced the bespoke loading indicator with the shared `Spinner` component.
  - Standardized the back affordance as a semantic `Box` (as a button) with a `ChevronLeft` icon.
  - Preserves existing `localStorage` integration for export parameters and maintains the `jsPDF` and `xlsx` generation logic for report output.
- Files changed (route-focused): [`apps/admin-portal/src/app/transaction/list/export/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, Spinner, and Table primitives while the PDF/XLSX generation logic remains local.`
- Verification note: `This logging update is based on the current transaction export route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker can now treat /transaction/list/export as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /source/list/add and /source/list/detail/[id] Route Refactor - 2026-05-07

- Route focus: `/source/list/add`, `/source/list/detail/[id]`
- Migration intent: `Refactor the source add and detail routes onto the current shared primitive stack, standardizing the form layout and interaction while preserving existing source creation and update logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/source/list/add/page.tsx` and `apps/admin-portal/src/app/source/list/detail/[id]/page.tsx` now use the refactored `SourceForm` component.
  - `apps/admin-portal/src/components/forms/source-form/index.tsx` replaces the legacy `SourceForm/index.tsx` and adopts shared `@repo/ui` `Box`, `Button`, `Input`, `Select`, `Combobox`, and `Dialog` primitives.
  - The refactored form utilizes `Box` for all layout and semantic elements, standardizes the page header via the local `PageHeader` component, and leverages `ContentLoadingWrapper` for consistent loading states during data fetching and submission.
  - Standardized breadcrumbs and a `Box`-based back affordance are integrated into the new page layout.
- Files changed (route-focused): [`apps/admin-portal/src/app/source/list/add/page.tsx`, `apps/admin-portal/src/app/source/list/detail/[id]/page.tsx`, `apps/admin-portal/src/components/forms/source-form/index.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/forms/SourceForm/index.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The routes adopt existing shared Box, Button, Input, Select, Combobox, and Dialog primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current source add and detail route source changes and form refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat both /source/list/add and /source/list/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /sanction/list/add and /sanction/list/detail/[id] Route Refactor - 2026-05-07

- Route focus: `/sanction/list/add`, `/sanction/list/detail/[id]`
- Migration intent: `Refactor the sanction add and detail routes onto the current shared primitive stack, standardizing the form layout and interaction while preserving existing sanction creation and update logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/sanction/list/add/page.tsx` and `apps/admin-portal/src/app/sanction/list/detail/[id]/page.tsx` now use the refactored `SanctionForm` component.
  - `apps/admin-portal/src/components/forms/sanction-form/index.tsx` replaces the legacy `SanctionForm/index.tsx` and adopts shared `@repo/ui` `Box`, `Button`, `Combobox`, `DatePicker`, `Dialog`, and `Input` primitives.
  - The refactored form utilizes `Box` for all layout and semantic elements, standardizes the page header via the local `PageHeader` component, and leverages `ContentLoadingWrapper` for consistent loading states during data fetching and submission.
  - Standardized breadcrumbs and a `Box`-based back affordance are integrated into the new page layout.
  - Supports identity details (first, middle, last name), personal data (country, ID, phone, email), source selection, and blacklist details (date and reason) with validation and success/error feedback via `Dialog`.
- Files changed (route-focused): [`apps/admin-portal/src/app/sanction/list/add/page.tsx`, `apps/admin-portal/src/app/sanction/list/detail/[id]/page.tsx`, `apps/admin-portal/src/components/forms/sanction-form/index.tsx`, `apps/admin-portal/src/hooks/useSanctionForm.hooks.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/forms/SanctionForm/index.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The routes adopt existing shared Box, Button, Combobox, DatePicker, Dialog, and Input primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current sanction add and detail route source changes and form refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat both /sanction/list/add and /sanction/list/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /membership/list/upload Route Refactor - 2026-05-07

- Route focus: /membership/list/upload
- Migration intent: `Refactor the membership upload route onto the current shared primitive stack, standardizing the form layout, file upload, and data preview while preserving the existing membership upload logic for feedback and first-time creation.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/membership/list/upload/page.tsx` now adopts shared `@repo/ui` `Box`, `Button`, `Select`, `Combobox`, `Input`, and `Table` primitives.
  - Standardized the form layout using `Box` grid and flex compositions, replacing older native layout tags.
  - Replaced the bespoke file-upload UI with a standardized `Box` and `input` composition, including clear and preview actions.
  - Integrated `XLSX` for inline data preview, allowing users to inspect spreadsheet content before submission.
  - Standardized the data preview table using shared `@repo/ui` `Table` primitives with explicit empty states.
  - Preserved the existing upload logic, including permission checks, channel selection, and chunked uploads for first-time submissions without transactions.
- Files changed (route-focused): [`apps/admin-portal/src/app/membership/list/upload/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, Select, Combobox, Table, and Input primitives.`
- Verification note: `This logging update is based on the current membership upload route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /membership/list/upload as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /policy/endorsement/list/detail/[id]/upload Route Refactor - 2026-05-07

- Route focus: `/policy/endorsement/list/detail/[id]/upload`
- Migration intent: `Refactor the endorsement upload route onto the current shared primitive stack, standardizing the file upload form and data preview while preserving the existing bulk endorsement status update logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/policy/endorsement/list/detail/[id]/upload/page.tsx` now adopts shared `@repo/ui` `Box`, `Button`, `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, and `TableCell` primitives.
  - Standardized the page header using `Box as="h1"` and a `Box`-based back affordance with `ChevronLeft` icon, replacing native layout tags.
  - Replaced the bespoke file-upload UI with a standardized `Box` and `input` composition, incorporating inline clear (`X`) and preview (`Eye`) actions that share the same file-input row chrome.
  - Integrated `XLSX` for inline data preview, allowing users to inspect spreadsheet content before submission, including automatic Excel date serial–to–ISO conversion via a local `excelDateToISO` helper.
  - Standardized the data preview table using shared `@repo/ui` `Table` primitives with an explicit empty state featuring a `FileText` icon placeholder and descriptive copy.
  - Preserved the existing `useUpdateEndorsementStatusBulking` mutation hook integration for bulk endorsement status update on upload, including header key normalization via `toSnakeCase` and `setLoading` state coordination.
- Files changed (route-focused): [`apps/admin-portal/src/app/policy/endorsement/list/detail/[id]/upload/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, Table, TableHeader, TableRow, TableHead, TableBody, and TableCell primitives.`
- Verification note: `This logging update is based on the current endorsement upload route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /policy/endorsement/list/detail/[id]/upload as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /transaction/list/import/import Route Refactor - 2026-05-11

- Route focus: `/transaction/list/import/import`
- Migration intent: `Refactor the transaction import route onto the current shared primitive stack, standardizing the file upload form and CSV data preview while preserving the existing bulk transaction import logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/transaction/list/import/import/page.tsx` now adopts shared `@repo/ui` `Box`, `Button`, `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, and `TableCell` primitives.
  - Standardized the page header using `Box as="h1"` and a `Box`-based back affordance with `ChevronLeft` icon from `react-feather`, replacing native layout tags.
  - Replaced the bespoke file-upload UI with a standardized `Box`-and-`input` composition, incorporating inline clear (`X`) and preview (`Eye`) actions that share the same file-input row chrome.
  - Integrated `Papa` (papaparse) for inline CSV data preview, allowing users to inspect CSV content before submission via the `handlePreview` flow.
  - Standardized the data preview table using shared `@repo/ui` `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, and `TableCell` primitives, with dynamic column headers derived from parsed CSV keys.
  - Preserved the existing `useBulkCreateTransactions` mutation hook integration for bulk transaction creation on upload, including `setLoading` state coordination via `useScreen`.
- Files changed (route-focused): [`apps/admin-portal/src/app/transaction/list/import/import/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, Table, TableHeader, TableRow, TableHead, TableBody, and TableCell primitives.`
- Verification note: `This logging update is based on the current transaction import route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /transaction/list/import/import as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /transaction/list/add Route Refactor - 2026-05-11

- Route focus: `/transaction/list/add`
- Migration intent: `Refactor the transaction add page onto the current shared primitive stack, standardizing the full-form layout, field composition, and submission flow while preserving the existing conventional transaction creation logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/transaction/list/add/page.tsx` now adopts shared `@repo/ui` `Box`, `Button`, `Combobox`, `DatePicker`, `Input`, `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`, `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`, and `Textarea` primitives.
  - Legacy manual `Breadcrumb` composition (`BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbList`, `BreadcrumbPage`, `BreadcrumbSeparator`) and the `Link`-based back affordance are removed; the page now adopts the local `PageHeader` component from `@/components/page-header` for breadcrumbs, back button, title, and the Save action slot.
  - Wrapped the page in `ContentLoadingWrapper` from `@/components/ui/loading`, driven by `isSubmitting`, to render a full-page overlay during transaction creation.
  - `DatePicker` is adopted (new for this route) for the `insured_effective_date` and `insured_exp_date` fields, using `iconPosition="end"` and a local `parseDate` helper that safely converts the ISO string field value to a `Date` object for the picker.
  - `Select` for the `type` and `insured_payment_method` fields is migrated from the legacy shadcn-style manual composition pattern to the unified `options`-prop API, removing direct `SelectContent`/`SelectGroup`/`SelectItem` wiring for those fields.
  - A local `InlineSelect` helper component is introduced to encapsulate the phone-code dropdown pattern (code selector + number input fused with `rounded-r-none`/`rounded-l-none`), used consistently for `phone_number_code`, `insured_phone_number_code`, `agent_phone_number_code`, and `insured_premium_currency`.
  - Local helper components `RequiredMark`, `FieldError`, and `FormSection` are introduced to eliminate repetitive required-mark, error-display, and section-chrome JSX across the large form.
  - Strict TypeScript types `Option`, `ApiList`, `ApiOption`, `Customer`, `PlanPackage`, and `Plan` are introduced inline to replace the previously untyped API response casts.
  - Constants `fieldLabelClassName`, `invalidControlClassName`, and `defaultControlClassName` centralize the repeated Tailwind strings for label and control border states.
  - `cn` from `@/lib/utils`, `Link` from `next/navigation`, `ChevronLeft` and `SelectGroup` are removed; all layout nodes are now `Box`.
  - The `Save` icon from `react-feather` is adopted for the submit button inside `PageHeader`.
  - All existing data-fetching effects (`fetchChannels`, `fetchCustomers`, `fetchInsurances`, `fetchProductCategories`, `fetchCurrencies`, `fetchPlans`), field-watcher effects (`selectedType`, `selectedCustomer`, `selectedInsurance`, `selectedCategory`, `selectedPlan`), and the participants table CRUD handlers (`handleAddInsuredObject`, `handleSaveInsuredObject`, `handleEditInsuredObject`, `handleRemoveInsuredObject`) are preserved intact.
- Files changed (route-focused): [`apps/admin-portal/src/app/transaction/list/add/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route now adopts existing shared Box, Button, Combobox, DatePicker, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, and Textarea primitives while PageHeader and ContentLoadingWrapper remain app-local.`
- Verification note: `This logging update is based on the current transaction add route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /transaction/list/add as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /transaction/list/detail/[id] Route Refactor - 2026-05-11

- Route focus: `/transaction/list/detail/[id]`
- Migration intent: `Refactor the transaction detail page onto the current shared primitive stack, standardizing the detail view layout, premium calculation display, and status update action while preserving the existing transaction data fetching and payment status mutation logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/transaction/list/detail/[id]/page.tsx` now adopts shared `@repo/ui` `Box`, `Button`, and `Spinner` primitives.
  - Standardized the page header via the local `PageHeader` component from `@/components/page-header`, with breadcrumbs back to the transaction list and a conditional "Update to Paid" action button visible only for pending transactions.
  - A local `DetailItem` helper component is introduced to render key-value rows using `Box` composition with fixed label widths and break-word value overflow, replacing any legacy native layout nodes.
  - Premium calculation logic is implemented inline: currency conversion via a matched `CurrencyRate` entry, embedded plan discount via `plan.premium_discount_type`/`premium_discount_value`, voucher discount via `voucher_info.data`, and total fees accumulation from the `fees` array.
  - The `id` param is safely resolved from `useParams()` with an explicit string/array guard before passing to `useTransactionDetail`.
  - A full-screen `Spinner` is rendered while transaction data is loading; a "Transaction not found" empty state with a card shell is shown when the transaction is absent.
  - `toastNotification` is used for success and error feedback on the `handleUpdateToPaid` status mutation.
  - Strict inline TypeScript types `TransactionDetail`, `TransactionFee`, and `CurrencyRate` are introduced to replace previously untyped API response casts.
- Files changed (route-focused): [`apps/admin-portal/src/app/transaction/list/detail/[id]/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, and Spinner primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current transaction detail route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /transaction/list/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /masterdata/group/add and /masterdata/group/detail/[id] Route Refactor - 2026-05-13

- Route focus: `/masterdata/group/add`, `/masterdata/group/detail/[id]`
- Migration intent: `Refactor the group add and detail routes onto the current shared primitive stack, standardizing the form layout and group member management interaction while preserving existing group creation, role assignment, and user assignment logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/group/add/page.tsx` and `apps/admin-portal/src/app/masterdata/group/detail/[id]/page.tsx` now use the refactored `GroupForm` component.
  - `apps/admin-portal/src/components/forms/group-form/index.tsx` replaces the legacy `apps/admin-portal/src/components/forms/GroupForm/index.tsx` and adopts shared `@repo/ui` `Box`, `Button`, `Checkbox`, `Combobox`, `DataTable`, `Dialog`, `Image`, `Input`, `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, and `TableRow` primitives.
  - The refactored form utilizes `Box` for all layout and semantic elements, standardizes the page header via the local `PageHeader` component, and wraps the page in `ContentLoadingWrapper` for consistent loading states during save and detail-fetch operations.
  - The role management section renders an add-roles `Dialog` with a `Combobox` platform filter, an `Input` search field, and a `DataTable` with `Checkbox` selection columns and `CompactTablePagination`; current group roles are displayed in a shared `Table` with inline delete `Button` actions.
  - The user management section renders an add-users `Dialog` with an `Input` search field and a `DataTable` with `Checkbox` selection columns and `CompactTablePagination`; current group users are displayed in a shared `Table` with inline delete `Button` actions.
  - Label clickable areas are restricted to text-only via `inline-block` on `Box as="label"` elements.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/group/add/page.tsx`, `apps/admin-portal/src/app/masterdata/group/detail/[id]/page.tsx`, `apps/admin-portal/src/components/forms/group-form/index.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/forms/GroupForm/index.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The routes adopt existing shared Box, Button, Checkbox, Combobox, DataTable, Dialog, Image, Input, Table, TableBody, TableCell, TableHead, TableHeader, and TableRow primitives while PageHeader, ContentLoadingWrapper, and CompactTablePagination remain app-local.`
- Verification note: `This logging update is based on the current group add and detail route source changes and form refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat both /masterdata/group/add and /masterdata/group/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /promotion/campaign/add, /promotion/campaign/detail/[id], and /promotion/campaign/edit/[id] Route Refactor - 2026-05-13

- Route focus: `/promotion/campaign/add`, `/promotion/campaign/detail/[id]`, `/promotion/campaign/edit/[id]`
- Migration intent: `Refactor the campaign add, detail, and edit routes onto the current shared primitive stack, replacing the legacy CampaignForm with a new campaign-form component that standardizes the full form layout, selection modals, and submission flow while preserving existing campaign creation, update, and voucher management logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/promotion/campaign/add/page.tsx` and `apps/admin-portal/src/app/promotion/campaign/edit/[id]/page.tsx` are now thin wrappers that delegate entirely to the new `CampaignForm` component with `mode="create"` or `mode="edit"` respectively.
  - `apps/admin-portal/src/components/forms/campaign-form/index.tsx` replaces the legacy `CampaignForm/index.tsx` and adopts shared `@repo/ui` `Box`, `Button`, `Combobox`, `DatePicker`, `Dialog`, `DialogClose`, `DialogContent`, `DialogFooter`, `DialogHeader`, `DialogTitle`, `Input`, `Select`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectTrigger`, and `SelectValue` primitives.
  - The refactored form standardizes the page header via the local `PageHeader` component with breadcrumbs back to the campaign list and a submit action slot, and wraps the form in `ContentLoadingWrapper` for consistent loading states during campaign detail fetch.
  - `react-hook-form` `Controller`-based field composition is used for all form fields (`name`, `type`, `start_date`, `end_date`, `value_type`, `value`, `minimum_amount`, `maximum_amount`, `value_currency`), with `DatePicker` for date fields and `Combobox` for currency selection.
  - A local `SelectionSection` helper component encapsulates the channel, insurance, product, and plan multi-selection list chrome, each backed by a dedicated selection modal (`ChannelSelectionModal`, `InsuranceSelectionModal`, `ProductSelectionModal`, `PlanSelectionModal`) that preserves existing paginated multi-select logic.
  - A local `ErrorModal` helper component wraps the `Dialog` primitive for consistent alert/success message display on save operations.
  - Local `parseDateFieldValue` and `formatDateFieldValue` helpers handle safe ISO string ↔ `Date` object conversion for the `DatePicker` fields.
  - `apps/admin-portal/src/hooks/useCampaignForm.hooks.tsx` is refactored to use `useCreateCampaign` and `useUpdateCampaign` TanStack Query mutation hooks, `useCampaignDetail` for edit-mode hydration, and `useReferenceCurrencies`, `useChannelsV1`, `useInsurances`, `useProducts`, and `usePlans` query hooks for data fetching, replacing the previous imperative fetch pattern.
  - `apps/admin-portal/src/app/promotion/campaign/detail/[id]/page.tsx` adopts shared `@repo/ui` `Box`, `Button`, and `Spinner` primitives with local `SectionCard`, `DetailItem`, and `EmptyText` helper components for the read-only campaign detail view, and resolves relation names (channel, insurance, product, plan) by fetching from their respective services in parallel.
  - The detail page displays promotion metadata, associated channels/insurances/products/plans, and voucher details (for voucher-type campaigns), and provides an Edit button that navigates to the edit route.
  - `apps/admin-portal/src/services/promotion/hooks/mutations/useCreateCampaign.ts` and `useUpdateCampaign.ts` are updated to align with the mutation hook pattern used by `useCampaignForm`.
  - `apps/admin-portal/src/services/channel/api/channel.service.ts`, `product.service.ts`, and `promotion.service.ts` are updated to support the data-fetching needs of the refactored form and detail page.
- Files changed (route-focused): [`apps/admin-portal/src/app/promotion/campaign/add/page.tsx`, `apps/admin-portal/src/app/promotion/campaign/detail/[id]/page.tsx`, `apps/admin-portal/src/app/promotion/campaign/edit/[id]/page.tsx`, `apps/admin-portal/src/components/forms/campaign-form/index.tsx`, `apps/admin-portal/src/hooks/useCampaignForm.hooks.tsx`, `apps/admin-portal/src/hooks/useCampaign.hooks.tsx`, `apps/admin-portal/src/services/promotion/hooks/mutations/useCreateCampaign.ts`, `apps/admin-portal/src/services/promotion/hooks/mutations/useUpdateCampaign.ts`, `apps/admin-portal/src/services/channel/api/channel.service.ts`, `apps/admin-portal/src/services/product/api/product.service.ts`, `apps/admin-portal/src/services/promotion/api/promotion.service.ts`, `apps/admin-portal/src/app/promotion/components/channel-selection-modal.tsx`, `apps/admin-portal/src/app/promotion/components/insurance-selection-modal.tsx`, `apps/admin-portal/src/app/promotion/components/plan-selection-modal.tsx`, `apps/admin-portal/src/app/promotion/components/product-selection-modal.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/forms/CampaignForm/index.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The routes adopt existing shared Box, Button, Combobox, DatePicker, Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, and SelectValue primitives while PageHeader, ContentLoadingWrapper, and selection modals remain app-local.`
- Verification note: `This logging update is based on the current campaign add, detail, and edit route source changes and form refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /promotion/campaign/add, /promotion/campaign/detail/[id], and /promotion/campaign/edit/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`
