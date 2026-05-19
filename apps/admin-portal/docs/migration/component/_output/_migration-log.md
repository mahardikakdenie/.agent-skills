
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

## Batch 9 - /product-category/[category] Route Refactor - 2026-05-13

- Route focus: `/product-category/[category]`
- Migration intent: `Migrate the dynamic product-category catalog route onto the current shared primitive stack, standardizing the sidebar, filters, and table rendering on the shared DataTable instance API and Box polymorphic API while preserving the existing category-switching and plan management flow.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/product-category/[category]/page.tsx` now renders the route shell, category sidebar, and catalog content with shared `@repo/ui` `Box`, `Button`, `Combobox`, `DataTable`, and `Input` primitives.
  - The catalog list now mounts shared `@repo/ui` `DataTable` directly with manual pagination, column pinning, column resizing, and `CompactTablePagination` integration.
  - A `ProductCategorySection` sidebar component is introduced using the polymorphic `Box` API (`as="aside"`, `as="nav"`, `as="button"`, `as="h2"`, `as="span"`) with sticky positioning, overflow-aware scroll layout, and `aria-current` for the active category.
  - The page shell uses `useParams` to extract the `category` segment and delegates catalog content rendering to a `ProductCatalogContent` sub-component.
  - `activeCategoryLabel` is derived by matching `subMenuItems` against the current category slug, with a capitalization fallback for unmatched slugs.
- Files changed (route-focused): [`apps/admin-portal/src/app/product-category/[category]/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Button, Combobox, DataTable, and Input primitives while CompactTablePagination remains app-local.`
- Verification note: `This logging update is based on the current product-category/[category] route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /product-category/[category] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /product-category/[category]/detail/[id] Route Refactor - 2026-05-15

- Route focus: `/product-category/[category]/detail/[id]`
- Migration intent: `Refactor the product category detail route onto the current shared primitive stack, standardizing the plan form layout, breadcrumb navigation, and tab chrome with shared @repo/ui primitives while consolidating product category data-fetching into a single hooks module and migrating the benefit form and product service to the shared pattern.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/product-category/[category]/detail/[id]/page.tsx` now renders the route shell with shared `@repo/ui` `Box`, `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbList`, `BreadcrumbPage`, `BreadcrumbSeparator`, `Button`, `Combobox`, `Input`, `Tabs`, `TabsContent`, `TabsList`, and `TabsTrigger` primitives.
  - The page header standardizes breadcrumbs back to Product Catalog and the category list with a `Box`-based Back affordance using `router.back()`, and restricts label clickable areas to text-only with `inline-block` on `Box as="label"` elements.
  - The plan update form uses `ContentLoadingWrapper` for consistent loading states and renders `react-hook-form` `Controller`-based `Input` fields for plan name and slug, and `Combobox` fields for insurance and product selection with dependent product filtering on insurance change.
  - Tab chrome is rendered with shared `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent` primitives in the underline variant, with Packages, Benefits, Details, and Channels tabs delegating to their respective sub-components.
  - `apps/admin-portal/src/app/product-category/hooks.tsx` is refactored as a consolidated `useProducts` hook that centralizes all product category query and mutation wiring via TanStack Query, exposing plan detail, package, benefit, plan details, channel, insurance, and product queries alongside create, update, delete, upload, assign, and unassign mutations.
  - `apps/admin-portal/src/components/forms/product-catalog/benefit.form.tsx` adopts shared `@repo/ui` `Box`, `Button`, `Card`, `CardContent`, `CardHeader`, and `Input` primitives. It introduces a recursive `RecursiveBenefitForm` backed by `useFieldArray` for arbitrarily-nested sub-benefit trees and uses `FormProvider` with `zodResolver` and a `z.lazy` recursive schema for validation.
  - `apps/admin-portal/src/services/product/api/product.service.ts` is refactored to use a centralized `createApiClient` instance with a `withQuery` helper for consistent query-string serialization via `qs`.
- Files changed (route-focused): [`apps/admin-portal/src/app/product-category/[category]/detail/[id]/page.tsx`, `apps/admin-portal/src/app/product-category/hooks.tsx`, `apps/admin-portal/src/components/forms/product-catalog/benefit.form.tsx`, `apps/admin-portal/src/services/product/api/product.service.ts`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box, Breadcrumb family, Button, Card family, Combobox, Input, and Tabs family primitives while PageHeader and ContentLoadingWrapper remain app-local.`
- Verification note: `This logging update is based on the current product category detail route source changes, hooks consolidation, benefit form migration, and product service refactoring. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /product-category/[category]/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /product-category/[category]/detail/[id]/add-package Route Refactor - 2026-05-16

- Route focus: `/product-category/[category]/detail/[id]/add-package`
- Migration intent: `Refactor the product category add-package flow onto the current shared primitive stack, standardizing the dynamic package form layout, breadcrumb header, field-array controls, validation display, and save-state handling while preserving the existing create-package submission logic through useProducts.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/product-category/[category]/detail/[id]/add-package/page.tsx` remains a thin permission-gated route wrapper and delegates package creation to `ProductCategoryPackageForm`, with import and formatting alignment to the current route style.
  - `apps/admin-portal/src/components/forms/product-catalog/package.form.tsx` now standardizes the route header through the local `PageHeader` component with breadcrumbs back to Product Catalog, the current category, and product catalog detail.
  - `ProductCategoryPackageForm` now composes the form with shared `@repo/ui` `Box`, `Button`, `Input`, and `Select` primitives, uses `ContentLoadingWrapper` for save/update loading state, disables the submit action while saving, and renders the Save/Check icon state through the PageHeader action slot.
  - The premium, currency, dynamic search-config, range, active period, and active period unit fields now use `react-hook-form` `Controller` composition with shared input error props via a local `getFieldErrorMessage` helper.
  - `apps/admin-portal/src/components/forms/product-catalog/field-array-input.tsx` now adopts shared `Box`, `Button`, and `Input` primitives, renders field-array validation through the shared `Input` error prop, and stabilizes the responsive Add/Remove control layout.
  - `apps/admin-portal/src/app/product-category/[category]/detail/[id]/add-benefit/page.tsx` receives matching wrapper import and formatting alignment as part of the adjacent product-catalog add-route cleanup.
- Files changed (route-focused): [`apps/admin-portal/src/app/product-category/[category]/detail/[id]/add-package/page.tsx`, `apps/admin-portal/src/app/product-category/[category]/detail/[id]/add-benefit/page.tsx`, `apps/admin-portal/src/components/forms/product-catalog/package.form.tsx`, `apps/admin-portal/src/components/forms/product-catalog/field-array-input.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The add-package route now adopts existing shared Box, Button, Input, and Select primitives while PageHeader and ContentLoadingWrapper remain app-local.`
- Verification note: `This logging update is based on the current product category add-package route source changes and supporting package form/field-array refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /product-category/[category]/detail/[id]/add-package as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /product-category/[category]/detail/[id]/benefits Route Refactor - 2026-05-16

- Route focus: `/product-category/[category]/detail/[id]/benefits`
- Migration intent: `Refactor the product category plan benefits display page onto the current shared primitive stack, standardizing the plan name header and benefit card layout with shared Box primitives and the consolidated useProducts hook while preserving existing plan benefit view behavior.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/product-category/[category]/detail/[id]/benefits/page.tsx` now renders the route shell entirely with shared `@repo/ui` `Box` primitives, replacing any legacy container markup.
  - The page fetches plan data via the consolidated `useProducts` hook using the `planId` derived from `useParams`, consistent with the hook contract established in the adjacent detail route refactor.
  - The pipe-separated plan name string is split into individual `Box as="span"` segments, each rendered as a `block`-display labeled line beneath the "Plan Benefit" section heading, preserving multi-line plan name display.
  - Layout uses a `Box`-based card shell with `rounded-lg border border-slate-200 bg-white shadow-sm` styling consistent with the rest of the product-catalog detail family.
- Files changed (route-focused): [`apps/admin-portal/src/app/product-category/[category]/detail/[id]/benefits/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box primitives and the consolidated useProducts hook while the plan name parsing remains route-local.`
- Verification note: `This logging update is based on the current benefits page source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /product-category/[category]/detail/[id]/benefits as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /product-category/[category]/detail/[id]/details Route Refactor - 2026-05-16

- Route focus: `/product-category/[category]/detail/[id]/details`
- Migration intent: `Refactor the product category plan details display page onto the current shared primitive stack, standardizing the plan name header and detail card layout with shared Box primitives and the consolidated useProducts hook while preserving existing plan detail view behavior.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/product-category/[category]/detail/[id]/details/page.tsx` now renders the route shell entirely with shared `@repo/ui` `Box` primitives, replacing any legacy container markup.
  - The page fetches plan data via the consolidated `useProducts` hook using the `planId` derived from `useParams`, consistent with the hook contract established in the adjacent detail route refactor.
  - The pipe-separated plan name string is split into individual `Box as="span"` segments, each rendered as a `block`-display labeled line beneath the "Plan Detail" section heading, preserving multi-line plan name display.
  - Layout uses a `Box`-based card shell with `rounded-lg border border-slate-200 bg-white shadow-sm` styling consistent with the rest of the product-catalog detail family.
- Files changed (route-focused): [`apps/admin-portal/src/app/product-category/[category]/detail/[id]/details/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route adopts existing shared Box primitives and the consolidated useProducts hook while the plan name parsing remains route-local.`
- Verification note: `This logging update is based on the current details page source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /product-category/[category]/detail/[id]/details as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /product-category/[category]/detail/[id]/edit-package/[packageId] Route Refactor - 2026-05-16

- Route focus: `/product-category/[category]/detail/[id]/edit-package/[packageId]`
- Migration intent: `Migrate the product category edit-package flow onto the current shared primitive stack, extending the shared package form to handle update mode with package-detail hydration, shared Box, Button, Input, and Select primitives, and ContentLoadingWrapper while preserving the existing update-package submission logic through useProducts.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/product-category/[category]/detail/[id]/edit-package/[packageId]/page.tsx` is a thin permission-gated route wrapper that delegates package editing to `ProductCategoryPackageForm` with `method="update"`, passing `category`, `productCategoryID`, and `packageId` from route params resolved via `React.use(params)`.
  - `apps/admin-portal/src/components/forms/product-catalog/package.form.tsx` is extended to handle update mode alongside create mode: it fetches existing package data via the consolidated `useProducts` hook with `packageId`, hydrates all form fields from `packageDetail` (premium, currency, active_period, active_period_unit, and dynamic `search_params` with `_from`/`_to` range key mapping into nested `{from, to}` objects), and renders a shared `PageHeader` with breadcrumbs back to Product Catalog, the current category, and the product catalog detail.
  - The form wraps in `ContentLoadingWrapper` covering both save/update pending state (`isSaving`) and package-detail fetch state (`isLoadingPackage`), so the form skeleton is shown while the existing package is loading.
  - Submit action dispatches `updatePackage({ id: packageID, data: mappedData })` from the `useProducts` hook for the update path and navigates `router.back()` on success; the PageHeader action slot renders a `Check` icon button while in edit mode and a `Save` icon button in create mode.
  - `apps/admin-portal/src/app/product-category/hooks.tsx` is extended in the `useProducts` hook to accept an optional `packageId` prop, fetch package detail via `usePackageDetail`, expose `packageDetail`, `isLoadingPackage`, `updatePackage`, and `isLoadingUpdatePackage`, and wire `useUpdatePackage` with cache-invalidation for both `packagesByPlan` and `packageDetail` query keys on success.
  - `apps/admin-portal/src/services/product/api/product.service.ts` retains the `createApiClient` + `withQuery`/`qs`-based query-string serialization refactor introduced in the prior product-category detail route pass.
- Files changed (route-focused): [`apps/admin-portal/src/app/product-category/[category]/detail/[id]/edit-package/[packageId]/page.tsx`, `apps/admin-portal/src/app/product-category/hooks.tsx`, `apps/admin-portal/src/components/forms/product-catalog/package.form.tsx`, `apps/admin-portal/src/services/product/api/product.service.ts`]
- Shared-ui impact: `No new @repo/ui export is introduced. The edit-package route adopts existing shared Box, Button, Input, and Select primitives while PageHeader and ContentLoadingWrapper remain app-local.`
- Verification note: `This logging update is based on the current edit-package route source changes, package form update-mode extension, and useProducts hook consolidation. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /product-category/[category]/detail/[id]/edit-package/[packageId] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`
- Tracker impact: `Batch 9 page tracker should now treat /product-category/[category]/detail/[id]/details as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /product-category/[category]/detail/[id]/upload Route Refactor - 2026-05-16

- Route focus: `/product-category/[category]/detail/[id]/upload`
- Migration intent: `Refactor the product category upload package page onto the current shared primitive stack, standardizing the CSV file upload, preview table, and action button layout with shared Box, Button, FileUpload, and Table primitives and the consolidated useProducts hook while preserving the existing PapaParse-driven CSV preview and upload submission logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload/page.tsx` now renders the route shell entirely with shared `@repo/ui` `Box`, `Button`, `FileUpload`, `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell` primitives, replacing any legacy container markup.
  - The page fetches plan data and exposes the `uploadPackage` mutation via the consolidated `useProducts` hook using the `planId` and `category` derived from `useParams`, consistent with the hook contract established in adjacent product-category detail route refactors.
  - The pipe-separated plan name string is split into individual `Box as="span"` segments rendered as `block`-display lines beneath the "Upload Package" section heading, preserving multi-line plan name display.
  - A `FileUpload` primitive with `accept=".csv"` and `clearable` handles file selection; the `handleChooseFile` handler normalises single and array file values and resets the CSV preview state on each new selection.
  - A two-action button row renders "Preview" (disabled until a file is chosen and no preview yet exists) and "Upload" (disabled until preview data is present), both using shared `Button` primitives with responsive `w-full sm:w-auto` width control.
  - CSV parsing is performed by PapaParse in `header: true` / `skipEmptyLines: true` mode inside `handlePreview`, populating the `csvData` state that drives the preview table columns and rows.
  - The preview table is composed from shared `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell` primitives, with `whitespace-nowrap` on header and cell columns and a sentinel empty-state row rendered when no preview data is available.
  - The route wraps in `ContentLoadingWrapper` covering the `isLoadingUploadPackage` state from `useProducts`, consistent with the loading-wrapper convention used across the product-catalog detail family.
  - Layout uses `Box`-based card shells with `rounded-lg border border-slate-200 bg-white shadow-sm` styling consistent with the rest of the product-catalog detail family.
- Files changed (route-focused): [`apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The upload route now adopts existing shared Box, Button, FileUpload, Table, TableHeader, TableBody, TableRow, TableHead, and TableCell primitives while ContentLoadingWrapper and useProducts remain app-local.`
- Verification note: `This logging update is based on the current upload page source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /product-category/[category]/detail/[id]/upload as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /product-category/[category]/detail/[id]/upload-benefit Route Refactor - 2026-05-16

- Route focus: `/product-category/[category]/detail/[id]/upload-benefit`
- Migration intent: `Refactor the product category upload plan benefits page onto the current shared primitive stack, standardizing the CSV file upload, preview table, and action button layout with shared Box, Button, FileUpload, and Table primitives and the consolidated useProducts hook while preserving the existing PapaParse-driven CSV preview and plan-benefit upload submission logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload-benefit/page.tsx` now renders the route shell entirely with shared `@repo/ui` `Box`, `Button`, `FileUpload`, `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell` primitives, replacing any legacy container markup.
  - The page fetches plan data and exposes the `uploadPlanBenefits` mutation and `isLoadingUploadPlanBenefits` state via the consolidated `useProducts` hook using the `planId` and `category` derived from `useParams`, consistent with the hook contract established in adjacent product-category detail route refactors.
  - The pipe-separated plan name string is split into individual `Box as="span"` segments rendered as `block`-display lines beneath the "Upload Plan Benefits" section heading, preserving multi-line plan name display.
  - A `FileUpload` primitive with `accept=".csv"` and `clearable` handles file selection; the `handleChooseFile` handler normalises single and array file values and resets the CSV preview state on each new selection.
  - A two-action button row renders "Preview" (disabled until a file is chosen and no preview yet exists) and "Upload" (disabled until preview data is present), both using shared `Button` primitives with responsive `w-full sm:w-auto` width control.
  - CSV parsing is performed by PapaParse in `header: true` / `skipEmptyLines: true` mode inside `handlePreview`, populating the `csvData` state that drives the preview table columns and rows.
  - The preview table is composed from shared `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell` primitives, with `whitespace-nowrap` on header and cell columns and a sentinel empty-state row rendered when no preview data is available.
  - On successful upload, `router.push(AppURL.productCatalogDetail(category, id))` navigates back to the product catalog detail page, differing from the adjacent upload route which uses `router.back()`.
  - The route wraps in `ContentLoadingWrapper` covering the `isLoadingUploadPlanBenefits` state from `useProducts`, consistent with the loading-wrapper convention used across the product-catalog detail family.
  - Layout uses `Box`-based card shells with `rounded-lg border border-slate-200 bg-white shadow-sm` styling consistent with the rest of the product-catalog detail family.
- Files changed (route-focused): [`apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload-benefit/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The upload-benefit route now adopts existing shared Box, Button, FileUpload, Table, TableHeader, TableBody, TableRow, TableHead, and TableCell primitives while ContentLoadingWrapper and useProducts remain app-local.`
- Verification note: `This logging update is based on the current upload-benefit page source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /product-category/[category]/detail/[id]/upload-benefit as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - /product-category/[category]/detail/[id]/upload-detail Route Refactor - 2026-05-16

- Route focus: `/product-category/[category]/detail/[id]/upload-detail`
- Migration intent: `Refactor the product category upload plan details page onto the current shared primitive stack, standardizing the type selection, CSV file upload, preview table, and action button layout with shared Box, Button, Select, FileUpload, and Table primitives and the consolidated useProducts hook while preserving the existing PapaParse-driven CSV preview and plan-detail upload submission logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload-detail/page.tsx` now renders the route shell entirely with shared `@repo/ui` `Box`, `Button`, `FileUpload`, `Select`, `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell` primitives, replacing any legacy container markup.
  - The page fetches plan data and exposes the `uploadPlanDetails` mutation and `isLoadingUploadPlanDetails` state via the consolidated `useProducts` hook using the `planId` and `category` derived from `useParams`, consistent with the hook contract established in adjacent product-category detail route refactors.
  - The pipe-separated plan name string is split into individual `Box as="span"` segments rendered as `block`-display lines beneath the "Upload Plan Details" section heading, preserving multi-line plan name display.
  - A shared `Select` primitive with `label="Detail Type"`, `size="lg"`, and `DETAIL_TYPE_OPTIONS` (tnc, how-to-claim, exception, persentase) handles detail type selection; changing the type resets the CSV preview state via `handleTypeChange`.
  - A `FileUpload` primitive with `accept=".csv"` and `clearable` handles file selection; the `handleChooseFile` handler normalises single and array file values and resets the CSV preview state on each new selection.
  - A two-action button row renders "Preview" (disabled until a file is chosen and no preview yet exists) and "Upload" (disabled until preview data is present), both using shared `Button` primitives with responsive `w-full sm:w-auto` width control.
  - CSV parsing is performed by PapaParse in `header: true` / `skipEmptyLines: true` mode inside `handlePreview`, populating the `csvData` state that drives the preview table columns and rows.
  - The preview table is composed from shared `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell` primitives, with `whitespace-nowrap bg-slate-50` on header cells and `whitespace-nowrap` on data cells, and a sentinel empty-state row rendered when no preview data is available.
  - A grid layout `lg:grid-cols-[minmax(0,1fr)_auto]` is used for the FileUpload and action buttons row, providing responsive layout with the button group right-aligned on large screens.
  - On successful upload, `router.push(AppURL.productCatalogDetail(category, id))` navigates back to the product catalog detail page, consistent with the adjacent upload-benefit route.
  - The route wraps in `ContentLoadingWrapper` covering the `isLoadingUploadPlanDetails` state from `useProducts`, consistent with the loading-wrapper convention used across the product-catalog detail family.
  - Layout uses `Box`-based card shells with `rounded-lg border border-slate-200 bg-white shadow-sm` styling consistent with the rest of the product-catalog detail family.
- Files changed (route-focused): [`apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload-detail/page.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The upload-detail route now adopts existing shared Box, Button, FileUpload, Select, Table, TableHeader, TableBody, TableRow, TableHead, and TableCell primitives while ContentLoadingWrapper and useProducts remain app-local.`
- Verification note: `This logging update is based on the current upload-detail page source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /product-category/[category]/detail/[id]/upload-detail as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - /masterdata/email-template/add and /masterdata/email-template/detail/[id] Route Refactor - 2026-05-18

- Route focus: `/masterdata/email-template/add`, `/masterdata/email-template/detail/[id]`
- Migration intent: `Refactor the email-template create and edit routes onto the current shared primitive stack, extracting a shared EmailTemplateForm component with Box, Button, Combobox, Dialog, Input, RadioGroup, and Textarea primitives, adopting ContentLoadingWrapper for loading states, and standardizing the page header with breadcrumbs and back navigation while preserving the existing WYSIWYG editor, draft-js content model, and template creation/update submission logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/components/forms/email-template-form/index.tsx` (renamed from `EmailTemplateForm/index.tsx`) is a fully refactored shared form component that accepts a `mode: 'create' | 'edit'` prop and renders the complete email-template form UI using shared `@repo/ui` `Box`, `Button`, `Combobox`, `Dialog`, `DialogClose`, `DialogContent`, `DialogDescription`, `DialogHeader`, `DialogTitle`, `DialogTrigger`, `Input`, `RadioGroup`, `RadioGroupItem`, and `Textarea` primitives. The component renders a two-column layout: a settings panel (channel RadioGroup, cascaded category/insurance/product/plan/journey Combobox fields, and an email-tag insertion Combobox) and a template panel (subject Input and the draft-js `Editor` for email mode or a `Textarea` for WhatsApp mode). A Dialog-based preview pane renders the composed HTML or plain-text content before submission. The component wraps in `ContentLoadingWrapper` covering both `isSaving` and `isLoadingDetail`, and uses `PageHeader` with breadcrumbs for consistent navigation.
  - `apps/admin-portal/src/app/masterdata/email-template/add/page.tsx` is now a thin `'use client'` wrapper that calls `useEmailTemplateForm('create')` and renders `<EmailTemplateForm mode="create" ... />`, passing all form state, loading flags, and handler callbacks through as props with `isLoadingDetail={false}` fixed for the create path.
  - `apps/admin-portal/src/app/masterdata/email-template/detail/[id]/page.tsx` is now a thin `'use client'` wrapper that resolves `templateId` from `useParams`, calls `useEmailTemplateForm('edit')`, fires `loadTemplateDetail(templateId)` in a `useEffect` guard on mount, and renders `<EmailTemplateForm mode="edit" templateId={templateId} ... />`, passing all form state, loading flags, and handler callbacks as props.
  - `apps/admin-portal/src/hooks/useEmailTemplateForm.hooks.tsx` is refactored to encapsulate all form state management: `react-hook-form` with `shouldUnregister: false` and default values, cascaded query fetches for categories, insurances (enabled on `selectedCategoryId`), products (enabled on `selectedInsuranceId`), plans (enabled on `selectedProductId`), journeys, and email tags (enabled on `selectedJourneyId`) with `staleTime: 300000`. The hook manages `editorState` (draft-js `EditorState`), plain-text `content`, `selectedTemplateType`, and all four cascade-selection IDs as local state. Detail hydration for edit mode is driven by `useEmailTemplateJourneyDetail` (with `staleTime: 0`, `gcTime: 0`, `refetchOnMount: 'always'`), a `useEffect` that calls `reset()` and `setEditorState` (with `convertFromHTML` for email-type templates) when `templateDetail` loads, and three follow-up effects that re-apply insurance, product, and plan field values once their respective option lists resolve. `handleSave` dispatches `createEmailTemplateMutation.mutateAsync` or `updateEmailTemplateMutation.mutateAsync` based on mode, invalidates `email-templates` and `email-template-detail` query keys on success, and navigates to `AppURL.masterdataEmailTemplate`. `handleEditorInsert` uses `draft-js` `Modifier.replaceText` to inject email-tag strings at the current selection.
  - `apps/admin-portal/src/services/product/api/product.endpoints.ts` and `apps/admin-portal/src/services/product/api/product.service.ts` receive supporting updates for the email-template data fetching contract used by `useEmailTemplateJourneyDetail`.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/email-template/add/page.tsx`, `apps/admin-portal/src/app/masterdata/email-template/detail/[id]/page.tsx`, `apps/admin-portal/src/components/forms/email-template-form/index.tsx`, `apps/admin-portal/src/hooks/useEmailTemplateForm.hooks.tsx`, `apps/admin-portal/src/services/product/api/product.endpoints.ts`, `apps/admin-portal/src/services/product/api/product.service.ts`]
- Shared-ui impact: `No new @repo/ui export is introduced. Both routes adopt existing shared Box, Button, Combobox, Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Input, RadioGroup, RadioGroupItem, and Textarea primitives. The draft-js Editor remains dynamically loaded as a local dependency via next/dynamic with SSR disabled.`
- Verification note: `This logging update is based on the current email-template add and detail route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat /masterdata/email-template/add as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

## Batch 9 - / (root) Route Refactor - 2026-05-18

- Route focus: `/`
- Migration intent: `Refactor the home dashboard route onto the current shared primitive stack, standardizing all container and typography markup in home.view.tsx and home-2.view.tsx with shared Box primitives and updating proxy.ts route config while preserving all stat-card data fetching, chart rendering, and Looker Studio iframe behavior.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/page.tsx` is a thin `'use client'` wrapper that renders `<HomeView />`, delegating all UI logic to the view layer.
  - `apps/admin-portal/src/views/home/home.view.tsx` now renders the entire home dashboard shell using shared `@repo/ui` `Box` primitives throughout: all `div` and `p` containers are replaced with `Box` and `Box as="p"` respectively. Stat cards, chart panels (Policies and Claims doughnut, Countries pie, Total Policies stacked-bar, Total Claims stacked-bar, Total Revenue curve-line, Claim and Revenue doughnut), and legend label lists are all composed from `Box` and existing `Chart` components, with no legacy HTML container markup remaining.
  - `apps/admin-portal/src/views/home/home-2.view.tsx` now renders the Looker Studio reporting view using `Box as="iframe"` for the embed container and `Box as="p"` for the page title, replacing legacy HTML elements while preserving the existing `allowFullScreen`, `sandbox`, and `isMobileView`-responsive `minHeight` props.
  - `apps/admin-portal/src/proxy.ts` receives route config updates, standardizing the middleware matcher list to include all active top-level route prefixes while preserving the existing redirect-to-first-submenu logic for menu-level paths.
- Files changed (route-focused): [`apps/admin-portal/src/app/page.tsx`, `apps/admin-portal/src/views/home/home.view.tsx`, `apps/admin-portal/src/views/home/home-2.view.tsx`, `apps/admin-portal/src/proxy.ts`]
- Shared-ui impact: `No new @repo/ui export is introduced. The home dashboard route adopts existing shared Box primitive throughout home.view.tsx and home-2.view.tsx. Chart, useScreen, useAuth, and all data-fetching service calls remain app-local.`
- Verification note: `This logging update is based on the current home route source changes. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat / (root) as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`
- Tracker impact: `Batch 9 page tracker should now treat /masterdata/email-template/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`


## Batch 9 - Codebase-Wide File Naming Convention Normalization (kebab-case) - 2026-05-18

- Component focus: `tableConfig/`, `UserForm/`, `ui/DataTable/`, `ui/Fields/SelectAutocomplete/`, `ui/charts/*`, `OptimizeImageShell`, `provider/QueryProvider`, `finance/billing/detail/[id]/components/BillingDetail*`
- Migration intent: `Normalize all remaining legacy camelCase and PascalCase component directories and file names to kebab-case across the entire admin-portal codebase, and update all import paths in consuming page and view files to reflect the new locations. No behavioral changes are introduced; this pass closes the final naming-convention gap left after prior batch refactors.`
- Component-local behavior updates:
  - `apps/admin-portal/src/components/tableConfig/` directory (34 files) renamed to `apps/admin-portal/src/components/table-config/` with all contained files converted to kebab-case: `billingDetailTableConfig.tsx` → `billing-detail-table-config.tsx`, `billingTableConfig.tsx` → `billing-table-config.tsx`, `billingTransactionTableConfig.tsx` → `billing-transaction-table-config.tsx`, `brokerFeeTableConfig.tsx` → `broker-fee-table-config.tsx`, `campaignReportTableConfig.tsx` → `campaign-report-table-config.tsx`, `campaignTableConfig.tsx` → `campaign-table-config.tsx`, `channelTableConfig.tsx` → `channel-table-config.tsx`, `claimHistoryTableConfig.tsx` → `claim-history-table-config.tsx`, `claimReportTableConfig.tsx` → `claim-report-table-config.tsx`, `claimTableConfig.tsx` → `claim-table-config.tsx`, `currencyTableConfig.tsx` → `currency-table-config.tsx`, `emailTagTableConfig.tsx` → `email-tag-table-config.tsx`, `emailTemplateTableConfig.tsx` → `email-template-table-config.tsx`, `endorsementTableConfig.tsx` → `endorsement-table-config.tsx`, `exportUserTableConfig.tsx` → `export-user-table-config.tsx`, `groupTableConfig.tsx` → `group-table-config.tsx`, `holidayDateTableConfig.tsx` → `holiday-date-table-config.tsx`, `hospitalTableConfig.tsx` → `hospital-table-config.tsx`, `insuranceTableConfig.tsx` → `insurance-table-config.tsx`, `membershipTableConfig.tsx` → `membership-table-config.tsx`, `packageTableConfig.tsx` → `package-table-config.tsx`, `pageManagementTableConfig.tsx` → `page-management-table-config.tsx`, `partnerCommTableConfig.tsx` → `partner-comm-table-config.tsx`, `partnerManagmentTableConfig.tsx` → `partner-managment-table-config.tsx`, `policyTableConfig.tsx` → `policy-table-config.tsx`, `productCatalogTableConfig.tsx` → `product-catalog-table-config.tsx`, `productCategoryTableConfig.tsx` → `product-category-table-config.tsx`, `productTableConfig.tsx` → `product-table-config.tsx`, `roleTableConfig.tsx` → `role-table-config.tsx`, `sanctionTableConfig.tsx` → `sanction-table-config.tsx`, `sourceTableConfig.tsx` → `source-table-config.tsx`, `transactionTableConfig.tsx` → `transaction-table-config.tsx`, `unmatchBillingTableConfig.tsx` → `unmatch-billing-table-config.tsx`, `usersTableConfig.tsx` → `users-table-config.tsx`.
  - `apps/admin-portal/src/components/forms/UserForm/` directory (8 files) renamed to `apps/admin-portal/src/components/forms/user-form/` preserving the same `index.tsx`, `components/add-channel-modal.tsx`, `components/add-insurer-modal.tsx`, `components/user-channels.tsx`, `components/user-form.tsx`, `components/user-groups.tsx`, `components/user-insurers.tsx`, and `components/user-roles.tsx` file names (already kebab-case within).
  - `apps/admin-portal/src/components/ui/DataTable/index.tsx` renamed to `apps/admin-portal/src/components/ui/data-table/index.tsx`.
  - `apps/admin-portal/src/components/ui/Fields/SelectAutocomplete/index.tsx` renamed to `apps/admin-portal/src/components/ui/fields/select-autocomplete/index.tsx`.
  - `apps/admin-portal/src/components/ui/charts/barchart-horizontal.tsx` → `bar-chart-horizontal.tsx`, `barchart-vertical.tsx` → `bar-chart-vertical.tsx`, `dashedlinechart.tsx` → `dashed-line-chart.tsx`, `linechart.tsx` → `line-chart.tsx`, `piechart.tsx` → `pie-chart.tsx`.
  - `apps/admin-portal/src/components/OptimizeImageShell.tsx` renamed to `optimize-image-shell.tsx`; `apps/admin-portal/src/components/ui/OptimizeImageShell.tsx` renamed to `apps/admin-portal/src/components/ui/optimize-image-shell.tsx`.
  - `apps/admin-portal/src/provider/QueryProvider.tsx` renamed to `apps/admin-portal/src/provider/query-provider.tsx`.
  - `apps/admin-portal/src/app/finance/billing/detail/[id]/components/BillingDetailActions.tsx` renamed to `billing-detail-actions.tsx`; `BillingDetailInfo.tsx` renamed to `billing-detail-info.tsx`.
  - All consuming files had their import paths updated to reference the new kebab-case locations. Affected callers span ~50 route pages and views across claim, dashboard, export-users, finance (billing, broker-fee, partner-comm, unmatch-billing), layout, masterdata (channel, currency, email-tag, email-template, email-template/tag, group, holiday-date, hospital, insurance, page-management, partner-management, product-category, product, role, user/add, user/detail, user), membership, policy (endorsement/list, endorsement/list/detail, list, pending-renewals), product-category, promotion/campaign, report (campaign, claim), sanction, source, and transaction routes, as well as the `linechart-policy`, `image`, and `ui/image` shared components and the three dashboard views (claim, policy, transaction).
- Files renamed (complete list): [`apps/admin-portal/src/components/tableConfig/billingDetailTableConfig.tsx` → `table-config/billing-detail-table-config.tsx`, `billingTableConfig.tsx` → `billing-table-config.tsx`, `billingTransactionTableConfig.tsx` → `billing-transaction-table-config.tsx`, `brokerFeeTableConfig.tsx` → `broker-fee-table-config.tsx`, `campaignReportTableConfig.tsx` → `campaign-report-table-config.tsx`, `campaignTableConfig.tsx` → `campaign-table-config.tsx`, `channelTableConfig.tsx` → `channel-table-config.tsx`, `claimHistoryTableConfig.tsx` → `claim-history-table-config.tsx`, `claimReportTableConfig.tsx` → `claim-report-table-config.tsx`, `claimTableConfig.tsx` → `claim-table-config.tsx`, `currencyTableConfig.tsx` → `currency-table-config.tsx`, `emailTagTableConfig.tsx` → `email-tag-table-config.tsx`, `emailTemplateTableConfig.tsx` → `email-template-table-config.tsx`, `endorsementTableConfig.tsx` → `endorsement-table-config.tsx`, `exportUserTableConfig.tsx` → `export-user-table-config.tsx`, `groupTableConfig.tsx` → `group-table-config.tsx`, `holidayDateTableConfig.tsx` → `holiday-date-table-config.tsx`, `hospitalTableConfig.tsx` → `hospital-table-config.tsx`, `insuranceTableConfig.tsx` → `insurance-table-config.tsx`, `membershipTableConfig.tsx` → `membership-table-config.tsx`, `packageTableConfig.tsx` → `package-table-config.tsx`, `pageManagementTableConfig.tsx` → `page-management-table-config.tsx`, `partnerCommTableConfig.tsx` → `partner-comm-table-config.tsx`, `partnerManagmentTableConfig.tsx` → `partner-managment-table-config.tsx`, `policyTableConfig.tsx` → `policy-table-config.tsx`, `productCatalogTableConfig.tsx` → `product-catalog-table-config.tsx`, `productCategoryTableConfig.tsx` → `product-category-table-config.tsx`, `productTableConfig.tsx` → `product-table-config.tsx`, `roleTableConfig.tsx` → `role-table-config.tsx`, `sanctionTableConfig.tsx` → `sanction-table-config.tsx`, `sourceTableConfig.tsx` → `source-table-config.tsx`, `transactionTableConfig.tsx` → `transaction-table-config.tsx`, `unmatchBillingTableConfig.tsx` → `unmatch-billing-table-config.tsx`, `usersTableConfig.tsx` → `users-table-config.tsx`; `forms/UserForm/` → `forms/user-form/` (8 files); `ui/DataTable/index.tsx` → `ui/data-table/index.tsx`; `ui/Fields/SelectAutocomplete/index.tsx` → `ui/fields/select-autocomplete/index.tsx`; `ui/charts/barchart-horizontal.tsx` → `bar-chart-horizontal.tsx`, `barchart-vertical.tsx` → `bar-chart-vertical.tsx`, `dashedlinechart.tsx` → `dashed-line-chart.tsx`, `linechart.tsx` → `line-chart.tsx`, `piechart.tsx` → `pie-chart.tsx`; `components/OptimizeImageShell.tsx` → `optimize-image-shell.tsx`; `components/ui/OptimizeImageShell.tsx` → `optimize-image-shell.tsx`; `provider/QueryProvider.tsx` → `query-provider.tsx`; `finance/billing/detail/[id]/components/BillingDetailActions.tsx` → `billing-detail-actions.tsx`, `BillingDetailInfo.tsx` → `billing-detail-info.tsx`]
- Shared-ui impact: `No @repo/ui exports are added or changed. This is a pure file-system rename pass; all shared primitive usages remain identical to the state established in prior Batch 9 entries.`
- Verification note: `This logging update is based on the current git rename and import-path diff. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `No page migration status changes. This entry records infrastructure hygiene work only; all route migration PASS/FAIL states remain as previously recorded in the Batch 9 tracker.`


## Batch 9 - ExtendedSidemenuShell File Naming Convention Follow-up (kebab-case) - 2026-05-18

- Component focus: `ExtendedSidemenuShell`
- Migration intent: `Rename the remaining PascalCase ExtendedSidemenuShell.tsx file to kebab-case to close the one gap left after the codebase-wide naming normalization pass. No behavioral changes are introduced.`
- Component-local behavior updates:
  - `apps/admin-portal/src/components/ExtendedSidemenuShell.tsx` is deleted and replaced by the identically-content `apps/admin-portal/src/components/extended-sidemenu-shell.tsx`, completing the kebab-case rename for this shell component that was missed in the prior normalization pass.
  - `apps/admin-portal/src/components/extended-sidemenu.tsx` has its import path updated from `./ExtendedSidemenuShell` to `./extended-sidemenu-shell` to reference the renamed file; all other props and logic remain unchanged.
- Files renamed: [`apps/admin-portal/src/components/ExtendedSidemenuShell.tsx` → `apps/admin-portal/src/components/extended-sidemenu-shell.tsx`]
- Files changed (import path only): [`apps/admin-portal/src/components/extended-sidemenu.tsx`]
- Docs updated: `_audit-report.md` and `_component-backlog.csv` source_path fields for ExtendedSidemenuShell updated from `src/components/ExtendedSidemenuShell.tsx` to `src/components/extended-sidemenu-shell.tsx`.
- Shared-ui impact: `No @repo/ui exports are added or changed. This is a pure file-system rename; all shared Box and react-feather usages inside the shell remain identical.`
- Verification note: `This logging update is based on the current git delete/add diff for the shell file and the import-path change in extended-sidemenu.tsx. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `No page migration status changes. This entry records naming-convention hygiene work only; all route migration PASS/FAIL states remain as previously recorded in the Batch 9 tracker.`

## Legacy Update Resume Record - 2026-05-18 15:19 (+07)

- Status: [RESUME] Resumed after legacy update.
- Legacy update integrated: `2026-05-18 15:19 +07`.
- L1 source: `admin-portal/stage` into `integrate-app/admin-portal`, then merge to `migrate-app/admin-portal`.
- L2 conflict resolution:
  - `apps/admin-portal/package-lock.json`: app configuration/package-manager cleanup, kept migrate deletion.
  - `apps/admin-portal/package.json`: app configuration, kept migration package identity and React 19/Next 16/Tailwind 4 dependency baseline.
  - `apps/admin-portal/src/app/masterdata/channel/page.tsx`: migrated route, kept shared `@repo/ui` layout and manually applied legacy delete confirmation dialog behavior.
  - `apps/admin-portal/src/hooks/useChannel.hooks.tsx`: app hook, kept migrated channel service hook and manually applied legacy cascade-delete provider behavior.
  - `apps/admin-portal/src/hooks/useUserForm.hooks.tsx`: app hook, kept migrated auth service hooks and applied legacy password omission condition.
  - `apps/admin-portal/src/components/tableConfig/claimTableConfig.tsx`: old-path table config, kept migrated kebab-case file and applied legacy `Policy ID` column to `src/components/table-config/claim-table-config.tsx`.
  - `apps/admin-portal/src/components/tableConfig/transactionTableConfig.tsx`: old-path table config, kept migrated kebab-case file and applied legacy `Invoice Number` column to `src/components/table-config/transaction-table-config.tsx`.
  - `apps/admin-portal/src/hooks/useExportClaim.hooks.tsx`: old-path hook, kept migrated `.ts` service-hook file and applied legacy GrabExpress `Draft Date` / `Submitted Date` export fields to `src/hooks/useExportClaim.hooks.ts`.
- Affected components/routes:
  - New app-local routes: `/configurations`, `/configurations/channel-mapping`, `/configurations/third-party`.
  - Existing migrated route: `/masterdata/channel`.
  - Existing migrated exports/tables: claim export, claim table, transaction table.
- New packages/ui intake items: none.
- New Batch 1.5 candidates:
  - `ConfigurationsView` (`src/views/configurations/configurations.view.tsx`) - `MIGRATE_AFTER_SPLIT`, container-shell.
  - `ChannelMappingView` (`src/views/configurations/channel-mapping.view.tsx`) - `MIGRATE_AFTER_SPLIT`, container-shell.
  - `ThirdPartyConfigView` (`src/views/configurations/third-party-config.view.tsx`) - `MIGRATE_AFTER_SPLIT`, container-shell.
- Cross-track impact:
  - Service-facing changes added CRM/communication service files and new hooks using legacy API clients. Component flow preserved them as app-local; service migration should review these endpoints before any future service-track cleanup.
- Verification:
  - Merge Health Check `pnpm --filter admin-portal check-types`: PASS.
  - Merge Health Check `pnpm --filter admin-portal build`: PASS.
  - L6 `pnpm --filter admin-portal lint`: PASS (warnings only).
  - L6 migrated component integrity check: PASS; old `src/components/tableConfig` directory and `src/hooks/useExportClaim.hooks.tsx` did not reappear.
- Next step: continue Batch 9 route migration work, with a future Batch 1.5 follow-up for the three new configuration views.

## Batch 1.5 - /configurations and /configurations/channel-mapping Route Refactor - 2026-05-18

- Route focus: `/configurations`, `/configurations/channel-mapping`
- Migration intent: `Refactor the configurations and channel-mapping routes onto the current shared primitive stack — standardizing layout, table configuration, search, and pagination while preserving existing CRUD and CRM-routing behavior.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/configurations/page.tsx` and `apps/admin-portal/src/app/configurations/channel-mapping/page.tsx` received quote-style normalization only (double → single quotes); no behavioral changes.
  - `apps/admin-portal/src/hooks/useChannelMapping.hooks.tsx` introduces local `ChannelOption`, `ApiListResponse<T>`, and `ApiErrorLike` interfaces, replacing all prior `any` casts. An `extractList<T>` helper centralizes the array/nested-data normalization that was previously duplicated inline for `mappings`, `thirdParties`, and `channels`. A `getErrorMessage` helper replaces inline `error?.response?.data?.message || fallback` patterns. All mutation `onError` handlers are now typed as `unknown`. The lodash `_.debounce` wrapper around `handleSearch` is removed; `handleSearch` is now a plain `useCallback` setter — debouncing is delegated to the consuming `DebouncedSearchInput` component. The `channel-mappings` query no longer depends on `isChannelsLoaded`; it loads independently so the table renders even when the channel-label request is slow or fails. `search` is added to the hook's return value so the view can pass a controlled value to `DebouncedSearchInput`. `useMemo` import is dropped.
  - `apps/admin-portal/src/views/configurations/channel-mapping.view.tsx` adopts `Box` from `@repo/ui` for all layout and semantic elements, replacing every native `div`/`p`/`span`. `DebouncedSearchInput` (from `@/components/ui/debounced-search-input`) replaces the plain `Input` toolbar, receiving `value={search}` for controlled behavior and `onDebouncedChange={handleSearch}` so the debounce lives in the component. `CompactTablePagination` (from `@/components/ui/compact-table-pagination`) is wired as `renderPagination`. All `ColumnDef` entries gain `accessorFn`, `enableSorting: false`, explicit `size`/`minSize`, and `meta` header/cell className props for consistent column layout. Column pinning is enabled with `channel` pinned left and `actions` pinned right. The empty state is replaced by a `next/image`-based `noData` illustration with a descriptive alt text. Action buttons are replaced with `Box as="button" type="button"` carrying accessible `aria-label` attributes and focus-ring styles. Dialog footer buttons receive `min-w-24` and explicit disabled-state styling. The edit-mode channel input now shows a `{name} ({id})` combined label derived from the channels list. `renderFormFields` is refactored to use `Box` wrappers with tighter spacing (`gap-5 px-6 py-5`). The `PAGE_SIZE_OPTIONS` constant (`[10, 20, 30, 50, 100]`) is defined at module scope and shared between `pageSizeOptions` and `CompactTablePagination`.
  - `apps/admin-portal/src/views/configurations/configurations.view.tsx` adopts `Box` from `@repo/ui` for all layout and semantic elements. Action buttons are replaced with `Box as="button" type="button"`. The previously misaligned indentation inside `renderFormFields` and the `DataTable` block is corrected. Error message paragraphs are replaced with `Box as="p"`. All string literals are normalized to single quotes.
- Files changed (route-focused): [`apps/admin-portal/src/app/configurations/channel-mapping/page.tsx`, `apps/admin-portal/src/app/configurations/page.tsx`, `apps/admin-portal/src/hooks/useChannelMapping.hooks.tsx`, `apps/admin-portal/src/views/configurations/channel-mapping.view.tsx`, `apps/admin-portal/src/views/configurations/configurations.view.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. Both routes now adopt the existing shared Box primitive alongside the already-used Badge, Button, DataTable, Dialog, Input, Label, Select, and Switch. Two app-local shared components are composed: DebouncedSearchInput and CompactTablePagination.`
- Verification note: `This logging update is based on the current git diff for the five modified files. No new smoke, lint, or build evidence is added in this documentation entry.`

## Batch 1.5 - /configurations/third-party Route Refactor - 2026-05-18

- Route focus: `/configurations/third-party`
- Migration intent: `Refactor the third-party configuration route onto the current shared primitive stack — standardizing layout, table configuration, search, pagination, and accessible action buttons while preserving all existing CRUD behavior.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/configurations/third-party/page.tsx` receives quote-style normalization only (double → single quotes); no behavioral changes.
  - `apps/admin-portal/src/views/configurations/third-party-config.view.tsx` adopts `Box` from `@repo/ui` for all layout and semantic elements, replacing every native `div`, `p`, `span`, `button`, `textarea`, and `h1`. `useScreen` / `isMobileView` are removed; mobile-responsive layout is now expressed via Tailwind responsive prefixes (`md:`, `sm:`, `xl:`, `2xl:`). `DebouncedSearchInput` (from `@/components/ui/debounced-search-input`) replaces the plain `Input` toolbar, receiving `value={search}` for controlled behavior and `onDebouncedChange={handleSearch}` so debounce lives in the component. `CompactTablePagination` (from `@/components/ui/compact-table-pagination`) is wired as `renderPagination`. The `next/image` `Image` component and `noData` webp asset are introduced to replace the plain string empty state with an illustration and descriptive alt text. `PAGE_SIZE_OPTIONS` constant (`[10, 20, 30, 50, 100]`) is defined at module scope and shared between `pageSizeOptions` and `CompactTablePagination`. All `ColumnDef` entries gain `accessorFn`, `enableSorting: false`, explicit `size`/`minSize`, and `meta` header/cell className props for consistent column layout. Column pinning is enabled with `name` pinned left and `actions` pinned right; `DataTable` receives `tableOptions` with `enableColumnPinning`, `enableColumnResizing`, `defaultColumn`, and `getRowId`. The `name` column cell now wraps its value in `Box as="span"` with `font-medium text-slate-950`. The `code` column gains a null-guard `accessorFn` and a `'-'` fallback in the cell renderer. The `access_token` column's `<span>` is replaced with `Box as="span"`. `maskValue` bullet characters (`••••`) are replaced with ASCII asterisks (`****`). Action buttons are replaced with `Box as="button" type="button"` carrying accessible `aria-label` attributes and full focus-ring styles. `renderSensitiveField` toggle button gains `aria-label`, `h-8 w-8` sizing, and focus-ring styles. `renderFormFields` spacing tightened: `gap-4 py-4` → `gap-5 px-6 py-5`; all field wrapper `<div>` replaced with `Box`; `gap-2` → `gap-2.5`. Help text paragraphs replaced with `Box as="p"` and `max-w-[56ch] text-xs leading-5 text-slate-500`. Root layout changed from `div.mx-auto.py-5.px-7` to `Box.flex.min-h-0.w-full.flex-1.flex-col.gap-3.p-4.md:p-6`. Page header changed from `<p>` to `Box as="h1"` with `text-2xl font-bold text-black`. The "Add Configuration" button is wrapped in a responsive action-bar `Box`. Dialog `DialogHeader` gains `className="gap-2"` and `DialogDescription` gains `className="max-w-[60ch]"`. Dialog footer Cancel and primary action buttons gain `min-w-24` and explicit `disabled:border disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-100` styling. `initConfigJson` is moved above the column definitions. `search` is now destructured from `useThirdPartyConfig` so the toolbar can pass a controlled value.
- Files changed (route-focused): [`apps/admin-portal/src/app/configurations/third-party/page.tsx`, `apps/admin-portal/src/views/configurations/third-party-config.view.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The route now adopts the existing shared Box primitive alongside the already-used Badge, Button, DataTable, Dialog, Input, Label, Switch. Two app-local shared components are composed: DebouncedSearchInput and CompactTablePagination.`
- Verification note: `This logging update is based on the current git diff for the two modified files. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 1.5 page tracker should now treat /configurations/third-party as PASS because the route-local migration work is now considered complete for the current Batch 1.5 tracking pass.`
- Tracker impact: `Batch 1.5 page tracker can now treat /configurations and /configurations/channel-mapping as PASS. /configurations/third-party remains a future Batch 1.5 candidate.`


## Batch 10 - Component Directory Consolidation into `core/` - 2026-05-19

- Component focus: `src/components/` root components, `src/components/ui/` sub-components, `src/components/icons/` icons, and `src/images/` icon files
- Migration intent: `Consolidate all scattered app-local shared components — previously split across src/components/ root, src/components/ui/, src/components/icons/, and src/images/ — into a single src/components/core/ directory, establish a README that documents the new component tree structure, and update every import path across the codebase to reflect the new locations. No behavioral changes are introduced; this pass closes the structural fragmentation left after prior batch refactors and naming-convention normalizations.`
- Component-local behavior updates:
  - The following components are relocated from `src/components/` root to `src/components/core/`: `button.tsx`, `chart.tsx`, `date-range-picker.tsx`, `datepicker.tsx`, `drag-drop-excel.tsx`, `extended-sidemenu-shell.tsx`, `extended-sidemenu.tsx`, `image-or-default.tsx`, `image.tsx`, `input.tsx`, `linechart-policy.tsx`, `loader.tsx`, `microsoft-login-button.tsx`, `modal.tsx`, `multiple-select.tsx`, `not-found.tsx`, `optimize-image-shell.tsx`, `pagination.tsx`, `select.tsx`, `table-policy.tsx`, `textarea.tsx`, `tooltip.tsx`.
  - The following components are relocated from `src/components/ui/` to `src/components/core/`: `charts/bar-chart-horizontal.tsx`, `charts/bar-chart-vertical.tsx`, `charts/dashed-line-chart.tsx`, `charts/line-chart.tsx`, `charts/pie-chart.tsx`, `compact-table-pagination.tsx`, `data-table/index.tsx` (flattened to `data-table.tsx`), `debounced-search-input.tsx`, `loading.tsx`, `select-phone-code.tsx`.
  - The following icon components are relocated from `src/components/icons/` to `src/components/core/`: `alert-circle-icon.tsx`, `edit-icon.tsx`.
  - The following icon files are relocated from `src/images/` to `src/components/core/`: `add.icon.tsx`, `calender.icon.tsx`, `checklist.icon.tsx`, `commission.icon.tsx`, `download.icon.tsx`, `globe-location-2.icon.tsx`, `globe-location.icon.tsx`, `hamburger.icon.tsx`, `revenue-2.icon.tsx`, `search.icon.tsx`, `secure-doc-2.icon.tsx`, `see.icon.tsx`, `trash.icon.tsx`, `unsee.icon.tsx`, `upload.icon.tsx`, `wifi-off.icon.tsx`, `x-circle.icon.tsx`, `x.icon.tsx`.
  - The following page-header components are relocated from `src/components/page-header/` to `src/components/core/`: `index.tsx` (as `page-header.tsx`), `page-header-shell.tsx`.
  - `apps/admin-portal/src/components/README.md` is introduced to document the new component tree: `core/` for shared cross-route components, `forms/` for feature form components, and `table-config/` for table column factories.
  - All consuming files — spanning route pages, views, hooks, contexts, forms, table configs, and the constants file — have their import paths updated from `@/components/button`, `@/components/ui/loading`, `@/components/page-header`, `@/images/wifi-off.icon`, etc. to the consolidated `@/components/core/<name>` paths. Affected callers include all pages under `claim`, `dashboard`, `export-users`, `finance`, `masterdata`, `membership`, `policy`, `product-category`, `promotion`, `report`, `sanction`, `source`, and `transaction`, as well as all views, hooks, contexts, and form components that referenced the relocated files.
- Files relocated (source → destination):
  - `src/components/button.tsx` → `src/components/core/button.tsx`
  - `src/components/chart.tsx` → `src/components/core/chart.tsx`
  - `src/components/date-range-picker.tsx` → `src/components/core/date-range-picker.tsx`
  - `src/components/datepicker.tsx` → `src/components/core/datepicker.tsx`
  - `src/components/drag-drop-excel.tsx` → `src/components/core/drag-drop-excel.tsx`
  - `src/components/extended-sidemenu-shell.tsx` → `src/components/core/extended-sidemenu-shell.tsx`
  - `src/components/extended-sidemenu.tsx` → `src/components/core/extended-sidemenu.tsx`
  - `src/components/icons/alert-circle-icon.tsx` → `src/components/core/alert-circle-icon.tsx`
  - `src/components/icons/edit-icon.tsx` → `src/components/core/edit-icon.tsx`
  - `src/components/image-or-default.tsx` → `src/components/core/image-or-default.tsx`
  - `src/components/image.tsx` → `src/components/core/image.tsx`
  - `src/components/input.tsx` → `src/components/core/input.tsx`
  - `src/components/linechart-policy.tsx` → `src/components/core/linechart-policy.tsx`
  - `src/components/loader.tsx` → `src/components/core/loader.tsx`
  - `src/components/microsoft-login-button.tsx` → `src/components/core/microsoft-login-button.tsx`
  - `src/components/modal.tsx` → `src/components/core/modal.tsx`
  - `src/components/multiple-select.tsx` → `src/components/core/multiple-select.tsx`
  - `src/components/not-found.tsx` → `src/components/core/not-found.tsx`
  - `src/components/optimize-image-shell.tsx` → `src/components/core/optimize-image-shell.tsx`
  - `src/components/page-header/index.tsx` → `src/components/core/page-header.tsx`
  - `src/components/page-header/page-header-shell.tsx` → `src/components/core/page-header-shell.tsx`
  - `src/components/pagination.tsx` → `src/components/core/pagination.tsx`
  - `src/components/select.tsx` → `src/components/core/select.tsx`
  - `src/components/table-policy.tsx` → `src/components/core/table-policy.tsx`
  - `src/components/textarea.tsx` → `src/components/core/textarea.tsx`
  - `src/components/tooltip.tsx` → `src/components/core/tooltip.tsx`
  - `src/components/ui/charts/bar-chart-horizontal.tsx` → `src/components/core/bar-chart-horizontal.tsx`
  - `src/components/ui/charts/bar-chart-vertical.tsx` → `src/components/core/bar-chart-vertical.tsx`
  - `src/components/ui/charts/dashed-line-chart.tsx` → `src/components/core/dashed-line-chart.tsx`
  - `src/components/ui/charts/line-chart.tsx` → `src/components/core/line-chart.tsx`
  - `src/components/ui/charts/pie-chart.tsx` → `src/components/core/pie-chart.tsx`
  - `src/components/ui/compact-table-pagination.tsx` → `src/components/core/compact-table-pagination.tsx`
  - `src/components/ui/data-table/index.tsx` → `src/components/core/data-table.tsx`
  - `src/components/ui/debounced-search-input.tsx` → `src/components/core/debounced-search-input.tsx`
  - `src/components/ui/loading.tsx` → `src/components/core/loading.tsx`
  - `src/components/ui/select-phone-code.tsx` → `src/components/core/select-phone-code.tsx`
  - `src/images/add.icon.tsx` → `src/components/core/add.icon.tsx`
  - `src/images/calender.icon.tsx` → `src/components/core/calender.icon.tsx`
  - `src/images/checklist.icon.tsx` → `src/components/core/checklist.icon.tsx`
  - `src/images/commission.icon.tsx` → `src/components/core/commission.icon.tsx`
  - `src/images/download.icon.tsx` → `src/components/core/download.icon.tsx`
  - `src/images/globe-location-2.icon.tsx` → `src/components/core/globe-location-2.icon.tsx`
  - `src/images/globe-location.icon.tsx` → `src/components/core/globe-location.icon.tsx`
  - `src/images/hamburger.icon.tsx` → `src/components/core/hamburger.icon.tsx`
  - `src/images/revenue-2.icon.tsx` → `src/components/core/revenue-2.icon.tsx`
  - `src/images/search.icon.tsx` → `src/components/core/search.icon.tsx`
  - `src/images/secure-doc-2.icon.tsx` → `src/components/core/secure-doc-2.icon.tsx`
  - `src/images/see.icon.tsx` → `src/components/core/see.icon.tsx`
  - `src/images/trash.icon.tsx` → `src/components/core/trash.icon.tsx`
  - `src/images/unsee.icon.tsx` → `src/components/core/unsee.icon.tsx`
  - `src/images/upload.icon.tsx` → `src/components/core/upload.icon.tsx`
  - `src/images/wifi-off.icon.tsx` → `src/components/core/wifi-off.icon.tsx`
  - `src/images/x-circle.icon.tsx` → `src/components/core/x-circle.icon.tsx`
  - `src/images/x.icon.tsx` → `src/components/core/x.icon.tsx`
- New files added: [`apps/admin-portal/src/components/README.md`]
- Shared-ui impact: `No @repo/ui exports are added or changed. This is a pure file-system relocation pass; all shared primitive usages remain identical to the state established in prior Batch 9 and Batch 1.5 entries.`
- Verification note: `This logging update is based on the current git diff for all relocated files and their import-path update callers. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `No page migration status changes. This entry records structural consolidation work only; all route migration PASS/FAIL states remain as previously recorded.`


## Batch 10 - Lib Directory Restructuring, Provider Relocation, and Type Extraction - 2026-05-19

- Component focus: `src/helpers/`, `src/lib/` root HTTP-client files, `src/provider/`, `src/interface/`
- Migration intent: `Restructure the non-component shared infrastructure layer: consolidate the helpers directory into lib/, namespace the HTTP client files into a lib/http-client/ sub-directory, relocate the TanStack Query provider from a standalone provider/ directory into lib/react-query/, extract claim-domain type definitions from the legacy src/interface/ barrel into a dedicated src/types/claim-form.ts module, and update every import path across the codebase. No behavioral changes are introduced; this pass closes the directory fragmentation left after prior batch service refactors.`
- Structural updates:
  - `apps/admin-portal/src/helpers/app.helper.tsx` is deleted and its contents (`setCookie`, `getCookie`, `removeCookie`, `setLocalStorage`, `getLocalStorage`, `removeAllLocalStorage`, `formatMoney`, `moneyFormatter`, `parseMoneyString`, `numberSimpleFormatter`, `getPaddingClass`, `getHeaderPage`, `getBreadcrumbs`, `getColorForBarChart`, `capitalizeString`, `capitalizeStringWithChar`, `toCamelCase`, `filename2Str`, `forLabelString`, `toastNotification`, `startDateAndEndDateView`, `formatDateTimeWithTZ`) are now exported from `apps/admin-portal/src/lib/app-utils.tsx`.
  - `apps/admin-portal/src/helpers/email-template-html.ts` is deleted and relocated to `apps/admin-portal/src/lib/email-template-html.ts`, preserving the `renderEmailTemplateHtml` draft-js HTML export helper.
  - `apps/admin-portal/src/lib/axios-http-client.ts` and `apps/admin-portal/src/lib/http-client-interface.ts` are deleted and relocated to `apps/admin-portal/src/lib/http-client/axios-http-client.ts` and `apps/admin-portal/src/lib/http-client/http-client-interface.ts` respectively, namespacing the legacy HTTP client abstractions under a dedicated sub-directory.
  - `apps/admin-portal/src/lib/http-client.ts` is deleted; its `HttpClient` class content is now served by `src/lib/http-client/http-client.ts`.
  - `apps/admin-portal/src/provider/query-provider.tsx` is deleted and relocated to `apps/admin-portal/src/lib/react-query/query-provider.tsx`; an accompanying `apps/admin-portal/src/lib/react-query/query-client.ts` provides the `createQueryClient` factory. The root `apps/admin-portal/src/app/layout.tsx` import is updated from `@/provider/query-provider` to `@/lib/react-query/query-provider`.
  - `apps/admin-portal/src/interface/index.ts` is deleted; the claim-domain types it exported (`ClaimItem`, `ClaimForm`, `ClaimFieldInputType`, `ClaimFormsRequest`, `UpdateClaimGrabRequest`, `DocumentItem`, `ClaimsTableConfigProps`, `DocumentTableConfigProps`) are now defined in `apps/admin-portal/src/types/claim-form.ts`.
  - `apps/admin-portal/src/lib/README.md` is introduced to document the lib directory structure: `api-client` (current service-layer HTTP infrastructure), `react-query` (TanStack Query client/provider setup), `http-client` (legacy HTTP client abstractions), and the remaining utility modules.
  - All callers that previously imported from `@/helpers/app.helper`, `@/helpers/email-template-html`, `@/lib/axios-http-client`, `@/lib/http-client-interface`, `@/provider/query-provider`, or `@/interface` now import from their new locations. Affected files include `src/services/api.service.ts`, `src/services/auth.service.ts`, all `src/services/masterdata/*.service.ts` files, `src/context/auth.context.tsx`, `src/context/screen.context.tsx`, `src/views/layout/layout.view.tsx`, `src/views/configurations/configurations.view.tsx`, `src/views/oauth/msal-callback.view.tsx`, `src/hooks/useClaimHistory.hooks.tsx`, `src/hooks/useDetailClaim.hooks.tsx`, `src/hooks/useEmailTemplateForm.hooks.tsx`, `src/app/layout.tsx`, `src/lib/utils.ts`, `src/services/claims/api/claims.types.ts`, and the claim list and table-config files that previously imported `ClaimItem` from `@/interface`.
- New files added: [`apps/admin-portal/src/lib/app-utils.tsx`, `apps/admin-portal/src/lib/email-template-html.ts`, `apps/admin-portal/src/lib/http-client/axios-http-client.ts`, `apps/admin-portal/src/lib/http-client/http-client-interface.ts`, `apps/admin-portal/src/lib/http-client/http-client.ts`, `apps/admin-portal/src/lib/react-query/query-client.ts`, `apps/admin-portal/src/lib/react-query/query-provider.tsx`, `apps/admin-portal/src/lib/README.md`, `apps/admin-portal/src/types/claim-form.ts`]
- Local files deleted: [`apps/admin-portal/src/helpers/app.helper.tsx`, `apps/admin-portal/src/helpers/email-template-html.ts`, `apps/admin-portal/src/lib/axios-http-client.ts`, `apps/admin-portal/src/lib/http-client-interface.ts`, `apps/admin-portal/src/lib/http-client.ts`, `apps/admin-portal/src/provider/query-provider.tsx`, `apps/admin-portal/src/interface/index.ts`]
- Shared-ui impact: `No @repo/ui exports are added or changed. This is a pure file-system restructuring pass; all shared primitive and service usages remain identical to the state established in prior entries.`
- Verification note: `This logging update is based on the current git diff for all relocated infrastructure files and their import-path update callers. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `No page migration status changes. This entry records infrastructure restructuring work only; all route migration PASS/FAIL states remain as previously recorded.`


## Batch 10 - Smoke Route Screenshot Artifacts Cleanup - 2026-05-19

- Component focus: `docs/migration/component/_artifacts/smoke-routes/`
- Migration intent: `Remove the ten legacy smoke-route screenshot artifacts from the migration docs directory. These screenshots were captured during earlier Batch 9 verification passes and are now superseded by the route PASS records in the parity checklist and migration log.`
- Artifacts deleted: [`_claim_list.png`, `_dashboard_claim.png`, `_dashboard_policy.png`, `_dashboard_transaction.png`, `_finance_billing.png`, `_masterdata_user.png`, `_membership_list.png`, `_policy_endorsement_list.png`, `_policy_list.png`, `_transaction_list.png`]
- Shared-ui impact: `No code or @repo/ui changes. Documentation artifact cleanup only.`
- Verification note: `Deletion is safe; all corresponding routes are recorded as PASS in the Batch 9 tracker and migration log. No active verification workflow depends on these screenshot files.`
- Tracker impact: `No page migration status changes. This entry records documentation hygiene work only.`


## Batch 10 - Legacy Service Layer Elimination and Colocated Module Migration - 2026-05-19

- Component focus: `services/`, `hooks/`, `context/auth.context.tsx`, `lib/api-client/config.ts`, `lib/utils.ts`
- Migration intent: `Delete all remaining flat masterdata service files, the legacy api.service.ts barrel, the class-based auth.service.ts and communication.service.ts, and the crm-config.service.ts; replace each with colocated feature-scoped service modules and TanStack Query hooks. Standardize all service-layer HTTP clients to use the centralized API_BASE_URLS map rather than inline process.env references.`
- Service layer restructuring:
  - `apps/admin-portal/src/services/api.service.ts` deleted. All callers now import directly from their respective feature-scoped service modules (`auth/api/auth.service`, `helper/api/helper.service`, `channel/api/channel.service`).
  - `apps/admin-portal/src/services/auth.service.ts` deleted. The `AuthService` class (Entra login, providers) is eliminated; its logic is now expressed as first-class methods on the existing `authService` singleton.
  - `apps/admin-portal/src/services/communication.service.ts` deleted. All channel-provider operations are now served by the new `apps/admin-portal/src/services/communication/` module.
  - `apps/admin-portal/src/services/crm-config.service.ts` deleted. Channel mapping and third-party configuration operations are now served by the new `apps/admin-portal/src/services/third-party/` module.
  - All nineteen `apps/admin-portal/src/services/masterdata/*.service.ts` files deleted (`channels`, `cookie`, `currency`, `email-tag`, `group`, `insurance-product`, `insurance`, `insurer`, `mail-template`, `page`, `permission`, `product-category`, `product`, `roles`, `user`). Types previously re-exported from these files are now defined inline in the colocated `*.types.ts` files of the consuming feature service directories.
- New service modules introduced:
  - `apps/admin-portal/src/services/communication/api/communication.service.ts` — `communicationApiService` singleton with `getChannelProviders`, `getAvailableProviders`, `createChannelProvider`, `updateChannelProvider`, `deleteChannelProvider` methods.
  - `apps/admin-portal/src/services/communication/api/communication.endpoints.ts` — `COMMUNICATION_ENDPOINTS` constant.
  - `apps/admin-portal/src/services/communication/api/communication.types.ts` — communication domain types.
  - `apps/admin-portal/src/services/communication/query-keys.ts` — scoped query-key factory.
  - `apps/admin-portal/src/services/communication/hooks/queries/useChannelProviders.ts`, `useAvailableProviders.ts`, `index.ts` — TanStack Query query hooks.
  - `apps/admin-portal/src/services/communication/hooks/mutations/useCreateChannelProvider.ts`, `useUpdateChannelProvider.ts`, `useDeleteChannelProvider.ts`, `index.ts` — TanStack Query mutation hooks.
  - `apps/admin-portal/src/services/third-party/api/third-party.service.ts` — `thirdPartyService` singleton covering channel mappings and third-party configuration CRUD.
  - `apps/admin-portal/src/services/third-party/api/third-party.endpoints.ts` — `THIRD_PARTY_ENDPOINTS` constant.
  - `apps/admin-portal/src/services/third-party/api/third-party.types.ts` — `ThirdPartyConfig`, `ThirdPartyConfigPayload`, `ChannelMapping`, `ChannelMappingPayload` type definitions.
  - `apps/admin-portal/src/services/third-party/query-keys.ts` — scoped query-key factory.
  - `apps/admin-portal/src/services/third-party/hooks/queries/useThirdPartyConfigurations.ts`, `useChannelMappings.ts`, `index.ts` — TanStack Query query hooks.
  - `apps/admin-portal/src/services/third-party/hooks/mutations/useCreateThirdPartyConfiguration.ts`, `useUpdateThirdPartyConfiguration.ts`, `useDeleteThirdPartyConfiguration.ts`, `useCreateChannelMapping.ts`, `useUpdateChannelMapping.ts`, `useDeleteChannelMapping.ts`, `index.ts` — TanStack Query mutation hooks.
- Existing service module updates:
  - `apps/admin-portal/src/lib/api-client/config.ts` — added `communication: process.env.NEXT_PUBLIC_COMMUNICATION_SERVICE_URL` and `thirdParty: process.env.NEXT_PUBLIC_THIRD_PARTY_SERVICE_URL` to `API_BASE_URLS`.
  - `apps/admin-portal/src/lib/utils.ts` — replaced `CookieService` class instantiation with `internalService.getCookieByKey(name)` call; `getCookie` now returns `response?.data?.value ?? null`.
  - `apps/admin-portal/src/services/auth/api/auth.service.ts` — switched from inline `process.env.NEXT_PUBLIC_AUTH_SERVICE_URL` to `API_BASE_URLS.auth`; introduced `authStaticApi` (auth disabled, static `Authorization: Bearer` header) for pre-authentication requests; added `logout(refreshToken)`, `loginEntra(code, codeVerifier)`, and `getProviders(payload)` as first-class service methods; `login` now delegates to `authStaticApi` instead of `authApi`.
  - `apps/admin-portal/src/services/auth/api/auth.types.ts` — added `refresh_token` to `LoginResponse`; added `LoginProvidersRequest` and `LoginProvidersResponse` interfaces; replaced all re-exports from deleted masterdata services with inline type definitions (`User`, `Channel`, `Role`, `GroupResponse`, `GroupRoleResponse`, `UserResponse`, `AccountGroup`, `RoleResponse`, `RolePermissionResponse`, `PermissionResponse`, `PermissionPagesResponse`, `PagesResponse`, `MenuResponse`, `Insurer`).
  - `apps/admin-portal/src/services/auth/api/auth.endpoints.ts` — added `loginEntra: "/login/entra"`, `logout: "/login/logout"`, and `providers: "/v1/providers"` endpoints.
  - `apps/admin-portal/src/services/channel/api/channel.service.ts` — switched to `API_BASE_URLS.channel`.
  - `apps/admin-portal/src/services/channel/api/channel.types.ts` — replaced re-exports from deleted `channels.service` and `user.service` with inline `ChannelsResponse` and `Channel` type definitions.
  - `apps/admin-portal/src/services/product/api/product.service.ts` — switched to `API_BASE_URLS.product`; fixed `getProductById`, `getCategoryById`, and `getEmailTagById` to use proper REST detail-endpoint helpers (`PRODUCT_ENDPOINTS.productDetail(id)`, `categoryDetail(id)`, `emailTagDetail(id)`) instead of query-param lookups.
  - `apps/admin-portal/src/services/product/api/product.types.ts` — replaced all re-exports from deleted masterdata services with inline type definitions (`ProductResponse`, `CategoriesResponse`, `InsurancesResponse`, `HospitalListResponse`, `HospitalData`, `HospitalReference`, `HospitalListMeta`, `ProductCategories`, `Insurance`, `CurrencyResponse`, `TypeCurreciesResponse`, `EmailTagResponse`, `MailTemplateResponse`).
  - `apps/admin-portal/src/services/helper/api/helper.service.ts` — switched to `API_BASE_URLS.helper`; added `exportData(params?)` method returning a raw Axios response with `responseType: "blob"` so callers can access response headers alongside the blob body.
  - `apps/admin-portal/src/services/helper/api/helper.endpoints.ts` — added `exportData: "/v1/export-data"` endpoint.
  - `apps/admin-portal/src/services/claims/api/claims.service.ts`, `country/api/country.service.ts`, `finance/api/finance.service.ts`, `pdf/api/pdf.service.ts`, `policy/api/policy.service.ts`, `promotion/api/promotion.service.ts`, `report/api/report.service.ts`, `sanction/api/sanction.service.ts`, `transaction/api/transaction.service.ts` — all switched from inline `process.env` URL references to the corresponding `API_BASE_URLS` entry.
- Hook updates:
  - `apps/admin-portal/src/hooks/useChannel.hooks.tsx` — replaced `CommunicationService` class import with `communicationApiService` singleton import from the new `communication/api/communication.service`.
  - `apps/admin-portal/src/hooks/useChannelMapping.hooks.tsx` — replaced raw `useQuery`/`useMutation` blocks and `CrmConfigService` with `useChannelsV1`, `useThirdPartyConfigurations`, `useChannelMappings`, `useCreateChannelMapping`, `useUpdateChannelMapping`, `useDeleteChannelMapping` service-layer hooks; removed `ApiURL` and `channelService` dependencies.
  - `apps/admin-portal/src/hooks/useChannelProviders.hooks.tsx` — replaced raw `useQuery`/`useMutation` blocks and `CommunicationService`/`channelService` with `useChannelProvidersQuery`, `useAvailableProviders`, `useChannelsV1`, `useCreateChannelProvider`, `useUpdateChannelProvider`, `useDeleteChannelProvider` service-layer hooks.
  - `apps/admin-portal/src/hooks/useThirdPartyConfig.hooks.tsx` — replaced raw `useQuery`/`useMutation` blocks and `CrmConfigService` with `useThirdPartyConfigurations`, `useCreateThirdPartyConfiguration`, `useUpdateThirdPartyConfiguration`, `useDeleteThirdPartyConfiguration` service-layer hooks.
  - `apps/admin-portal/src/hooks/useProduct.hooks.tsx` — updated `Insurance` import from deleted `masterdata/insurance.service` to `product/api/product.types`.
  - `apps/admin-portal/src/hooks/useProductCategory.hooks.tsx` — updated `ProductCategories` import from deleted `masterdata/product-category.service` to `product/api/product.types`.
- Context updates:
  - `apps/admin-portal/src/context/auth.context.tsx` — removed `AuthService` class instantiation (`authServiceEntra`); `loginEntra` and `getProviders` flows now call `authService.loginEntra()` and `authService.getProviders()` directly; `handleLogin` now calls `authService.login()` and reads response fields without `AxiosResponse` wrapper; `handleLogout` now calls `authService.logout(refreshToken)`; removed `useSearchParams` and `AxiosResponse` imports.
- View and page updates:
  - `apps/admin-portal/src/views/configurations/channel-mapping.view.tsx` — updated `ChannelMapping` import from deleted `crm-config.service` to `third-party/api/third-party.types`.
  - `apps/admin-portal/src/views/configurations/third-party-config.view.tsx` — updated `ThirdPartyConfig` import from deleted `crm-config.service` to `third-party/api/third-party.types`.
  - `apps/admin-portal/src/views/layout/layout.view.tsx` — switched `authService` import from `api.service` barrel to `auth/api/auth.service` directly; `changePassword` now calls `authService.changeAccountPassword(user.sub, { newPassword, oldPassword })` instead of `authService.put(ApiURL.v1ChangePassword(user.sub), ...)`.
  - `apps/admin-portal/src/app/masterdata/email-template/hooks.tsx` — updated `ProductResponse` import from deleted `masterdata/mail-template.service` to `product/api/product.types`.
  - `apps/admin-portal/src/app/masterdata/product/hooks.tsx` — updated `ProductResponse` import from deleted `masterdata/product.service` to `product/api/product.types`.
  - `apps/admin-portal/src/app/policy/list/page.tsx` — switched `helperService` import from `api.service` barrel to `helper/api/helper.service` directly; replaced raw `helperService.get('/v1/export-data', { params, responseType: 'blob' })` call with `helperService.exportData({ ... })`.
- Files changed: [`apps/admin-portal/src/lib/api-client/config.ts`, `apps/admin-portal/src/lib/utils.ts`, `apps/admin-portal/src/context/auth.context.tsx`, `apps/admin-portal/src/services/auth/api/auth.service.ts`, `apps/admin-portal/src/services/auth/api/auth.types.ts`, `apps/admin-portal/src/services/auth/api/auth.endpoints.ts`, `apps/admin-portal/src/services/channel/api/channel.service.ts`, `apps/admin-portal/src/services/channel/api/channel.types.ts`, `apps/admin-portal/src/services/product/api/product.service.ts`, `apps/admin-portal/src/services/product/api/product.types.ts`, `apps/admin-portal/src/services/helper/api/helper.service.ts`, `apps/admin-portal/src/services/helper/api/helper.endpoints.ts`, `apps/admin-portal/src/services/claims/api/claims.service.ts`, `apps/admin-portal/src/services/country/api/country.service.ts`, `apps/admin-portal/src/services/finance/api/finance.service.ts`, `apps/admin-portal/src/services/pdf/api/pdf.service.ts`, `apps/admin-portal/src/services/policy/api/policy.service.ts`, `apps/admin-portal/src/services/promotion/api/promotion.service.ts`, `apps/admin-portal/src/services/report/api/report.service.ts`, `apps/admin-portal/src/services/sanction/api/sanction.service.ts`, `apps/admin-portal/src/services/transaction/api/transaction.service.ts`, `apps/admin-portal/src/hooks/useChannel.hooks.tsx`, `apps/admin-portal/src/hooks/useChannelMapping.hooks.tsx`, `apps/admin-portal/src/hooks/useChannelProviders.hooks.tsx`, `apps/admin-portal/src/hooks/useThirdPartyConfig.hooks.tsx`, `apps/admin-portal/src/hooks/useProduct.hooks.tsx`, `apps/admin-portal/src/hooks/useProductCategory.hooks.tsx`, `apps/admin-portal/src/hooks/useIsurance.hooks.tsx`, `apps/admin-portal/src/views/configurations/channel-mapping.view.tsx`, `apps/admin-portal/src/views/configurations/third-party-config.view.tsx`, `apps/admin-portal/src/views/layout/layout.view.tsx`, `apps/admin-portal/src/app/masterdata/email-template/hooks.tsx`, `apps/admin-portal/src/app/masterdata/product/hooks.tsx`, `apps/admin-portal/src/app/policy/list/page.tsx`]
- New files added: [`apps/admin-portal/src/services/communication/api/communication.service.ts`, `apps/admin-portal/src/services/communication/api/communication.endpoints.ts`, `apps/admin-portal/src/services/communication/api/communication.types.ts`, `apps/admin-portal/src/services/communication/query-keys.ts`, `apps/admin-portal/src/services/communication/hooks/queries/useChannelProviders.ts`, `apps/admin-portal/src/services/communication/hooks/queries/useAvailableProviders.ts`, `apps/admin-portal/src/services/communication/hooks/queries/index.ts`, `apps/admin-portal/src/services/communication/hooks/mutations/useCreateChannelProvider.ts`, `apps/admin-portal/src/services/communication/hooks/mutations/useUpdateChannelProvider.ts`, `apps/admin-portal/src/services/communication/hooks/mutations/useDeleteChannelProvider.ts`, `apps/admin-portal/src/services/communication/hooks/mutations/index.ts`, `apps/admin-portal/src/services/third-party/api/third-party.service.ts`, `apps/admin-portal/src/services/third-party/api/third-party.endpoints.ts`, `apps/admin-portal/src/services/third-party/api/third-party.types.ts`, `apps/admin-portal/src/services/third-party/query-keys.ts`, `apps/admin-portal/src/services/third-party/hooks/queries/useThirdPartyConfigurations.ts`, `apps/admin-portal/src/services/third-party/hooks/queries/useChannelMappings.ts`, `apps/admin-portal/src/services/third-party/hooks/queries/index.ts`, `apps/admin-portal/src/services/third-party/hooks/mutations/useCreateThirdPartyConfiguration.ts`, `apps/admin-portal/src/services/third-party/hooks/mutations/useUpdateThirdPartyConfiguration.ts`, `apps/admin-portal/src/services/third-party/hooks/mutations/useDeleteThirdPartyConfiguration.ts`, `apps/admin-portal/src/services/third-party/hooks/mutations/useCreateChannelMapping.ts`, `apps/admin-portal/src/services/third-party/hooks/mutations/useUpdateChannelMapping.ts`, `apps/admin-portal/src/services/third-party/hooks/mutations/useDeleteChannelMapping.ts`, `apps/admin-portal/src/services/third-party/hooks/mutations/index.ts`]
- Local files deleted: [`apps/admin-portal/src/services/api.service.ts`, `apps/admin-portal/src/services/auth.service.ts`, `apps/admin-portal/src/services/communication.service.ts`, `apps/admin-portal/src/services/crm-config.service.ts`, `apps/admin-portal/src/services/masterdata/channels.service.ts`, `apps/admin-portal/src/services/masterdata/cookie.service.ts`, `apps/admin-portal/src/services/masterdata/currency.service.ts`, `apps/admin-portal/src/services/masterdata/email-tag.service.ts`, `apps/admin-portal/src/services/masterdata/group.service.ts`, `apps/admin-portal/src/services/masterdata/insurance-product.service.ts`, `apps/admin-portal/src/services/masterdata/insurance.service.ts`, `apps/admin-portal/src/services/masterdata/insurer.service.ts`, `apps/admin-portal/src/services/masterdata/mail-template.service.ts`, `apps/admin-portal/src/services/masterdata/page.service.ts`, `apps/admin-portal/src/services/masterdata/permission.service.ts`, `apps/admin-portal/src/services/masterdata/product-category.service.ts`, `apps/admin-portal/src/services/masterdata/product.service.ts`, `apps/admin-portal/src/services/masterdata/roles.service.ts`, `apps/admin-portal/src/services/masterdata/user.service.ts`]
- Shared-ui impact: `No @repo/ui exports are added or changed. This is a pure service-layer restructuring pass; all shared primitive usages in pages and views remain identical to the state established in prior entries.`
- Verification note: `This logging update is based on the current git diff for all deleted legacy service files, new colocated service modules, and their import-path update callers. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `No page migration status changes. This entry records service-layer infrastructure restructuring work only; all route migration PASS/FAIL states remain as previously recorded.`


## Batch 9 - Layout Shell, Sidebar Navigation, and Modal Refinement - 2026-05-19

- Component focus: `LayoutView`, `Modal`, `AppMenu`
- Migration intent: `Refactor the app-wide layout shell to replace inline sidebar menu items with a reusable SidebarMenuButton component backed by @repo/ui Tooltip primitives, tighten sidebar sizing from percentage to rem-based units, migrate navbar and dropdown action items to semantic Box as="button" primitives, and apply visual polish to the modal overlay and menu icon sizing.`
- Component-local behavior updates:
  - `apps/admin-portal/src/views/layout/layout.view.tsx` now imports `Tooltip`, `TooltipContent`, `TooltipProvider`, and `TooltipTrigger` from `@repo/ui`, completing the shared primitive adoption for the sidebar navigation layer.
  - A new `SidebarMenuButton` component is introduced inline in `layout.view.tsx`, rendering each sidebar menu item as a `Box as="button" type="button"` with an icon slot, label with overflow truncation detection, and conditional `TooltipContent` that only renders when the label text overflows — backed by a `ResizeObserver`-based overflow check with `requestAnimationFrame` and `setTimeout` stabilization.
  - An `isSubmenuActive` helper is extracted from inline conditional logic in both the desktop and mobile sidebar loops, now using exact `path === submenu.url` matching combined with `additionalPages` prefix matching via `path.startsWith(page.url)`, replacing the previous `path.includes(submenu.url)` approach which could produce false positives on partial URL matches.
  - Desktop and mobile sidebar menu items now render through `SidebarMenuButton` wrapped in `TooltipProvider delayDuration={350}`, replacing the previous inline `Box` click containers with bespoke active-state class logic.
  - Sidebar width is standardized from `20%` (percentage) to `16rem` (fixed rem), with navbar and main content offsets updated from `sm:w-[calc(100%-20%)] sm:ml-[20%]` to `sm:w-[calc(100%-16rem)] sm:ml-64` for consistent spacing across viewport sizes.
  - The hamburger toggle button now carries `aria-label="Toggle sidebar"` and adopts minimal focus-ring styling (`focus-visible:ring-2 focus-visible:ring-white/35`) aligned with the rest of the shell's accessibility pattern.
  - The navbar user dropdown actions ("Change Password" and "Logout") are migrated from local `Button` variant components to `Box as="button" type="button"` with Tailwind utility styling, removing the `Button` component dependency from the dropdown chrome.
  - The Change Password modal header is now a semantic `Box as="h2"` with a bottom border divider (`border-b border-slate-100`), max-height is extended from `calc(70vh-50px)` to `calc(80vh-76px)`, and padding is standardized to `px-2 py-5 sm:px-6`.
  - The mobile sidebar modal now enforces minimum logo dimensions via `Math.max(logoWidth, 185)` / `Math.max(logoHeight, 81)` fallbacks and applies `className="h-auto max-w-full !w-[180px]"` to both whitelabel and default logo images for consistent sizing; the same change is applied to the desktop sidebar logo.
  - `apps/admin-portal/src/components/core/modal.tsx` updates the default overlay from `bg-black bg-opacity-50` to `bg-black/45` (Tailwind v3 opacity shorthand), changes the inner container border-radius default from `rounded-md` to `rounded-lg`, and moves the `bgColorModal` class to the end of the class string for consistent ordering.
  - `apps/admin-portal/src/constants/app-menu.const.tsx` removes a BOM character from the file header, adjusts the `ChartPie` dashboard icon size from `h-[17px] w-[17px]` to `h-[18px] w-[18px]`, and reduces the image icon size from `w-7 min-w-7` to `w-6 min-w-6` to better fit the new `SidebarMenuButton` icon slot dimensions.
- Files changed (component-focused): [`apps/admin-portal/src/views/layout/layout.view.tsx`, `apps/admin-portal/src/components/core/modal.tsx`, `apps/admin-portal/src/constants/app-menu.const.tsx`]
- Shared-ui impact: `Tooltip, TooltipContent, TooltipProvider, and TooltipTrigger from @repo/ui are now adopted in the layout shell. No new @repo/ui exports are introduced; these primitives were already exported by the shared package.`
- Verification note: `This logging update is based on the current git diff for the three changed files. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `No page migration status changes. This entry records layout shell infrastructure and visual refinement work only; all route migration PASS/FAIL states remain as previously recorded.`


## Batch 10 - UserForm Sub-components Refactor: Combobox, DataTable Pagination, and Visual Polish - 2026-05-19

- Component focus: `ChannelModal`, `InsurerModal`, `UserChannels`, `UserInsurers`, `UserGroups`, `UserRoles`, `UserFormWrapper`, `auth.service`
- Migration intent: `Replace legacy Select + Spinner patterns in add-item modals with the shared Combobox primitive, migrate group and role selection modals from bespoke Table + TableFooter pagination to DataTable + CompactTablePagination, standardize raw checkbox inputs to @repo/ui Checkbox, apply consistent card and table visual polish across all four user-form sub-section cards, normalize auth service quote style, and fix getAccountById to use the proper REST detail endpoint.`
- Component-local behavior updates:
  - `apps/admin-portal/src/components/forms/user-form/components/add-channel-modal.tsx` replaces the multi-import `Select/SelectContent/SelectGroup/SelectItem/SelectTrigger/SelectValue` block and the `Spinner` loading branch with a single `Combobox` from `@repo/ui`; channel options are derived via `React.useMemo`; the `accountChannels` prop is narrowed from `any[]` to `Array<{ id: string; name: string }>`. The modal layout is updated to a flex-column structure with `max-h-[calc(100vh-48px)]` and `shrink-0` header/footer so the body scrolls independently. The Save button removes the `DialogClose asChild` wrapper (avoiding premature close on click), is disabled when no channel is selected, and adopts the `leftIcon` prop for the check icon.
  - `apps/admin-portal/src/components/forms/user-form/components/add-insurer-modal.tsx` applies the same Combobox migration pattern as the channel modal; `accountInsurers` is narrowed to `Array<{ id: string; insurance?: string }>` and `insurers` to `Array<{ id: string; name: string }>`; `accountInsurers` is removed from the destructuring since the Combobox renders from `insurers` directly. Save button behaviour mirrors the channel modal.
  - `apps/admin-portal/src/components/forms/user-form/components/user-channels.tsx` adds `flex flex-col`, `shadow-sm`, and `border border-slate-100` to the card container; the description `<i>` wrapper is replaced with an `italic` Tailwind class on the parent; the Add Channel button adopts the `leftIcon` prop and `ml-auto` alignment; the table header row is styled with `bg-[#0073A8]` blue, white bold text, and an explicit `Action` column header; table rows gain `transition-all` hover-state styling; cell padding is updated to `py-4 pl-4 pr-1 / pl-1 pr-4`; the delete button is migrated to `variant="ghost" size="xs"` with a rounded-full red-accent hover state.
  - `apps/admin-portal/src/components/forms/user-form/components/user-insurers.tsx` receives the identical card container, description, button, table header, row, and delete-button styling treatment as `user-channels.tsx`.
  - `apps/admin-portal/src/components/forms/user-form/components/user-groups.tsx` removes the `useParams` dependency; adds `React`, `Checkbox`, `DataTable`, `Image` (from `@repo/ui`), `Input`, and `ColumnDef` imports; removes `TableFooter`; imports `CompactTablePagination` from `@/components/core/compact-table-pagination`. A `groupModalColumns` column definition (select checkbox + group name) is produced via `React.useMemo`. The group selection modal now renders `DataTable` with `renderPagination` delegating to `CompactTablePagination`, replacing the previous manual `Table + TableFooter` row-count select and chevron pagination. The search input is migrated from a raw positioned `<Input type="text">` to the `@repo/ui Input` with `onValueChange`, `clearable`, and `rightIcon` props. The empty state uses `@repo/ui Image`. A new `handleFilterGroup` prop is accepted and called from `onValueChange`. The `handleRowsPerPageChangeGroup` prop signature changes from `(e: React.ChangeEvent<HTMLSelectElement>) => void` to `(pageSize: number) => void`. The assigned-groups summary table adopts the same blue header and delete-button styling as the channel and insurer cards. Row selection highlight uses `getRowClassName` to apply `bg-slate-50` to currently selected groups.
  - `apps/admin-portal/src/components/forms/user-form/components/user-roles.tsx` applies the same DataTable migration pattern as `user-groups.tsx`; removes `Image` from `next/image` and `useParams`; adds `React`, `Checkbox`, `DataTable`, `Image` (from `@repo/ui`), `Input`, and `ColumnDef` imports; removes `TableFooter`; imports `CompactTablePagination`. A `roleModalColumns` column definition (select checkbox + role name with kebab-to-title formatting) is produced via `React.useMemo`. A new `selectedRoles` prop is accepted and used by `getRowClassName` to highlight currently selected roles. The `handleRowsPerPageChange` prop signature changes from `(e: React.ChangeEvent<HTMLSelectElement>) => void` to `(pageSize: number) => void`. The `AlertCircle` icon adopts `shrink-0` and its text sibling is wrapped in a `Box as="span"`. The summary roles table adopts the same blue header and delete-button styling as the other cards.
  - `apps/admin-portal/src/components/forms/user-form/index.tsx` updates the `handleRowsPerPageChangeGroup` and `handleRowsPerPageChange` inline handlers from `(e) => { setRowsPerPageGroup(Number(e.target.value)) }` / `(e) => { setRowsPerPageRole(Number(e.target.value)) }` to `(pageSize) => { setRowsPerPageGroup(pageSize) }` / `(pageSize) => { setRowsPerPageRole(pageSize) }` to match the new DataTable-driven pagination API. The `selectedRoles` prop is wired through to `UserRoles` as `selectedRoles={selectRole}`.
  - `apps/admin-portal/src/services/auth/api/auth.service.ts` normalizes all string literals from double quotes to single quotes; condenses multi-line arrow function expressions (`get`, `post`, `getStatic`, `put`, and several service methods) to single-line form for consistency; fixes `getAccountById` to call `AUTH_ENDPOINTS.accountDetail(id)` instead of the previously incorrect `withQuery(AUTH_ENDPOINTS.accounts, { id })` query-param lookup.
- Files changed: [`apps/admin-portal/src/components/forms/user-form/components/add-channel-modal.tsx`, `apps/admin-portal/src/components/forms/user-form/components/add-insurer-modal.tsx`, `apps/admin-portal/src/components/forms/user-form/components/user-channels.tsx`, `apps/admin-portal/src/components/forms/user-form/components/user-groups.tsx`, `apps/admin-portal/src/components/forms/user-form/components/user-insurers.tsx`, `apps/admin-portal/src/components/forms/user-form/components/user-roles.tsx`, `apps/admin-portal/src/components/forms/user-form/index.tsx`, `apps/admin-portal/src/services/auth/api/auth.service.ts`]
- Shared-ui impact: `Combobox, Checkbox, DataTable, and Image are now adopted from @repo/ui in the user-form sub-components. No new @repo/ui exports are introduced; these primitives were already exported by the shared package.`
- Verification note: `This logging update is based on the current git diff for all eight changed files. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `No page migration status changes. This entry records user-form component refactoring and auth service normalization work only; all route migration PASS/FAIL states remain as previously recorded.`


## Batch 11 - RoleForm Permissions Table Layout and Text-Wrapping Polish - 2026-05-19

- Component focus: `RoleForm`
- Migration intent: `Tighten the permissions table column widths, normalize horizontal cell padding, fix the permission checkbox grid to prevent column overflow on long permission names, and make permission tags in read-only view wrap long text gracefully instead of clipping.`
- Component-local behavior updates:
  - `apps/admin-portal/src/components/forms/role-form/index.tsx` adds `min-w-[960px]` to the `Table` root class, establishing a hard minimum width that prevents the three-column permissions table from collapsing below readable size on narrower viewports.
  - The Menu column `TableCell` in both the editable and read-only row states changes its width classes from `min-w-48 w-80` to `w-[300px] min-w-[260px]` and its right padding from `pr-1` to `pr-3`, matching the pixel-precise column width used in the user-form permission tables and providing consistent gutter spacing between the menu and permission columns.
  - The Permission column `TableCell` in both the editable and read-only row states gains an explicit `min-w-[520px]` constraint (previously unconstrained) and its horizontal padding is widened from `px-1` to `px-3` to match the Menu column gutter.
  - The editable-state permission checkbox grid changes its column template from `grid-cols-[repeat(auto-fill,minmax(180px,1fr))]` to `grid-cols-[repeat(auto-fit,minmax(240px,1fr))]`, widens the minimum column track from 180 px to 240 px to prevent excessive wrapping, and adds `min-w-0` to the grid container so it participates correctly in flex/grid shrink calculations. The border-radius on the checkbox container is normalized from `rounded-xl` to `rounded-lg` for visual consistency with other card elements.
  - The `Checkbox` components inside the permission grid receive `min-w-0` on `className` and `min-w-0 whitespace-normal break-words leading-5` on `labelClassName`, ensuring long permission name strings wrap to multiple lines rather than overflowing or being truncated.
  - In the read-only row state, the permission tag `Box as="span"` container gains `max-w-full` and changes `items-center` to `items-start` so the inline delete button aligns to the first line when the permission name wraps. The permission name text is promoted from a bare text node to a `Box as="span"` with `min-w-0 break-words leading-5`, preventing tag overflow on long names. The delete `Button` inside each tag gains `shrink-0` so it does not compress when the tag container is narrow.
  - Import order is corrected: `ContentLoadingWrapper` is moved above `PageHeader` to follow the alphabetical ordering used across other form components (no functional change).
- Files changed: [`apps/admin-portal/src/components/forms/role-form/index.tsx`]
- Shared-ui impact: `No @repo/ui exports are added or changed. All primitives used (Combobox, Checkbox, Table family, Textarea) were already adopted in this component prior to this entry.`
- Verification note: `This logging update is based on the current git diff for the single changed file. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `No page migration status changes. This entry records visual polish and layout correctness fixes to the role-form permissions table only; all route migration PASS/FAIL states remain as previously recorded.`
