# 03 — Migration Plan & Batches

> **Phase:** Planning
> **Branch:** `feat/ui`
> **Run count:** Once
> **Prerequisite:** Phase 02 foundation complete (`packages/ui/docs/normalization/00-foundation.md` through `06-risk-register.md` exist)
> **Prev:** [02-design-system-foundation.md](./02-design-system-foundation.md) · **Next:** [04-build-shared-components.md](./04-build-shared-components.md)

---

## Purpose

Convert all per-app audits + the foundation into a single, executable, batch-based migration plan. This is the **program plan**: it defines what gets built in what order, which apps migrate in which batch, and what the verification gates are at each step.

---

## Deliverables

| File                                                                    | Description                                                            |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `packages/ui/docs/normalization/_output/10-cross-app-reconciliation.md` | Component overlap/conflict analysis, one canonical entry per component |
| `packages/ui/docs/normalization/_output/11-master-component-roadmap.md` | All components to build/extend, with spec requirements                 |
| `packages/ui/docs/normalization/_output/12-master-backlog.csv`          | Unified backlog (no cross-app duplicates)                              |
| `packages/ui/docs/normalization/_output/13-implementation-batches.md`   | Batch-by-batch execution plan (packages/ui build + per-app migration)  |

---

## Batch Structure (mandatory)

| Batch       | Scope                  | packages/ui changes                             | Branch work                                                                          | Can run in parallel?                                                         |
| ----------- | ---------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| **Batch 1** | `ADOPT_NOW`            | None — components exist                         | `migrate-app/<app>` only: swap imports                                               | ✅ All apps run Batch 1 in parallel                                          |
| **Batch 2** | `ADOPT_WITH_ADAPTER`   | Minimal — adapter guidance only                 | `migrate-app/<app>`: add local adapter wrappers                                      | ✅ All apps run Batch 2 in parallel                                          |
| **Batch 3** | `EXTEND_EXISTING`      | New variants/props added to existing components | `feat/ui` then `migrate-app/<app>`                                                   | ⚠️ `feat/ui` work is sequential; app work runs in parallel after             |
| **Batch 4** | `NEW_SHARED_COMPONENT` | New components built from scratch               | `feat/ui` (SDD lifecycle) then `migrate-app/<app>`                                   | ⚠️ Each new component is sequential on `feat/ui`; apps run in parallel after |
| **Batch 5** | Per-app stabilization  | None                                            | `migrate-app/<app>`: smoke test + stabilize                                          | ✅ All apps run Batch 5 in parallel                                          |
| **Batch 6** | Cleanup + deprecation  | Remove dead code from `packages/ui`             | `migrate-app/<app>`: delete dead local copies · `feat/ui`: remove deprecated exports | ✅ App cleanup in parallel; `feat/ui` cleanup is one-time at end             |

### Batch 3 vs Batch 4 Parallelism Rules

**Can Batch 3 and Batch 4 run simultaneously?**

> ✅ **YES — with conditions.** They both produce work on `feat/ui`, but on different components, so parallel work is safe if:
>
> 1. Each developer works on a **different component** (no two in-flight changes to the same component file)
> 2. Both branches off `feat/ui` main; short-lived feature branches merged via PR before apps consume the changes
> 3. `13-implementation-batches.md` explicitly lists which components are in-flight (status: `IN PROGRESS` / `DONE`) so there is no ambiguity
>
> ⛔ **Do NOT start Batch 4 component build if Batch 3 is extending the same component** (e.g., cannot add `Select.Async` variant in Batch 3 while Batch 4 is rebuilding `Select` from scratch). Coordinate in `13-implementation-batches.md`.

---

## Phase Prompt

```md
You are a Principal Program Architect for UI platform migration on branch `feat/ui`.

## Objective

Convert all per-app audits and the Phase 02 foundation into one executable
enterprise migration program plan.

## Inputs (all must be read first)

- `packages/ui/docs/normalization/00-foundation.md`
- `packages/ui/docs/normalization/01-component-taxonomy.md`
- `packages/ui/docs/normalization/02-api-conventions.md`
- `packages/ui/docs/normalization/03-token-theming-contract.md`
- `packages/ui/docs/normalization/04-shared-vs-local-boundary.md`
- `packages/ui/docs/normalization/05-coverage-baseline.md`
- `packages/ui/docs/normalization/06-risk-register.md`
- ALL `apps/*/docs/migration/component/_output/_audit-report.md`
- ALL `apps/*/docs/migration/component/_output/_component-backlog.csv`
- ALL `apps/*/docs/migration/component/_output/_parity-checklist.md`

## Required Output: `10-cross-app-reconciliation.md`

For each unique component need across all apps:
```

### ComponentName

- **Classification:** (final ruling: ADOPT_NOW / EXTEND / NEW / LOCAL)
- **Apps that need it:** [list]
- **Current @repo/ui status:** exists | missing | partial
- **Canonical API:** (reference 02-api-conventions.md section)
- **Cross-app conflicts resolved:** [how any API conflicts between apps were resolved]
- **Priority:** P0 / P1 / P2 / P3
- **Risk:** HIGH / MEDIUM / LOW
- **Target batch:** 1 / 2 / 3 / 4

```

## Required Output: `11-master-component-roadmap.md`
For each component to build or extend in packages/ui:

```

### ComponentName (Batch 4 example)

- **Tier:** 1 (Primitive) / 2 (Composite)
- **Based on:** (Radix primitive / other component / none)
- **API:** (canonical props from 02-api-conventions.md)
- **New dependencies needed:** (e.g., @radix-ui/react-dropdown-menu)
- **SDD requirements:**
  - Spec doc: ComponentName.spec.md
  - Stories: Default, AllVariants, AllSizes, LoadingState, DisabledState, ErrorState
- **Consumer apps:** [list]
- **Effort estimate:** XS / S / M / L / XL

```

## Required Output: `12-master-backlog.csv`
Merge ALL per-app component-backlog.csv files. Deduplicate by component_name.
Columns:
```

component_name,final_classification,batch,priority,risk_level,effort,consumer_apps,repo_ui_status,spec_required,migration_complexity

```
- `consumer_apps`: pipe-separated list of all apps that need this component
- `repo_ui_status`: exists | missing | partial
- `spec_required`: yes | no

## Required Output: `13-implementation-batches.md`
For each batch (1 through 6):

```

## Batch 1 — ADOPT_NOW

### Scope

Components in @repo/ui that apps can use today with zero changes.
Total: N components.

### packages/ui Work Required

None. (Or: minimal — run check to confirm existing components pass current foundation API standards)

### Per-App Work (Phase 05)

Each app updates imports from local path to `@repo/ui`.

### Verification Gate

Per app:

- [ ] `pnpm --filter <app> check-types` passes
- [ ] `pnpm --filter <app> lint` passes
- [ ] `pnpm --filter <app> build` passes
- [ ] Smoke routes pass (list provided per app)

### Apps × Components Matrix

| App | Components to adopt | Count |
|[app-name] | [list] | N |

---

## Batch 2 — ADOPT_WITH_ADAPTER

### Scope

Components that exist in @repo/ui but have API mismatches requiring a thin local adapter in each app.
Total: N components.

### packages/ui Work Required

Minimal. Update `packages/ui/docs/normalization/_output/21-adapter-mapping.md` with canonical API
for each component so apps know what interface to adapt to.

### Per-App Work (Phase 05)

For each component:

1. Create adapter at `apps/<APP_NAME>/src/components/ui/adapted/<ComponentName>.tsx`
2. Update all usage sites to import from the adapter (not directly from @repo/ui)
3. Delete the old local component file after all imports updated

### Verification Gate

Per app:

- [ ] `pnpm --filter <app> check-types` passes
- [ ] `pnpm --filter <app> lint` passes
- [ ] `pnpm --filter <app> build` passes
- [ ] All original prop usages compile via adapter (no TypeScript errors at usage sites)
- [ ] No behavioral change at any usage site

### Apps × Components Matrix

| App | Components needing adapter | API delta | Count |
| [app-name] | [list] | [prop mapping] | N |

---

## Batch 3 — EXTEND_EXISTING

### Scope

Components that exist in @repo/ui but are missing variants, props, or sizes.
Total: N components extended.

### packages/ui Work Required

For each component to extend, apply SDD:

1. Update spec (`<ComponentName>.spec.md`) with new variants/props
2. Add stories for new cases (Storybook RED state OK)
3. Implement changes in `<ComponentName>.tsx` (make Storybook GREEN)
4. Update `index.ts` if new types exported
5. Run packages/ui verification gate before apps consume

### Per-App Work (Phase 05)

After packages/ui ships the extension, each app consuming the extended component:

- Updates its `EXTEND_EXISTING` items to use the new @repo/ui API
- Deletes local override if one existed

### Verification Gate

`packages/ui` gate (must pass before any app migration):

- [ ] `pnpm --filter @repo/ui check-types` passes
- [ ] `pnpm --filter @repo/ui lint` passes
- [ ] `pnpm --filter @repo/ui build` passes
- [ ] Storybook renders new stories without errors

Per app (after packages/ui gate):

- [ ] `pnpm --filter <app> check-types` passes
- [ ] `pnpm --filter <app> lint` passes
- [ ] `pnpm --filter <app> build` passes

### Components to Extend

| Component | Extension needed | Priority | Consumer apps |
| [name] | [new variant/prop] | P0/P1/P2 | [list] |

---

## Batch 4 — NEW_SHARED_COMPONENT (within Batch 4, process SDD order)

For each new component:

1. Write ComponentName.spec.md
2. Write ComponentName.stories.tsx (Storybook RED state OK)
3. Get spec reviewed (team sign-off)
4. Implement ComponentName.tsx (make Storybook GREEN)
5. Export from packages/ui/src/index.ts
6. packages/ui verification gate
7. Apps migrate (Phase 05 for Batch 4 items)

### New Components Roadmap

| Component | Tier | Priority | Consumer apps | Effort | Status |
| [name] | 1/2 | P0/P1/P2 | [list] | XS-XL | TODO/IN PROGRESS/DONE |

---

## Batch 5 — Per-App Stabilization

### Scope

Full smoke test and stabilization of the entire app after Batches 1–4 complete.
Run once per app after all batch work for that app is done.

### packages/ui Work Required

None.

### Per-App Work (Phase 05 Batch 5)

1. Run full verification gate (typecheck, lint, build)
2. Run all smoke routes from `_parity-checklist.md`
3. Resolve any deferred items from earlier batches
4. Mark all parity checklist items ✅ PASS or ⚠️ DOCUMENTED EXCEPTION
5. Clear all `Post-Migration Improvement Candidates` entries (document, don't act)

### Verification Gate

Per app:

- [ ] `pnpm --filter <app> check-types` passes
- [ ] `pnpm --filter <app> lint` passes
- [ ] `pnpm --filter <app> build` passes
- [ ] All items in `_parity-checklist.md` are ✅ or have documented exception
- [ ] No unreviewed adapter wrappers remain
- [ ] `_migration-log.md` complete (every component has a status entry)

---

## Batch 6 — Cleanup + Deprecation

### Scope

Remove all confirmed-replaced local duplicates from apps and dead exports from packages/ui.
Run per app on `migrate-app/<app>` + one final pass on `feat/ui`.

### packages/ui Work Required

After ALL apps complete Phase 07:

- Identify exports in `packages/ui/src/index.ts` with zero usages across all apps
- Apply zero-usage policy (see `07-cleanup.md`)
- Remove deprecated exports as agreed in deprecation map

### Per-App Work (Phase 07)

- Delete confirmed-replaced local component files
- Remove dead adapters (where API gap is now closed)
- Sanitize barrel `index.ts` files
- Run `ripgrep` zero-usage checks before each deletion

### Verification Gate

Per app:

- [ ] `pnpm --filter <app> check-types` passes
- [ ] `pnpm --filter <app> lint` passes
- [ ] `pnpm --filter <app> build` passes
- [ ] Zero replaced duplicates remain without documented reason

```

## Acceptance Criteria
- Master backlog has zero duplicate component entries
- Every per-app backlog item maps to exactly one batch + master backlog row
- Batches are ordered: lowest risk → highest risk
- Every batch has explicit verification gates
- Critical path identified (which batch blocks the most apps)

> [!IMPORTANT]
> **Phase gate — do NOT proceed to Phase 04 until:**
> - `13-implementation-batches.md` has been reviewed and approved by the team (all batch templates filled, no TODO entries in critical path)
> - `11-master-component-roadmap.md` has been shared with all app teams (each app team knows what is coming in Batch 3/4)
> - `12-master-backlog.csv` has zero rows with empty `batch` or `priority` columns
> - At least one team member outside the architect role has read and understood `00-foundation.md`
```

---

## After Completing Phase 03

1. Commit all planning docs to `feat/ui`
2. Share `13-implementation-batches.md` with all app teams
3. Begin Phase 04 starting with Batch 1 (or Batch 3/4 in parallel if resources allow)
4. Proceed to [04-build-shared-components.md](./04-build-shared-components.md)

---

_Related: [02-design-system-foundation.md](./02-design-system-foundation.md) · [04-build-shared-components.md](./04-build-shared-components.md) · [05-app-migration.md](./05-app-migration.md)_
