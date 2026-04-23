
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


## Batch 9 - /masterdata/channel/add and /masterdata/channel/detail/[id] Route Refactor - 2026-04-22

- Route focus: `/masterdata/channel/add`, `/masterdata/channel/detail/[id]`
- Migration intent: `Refactor the channel add and detail routes onto the current shared primitive stack, standardizing the form layout and interaction while preserving existing channel creation and update logic.`
- Route-local behavior updates:
  - `apps/admin-portal/src/app/masterdata/channel/add/page.tsx` and `apps/admin-portal/src/app/masterdata/channel/detail/[id]/page.tsx` now use the refactored `ChannelForm` component.
  - `apps/admin-portal/src/components/forms/channel-form/index.tsx` replaces the legacy `apps/admin-portal/src/components/forms/ChannelForm/index.tsx` and adopts shared `@repo/ui` `Box`, `Button`, `Input`, and `Select` primitives.
  - The refactored form utilizes `Box` for all layout and semantic elements, standardizes the page header via the local `PageHeader` component, and leverages `ContentLoadingWrapper` for consistent loading states during detail fetching and submission.
- Files changed (route-focused): [`apps/admin-portal/src/app/masterdata/channel/add/page.tsx`, `apps/admin-portal/src/app/masterdata/channel/detail/[id]/page.tsx`, `apps/admin-portal/src/hooks/useChannelForm.hooks.tsx`]
- Local files deleted: [`apps/admin-portal/src/components/forms/ChannelForm/index.tsx`]
- Shared-ui impact: `No new @repo/ui export is introduced. The routes adopt existing shared Box, Button, Input, and Select primitives while PageHeader remains app-local.`
- Verification note: `This logging update is based on the current channel add and detail route source changes and form refactor. No new smoke, lint, or build evidence is added in this documentation entry.`
- Tracker impact: `Batch 9 page tracker should now treat both /masterdata/channel/add and /masterdata/channel/detail/[id] as PASS because the route-local migration work is now considered complete for the current Batch 9 tracking pass.`

 
 # #   B a t c h   9   -   / m a s t e r d a t a / p r o d u c t / a d d   a n d   / m a s t e r d a t a / p r o d u c t / d e t a i l   R o u t e   R e f a c t o r   -   2 0 2 6 - 0 4 - 2 3  
  
 -   R o u t e   f o c u s :   ` / m a s t e r d a t a / p r o d u c t / a d d ` ,   ` / m a s t e r d a t a / p r o d u c t / d e t a i l `  
 -   M i g r a t i o n   i n t e n t :   ` R e f a c t o r   t h e   p r o d u c t   a d d   a n d   d e t a i l   r o u t e s   o n t o   t h e   c u r r e n t   s h a r e d   p r i m i t i v e   s t a c k ,   s t a n d a r d i z i n g   t h e   f o r m   l a y o u t   a n d   i n t e r a c t i o n   w h i l e   p r e s e r v i n g   e x i s t i n g   p r o d u c t   c r e a t i o n   a n d   u p d a t e   l o g i c . `  
 -   R o u t e - l o c a l   b e h a v i o r   u p d a t e s :  
     -   ` a p p s / a d m i n - p o r t a l / s r c / a p p / m a s t e r d a t a / p r o d u c t / a d d / p a g e . t s x `   a n d   ` a p p s / a d m i n - p o r t a l / s r c / a p p / m a s t e r d a t a / p r o d u c t / d e t a i l / p a g e . t s x `   n o w   u s e   t h e   r e f a c t o r e d   ` P r o d u c t F o r m `   c o m p o n e n t .  
     -   ` a p p s / a d m i n - p o r t a l / s r c / c o m p o n e n t s / f o r m s / p r o d u c t - f o r m / i n d e x . t s x `   r e p l a c e s   t h e   l e g a c y   ` a p p s / a d m i n - p o r t a l / s r c / c o m p o n e n t s / f o r m s / P r o d u c t F o r m / i n d e x . t s x `   a n d   a d o p t s   s h a r e d   ` @ r e p o / u i `   ` B o x ` ,   ` B u t t o n ` ,   ` C o m b o b o x ` ,   ` D i a l o g ` ,   ` I n p u t ` ,   a n d   ` T a b l e `   p r i m i t i v e s .  
     -   T h e   r e f a c t o r e d   f o r m   u t i l i z e s   ` B o x `   f o r   a l l   l a y o u t   a n d   s e m a n t i c   e l e m e n t s ,   s t a n d a r d i z e s   t h e   p a g e   h e a d e r   v i a   t h e   l o c a l   ` P a g e H e a d e r `   c o m p o n e n t ,   a n d   r e s t r i c t s   l a b e l   c l i c k a b l e   a r e a s   t o   t h e   t e x t   o n l y   u s i n g   ` i n l i n e - b l o c k ` .  
     -   A d o p t s   ` C o n t e n t L o a d i n g W r a p p e r `   f o r   c o n s i s t e n t   l o a d i n g   s t a t e s   d u r i n g   c a t e g o r y / i n s u r a n c e   f e t c h i n g   a n d   s u b m i s s i o n .  
     -   I m p l e m e n t s   a   s h a r e d   ` D i a l o g ` - b a s e d   s u c c e s s / e r r o r   f e e d b a c k   f l o w   a n d   i n t e g r a t e s   s t a n d a r d i z e d   b r e a d c r u m b s .  
     -   R e f i n e d   ` a p p s / a d m i n - p o r t a l / s r c / c o m p o n e n t s / f o r m s / p r o d u c t - c a t e g o r y - f o r m / i n d e x . t s x `   t o   a l i g n   w i t h   t h e   s a m e   ` B o x ` - b a s e d   l a b e l   a n d   i n p u t   s e m a n t i c s .  
 -   F i l e s   c h a n g e d   ( r o u t e - f o c u s e d ) :   [ ` a p p s / a d m i n - p o r t a l / s r c / a p p / m a s t e r d a t a / p r o d u c t / a d d / p a g e . t s x ` ,   ` a p p s / a d m i n - p o r t a l / s r c / a p p / m a s t e r d a t a / p r o d u c t / d e t a i l / p a g e . t s x ` ,   ` a p p s / a d m i n - p o r t a l / s r c / c o m p o n e n t s / f o r m s / p r o d u c t - f o r m / i n d e x . t s x ` ,   ` a p p s / a d m i n - p o r t a l / s r c / c o m p o n e n t s / f o r m s / p r o d u c t - c a t e g o r y - f o r m / i n d e x . t s x ` ]  
 -   L o c a l   f i l e s   d e l e t e d :   [ ` a p p s / a d m i n - p o r t a l / s r c / c o m p o n e n t s / f o r m s / P r o d u c t F o r m / i n d e x . t s x ` ]  
 -   S h a r e d - u i   i m p a c t :   ` N o   n e w   @ r e p o / u i   e x p o r t   i s   i n t r o d u c e d .   T h e   r o u t e s   a d o p t   e x i s t i n g   s h a r e d   B o x ,   B u t t o n ,   C o m b o b o x ,   D i a l o g ,   I n p u t ,   a n d   T a b l e   p r i m i t i v e s   w h i l e   P a g e H e a d e r   r e m a i n s   a p p - l o c a l . `  
 -   V e r i f i c a t i o n   n o t e :   ` T h i s   l o g g i n g   u p d a t e   i s   b a s e d   o n   t h e   c u r r e n t   p r o d u c t   a d d   a n d   d e t a i l   r o u t e   s o u r c e   c h a n g e s   a n d   f o r m   r e f a c t o r .   N o   n e w   s m o k e ,   l i n t ,   o r   b u i l d   e v i d e n c e   i s   a d d e d   i n   t h i s   d o c u m e n t a t i o n   e n t r y . `  
 -   T r a c k e r   i m p a c t :   ` B a t c h   9   p a g e   t r a c k e r   s h o u l d   n o w   t r e a t   b o t h   / m a s t e r d a t a / p r o d u c t / a d d   a n d   / m a s t e r d a t a / p r o d u c t / d e t a i l   a s   P A S S   b e c a u s e   t h e   r o u t e - l o c a l   m i g r a t i o n   w o r k   i s   n o w   c o n s i d e r e d   c o m p l e t e   f o r   t h e   c u r r e n t   B a t c h   9   t r a c k i n g   p a s s . `  
  
 # #   B a t c h   9   -   / m a s t e r d a t a / c u r r e n c y / a d d   a n d   / m a s t e r d a t a / c u r r e n c y / d e t a i l / [ i d ]   S t a b i l i z a t i o n   -   2 0 2 6 - 0 4 - 2 3  
  
 -   R o u t e   f o c u s :   ` / m a s t e r d a t a / c u r r e n c y / a d d ` ,   ` / m a s t e r d a t a / c u r r e n c y / d e t a i l / [ i d ] `  
 -   M i g r a t i o n   i n t e n t :   ` S t a b i l i z e   t h e   c u r r e n c y   a d d   a n d   d e t a i l   r o u t e s   b y   r e s o l v i n g   a n   i n f i n i t e   r e n d e r   l o o p   c a u s i n g   a   " M a x i m u m   u p d a t e   d e p t h   e x c e e d e d "   r u n t i m e   e r r o r . `  
 -   R o u t e - l o c a l   b e h a v i o r   u p d a t e s :  
     -   ` a p p s / a d m i n - p o r t a l / s r c / h o o k s / u s e C u r r e n c y F o r m . h o o k s . t s x `   n o w   i n c l u d e s   a   d a t a - s t a b i l i t y   c h e c k   i n   t h e   ` u s e E f f e c t `   t h a t   u p d a t e s   ` c u r r e n c y F i e l d s ` ,   p r e v e n t i n g   r e d u n d a n t   s t a t e   u p d a t e s   w h e n   t h e   d e r i v e d   d a t a   h a s n ' t   c h a n g e d .  
     -   ` a p p s / a d m i n - p o r t a l / s r c / a p p / m a s t e r d a t a / c u r r e n c y / d e t a i l / [ i d ] / p a g e . t s x `   n o w   i n c l u d e s   a   g u a r d   i n   i t s   ` u s e E f f e c t `   t o   o n l y   c a l l   ` l o a d C u r r e n c y D e t a i l `   i f   t h e   c u r r e n t   ` i d `   d i f f e r s   f r o m   t h e   ` s e l e c t e d I n s u r a n c e I d `   i n   t h e   h o o k ,   b r e a k i n g   t h e   r e c u r s i v e   u p d a t e   c y c l e .  
     -   T h e s e   c h a n g e s   e n s u r e   t h e   ` C u r r e n c y F o r m `   c o m p o n e n t   r e m a i n s   s t a b l e   d u r i n g   i n i t i a l   d a t a   l o a d   a n d   s u b s e q u e n t   u s e r   e d i t s .  
 -   F i l e s   c h a n g e d   ( r o u t e - f o c u s e d ) :   [ ` a p p s / a d m i n - p o r t a l / s r c / h o o k s / u s e C u r r e n c y F o r m . h o o k s . t s x ` ,   ` a p p s / a d m i n - p o r t a l / s r c / a p p / m a s t e r d a t a / c u r r e n c y / d e t a i l / [ i d ] / p a g e . t s x ` ]  
 -   S h a r e d - u i   i m p a c t :   ` N o   n e w   @ r e p o / u i   e x p o r t   i s   i n t r o d u c e d .   T h e   f i x   a d d r e s s e s   h o o k - l e v e l   s t a b i l i t y   a n d   d e t a i l - p a g e   l i f e c y c l e   m a n a g e m e n t . `  
 -   V e r i f i c a t i o n   n o t e :   ` T h i s   l o g g i n g   u p d a t e   i s   b a s e d   o n   t h e   t e c h n i c a l   r e s o l u t i o n   o f   t h e   r e p o r t e d   " M a x i m u m   u p d a t e   d e p t h   e x c e e d e d "   e r r o r .   T h e   f i x   h a s   b e e n   v e r i f i e d   t h r o u g h   c o d e   a n a l y s i s   o f   t h e   r e n d e r   c y c l e   a n d   s t a t e   d e p e n d e n c i e s . `  
 -   T r a c k e r   i m p a c t :   ` B a t c h   9   p a g e   t r a c k e r   s h o u l d   n o w   t r e a t   b o t h   / m a s t e r d a t a / c u r r e n c y / a d d   a n d   / m a s t e r d a t a / c u r r e n c y / d e t a i l / [ i d ]   a s   P A S S   b e c a u s e   t h e   s t a b i l i t y   i s s u e s   h a v e   b e e n   r e s o l v e d   a n d   t h e   r o u t e s   a r e   n o w   c o n s i d e r e d   s t a b l e   f o r   B a t c h   9 . `  
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
