# 10 - Cross-App Reconciliation

> Batch: Batch 3 - Migration Plan
> Branch: `feat/ui`
> Run date: 2026-03-06
> Inputs read: `03-migration-plan.md` and `00`-`06` normalization outputs only

## 1. Program Summary

| Metric | Value |
| --- | --- |
| Authoritative planning base | Phase 02 normalization outputs only |
| Canonical shared set | 43 components including `Box` |
| Existing in `@repo/ui` | 1 (`Box`) |
| Shared build or extension scope | 42 |
| Batch 3 extension scope | 1 (`Box`) |
| Batch 4 new shared components | 41 approved + 1 decision-gated (`RichTextEditor`) |
| Planning backlog scope in `12-master-backlog.csv` | Canonical shared-program backlog only |
| Raw app-local, split, and SharePoint-export queues | Intentionally out of scope for this rerun |

### Final rulings

- This rerun is program-level and cross-app, but only through the normalized Batch 2 outputs already locked in `00`-`06`.
- `12-master-backlog.csv` now represents the normalized shared-program backlog only. It is not a raw merge of per-app backlog exports.
- App-local, adapter-only, and split-only queues remain downstream execution concerns and are not re-derived here without an approved raw artifact source.

## 2. Reconciliation Rules Applied

| Raw family | Canonical handling | Rule |
| --- | --- | --- |
| Generic buttons and CTA primitives | `Button` | Pure visual action controls collapse into one shared primitive. |
| Text inputs and field primitives | `Input` | Generic single-line inputs collapse into one canonical contract. |
| Multiline text fields | `Textarea` | Shared multiline input, distinct from rich text editing. |
| Static select controls | `Select` | Non-searchable selection belongs to `Select`. |
| Searchable or async selection | `Combobox` | Search-driven selection belongs to `Combobox`, not `Select`. |
| Modal and overlay shells | `Dialog`, `Drawer`, `Popover`, `Tooltip`, `DropdownMenu` | Overlay families stay distinct by interaction model. |
| Loading indicators | `ContentLoadingWrapper`, `Skeleton`, `Spinner` | Wrapper layout, structural placeholder, and inline spinner are separate contracts. |
| Data display primitives | `Table`, `DataTable`, `Card`, `Badge`, `Avatar`, `Image`, `Timeline` | Structural display stays shared; domain data logic stays local. |
| Date input family | `Calendar`, `DatePicker`, `DateRangePicker`, `DateTimePicker`, `MonthPicker` | Date contracts remain split by interaction scope, not overloaded into one component. |
| Layout primitives | `Box`, `Card`, `PageHeader` | Layout stays structural and app-agnostic only. |

### Traceability rule for `12-master-backlog.csv`

- `12-master-backlog.csv` is derived only from the canonical shared program already normalized in `01`, `04`, `05`, and `06`.
- Each row is a single canonical shared component entry, not a raw per-app artifact row.
- `consumer_apps` is represented as a normalized demand count reference, not an app-name export list.
- Batch labels are limited to the authoritative shared implementation lanes in this rerun: `3` for `EXTEND_EXISTING`, `4` for `NEW_SHARED_COMPONENT`.

## 3. Canonical Shared Track

### Batch 3 - Extend Existing

| Component | Classification | Apps that need it | `@repo/ui` status | Canonical API | Cross-app conflicts resolved | Priority | Risk | Target batch |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Box | EXTEND_EXISTING | Existing primitive with 27-app baseline footprint; see `01` | exists | `02` amendment: `asChild`, `padding`, `container`, `centered` | Keep `Box` as the only layout primitive extension path; do not turn it into app-specific page chrome | P0 | LOW | 3 |

### Wave B4 - Core Foundation Build

| Component | Classification | Apps that need it | `@repo/ui` status | Canonical API | Cross-app conflicts resolved | Priority | Risk | Target batch |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Alert | NEW_SHARED_COMPONENT | 22 apps; see `05` | missing | `02` §Alert | Feedback shell only; delivery mechanics stay local | P0 | MEDIUM | 4 |
| Badge | NEW_SHARED_COMPONENT | 11 apps; see `05` | missing | `02` §Badge | Shared status chip only; KPI/domain semantics stay local | P0 | LOW | 4 |
| Button | NEW_SHARED_COMPONENT | 23 apps; see `05` | missing | `02` §Button | Shared primitive only; domain button wrappers stay local | P0 | MEDIUM | 4 |
| Card | NEW_SHARED_COMPONENT | 12 apps; see `05` | missing | `02` §Card | Structural card only; domain cards compose on top | P0 | LOW | 4 |
| Checkbox | NEW_SHARED_COMPONENT | 20 apps; see `05` | missing | `02` §Checkbox | Generic choice control; business meaning stays local | P0 | MEDIUM | 4 |
| ContentLoadingWrapper | NEW_SHARED_COMPONENT | 18 apps; see `05` | missing | `02` §ContentLoadingWrapper | Shared loading layout only; full branded loaders stay local | P0 | MEDIUM | 4 |
| Dialog | NEW_SHARED_COMPONENT | 26 apps; see `05` | missing | `02` §Dialog | Modal shell normalized to one contract; body content stays local | P0 | HIGH | 4 |
| Drawer | NEW_SHARED_COMPONENT | 10 apps; see `05` | missing | `02` §Drawer | Drawer stays separate from modal semantics | P1 | HIGH | 4 |
| Input | NEW_SHARED_COMPONENT | 26 apps; see `05` | missing | `02` §Input | Shared text input only; app containers stay local | P0 | MEDIUM | 4 |
| Label | NEW_SHARED_COMPONENT | 10 apps; see `05` | missing | `02` amendment: `htmlFor`, `required`, `disabled`, `tone` | Label becomes first-class instead of app-side duplication | P1 | LOW | 4 |
| Pagination | NEW_SHARED_COMPONENT | 16 apps; see `05` | missing | `02` §Pagination | Generic page navigation only; data fetching stays local | P0 | MEDIUM | 4 |
| RadioGroup | NEW_SHARED_COMPONENT | 11 apps; see `05` | missing | `02` §RadioGroup | Shared exclusive-choice control only | P1 | LOW | 4 |
| Select | NEW_SHARED_COMPONENT | 25 apps; see `05` | missing | `02` §Select | Static selection contract only; searchable selection routes to `Combobox` | P0 | HIGH | 4 |
| Skeleton | NEW_SHARED_COMPONENT | 10 apps; see `05` | missing | `02` §Skeleton | Structural placeholder, not a loader shell | P0 | LOW | 4 |
| Spinner | NEW_SHARED_COMPONENT | 8 apps; see `05` | missing | `02` amendment: `size`, `label`, `inline`, `overlay` | Inline wait-state primitive only | P0 | LOW | 4 |
| Switch | NEW_SHARED_COMPONENT | 9 apps; see `05` | missing | `02` §Switch | Shared toggle only; feature semantics stay local | P1 | LOW | 4 |
| Table | NEW_SHARED_COMPONENT | 12 apps; see `05` | missing | `02` §Table | Visual table foundation only; headless logic belongs in `DataTable` | P0 | MEDIUM | 4 |
| Tabs | NEW_SHARED_COMPONENT | 13 apps; see `05` | missing | `02` amendment: `value`, `defaultValue`, `onValueChange`, `orientation` | Shared tabs only; route syncing stays local | P1 | MEDIUM | 4 |
| Textarea | NEW_SHARED_COMPONENT | 18 apps; see `05` | missing | `02` §Textarea | Multiline plain-text input only | P0 | LOW | 4 |

### Wave B5.1 - Date and Overlay Normalization

| Component | Classification | Apps that need it | `@repo/ui` status | Canonical API | Cross-app conflicts resolved | Priority | Risk | Target batch |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Breadcrumb | NEW_SHARED_COMPONENT | 12 apps; see `05` | missing | `02` amendment: `items[]`, `separator`, `currentLabel` | Shared shell only; route generation stays local | P1 | LOW | 4 |
| Calendar | NEW_SHARED_COMPONENT | 9 apps; see `05` | missing | `02` §Calendar | Standalone calendar stays separate from picker wrappers | P1 | MEDIUM | 4 |
| DatePicker | NEW_SHARED_COMPONENT | 22 apps; see `05` | missing | `02` §DatePicker | Single-date picking remains distinct from range/time/month selection | P0 | HIGH | 4 |
| DropdownMenu | NEW_SHARED_COMPONENT | 12 apps; see `05` | missing | `02` amendment: `items`, `align`, `side`, `onAction` | Generic action menu only | P1 | MEDIUM | 4 |
| Form | NEW_SHARED_COMPONENT | 9 apps; see `05` | missing | `02` §Form | Field scaffolding only; schemas and submit logic stay local | P0 | HIGH | 4 |
| Popover | NEW_SHARED_COMPONENT | 9 apps; see `05` | missing | `02` §Popover | Generic floating surface only | P1 | LOW | 4 |
| Tooltip | NEW_SHARED_COMPONENT | 9 apps; see `05` | missing | `02` §Tooltip | Assistive content only; guided flows stay local | P1 | LOW | 4 |

### Wave B5.2 - Advanced Input and Data Display

| Component | Classification | Apps that need it | `@repo/ui` status | Canonical API | Cross-app conflicts resolved | Priority | Risk | Target batch |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Avatar | NEW_SHARED_COMPONENT | 6 apps; see `05` | missing | `02` amendment: `src`, `alt`, `fallback`, `size` | Avatar stays visual-only | P2 | LOW | 4 |
| Combobox | NEW_SHARED_COMPONENT | 8 apps; see `05` | missing | `02` §Combobox | Searchable selection kept distinct from static select | P1 | HIGH | 4 |
| DataTable | NEW_SHARED_COMPONENT | 6 apps; see `05` | missing | `02` §DataTable | Generic headless table only; domain columns and workflows stay local | P1 | HIGH | 4 |
| DateRangePicker | NEW_SHARED_COMPONENT | 7 apps; see `05` | missing | `02` amendment: `value`, `onChange`, `presets`, `minDate`, `maxDate` | Range selection stays separate from single-date picking | P2 | HIGH | 4 |
| FileUpload | NEW_SHARED_COMPONENT | 12 apps; see `05` | missing | `02` §FileUpload | Shared upload UX only; transport and storage stay local | P1 | MEDIUM | 4 |
| Image | NEW_SHARED_COMPONENT | 13 apps; see `05` | missing | `02` amendment: `src`, `alt`, `fallback`, `ratio`, `fit` | Shared image rendering only; framework and viewer concerns stay local | P1 | MEDIUM | 4 |
| NavigationMenu | NEW_SHARED_COMPONENT | 8 apps; see `05` | missing | `02` amendment: `items`, `orientation`, `collapsed`, `onNavigate` | Route trees and auth gating stay local | P2 | HIGH | 4 |
| OtpInput | NEW_SHARED_COMPONENT | 6 apps; see `05` | missing | `02` §OtpInput | Segmented code entry only | P2 | MEDIUM | 4 |
| PageHeader | NEW_SHARED_COMPONENT | 8 apps; see `05` | missing | `02` amendment: `title`, `description`, `actions`, `meta` | Structural page header only | P2 | LOW | 4 |

### Wave B5.3 - Remaining Medium-Demand Components

| Component | Classification | Apps that need it | `@repo/ui` status | Canonical API | Cross-app conflicts resolved | Priority | Risk | Target batch |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Accordion | NEW_SHARED_COMPONENT | 4 apps; see `05` | missing | `02` amendment: `type`, `collapsible`, `value`, `onValueChange` | Disclosure primitive only | P2 | MEDIUM | 4 |
| Command | NEW_SHARED_COMPONENT | 5 apps; see `05` | missing | `02` amendment: `items`, `value`, `onValueChange`, `emptyState` | Shared command surface only | P2 | HIGH | 4 |
| DateTimePicker | NEW_SHARED_COMPONENT | 5 apps; see `05` | missing | `02` amendment: `value`, `onChange`, `minDateTime`, `maxDateTime`, `timezone` | Time-enabled picking remains separate from base date input | P2 | HIGH | 4 |

### Wave B5.4 - Long Tail and Decision-Gated Work

| Component | Classification | Apps that need it | `@repo/ui` status | Canonical API | Cross-app conflicts resolved | Priority | Risk | Target batch |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Menubar | NEW_SHARED_COMPONENT | 4 apps; see `05` | missing | `02` amendment: `items`, `onAction`, `disabled` | Long-tail navigation primitive only | P3 | MEDIUM | 4 |
| MonthPicker | NEW_SHARED_COMPONENT | 3 apps; see `05` | missing | `02` amendment: `value`, `onChange`, `minMonth`, `maxMonth` | Month-only contract stays distinct | P3 | MEDIUM | 4 |
| Timeline | NEW_SHARED_COMPONENT | 3 apps; see `05` | missing | `02` amendment: `items`, `orientation`, `statusTone` | Presentation-only timeline only | P3 | MEDIUM | 4 |
| RichTextEditor | NEW_SHARED_COMPONENT (decision-gated) | 1 app; see `05` | missing | Decision-gated API: `value`, `onChange`, `toolbar`, `readonly`, `sanitize` | Do not promote until engine, sanitization, SSR, and bundle policy are approved | P3 | HIGH | 4 |

## 4. Local-Only and Deferred Families

| Family | Final ruling | Source basis | Why it stays out of shared scope now | Re-entry condition |
| --- | --- | --- | --- | --- |
| ReCaptcha and auth-provider widgets | KEEP_APP_LOCAL | `04`, `05` | SDK and security coupling | Only via a separate auth platform package |
| Microsoft login and SSO-specific controls | KEEP_APP_LOCAL | `04`, `05` | Third-party provider coupling | Same as above |
| Kanban-board composites | KEEP_APP_LOCAL | `05` deferred scope | Domain workflow coupling | Separate product-specific platform decision |
| App-specific chart wrappers | KEEP_APP_LOCAL | `04`, `05` deferred scope | Domain data coupling | Separate charting program |
| Route/page containers and split shells | KEEP_APP_LOCAL or deferred | `04` boundary rules | App routing, framework, and service-layer coupling | Formal reclassification after split and proof of reuse |
| Icon sub-library | DEFERRED | `04`, `05` | No need for a new shared abstraction yet | Re-open only if Lucide becomes insufficient |

## 5. Critical Path Ruling

1. Close shared readiness gaps recorded in `00`, `03`, and `06` before implementation starts.
2. Extend `Box` first because it is the only approved Batch 3 shared change.
3. Build Wave B4 in strict SDD order before any long-tail work starts.
4. Hold high-risk items behind their explicit gates: `Dialog`, `Select`, `DatePicker`, `Combobox`, `DataTable`, `NavigationMenu`, `DateRangePicker`, `DateTimePicker`, `RichTextEditor`.
5. Use `05` app readiness as the authoritative downstream sequencing input for Batch 5 and Batch 6.

## 6. Governance Notes

- `05-coverage-baseline.md` is the source of truth for demand counts and wave ordering.
- `11-master-component-roadmap.md` is the source of truth for shared implementation structure, dependencies, and effort.
- `12-master-backlog.csv` is limited to the canonical shared-program backlog for this rerun.
- `13-implementation-batches.md` remains the execution contract for batches `1` through `6`.
