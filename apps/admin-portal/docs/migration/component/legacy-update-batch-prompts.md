# Legacy Update Batch Prompts (Component Migration)

> [!IMPORTANT]
> **Preferred Workflow:** If you are running an AI-assisted migration, use **L1–L6 batches inside [`migration-batch-prompts.md`](./migration-batch-prompts.md)** instead of this file. The L1–L6 prompts there are integrated into the master execution flow, include richer skill suggestions, and reference the correct verification commands.
>
> **This file** is retained as a **standalone reference** for developers who want to run legacy update prompts independently of the master execution file, or for reviewing the prompt logic in isolation.

---

## Related Documents

- `<APP_PATH>/docs/migration/component/legacy-update-routines.md` — Full routine details
- `<APP_PATH>/docs/migration/component/legacy-update-integration-guide.md` — Decision tree & quick reference
- **`<APP_PATH>/docs/migration/component/migration-batch-prompts.md`** — **Preferred:** L1–L6 integrated into master execution file
- `<APP_PATH>/docs/migration/component/00-overview.md` — Branch model
- `<APP_PATH>/docs/migration/component/01-app-audit.md` — Component classification
- `<APP_PATH>/docs/migration/component/05-app-migration.md` — Batch execution
- `<APP_PATH>/docs/migration/component/06-component-standards.md` — Normalization standards
- `<APP_PATH>/docs/migration/verification-gate.md` — App-specific verification commands (typecheck/lint/build/test)

---

## Batch Number Convention

> [!NOTE]
> The batches in this file (Batch 1–6) are **legacy update batches**, NOT the same as the main migration batches (Batch 1–6 in `03-migration-plan.md`).
>
> | This file                             | Main migration                   | They are different |
> | ------------------------------------- | -------------------------------- | ------------------ |
> | Batch 1 = Subtree Pull & Merge        | Batch 1 = ADOPT_NOW import swaps | ✅ Different scope |
> | Batch 2 = Conflict Resolution         | Batch 2 = ADOPT_WITH_ADAPTER     | ✅ Different scope |
> | Batch 3 = Change Categorization       | Batch 3 = EXTEND_EXISTING        | ✅ Different scope |
> | Batch 4 = Apply Non-Component Changes | Batch 4 = NEW_SHARED_COMPONENT   | ✅ Different scope |
> | Batch 5 = packages/ui Intake          | Batch 5 = Stabilization          | ✅ Different scope |
> | Batch 6 = Verify & Document           | Batch 6 = Cleanup & Deprecation  | ✅ Different scope |
>
> The `migration-batch-prompts.md` file uses the naming **L1–L6** (L = Legacy) to avoid this confusion. This file retains the original Batch 1–6 naming for backward compatibility.

---

## Key Principle

**`integrate/<APP_NAME>` is 1:1 with the legacy repo** (read-only, never locally modified). Subtree pull to `integrate/<APP_NAME>` will **never conflict**. Conflicts only occur when merging `integrate/<APP_NAME>` → `migrate-app/<APP_NAME>`.

> **Complete current component before starting:** If you are mid-migration on a component when the legacy update arrives, **finish that component first**. Never pause mid-component. Commit the completed component, then run Batch 1.

---

## Placeholders

Replace these in every prompt before running:

| Placeholder       | Example value        | Description                               |
| ----------------- | -------------------- | ----------------------------------------- |
| `<APP_NAME>`      | `admin-portal`       | App slug (matches `apps/` directory name) |
| `<APP_PATH>`      | `apps/admin-portal`  | Monorepo-relative path to app root        |
| `<APP_PACKAGE>`   | `admin-portal` | Package name for `pnpm --filter`          |
| `<LEGACY_REMOTE>` | `admin-portal`       | Git remote name for the legacy repo       |
| `<LEGACY_BRANCH>` | `stage`              | Default branch of the legacy repo         |

---

## Batch 1 — Subtree Pull and Merge

Use as the **starting point** for every legacy update. No conflicts expected on `integrate/<APP_NAME>`.

### When to Use

Always — this is Batch 1 in every scenario.

### Prompt

```
Update <APP_NAME> in <APP_PATH> with changes from the legacy repository.

Follow <APP_PATH>/docs/migration/component/legacy-update-routines.md Routines 1 and 2:

**Routine 1 — Subtree pull to integrate/<APP_NAME>:**
1. Switch to integrate/<APP_NAME>
2. Run: git subtree pull --prefix=<APP_PATH> <LEGACY_REMOTE> <LEGACY_BRANCH>
   Expected: clean merge — no conflicts (integrate/* is read-only, 1:1 with legacy)
3. Push integrate/<APP_NAME>

**Routine 2 — Merge to migrate-app/<APP_NAME>:**
1. Switch to migrate-app/<APP_NAME>
2. Run: git merge integrate/<APP_NAME>
3. **Immediately run Merge Health Check (MHC):**
   pnpm --filter <APP_PACKAGE> check-types
   pnpm --filter <APP_PACKAGE> build
   - If MHC fails: stop. Fix narrowly (conflicted files only). Re-run MHC before continuing. Do NOT proceed to Batch 2 or 3 yet.
   - If MHC passes: continue below
4. If NO conflicts: push migrate-app/<APP_NAME> and report "Ready for Batch 3"
5. If conflicts: STOP, report conflict list, proceed to Batch 2

Do NOT make any code adjustments yet. Do NOT resolve conflicts yet.
Report the outcome clearly.
```

---

## Batch 2 — Resolve Conflicts on `migrate-app/<APP_NAME>`

Use when Batch 1 reports merge conflicts.

### When to Use

Only when Batch 1 reports conflicts.

### Prompt

```
Resolve merge conflicts on migrate-app/<APP_NAME> from merging integrate/<APP_NAME>.

Follow <APP_PATH>/docs/migration/component/legacy-update-routines.md Routine 3:

**Categorize each conflicted file using migration-log.md:**

| Category | Indicator | Resolution |
|---|---|---|
| Migrated component | In migration-log.md with Status=DONE; imports use @repo/ui | git checkout --ours <file> |
| MIGRATE_AFTER_SPLIT | In _audit-report.md with Classification=MIGRATE_AFTER_SPLIT; Batch 1.5 not yet run | git checkout --theirs <file> (treat as non-migrated). Do NOT remove MIGRATE_AFTER_SPLIT flag from audit.md. Re-evaluate SoC in Batch 3 after merge stabilizes. |
| Non-migrated component | Not in migration-log.md; still uses local imports | git checkout --theirs <file> |
| In-progress batch item | In migration-log.md with Status=IN PROGRESS | Manual merge — keep our base, apply legacy additions |
| Shared infrastructure | packages/config/**, packages/helper/**, tsconfig | Manual merge — prefer ours, apply new additions |
| App configuration | package.json, tailwind.config.*, tsconfig.json | Manual merge — apply new deps/settings, keep migration overrides |
| Static assets | public/**, assets/** | git checkout --theirs unless we intentionally replaced |

**Steps:**
1. Read <APP_PATH>/docs/migration/component/migration-log.md to know which components are DONE
2. For each conflicted file, assign exactly one category
3. Apply the correct resolution strategy
4. After all conflicts resolved:
   git add .
   git commit -m "chore: merge integrate/<APP_NAME> to migrate-app/<APP_NAME> — component conflict resolution"
   git push origin migrate-app/<APP_NAME>
5. Report: list each file, its category, and which strategy was used

Proceed to Batch 3 after Pushing.
```

---

## Batch 3 — Analyze Changes

Use after merge is clean (with or without conflicts resolved).

### When to Use

After Batch 1 (clean) or Batch 2 (after conflicts resolved).

### Prompt

```
Analyze the legacy update changes for <APP_NAME>.

Follow <APP_PATH>/docs/migration/component/legacy-update-routines.md Routine 4:

**Step 1 — Identify what changed:**
git log integrate/<APP_NAME>~5..integrate/<APP_NAME> --oneline
git diff migrate-app/<APP_NAME>..integrate/<APP_NAME> --name-only

**Step 2 — Categorize each changed file:**

| Category | Examples | Report |
|---|---|---|
| New component file | New .tsx in src/components/ | List + classify per 06-component-standards.md |
| Existing component modified (non-migrated) | UI update we haven't touched | List — already handled by Routine 3 |
| Existing component modified (migrated) | Legacy changed a component we own | 🚨 Flag for review |
| Config/dependency change | package.json, tsconfig, tailwind.config | List each |
| Style/asset change | CSS, public/**, images | List each |

**Step 3 — For each NEW component file, classify it:**
Apply the shared-vs-local boundary from <APP_PATH>/docs/migration/component/06-component-standards.md:
- Is it purely visual (no API calls, no domain types)?
  YES → Used by 2+ apps? → NEW_SHARED_COMPONENT or EXTEND_EXISTING
  NO  → Classify as KEEP_APP_LOCAL, then run Universal SoC Evaluation:

**Universal SoC Evaluation (required for all KEEP_APP_LOCAL from legacy):**
Per 06-component-standards.md §6.2:
- Is monolith? (data hook + display JSX / domain types in JSX / business logic in render)
- Rate SoC potential: HIGH | MEDIUM | LOW | NONE
- Identify SoC strategy: container-shell | prop-injection | render-prop | hook-extraction | none
- Set Batch 1.5 candidate: YES (if HIGH or MEDIUM) | NO
- If Batch 1.5 candidate = YES:
  → Classification = MIGRATE_AFTER_SPLIT (not KEEP_APP_LOCAL yet)
  → batch = 1.5 in _component-backlog.csv
  → Add to Batch 1.5 queue in update log
- If Batch 1.5 candidate = NO:
  → Classification = KEEP_APP_LOCAL; batch = N/A

**Step 4 — Create update log:**
- Create directory if needed: mkdir -p <APP_PATH>/docs/migration/component/legacy-updates
- Use current local timestamp: YYYYMMDD-HHMMSS
- Create <APP_PATH>/docs/migration/component/legacy-updates/legacy-update-YYYYMMDD-HHMMSS.md with:
  * Legacy commit SHA
  * List of changes by category
  * Classification decision for each new component
  * Current batch position (from migration-plan.md)
  * Recommended next batch with justification

**Cross-reference:**
- Check <APP_PATH>/docs/migration/component/01-app-audit.md for existing classifications
- Check <APP_PATH>/docs/migration/component/migration-log.md for batch status

Report all findings and wait for confirmation before proceeding.
```

---

## Batch 4 — Apply Non-Component Adjustments

Use when the legacy update only has config, style, asset, or app-local component changes (no new packages/ui candidates).

### When to Use

After Batch 3, when no new `NEW_SHARED_COMPONENT` or `EXTEND_EXISTING` items were identified.

### Prompt

```
Apply non-component adjustments from the legacy update for <APP_NAME>.

Follow <APP_PATH>/docs/migration/component/legacy-update-routines.md Routine 4.3 and 4.4:

Context from Batch 3:
- Config/dependency changes: <list-from-batch-3>
- Style/asset changes: <list-from-batch-3>
- New KEEP_APP_LOCAL components: <list-from-batch-3>

**For each adjustment type:**

1. New dependencies in package.json:
   - Run: pnpm install
   - Verify no peer dependency conflicts

2. Tailwind config changes:
   - Apply the new configuration
   - Verify CSS variable contract still satisfied (see 06-component-standards.md Section 5)
   - Verify @repo/ui tokens still resolve

3. tsconfig / path alias changes:
   - Apply changes
   - Run: pnpm --filter <APP_PACKAGE> check-types to verify paths still resolve

4. Global CSS changes:
   - Apply new styles
   - Ensure our migration-specific tokens and overrides are preserved

5. New KEEP_APP_LOCAL components (if any):
   - Confirm conflict was already resolved with --theirs in Batch 2
   - Add entry to <APP_PATH>/docs/migration/component/01-app-audit.md if not present
   - Add row to component-backlog.csv with batch=N/A

Rules:
- Do NOT modify components classified as DONE in migration-log.md
- Do NOT reintroduce local copies of migrated components
- Keep changes minimal and localized
- **Backward-compatibility contract (mandatory for all changes in this batch):**
  - [ ] No changes to existing component prop APIs for callers — new props must be optional; no props removed without migration notice
  - [ ] No removal of existing exports from `@repo/ui` — deprecate first if removal is planned
  - [ ] No TypeScript type narrowing — widening is OK; narrowing is NOT unless every consumer verified
  - [ ] No hook `queryKey` / `queryFn` signature changes — if service track has refactored hooks, legacy updates must not alter those contracts
  - If any of the above cannot be maintained, document in update log under `## Breaking Changes (Escalated)` and raise with team before merging

Proceed to Batch 6 after completing adjustments.
```

---

## Batch 5 — packages/ui Intake for New Legacy Components

Use when Batch 3 identified new `NEW_SHARED_COMPONENT` or `EXTEND_EXISTING` candidates from the legacy update.

### When to Use

After Batch 3 identifies packages/ui candidates. Run per candidate component.

### Prompt

```
Queue packages/ui intake for the new component(s) identified in the legacy update for <APP_NAME>.

Follow <APP_PATH>/docs/migration/component/legacy-update-routines.md Routine 5:

Context from Batch 3:
- New candidate: <ComponentName> at <source-path>
- Classification: NEW_SHARED_COMPONENT | EXTEND_EXISTING
- Classification rationale: <from-batch-3>

**For EXTEND_EXISTING:**
1. Identify which existing @repo/ui component needs the extension
2. Document the API gap in <APP_PATH>/docs/migration/component/spec-input.md:
   ### <ComponentName>
   - API Intent: [what new props/variants are needed in @repo/ui]
   - Source: <source-path in legacy>
   - Target: <existing @repo/ui component to extend>
   - Variants needed: [list]
3. Keep the legacy local file on migrate-app/<APP_NAME> — do NOT delete it yet
   (it will be deleted when packages/ui ships the extension and Batch 3 migration runs)
4. Add note in migration-plan.md: "<ComponentName> — waiting for packages/ui Batch 3 extension"
5. Proceed to Batch 6

**For NEW_SHARED_COMPONENT:**
1. Document in <APP_PATH>/docs/migration/component/spec-input.md:
   ### <ComponentName>
   - API Intent: [full prop API the app needs]
   - Visual spec: [key visual requirements]
   - Variants needed: [list]
   - States needed: [default, hover, focus, disabled, loading, error — as applicable]
   - Accessibility: [ARIA role, keyboard requirements]
   - Consumer usage example: <ComponentName variant="..." />
2. Add row to component-backlog.csv:
   <APP_NAME>,<ComponentName>,NEW_SHARED_COMPONENT,<P0-P3>,<HIGH/MED/LOW>,<source-path>,None,<effort>,<parity-risk>
3. Keep the legacy local file on migrate-app/<APP_NAME> — do NOT delete it yet
   (it will be deleted when packages/ui ships it and Batch 4 migration runs)
4. Add note in migration-plan.md: "<ComponentName> — waiting for packages/ui Batch 4 build"
5. Proceed to Batch 6

**If this update occurs after Batch 5 (cleanup done and local files already deleted):**
- After Batch 5 queues the intake, run Batch 5A to temporarily re-add the legacy
  component until packages/ui ships it — OR wait for packages/ui to ship first
- Document the decision in the update log

Do NOT start packages/ui implementation here. This batch only queues the intake.
```

---

## Batch 5A — Incremental Migration for Newly Queued Component

Use **only** after Batch 5/6 (cleanup done, local copies deleted) when a new packages/ui component is now needed by the app.

### When to Use

- After Batch 5 queues a NEW_SHARED_COMPONENT intake
- After Batch 6 cleanup is complete (migration-log.md shows all items DONE)
- When the newly built @repo/ui component is now available in `packages/ui/src/index.ts`

### Prompt

```
Incrementally migrate <APP_NAME> to use the newly built @repo/ui <ComponentName>.

Context:
- Component: <ComponentName>
- Already available in packages/ui: confirm in packages/ui/src/index.ts
- Spec: packages/ui/src/<ComponentName>/<ComponentName>.spec.md

Follow <APP_PATH>/docs/migration/component/05-app-migration.md Batch 3/4 pattern:

1. Verify <ComponentName> is exported from packages/ui/src/index.ts

2. Find all usage sites in apps/<APP_NAME>/src/**:
   - Search for: the legacy local import or any usage of this component pattern
   - List all files

3. Migrate each usage site (ONE at a time):
   - Update import to: import { <ComponentName> } from '@repo/ui'
   - Adapt props at usage site if API differs (use adapter pattern if needed)
   - Verify: pnpm --filter <APP_PACKAGE> check-types still passes
   - Do NOT change unrelated code

4. After ALL usage sites migrated:
   - Run full verification gate:
     pnpm --filter <APP_PACKAGE> check-types
     pnpm --filter <APP_PACKAGE> lint
     pnpm --filter <APP_PACKAGE> build
   - Verify app still renders correctly on key routes

5. Update migration-log.md:
   ## <ComponentName> — Batch 4 (Incremental — legacy update YYYYMMDD)
   - Imports updated: [list files]
   - @repo/ui version: <ComponentName> from @repo/ui
   - Typecheck: PASS
   - Build: PASS

Rules:
- ONLY migrate components using this specific new component
- DO NOT touch unrelated components
- Migrate ONE usage site at a time
- Test after each

Proceed to Batch 6 after completing and verifying.
```

---

## Batch 6 — Verification and Documentation

Final step in every scenario.

### Prompt

```
Verify legacy update integration for <APP_NAME> and complete documentation.

Follow <APP_PATH>/docs/migration/component/legacy-update-routines.md Routine 6:

**Step 1 — Read verification gate and run commands:**
0. Read <APP_PATH>/docs/migration/verification-gate.md to get the exact verification
   commands for this app (typecheck, lint, build, test, sanity — as defined).
   Do NOT guess commands — use exactly what is in that file.

pnpm --filter <APP_PACKAGE> check-types
pnpm --filter <APP_PACKAGE> lint
pnpm --filter <APP_PACKAGE> build

If any packages/ui changes were made on feat/ui:
pnpm --filter @repo/ui check-types
pnpm --filter @repo/ui build

**Step 2 — Verify migrated component integrity:**
For every component in migration-log.md with Status=DONE:
- [ ] Import still resolves to @repo/ui (not reverted to local path)
- [ ] No local duplicate re-appeared from the merge
- [ ] Prop API at usage sites still compiles correctly

**Step 3 — If verification fails:**
- Typecheck/lint errors: fix narrowly, re-run gate
- Reverted migrated import: git checkout HEAD <file>, re-run gate
- If critical failure:
  git reset --hard <commit-before-merge>
  git push -f origin migrate-app/<APP_NAME>
  Document rollback in legacy-update-YYYYMMDD-HHMMSS.md and STOP

**Step 4 — Complete the update log at:**
<APP_PATH>/docs/migration/component/legacy-updates/legacy-update-YYYYMMDD-HHMMSS.md

Fill in:
- Final verification results (command outputs for each check)
- Changes integrated summary
- Conflict resolution summary (if Batch 2 was used)
- packages/ui intake items queued (if Batch 5 was used)
- Current batch position (from migration-plan.md)
- Next steps (e.g., "Resume Batch 4 — continue with <ComponentName>")

**Step 5 — Report summary:**
- Changes integrated
- Conflicts resolved (if any)
- Migration-locked components verified
- packages/ui intake items queued (if any)
- Verification gate: ✅ all passed
- Current batch position
- Recommended next steps
```

---

## Quick Reference: Scenario → Batch Sequence

| Scenario                                                                     | Batch Sequence                   | Est. Time |
| ---------------------------------------------------------------------------- | -------------------------------- | --------- |
| Clean merge, no new components                                               | 1 → 3 → 4 → 6                    | 30–60 min |
| Conflicts, no new components                                                 | 1 → 2 → 3 → 4 → 6                | 1–2 hours |
| Clean merge, new KEEP_APP_LOCAL only (SoC = LOW/NONE)                        | 1 → 3 → 4 → 6                    | 30–60 min |
| Clean merge, new KEEP_APP_LOCAL with HIGH/MEDIUM SoC (→ MIGRATE_AFTER_SPLIT) | 1 → 3 → 4 → 6 + Batch 1.5 queued | 1–2 hours |
| Clean merge, new packages/ui candidate                                       | 1 → 3 → 5 → 6                    | 1–3 hours |
| Conflicts + new packages/ui candidate                                        | 1 → 2 → 3 → 5 → 6                | 2–4 hours |
| Post-cleanup (Batch 5 done) + new candidate now available in @repo/ui        | 1 → 3 → 5 → 5A → 6               | 3–5 hours |

---

_Related: [legacy-update-routines.md](./legacy-update-routines.md) · [legacy-update-integration-guide.md](./legacy-update-integration-guide.md) · [05-app-migration.md](./05-app-migration.md)_
