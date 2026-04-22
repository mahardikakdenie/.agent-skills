
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
