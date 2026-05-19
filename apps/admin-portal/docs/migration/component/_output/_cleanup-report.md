# Cleanup Report - admin-portal - 2026-05-19

## Batch 10A Deep Unused-File Audit

Scope: audit only for `apps/admin-portal`. No source files, public assets, or package dependencies were deleted or modified.

### Preflight

- Batch 9 tracker summary/table: 115 discovered `page.tsx` routes, 114 in-scope, 114 `PASS`, 1 `OUT_OF_SCOPE` (`/oauth/msal`), 0 non-pass in-scope pages.
- Tracker caveat: lower detail blocks still contain stale `NOT_STARTED` entries at `_batch-9-page-tracker.md` lines 326, 776, 791, and 1587. The top summary and page-status table mark the in-scope routes as `PASS`; this report records the mismatch but does not edit Batch 9 docs.
- Verification command copied from `verification-gate.md`: `pnpm --filter admin-portal check-types`.
- Baseline typecheck result: PASS.

### Tool Signals

| Tool | Command | Result |
| ---- | ------- | ------ |
| Typecheck | `pnpm --filter admin-portal check-types` | PASS |
| knip | `pnpm dlx knip --production --no-exit-code` | Reported 142 unused files overall; 96 are in this Batch 10A file-audit scope. Also reported unused dependency/export/type signals for later Batch 10C review. |
| ts-prune | `pnpm dlx ts-prune` | Reported many unused exports, including expected Next.js convention false positives (`layout.tsx`, `page.tsx`, `route.ts`, `proxy.ts`). Used as supporting signal only. |
| depcheck | `pnpm dlx depcheck apps/admin-portal` | Reported dependency signals (`@repo/config`, `final-form`, toolchain dev deps) and false-positive `@public/*` missing deps. No dependency changes made in Batch 10A. |

### Evidence Method

For each `SAFE_DELETE_UNUSED` candidate below, evidence means all of:

- `knip --production --reporter json` lists the file under `issues[].files`.
- Targeted `rg --fixed-strings` checks for the alias path, route-local relative import, or exported symbol returned no live source references outside the file or outside another `SAFE_DELETE_UNUSED` file in the same group.
- The file is not a Next.js or tooling convention file.
- Deletion was not performed in Batch 10A; Batch 10B must still delete in small groups and rerun `pnpm --filter admin-portal check-types`.

### Candidate Ledger

| File | Decision | Evidence / Reason |
| ---- | -------- | ----------------- |
| `src/app/finance/broker-fee/hook.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "./hook" src/app/finance/broker-fee`: 0; current route imports `@/hooks/useBrokerFee.hooks`. |
| `src/app/masterdata/channel/hooks.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "./hooks" src/app/masterdata/channel`: 0. |
| `src/app/masterdata/currency/hooks.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "./hooks" src/app/masterdata/currency`: 0. |
| `src/app/masterdata/email-tag/hooks.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "./hooks" src/app/masterdata/email-tag`: 0. |
| `src/app/masterdata/group/hooks.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "./hooks" src/app/masterdata/group`: 0. |
| `src/app/masterdata/holiday-date/hook.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "./hook" src/app/masterdata/holiday-date`: 0. |
| `src/app/masterdata/insurance/hooks.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "./hooks" src/app/masterdata/insurance`: 0. |
| `src/app/masterdata/page-management/hooks.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "./hooks" src/app/masterdata/page-management`: 0. |
| `src/app/masterdata/page-management/permission.hooks.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "permission.hooks" src`: only the file itself. |
| `src/app/masterdata/product-category/hooks.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "./hooks" src/app/masterdata/product-category`: 0. |
| `src/app/masterdata/role/hooks.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "./hooks" src/app/masterdata/role`: 0. |
| `src/app/masterdata/user/hooks.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "./hooks" src/app/masterdata/user`: 0. |
| `src/app/product-category/[category]/detail/[id]/product-detail-tab.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "product-detail-tab" src`: 0. |
| `src/app/promotion/dto/promotion.dto.ts` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "promotion.dto" src`: 0; exported DTO symbols only found in this file. |
| `src/app/sanction/dto/sanction.dto.ts` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "sanction.dto" src`: 0; exported DTO symbols only found in this file. |
| `src/app/source/dto/source.dto.ts` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "source.dto" src`: 0; exported DTO symbols only found in this file. |
| `src/components/button-calendar.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; only source reference is `src/components/calendar.tsx`, which is also `SAFE_DELETE_UNUSED`. |
| `src/components/calendar.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/components/calendar" src`: 0. |
| `src/components/date-range-picker.tsx` | `REVIEW_MANUAL` | knip unused file, but referenced by legacy dashboard views; delete only after grouped legacy-view cleanup. |
| `src/components/datepicker.tsx` | `REVIEW_MANUAL` | knip unused file, but referenced by legacy list views; delete only after grouped legacy-view cleanup. |
| `src/components/drag-drop-excel.tsx` | `REVIEW_MANUAL` | knip unused file, but referenced by legacy policy import view. |
| `src/components/extended-sidemenu-shell.tsx` | `REVIEW_MANUAL` | knip unused file, but migration log/audit docs recently mark this shell app-local after rename. |
| `src/components/extended-sidemenu.tsx` | `REVIEW_MANUAL` | knip unused file, but paired with `extended-sidemenu-shell`; ownership should be confirmed before deletion. |
| `src/components/image-or-default.tsx` | `REVIEW_MANUAL` | knip unused file, but referenced by legacy claim detail view. |
| `src/components/multiple-select.tsx` | `REVIEW_MANUAL` | knip unused file, but referenced by legacy claim list view. |
| `src/components/no-recent-data.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/components/no-recent-data" src`: 0. |
| `src/components/not-found.tsx` | `REVIEW_MANUAL` | knip unused file, but referenced by many legacy views. |
| `src/components/pagination.tsx` | `REVIEW_MANUAL` | knip unused file, but referenced by many legacy views. |
| `src/components/popover.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/components/popover" src`: 0. |
| `src/components/recharts/data-claim.ts` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "data-claim" src`: 0. |
| `src/components/recharts/data-policy.ts` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "data-policy" src`: 0. |
| `src/components/select.tsx` | `REVIEW_MANUAL` | knip unused file, but referenced by legacy components/views. |
| `src/components/sticky-list-tabs-shell.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/components/sticky-list-tabs-shell" src`: 0. |
| `src/components/textarea.tsx` | `REVIEW_MANUAL` | knip unused file, but referenced by legacy views. |
| `src/components/tooltip.tsx` | `REVIEW_MANUAL` | knip unused file, but referenced by legacy policy import view. |
| `src/components/ui/fields/select-autocomplete/index.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/components/ui/fields/select-autocomplete" src`: 0. |
| `src/components/ui/image-or-default.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/components/ui/image-or-default" src`: 0. |
| `src/components/ui/image.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; only source reference is `src/components/ui/image-or-default.tsx`, also `SAFE_DELETE_UNUSED`. |
| `src/components/ui/optimize-image-shell.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; only source reference is `src/components/ui/image.tsx`, also `SAFE_DELETE_UNUSED`. |
| `src/helpers/route.helper.ts` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/helpers/route.helper" src`: 0. |
| `src/hooks/useNotificationLogs.hooks.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "useNotificationLogs" src`: only the file itself. |
| `src/images/add.icon.tsx` | `REVIEW_MANUAL` | knip unused file, but referenced by legacy views/components. |
| `src/images/calender.icon.tsx` | `REVIEW_MANUAL` | knip unused file, but referenced by legacy views/components. |
| `src/images/checklist-round.icon.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/images/checklist-round.icon" src`: 0. |
| `src/images/circle-menu.icon.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/images/circle-menu.icon" src`: 0. |
| `src/images/download.icon.tsx` | `REVIEW_MANUAL` | knip unused file, but referenced by legacy views. |
| `src/images/globe-location.icon.tsx` | `REVIEW_MANUAL` | knip unused file, but referenced by legacy transaction views. |
| `src/images/home.icon.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/images/home.icon" src`: 0. |
| `src/images/home-2.icon.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/images/home-2.icon" src`: 0. |
| `src/images/protection.icon.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/images/protection.icon" src`: 0. |
| `src/images/revenue.icon.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/images/revenue.icon" src`: 0. |
| `src/images/search.icon.tsx` | `REVIEW_MANUAL` | knip unused file, but referenced by legacy views. |
| `src/images/secure-doc.icon.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/images/secure-doc.icon" src`: 0. |
| `src/images/slash.icon.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/images/slash.icon" src`: 0. |
| `src/images/task-list.icon.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/images/task-list.icon" src`: 0. |
| `src/images/trash.icon.tsx` | `REVIEW_MANUAL` | knip unused file, but referenced by legacy views/components. |
| `src/images/upload.icon.tsx` | `REVIEW_MANUAL` | knip unused file, but referenced by legacy views/components. |
| `src/lib/http-client.ts` | `REVIEW_MANUAL` | knip unused file, but legacy HTTP client family has adjacent similarly named interfaces/services; confirm architecture before deletion. |
| `src/lib/react-query/devtools.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; only source reference is inside `src/lib/react-query/query-provider.tsx`, also `SAFE_DELETE_UNUSED`. |
| `src/lib/react-query/index.ts` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/lib/react-query" src`: 0. |
| `src/lib/react-query/query-client.ts` | `SAFE_DELETE_UNUSED` | knip unused file; only source references are inside the unused `src/lib/react-query` group. |
| `src/lib/react-query/query-provider.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; app layout imports `@/provider/query-provider`, not this file. |
| `src/views/claim/detail/detail.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/claim/detail/detail.view" src`: 0. |
| `src/views/claim/export/export.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/claim/export/export.view" src`: 0. |
| `src/views/claim/list/list.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/claim/list/list.view" src`: 0. |
| `src/views/configuration/sla/sla.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/configuration/sla/sla.view" src`: 0. |
| `src/views/customer/add/add.view.css` | `SAFE_DELETE_UNUSED` | knip unused file; only source reference is `src/views/customer/add/add.view.tsx`, also `SAFE_DELETE_UNUSED`. |
| `src/views/customer/add/add.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/customer/add/add.view" src`: 0. |
| `src/views/customer/list/list.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/customer/list/list.view" src`: 0. |
| `src/views/dashboard/claim/claim.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/dashboard/claim/claim.view" src`: 0. |
| `src/views/dashboard/policy/policy.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/dashboard/policy/policy.view" src`: 0. |
| `src/views/dashboard/transaction/transaction.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/dashboard/transaction/transaction.view" src`: 0. |
| `src/views/employment-benefit/membership/detail/detail.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/employment-benefit/membership/detail/detail.view" src`: 0. |
| `src/views/employment-benefit/membership/list/list.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/employment-benefit/membership/list/list.view" src`: 0. |
| `src/views/finance/billing/detail/detail.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/finance/billing/detail/detail.view" src`: 0. |
| `src/views/finance/billing/export/export.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/finance/billing/export/export.view" src`: 0. |
| `src/views/finance/billing/list/list.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/finance/billing/list/list.view" src`: 0. |
| `src/views/home/home-2.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "Home2View" src`: only this file; `src/app/page.tsx` imports `HomeView` from `home.view.tsx`. |
| `src/views/masterdata/product/product.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/masterdata/product/product.view" src`: 0. |
| `src/views/plan/add/add.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/plan/add/add.view" src`: 0. |
| `src/views/plan/detail/detail.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/plan/detail/detail.view" src`: 0. |
| `src/views/plan/list/list.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/plan/list/list.view" src`: 0. |
| `src/views/plan/upload/upload.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/plan/upload/upload.view" src`: 0. |
| `src/views/policy/detail/detail.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/policy/detail/detail.view" src`: 0. |
| `src/views/policy/endorsement/detail/detail.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/policy/endorsement/detail/detail.view" src`: 0. |
| `src/views/policy/endorsement/list/list.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/policy/endorsement/list/list.view" src`: 0. |
| `src/views/policy/endorsement/upload/upload.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/policy/endorsement/upload/upload.view" src`: 0. |
| `src/views/policy/export/export.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/policy/export/export.view" src`: 0. |
| `src/views/policy/import/import.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; only found source mention is a commented-out import in `src/app/claim/list/import/page.tsx`; no live import. |
| `src/views/policy/list/list.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/policy/list/list.view" src`: 0. |
| `src/views/transaction/add/add.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/transaction/add/add.view" src`: 0. |
| `src/views/transaction/countries/countries.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/transaction/countries/countries.view" src`: 0. |
| `src/views/transaction/export/export.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/transaction/export/export.view" src`: 0. |
| `src/views/transaction/list/list-admin.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/transaction/list/list-admin.view" src`: 0. |
| `src/views/transaction/list/list-transaction.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/transaction/list/list-transaction.view" src`: 0. |
| `src/views/transaction/revenue/revenue.view.tsx` | `SAFE_DELETE_UNUSED` | knip unused file; `rg --fixed-strings "@/views/transaction/revenue/revenue.view" src`: 0. |

### Public Asset Ledger

Only referenced `public/**` assets are classified here. Unreferenced public assets were not classified as delete candidates in Batch 10A because runtime URL usage can be outside the static source graph.

| Asset | Decision | Evidence / Reason |
| ----- | -------- | ----------------- |
| `public/favicon-globe.ico` | `KEEP_PUBLIC_ASSET` | Referenced by `src/app/layout.tsx` as `/favicon-globe.ico`. |
| `public/friendsure-background.svg` | `KEEP_PUBLIC_ASSET` | Referenced by `src/constants/app-common.const.tsx` as `url('/friendsure-background.svg')`. |
| `public/friendsure-logo.svg` | `KEEP_PUBLIC_ASSET` | Imported by `src/constants/app-common.const.tsx` via `@public/friendsure-logo.svg`. |
| `public/whitelable-logo.svg` | `KEEP_PUBLIC_ASSET` | Imported by `src/components/loader.tsx` and legacy layout view. |
| `public/images/confirmation.png` | `KEEP_PUBLIC_ASSET` | Referenced by `src/app/policy/list/detail/[id]/page.tsx` as `/images/confirmation.png`. |
| `public/images/empty-state-search-prompt.svg` | `KEEP_PUBLIC_ASSET` | Imported by `src/app/claim/history/page.tsx` and `src/app/export-users/page.tsx`. |
| `public/images/icon-campaigns.png` | `KEEP_PUBLIC_ASSET` | Imported by `src/constants/app-menu.const.tsx`. |
| `public/images/icon-claim.png` | `KEEP_PUBLIC_ASSET` | Imported by `src/constants/app-menu.const.tsx`. |
| `public/images/icon-copy.svg` | `KEEP_PUBLIC_ASSET` | Imported by `src/app/masterdata/user/add/page.tsx` and `src/app/masterdata/user/detail/[id]/page.tsx`. |
| `public/images/icon-policy.png` | `KEEP_PUBLIC_ASSET` | Imported by `src/constants/app-menu.const.tsx`. |
| `public/images/icon-transactions.png` | `KEEP_PUBLIC_ASSET` | Imported by `src/constants/app-menu.const.tsx`. |
| `public/images/icon-warning.png` | `KEEP_PUBLIC_ASSET` | Imported by `src/app/masterdata/user/page.tsx`. |
| `public/images/no-data.webp` | `KEEP_PUBLIC_ASSET` | Imported by many current routes, including `src/app/claim/list/page.tsx`, `src/app/masterdata/user/page.tsx`, and configuration views. |
| `public/images/no-image.png` | `KEEP_PUBLIC_ASSET` | Imported/referenced by claim detail, table config, and form fallback handlers. |

### Decision Summary

| Decision | Count | Notes |
| -------- | ----: | ----- |
| `SAFE_DELETE_UNUSED` | 76 | Audit-only candidates. Batch 10B should delete in grouped passes and rerun typecheck after each group. |
| `REVIEW_MANUAL` | 20 | Mostly legacy components/icons referenced only by other knip-unused legacy views, plus recently renamed app shell files. |
| `KEEP_PUBLIC_ASSET` | 14 | Referenced public assets retained. |
| `KEEP_REACHABLE` | 0 | No knip file candidate was reclassified as clearly reachable from the current Next route graph within this scoped ledger. |
| `KEEP_FRAMEWORK_CONVENTION` | 0 | Next.js convention files surfaced by ts-prune were ignored as file-deletion candidates. |
| `KEEP_DYNAMIC_REFERENCE` | 0 | No scoped knip file candidate had a confirmed dynamic runtime reference; public URL assets are tracked as `KEEP_PUBLIC_ASSET`. |

### Batch 10B Notes

- Do not delete `REVIEW_MANUAL` entries until their legacy view/component dependency chain is removed or explicitly retained.
- For `SAFE_DELETE_UNUSED` rows, delete by ownership group: route-local hooks/DTOs, legacy views, isolated local components, isolated icons, then unused lib/react-query group.
- Run `pnpm --filter admin-portal check-types` after each deletion group. Run the full verification gate before completing Batch 10.
- Dependency cleanup is deferred to Batch 10C/10.5; this report intentionally makes no package changes.

## Batch 10B Safe Unused-File Deletion - 2026-05-19

Scope: deleted only files classified as `SAFE_DELETE_UNUSED` in the Batch 10A ledger above. No `REVIEW_MANUAL`, `KEEP_PUBLIC_ASSET`, framework convention, dynamic-reference, or package dependency entries were deleted.

### Removal Summary

| Group | Files removed | Verification |
| ----- | ------------: | ------------ |
| Route-local hooks and DTOs | 16 | `pnpm --filter admin-portal check-types` PASS |
| Legacy views from `SAFE_DELETE_UNUSED` ledger | 34 | `pnpm --filter admin-portal check-types` PASS |
| Isolated components, helpers, and hooks | 13 | `pnpm --filter admin-portal check-types` PASS |
| Isolated image components | 9 | `pnpm --filter admin-portal check-types` PASS |
| Unused `src/lib/react-query` group | 4 | `pnpm --filter admin-portal check-types` PASS |
| Total | 76 | Final verification gate PASS |

### Removed Files

```txt
apps/admin-portal/src/app/finance/broker-fee/hook.tsx
apps/admin-portal/src/app/masterdata/channel/hooks.tsx
apps/admin-portal/src/app/masterdata/currency/hooks.tsx
apps/admin-portal/src/app/masterdata/email-tag/hooks.tsx
apps/admin-portal/src/app/masterdata/group/hooks.tsx
apps/admin-portal/src/app/masterdata/holiday-date/hook.tsx
apps/admin-portal/src/app/masterdata/insurance/hooks.tsx
apps/admin-portal/src/app/masterdata/page-management/hooks.tsx
apps/admin-portal/src/app/masterdata/page-management/permission.hooks.tsx
apps/admin-portal/src/app/masterdata/product-category/hooks.tsx
apps/admin-portal/src/app/masterdata/role/hooks.tsx
apps/admin-portal/src/app/masterdata/user/hooks.tsx
apps/admin-portal/src/app/product-category/[category]/detail/[id]/product-detail-tab.tsx
apps/admin-portal/src/app/promotion/dto/promotion.dto.ts
apps/admin-portal/src/app/sanction/dto/sanction.dto.ts
apps/admin-portal/src/app/source/dto/source.dto.ts
apps/admin-portal/src/components/button-calendar.tsx
apps/admin-portal/src/components/calendar.tsx
apps/admin-portal/src/components/no-recent-data.tsx
apps/admin-portal/src/components/popover.tsx
apps/admin-portal/src/components/recharts/data-claim.ts
apps/admin-portal/src/components/recharts/data-policy.ts
apps/admin-portal/src/components/sticky-list-tabs-shell.tsx
apps/admin-portal/src/components/ui/fields/select-autocomplete/index.tsx
apps/admin-portal/src/components/ui/image-or-default.tsx
apps/admin-portal/src/components/ui/image.tsx
apps/admin-portal/src/components/ui/optimize-image-shell.tsx
apps/admin-portal/src/helpers/route.helper.ts
apps/admin-portal/src/hooks/useNotificationLogs.hooks.tsx
apps/admin-portal/src/images/checklist-round.icon.tsx
apps/admin-portal/src/images/circle-menu.icon.tsx
apps/admin-portal/src/images/home-2.icon.tsx
apps/admin-portal/src/images/home.icon.tsx
apps/admin-portal/src/images/protection.icon.tsx
apps/admin-portal/src/images/revenue.icon.tsx
apps/admin-portal/src/images/secure-doc.icon.tsx
apps/admin-portal/src/images/slash.icon.tsx
apps/admin-portal/src/images/task-list.icon.tsx
apps/admin-portal/src/lib/react-query/devtools.tsx
apps/admin-portal/src/lib/react-query/index.ts
apps/admin-portal/src/lib/react-query/query-client.ts
apps/admin-portal/src/lib/react-query/query-provider.tsx
apps/admin-portal/src/views/claim/detail/detail.view.tsx
apps/admin-portal/src/views/claim/export/export.view.tsx
apps/admin-portal/src/views/claim/list/list.view.tsx
apps/admin-portal/src/views/configuration/sla/sla.view.tsx
apps/admin-portal/src/views/customer/add/add.view.css
apps/admin-portal/src/views/customer/add/add.view.tsx
apps/admin-portal/src/views/customer/list/list.view.tsx
apps/admin-portal/src/views/dashboard/claim/claim.view.tsx
apps/admin-portal/src/views/dashboard/policy/policy.view.tsx
apps/admin-portal/src/views/dashboard/transaction/transaction.view.tsx
apps/admin-portal/src/views/employment-benefit/membership/detail/detail.view.tsx
apps/admin-portal/src/views/employment-benefit/membership/list/list.view.tsx
apps/admin-portal/src/views/finance/billing/detail/detail.view.tsx
apps/admin-portal/src/views/finance/billing/export/export.view.tsx
apps/admin-portal/src/views/finance/billing/list/list.view.tsx
apps/admin-portal/src/views/home/home-2.view.tsx
apps/admin-portal/src/views/masterdata/product/product.view.tsx
apps/admin-portal/src/views/plan/add/add.view.tsx
apps/admin-portal/src/views/plan/detail/detail.view.tsx
apps/admin-portal/src/views/plan/list/list.view.tsx
apps/admin-portal/src/views/plan/upload/upload.view.tsx
apps/admin-portal/src/views/policy/detail/detail.view.tsx
apps/admin-portal/src/views/policy/endorsement/detail/detail.view.tsx
apps/admin-portal/src/views/policy/endorsement/list/list.view.tsx
apps/admin-portal/src/views/policy/endorsement/upload/upload.view.tsx
apps/admin-portal/src/views/policy/export/export.view.tsx
apps/admin-portal/src/views/policy/import/import.view.tsx
apps/admin-portal/src/views/policy/list/list.view.tsx
apps/admin-portal/src/views/transaction/add/add.view.tsx
apps/admin-portal/src/views/transaction/countries/countries.view.tsx
apps/admin-portal/src/views/transaction/export/export.view.tsx
apps/admin-portal/src/views/transaction/list/list-admin.view.tsx
apps/admin-portal/src/views/transaction/list/list-transaction.view.tsx
apps/admin-portal/src/views/transaction/revenue/revenue.view.tsx
```

### Verification Gate

| Command | Result | Notes |
| ------- | ------ | ----- |
| `pnpm --filter admin-portal check-types` | PASS | `tsc --noEmit` completed successfully after all deletion groups and as final gate step. |
| `pnpm --filter admin-portal lint` | PASS | ESLint completed with 0 errors and existing warnings. |
| `pnpm --filter admin-portal build` | PASS | Next.js 16.1.0 production build completed successfully. Build still reports the pre-existing workspace-root lockfile warning caused by `C:\Users\user\package-lock.json` outside this repo. |

## Batch 10C Dependency Cleanup + Final Report - 2026-05-19

Scope: dependency ownership cleanup only. No additional source files or public assets were deleted in Batch 10C.

### Dependency Cleanup Summary

- Baseline after Batch 10B: `pnpm --filter admin-portal check-types` PASS.
- Direct-import audit method: scanned `apps/admin-portal/src/**/*.{ts,tsx,js,jsx,mjs,cjs}` and app root config files (`next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `eslint.config.js`, `tsconfig.json`, `components.json`) for direct `import`, dynamic `import()`, and `require()` usage of every dependency/devDependency.
- Removed confirmed orphan dependencies: `@radix-ui/react-popover`, `@radix-ui/react-select`, `@radix-ui/react-slot`, `class-variance-authority`, `@testing-library/jest-dom`, `@types/jest`.
- Removal command: `pnpm --filter admin-portal remove @radix-ui/react-popover @radix-ui/react-select @radix-ui/react-slot class-variance-authority @testing-library/jest-dom @types/jest`.
- Post-removal typecheck: `pnpm --filter admin-portal check-types` PASS.
- Removed dependency confirmation: `pnpm --filter admin-portal list @radix-ui/react-popover @radix-ui/react-select @radix-ui/react-slot class-variance-authority @testing-library/jest-dom @types/jest` returned no direct package entries.

### Dependency Audit

| Package | Classification | Evidence | Notes |
| ------- | -------------- | -------- | ----- |
| `@radix-ui/react-popover` | `REMOVED_ORPHAN` | 0 source/config imports after Batch 10B; depcheck unused; prior local `src/components/popover.tsx` consumer was removed as `SAFE_DELETE_UNUSED`. | Removed in Batch 10C. |
| `@radix-ui/react-select` | `REMOVED_ORPHAN` | 0 source/config imports after Batch 10B; depcheck unused; prior local select-autocomplete consumer was removed as `SAFE_DELETE_UNUSED`. | Removed in Batch 10C. |
| `@radix-ui/react-slot` | `REMOVED_ORPHAN` | 0 source/config imports after Batch 10B; depcheck unused; no peer/toolchain/workspace reason. | Removed in Batch 10C. |
| `class-variance-authority` | `REMOVED_ORPHAN` | 0 source/config imports after Batch 10B; depcheck unused; local CVA-based wrappers no longer import it. | Removed in Batch 10C. |
| `@testing-library/jest-dom` | `REMOVED_ORPHAN` | 0 source/config imports; no test setup file or test script found under `apps/admin-portal`. | Removed in Batch 10C. |
| `@types/jest` | `REMOVED_ORPHAN` | 0 source/config imports; no Jest config/test files found under `apps/admin-portal`; no underlying `jest` package is listed. | Removed in Batch 10C. |
| `@hookform/resolvers` | `RETAINED_DIRECT_IMPORT` | Direct imports in `src/components/forms/product-catalog/benefit.form.tsx` and `src/components/forms/product-catalog/package.form.tsx`. | App-owned form validation dependency. |
| `@repo/config` | `RETAINED_WORKSPACE_EXPLICIT` | Referenced in `next.config.mjs` Turbopack alias. | Workspace packages stay explicit. |
| `@repo/helper` | `RETAINED_WORKSPACE_EXPLICIT` | Direct import in `src/app/report/campaign-analytics/page.tsx`; alias in `next.config.mjs`. | Workspace packages stay explicit. |
| `@repo/ui` | `RETAINED_WORKSPACE_EXPLICIT` | 209 direct source imports plus alias in `next.config.mjs`. | Shared UI dependency must stay explicit. |
| `@tanstack/react-query` | `RETAINED_DIRECT_IMPORT` | 244 direct source imports across app hooks/services. | App-owned data-fetching dependency. |
| `axios` | `RETAINED_DIRECT_IMPORT` | 14 direct source imports, including `src/context/auth.context.tsx` and `src/lib/api-client/client.ts`. | App API layer owns this directly. |
| `chart.js` | `RETAINED_DIRECT_IMPORT` | Direct import in `src/components/chart.tsx`. | Chart runtime. |
| `clsx` | `RETAINED_DIRECT_IMPORT` | Direct import in `src/lib/utils.ts`. | App utility dependency. |
| `date-fns` | `RETAINED_DIRECT_IMPORT` | 23 direct source imports across route hooks/pages. | Date formatting/query dependency. |
| `dayjs` | `RETAINED_DIRECT_IMPORT` | Direct import in `src/lib/utils.ts`. | Date utility dependency. |
| `draft-js` | `RETAINED_DEFERRED_10_5` | Direct imports in email-template form/helper/hook. | Deferred Batch 10.5 item; keep until editor flow is migrated or retired. |
| `draft-js-export-html` | `RETAINED_DEFERRED_10_5` | Direct import in `src/helpers/email-template-html.ts`. | Part of deferred Draft.js editor/export stack. |
| `file-saver` | `RETAINED_DIRECT_IMPORT` | Direct import in `src/hooks/useDetailEndorsement.hooks.tsx`. | Export/download flow. |
| `final-form` | `RETAINED_PEER_REQUIRED` | 0 direct imports, but `react-final-form` is directly imported in `src/app/claim/list/detail/[id]/upload-data/page.tsx`. | Required peer/runtime package for retained `react-final-form`. |
| `html2canvas` | `RETAINED_DIRECT_IMPORT` | Direct import in `src/app/report/campaign-analytics/page.tsx`. | PDF/image export flow. |
| `jspdf` | `RETAINED_DIRECT_IMPORT` | 7 direct source imports across export/report pages and hooks. | PDF export flow. |
| `jspdf-autotable` | `RETAINED_DIRECT_IMPORT` | 4 direct source imports across PDF export hooks/pages. | PDF table export flow. |
| `jwt-decode` | `RETAINED_DIRECT_IMPORT` | Direct import in `src/context/auth.context.tsx`. | Auth token parsing. |
| `lodash` | `RETAINED_DIRECT_IMPORT` | 13 direct source imports across hooks/pages. | App-owned utility dependency. |
| `lucide-react` | `RETAINED_DIRECT_IMPORT` | 18 direct source imports across pages/components. | App-level icons, not only `@repo/ui`. |
| `moment` | `RETAINED_DEFERRED_10_5` | 7 direct source imports in claim/billing/export/table code. | Deferred Batch 10.5 item. |
| `next` | `RETAINED_NEVER_REMOVE` | Framework dependency; 171 direct source imports and config usage. | Never remove from app package. |
| `papaparse` | `RETAINED_DIRECT_IMPORT` | 5 direct source imports across upload/import flows. | CSV parsing dependency. |
| `qs` | `RETAINED_DIRECT_IMPORT` | 22 direct source imports across service API files. | Query serialization dependency. |
| `react` | `RETAINED_NEVER_REMOVE` | Runtime host; 226 direct source imports and config usage. | Never remove from app package. |
| `react-chartjs-2` | `RETAINED_DIRECT_IMPORT` | Direct import in `src/components/chart.tsx`. | Chart runtime. |
| `react-date-range` | `RETAINED_DIRECT_IMPORT` | Direct import in retained `src/components/date-range-picker.tsx`. | Retained until manual-review date range picker is resolved. |
| `react-day-picker` | `RETAINED_DIRECT_IMPORT` | 7 direct source imports across report/dashboard hooks. | Shared date picker workflow. |
| `react-dom` | `RETAINED_NEVER_REMOVE` | Runtime host peer for React/Next. | Never remove from app package. |
| `react-draft-wysiwyg` | `RETAINED_DEFERRED_10_5` | Direct import in `src/components/forms/email-template-form/index.tsx`. | Part of deferred Draft.js editor stack. |
| `react-dropzone` | `RETAINED_DIRECT_IMPORT` | Direct import in retained `src/components/drag-drop-excel.tsx`. | Retained until manual-review upload wrapper is resolved. |
| `react-feather` | `RETAINED_DIRECT_IMPORT` | 118 direct source imports across pages/components. | App-level icons. |
| `react-final-form` | `RETAINED_DIRECT_IMPORT` | Direct import in `src/app/claim/list/detail/[id]/upload-data/page.tsx`. | Claim upload form flow. |
| `react-hook-form` | `RETAINED_DIRECT_IMPORT` | 47 direct source imports across migrated app-local forms/pages. | App-owned form dependency. |
| `react-hot-toast` | `RETAINED_DIRECT_IMPORT` | 24 direct source imports across layout/helper/hooks. | Notification dependency. |
| `react-icons` | `RETAINED_DIRECT_IMPORT` | Direct import in `src/app/report/campaign-analytics/page.tsx`. | Report UI icon dependency. |
| `react-router-dom` | `RETAINED_DEFERRED_10_5` | Direct imports in `src/components/forms/user-form/components/user-groups.tsx` and `user-roles.tsx`. | Deferred Batch 10.5 item. |
| `recharts` | `RETAINED_DIRECT_IMPORT` | 6 direct source imports across report and chart components. | Charting dependency. |
| `tailwind-merge` | `RETAINED_DIRECT_IMPORT` | Direct import in `src/lib/utils.ts`. | Class merge utility. |
| `tailwindcss-animate` | `RETAINED_CONFIG_TOOLCHAIN` | Imported by `tailwind.config.ts`. | Tailwind plugin; also never-remove list calls out app-level ownership. |
| `validator` | `RETAINED_DIRECT_IMPORT` | Direct imports in product-catalog form files. | Form validation dependency. |
| `xlsx` | `RETAINED_DIRECT_IMPORT` | 17 direct source imports across import/export flows. | Excel import/export dependency. |
| `zod` | `RETAINED_DIRECT_IMPORT` | Direct imports in product-catalog form files. | Schema validation dependency. |
| `@repo/eslint-config` | `RETAINED_WORKSPACE_EXPLICIT` | Imported by `eslint.config.js`; alias in `next.config.mjs`. | Workspace lint config stays explicit. |
| `@repo/typescript-config` | `RETAINED_WORKSPACE_EXPLICIT` | Referenced by `tsconfig.json`; alias in `next.config.mjs`. | Workspace TS config stays explicit. |
| `@tailwindcss/postcss` | `RETAINED_CONFIG_TOOLCHAIN` | Used in `postcss.config.mjs`. | Tailwind v4 PostCSS plugin. |
| `@types/draft-js` | `RETAINED_DEFERRED_10_5` | Underlying `draft-js` is retained for deferred editor flow. | Keep matching type package while underlying package remains. |
| `@types/file-saver` | `RETAINED_CONFIG_TOOLCHAIN` | Underlying `file-saver` has direct source import. | Typecheck support for retained dependency. |
| `@types/lodash` | `RETAINED_CONFIG_TOOLCHAIN` | Underlying `lodash` has direct source imports. | Typecheck support for retained dependency. |
| `@types/node` | `RETAINED_NEVER_REMOVE` | Required by Next/config TypeScript toolchain. | Never remove from app package. |
| `@types/papaparse` | `RETAINED_CONFIG_TOOLCHAIN` | Underlying `papaparse` has direct source imports. | Typecheck support for retained dependency. |
| `@types/qs` | `RETAINED_CONFIG_TOOLCHAIN` | Underlying `qs` has direct source imports. | Typecheck support for retained dependency. |
| `@types/react` | `RETAINED_NEVER_REMOVE` | Required for TSX compilation. | Never remove from app package. |
| `@types/react-date-range` | `RETAINED_CONFIG_TOOLCHAIN` | Underlying `react-date-range` has direct source import in retained component. | Typecheck support for retained dependency. |
| `@types/react-day-picker` | `RETAINED_CONFIG_TOOLCHAIN` | Underlying `react-day-picker` has direct source imports. | Typecheck support for retained dependency. |
| `@types/react-dom` | `RETAINED_NEVER_REMOVE` | Required for TSX/React DOM compilation. | Never remove from app package. |
| `@types/react-draft-wysiwyg` | `RETAINED_DEFERRED_10_5` | Underlying `react-draft-wysiwyg` is retained for deferred editor flow. | Keep matching type package while underlying package remains. |
| `@types/recharts` | `RETAINED_CONFIG_TOOLCHAIN` | Underlying `recharts` has direct source imports. | Typecheck support for retained dependency. |
| `@types/validator` | `RETAINED_CONFIG_TOOLCHAIN` | Underlying `validator` has direct source imports. | Typecheck support for retained dependency. |
| `eslint` | `RETAINED_CONFIG_TOOLCHAIN` | Used by `eslint.config.js` and `lint` script. | Lint toolchain. |
| `eslint-config-next` | `RETAINED_NEVER_REMOVE` | Next lint toolchain package; version aligned to Next 16. | Never-remove list includes eslint / eslint-config-next. |
| `postcss` | `RETAINED_CONFIG_TOOLCHAIN` | Used by PostCSS/Tailwind build pipeline and `postcss.config.mjs`. | CSS build toolchain. |
| `tailwindcss` | `RETAINED_NEVER_REMOVE` | Used by `tailwind.config.ts` and `postcss.config.mjs`. | Never remove from app package. |
| `typescript` | `RETAINED_NEVER_REMOVE` | Used by `check-types` script and `tsconfig.json`. | Never remove from app package. |

### Dependency Version Alignment

- React resolved version: `19.2.4` (`node -e "console.log(require('./apps/admin-portal/node_modules/react/package.json').version)"`).
- Next / eslint-config-next package ranges: `next: ^16`, `eslint-config-next: ^16`.
- TypeScript package version: `5.9.2`.
- Tailwind package version: `^4.1.18`; `@tailwindcss/postcss` package version: `^4.1.18`.

### Final Verification Gate

| Command | Result | Notes |
| ------- | ------ | ----- |
| `pnpm --filter admin-portal check-types` | PASS | Ran before dependency removal and after `pnpm remove`; `tsc --noEmit` completed successfully. |
| `pnpm --filter admin-portal lint` | PASS | ESLint completed with 0 errors and existing warnings. |
| `pnpm --filter admin-portal build` | PASS | Next.js 16.1.0 production build completed successfully. Build still reports the pre-existing workspace-root lockfile warning caused by `C:\Users\user\package-lock.json` outside this repo. |

### Follow-ups

- Batch 10.5 deferred dependency items: `moment`, `draft-js` editor stack (`draft-js`, `draft-js-export-html`, `react-draft-wysiwyg`, matching `@types/*`), and `react-router-dom`.
- Manual-review retained source candidates from Batch 10A remain out of scope for Batch 10C.
- Cross-app cleanup/deprecation synthesis remains pending on `feat/ui` after all apps complete Batch 10 and Batch 10.5.
