# Admin Portal Parity Checklist (Batch 1)

## Batch 5.5 - App Consumer Bootstrap - 2026-03-25

- Shared preset import: PASS - `src/app/globals.css` now imports `@repo/config/semantic-tokens.css`; no transition `@repo/config/tailwind.css` import was needed.
- Local override retention: PASS - app-local brand tokens remain in `src/app/globals.css` for `--primary`, `--primary-foreground`, `--primary-light-foreground`, `--warning`, `--ring`, and `--radius`.
- Dark-mode wiring: PASS - shared contract path is `[data-theme="dark"]` with a temporary `.dark` compatibility bridge while the app stays on local Tailwind dark-mode wiring.
- Token resolution check: PASS - verified in-browser that `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--success`, `--success-foreground`, `--warning`, `--warning-foreground`, `--info`, `--info-foreground`, and `--radius` resolve correctly after the shared preset import.
- Smoke route revalidation: PASS - `/dashboard/transaction`, `/dashboard/policy`, `/dashboard/claim`, `/transaction/list`, `/policy/list`, `/policy/endorsement/list`, `/claim/list`, `/membership/list`, `/finance/billing`, and `/masterdata/user` all rendered after the bootstrap change.
- Route notes: `/membership/list` and `/finance/billing` remain expected permission-gated `403 - Forbidden` pages and are still treated as PASS for route-load parity.
- Console/runtime: PASS - Playwright recorded 0 console errors during the route sweep and Next.js MCP `get_errors` returned no runtime errors. Navigation-triggered `net::ERR_ABORTED` requests observed while leaving some routes were treated as non-regression aborts, not missing-style failures.


## Alert

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Badge

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Breadcrumb

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Button

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Calendar

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Card

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Checkbox

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Combobox

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Command

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## DataTable

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## DateRangePicker

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Dialog

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Drewer

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## DropdownMenu

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Form

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Input

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Label

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Menubar

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## NavigationMenu

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Pagination

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Popover

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## RadioGroup

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Select

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## SelectPhoneCode

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Spinner

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Switch

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Table

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Tabs

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Textarea

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## Tooltip

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

## UploadFile

- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap
