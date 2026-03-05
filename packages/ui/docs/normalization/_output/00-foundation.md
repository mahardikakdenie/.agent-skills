# Batch 2 Foundation (Refreshed)

## Run Context
- Run date: 2026-03-05
- Prompt source selected: `migrate-app_admin-portal/apps/admin-portal/docs/migration/component/migration-batch-prompts.md` (section: Batch 2)
- Execution branch context: `feat/ui`
- Per-app inputs loaded: `packages/ui/docs/normalization/per-app/*_baseline-summary.md` (27 files)
- Current `@repo/ui` code surface: `packages/ui/src` currently exports `Box`

## Objective Lock
This document is the governance baseline for Batch 3 to Batch 5.
All implementation decisions in `packages/ui` must follow this foundation.

## Governing Principles
1. App-agnostic only: no import from `apps/*` in `packages/ui`.
2. Canonical API first: one API per component family, no sibling duplication.
3. Spec-first and Storybook-first: spec and stories are mandatory before rollout.
4. Accessibility baseline mandatory: keyboard, focus-visible, ARIA semantics.
5. Token-first styling: shared components use semantic tokens only.
6. Adapter allowed only for migration period; canonical API stays stable.

## Shared Package Contracts
- `@repo/ui`: reusable UI contracts and components only.
- `@repo/config`: semantic token source of truth.
- `@repo/helper`: app-agnostic utility helpers only.
- `@repo/interface`: shared cross-app interfaces only.

## Locked Consolidation Decisions
1. Overlay family normalized to `Dialog` and `Drawer`.
2. `Input*` variants normalized into one canonical `Input` contract.
3. `Select*` variants normalized into one canonical `Select` family.
4. Flash/error/notification patterns normalized into `Alert` family.
5. Domain route/page containers remain app-local.

## Review Gate (Must Pass)
- API follows `02-api-conventions.md`
- Token usage follows `03-token-theming-contract.md`
- Boundary classification follows `04-shared-vs-local-boundary.md`
- Coverage row tracked in `05-coverage-baseline.md`
- Risk tracked in `06-risk-register.md`

## Breaking Change Policy
After this refresh is committed, changing canonical prop names, variant values,
component tier assignment, or token keys requires Foundation Amendment review.