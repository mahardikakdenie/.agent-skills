# Batch 2 Foundation

## Scope

This foundation is locked for Batch 2 and governs all Batch 3-5 work on `feat/ui`.

Inputs reconciled before writing this foundation:
- Canonical prompt section: `## Batch 2 - Design System Foundation (Phase 02)` from `migration-batch-prompts.md`
- Batch 2 source coordination docs:
  - `packages/ui/docs/normalization/_batch2/source-map.md`
  - `packages/ui/docs/normalization/_batch2/batch2-ready-prompt.md`
- All per-app baselines: `packages/ui/docs/normalization/per-app/*_baseline-summary.md` (27 apps)
- All mapped app standards/docs from source map (`02-design-system-foundation.md` and `06-component-standards.md`)
- Current shared package state:
  - `packages/ui/src/**`
  - `packages/config/**`
  - `packages/helper/**`
  - `packages/interface/**`

## Current-State Snapshot

- `@repo/ui` currently exports only `Box` from `packages/ui/src`.
- Cross-app demand rows (`NEW_SHARED_COMPONENT` + `EXTEND_EXISTING` + `MIGRATE_AFTER_SPLIT`): **705**.
- After consolidation pass (standards section 6.3):
  - **506** rows mapped into **37 canonical shared components**.
  - **199** rows ruled local/deferred (domain-coupled or wrapper-only noise).
- Coverage baseline for shared components:
  - Needed canonical set: **38** (includes `Box`)
  - Existing in `@repo/ui`: **1** (`Box`)
  - To build/extend in later batches: **37**

## Governing Principles

1. App-agnostic contract only.
   - `packages/ui` must not import from `apps/*`, app services, app routes, app env vars, or app domain models.
2. Consolidate first, never clone siblings.
   - Any candidates differing by <= 2 presentational props/slots are merged into one canonical component API.
3. Canonical API names are mandatory.
   - `variant`, `size`, `disabled`, `loading`, `error`, `onChange`, `onOpenChange`, `className` are standard names.
4. Spec-first and Storybook-first.
   - Every shared component requires a spec and story coverage before implementation acceptance.
5. Accessibility baseline is non-negotiable.
   - Keyboard support, focus visibility, ARIA correctness, and parity checks are required.
6. Token-first styling.
   - Shared components consume semantic CSS variables only; no hardcoded app colors.
7. Backward compatibility path.
   - Non-canonical app APIs migrate via adapters; canonical API in `@repo/ui` remains stable.

## Shared Package Contracts

### `@repo/ui`
- Owner of reusable, app-agnostic React UI contracts.
- Exports named components only.
- Uses canonical component API rules in `02-api-conventions.md`.

### `@repo/config`
- Owner of token source consumed by apps and `@repo/ui`.
- Must evolve from current palette-only Tailwind setup to semantic design tokens required in `03-token-theming-contract.md`.

### `@repo/helper`
- Reserved for shared non-UI utilities.
- Current package surface is empty; additions must remain app-agnostic.

### `@repo/interface`
- Reserved for shared TypeScript interfaces.
- Current package surface is empty; add only cross-app shared, non-UI domain interfaces.

## Foundation Review Gates

A component/foundation change is accepted only when all are true:
- Canonical API matches `02-api-conventions.md`
- Token usage matches `03-token-theming-contract.md`
- Shared-vs-local decision is justified by `04-shared-vs-local-boundary.md`
- Coverage row is tracked in `05-coverage-baseline.md`
- Risk handling is logged in `06-risk-register.md`

## Breaking Change Policy

Once this foundation is committed, these are breaking if changed without amendment:
- Canonical prop names
- Canonical variant values
- Tier assignment for canonical components
- Token names used by shared components

Required process for foundation-breaking changes:
1. Foundation Amendment PR with rationale and migration impact.
2. Approval from design-system owners plus affected app leads.
3. Adapter and migration plan attached before merge.

## Reconciliation Decisions Locked in Batch 2

1. Modal/Dialog/BottomSheet/Drewer variants are consolidated into `Dialog` + `Drawer` only.
2. Input family (`Input*`) remains one canonical `Input` API with typed modes.
3. `Select`, `SelectAutocomplete`, `SelectPhoneCode`, and `MultiSelect` are one `Select` family contract.
4. Feedback wrappers (`ErrorContent`, `FlashMessage`, `Notification`) are consolidated under `Alert` family policy.
5. `Chart`, `AuthShell`, and route/domain workflow shells remain app-local unless future cross-app evidence changes.
