# 13 - Implementation Batches

> Batch: Batch 3 - Migration Plan
> Branch: `feat/ui`
> Run date: 2026-03-09
> Companion artifacts: `10-cross-app-reconciliation.md`, `11-master-component-roadmap.md`, `12-master-backlog.csv`, `03-token-theming-contract.md`

## 1. Program Controls

### Critical path

1. Close the canonical Batch 4 `EXTEND_EXISTING` track with `Box`; in this rerun the work was fast-tracked during Batch 3 foundation prep.
2. Complete Batch 3A token foundation bootstrap before any remaining Batch 4 or Batch 5 shared build begins.
3. Execute Batch 5 Wave 5.0 in strict SDD order before any longer-tail Batch 5 work starts.
4. Hold high-risk components behind their explicit gates: `Dialog`, `Select`, `DatePicker`, `Combobox`, `DataTable`, `NavigationMenu`, `DateRangePicker`, `DateTimePicker`, `RichTextEditor`.
5. Use `05` app readiness as the downstream sequencing contract for app-lane Batches 6 through 10.

### Status vocabulary

| Status | Meaning |
| --- | --- |
| `PLANNED` | Approved but not started |
| `IN PROGRESS` | Active implementation |
| `DONE` | Verification gate passed |
| `BLOCKED` | Cannot start due to prerequisite or dependency |
| `DECISION-GATED` | Visible in plan but intentionally held |

### Scope note

- This rerun plans the canonical shared program on top of the raw deduplicated backlog captured in `12-master-backlog.csv`.
- Batch 1 and Batch 2 remain structurally present but empty in the shared-program lane because no authoritative `ADOPT_*` workload was promoted into `feat/ui`.
- Split and app-local rows still exist in `12-master-backlog.csv`; they remain downstream app-lane concerns unless explicitly promoted into the shared roadmap.

## 2. Batch 1 - ADOPT_NOW

### Scope description

- No authoritative `ADOPT_NOW` workload is present in this rerun.

### packages/ui work required

- None.

### Per-app work required

- None in the current authoritative plan.

### Verification gate

- If this batch is populated later by an approved source:
  - `pnpm --filter <APP_PACKAGE> check-types`
  - `pnpm --filter <APP_PACKAGE> lint`
  - `pnpm --filter <APP_PACKAGE> build`
  - Run the smoke routes defined in that app's `docs/migration/verification-gate.md`

### Apps x Components matrix

| App | Component | Action | Status | Notes |
| --- | --- | --- | --- | --- |
| None | None | No Batch 1 workload in authoritative rerun | DONE | Structural placeholder only |

## 3. Batch 2 - ADOPT_WITH_ADAPTER

### Scope description

- No authoritative adapter row is carried forward in this rerun.
- Adapter-only app work may still exist downstream, but it is intentionally outside this normalized shared-program plan.

### packages/ui work required

- None.

### Per-app work required

- None in the current authoritative plan.

### Verification gate

- If this batch is populated later by an approved source:
  - `pnpm --filter <APP_PACKAGE> check-types`
  - `pnpm --filter <APP_PACKAGE> lint`
  - `pnpm --filter <APP_PACKAGE> build`
  - Run the smoke routes defined in that app's `docs/migration/verification-gate.md`

### Apps x Components matrix

| App | Component | Action | Status | Notes |
| --- | --- | --- | --- | --- |
| None | None | No Batch 2 workload in authoritative rerun | DONE | Structural placeholder only |

## 4. Batch 4 - EXTEND_EXISTING

### Scope description

- Batch 4 is the canonical `EXTEND_EXISTING` track in the shared lane.
- In this rerun, `Box` is the only approved `EXTEND_EXISTING` item and it was fast-tracked during Batch 3 foundation prep.

### packages/ui work required

- Update `Box` spec and canonical API.
- Add stories for `padding`, `container`, and `centered` behavior.
- Implement the new presets without introducing app-specific layout policy.
- Export and document the final shared contract.

### Per-app work required

- No app-specific execution matrix is authoritatively enumerated in this rerun.
- Downstream apps may consume the new `Box` contract later according to their readiness state in `05`.

### Verification gate

- Shared component gate:
  - `pnpm --filter @repo/ui check-types`
  - `pnpm --filter @repo/ui lint`
  - `pnpm --filter @repo/ui build`
  - Storybook renders all required `Box` stories without errors

### Apps x Components matrix

| Target | Component | Action | Status | Notes |
| --- | --- | --- | --- | --- |
| `@repo/ui` | `Box` | Extend existing layout primitive | DONE | Canonical Batch 4 item, fast-tracked during Batch 3 foundation prep; verification gate passed on 2026-03-08 |

## 5. Batch 3A - Token Foundation Bootstrap

### Scope description

- Batch 3A converts `03-token-theming-contract.md` from a locked document into real shared workspace infrastructure.
- This is the mandatory bridge between Batch 3 planning and any Batch 4 or Batch 5 shared component build.

### packages/ui work required

- Add and export the semantic token preset in `@repo/config`.
- Keep legacy palette tokens only as temporary migration support.
- Ensure new shared components rely on semantic tokens only.
- Lock the app-consumer contract for `globals.css` and `[data-theme="dark"]`.

### Per-app work required

- None in this lane. Apps consume the contract later during downstream migration.

### Verification gate

- `pnpm --filter @repo/ui check-types`
- `pnpm --filter @repo/ui lint`
- `pnpm --filter @repo/ui build`
- Confirm `13-implementation-batches.md` blocks Batch 4 and Batch 5 until Batch 3A is complete

### Apps x Components matrix

| Target | Scope | Action | Status | Notes |
| --- | --- | --- | --- | --- |
| `@repo/config` | Semantic token preset | Bootstrap shared token source of truth | DONE | Exported via `@repo/config/semantic-tokens.css` and `@repo/config/tailwind.css` on 2026-03-09 |
| `@repo/ui` | Token consumption contract | Enforce semantic-token-only styling | DONE | Batch 3A gate passed; shared work stays semantic-token only |

## 6. Batch 5 - NEW_SHARED_COMPONENT

### Scope description

- Batch 5 is the main shared build program for `NEW_SHARED_COMPONENT` work.
- Every item follows the SDD lifecycle defined in `04-build-shared-components.md`.

### packages/ui work required

- Implement the roadmap in the exact order defined by `11-master-component-roadmap.md`.
- Avoid same-component parallelism.
- Update the shared tracker in this file when any component changes state.

### Per-app work required

- Ready apps may adopt shared components only after those components reach `DONE`.
- Conditional apps must first satisfy their readiness constraints from `05`.

### Verification gate

- Shared component gate, for every component:
  - `pnpm --filter @repo/ui check-types`
  - `pnpm --filter @repo/ui lint`
  - `pnpm --filter @repo/ui build`
  - Storybook renders that component's required stories without errors
- Downstream app gate, when adoption starts:
  - `pnpm --filter <APP_PACKAGE> check-types`
  - `pnpm --filter <APP_PACKAGE> lint`
  - `pnpm --filter <APP_PACKAGE> build`
  - Run the smoke routes defined in that app's `docs/migration/verification-gate.md`

### Wave execution table

| Wave | Shared components | Entry gate | Exit gate | Status |
| --- | --- | --- | --- | --- |
| B5.0 | `Alert`, `Badge`, `Button`, `Card`, `Checkbox`, `ContentLoadingWrapper`, `Dialog`, `Drawer`, `Input`, `Label`, `Pagination`, `RadioGroup`, `Select`, `Skeleton`, `Spinner`, `Switch`, `Table`, `Tabs`, `Textarea` | Canonical Batch 4 `Box` item closed and Batch 3A token bootstrap complete | All B5.0 items marked `DONE` | PLANNED |
| B5.1 | `Breadcrumb`, `Calendar`, `DatePicker`, `DropdownMenu`, `Form`, `Popover`, `Tooltip` | B5.0 stable, especially `Input`, `Label`, and overlay primitives | All B5.1 items marked `DONE` | PLANNED |
| B5.2 | `Avatar`, `Combobox`, `DataTable`, `DateRangePicker`, `FileUpload`, `Image`, `NavigationMenu`, `OtpInput`, `PageHeader` | B5.1 stable and required dependencies installed | All B5.2 items marked `DONE` or explicitly blocked with reason | PLANNED |
| B5.3 | `Accordion`, `Command`, `DateTimePicker` | B5.2 prerequisites complete | All B5.3 items marked `DONE` | PLANNED |
| B5.4 | `Menubar`, `MonthPicker`, `Timeline` | No open P0/P1 blocker remains | Long-tail items marked `DONE` or explicitly deferred | PLANNED |
| Decision gate | `RichTextEditor` | Editor engine, security, SSR, and bundle policy approved | Status changes from `DECISION-GATED` to `PLANNED` | DECISION-GATED |

### App cohort matrix

| Cohort | Apps | Rule |
| --- | --- | --- |
| Ready cohort | `admin-portal`, `admin-portal-boost`, `affiliate-admin`, `affiliate-portal`, `agent-admin`, `agent-microsite`, `agent-portal`, `agent-web-portal`, `boost-product-fe`, `claim-portal`, `customer-portal`, `ecommerce-gelm`, `ecommerce-teman`, `gegm-friendcover-admin`, `gen-ai-portal`, `getrev-da-microsite`, `mykawan-website`, `partner-portal`, `sso-portal`, `teman-affiliate-admin`, `teman-affiliate-portal`, `ticket-portal` | May adopt shared components after the relevant shared item is `DONE` |
| Conditional cohort | `gegm-friendcover`, `gelm-xproject-microsite`, `grab-landing-page`, `haruuz-microsite`, `teman-affiliate-microsite` | Must close token or readiness constraints from `05` before adoption |

## 7. Batches 6-9 - Per-App Migration and Stabilization

### Scope description

- App-lane Batches 6 through 9 begin only after the relevant shared components are already `DONE`.

### packages/ui work required

- Only defect fixes inside already-approved shared contracts.

### Per-app work required

- Complete parity checks for migrated shared components.
- Run smoke-route verification.
- Record any downstream compatibility notes before cleanup begins.

### Verification gate

- Shared package regression gate when a shared defect fix lands:
  - `pnpm --filter @repo/ui check-types`
  - `pnpm --filter @repo/ui lint`
  - `pnpm --filter @repo/ui build`
- Downstream app stabilization gate:
  - `pnpm --filter <APP_PACKAGE> check-types`
  - `pnpm --filter <APP_PACKAGE> lint`
  - `pnpm --filter <APP_PACKAGE> build`
  - Run the smoke routes defined in that app's `docs/migration/verification-gate.md`

### Apps x Components matrix

| Cohort | Focus | Status | Notes |
| --- | --- | --- | --- |
| Ready cohort | Close parity deltas for adopted shared components | PLANNED | May run in parallel across apps |
| Conditional cohort | Stabilize only after readiness constraints are closed | PLANNED | Do not bypass `05` constraints |

## 8. Batch 10 - Cleanup + Deprecation

### Scope description

- Remove deprecated shared exports and obsolete local duplicates only after stabilization is green.

### packages/ui work required

- Remove temporary compatibility surfaces that are no longer needed.

### Per-app work required

- Delete replaced local duplicates.
- Remove temporary wrappers or compatibility paths that are no longer needed.
- Update migration logs and cleanup reports.

### Verification gate

- Shared cleanup gate:
  - `pnpm --filter @repo/ui check-types`
  - `pnpm --filter @repo/ui lint`
  - `pnpm --filter @repo/ui build`
- Downstream app cleanup gate:
  - `pnpm --filter <APP_PACKAGE> check-types`
  - `pnpm --filter <APP_PACKAGE> lint`
  - `pnpm --filter <APP_PACKAGE> build`
  - Run the smoke routes defined in that app's `docs/migration/verification-gate.md`

### Apps x Components matrix

| Target | Action | Status | Notes |
| --- | --- | --- | --- |
| All consuming apps | Remove dead local duplicates after parity is green | PLANNED | Shared adoption must already be stable |
| `@repo/ui` | Remove deprecated compatibility exports | PLANNED | Execute once downstream usage is confirmed clean |

## 9. Shared Component Tracker

| Component | Program batch | Wave | Status | Blocker / note |
| --- | --- | --- | --- | --- |
| Box | 4 | B4 | DONE | Canonical Batch 4 item, fast-tracked during Batch 3 foundation prep; `padding`, `container`, and `centered` presets verified on 2026-03-08 |
| Alert | 5 | B5.0 | PLANNED | Depends on foundation readiness only |
| Badge | 5 | B5.0 | PLANNED | Low-risk primitive |
| Button | 5 | B5.0 | PLANNED | High-demand primitive |
| Card | 5 | B5.0 | PLANNED | Structural composite |
| Checkbox | 5 | B5.0 | PLANNED | Needs invalid and indeterminate coverage |
| ContentLoadingWrapper | 5 | B5.0 | PLANNED | Align with `Skeleton` and `Spinner` |
| Dialog | 5 | B5.0 | PLANNED | A11y gate is explicit |
| Drawer | 5 | B5.0 | PLANNED | Depends on `vaul` |
| Input | 5 | B5.0 | PLANNED | Core primitive |
| Label | 5 | B5.0 | PLANNED | Needed before `Form` |
| Pagination | 5 | B5.0 | PLANNED | Shared navigation primitive |
| RadioGroup | 5 | B5.0 | PLANNED | Form-aligned control |
| Select | 5 | B5.0 | PLANNED | Static select only |
| Skeleton | 5 | B5.0 | PLANNED | Small placeholder primitive |
| Spinner | 5 | B5.0 | PLANNED | Wait-state primitive |
| Switch | 5 | B5.0 | PLANNED | Toggle control |
| Table | 5 | B5.0 | PLANNED | Foundation for `DataTable` |
| Tabs | 5 | B5.0 | PLANNED | Route sync remains local |
| Textarea | 5 | B5.0 | PLANNED | Plain multiline input |
| Breadcrumb | 5 | B5.1 | PLANNED | Build after B5.0 stability |
| Calendar | 5 | B5.1 | PLANNED | Requires `react-day-picker` + `date-fns` |
| DatePicker | 5 | B5.1 | PLANNED | Depends on `Calendar` and `Popover` |
| DropdownMenu | 5 | B5.1 | PLANNED | Compound menu surface |
| Form | 5 | B5.1 | PLANNED | Needs `Label` and `Input` first |
| Popover | 5 | B5.1 | PLANNED | Overlay foundation dependency |
| Tooltip | 5 | B5.1 | PLANNED | Small but a11y-sensitive |
| Avatar | 5 | B5.2 | PLANNED | Low-risk visual primitive |
| Combobox | 5 | B5.2 | PLANNED | Searchable selection contract |
| DataTable | 5 | B5.2 | BLOCKED | Wait for `Table` maturity and TanStack readiness |
| DateRangePicker | 5 | B5.2 | BLOCKED | Start after `DatePicker` stabilizes |
| FileUpload | 5 | B5.2 | PLANNED | Transport logic stays local |
| Image | 5 | B5.2 | PLANNED | No framework coupling |
| NavigationMenu | 5 | B5.2 | BLOCKED | Route-tree API must remain app-agnostic |
| OtpInput | 5 | B5.2 | PLANNED | Segmented input contract |
| PageHeader | 5 | B5.2 | PLANNED | Structural header only |
| Accordion | 5 | B5.3 | PLANNED | Lower-demand compound component |
| Command | 5 | B5.3 | PLANNED | Shared command surface |
| DateTimePicker | 5 | B5.3 | BLOCKED | Needs settled date/time policy |
| Menubar | 5 | B5.4 | PLANNED | Long-tail navigation primitive |
| MonthPicker | 5 | B5.4 | PLANNED | Month-only contract |
| Timeline | 5 | B5.4 | PLANNED | Presentation-only data display |
| RichTextEditor | 5 | Decision gate | DECISION-GATED | Wait for editor engine and security approval |
