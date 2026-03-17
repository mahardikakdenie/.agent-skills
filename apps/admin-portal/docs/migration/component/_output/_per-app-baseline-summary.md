# Admin Portal Per-App Baseline Summary (Batch 1)

## App Overview
- App: admin-portal (Next.js App Router + React + TypeScript + Tailwind + shadcn-style local primitives)
- Current shared UI surface from @repo/ui: Box export only on this branch snapshot

## Component Count Summary
- Total components audited: 275
- KEEP_APP_LOCAL: 235
- NEW_SHARED_COMPONENT: 36
- SPLIT: 4

## Top 5 Highest-Parity-Risk Items
- src/app/claim/history/page.tsx (KEEP_APP_LOCAL): Contains app-specific domain, routing, or API concerns that should remain local.
- src/app/claim/list/detail/[id]/page.tsx (KEEP_APP_LOCAL): Contains app-specific domain, routing, or API concerns that should remain local.
- src/app/claim/list/detail/[id]/upload-data/page.tsx (KEEP_APP_LOCAL): Contains app-specific domain, routing, or API concerns that should remain local.
- src/app/claim/list/export/page.tsx (KEEP_APP_LOCAL): Contains app-specific domain, routing, or API concerns that should remain local.
- src/app/claim/list/import/page.tsx (KEEP_APP_LOCAL): Contains app-specific domain, routing, or API concerns that should remain local.

## Components Classified as EXTEND_EXISTING
- None in this batch snapshot.

## NEW_SHARED_COMPONENT Visual Specs (props, variants, states)
- Alert (src/components/ui/alert.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Badge (src/components/ui/badge.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Breadcrumb (src/components/ui/breadcrumb.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Button (src/components/ui/button.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Calendar (src/components/ui/calendar.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Card (src/components/ui/card.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Checkbox (src/components/ui/checkbox.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Combobox (src/components/ui/combobox.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Command (src/components/ui/command.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- DataTable (src/components/ui/DataTable/index.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- DateRangePicker (src/components/ui/date-range-picker.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Dialog (src/components/ui/dialog.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Drewer (src/components/ui/drewer.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- DropdownMenu (src/components/ui/dropdown-menu.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Form (src/components/ui/form.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Input (src/components/ui/input.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Label (src/components/ui/label.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Loading (src/components/ui/Loading/index.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Loading (src/components/ui/loading.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Menubar (src/components/ui/menubar.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- NavigationMenu (src/components/ui/navigation-menu.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- OptimizeImageShell (src/components/OptimizeImageShell.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- OptimizeImageShell (src/components/ui/OptimizeImageShell.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Pagination (src/components/ui/pagination.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Popover (src/components/ui/popover.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- RadioGroup (src/components/ui/radio-group.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Select (src/components/ui/select.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- SelectAutocomplete (src/components/ui/Fields/SelectAutocomplete/index.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- SelectPhoneCode (src/components/ui/select-phone-code.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Spinner (src/components/ui/spinner.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Switch (src/components/ui/switch.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Table (src/components/ui/table.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Tabs (src/components/ui/tabs.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Textarea (src/components/ui/textarea.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- Tooltip (src/components/ui/tooltip.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.
- UploadFile (src/components/ui/Fields/UploadFile/index.tsx): props/variants/states documented in Batch 1 audit; parity checklist item retained.

## KEEP_APP_LOCAL Refactor Candidates
- Total KEEP_APP_LOCAL: 235
- KEEP_APP_LOCAL with SoC potential HIGH or MEDIUM: 34
- Top 3 candidates:
- src/app/masterdata/partner-management/detail/[id]/assign-plan.tsx: SoC=HIGH, strategy=render-prop, Batch 1.5 status=SKIPPED
- src/app/product-category/[category]/detail/[id]/benefit-list.tsx: SoC=HIGH, strategy=render-prop, Batch 1.5 status=SKIPPED
- src/app/product-category/[category]/detail/[id]/channel-list.tsx: SoC=HIGH, strategy=render-prop, Batch 1.5 status=SKIPPED

## SoC Evaluation Summary
- Total Batch 1.5 tracked candidates: 38
- Batch 1.5 processed (DONE): 4
- Batch 1.5 skipped with reason: 34
- SoC potential breakdown: HIGH=10, MEDIUM=28, LOW=16, NONE=213

## Batch 1.5 Amendment
- Components split: 4
- NEW_SHARED_COMPONENT candidates from splits: 2
- Names: OptimizeImageShell (src/components/OptimizeImageShell.tsx), OptimizeImageShell (src/components/ui/OptimizeImageShell.tsx)
- KEEP_APP_LOCAL-only Shells: 2
- Names: ExtendedSidemenuShell, PageHeaderShell
- Explicitly skipped candidates: 34 (see _migration-log.md Batch 1.5 section)

## Backlog CSV Row Count
- _component-backlog.csv rows (excluding header): 275


## Legacy Update - 2026-03-04 09:50 (+07)
- Source: subtree pull from admin-portal/stage into integrate-app/admin-portal, then merge to migrate-app/admin-portal.
- Net changed files from this legacy sync: 15.
- New component introduced by legacy:
  - src/components/microsoft-login-button.tsx -> KEEP_APP_LOCAL (auth-domain specific, PKCE/session handling, app contract dependent).
- packages/ui intake queue impact:
  - NEW_SHARED_COMPONENT: none
  - EXTEND_EXISTING: none
- Verification after merge-resolution:
  - pnpm --filter admin-portal check-types -> PASS
  - pnpm --filter admin-portal lint -> PASS (warnings only)
  - pnpm --filter admin-portal build -> PASS

## Legacy Update - 2026-03-17 10:39 (+07)
- Source: subtree pull from `admin-portal/stage` into `integrate-app/admin-portal`, then merge to `migrate-app/admin-portal`.
- Net changed files from this legacy sync: 5.
- Existing file updates only; no new component files were introduced.
- App-local impact summary:
  - `src/app/policy/list/page.tsx`: export flow now downloads the file directly and surfaces loading state.
  - `src/components/tableConfig/policyTableConfig.tsx`: pending-renewals table now reads notification-log array entries and shows `Email Sent`.
  - `src/components/ui/spinner.tsx`: app-local spinner now accepts an optional `className` override for inline loading states.
  - `src/hooks/usePolicies.hooks.tsx`: merge preserved the migrated query-hook structure while adding export state and default 30-day date range.
- packages/ui intake queue impact:
  - NEW_SHARED_COMPONENT: none
  - EXTEND_EXISTING: none
- Verification after merge-resolution:
  - pnpm --filter admin-portal check-types -> PASS
  - pnpm --filter admin-portal build -> PASS
  - pnpm --filter admin-portal lint -> PASS (warnings only)

