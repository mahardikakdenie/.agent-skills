# 13 - Implementation Batches

> Batch: Batch 3 - Migration Plan
> Branch: `feat/ui`
> Run date: 2026-03-10
> Companion artifacts: `10-cross-app-reconciliation.md`, `11-master-component-roadmap.md`, `12-master-backlog.csv`, `03-token-theming-contract.md`

## 1. Program Controls

### Critical path

1. Finish Batch 3 `Box` extension first.
2. Complete Batch 3A token foundation bootstrap before any shared build beyond `Box`.
3. Execute Wave B4 in strict SDD order before any long-tail work starts.
4. Hold high-risk components behind their explicit gates: `Dialog`, `Select`, `DatePicker`, `Combobox`, `DataTable`, `NavigationMenu`, and `DateRangePicker`.
5. Use `05` app readiness as the downstream stabilization and cleanup sequencing contract.

### Status vocabulary

| Status           | Meaning                                        |
| ---------------- | ---------------------------------------------- |
| `PLANNED`        | Approved but not started                       |
| `IN PROGRESS`    | Active implementation                          |
| `DONE`           | Verification gate passed                       |
| `BLOCKED`        | Cannot start due to prerequisite or dependency |
| `DECISION-GATED` | Visible in plan but intentionally held         |

### Scope note

- This rerun plans the canonical shared program on top of the raw deduplicated backlog captured in `12-master-backlog.csv`.
- Batch 1 and Batch 2 remain structurally present but empty in the shared-program lane because no authoritative `ADOPT_*` workload was promoted into `feat/ui`.
- Split and app-local rows still exist in `12-master-backlog.csv`; they remain downstream app-lane concerns unless explicitly promoted into the shared roadmap.
- Shared loading scope stops at the `Spinner` and `Skeleton` primitives; loading wrappers, suspense fallbacks, branded loaders, and retry/error-aware loading shells stay in app lanes unless a future narrower wrapper is explicitly approved.
- Sizing normalization is now amendment-open: `Select` and `Combobox` are approved follow-up implementation targets for the field-shell size family with `xs | sm | md | lg`, default `md`; `OtpInput` keeps its shipped public `sm | md | lg` contract; `Pagination`, `Textarea`, `Dialog`, and `Calendar` remain frozen exceptions in this pass.
- The amendment gate is docs-first in both execution modes: a single agent may amend then implement sequentially, or `W-DOCS` lands the docs before `W-SELECT` and `W-COMBOBOX` begin, with verification last.
- Focus normalization is now amendment-open as a bounded follow-up inside `packages/ui`.
- Approved focus Wave 1 is docs-first and limited to the field-entry family: verify or extend the existing internal focus utility only if needed, then limit implementation to `Input`, `Textarea`, `DatePicker`, `DateRangePicker`, `MonthPicker`, `Select`, `Combobox`, and `OtpInput`.
- Wave 2 reopens the `compact-control` family for `Button`, `Checkbox`, `RadioGroup`, `Switch`, and `DateRangePicker` preset buttons using the existing internal focus utility.
- Wave 3 reopens the `dense-surface` family for `Calendar`, `Tabs`, `Accordion`, `Pagination`, `NavigationMenu`, `Menubar`, `Command`, and dense date-surface follow-up such as the `MonthPicker` year trigger.
- The focus-wave stop line is explicit: do not widen beyond approved Wave 3 into unrelated hover, open-state, selected-state, or popup-layout redesign.
- Cross-check on 2026-03-12 confirms the current canonical `@repo/ui` export surface for normalized shared adoption includes `Accordion`, `Box`, `Alert`, `Avatar`, `Badge`, `Breadcrumb`, `Button`, `Calendar`, `Card`, `Checkbox`, `Command`, `DatePicker`, `Dialog`, `Drawer`, `DropdownMenu`, `FileUpload`, `Image`, `Input`, `Label`, `OtpInput`, `Pagination`, `Popover`, `RadioGroup`, `Select`, `Skeleton`, `Spinner`, `Switch`, `Table`, `Tabs`, `Textarea`, and `Tooltip`; `PageHeader` is intentionally excluded from the normalized shared rollout after the 2026-03-12 boundary reversal and remains app-local for downstream migration planning.

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

| App  | Component | Action                                     | Status | Notes                       |
| ---- | --------- | ------------------------------------------ | ------ | --------------------------- |
| None | None      | No Batch 1 workload in authoritative rerun | DONE   | Structural placeholder only |

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

| App  | Component | Action                                     | Status | Notes                       |
| ---- | --------- | ------------------------------------------ | ------ | --------------------------- |
| None | None      | No Batch 2 workload in authoritative rerun | DONE   | Structural placeholder only |

## 4. Batch 3 - EXTEND_EXISTING

### Scope description

- Batch 3 contains exactly one shared change: `Box`.

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

| Target     | Component | Action                           | Status | Notes                                                                                                                                          |
| ---------- | --------- | -------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `@repo/ui` | `Box`     | Extend existing layout primitive | DONE   | `padding`, `container`, and `centered` presets shipped on 2026-03-08; Batch 4 procedural re-execution aligned spec/stories/types on 2026-03-10 |

## 5. Batch 3A - Token Foundation Bootstrap

### Scope description

- Batch 3A converts `03-token-theming-contract.md` from a locked document into real shared workspace infrastructure.
- This is the mandatory bridge between Batch 3 planning and any Batch 4 shared component build.

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
- `@repo/config` has no package-level verification scripts in its current `package.json`; verify the shared token preset by file-contract inspection during the Batch 3A rerun
- Confirm `13-implementation-batches.md` blocks Batch 4 and Batch 5 until Batch 3A is complete

### Apps x Components matrix

| Target         | Scope                      | Action                                 | Status | Notes                                                                                                                                                                                             |
| -------------- | -------------------------- | -------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@repo/config` | Semantic token preset      | Bootstrap shared token source of truth | DONE   | Re-executed on 2026-03-10; `@repo/config/semantic-tokens.css` and `@repo/config/tailwind.css` satisfy the Batch 3A contract while keeping legacy palette utilities as temporary migration support |
| `@repo/ui`     | Token consumption contract | Enforce semantic-token-only styling    | DONE   | Re-executed on 2026-03-10; `pnpm --filter @repo/ui check-types`, `lint`, and `build` all pass and `packages/ui/src` stays semantic-token only                                                     |

## 6. Batch 4 - NEW_SHARED_COMPONENT

### Scope description

- Batch 4 is the main shared build program.
- Every item follows the SDD lifecycle defined in `04-build-shared-components.md`.
- Batch 4 is no longer blocked by token-foundation readiness; Wave B4 execution is complete with `Alert`, `Badge`, `Button`, `Card`, `Checkbox`, `Dialog`, `Drawer`, `Input`, `Label`, `Pagination`, `RadioGroup`, `Select`, `Skeleton`, `Spinner`, `Switch`, `Table`, `Tabs`, and `Textarea`; Wave B5.1 is complete with `Breadcrumb`, `Calendar`, `DatePicker`, `DropdownMenu`, `Form`, `Popover`, and `Tooltip`; Wave B5.2 is complete with `Avatar`, `Combobox`, `DataTable`, `DateRangePicker`, `FileUpload`, `Image`, `NavigationMenu`, and `OtpInput` delivered; Wave B5.3 is complete with `Accordion` and `Command` delivered; and Wave B5.4 is complete with `Menubar`, `MonthPicker`, and `Timeline` delivered.
- Loading wrappers and suspense fallbacks are not Batch 4 shared-component targets; app teams compose `Spinner` and `Skeleton` directly in app code when those shells are needed.

### packages/ui work required

- Implement the roadmap in the exact order defined by `11-master-component-roadmap.md`.
- Create or update `ComponentName.spec.md` before stories or code for every Batch 4 row.
- Match each component folder to its `Simple`, `Standard`, or `Complex` structure tier before implementation starts.
- Use `Box` as the authored DOM primitive everywhere in shared source; semantic HTML and SVG output must be expressed via `Box as="..."`, not direct native JSX tags.
- Do not hand-author inline SVG markup in `packages/ui` source when a shared icon component is available; for Lucide usage, import named icons from `'lucide-react'` only and never from `dist/*` or default imports.
- Avoid same-component parallelism.
- Update the shared tracker in this file when any component changes state.

### Per-app work required

- Ready apps may adopt shared components only after those components reach `DONE`.
- Conditional apps must first satisfy their readiness constraints from `05`.

### Verification gate

- Shared component gate, for every component:
  - `ComponentName.spec.md` exists and matches the shipped API
  - Authored JSX in shared source and stories uses `Box` for every DOM node; semantic HTML and SVG output is expressed via `Box as="..."`
  - Stories/examples do not deep-import `lucide-react`, and authored source does not contain direct native JSX tags such as `div`, `button`, `input`, `textarea`, `table`, `svg`, or `path`
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

| Wave          | Shared components                                                                                                                                                                        | Entry gate                                                     | Exit gate                                                                                                  | Status |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------ |
| B4            | `Alert`, `Badge`, `Button`, `Card`, `Checkbox`, `Dialog`, `Drawer`, `Input`, `Label`, `Pagination`, `RadioGroup`, `Select`, `Skeleton`, `Spinner`, `Switch`, `Table`, `Tabs`, `Textarea` | Batch 3 `Box` complete and Batch 3A token bootstrap complete   | All B4 items marked `DONE`                                                                                 | DONE   |
| B5.1          | `Breadcrumb`, `Calendar`, `DatePicker`, `DropdownMenu`, `Form`, `Popover`, `Tooltip`                                                                                                     | B4 stable, especially `Input`, `Label`, and overlay primitives | All B5.1 items marked `DONE`                                                                               | DONE   |
| B5.2          | `Avatar`, `Combobox`, `DataTable`, `DateRangePicker`, `FileUpload`, `Image`, `NavigationMenu`, `OtpInput`                                                                                | B5.1 stable and required dependencies installed                | All B5.2 items marked `DONE` or explicitly blocked with reason                                             | DONE   |
| B5.3          | `Accordion`, `Command`                                                                                                                                                                   | B5.2 prerequisites complete                                    | All B5.3 items marked `DONE` or explicitly blocked with reason                                             | DONE   |
| B5.4          | `Menubar`, `MonthPicker`, `Timeline`                                                                                                                                                     | No open P0/P1 blocker remains                                  | Long-tail items marked `DONE` or explicitly deferred                                                       | DONE   |
| Decision gate | `RichTextEditor`                                                                                                                                                                         | Editor engine, security, SSR, and bundle policy approved       | Bounded shared `RichTextEditor` lands with verification evidence and app-local scope guardrails documented | DONE   |

### App cohort matrix

| Cohort             | Apps                                                                                                                                                                                                                                                                                                                                                                                                                                   | Rule                                                                 |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Ready cohort       | `admin-portal`, `admin-portal-boost`, `affiliate-admin`, `affiliate-portal`, `agent-admin`, `agent-microsite`, `agent-portal`, `agent-web-portal`, `boost-product-fe`, `claim-portal`, `customer-portal`, `ecommerce-gelm`, `ecommerce-teman`, `gegm-friendcover-admin`, `gen-ai-portal`, `getrev-da-microsite`, `mykawan-website`, `partner-portal`, `sso-portal`, `teman-affiliate-admin`, `teman-affiliate-portal`, `ticket-portal` | May adopt shared components after the relevant shared item is `DONE` |
| Conditional cohort | `gegm-friendcover`, `gelm-xproject-microsite`, `grab-landing-page`, `haruuz-microsite`, `teman-affiliate-microsite`                                                                                                                                                                                                                                                                                                                    | Must close token or readiness constraints from `05` before adoption  |

## 7. Batch 5 - Per-App Stabilization

### Scope description

- Batch 5 begins only after the relevant shared components are already `DONE`.
- Batch 5 is no longer blocked by Batch 3A itself, but it remains operationally gated until shared Batch 4 components are built and verified.

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

| Cohort             | Focus                                                 | Status  | Notes                           |
| ------------------ | ----------------------------------------------------- | ------- | ------------------------------- |
| Ready cohort       | Close parity deltas for adopted shared components     | PLANNED | May run in parallel across apps |
| Conditional cohort | Stabilize only after readiness constraints are closed | PLANNED | Do not bypass `05` constraints  |

## 8. Batch 6 - Cleanup + Deprecation

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

| Target             | Action                                             | Status  | Notes                                            |
| ------------------ | -------------------------------------------------- | ------- | ------------------------------------------------ |
| All consuming apps | Remove dead local duplicates after parity is green | PLANNED | Shared adoption must already be stable           |
| `@repo/ui`         | Remove deprecated compatibility exports            | PLANNED | Execute once downstream usage is confirmed clean |

## 9. Shared Component Tracker

| Component       | Program batch | Wave          | Status | Blocker / note                                                                                                                                                                                                                                                                                                   |
| --------------- | ------------- | ------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Box             | 3             | B3            | DONE   | `padding`, `container`, and `centered` presets verified on 2026-03-08; re-executed for Batch 4 compliance on 2026-03-10                                                                                                                                                                                          |
| Alert           | 4             | B4            | DONE   | Shipped on 2026-03-10 with spec, Storybook, semantic variants, and controlled dismiss behavior                                                                                                                                                                                                                   |
| Badge           | 4             | B4            | DONE   | Shipped on 2026-03-10 with spec, Storybook, canonical size/variant coverage, and Box-composed dot support                                                                                                                                                                                                        |
| Button          | 4             | B4            | DONE   | Shipped on 2026-03-10 with spec, Storybook, canonical variant/size coverage, loading state, and Box-authored `asChild` composition                                                                                                                                                                               |
| Card            | 4             | B4            | DONE   | Shipped on 2026-03-10 with spec, Storybook, compound slot exports, and consumer-owned interactive composition                                                                                                                                                                                                    |
| Checkbox        | 4             | B4            | DONE   | Shipped on 2026-03-10 with spec, Storybook, Box-authored field markup, and invalid + indeterminate coverage                                                                                                                                                                                                      |
| Dialog          | 4             | B4            | DONE   | Shipped on 2026-03-10 with spec, Storybook, Radix compound exports, size presets, and Box-authored overlay/content wrappers                                                                                                                                                                                      |
| Drawer          | 4             | B4            | DONE   | Shipped on 2026-03-10 with spec, Storybook, compound exports, direction variants, and Box-authored shell layout on top of `vaul`                                                                                                                                                                                 |
| Input           | 4             | B4            | DONE   | Shipped on 2026-03-10 with spec, Storybook, normalized input modes, affix slots, clearable behavior, and Box-authored field markup                                                                                                                                                                               |
| Label           | 4             | B4            | DONE   | Shipped on 2026-03-10 with spec, Storybook, `htmlFor` association, tone states, and Box-authored markup on top of `@radix-ui/react-label`                                                                                                                                                                        |
| Pagination      | 4             | B4            | DONE   | Shipped on 2026-03-10 with spec, Storybook, compact page-range handling, first/prev/next/last controls, and optional page-size selector                                                                                                                                                                          |
| RadioGroup      | 4             | B4            | DONE   | Shipped on 2026-03-10 with spec, Storybook, compound item exports, Box-authored Radix radio semantics, and shared size + error support                                                                                                                                                                           |
| Select          | 4             | B4            | DONE   | Shipped on 2026-03-10 as the static single-select primitive; clearable reset support was added on 2026-03-11, and 2026-03-27 extended the shared surface with additive Radix-style compound exports while keeping the flat `options` API as the preferred default; searchable selection stays on `Combobox`, and multi-select stays out of this contract |
| Skeleton        | 4             | B4            | DONE   | Shipped on 2026-03-10 with spec, Storybook, Box-authored muted loading surfaces, and decorative-by-default accessibility behavior                                                                                                                                                                                |
| Spinner         | 4             | B4            | DONE   | Shipped on 2026-03-10 with spec, Storybook, Box-authored SVG track-and-arc motion, and inline + overlay loading coverage                                                                                                                                                                                                  |
| Switch          | 4             | B4            | DONE   | Shipped on 2026-03-10 with spec, Storybook, Radix-backed toggle semantics, shared size density, error-state support, and Box-authored control + label markup                                                                                                                                                     |
| Table           | 4             | B4            | DONE   | Shipped on 2026-03-10 with spec, Storybook, Box-authored semantic table wrappers, and selected-row-ready structure for future `DataTable` work                                                                                                                                                                   |
| Tabs            | 4             | B4            | DONE   | Shipped on 2026-03-10 with spec, Storybook, Radix compound exports, scrollable list support, and Box-authored tab triggers and panels                                                                                                                                                                            |
| Textarea        | 4             | B4            | DONE   | Shipped on 2026-03-10 with spec, Storybook, Box-authored multiline field markup, helper/error messaging, and clearable controlled/uncontrolled support                                                                                                                                                           |
| Breadcrumb      | 4             | B5.1          | DONE   | Shipped on 2026-03-11 with spec, Storybook, Box-authored semantic nav/list markup, optional `currentLabel`, custom separator support, and additive compound exports for legacy breadcrumb composition                                                                                                            |
| Calendar        | 4             | B5.1          | DONE   | Shipped on 2026-03-11 with spec, Storybook, typed single/multiple/range selection, disabled-date matchers, and Box-authored wrapper composition on top of `react-day-picker` + `date-fns`                                                                                                                        |
| DatePicker      | 4             | B5.1          | DONE   | Shipped on 2026-03-12 with spec, Storybook, Input-aligned variant/size shell, optional `formatDate` display override, min/max bounds, clearable value handling, and Box-authored field markup on top of `Calendar` + `Popover`                                                                                   |
| DropdownMenu    | 4             | B5.1          | DONE   | Shipped on 2026-03-11 with spec, Storybook, compound Radix menu exports, checkbox and submenu support, and Box-authored menu shells                                                                                                                                                                              |
| Form            | 4             | B5.1          | DONE   | Shipped on 2026-03-11 with spec, Storybook, RHF-aligned field composition, Box-authored form wrappers, and shared description/message wiring                                                                                                                                                                     |
| Popover         | 4             | B5.1          | DONE   | Shipped on 2026-03-12 with spec, Storybook, Radix-backed compound exports, controlled/uncontrolled open callbacks, and Box-authored content wrappers                                                                                                                                                             |
| Tooltip         | 4             | B5.1          | DONE   | Shipped on 2026-03-12 with spec, Storybook, Radix-backed compound exports, shared provider timing, and Box-authored content wrappers                                                                                                                                                                             |
| Avatar          | 4             | B5.2          | DONE   | Shipped on 2026-03-12 with spec, Storybook, Radix-backed image/fallback handling, shared size scale, and Box-authored root/image/fallback composition                                                                                                                                                            |
| Combobox        | 4             | B5.2          | DONE   | Shipped on 2026-03-12 with spec, Storybook, cmdk + Popover-backed searchable single-select behavior, loading/error support, and Box-authored wrappers around the documented cmdk DOM boundary; refined on 2026-03-26 with parent-owned search notifications plus a bounded create-on-enter contract for migration-safe async combobox adoption |
| DataTable       | 4             | B5.2          | DONE   | Shipped on 2026-03-13 and since realigned to the current contract: TanStack Table v8 composition, `DataTable` + `DataTableVirtualized` shells, exported `DataTablePagination`, Storybook-only control helpers, and Box-authored semantic table markup                                                            |
| DateRangePicker | 4             | B5.2          | DONE   | Shipped on 2026-03-13 with spec, Storybook, shared preset shortcuts, bounded two-month calendar composition, and Box-authored trigger + preset markup; extended on 2026-03-27 with generic `changeBehavior` support for complete-only parent commits without app-local adapters |
| FileUpload      | 4             | B5.2          | DONE   | Shipped on 2026-03-12, refined on 2026-03-17 with drag-active dropzone feedback and generic max-size validation, and extended on 2026-03-27 with `displayValue` support for externally supplied filename labels while transport stays local                                                                     |
| Image           | 4             | B5.2          | DONE   | Shipped on 2026-03-12 with spec, Storybook, Box-authored fallback composition, ratio + fit controls, and no `next/image` coupling                                                                                                                                                                                |
| NavigationMenu  | 4             | B5.2          | DONE   | Shipped on 2026-03-13 with spec, Storybook, Radix-backed compound exports, shared indicator + viewport support, and Box-authored wrappers while route trees stay local                                                                                                                                           |
| OtpInput        | 4             | B5.2          | DONE   | Shipped on 2026-03-12 with spec, Storybook, Box-authored segmented input slots, numeric sanitization, whole-code paste handling, and accessible error wiring                                                                                                                                                     |
| Accordion       | 4             | B5.3          | DONE   | Shipped on 2026-03-12 with spec, Storybook, Radix-backed compound exports, single + multiple disclosure modes, and Box-authored item, header, trigger, and content wrappers                                                                                                                                      |
| Command         | 4             | B5.3          | DONE   | Shipped on 2026-03-12 with spec, Storybook, cmdk-backed compound exports, shortcut/group coverage, and Box-authored helper wrappers with dialog composition delegated to shared `Dialog`                                                                                                                         |
| Menubar         | 4             | B5.4          | DONE   | Shipped on 2026-03-12 with spec, Storybook, Radix-backed compound exports, shared shortcut and submenu support, and Box-authored root, trigger, content, and item wrappers                                                                                                                                       |
| MonthPicker     | 4             | B5.4          | DONE   | Shipped on 2026-03-13 with spec, Storybook, first-of-month normalization, bounded year navigation, and Box-authored trigger, popover shell, and month-grid controls                                                                                                                                              |
| Timeline        | 4             | B5.4          | DONE   | Shipped on 2026-03-13 with spec, Storybook, shared orientation support, semantic marker tones, and Box-authored list + connector composition                                                                                                                                                                     |
| RichTextEditor  | 4             | Decision gate | DONE   | Shipped on 2026-03-16 with a bounded Tiptap contract, default sanitization, compact toolbar/link-editor hardening, shared tooltip shortcut coverage for supported actions, and explicit app-local exclusions for uploads, mentions, slash commands, media, viewer-specific rendering, and global shortcut policy |

