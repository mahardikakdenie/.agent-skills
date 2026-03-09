# Legacy Repo Update Routines (Component Migration)

> **Purpose:** Defines the routines and workflows for handling legacy repo updates via `git subtree pull` during the component UI migration. Ensures `migrate-app/<APP_NAME>` stays synchronized with legacy changes while protecting all migration work in progress.

---

## Related Documents

- `apps/<APP_NAME>/docs/migration/component/00-overview.md` - Branch model & integrate/\* contract
- `apps/<APP_NAME>/docs/migration/component/01-app-audit.md` - Component audit (classification reference)
- `apps/<APP_NAME>/docs/migration/component/05-app-migration.md` - Per-app migration batches
- `apps/<APP_NAME>/docs/migration/component/06-component-standards.md` - Normalization reference
- `apps/<APP_NAME>/docs/migration/component/legacy-update-integration-guide.md` - Quick reference & decision tree
- `apps/<APP_NAME>/docs/migration/component/legacy-update-batch-prompts.md` - Copy-paste AI prompts (standalone)
- `apps/<APP_NAME>/docs/migration/component/migration-batch-prompts.md` - **Preferred:** AI-native L1-L6 prompts integrated into the master execution file (use this for AI-assisted workflows)
- `apps/<APP_NAME>/docs/migration/component/legacy-updates/` - Per-update timestamped logs
- `apps/<APP_NAME>/docs/migration/verification-gate.md` - App-specific verification commands (typecheck/lint/build/test)

---

## Overview

### Context

During component migration, each app maintains two branch types:

- **`integrate/<APP_NAME>`** - Read-only baseline (1:1 copy of legacy repo via `git subtree pull`)
- **`migrate-app/<APP_NAME>`** - Work/migration branch where component refactoring happens

**Key principle:** `integrate/<APP_NAME>` is never locally modified. Subtree pulls to it will **never conflict**. Conflicts only surface when merging `integrate/<APP_NAME>` -> `migrate-app/<APP_NAME>`.

> [!IMPORTANT]
> All legacy update documentation and component migration work happens on `migrate-app/<APP_NAME>`, NOT on `integrate/<APP_NAME>`.

### Goals

1. **Synchronization** - Keep `migrate-app/<APP_NAME>` current with legacy repo changes
2. **Migration protection** - Preserve completed batch work (migrated component imports, deleted local copies)
3. **Conflict resolution** - Resolve merge conflicts systematically by component migration status
4. **New component intake** - Route new legacy components through the correct packages/ui intake path

### When to Apply These Routines

Legacy update routines can be applied at **any point** during component migration:

| Current Migration Phase                      | Risk Level | Approach                                                                                                                                    |
| -------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Before Batch 1** (migration not started)   | Low     | Direct integration - nothing migrated yet                                                                                                   |
| **During Batch 1.5** (SoC split in progress) | Medium  | Finish current component split commit first -> then integrate -> re-run SoC evaluation on any new legacy components before resuming Batch 1.5 |
| **During Batch 1/2** (import swaps)          | Medium  | Pause -> Update -> Verify import changes still valid                                                                                          |
| **During Batch 3/4** (extend/new build)      | Medium  | Pause -> Update -> Check if legacy added components that overlap with in-progress packages/ui work                                            |
| **After Batch 5/6** (stabilized/cleanup)     |  High    | Must use incremental intake for new legacy components                                                                                       |

---

## Routine Overview

```mermaid
flowchart TD
    A[Legacy Repo Updated] --> B[Routine 1: Subtree Pull -> integrate/<APP_NAME>]
    B --> C[Push integrate/<APP_NAME>]
    C --> D[Routine 2: Merge integrate/<APP_NAME> -> migrate-app/<APP_NAME>]
    D --> E{Conflicts?}
    E -->|No| F[Routine 4: Analyze Changes]
    E -->|Yes| G[Routine 3: Resolve Conflicts by Category]
    G --> F
    F --> H{New components in legacy?}
    H -->|No - config/style/asset changes only| I[Routine 4.3: Apply non-component adjustments]
    H -->|Yes - new component files| J{Already classified in _audit-report.md?}
    J -->|KEEP_APP_LOCAL| K[Routine 4.4: Accept theirs, keep app-local]
    J -->|Candidate for @repo/ui| L[Routine 5: packages/ui Intake]
    J -->|Unknown| M[Classify now - check 01-app-audit.md criteria]
    M --> J
    I --> N[Routine 6: Verify + Document]
    K --> N
    L --> N
    N --> O{Pass?}
    O -->|Yes| P[Complete]
    O -->|No| Q[Fix -> re-run verification]
    Q --> N
```bash

---

## Routine 1: Subtree Pull to `integrate/<APP_NAME>` (Baseline Update)

### Objective

Pull latest legacy repo changes into the read-only mirror branch. Always conflict-free.

### Steps

```bash
# 1. Switch to read-only mirror branch
git checkout integrate/<APP_NAME>

# 2. Pull from legacy remote
git subtree pull --prefix=<APP_PATH> <LEGACY_REMOTE> <LEGACY_BRANCH>
# Expected: clean merge - no conflicts possible here

# 3. Push updated mirror
git push origin integrate/<APP_NAME>

# 4. Return to work branch
git checkout migrate-app/<APP_NAME>
```

### Outcome

`integrate/<APP_NAME>` is now 1:1 with the latest legacy commit. Ready for Routine 2.

---

## Routine 2: Merge `integrate/<APP_NAME>` -> `migrate-app/<APP_NAME>`

### Objective

Bring legacy changes into the migration work branch. Conflicts may occur here.

### Steps

```bash
git checkout migrate-app/<APP_NAME>
git merge integrate/<APP_NAME>
```bash

### If No Conflicts

```bash
git push origin migrate-app/<APP_NAME>
# Proceed to Routine 4 (Analyze Changes)
```

### If Conflicts

Stop. Do NOT force-push or guess resolutions. Proceed to **Routine 3**.

### Merge Health Check (MHC) - Run in Both Cases

> [!IMPORTANT]
> Run this **immediately after merge** (whether or not there were conflicts), before any further code changes. This catches merge-introduced build/type breakages early.

```bash
# Must pass before proceeding to Routine 3 or 4
pnpm --filter <APP_PACKAGE_NAME> check-types
pnpm --filter <APP_PACKAGE_NAME> build
```md

**If MHC fails:**
- Identify whether the failure is merge-introduced or pre-existing
- Fix narrowly (conflicted files only), then re-run MHC
- If failure cannot be safely resolved -> `git merge --abort`, document, plan alternative

---

## Routine 3: Conflict Resolution by Component Category

### Classification Guide

For each conflicted file, assign exactly one category:

| Category                   | Indicators                                                                                               | Resolution Strategy                                                                                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Migrated component**     | In `_migration-log.md` as DONE; imports use `@repo/ui`                                                    | `git checkout --ours <file>`                                                                                                                                                       |
| **MIGRATE_AFTER_SPLIT**    | In `_audit-report.md` with `Classification: MIGRATE_AFTER_SPLIT`; Batch 1.5 not yet run                  | `git checkout --theirs <file>` - treat as non-migrated. **Do NOT remove the `MIGRATE_AFTER_SPLIT` flag from _audit-report.md.** Re-run SoC evaluation in Routine 4 after merge stabilizes. |
| **Non-migrated component** | Not in _migration-log.md; still uses local imports or old service patterns                                | `git checkout --theirs <file>`                                                                                                                                                     |
| **In-progress batch item** | In _migration-log.md as IN PROGRESS                                                                       | Manually merge - keep ours base, apply legacy additions only                                                                                                                       |
| **Shared infrastructure**  | `packages/config/**`, `packages/helper/**`, `packages/typescript-config/**`, `packages/eslint-config/**` | Manually merge both - prefer ours for migration-specific additions                                                                                                                 |
| **App configuration**      | `package.json`, `tsconfig.json`, `tailwind.config.*`, `.env.example`, `vite.config.*`                    | Manually merge - apply new deps/settings, keep migration overrides                                                                                                                 |
| **Static assets**          | Images, fonts, icons in `public/` or `assets/`                                                           | `git checkout --theirs <file>` unless we intentionally replaced                                                                                                                    |
| **New file (no conflict)** | Git reports as "added by them"                                                                           | Accept automatically - classify in next routine                                                                                                                                    |

### Decision Flow

```
Is the file listed in _migration-log.md?
  YES, Status=DONE     -> OUR version (we own this file now)
  YES, Status=IN PROG  -> Manual merge
  NO                   -> Check if file is in packages/* -> Manual merge
                         Otherwise -> THEIR version (legacy owns it until we migrate)
```bash

### Commit After Resolution

```bash
git add .
git commit -m "chore: merge integrate/<APP_NAME> to migrate-app/<APP_NAME> - resolve component conflicts"
git push origin migrate-app/<APP_NAME>
```

---

## Routine 4: Analyze Changes

### Objective

Understand what changed in the legacy update and determine what action is needed.

### 4.1 Identify What Changed

```bash
# View legacy commits since last update
git log integrate/<APP_NAME>~5..integrate/<APP_NAME> --oneline

# View changed files
git diff migrate-app/<APP_NAME>..integrate/<APP_NAME> --name-only
```md

### 4.3 Backward-Compatibility Constraint

> [!IMPORTANT]
> **All changes in this routine must maintain backward compatibility.** No change introduced by a legacy update is permitted to break current app behavior or break existing consumers of migrated outputs:

- **No component prop API changes for existing callers** - added props must be optional; removing props requires migration notice
- **No removal of existing exports from `@repo/ui`** - deprecate first if removal is planned
- **No type narrowing** - widening exported types is OK; narrowing is NOT unless every consumer is verified
- **No hook signature changes** - if the service track has refactored hooks, legacy updates must not alter their `queryKey` or `queryFn` contracts

If a legacy update introduces a change that CANNOT be applied without a breaking change, document it in the update log under `## Breaking Changes (Escalated)` and raise with the team before merging to `migrate-app/`.

### 4.4 Categorize Changes

For each changed file, determine:

| Change Type                                | Examples                                                | Action Needed                               |
| ------------------------------------------ | ------------------------------------------------------- | ------------------------------------------- |
| New component file added in legacy         | New `.tsx` in `src/components/`                         | Classify -> Routine 5 or Routine 4.4         |
| Existing component modified (non-migrated) | UI update in component we haven't touched               | Accept theirs - already done in Routine 3   |
| Existing component modified (migrated)     | Legacy changed a component we already moved to @repo/ui | Review delta - may need packages/ui update  |
| Config/dependency change                   | `package.json`, `tsconfig`, `tailwind.config`           | Routine 4.3 - apply carefully               |
| Style-only change                          | CSS, global styles                                      | Accept theirs unless we own the file        |
| Asset change                               | `public/**`, images                                     | Accept theirs unless intentionally replaced |

### 4.3 Apply Non-Component Adjustments

For config, dependency, and style changes:

1. **New dependencies** - run `pnpm install` if `package.json` changed
2. **Tailwind config changes** - verify design tokens still align with `06-component-standards.md`
3. **tsconfig changes** - verify path aliases still resolve correctly
4. **Global CSS changes** - verify CSS variables still match `@repo/ui` token contract
5. **Asset changes** - accept theirs, update any component references if filenames changed

### 4.4 New App-Local Components (KEEP_APP_LOCAL)

If legacy added a new component that belongs to app-local (domain form, table config, page layout):

1. Conflict already resolved via `--theirs` in Routine 3
2. **Universal SoC Evaluation** - before finalizing the audit entry, run the monolith check per [06-component-standards.md Section 6.2](./06-component-standards.md#62-universal-soc-evaluation):
   - Is monolith? (data hook + display JSX / domain types in JSX / business logic in render)
   - Rate SoC potential: `HIGH | MEDIUM | LOW | NONE`
   - Identify SoC strategy: `container-shell | prop-injection | render-prop | hook-extraction | none`
   - Set `Batch 1.5 candidate: YES` if HIGH or MEDIUM -> classification becomes `MIGRATE_AFTER_SPLIT` (not `KEEP_APP_LOCAL` yet)
3. Add entry to `_audit-report.md` with all SoC fields populated (`Is monolith`, `SoC potential`, `SoC strategy`, `Batch 1.5 candidate`)
4. Update `_component-backlog.csv` - `batch = N/A` if `Batch 1.5 candidate: NO`; `batch = 1.5` if YES
5. If `Batch 1.5 candidate: YES` - add to Batch 1.5 queue; final classification (Shell + Container) determined after split

### 4.5 Create Update Log

Before proceeding:

```bash
# Create legacy-updates directory if needed
mkdir -p <APP_PATH>/docs/migration/component/legacy-updates
```

Create `<APP_PATH>/docs/migration/component/legacy-updates/legacy-update-YYYYMMDD-HHMMSS.md` with:

- Legacy commit SHA
- List of changes by category
- Current batch position
- Recommended next routine

---

## Routine 5: New Shared Component Intake

Use when legacy added a component that qualifies as a `NEW_SHARED_COMPONENT` or `EXTEND_EXISTING` candidate.

### 5.1 Assess Against Classification Criteria

```txt
From 06-component-standards.md Shared-vs-Local Boundary:

Is it purely visual (no API calls, no domain types)?
  YES -> Is it used (or likely needed) by 2+ apps?
    YES -> NEW_SHARED_COMPONENT or EXTEND_EXISTING candidate
    NO  -> KEEP_APP_LOCAL
  NO  -> KEEP_APP_LOCAL
```

### 5.2 For Each Confirmed packages/ui Candidate

**Option A - Extends an existing @repo/ui component** (EXTEND_EXISTING):

1. Note the missing variant/prop required
2. Add to `_spec-input.md` - document the API gap
3. Open packages/ui work on `feat/ui` following `04-build-shared-components.md` Batch 3 process
4. On `migrate-app/<APP_NAME>`: keep the legacy file temporarily until packages/ui has the extension
5. Once packages/ui ships the extension -> follow Batch 3 migration steps in `05-app-migration.md`

**Option B - Genuinely new component** (NEW_SHARED_COMPONENT):

1. Add to `_spec-input.md` - document visual spec, variants, states, accessibility requirements
2. Add to `_component-backlog.csv` with batch = 4
3. Flag for `feat/ui` packages/ui intake (SDD lifecycle in `04-build-shared-components.md`)
4. Keep legacy file in app until packages/ui ships it
5. Once packages/ui ships -> migrate via Batch 4 steps in `05-app-migration.md`

### 5.3 Document in Update Log

Add to `legacy-update-YYYYMMDD-HHMMSS.md`:

- Component name, file path
- Classification decision and rationale
- Expected packages/ui batch (3 or 4)
- Whether _spec-input.md was updated

---

## Routine 6: Verify + Document

### 6.1 Run Verification Gate

> [!IMPORTANT]
> Verification commands are defined per-app at `apps/<APP_NAME>/docs/migration/verification-gate.md`.
> Always read that file first to get the exact commands for this app.

```bash
# On migrate-app/<APP_NAME> - use exact commands from verification-gate.md
pnpm --filter <APP_PACKAGE_NAME> check-types
pnpm --filter <APP_PACKAGE_NAME> lint
pnpm --filter <APP_PACKAGE_NAME> build

# If Batch 3/4 items exist in packages/ui
pnpm --filter @repo/ui build
pnpm storybook:build   # verify no story regressions
```bash

### 6.2 Verify Migration-Locked Files

For every component in `_migration-log.md` with status DONE:

- [ ] Import still resolves to `@repo/ui` (not accidentally reverted to local)
- [ ] No local duplicate re-appeared from legacy merge
- [ ] Prop API at usage sites still compiles

### 6.3 If Verification Fails

**Typecheck/lint errors:**

- Fix narrowly in the affected file
- Do not refactor unrelated code
- Re-run verification gate

**Migrated component reverted (critical):**

- `git checkout HEAD <file>` to restore our migration
- Re-run verification

**Critical Failure (cannot recover without risk):**

```bash
# Rollback migrate-app/<APP_NAME> to pre-merge state
git reset --hard <commit-before-merge>
git push -f origin migrate-app/<APP_NAME>
# Document rollback in legacy-update-YYYYMMDD-HHMMSS.md
# Notify team - plan alternative approach
```

### 6.4 Complete the Update Log

Fill in `legacy-update-YYYYMMDD-HHMMSS.md`:

- Final verification results (command outputs)
- Actions taken
- Components affected (migrated vs non-migrated)
- New packages/ui intake items queued (if any)
- Current batch position (e.g., "Batch 1 complete, Batch 2 in progress")
- Next steps

---

## Checklist: Before Running Update Routines

- [ ] Legacy repo has new commits to pull
- [ ] Working tree is clean (`git status` clear)
- [ ] Current batch step is at a safe stopping point (not mid-component)
- [ ] `_migration-log.md` is up to date (know which components have Status=DONE)
- [ ] Git subtree remote configured correctly
- [ ] `_audit-report.md` accessible for classification decisions

---

## Template: `legacy-update-YYYYMMDD-HHMMSS.md`

Create a separate file per update at:
`<APP_PATH>/docs/migration/component/legacy-updates/legacy-update-YYYYMMDD-HHMMSS.md`

```markdown
# Legacy Update - <APP_NAME> - YYYY-MM-DD HH:MM:SS

## Legacy Repo Commit

- **Commit:** `<sha>`
- **Date:** `<date>`
- **Summary:** <what changed at a high level>

## Integration Status

- **Subtree pull:** Success
- **Merge to migrate-app/<APP_NAME>:** OK Clean / WARN Conflicts resolved (N files)
- **Merge Health Check (MHC):** typecheck + build passed after merge
- **Routines used:** <list, e.g., Routine 1 -> 2 -> 3 -> 4 -> 6>

## Changes Identified

- **New component files:** <list or "None">
- **Modified components (non-migrated):** <list or "None">
- **Modified components (MIGRATE_AFTER_SPLIT - re-evaluated):** <list or "None">
- **Modified components (migrated - review needed):** <list or "None">
- **Config/dependency changes:** <list or "None">
- **Asset changes:** <list or "None">
- **packages/ui intake candidates:** <list or "None">
- **New Batch 1.5 candidates (from legacy):** <list or "None">

## Conflict Resolution Summary

| File                  | Category     | Strategy   |
| --------------------- | ------------ | ---------- |
| src/components/XX.tsx | Migrated     | `--ours`   |
| src/components/YY.tsx | Non-migrated | `--theirs` |

## Actions Taken

- <action 1>
- <action 2>

## packages/ui Intake Items (if any)

| Component | Type                 | Action                                           |
| --------- | -------------------- | ------------------------------------------------ |
| <name>    | EXTEND_EXISTING      | Added to _spec-input.md, Batch 3 queued           |
| <name>    | NEW_SHARED_COMPONENT | Added to _spec-input.md + backlog, Batch 4 queued |

## Verification Results

- **Typecheck:** OK/FAIL
- **Lint:** OK/FAIL
- **Build:** OK/FAIL
- **Storybook (if applicable):** OK/FAIL/N/A
- **Migrated component check:** All DONE imports still resolve to @repo/ui

## Current Migration Status

- **Batch position (component track):** <e.g., "Batch 1 complete, Batch 2 3/7 done">
- **Batch position (service track):** <e.g., "Batch 5 complete - all hooks done" or "N/A - not started">
- **Cross-track impact:** <"None" or describe what was affected in the service track>
- **Batch 1.5 status:** Pending | In Progress | Complete | N/A
- **Batch 1.5 candidates affected by this update:** <list or "None">
- **Components DONE:** <count>
- **Components IN PROGRESS:** <count or "none">
- **Components MIGRATE_AFTER_SPLIT (Batch 1.5 pending):** <count or "none">

## Next Steps

- <next step>
```txt

---

_Related: [legacy-update-integration-guide.md](./legacy-update-integration-guide.md) - [legacy-update-batch-prompts.md](./legacy-update-batch-prompts.md) - [00-overview.md](./00-overview.md)_
