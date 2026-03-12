# 10 - Cross-App Reconciliation

> Batch: Batch 3 - Migration Plan
> Branch: `feat/ui`
> Run date: 2026-03-09
> Inputs read: `03-migration-plan.md`, `00`-`06` normalization outputs, and all per-app `_audit-report.md`, `_component-backlog.csv`, `_parity-checklist.md` artifacts from `migrate-app_*`

## 1. Program Summary

| Metric | Value |
| --- | --- |
| Raw per-app backlog rows read | 3,412 |
| Unique deduplicated backlog entries in `12-master-backlog.csv` | 2,524 |
| Shared-track candidates present in deduplicated backlog | 295 plus canonical `Box` carry-forward |
| Split / migrate-after-split candidates | 490 |
| Keep-app-local candidates | 1,908 |
| Canonical shared set | 41 components including `Box` |
| Existing in `@repo/ui` | 1 (`Box`) |
| Shared build or extension scope | 40 |
| Batch 3 extension scope | 1 (`Box`) |
| Batch 4 new shared components | 39 approved + 1 decision-gated (`RichTextEditor`) |
| Planning backlog scope in `12-master-backlog.csv` | Full deduplicated union of all per-app backlog exports |
| Canonical shared implementation scope in this document | Consolidated shared program only |

### Final rulings

- This rerun is program-level and cross-app, using the locked Batch 2 foundation plus the current per-app Batch 1 outputs from the `migrate-app_*` lanes.
- `12-master-backlog.csv` now represents the full deduplicated union of all per-app backlog exports, not just the canonical shared program.
- The canonical shared implementation scope is still intentionally consolidated in Section 3 and the roadmap in `11-master-component-roadmap.md`.
- Shared loading scope is limited to `Spinner` and `Skeleton`; loading wrappers and suspense fallbacks remain app-local unless a future narrower wrapper is explicitly re-approved.
- App-local, adapter-only, and split-only queues remain visible in `12-master-backlog.csv`, but they do not automatically enter the shared build roadmap.

## 2. Reconciliation Rules Applied

| Raw family | Canonical handling | Rule |
| --- | --- | --- |
| Generic buttons and CTA primitives | `Button` | Pure visual action controls collapse into one shared primitive. |
| Text inputs and field primitives | `Input` | Generic single-line inputs collapse into one canonical contract. |
| Multiline text fields | `Textarea` | Shared multiline input, distinct from rich text editing. |
| Static select controls | `Select` | Non-searchable selection belongs to `Select`. |
| Searchable or async selection | `Combobox` | Search-driven selection belongs to `Combobox`, not `Select`. |
| Modal and overlay shells | `Dialog`, `Drawer`, `Popover`, `Tooltip`, `DropdownMenu` | Overlay families stay distinct by interaction model. |
| Loading indicators | `Skeleton`, `Spinner` | Shared loading primitives stay canonical; wrapper layout and suspense fallback composition stay app-local. |
| Data display primitives | `Table`, `DataTable`, `Card`, `Badge`, `Avatar`, `Image`, `Timeline` | Structural display stays shared; domain data logic stays local. |
| Date input family | `Calendar`, `DatePicker`, `DateRangePicker`, `DateTimePicker`, `MonthPicker` | Date contracts remain split by interaction scope, not overloaded into one component. |
| Layout primitives | `Box`, `Card` | Layout stays structural and app-agnostic only. |

### Traceability rule for `12-master-backlog.csv`

- `12-master-backlog.csv` is derived from the deduplicated union of all per-app `_component-backlog.csv` exports from `migrate-app_*`, plus the canonical `Box` Batch 3 row carried forward from the normalization outputs.
- Each row is a deduplicated component-name entry with merged `consumer_apps`, a selected `final_classification`, and one planning batch.
- `consumer_apps` is an explicit pipe-separated app list, not a demand-count shorthand.
- The canonical shared roadmap in this document is a filtered program view on top of that merged backlog.
## 3. Canonical Shared Track

### Batch 3 - Extend Existing

| Component | Classification | Apps that need it | `@repo/ui` status | Canonical API | Cross-app conflicts resolved | Priority | Risk | Target batch |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Box | EXTEND_EXISTING | Existing primitive with 27-app baseline footprint; see `01` | exists | `02` amendment: `asChild`, `padding`, `container`, `centered` | Keep `Box` as the only layout primitive extension path; do not turn it into app-specific page chrome | P0 | LOW | B3 |

### Wave B4 - Core Foundation Build

| Component | Classification | Apps that need it | `@repo/ui` status | Canonical API | Cross-app conflicts resolved | Priority | Risk | Target batch |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Alert | NEW_SHARED_COMPONENT | 22 apps; see `05` | missing | `02` Alert | Feedback shell only; delivery mechanics stay local | P0 | MEDIUM | B4 |
| Badge | NEW_SHARED_COMPONENT | 11 apps; see `05` | missing | `02` Badge | Shared status chip only; KPI/domain semantics stay local | P0 | LOW | B4 |
| Button | NEW_SHARED_COMPONENT | 23 apps; see `05` | missing | `02` Button | Shared primitive only; domain button wrappers stay local | P0 | MEDIUM | B4 |
| Card | NEW_SHARED_COMPONENT | 12 apps; see `05` | missing | `02` Card | Structural card only; domain cards compose on top | P0 | LOW | B4 |
| Checkbox | NEW_SHARED_COMPONENT | 20 apps; see `05` | missing | `02` Checkbox | Generic choice control; business meaning stays local | P0 | MEDIUM | B4 |
| Dialog | NEW_SHARED_COMPONENT | 26 apps; see `05` | missing | `02` Dialog | Modal shell normalized to one contract; body content stays local | P0 | HIGH | B4 |
| Drawer | NEW_SHARED_COMPONENT | 10 apps; see `05` | missing | `02` Drawer | Drawer stays separate from modal semantics | P1 | HIGH | B4 |
| Input | NEW_SHARED_COMPONENT | 26 apps; see `05` | missing | `02` Input | Shared text input only; app containers stay local | P0 | MEDIUM | B4 |
| Label | NEW_SHARED_COMPONENT | 10 apps; see `05` | missing | `02` amendment: `htmlFor`, `required`, `disabled`, `tone` | Label becomes first-class instead of app-side duplication | P1 | LOW | B4 |
| Pagination | NEW_SHARED_COMPONENT | 16 apps; see `05` | missing | `02` Pagination | Generic page navigation only; data fetching stays local | P0 | MEDIUM | B4 |
| RadioGroup | NEW_SHARED_COMPONENT | 11 apps; see `05` | missing | `02` RadioGroup | Shared exclusive-choice control only | P1 | LOW | B4 |
| Select | NEW_SHARED_COMPONENT | 25 apps; see `05` | missing | `02` Select | Static selection contract only; searchable selection routes to `Combobox` | P0 | HIGH | B4 |
| Skeleton | NEW_SHARED_COMPONENT | 10 apps; see `05` | missing | `02` Skeleton | Structural placeholder, not a loader shell | P0 | LOW | B4 |
| Spinner | NEW_SHARED_COMPONENT | 8 apps; see `05` | missing | `02` amendment: `size`, `label`, `inline`, `overlay` | Inline wait-state primitive only | P0 | LOW | B4 |
| Switch | NEW_SHARED_COMPONENT | 9 apps; see `05` | missing | `02` Switch | Shared toggle only; feature semantics stay local | P1 | LOW | B4 |
| Table | NEW_SHARED_COMPONENT | 12 apps; see `05` | missing | `02` Table | Visual table foundation only; headless logic belongs in `DataTable` | P0 | MEDIUM | B4 |
| Tabs | NEW_SHARED_COMPONENT | 13 apps; see `05` | missing | `02` amendment: `value`, `defaultValue`, `onValueChange`, `orientation` | Shared tabs only; route syncing stays local | P1 | MEDIUM | B4 |
| Textarea | NEW_SHARED_COMPONENT | 18 apps; see `05` | missing | `02` Textarea | Multiline plain-text input only | P0 | LOW | B4 |

### Wave B5.1 - Date and Overlay Normalization

| Component | Classification | Apps that need it | `@repo/ui` status | Canonical API | Cross-app conflicts resolved | Priority | Risk | Target batch |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Breadcrumb | NEW_SHARED_COMPONENT | 12 apps; see `05` | missing | `02` amendment: `items[]`, `separator`, `currentLabel` | Shared shell only; route generation stays local | P1 | LOW | B5.1 |
| Calendar | NEW_SHARED_COMPONENT | 9 apps; see `05` | missing | `02` Calendar | Standalone calendar stays separate from picker wrappers | P1 | MEDIUM | B5.1 |
| DatePicker | NEW_SHARED_COMPONENT | 22 apps; see `05` | missing | `02` DatePicker | Single-date picking remains distinct from range/time/month selection | P0 | HIGH | B5.1 |
| DropdownMenu | NEW_SHARED_COMPONENT | 12 apps; see `05` | missing | `02` amendment: `items`, `align`, `side`, `onAction` | Generic action menu only | P1 | MEDIUM | B5.1 |
| Form | NEW_SHARED_COMPONENT | 9 apps; see `05` | missing | `02` Form | Field scaffolding only; schemas and submit logic stay local | P0 | HIGH | B5.1 |
| Popover | NEW_SHARED_COMPONENT | 9 apps; see `05` | missing | `02` Popover | Generic floating surface only | P1 | LOW | B5.1 |
| Tooltip | NEW_SHARED_COMPONENT | 9 apps; see `05` | missing | `02` Tooltip | Assistive content only; guided flows stay local | P1 | LOW | B5.1 |

### Wave B5.2 - Advanced Input and Data Display

| Component | Classification | Apps that need it | `@repo/ui` status | Canonical API | Cross-app conflicts resolved | Priority | Risk | Target batch |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Avatar | NEW_SHARED_COMPONENT | 6 apps; see `05` | missing | `02` amendment: `src`, `alt`, `fallback`, `size` | Avatar stays visual-only | P2 | LOW | B5.2 |
| Combobox | NEW_SHARED_COMPONENT | 8 apps; see `05` | missing | `02` Combobox | Searchable selection kept distinct from static select | P1 | HIGH | B5.2 |
| DataTable | NEW_SHARED_COMPONENT | 6 apps; see `05` | missing | `02` DataTable | Generic headless table only; domain columns and workflows stay local | P1 | HIGH | B5.2 |
| DateRangePicker | NEW_SHARED_COMPONENT | 7 apps; see `05` | missing | `02` amendment: `value`, `onChange`, `presets`, `minDate`, `maxDate` | Range selection stays separate from single-date picking | P2 | HIGH | B5.2 |
| FileUpload | NEW_SHARED_COMPONENT | 12 apps; see `05` | missing | `02` FileUpload | Shared upload UX only; transport and storage stay local | P1 | MEDIUM | B5.2 |
| Image | NEW_SHARED_COMPONENT | 13 apps; see `05` | missing | `02` amendment: `src`, `alt`, `fallback`, `ratio`, `fit` | Shared image rendering only; framework and viewer concerns stay local | P1 | MEDIUM | B5.2 |
| NavigationMenu | NEW_SHARED_COMPONENT | 8 apps; see `05` | missing | `02` amendment: `items`, `orientation`, `collapsed`, `onNavigate` | Route trees and auth gating stay local | P2 | HIGH | B5.2 |
| OtpInput | NEW_SHARED_COMPONENT | 6 apps; see `05` | missing | `02` OtpInput | Segmented code entry only | P2 | MEDIUM | B5.2 |

### Wave B5.3 - Remaining Medium-Demand Components

| Component | Classification | Apps that need it | `@repo/ui` status | Canonical API | Cross-app conflicts resolved | Priority | Risk | Target batch |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Accordion | NEW_SHARED_COMPONENT | 4 apps; see `05` | missing | `02` amendment: `type`, `collapsible`, `value`, `onValueChange` | Disclosure primitive only | P2 | MEDIUM | B5.3 |
| Command | NEW_SHARED_COMPONENT | 5 apps; see `05` | missing | `02` amendment: `items`, `value`, `onValueChange`, `emptyState` | Shared command surface only | P2 | HIGH | B5.3 |
| DateTimePicker | NEW_SHARED_COMPONENT | 5 apps; see `05` | missing | `02` amendment: `value`, `onChange`, `minDateTime`, `maxDateTime`, `timezone` | Time-enabled picking remains separate from base date input | P2 | HIGH | B5.3 |

### Wave B5.4 - Long Tail and Decision-Gated Work

| Component | Classification | Apps that need it | `@repo/ui` status | Canonical API | Cross-app conflicts resolved | Priority | Risk | Target batch |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Menubar | NEW_SHARED_COMPONENT | 4 apps; see `05` | missing | `02` amendment: `items`, `onAction`, `disabled` | Long-tail navigation primitive only | P3 | MEDIUM | B5.4 |
| MonthPicker | NEW_SHARED_COMPONENT | 3 apps; see `05` | missing | `02` amendment: `value`, `onChange`, `minMonth`, `maxMonth` | Month-only contract stays distinct | P3 | MEDIUM | B5.4 |
| Timeline | NEW_SHARED_COMPONENT | 3 apps; see `05` | missing | `02` amendment: `items`, `orientation`, `statusTone` | Presentation-only timeline only | P3 | MEDIUM | B5.4 |
| RichTextEditor | NEW_SHARED_COMPONENT (decision-gated) | 1 app; see `05` | missing | Decision-gated API: `value`, `onChange`, `toolbar`, `readonly`, `sanitize` | Do not promote until engine, sanitization, SSR, and bundle policy are approved | P3 | HIGH | B5.4 |

## 4. Local-Only and Deferred Families

| Family | Final ruling | Source basis | Why it stays out of shared scope now | Re-entry condition |
| --- | --- | --- | --- | --- |
| ReCaptcha and auth-provider widgets | KEEP_APP_LOCAL | `04`, `05` | SDK and security coupling | Only via a separate auth platform package |
| Microsoft login and SSO-specific controls | KEEP_APP_LOCAL | `04`, `05` | Third-party provider coupling | Same as above |
| Kanban-board composites | KEEP_APP_LOCAL | `05` deferred scope | Domain workflow coupling | Separate product-specific platform decision |
| App-specific chart wrappers | KEEP_APP_LOCAL | `04`, `05` deferred scope | Domain data coupling | Separate charting program |
| Route/page containers and split shells | KEEP_APP_LOCAL or deferred | `04` boundary rules | App routing, framework, and service-layer coupling | Formal reclassification after split and proof of reuse |
| Page header and title shells | KEEP_APP_LOCAL | `04`, `12`, `21` | Breadcrumb, back-navigation, sticky behavior, language controls, and action policy diverge by app | Re-open only with proof of a truly shared structural contract that survives without app wrappers |
| Loading wrappers and suspense fallbacks | KEEP_APP_LOCAL | `04`, `21` | Layout wrappers, suspense fallbacks, branded loaders, and retry/error-aware shells still diverge by app | Only via a future narrower shared-wrapper decision |
| Icon sub-library | DEFERRED | `04`, `05` | No need for a new shared abstraction yet | Re-open only if Lucide becomes insufficient |

## 5. Critical Path Ruling

1. Close shared readiness gaps recorded in `00`, `03`, and `06` before implementation starts.
2. Extend `Box` first because it is the only approved Batch 3 shared change.
3. Build Wave B4 in strict SDD order before any long-tail work starts.
4. Hold high-risk items behind their explicit gates: `Dialog`, `Select`, `DatePicker`, `Combobox`, `DataTable`, `NavigationMenu`, `DateRangePicker`, `DateTimePicker`, `RichTextEditor`.
5. Complete Batch 3A token foundation bootstrap before any Batch 4 shared build begins.
6. Use 5 app readiness as the authoritative downstream sequencing input for Batch 5 and Batch 6.

## 6. Governance Notes

- `05-coverage-baseline.md` is the source of truth for demand counts and wave ordering.
- `11-master-component-roadmap.md` is the source of truth for shared implementation structure, dependencies, and effort.
- `12-master-backlog.csv` is the full deduplicated per-app backlog merge for this rerun.
- `13-implementation-batches.md` remains the execution contract for batches `1` through `6`, with explicit Batch `3A` between Batch `3` and Batch `4`.

