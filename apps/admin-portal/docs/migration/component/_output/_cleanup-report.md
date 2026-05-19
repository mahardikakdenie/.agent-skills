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
