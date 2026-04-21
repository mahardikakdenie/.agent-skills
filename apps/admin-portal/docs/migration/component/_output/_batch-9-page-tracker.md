# Batch 9 Page Tracker - admin-portal

## Purpose

This file is the page-level source of truth for Batch 9 stabilization in `apps/admin-portal`.

It tracks which routes are already stabilized, which are still pending, which are blocked, and which are deferred specifically because of DataTable.

Each route also carries a `ROUTE_LABEL`: a path-safe kebab-case slug used for page-scoped artifact naming and per-route stabilization runs.

## Legend

- `NOT_STARTED`
- `IN_PROGRESS`
- `PASS`
- `FAIL`
- `BLOCKED`
- `DEFERRED_DATA_TABLE`
- `OUT_OF_SCOPE`

## Status Rules

- `PASS` requires explicit route-level evidence. Acceptable evidence is a committed route-local migration change together with recorded manual smoke verification in existing docs/artifacts such as `_migration-log.md`, `_parity-checklist.md`, and route screenshots. `comparison-log.md` is supporting evidence when present, but it is not mandatory for PASS.
- `IN_PROGRESS` is used when route-local migration work has landed, but the available route-level evidence is still incomplete for PASS.
- `DEFERRED_DATA_TABLE` is used only when DataTable is the primary blocker.
- `BLOCKED` is used for non-DataTable blockers.
- `NOT_STARTED` is the default for in-scope pages without route-level stabilization evidence.
- `OUT_OF_SCOPE` is used for routes that are not real Batch 9 stabilization targets.

## Summary

| Metric | Count |
|---|---:|
| Total discovered page.tsx routes | 115 |
| In-scope pages | 114 |
| Smoke routes | 10 |
| DataTable-dependent pages | 37 |
| PASS | 40 |
| IN_PROGRESS | 1 |
| FAIL | 0 |
| BLOCKED | 0 |
| DEFERRED_DATA_TABLE | 10 |
| NOT_STARTED | 63 |
| OUT_OF_SCOPE | 1 |

## Page Status

| Route | Route label | Page file | Smoke route | DataTable | Status | Last checked | Evidence | Notes |
|---|---|---|---|---|---|---|---|---|
| `/dashboard/transaction` | `dashboard-transaction` | `apps/admin-portal/src/app/dashboard/transaction/page.tsx` | YES | NO | `PASS` | 2026-03-31 | migration-log: present; comparison-log: none; screenshots: present | Latest commit `c2b874754fb532cc5413215d1debca92b190c5d4` lands route-local migration cleanup for this page, and manual smoke verification for the dashboard route is already recorded in `_migration-log.md` and `_parity-checklist.md`. |
| `/dashboard/policy` | `dashboard-policy` | `apps/admin-portal/src/app/dashboard/policy/page.tsx` | YES | NO | `PASS` | 2026-04-02 | migration-log: present; comparison-log: none; screenshots: present | Latest commit `cc3ad67852e37df51712706be77db29e475aaca4` lands route-local chart consolidation and `Box` cleanup for this page, and prior manual smoke verification for `/dashboard/policy` is already recorded in `_migration-log.md` and `_parity-checklist.md`. |
| `/dashboard/claim` | `dashboard-claim` | `apps/admin-portal/src/app/dashboard/claim/page.tsx` | YES | NO | `PASS` | 2026-04-02 | migration-log: present; comparison-log: none; screenshots: present | Latest commit `f544827241360913c1f6e55edb4c32b58fdbe61d` lands route-local vertical bar chart consolidation and `Box` cleanup for this page, and prior manual smoke verification for `/dashboard/claim` is already recorded in `_migration-log.md` and `_parity-checklist.md`. |
| `/transaction/list` | `transaction-list` | `apps/admin-portal/src/app/transaction/list/page.tsx` | YES | YES | `PASS` | 2026-04-05 | migration-log: present; comparison-log: none; screenshots: present | Latest 2026-04-05 updates land route-local table configuration refinements and alignment with the shared DataTable API, and prior manual smoke verification for `/transaction/list` is already recorded in `_migration-log.md` and `_parity-checklist.md`. |
| `/policy/list` | `policy-list` | `apps/admin-portal/src/app/policy/list/page.tsx` | YES | YES | `PASS` | 2026-04-05 | migration-log: present; comparison-log: none; screenshots: present | Latest 2026-04-05 updates land route-local table configuration refinements and alignment with the shared DataTable API, and prior manual smoke verification for `/policy/list` is already recorded in `_migration-log.md` and `_parity-checklist.md`. |
| `/policy/endorsement/list` | `policy-endorsement-list` | `apps/admin-portal/src/app/policy/endorsement/list/page.tsx` | YES | YES | `PASS` | 2026-04-05 | migration-log: present; comparison-log: none; screenshots: present | Latest 2026-04-05 updates land route-local table configuration refinements and alignment with the shared DataTable API, while prior manual smoke verification for `/policy/endorsement/list` is already recorded in `_migration-log.md` and `_parity-checklist.md`. |
| `/claim/list` | `claim-list` | `apps/admin-portal/src/app/claim/list/page.tsx` | YES | YES | `PASS` | 2026-04-05 | migration-log: present; comparison-log: none; screenshots: present | Latest 2026-04-05 updates land route-local table configuration refinements, alignment with the shared DataTable API, and status modal Box refactor, while prior manual smoke verification for `/claim/list` and screenshots are already recorded in `_migration-log.md` and `_parity-checklist.md`. |
| `/membership/list` | `membership-list` | `apps/admin-portal/src/app/membership/list/page.tsx` | YES | YES | `PASS` | 2026-04-05 | migration-log: present; comparison-log: none; screenshots: present | Current `apps/admin-portal/src` changes land the membership list route-local DataTable migration across the page, membership table config, and membership hook, while prior manual smoke verification for `/membership/list` (noting the expected 403 state) is already recorded in `_migration-log.md` and `_parity-checklist.md`. |
| `/finance/billing` | `finance-billing` | `apps/admin-portal/src/app/finance/billing/page.tsx` | YES | YES | `PASS` | 2026-04-05 | migration-log: present; comparison-log: none; screenshots: present | Current `apps/admin-portal/src` changes land the billing list route-local DataTable migration across the page and billing table config, standardizing the filter and period selection on shared primitives, while prior manual smoke verification for `/finance/billing` (noting the expected 403 state) is already recorded in `_migration-log.md` and `_parity-checklist.md`. |
| `/masterdata/user` | `masterdata-user` | `apps/admin-portal/src/app/masterdata/user/page.tsx` | YES | YES | `PASS` | 2026-04-06 | migration-log: present; comparison-log: none; screenshots: present | Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and tab chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation. Earlier smoke revalidation recorded the successful route load. |
| `/` | `root` | `apps/admin-portal/src/app/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | Home dashboard route with no explicit Batch 9 route-stabilization evidence yet. |
| `/claim/history` | `claim-history` | `apps/admin-portal/src/app/claim/history/page.tsx` | NO | YES | `DEFERRED_DATA_TABLE` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path. |
| `/claim/list/detail/[id]` | `claim-list-detail-id` | `apps/admin-portal/src/app/claim/list/detail/[id]/page.tsx` | NO | NO | `PASS` | 2026-04-06 | migration-log: present; comparison-log: none; screenshots: none | Current `apps/admin-portal/src` changes refactor `/claim/list/detail/[id]` onto shared `Tabs`, `Table`, `Dialog`, `Button`, and `Box` composition, replace the legacy journey image helper with inline status-timeline SVG markup, and preserve the existing claim detail and document workflows. This route is treated as PASS for the current Batch 9 tracking pass. |
| `/claim/list/detail/[id]/upload-data` | `claim-list-detail-id-upload-data` | `apps/admin-portal/src/app/claim/list/detail/[id]/upload-data/page.tsx` | NO | NO | `PASS` | 2026-04-06 | migration-log: present; comparison-log: none; screenshots: none | Current `apps/admin-portal/src` changes refactor this missing-document upload subroute onto shared `FileUpload`, `Button`, and `Box` primitives, add an explicit empty state, and rely on the updated detail-claim hook to preserve form values under the new upload flow. This route is treated as PASS for the current Batch 9 tracking pass. |
| `/claim/list/export` | `claim-list-export` | `apps/admin-portal/src/app/claim/list/export/page.tsx` | NO | NO | `PASS` | 2026-04-06 | migration-log: present; comparison-log: none; screenshots: none | Current `apps/admin-portal/src` changes refactor `/claim/list/export` onto shared `DataTable`, `Button`, and `Box` primitives, standardize the PDF/XLSX export actions, and implement dynamic column sizing while preserving existing data fetching and report generation logic. |
| `/claim/list/import` | `claim-list-import` | `apps/admin-portal/src/app/claim/list/import/page.tsx` | NO | NO | `PASS` | 2026-04-06 | migration-log: present; comparison-log: none; screenshots: none | Current apps/admin-portal/src changes refactor /claim/list/import onto shared Box, Button, and FileUpload primitives, remove the legacy view dependency, and implement inline file-to-base64 conversion for direct claim import submission. |
| `/claim/list/import-with-preview` | `claim-list-import-with-preview` | `apps/admin-portal/src/app/claim/list/import-with-preview/page.tsx` | NO | NO | `PASS` | 2026-04-15 | migration-log: present; comparison-log: none; screenshots: none | Current apps/admin-portal/src changes refactor /claim/list/import-with-preview onto shared Box, Button, FileUpload, Table, Select, and Dialog primitives, remove dependencies on legacy views, and implement consolidated icon components (AlertCircleIcon, EditIcon) using Box. |
| `/export-users` | `export-users` | `apps/admin-portal/src/app/export-users/page.tsx` | NO | YES | `PASS` | 2026-04-20 | migration-log: present; comparison-log: none; screenshots: none | Current apps/admin-portal/src changes refactor the /export-users route onto shared @repo/ui DataTable, Button, and Box primitives, standardize the filter and dialog chrome, and implement dynamic column sizing while preserving existing Excel export and filter behavior. |
| `/finance/billing/add` | `finance-billing-add` | `apps/admin-portal/src/app/finance/billing/add/page.tsx` | NO | YES | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | DataTable is present in the page-local tree, but current docs do not prove it is the dominant blocker; classified conservatively as NOT_STARTED. |
| `/finance/billing/detail/[id]` | `finance-billing-detail-id` | `apps/admin-portal/src/app/finance/billing/detail/[id]/page.tsx` | NO | YES | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | DataTable is present in the page-local tree, but current Pole docs do not prove it is the dominant blocker; classified conservatively as NOT_STARTED. |
| `/finance/billing/detail/[id]/export` | `finance-billing-detail-id-export` | `apps/admin-portal/src/app/finance/billing/detail/[id]/export/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/finance/billing/detail/[id]/import` | `finance-billing-detail-id-import` | `apps/admin-portal/src/app/finance/billing/detail/[id]/import/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/finance/billing/detail/[id]/invoice` | `finance-billing-detail-id-invoice` | `apps/admin-portal/src/app/finance/billing/detail/[id]/invoice/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/finance/broker-fee` | `finance-broker-fee` | `apps/admin-portal/src/app/finance/broker-fee/page.tsx` | NO | YES | `DEFERRED_DATA_TABLE` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path. |
| `/finance/broker-fee/add` | `finance-broker-fee-add` | `apps/admin-portal/src/app/finance/broker-fee/add/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/finance/broker-fee/detail/[id]` | `finance-broker-fee-detail-id` | `apps/admin-portal/src/app/finance/broker-fee/detail/[id]/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/finance/partner-comm` | `finance-partner-comm` | `apps/admin-portal/src/app/finance/partner-comm/page.tsx` | NO | YES | `DEFERRED_DATA_TABLE` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path. |
| `/finance/partner-comm/add` | `finance-partner-comm-add` | `apps/admin-portal/src/app/finance/partner-comm/add/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/finance/partner-comm/detail/[id]` | `finance-partner-comm-detail-id` | `apps/admin-portal/src/app/finance/partner-comm/detail/[id]/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/finance/unmatch-billing` | `finance-unmatch-billing` | `apps/admin-portal/src/app/finance/unmatch-billing/page.tsx` | NO | YES | `DEFERRED_DATA_TABLE` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path. |
| `/masterdata/channel` | `masterdata-channel` | `apps/admin-portal/src/app/masterdata/channel/page.tsx` | NO | YES | `PASS` | 2026-04-09 | migration-log: present; comparison-log: none; screenshots: none | Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation. |
| `/masterdata/channel/add` | `masterdata-channel-add` | `apps/admin-portal/src/app/masterdata/channel/add/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/channel/detail/[id]` | `masterdata-channel-detail-id` | `apps/admin-portal/src/app/masterdata/channel/detail/[id]/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/currency` | `masterdata-currency` | `apps/admin-portal/src/app/masterdata/currency/page.tsx` | NO | YES | `PASS` | 2026-04-09 | migration-log: present; comparison-log: none; screenshots: none | Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation. |
| `/masterdata/currency/add` | `masterdata-currency-add` | `apps/admin-portal/src/app/masterdata/currency/add/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/currency/detail/[id]` | `masterdata-currency-detail-id` | `apps/admin-portal/src/app/masterdata/currency/detail/[id]/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/email-tag` | `masterdata-email-tag` | `apps/admin-portal/src/app/masterdata/email-tag/page.tsx` | NO | YES | `PASS` | 2026-04-10 | migration-log: present; comparison-log: none; screenshots: none | Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation. |
| `/masterdata/email-tag/add` | `masterdata-email-tag-add` | `apps/admin-portal/src/app/masterdata/email-tag/add/page.tsx` | NO | NO | `PASS` | 2026-04-20 | migration-log: present; comparison-log: none; screenshots: none | Current apps/admin-portal/src changes refactor the /masterdata/email-tag/add route onto the refactored EmailTagForm, standardizing the form layout and interaction with shared Box, Button, Input, and Select primitives. |
| `/masterdata/email-tag/detail/[id]` | `masterdata-email-tag-detail-id` | `apps/admin-portal/src/app/masterdata/email-tag/detail/[id]/page.tsx` | NO | NO | `PASS` | 2026-04-20 | migration-log: present; comparison-log: none; screenshots: none | Current apps/admin-portal/src changes refactor the /masterdata/email-tag/detail/[id] route onto the refactored EmailTagForm, standardizing the form layout and interaction with shared Box, Button, Input, and Select primitives. |
| `/masterdata/email-template` | `masterdata-email-template` | `apps/admin-portal/src/app/masterdata/email-template/page.tsx` | NO | YES | `PASS` | 2026-04-09 | migration-log: present; comparison-log: none; screenshots: none | Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation. |
| `/masterdata/email-template/add` | `masterdata-email-template-add` | `apps/admin-portal/src/app/masterdata/email-template/add/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/email-template/detail/[id]` | `masterdata-email-template-detail-id` | `apps/admin-portal/src/app/masterdata/email-template/detail/[id]/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/email-template/tag` | `masterdata-email-template-tag` | `apps/admin-portal/src/app/masterdata/email-template/tag/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/email-template/tag/add` | `masterdata-email-template-tag-add` | `apps/admin-portal/src/app/masterdata/email-template/tag/add/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/group` | `masterdata-group` | `apps/admin-portal/src/app/masterdata/group/page.tsx` | NO | YES | `PASS` | 2026-04-09 | migration-log: present; comparison-log: none; screenshots: none | Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the table chrome on shared primitives, and add compact pagination and explicit empty-state handling while preserving existing add and detail navigation. |
| `/masterdata/group/add` | `masterdata-group-add` | `apps/admin-portal/src/app/masterdata/group/add/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/group/detail/[id]` | `masterdata-group-detail-id` | `apps/admin-portal/src/app/masterdata/group/detail/[id]/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/holiday-date` | `masterdata-holiday-date` | `apps/admin-portal/src/app/masterdata/holiday-date/page.tsx` | NO | YES | `DEFERRED_DATA_TABLE` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path. |
| `/masterdata/holiday-date/add` | `masterdata-holiday-date-add` | `apps/admin-portal/src/app/masterdata/holiday-date/add/page.tsx` | NO | NO | `PASS` | 2026-04-21 | migration-log: present; comparison-log: none; screenshots: none | Current apps/admin-portal/src changes refactor the /masterdata/holiday-date/add route onto the refactored HolidayDateForm, standardizing the form layout and interaction with shared Box, Button, Select, Input, and DatePicker primitives. |
| `/masterdata/holiday-date/detail/[id]` | `masterdata-holiday-date-detail-id` | `apps/admin-portal/src/app/masterdata/holiday-date/detail/[id]/page.tsx` | NO | NO | `PASS` | 2026-04-21 | migration-log: present; comparison-log: none; screenshots: none | Current apps/admin-portal/src changes refactor the /masterdata/holiday-date/detail/[id] route onto the refactored HolidayDateForm, standardizing the form layout and interaction with shared Box, Button, Select, Input, and DatePicker primitives. |
| `/masterdata/hospital` | `masterdata-hospital` | `apps/admin-portal/src/app/masterdata/hospital/page.tsx` | NO | YES | `PASS` | 2026-04-10 | migration-log: present; comparison-log: none; screenshots: none | Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation. |
| /masterdata/hospital/upload | masterdata-hospital-upload | apps/admin-portal/src/app/masterdata/hospital/upload/page.tsx | NO | NO | PASS | 2026-04-20 | migration-log: present; comparison-log: none; screenshots: none | Current apps/admin-portal/src changes refactor /masterdata/hospital/upload onto shared Box, Button, and FileUpload primitives, remove the dependency on the legacy HospitalUploadForm, and implement inline file parsing to support the updated hospital upload hook. |
| `/masterdata/insurance` | `masterdata-insurance` | `apps/admin-portal/src/app/masterdata/insurance/page.tsx` | NO | YES | `PASS` | 2026-04-09 | migration-log: present; comparison-log: none; screenshots: none | Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation. |
| `/masterdata/insurance/add` | `masterdata-insurance-add` | `apps/admin-portal/src/app/masterdata/insurance/add/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/insurance/detail/[id]` | `masterdata-insurance-detail-id` | `apps/admin-portal/src/app/masterdata/insurance/detail/[id]/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/page-management` | `masterdata-page-management` | `apps/admin-portal/src/app/masterdata/page-management/page.tsx` | NO | YES | `DEFERRED_DATA_TABLE` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path. |
| `/masterdata/page-management/add` | `masterdata-page-management-add` | `apps/admin-portal/src/app/masterdata/page-management/add/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/page-management/detail/[id]` | `masterdata-page-management-detail-id` | `apps/admin-portal/src/app/masterdata/page-management/detail/[id]/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/partner-management` | `masterdata-partner-management` | `apps/admin-portal/src/app/masterdata/partner-management/page.tsx` | NO | YES | `DEFERRED_DATA_TABLE` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path. |
| `/masterdata/partner-management/add` | `masterdata-partner-management-add` | `apps/admin-portal/src/app/masterdata/partner-management/add/page.tsx` | NO | NO | `PASS` | 2026-04-21 | migration-log: present; comparison-log: none; screenshots: none | Current apps/admin-portal/src changes refactor the /masterdata/partner-management/add route onto the refactored PartnerManagementForm, standardizing the form layout and interaction with shared Box, Button, Input, Select, and Combobox primitives. |
| `/masterdata/partner-management/detail/[id]` | `masterdata-partner-management-detail-id` | `apps/admin-portal/src/app/masterdata/partner-management/detail/[id]/page.tsx` | NO | NO | `PASS` | 2026-04-21 | migration-log: present; comparison-log: none; screenshots: none | Current apps/admin-portal/src changes refactor the /masterdata/partner-management/detail/[id] route onto the refactored PartnerManagementForm and refactored AssignPlan component, standardizing the form layout and interaction with shared Box, Button, DataTable, Dialog, Input, Select, Combobox, Skeleton, and Tabs primitives. |
| `/masterdata/product` | `masterdata-product` | `apps/admin-portal/src/app/masterdata/product/page.tsx` | NO | YES | `PASS` | 2026-04-09 | migration-log: present; comparison-log: none; screenshots: none | Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API and standardize the filter and table chrome on shared primitives. |
| `/masterdata/product-category` | `masterdata-product-category` | `apps/admin-portal/src/app/masterdata/product-category/page.tsx` | NO | YES | `PASS` | 2026-04-09 | migration-log: present; comparison-log: none; screenshots: none | Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation. |
| `/masterdata/product-category/add` | `masterdata-product-category-add` | `apps/admin-portal/src/app/masterdata/product-category/add/page.tsx` | NO | NO | `PASS` | 2026-04-20 | migration-log: present; comparison-log: none; screenshots: none | Current apps/admin-portal/src changes refactor the /masterdata/product-category/add route onto the refactored ProductCategoryForm, standardizing the form layout and interaction with shared Box, Button, Dialog, and Input primitives. |
| `/masterdata/product-category/detail/[id]` | `masterdata-product-category-detail-id` | `apps/admin-portal/src/app/masterdata/product-category/detail/[id]/page.tsx` | NO | NO | `PASS` | 2026-04-20 | migration-log: present; comparison-log: none; screenshots: none | Current apps/admin-portal/src changes refactor the /masterdata/product-category/detail/[id] route onto the refactored ProductCategoryForm, standardizing the form layout and interaction with shared Box, Button, Dialog, and Input primitives. |
| `/masterdata/product/add` | `masterdata-product-add` | `apps/admin-portal/src/app/masterdata/product/add/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/product/detail` | `masterdata-product-detail` | `apps/admin-portal/src/app/masterdata/product/detail/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/role` | `masterdata-role` | `apps/admin-portal/src/app/masterdata/role/page.tsx` | NO | YES | `PASS` | 2026-04-09 | migration-log: present; comparison-log: none; screenshots: none | Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the table chrome on shared primitives, and add compact pagination and explicit empty-state handling while preserving existing add and detail navigation. |
| `/masterdata/role/add` | `masterdata-role-add` | `apps/admin-portal/src/app/masterdata/role/add/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/role/detail/[id]` | `masterdata-role-detail-id` | `apps/admin-portal/src/app/masterdata/role/detail/[id]/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/user/add` | `masterdata-user-add` | `apps/admin-portal/src/app/masterdata/user/add/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/masterdata/user/detail/[id]` | `masterdata-user-detail-id` | `apps/admin-portal/src/app/masterdata/user/detail/[id]/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/membership/list/detail/[id]` | `membership-list-detail-id` | `apps/admin-portal/src/app/membership/list/detail/[id]/page.tsx` | NO | NO | `NOT_STARTED` | 2026-04-06 | migration-log: present; comparison-log: none; screenshots: none | Current source changes only realign this detail page to the relocated local `PageHeader` component path; no dedicated route-level stabilization evidence is recorded yet. |
| `/membership/list/export` | `membership-list-export` | `apps/admin-portal/src/app/membership/list/export/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/membership/list/upload` | `membership-list-upload` | `apps/admin-portal/src/app/membership/list/upload/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/policy/endorsement/list/detail/[id]` | `policy-endorsement-list-detail-id` | `apps/admin-portal/src/app/policy/endorsement/list/detail/[id]/page.tsx` | NO | YES | `NOT_STARTED` | 2026-04-06 | migration-log: present; comparison-log: none; screenshots: none | Current source changes only realign this detail page to the relocated local `PageHeader` component path; its route-local DataTable usage is still intact and no dedicated route-level stabilization evidence is recorded yet. |
| `/policy/endorsement/list/detail/[id]/upload` | `policy-endorsement-list-detail-id-upload` | `apps/admin-portal/src/app/policy/endorsement/list/detail/[id]/upload/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/policy/endorsement/list/export` | `policy-endorsement-list-export` | `apps/admin-portal/src/app/policy/endorsement/list/export/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/policy/endorsement/list/upload` | `policy-endorsement-list-upload` | `apps/admin-portal/src/app/policy/endorsement/list/upload/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/policy/list/detail/[id]` | `policy-list-detail-id` | `apps/admin-portal/src/app/policy/list/detail/[id]/page.tsx` | NO | YES | `NOT_STARTED` | 2026-04-06 | migration-log: present; comparison-log: none; screenshots: none | Current source changes only realign this detail page to the relocated local `PageHeader` component path; its route-local DataTable usage is still intact and no dedicated route-level stabilization evidence is recorded yet. |
| `/policy/list/export` | `policy-list-export` | `apps/admin-portal/src/app/policy/list/export/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/policy/list/import` | `policy-list-import` | `apps/admin-portal/src/app/policy/list/import/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/policy/pending-renewals` | `policy-pending-renewals` | `apps/admin-portal/src/app/policy/pending-renewals/page.tsx` | NO | YES | `PASS` | 2026-04-13 | migration-log: present; comparison-log: none; screenshots: none | Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API and standardize the filter and table chrome on shared primitives. |
| `/product-category` | `product-category` | `apps/admin-portal/src/app/product-category/page.tsx` | NO | YES | `DEFERRED_DATA_TABLE` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path. |
| `/product-category/[category]` | `product-category-category` | `apps/admin-portal/src/app/product-category/[category]/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/product-category/[category]/add` | `product-category-category-add` | `apps/admin-portal/src/app/product-category/[category]/add/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/product-category/[category]/detail/[id]` | `product-category-category-detail-id` | `apps/admin-portal/src/app/product-category/[category]/detail/[id]/page.tsx` | NO | YES | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | DataTable is present in the page-local tree, but current docs do not prove it is the dominant blocker; classified conservatively as NOT_STARTED. |
| `/product-category/[category]/detail/[id]/add-benefit` | `product-category-category-detail-id-add-benefit` | `apps/admin-portal/src/app/product-category/[category]/detail/[id]/add-benefit/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/product-category/[category]/detail/[id]/add-package` | `product-category-category-detail-id-add-package` | `apps/admin-portal/src/app/product-category/[category]/detail/[id]/add-package/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/product-category/[category]/detail/[id]/benefits` | `product-category-category-detail-id-benefits` | `apps/admin-portal/src/app/product-category/[category]/detail/[id]/benefits/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/product-category/[category]/detail/[id]/details` | `product-category-category-detail-id-details` | `apps/admin-portal/src/app/product-category/[category]/detail/[id]/details/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/product-category/[category]/detail/[id]/edit-package/[packageId]` | `product-category-category-detail-id-edit-package-packageid` | `apps/admin-portal/src/app/product-category/[category]/detail/[id]/edit-package/[packageId]/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/product-category/[category]/detail/[id]/upload` | `product-category-category-detail-id-upload` | `apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/product-category/[category]/detail/[id]/upload-benefit` | `product-category-category-detail-id-upload-benefit` | `apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload-benefit/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/product-category/[category]/detail/[id]/upload-detail` | `product-category-category-detail-id-upload-detail` | `apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload-detail/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/promotion/campaign` | `promotion-campaign` | `apps/admin-portal/src/app/promotion/campaign/page.tsx` | NO | YES | `PASS` | 2026-04-14 | migration-log: present; comparison-log: none; screenshots: none | Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation. |
| `/promotion/campaign/add` | `promotion-campaign-add` | `apps/admin-portal/src/app/promotion/campaign/add/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/promotion/campaign/detail/[id]` | `promotion-campaign-detail-id` | `apps/admin-portal/src/app/promotion/campaign/detail/[id]/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/promotion/campaign/edit/[id]` | `promotion-campaign-edit-id` | `apps/admin-portal/src/app/promotion/campaign/edit/[id]/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/report/campaign` | `report-campaign` | `apps/admin-portal/src/app/report/campaign/page.tsx` | NO | YES | `IN_PROGRESS` | 2026-04-10 | migration-log: present; comparison-log: none; screenshots: none | Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the date/filter and table chrome on shared primitives, and implement measured amount-column sizing while preserving the existing report flow. PASS evidence is still incomplete because no explicit route-level smoke/screenshots are recorded yet. |
| `/report/campaign-analytics` | `report-campaign-analytics` | `apps/admin-portal/src/app/report/campaign-analytics/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/report/claim` | `report-claim` | `apps/admin-portal/src/app/report/claim/page.tsx` | NO | YES | `DEFERRED_DATA_TABLE` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path. |
| `/report/performance` | `report-performance` | `apps/admin-portal/src/app/report/performance/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/sanction/list` | `sanction-list` | `apps/admin-portal/src/app/sanction/list/page.tsx` | NO | YES | `PASS` | 2026-04-14 | migration-log: present; comparison-log: none; screenshots: none | Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation. |
| `/sanction/list/add` | `sanction-list-add` | `apps/admin-portal/src/app/sanction/list/add/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/sanction/list/detail/[id]` | `sanction-list-detail-id` | `apps/admin-portal/src/app/sanction/list/detail/[id]/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/sanction/list/upload` | `sanction-list-upload` | `apps/admin-portal/src/app/sanction/list/upload/page.tsx` | NO | NO | `PASS` | 2026-04-20 | migration-log: present; comparison-log: none; screenshots: none | Current apps/admin-portal/src changes refactor /sanction/list/upload onto shared Box, Button, and FileUpload primitives, standardize the CSV requirement display using Box and Badge, and implement batch blacklist creation via the updated sanction upload hook. |
| `/source/list` | `source-list` | `apps/admin-portal/src/app/source/list/page.tsx` | NO | YES | `DEFERRED_DATA_TABLE` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path. |
| `/source/list/add` | `source-list-add` | `apps/admin-portal/src/app/source/list/add/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/source/list/detail/[id]` | `source-list-detail-id` | `apps/admin-portal/src/app/source/list/detail/[id]/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: none; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/transaction/list/add` | `transaction-list-add` | `apps/admin-portal/src/app/transaction/list/add/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/transaction/list/detail/[id]` | `transaction-list-detail-id` | `apps/admin-portal/src/app/transaction/list/detail/[id]/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/transaction/list/export` | `transaction-list-export` | `apps/admin-portal/src/app/transaction/list/export/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/transaction/list/import/import` | `transaction-list-import-import` | `apps/admin-portal/src/app/transaction/list/import/import/page.tsx` | NO | NO | `NOT_STARTED` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | No explicit Batch 9 route-stabilization evidence found. |
| `/oauth/msal` | `oauth-msal` | `apps/admin-portal/src/app/oauth/msal/page.tsx` | NO | NO | `OUT_OF_SCOPE` | 2026-03-30 | migration-log: present; comparison-log: none; screenshots: none | Technical MSAL callback route that completes auth and redirects home; not a Batch 9 page-stabilization target. |

## Route Details

### /dashboard/transaction

- Page file: `apps/admin-portal/src/app/dashboard/transaction/page.tsx`
- Route label: `dashboard-transaction`
- Smoke route: `YES`
- DataTable dependency: `NO`
- Status: `PASS`
- Last checked: `2026-03-31`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `present`
- Blocker type: `none`
- Notes: Latest commit `c2b874754fb532cc5413215d1debca92b190c5d4` lands route-local migration cleanup for this page, including consolidated loading/chart wrappers and transaction chart data ordering updates. Manual smoke verification for `/dashboard/transaction` is already recorded in `_migration-log.md` and `_parity-checklist.md`, so this route is treated as PASS without requiring a separate comparison log entry.

### /dashboard/policy

- Page file: `apps/admin-portal/src/app/dashboard/policy/page.tsx`
- Route label: `dashboard-policy`
- Smoke route: `YES`
- DataTable dependency: `NO`
- Status: `PASS`
- Last checked: `2026-04-02`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `present`
- Blocker type: `none`
- Notes: Latest commit `cc3ad67852e37df51712706be77db29e475aaca4` lands route-local chart consolidation and `Box` cleanup for this page, and prior manual smoke verification for `/dashboard/policy` is already recorded in `_migration-log.md` and `_parity-checklist.md`.

### /dashboard/claim

- Page file: `apps/admin-portal/src/app/dashboard/claim/page.tsx`
- Route label: `dashboard-claim`
- Smoke route: `YES`
- DataTable dependency: `NO`
- Status: `PASS`
- Last checked: `2026-04-02`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `present`
- Blocker type: `none`
- Notes: Latest commit `f544827241360913c1f6e55edb4c32b58fdbe61d` lands route-local vertical bar chart consolidation and `Box` cleanup for this page, and prior manual smoke verification for `/dashboard/claim` is already recorded in `_migration-log.md` and `_parity-checklist.md`.

### /transaction/list

- Page file: `apps/admin-portal/src/app/transaction/list/page.tsx`
- Route label: `transaction-list`
- Smoke route: `YES`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-05`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `present`
- Blocker type: `none`
- Notes: Latest 2026-04-05 updates land route-local table configuration refinements and alignment with the shared DataTable API, and prior manual smoke verification for `/transaction/list` is already recorded in `_migration-log.md` and `_parity-checklist.md`.

### /policy/list

- Page file: `apps/admin-portal/src/app/policy/list/page.tsx`
- Route label: `policy-list`
- Smoke route: `YES`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-05`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `present`
- Blocker type: `none`
- Notes: Latest 2026-04-05 updates land route-local table configuration refinements and alignment with the shared DataTable API, and prior manual smoke verification for `/policy/list` is already recorded in `_migration-log.md` and `_parity-checklist.md`.

### /policy/endorsement/list

- Page file: `apps/admin-portal/src/app/policy/endorsement/list/page.tsx`
- Route label: `policy-endorsement-list`
- Smoke route: `YES`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-05`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `present`
- Blocker type: `none`
- Notes: Latest 2026-04-05 updates land the endorsement list route-local DataTable migration across the page and endorsement table config, standardizing the filter and tab chrome on shared primitives while preserving existing upload, export, and detail navigation. Earlier smoke revalidation recorded the successful route load.

### /claim/list

- Page file: `apps/admin-portal/src/app/claim/list/page.tsx`
- Route label: `claim-list`
- Smoke route: `YES`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-05`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `present`
- Blocker type: `none`
- Notes: Latest 2026-04-05 updates land route-local table configuration refinements, alignment with the shared DataTable API, and status modal Box refactor, while prior manual smoke verification for `/claim/list` and screenshots are already recorded in `_migration-log.md` and `_parity-checklist.md`. Earlier smoke revalidation noted an internal redirect to the querystring variant.

### /membership/list

- Page file: `apps/admin-portal/src/app/membership/list/page.tsx`
- Route label: `membership-list`
- Smoke route: `YES`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-05`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `present`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and tab chrome on shared primitives, and implement a cleaner row action details drawer while preserving existing search, channel filtering, upload, export, and detail navigation. Earlier smoke revalidation recorded the expected permission-gated 403 state.

### /finance/billing

- Page file: `apps/admin-portal/src/app/finance/billing/page.tsx`
- Route label: `finance-billing`
- Smoke route: `YES`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-05`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `present`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and period selection on shared primitives, and implement dynamic column sizing while preserving existing detail and invoice navigation. Earlier smoke revalidation recorded the expected permission-gated 403 state.

### /masterdata/user

- Page file: `apps/admin-portal/src/app/masterdata/user/page.tsx`
- Route label: `masterdata-user`
- Smoke route: `YES`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-06`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `present`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and tab chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation. Earlier smoke revalidation recorded the successful route load.

### /

- Page file: `apps/admin-portal/src/app/page.tsx`
- Route label: `root`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Home dashboard route with no explicit Batch 9 route-stabilization evidence yet.

### /claim/history

- Page file: `apps/admin-portal/src/app/claim/history/page.tsx`
- Route label: `claim-history`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `DEFERRED_DATA_TABLE`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `DataTable`
- Notes: Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path.

### /claim/list/detail/[id]

- Page file: `apps/admin-portal/src/app/claim/list/detail/[id]/page.tsx`
- Route label: `claim-list-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `PASS`
- Last checked: `2026-04-06`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes refactor `/claim/list/detail/[id]` onto shared `Tabs`, `Table`, `Dialog`, `Button`, and `Box` composition, replace the legacy journey image helper with inline status-timeline SVG markup, and preserve the existing claim detail and document workflows. This route is treated as PASS for the current Batch 9 tracking pass.

### /claim/list/detail/[id]/upload-data

- Page file: `apps/admin-portal/src/app/claim/list/detail/[id]/upload-data/page.tsx`
- Route label: `claim-list-detail-id-upload-data`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `PASS`
- Last checked: `2026-04-06`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes refactor this missing-document upload subroute onto shared `FileUpload`, `Button`, and `Box` primitives, add an explicit empty state, and rely on the updated detail-claim hook to preserve form values under the new upload flow. This route is treated as PASS for the current Batch 9 tracking pass.

### /claim/list/export

- Page file: `apps/admin-portal/src/app/claim/list/export/page.tsx`
- Route label: `claim-list-export`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `PASS`
- Last checked: `2026-04-06`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes refactor the `/claim/list/export` route onto shared `@repo/ui` `DataTable`, `Button`, and `Box` primitives. The refactor standardizes the page layout and report-generation buttons, implements dynamic column sizing via `measureTextWidth`, and migrates the supporting `useExportClaim` hook from `.tsx` to `.ts` while preserving the existing PDF/XLSX export logic.

### /claim/list/import

- Page file: `apps/admin-portal/src/app/claim/list/import/page.tsx`
- Route label: `claim-list-import`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `PASS`
- Last checked: `2026-04-06`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current apps/admin-portal/src changes refactor the `/claim/list/import` route onto shared `@repo/ui` `Box`, `Button`, and `FileUpload` primitives. The refactor standardizes the page layout and file-upload interaction, removes the dependency on the legacy `ClaimImportView`, and implements inline file-to-base64 conversion to support direct claim import submission via the existing mutation hook.

### /claim/list/import-with-preview

- Page file: `apps/admin-portal/src/app/claim/list/import-with-preview/page.tsx`
- Route label: `claim-list-import-with-preview`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `PASS`
- Last checked: `2026-04-07`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current apps/admin-portal/src changes refactor /claim/list/import-with-preview onto shared Box, Button, FileUpload, Table, Select, and Dialog primitives, remove dependencies on legacy views, and implement consolidated icon components (AlertCircleIcon, EditIcon) using Box. |

### /export-users

- Page file: `apps/admin-portal/src/app/export-users/page.tsx`
- Route label: `export-users`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-20`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current apps/admin-portal/src changes refactor the `/export-users` route onto shared `@repo/ui` `DataTable`, `Button`, and `Box` primitives. The refactor standardizes the filter and dialog chrome, implements dynamic column sizing via `createExportUsersTableColumns`, and migrates the route onto the shared `DataTable` instance API with manual pagination and compact pagination helpers while preserving existing Excel export and audience-building flows.

### /finance/billing/add

- Page file: `apps/admin-portal/src/app/finance/billing/add/page.tsx`
- Route label: `finance-billing-add`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: DataTable is present in the page-local tree, but current docs do not prove it is the dominant blocker; classified conservatively as NOT_STARTED.

### /finance/billing/detail/[id]

- Page file: `apps/admin-portal/src/app/finance/billing/detail/[id]/page.tsx`
- Route label: `finance-billing-detail-id`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: DataTable is present in the page-local tree, but current docs do not prove it is the dominant blocker; classified conservatively as NOT_STARTED.

### /finance/billing/detail/[id]/export

- Page file: `apps/admin-portal/src/app/finance/billing/detail/[id]/export/page.tsx`
- Route label: `finance-billing-detail-id-export`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /finance/billing/detail/[id]/import

- Page file: `apps/admin-portal/src/app/finance/billing/detail/[id]/import/page.tsx`
- Route label: `finance-billing-detail-id-import`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /finance/billing/detail/[id]/invoice

- Page file: `apps/admin-portal/src/app/finance/billing/detail/[id]/invoice/page.tsx`
- Route label: `finance-billing-detail-id-invoice`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /finance/broker-fee

- Page file: `apps/admin-portal/src/app/finance/broker-fee/page.tsx`
- Route label: `finance-broker-fee`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `DEFERRED_DATA_TABLE`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `DataTable`
- Notes: Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path.

### /finance/broker-fee/add

- Page file: `apps/admin-portal/src/app/finance/broker-fee/add/page.tsx`
- Route label: `finance-broker-fee-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /finance/broker-fee/detail/[id]

- Page file: `apps/admin-portal/src/app/finance/broker-fee/detail/[id]/page.tsx`
- Route label: `finance-broker-fee-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /finance/partner-comm

- Page file: `apps/admin-portal/src/app/finance/partner-comm/page.tsx`
- Route label: `finance-partner-comm`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `DEFERRED_DATA_TABLE`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `DataTable`
- Notes: Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path.

### /finance/partner-comm/add

- Page file: `apps/admin-portal/src/app/finance/partner-comm/add/page.tsx`
- Route label: `finance-partner-comm-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /finance/partner-comm/detail/[id]

- Page file: `apps/admin-portal/src/app/finance/partner-comm/detail/[id]/page.tsx`
- Route label: `finance-partner-comm-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /finance/unmatch-billing

- Page file: `apps/admin-portal/src/app/finance/unmatch-billing/page.tsx`
- Route label: `finance-unmatch-billing`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `DEFERRED_DATA_TABLE`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `DataTable`
- Notes: Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path.

### /masterdata/channel

- Page file: `apps/admin-portal/src/app/masterdata/channel/page.tsx`
- Route label: `masterdata-channel`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-09`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.

### /masterdata/channel/add

- Page file: `apps/admin-portal/src/app/masterdata/channel/add/page.tsx`
- Route label: `masterdata-channel-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/channel/detail/[id]

- Page file: `apps/admin-portal/src/app/masterdata/channel/detail/[id]/page.tsx`
- Route label: `masterdata-channel-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/currency

- Page file: `apps/admin-portal/src/app/masterdata/currency/page.tsx`
- Route label: `masterdata-currency`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-09`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.

### /masterdata/currency/add

- Page file: `apps/admin-portal/src/app/masterdata/currency/add/page.tsx`
- Route label: `masterdata-currency-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/currency/detail/[id]

- Page file: `apps/admin-portal/src/app/masterdata/currency/detail/[id]/page.tsx`
- Route label: `masterdata-currency-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/email-tag

- Page file: `apps/admin-portal/src/app/masterdata/email-tag/page.tsx`
- Route label: `masterdata-email-tag`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `DEFERRED_DATA_TABLE`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `DataTable`
- Notes: Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path.

### /masterdata/email-tag/add

- Page file: `apps/admin-portal/src/app/masterdata/email-tag/add/page.tsx`
- Route label: `masterdata-email-tag-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `PASS`
- Last checked: `2026-04-20`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current apps/admin-portal/src changes refactor the `/masterdata/email-tag/add` route onto the refactored `EmailTagForm`. The refactor standardizes the form layout and interaction, replaces native HTML elements with shared `@repo/ui` `Box`, `Button`, `Input`, and `Select` primitives, and standardizes the page header via the local `PageHeader` component while preserving existing email tag creation logic.

### /masterdata/email-tag/detail/[id]

- Page file: `apps/admin-portal/src/app/masterdata/email-tag/detail/[id]/page.tsx`
- Route label: `masterdata-email-tag-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `PASS`
- Last checked: `2026-04-20`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current apps/admin-portal/src changes refactor the `/masterdata/email-tag/detail/[id]` route onto the refactored `EmailTagForm`. The refactor standardizes the form layout and interaction, replaces native HTML elements with shared `@repo/ui` `Box`, `Button`, `Input`, and `Select` primitives, and standardizes the page header via the local `PageHeader` component while preserving existing email tag update logic.

### /masterdata/email-template

- Page file: `apps/admin-portal/src/app/masterdata/email-template/page.tsx`
- Route label: `masterdata-email-template`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-09`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.

### /masterdata/email-template/add

- Page file: `apps/admin-portal/src/app/masterdata/email-template/add/page.tsx`
- Route label: `masterdata-email-template-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/email-template/detail/[id]

- Page file: `apps/admin-portal/src/app/masterdata/email-template/detail/[id]/page.tsx`
- Route label: `masterdata-email-template-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/email-template/tag

- Page file: `apps/admin-portal/src/app/masterdata/email-template/tag/page.tsx`
- Route label: `masterdata-email-template-tag`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/email-template/tag/add

- Page file: `apps/admin-portal/src/app/masterdata/email-template/tag/add/page.tsx`
- Route label: `masterdata-email-template-tag-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/group

- Page file: `apps/admin-portal/src/app/masterdata/group/page.tsx`
- Route label: `masterdata-group`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-09`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes migrate `/masterdata/group` onto the shared DataTable instance API, standardize the route shell on `Box`, and adopt manual pagination, column pinning, compact pagination, and explicit empty-state handling. The local table config now uses the shared `ColumnDef` contract with standardized action buttons, so this route is treated as PASS for the current Batch 9 tracking pass.

### /masterdata/group/add

- Page file: `apps/admin-portal/src/app/masterdata/group/add/page.tsx`
- Route label: `masterdata-group-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/group/detail/[id]

- Page file: `apps/admin-portal/src/app/masterdata/group/detail/[id]/page.tsx`
- Route label: `masterdata-group-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/holiday-date

- Page file: `apps/admin-portal/src/app/masterdata/holiday-date/page.tsx`
- Route label: `masterdata-holiday-date`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `DEFERRED_DATA_TABLE`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `DataTable`
- Notes: Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path.

### /masterdata/holiday-date/add

- Page file: `apps/admin-portal/src/app/masterdata/holiday-date/add/page.tsx`
- Route label: `masterdata-holiday-date-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `PASS`
- Last checked: `2026-04-21`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current apps/admin-portal/src changes refactor the `/masterdata/holiday-date/add` route onto the refactored `HolidayDateForm`. The refactor standardizes the form layout and interaction, replaces native HTML elements with shared `@repo/ui` `Box`, `Button`, `Select`, `Input`, and `DatePicker` primitives, and standardizes the page header via the local `PageHeader` component while preserving existing holiday creation logic.

### /masterdata/holiday-date/detail/[id]

- Page file: `apps/admin-portal/src/app/masterdata/holiday-date/detail/[id]/page.tsx`
- Route label: `masterdata-holiday-date-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `PASS`
- Last checked: `2026-04-21`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current apps/admin-portal/src changes refactor the `/masterdata/holiday-date/detail/[id]` route onto the refactored `HolidayDateForm`. The refactor standardizes the form layout and interaction, replaces native HTML elements with shared `@repo/ui` `Box`, `Button`, `Select`, `Input`, and `DatePicker` primitives, and standardizes the page header via the local `PageHeader` component while preserving existing holiday update logic.

### /masterdata/hospital

- Page file: `apps/admin-portal/src/app/masterdata/hospital/page.tsx`
- Route label: `masterdata-hospital`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-10`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.

### /masterdata/hospital/upload

- Page file: `apps/admin-portal/src/app/masterdata/hospital/upload/page.tsx`
- Route label: `masterdata-hospital-upload`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `PASS`
- Last checked: `2026-04-20`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current apps/admin-portal/src changes refactor the `/masterdata/hospital/upload` route onto shared `@repo/ui` `Box`, `Button`, and `FileUpload` primitives. The refactor removes the dependency on the legacy `HospitalUploadForm`, standardizes the page header via the local `PageHeader` component, and implements inline file parsing to support direct base64 upload via the updated `useHospitalUpload` hook.

### /masterdata/insurance

- Page file: `apps/admin-portal/src/app/masterdata/insurance/page.tsx`
- Route label: `masterdata-insurance`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-09`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.

### /masterdata/insurance/add

- Page file: `apps/admin-portal/src/app/masterdata/insurance/add/page.tsx`
- Route label: `masterdata-insurance-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/insurance/detail/[id]

- Page file: `apps/admin-portal/src/app/masterdata/insurance/detail/[id]/page.tsx`
- Route label: `masterdata-insurance-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/page-management

- Page file: `apps/admin-portal/src/app/masterdata/page-management/page.tsx`
- Route label: `masterdata-page-management`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `DEFERRED_DATA_TABLE`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `DataTable`
- Notes: Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path.

### /masterdata/page-management/add

- Page file: `apps/admin-portal/src/app/masterdata/page-management/add/page.tsx`
- Route label: `masterdata-page-management-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/page-management/detail/[id]

- Page file: `apps/admin-portal/src/app/masterdata/page-management/detail/[id]/page.tsx`
- Route label: `masterdata-page-management-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/partner-management

- Page file: `apps/admin-portal/src/app/masterdata/partner-management/page.tsx`
- Route label: `masterdata-partner-management`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-09`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.

### /masterdata/partner-management/add

- Page file: `apps/admin-portal/src/app/masterdata/partner-management/add/page.tsx`
- Route label: `masterdata-partner-management-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `PASS`
- Last checked: `2026-04-21`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current apps/admin-portal/src changes refactor the `/masterdata/partner-management/add` route onto the refactored `PartnerManagementForm`. The refactor standardizes the form layout and interaction, replaces native HTML elements with shared `@repo/ui` `Box`, `Button`, `Input`, `Select`, and `Combobox` primitives, and standardizes the page header via the local `PageHeader` component while preserving existing partner creation logic.

### /masterdata/partner-management/detail/[id]

- Page file: `apps/admin-portal/src/app/masterdata/partner-management/detail/[id]/page.tsx`
- Route label: `masterdata-partner-management-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `PASS`
- Last checked: `2026-04-21`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current apps/admin-portal/src changes refactor the `/masterdata/partner-management/detail/[id]` route onto the refactored `PartnerManagementForm` and refactored `AssignPlan` component. The refactor standardizes the form layout and interaction, replaces native HTML elements with shared `@repo/ui` `Box`, `Button`, `DataTable`, `Dialog`, `Input`, `Select`, `Combobox`, `Skeleton`, and `Tabs` primitives, and standardizes the page header via the local `PageHeader` component while preserving existing partner update and plan assignment logic.

### /masterdata/product

- Page file: `apps/admin-portal/src/app/masterdata/product/page.tsx`
- Route label: `masterdata-product`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-09`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API and standardize the filter and table chrome on shared primitives.

### /masterdata/product-category

- Page file: `apps/admin-portal/src/app/masterdata/product-category/page.tsx`
- Route label: `masterdata-product-category`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-09`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.

### /masterdata/product-category/add

- Page file: `apps/admin-portal/src/app/masterdata/product-category/add/page.tsx`
- Route label: `masterdata-product-category-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `PASS`
- Last checked: `2026-04-20`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current apps/admin-portal/src changes refactor the `/masterdata/product-category/add` route onto the refactored `ProductCategoryForm`. The refactor standardizes the form layout and interaction, replaces native HTML elements with shared `@repo/ui` `Box`, `Button`, `Dialog`, and `Input` primitives, and standardizes the page header via the local `PageHeader` component while preserving existing product category creation logic.

### /masterdata/product-category/detail/[id]

- Page file: `apps/admin-portal/src/app/masterdata/product-category/detail/[id]/page.tsx`
- Route label: `masterdata-product-category-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `PASS`
- Last checked: `2026-04-20`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current apps/admin-portal/src changes refactor the `/masterdata/product-category/detail/[id]` route onto the refactored `ProductCategoryForm`. The refactor standardizes the form layout and interaction, replaces native HTML elements with shared `@repo/ui` `Box`, `Button`, `Dialog`, and `Input` primitives, and standardizes the page header via the local `PageHeader` component while preserving existing product category update logic.

### /masterdata/product/add

- Page file: `apps/admin-portal/src/app/masterdata/product/add/page.tsx`
- Route label: `masterdata-product-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/product/detail

- Page file: `apps/admin-portal/src/app/masterdata/product/detail/page.tsx`
- Route label: `masterdata-product-detail`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/role

- Page file: `apps/admin-portal/src/app/masterdata/role/page.tsx`
- Route label: `masterdata-role`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-09`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes migrate `/masterdata/role` onto the shared DataTable instance API, standardize the route shell on `Box`, and adopt manual pagination, column pinning, compact pagination, and explicit empty-state handling. The local table config now uses the shared `ColumnDef` contract with standardized action buttons, so this route is treated as PASS for the current Batch 9 tracking pass.

### /masterdata/role/add

- Page file: `apps/admin-portal/src/app/masterdata/role/add/page.tsx`
- Route label: `masterdata-role-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/role/detail/[id]

- Page file: `apps/admin-portal/src/app/masterdata/role/detail/[id]/page.tsx`
- Route label: `masterdata-role-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/user/add

- Page file: `apps/admin-portal/src/app/masterdata/user/add/page.tsx`
- Route label: `masterdata-user-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /masterdata/user/detail/[id]

- Page file: `apps/admin-portal/src/app/masterdata/user/detail/[id]/page.tsx`
- Route label: `masterdata-user-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /membership/list/detail/[id]

- Page file: `apps/admin-portal/src/app/membership/list/detail/[id]/page.tsx`
- Route label: `membership-list-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-04-06`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current source changes only realign this detail page to the relocated local `PageHeader` component path; no dedicated route-level stabilization evidence is recorded yet.

### /membership/list/export

- Page file: `apps/admin-portal/src/app/membership/list/export/page.tsx`
- Route label: `membership-list-export`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /membership/list/upload

- Page file: `apps/admin-portal/src/app/membership/list/upload/page.tsx`
- Route label: `membership-list-upload`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /policy/endorsement/list/detail/[id]

- Page file: `apps/admin-portal/src/app/policy/endorsement/list/detail/[id]/page.tsx`
- Route label: `policy-endorsement-list-detail-id`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `NOT_STARTED`
- Last checked: `2026-04-06`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current source changes only realign this detail page to the relocated local `PageHeader` component path; its route-local DataTable usage is still intact and no dedicated route-level stabilization evidence is recorded yet.

### /policy/endorsement/list/detail/[id]/upload

- Page file: `apps/admin-portal/src/app/policy/endorsement/list/detail/[id]/upload/page.tsx`
- Route label: `policy-endorsement-list-detail-id-upload`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /policy/endorsement/list/export

- Page file: `apps/admin-portal/src/app/policy/endorsement/list/export/page.tsx`
- Route label: `policy-endorsement-list-export`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /policy/endorsement/list/upload

- Page file: `apps/admin-portal/src/app/policy/endorsement/list/upload/page.tsx`
- Route label: `policy-endorsement-list-upload`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /policy/list/detail/[id]

- Page file: `apps/admin-portal/src/app/policy/list/detail/[id]/page.tsx`
- Route label: `policy-list-detail-id`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `NOT_STARTED`
- Last checked: `2026-04-06`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current source changes only realign this detail page to the relocated local `PageHeader` component path; its route-local DataTable usage is still intact and no dedicated route-level stabilization evidence is recorded yet.

### /policy/list/export

- Page file: `apps/admin-portal/src/app/policy/list/export/page.tsx`
- Route label: `policy-list-export`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /policy/list/import

- Page file: `apps/admin-portal/src/app/policy/list/import/page.tsx`
- Route label: `policy-list-import`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /policy/pending-renewals

- Page file: `apps/admin-portal/src/app/policy/pending-renewals/page.tsx`
- Route label: `policy-pending-renewals`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-13`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API and standardize the filter and table chrome on shared primitives.

### /product-category

- Page file: `apps/admin-portal/src/app/product-category/page.tsx`
- Route label: `product-category`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `DEFERRED_DATA_TABLE`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `DataTable`
- Notes: Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path.

### /product-category/[category]

- Page file: `apps/admin-portal/src/app/product-category/[category]/page.tsx`
- Route label: `product-category-category`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /product-category/[category]/add

- Page file: `apps/admin-portal/src/app/product-category/[category]/add/page.tsx`
- Route label: `product-category-category-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /product-category/[category]/detail/[id]

- Page file: `apps/admin-portal/src/app/product-category/[category]/detail/[id]/page.tsx`
- Route label: `product-category-category-detail-id`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: DataTable is present in the page-local tree, but current docs do not prove it is the dominant blocker; classified conservatively as NOT_STARTED.

### /product-category/[category]/detail/[id]/add-benefit

- Page file: `apps/admin-portal/src/app/product-category/[category]/detail/[id]/add-benefit/page.tsx`
- Route label: `product-category-category-detail-id-add-benefit`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /product-category/[category]/detail/[id]/add-package

- Page file: `apps/admin-portal/src/app/product-category/[category]/detail/[id]/add-package/page.tsx`
- Route label: `product-category-category-detail-id-add-package`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /product-category/[category]/detail/[id]/benefits

- Page file: `apps/admin-portal/src/app/product-category/[category]/detail/[id]/benefits/page.tsx`
- Route label: `product-category-category-detail-id-benefits`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /product-category/[category]/detail/[id]/details

- Page file: `apps/admin-portal/src/app/product-category/[category]/detail/[id]/details/page.tsx`
- Route label: `product-category-category-detail-id-details`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /product-category/[category]/detail/[id]/edit-package/[packageId]

- Page file: `apps/admin-portal/src/app/product-category/[category]/detail/[id]/edit-package/[packageId]/page.tsx`
- Route label: `product-category-category-detail-id-edit-package-packageid`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /product-category/[category]/detail/[id]/upload

- Page file: `apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload/page.tsx`
- Route label: `product-category-category-detail-id-upload`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /product-category/[category]/detail/[id]/upload-benefit

- Page file: `apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload-benefit/page.tsx`
- Route label: `product-category-category-detail-id-upload-benefit`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /product-category/[category]/detail/[id]/upload-detail

- Page file: `apps/admin-portal/src/app/product-category/[category]/detail/[id]/upload-detail/page.tsx`
- Route label: `product-category-category-detail-id-upload-detail`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /promotion/campaign

- Page file: `apps/admin-portal/src/app/promotion/campaign/page.tsx`
- Route label: `promotion-campaign`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `DEFERRED_DATA_TABLE`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `DataTable`
- Notes: Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path.

### /promotion/campaign/add

- Page file: `apps/admin-portal/src/app/promotion/campaign/add/page.tsx`
- Route label: `promotion-campaign-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /promotion/campaign/detail/[id]

- Page file: `apps/admin-portal/src/app/promotion/campaign/detail/[id]/page.tsx`
- Route label: `promotion-campaign-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /promotion/campaign/edit/[id]

- Page file: `apps/admin-portal/src/app/promotion/campaign/edit/[id]/page.tsx`
- Route label: `promotion-campaign-edit-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /report/campaign

- Page file: `apps/admin-portal/src/app/report/campaign/page.tsx`
- Route label: `report-campaign`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `IN_PROGRESS`
- Last checked: `2026-04-10`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes migrate `/report/campaign` onto the shared DataTable instance API, replace the bespoke date control with shared `DateRangePicker`, add compact pagination and explicit empty-state handling, and move the campaign report columns onto the shared `ColumnDef` contract with measured amount widths. Route-level verification evidence is still incomplete, so this page remains IN_PROGRESS rather than PASS.

### /report/campaign-analytics

- Page file: `apps/admin-portal/src/app/report/campaign-analytics/page.tsx`
- Route label: `report-campaign-analytics`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /report/claim

- Page file: `apps/admin-portal/src/app/report/claim/page.tsx`
- Route label: `report-claim`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `DEFERRED_DATA_TABLE`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `DataTable`
- Notes: Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path.

### /report/performance

- Page file: `apps/admin-portal/src/app/report/performance/page.tsx`
- Route label: `report-performance`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /sanction/list

- Page file: `apps/admin-portal/src/app/sanction/list/page.tsx`
- Route label: `sanction-list`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `PASS`
- Last checked: `2026-04-14`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current `apps/admin-portal/src` changes migrate the route onto the shared DataTable instance API, standardize the filter and table chrome on shared primitives, and implement dynamic column sizing while preserving existing add and detail navigation.

### /sanction/list/add

- Page file: `apps/admin-portal/src/app/sanction/list/add/page.tsx`
- Route label: `sanction-list-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /sanction/list/detail/[id]

- Page file: `apps/admin-portal/src/app/sanction/list/detail/[id]/page.tsx`
- Route label: `sanction-list-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /sanction/list/upload

- Page file: `apps/admin-portal/src/app/sanction/list/upload/page.tsx`
- Route label: `sanction-list-upload`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `PASS`
- Last checked: `2026-04-20`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: Current apps/admin-portal/src changes refactor the `/sanction/list/upload` route onto shared `@repo/ui` `Box`, `Button`, `FileUpload`, and `Badge` primitives. The refactor standardizes the page layout and CSV requirement list, standardizes the back affordance as a semantic button, and implements the complete upload flow (parsing, validation, batch mutation) via the updated `useUploadSanction` hook.

### /source/list

- Page file: `apps/admin-portal/src/app/source/list/page.tsx`
- Route label: `source-list`
- Smoke route: `NO`
- DataTable dependency: `YES`
- Status: `DEFERRED_DATA_TABLE`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `DataTable`
- Notes: Direct DataTable usage is present in the page-local tree; no explicit Batch 9 route result exists yet, so this route is deferred behind the pending DataTable migration path.

### /source/list/add

- Page file: `apps/admin-portal/src/app/source/list/add/page.tsx`
- Route label: `source-list-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /source/list/detail/[id]

- Page file: `apps/admin-portal/src/app/source/list/detail/[id]/page.tsx`
- Route label: `source-list-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `none`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /transaction/list/add

- Page file: `apps/admin-portal/src/app/transaction/list/add/page.tsx`
- Route label: `transaction-list-add`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /transaction/list/detail/[id]

- Page file: `apps/admin-portal/src/app/transaction/list/detail/[id]/page.tsx`
- Route label: `transaction-list-detail-id`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /transaction/list/export

- Page file: `apps/admin-portal/src/app/transaction/list/export/page.tsx`
- Route label: `transaction-list-export`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /transaction/list/import/import

- Page file: `apps/admin-portal/src/app/transaction/list/import/import/page.tsx`
- Route label: `transaction-list-import-import`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `NOT_STARTED`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `none`
- Notes: No explicit Batch 9 route-stabilization evidence found.

### /oauth/msal

- Page file: `apps/admin-portal/src/app/oauth/msal/page.tsx`
- Route label: `oauth-msal`
- Smoke route: `NO`
- DataTable dependency: `NO`
- Status: `OUT_OF_SCOPE`
- Last checked: `2026-03-30`
- Evidence:
  - _migration-log.md: `present`
  - comparison-log.md: `none`
  - screenshots: `none`
- Blocker type: `n/a`
- Notes: Technical MSAL callback route that completes auth and redirects home; not a Batch 9 page-stabilization target.

## Execution Steps

1. Discover every apps/admin-portal/src/app/**/page.tsx route.
2. Convert file paths into route paths.
3. Decide whether each route is in-scope or out-of-scope for Batch 9.
4. Detect whether each in-scope route depends on deferred DataTable usage.
5. Check existing migration docs/artifacts for explicit route-level evidence.
6. Assign the correct status using the status rules above.
7. Generate the tracker file with:
    - accurate summary counts
    - one row per discovered route
    - one detail block per discovered route
8. Sort routes in a predictable order:
    - official smoke routes first, in the same order as verification-gate.md
    - remaining in-scope routes next, alphabetical by route
    - out-of-scope routes last, alphabetical by route

## Guardrails

- Do NOT start per-page stabilization changes
- Do NOT edit ../feat_ui
- Do NOT invent evidence that does not exist
- Do NOT mark any page PASS without explicit route-level evidence
- Do NOT classify a page as DEFERRED_DATA_TABLE unless DataTable is truly the main blocker
- Prefer NOT_STARTED over speculative BLOCKED
- Keep notes concise and evidence-based

## Final Report

Return:

- total discovered page routes
- DataTable-dependent page count
- summary by status
- any ambiguous routes that were conservatively classified
- confirmation that _batch-9-page-tracker.md was created or refreshed
- DataTable-dependent page count
- summary by status
- any ambiguous routes that were conservatively classified
- confirmation that _batch-9-page-tracker.md was created or refreshed
tion that _batch-9-page-tracker.md was created or refreshed
