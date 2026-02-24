# Legacy Update Batch Prompts

> **Purpose:** Ready-to-use prompts for handling legacy repo updates via git subtree pull during monorepo migration.

---

## Related Documents

- `<APP_PATH>/docs/migration/service/legacy-update-routines.md`
- `<APP_PATH>/docs/migration/service/refactor-spec.md`
- `<APP_PATH>/docs/migration/service/refactor-lifecycle.md`
- `<APP_PATH>/docs/migration/service/component-migration.md`
- `<APP_PATH>/docs/migration/service/audit.md`
- `<APP_PATH>/docs/migration/service/plan.md`
- `<APP_PATH>/docs/migration/verification-gate.md`

---

## Key Principle

**`integrate-app/*` is 1:1 with legacy repo** (read-only, never modified). Subtree pull to `integrate-app/*` will NEVER have conflicts. Conflicts only occur when merging `integrate-app/*` to `migrate-app/*`.

---

## Batch Number Convention

> [!NOTE]
> The batches in this file (Batch 1–6) are **legacy update batches**, NOT the same as the main service refactor batches (Batch 0–7 in `refactor-batch-prompts.md`).
>
> | This file | Main refactor | They are different |
> | --------- | ------------- | ------------------ |
> | Batch 1 = Subtree Pull & Merge | Batch 1 = Foundation setup | ✅ Different scope |
> | Batch 2 = Conflict Resolution | Batch 2 = API client/setup | ✅ Different scope |
> | Batch 3 = Analyze Changes | Batch 3 = Audit services | ✅ Different scope |
> | Batch 4 = Apply Adjustments | Batch 4 = Implement API layer | ✅ Different scope |
> | Batch 5 = New Service | Batch 5 = Hooks | ✅ Different scope |
> | Batch 6 = Verify & Document | Batch 6 = Component migration | ✅ Different scope |
>
> When using these in AI-assisted workflows alongside `refactor-batch-prompts.md`, always prefix with "Legacy Update" to avoid confusion.

---

## Placeholders

- `<APP_NAME>`: admin-portal
- `<APP_PATH>`: apps/admin-portal
- `<REMOTE_NAME>`: admin-portal
- `<REMOTE_BRANCH>`: stage
- `<SUBTREE_PREFIX>`: apps/admin-portal

---

## Update Batch 1: Subtree Pull and Merge (No Conflicts Expected)

Use when you expect a clean merge.

### Prompt

```
Update <APP_NAME> in <APP_PATH> with changes from legacy repository.

Follow <APP_PATH>/docs/migration/service/legacy-update-routines.md Routines 1-2:

1. Routine 1: Subtree pull to integrate/<APP_NAME>
   - Switch to integrate/<APP_NAME>
   - Run: git subtree pull --prefix=<SUBTREE_PREFIX> <REMOTE_NAME> <REMOTE_BRANCH>
   - Expected: Clean merge (no conflicts, since integrate-app/* is 1:1 with legacy)
   - Push integrate/<APP_NAME>

2. Routine 2: Merge to migrate/<APP_NAME>
   - Switch to migrate/<APP_NAME>
   - Merge integrate/<APP_NAME>
   - **Immediately run Merge Health Check (MHC):**
     ```
     pnpm --filter <APP_PACKAGE_NAME> check-types
     pnpm --filter <APP_PACKAGE_NAME> build
     ```
     - If MHC fails: stop, fix narrowly, re-run MHC before continuing
     - If MHC passes:
   - If NO conflicts: push and proceed to Batch 3
   - If conflicts: STOP and notify me, proceed to Batch 2

Do not make code adjustments yet.
```

---

## Update Batch 2: Resolve Conflicts on migrate/\*

Use when conflicts occurred in Batch 1.

### Prompt

```
Resolve conflicts on migrate/<APP_NAME> from merging integrate/<APP_NAME>.

Follow <APP_PATH>/docs/migration/service/legacy-update-routines.md Routine 3:

1. Identify conflict categories:
   - Old/Legacy Services → accept theirs
   - New/Refactored Services → keep ours
   - Migrated Components → keep ours
   - Non-Migrated Components → accept theirs
   - Shared Infrastructure → carefully merge, prefer ours
   - Configuration → carefully merge both

   **How to categorize:**
   - Check if file is part of new refactored structure → New/Refactored
   - Check if file will be deleted in Phase 6 → Old/Legacy
   - Check component imports (uses new hooks or old services?)
   - Check if infrastructure/config file

2. Resolve conflicts using strategies:
   - Old/legacy files: git checkout --theirs <file>
   - New/refactored files: git checkout --ours <file>
   - Components: check imports to determine migration status
   - Infrastructure/Config: manually merge

3. Commit and push:
   - git commit -m "chore: merge integrate/<APP_NAME> to migrate/<APP_NAME>"
   - git push origin migrate/<APP_NAME>

4. Provide summary of conflicts resolved by category

Proceed to Batch 3 after pushing.
```

---

## Update Batch 3: Analyze Changes

Use after migrate/\* is successfully merged (with or without conflicts).

### Prompt

```
Analyze changes from legacy update for <APP_NAME>.

Follow <APP_PATH>/docs/migration/service/legacy-update-routines.md Routine 4:

1. Identify what changed:
   - Compare recent commits: git log integrate/<APP_NAME>~5..integrate/<APP_NAME>
   - List new service endpoints
   - List new API calls
   - List new types/interfaces
   - Identify modified business logic
   - Identify breaking changes

2. Categorize adjustments needed:
   - New endpoints in existing services
   - Completely new services (new base URL)
   - Modified existing endpoints
   - Component-only changes
   - Breaking dependency changes

3. For each category, provide:
   - Detailed list
   - Impact assessment (low/medium/high)
   - Recommended action with decision logic:
     * Batch 4 if: updating existing services OR adding endpoints to existing services (base URL exists in audit.md)
     * Batch 5 if: new base URL detected OR new service domain added (base URL NOT in audit.md)
     * Batch 6 if: component-only OR config changes (no service changes needed)

   **Decision Matrix:**
   | Scenario | Indicators | Batch |
   |----------|------------|-------|
   | New endpoints in existing service | Base URL in audit.md, new paths | 4 |
   | New service (new base URL) | Base URL NOT in audit.md | 5 |
   | Modified endpoint types | Endpoint in plan.md, types changed | 4 |
   | Breaking API changes | Endpoint signature changed | 4 (+ careful testing) |
   | Component changes only | No service files changed | 4 (minimal) or 6 |
   | Config/dependency changes | package.json, .env, build config | 4 (minimal) |

4. Before creating the update document:
   - Create directory if needed: mkdir -p <APP_PATH>/docs/migration/service/legacy-updates
   - Use current local timestamp in format YYYYMMDD-HHMMSS (no separators)
   - Example filename: legacy-update-20260213-113000.md
   - Cross-check base URLs with <APP_PATH>/docs/migration/service/audit.md
   - Cross-check existing services with <APP_PATH>/docs/migration/service/plan.md

5. Create <APP_PATH>/docs/migration/service/legacy-updates/legacy-update-YYYYMMDD-HHMMSS.md (on migrate/<APP_NAME> branch) with:
   - Update timestamp
   - Legacy commit SHA
   - List of changes
   - Current refactor phase (Phase X / Batch Y)
   - Recommended next batch with justification

Report findings and wait for confirmation.
```

---

## Update Batch 4: Apply Adjustments (No New Services)

Use when changes don't require new services.

### Prompt

```
Apply adjustments to refactored architecture for <APP_NAME> (no new services).

Follow <APP_PATH>/docs/migration/service/legacy-update-routines.md Routine 4.3:

Context from Batch 3:
- Changes: <list-from-batch-3>
- Affected services: <list>

For each affected service:

1. If new endpoints added:
   - Update [service].endpoints.ts
   - Update [service].types.ts
   - Update [service].service.ts
   - Update query-keys.ts
   - Create new hooks in hooks/queries/ or hooks/mutations/
   - Update hook barrel exports in hooks/queries/index.ts and hooks/mutations/index.ts
   - **Hook requirements (see refactor-spec.md lines 523-525):**
     * Queries: accept optional `options?: Omit<UseQueryOptions<...>, 'queryKey' | 'queryFn'>`
     * Mutations: accept optional `options?: UseMutationOptions<...>`
     * Mutations with onSuccess: call `options?.onSuccess?.(...)`

2. If existing endpoints modified:
   - Update types in [service].types.ts
   - Update function in [service].service.ts
   - Update affected hooks
   - Check migrated components

3. If non-service changes:
   - Install new dependencies (pnpm install <package>)
   - Apply config changes
   - Apply business logic changes

Rules:
- Do NOT modify old services
- Follow existing patterns exactly
- **Backward-compatibility contract (mandatory for all changes in this batch):**
  - [ ] No existing hook signatures changed — `queryKey`, `queryFn`, and parameter shapes must remain identical for callers
  - [ ] No existing exported types narrowed — type widening is OK; type narrowing or removal is NOT without migration notice
  - [ ] No existing service function signatures changed for current consumers
  - [ ] No exports deleted without a deprecation comment first
  - If any of the above cannot be maintained, document it explicitly in `legacy-update-YYYYMMDD-HHMMSS.md` under "Breaking Changes" and notify the team before merging

Proceed to Batch 6 (verification) after completing adjustments.
```

---

## Update Batch 5: Apply Adjustments (New Service Required)

Use when a new service must be created.

### When to Use This Batch

This batch creates the API layer and hooks (Phase 4A + 4B) for the new service.

**After this batch, determine next steps based on current refactor phase:**

| Current Main Refactor Phase                                      | Next Steps After Batch 5                                                                                                                    |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Before Batch 6-7** (old services still exist)                  | → Skip to **Batch 6** (verification only)<br/>Components still use old services, no migration needed yet                                    |
| **After Batch 6** (component migration done, but before cleanup) | → **Batch 5A** (migrate affected components)<br/>→ **Batch 5B** (cleanup old service if exists)<br/>→ **Batch 6** (verification)            |
| **After Batch 7** (cleanup complete, no old services)            | → **Batch 5A** (migrate affected components)<br/>→ **Batch 5B** (cleanup if old service added from legacy)<br/>→ **Batch 6** (verification) |

**Decision Logic:**

- Use **Batch 5 only** if components don't need the new service yet (before component migration phase)
- Use **Batch 5 → 5A → 5B** if components need to use the new service immediately (after/during component migration)

### Prompt

```
Create NEW service for <APP_NAME> from legacy update.

Follow <APP_PATH>/docs/migration/service/legacy-update-routines.md Routine 5:

Context:
- New service name: <service-name>
- Base URL: <base-url>
- Endpoints: <list>

Steps:

1. Update <APP_PATH>/docs/migration/service/audit.md:
   - Add new service section
   - List base URL, endpoints, types
   - Mark as NEW with date

2. Update <APP_PATH>/docs/migration/service/plan.md:
   - Add service plan
   - List endpoints, types, query keys, hooks

3. Implement Phase 4A (API Layer):
   - Create apps/<APP_NAME>/src/services/<service-name>/api/
   - Create [service].endpoints.ts
   - Create [service].types.ts
   - Create [service].service.ts
   - Use correct base URL

4. Implement Phase 4B (Hooks):
   - Create query-keys.ts
   - Create hooks/queries/* for GET
   - Create hooks/mutations/* for POST/PUT/DELETE
   - Create hooks/queries/index.ts and hooks/mutations/index.ts
   - **Hook signature requirements (see refactor-spec.md lines 523-525):**
     * Queries: accept optional `options?: Omit<UseQueryOptions<...>, 'queryKey' | 'queryFn'>`
     * Mutations: accept optional `options?: UseMutationOptions<...>`
     * Spread `...options` in useQuery/useMutation calls
     * Mutations with onSuccess: compose with `options?.onSuccess?.(...)` for cache invalidation

5. Run verification gate after Phase 4B

Rules:
- Do NOT migrate components yet
- Do NOT modify old services
- Follow Phase 4A/4B patterns from main refactor spec

Proceed to Batch 5A if components need to use the new service, otherwise proceed to Batch 6 (verification).
```

---

## Update Batch 5A: Component Migration (Incremental - New Service Only)

Use when components need to use the newly created service (typically after main Batch 6-7).

### When to Use This Batch

- ✅ After Batch 5 completes (new service API + hooks created)
- ✅ After main refactor Batch 6 or 7 (component migration started/completed)
- ✅ When components exist that should use the new service
- ❌ Skip if before main Batch 6 (components still use old services)

### Prompt

```
Migrate components to use the NEW service created in Batch 5 for <APP_NAME>.

Follow <APP_PATH>/docs/migration/service/legacy-update-routines.md Routine 5A:

Context:
- New service name: <service-name>
- Service already implemented: Phase 4A (API) + Phase 4B (Hooks) complete

Steps:

1. Identify affected components:
   - Search codebase for components that:
     * Currently use old service patterns related to <service-name> domain
     * Make API calls related to <service-name> endpoints
     * Would benefit from the new service
   - List all affected components (pages, forms, dashboards, etc.)

2. Migrate components incrementally (ONE at a time):
   - Use patterns from <SPEC_PATH> Phase 5
   - Replace old patterns:
     * Remove useState + useEffect for data fetching
     * Remove old service imports
     * Import query hooks from @/services/<service-name>/hooks/queries and mutation hooks from @/services/<service-name>/hooks/mutations
   - Update to new patterns:
     * Use useQuery hooks for GET operations
     * Use useMutation hooks for POST/PUT/DELETE
     * Use proper loading/error states from hooks
   - Test EACH component thoroughly after migration

3. Verification per component:
   - Page still loads without errors
   - Data fetching works correctly
   - User interactions still work
   - No console/network errors
   - No regressions

4. After ALL affected components migrated:
   - Run full verification gate from verification-gate.md
   - If verification fails: fix and re-run
   - Document incremental migration in <APP_PATH>/docs/migration/service/component-migration.md:
     * Add new "Incremental Updates" section with timestamp
     * List service name and context (what was added from legacy)
     * List components migrated for this new service
     * Include verification results
     * Cross-reference to legacy-updates/legacy-update-YYYYMMDD-HHMMSS.md

Rules:
- **ONLY** migrate components using the new service, NOT all components
- **DO NOT** touch unrelated components
- Migrate ONE component at a time
- Test after each component migration
- Maintain 100% backward compatibility
- If $vercel-react-best-practices available, apply it

Proceed to Batch 5B after all affected components are migrated and verified.
```

---

## Update Batch 5B: Cleanup (Incremental - New Service Only)

Use when old service files exist for the newly created service domain (typically after Batch 5A).

### When to Use This Batch

- ✅ After Batch 5A completes (components migrated to new service)
- ✅ When old service files exist for the same domain
- ❌ Skip if no old service exists for this domain
- ❌ Skip if before main Batch 6 (old services still needed by other components)

### Prompt

```
Cleanup old service files for <service-name> after component migration for <APP_NAME>.

Follow <APP_PATH>/docs/migration/service/legacy-update-routines.md Routine 5B:

Context:
- New service name: <service-name>
- Components already migrated: Batch 5A complete

Steps:

1. Identify old service files related to <service-name>:
   - Search for old service files (e.g., src/services/*.service.ts)
   - Check if old service exists for <service-name> domain
   - List files to be deleted

2. If old service files exist:
   - Delete ONLY files related to <service-name>
   - DO NOT delete other old services (they may be used elsewhere)
   - Update any remaining imports (should be none if Batch 5A was complete)

3. If NO old service files exist:
   - Note: "No cleanup needed, old service doesn't exist"
   - This is expected if service is brand new from legacy

4. Verify cleanup:
   - Run typecheck
   - Run build
   - No broken imports
   - App still runs correctly

5. Run full verification gate from verification-gate.md:
   - Document cleanup results
   - Note which files were deleted (if any)

Rules:
- **ONLY** delete old service files for <service-name>
- **DO NOT** delete other old services
- Verify no broken imports after deletion
- If verification fails: fix and re-run

Proceed to Batch 6 (verification and documentation) after cleanup.
```

---

## Update Batch 6: Verification and Documentation

Final step after all adjustments.

### Prompt

```
Verify legacy update integration for <APP_NAME> and complete documentation.

Follow <APP_PATH>/docs/migration/service/legacy-update-routines.md Routine 6:

0. **Read verification gate definition:**
   - View file: <APP_PATH>/docs/migration/verification-gate.md
   - Extract commands: typecheck, build, lint, test, sanity
   - If file doesn't exist: create it first using refactor-spec.md App-Specific Inputs section
   - Note which commands are available vs N/A

1. Run full verification gate commands from verification-gate.md:
   - Run typecheck command (or closest equivalent)
   - Run build command
   - Run lint command (if available)
   - Run test command (if available)
   - Run sanity check (if defined)
   - Document results for each

2. Verify refactored services:
   - Test hooks return expected data
   - Test mutations work
   - Test cache invalidation
   - Test error handling

3. Verify migrated components:
   - Test rendering
   - Test data fetching
   - Test user interactions
   - Check for regressions

4. If verification fails:
   - Use $systematic-debugging (if available)
   - Fix issues in most localized way
   - Re-run verification gate
   - If fix is safe and passes: continue to step 5
   - **If catastrophic failure (cannot fix safely):**
     * Rollback migrate-app/* branch:
       git reset --hard <commit-before-legacy-update-merge>
       git push -f origin migrate/<app-name>
     * Document rollback in legacy-update-YYYYMMDD-HHMMSS.md
     * Notify team and plan alternative approach
     * STOP - do not proceed

5. Complete <APP_PATH>/docs/migration/service/legacy-updates/legacy-update-YYYYMMDD-HHMMSS.md:
   - Final verification results (with command outputs)
   - Notes on issues encountered
   - Actions taken to resolve
   - Current refactor phase status (e.g., "Phase 4B complete, ready for Phase 5")

6. Update main task.md (if exists at <APP_PATH>/docs/migration/service/task.md):
   - Mark legacy update as integrated
   - Update current phase/batch status
   - Note services affected and new services added (if any)

7. Report summary:
   - Changes integrated
   - Services affected
   - New services added (if any)
   - Verification status (all checks passed)
   - Recommended next steps
```

---

## Quick Reference: Batch Sequences

### Scenario A: Clean Update (No Conflicts, No New Services)

```
Batch 1 → Batch 3 → Batch 4 → Batch 6
```

**Time:** 30 min - 1 hour

---

### Scenario B: Update with Conflicts (No New Services)

```
Batch 1 → Batch 2 → Batch 3 → Batch 4 → Batch 6
```

**Time:** 1-2 hours

---

### Scenario C: Clean Update with New Service

```
Batch 1 → Batch 3 → Batch 5 → Batch 6
```

**Time:** 2-4 hours

---

### Scenario D: Update with Conflicts and New Service

```
Batch 1 → Batch 2 → Batch 3 → Batch 5 → Batch 6
```

**Time:** 2-4 hours

---

### Scenario E: New Service After Full Cleanup (After Main Batch 7)

```
Batch 1 → Batch 3 → Batch 5 → Batch 5A → Batch 5B → Batch 6
```

**Time:** 3-5 hours

**Context:** Main refactor complete (Batch 0-7 done), old services deleted, now legacy update adds new service.

**Flow:**

1. **Batch 1-3**: Subtree pull, merge, analyze (as usual)
2. **Batch 5**: Create new service (API + Hooks only)
3. **Batch 5A**: Migrate ONLY components that need the new service
4. **Batch 5B**: Cleanup old service (if legacy added old-style service, otherwise skip)
5. **Batch 6**: Full verification

**Key Difference:** After cleanup, MUST immediately migrate components (Batch 5A) - cannot leave components using non-existent old services.

---

## Integration with Main Refactor Lifecycle

### During Main Batches 0-5 (Before Component Migration; covers Phases 0-4B)

If legacy update occurs:

1. Pause current main batch (complete current step)
2. Run appropriate Update Batch sequence
3. Resume main batch where you left off
4. Do NOT restart main batches unless breaking changes require it

### During Main Batch 6 (Component Migration; Phase 5)

If legacy update occurs:

1. **Higher risk** - be extra careful
2. Run Update Batch sequence
3. Extensively test migrated components in Batch 6
4. May need to re-migrate affected components

### After Main Batch 7 (Cleanup Complete; Phase 6)

If legacy update occurs:

1. Old services are gone
2. **Must use incremental batches** for new service:
   - Run Batch 1-3 (subtree, merge, analyze)
   - Run **Batch 5** (create new service - API + Hooks)
   - Run **Batch 5A** (migrate affected components incrementally)
   - Run **Batch 5B** (cleanup if old service was added from legacy)
   - Run Batch 6 (verification)
3. **DO NOT** re-run main Batch 6-7 (would migrate all components from scratch)
4. **DO** use Batch 5A to migrate ONLY affected components
5. Full verification is mandatory

---

## Checklist: Before Running Update Batches

- [ ] Legacy repo has new commits
- [ ] Working tree is clean
- [ ] Current main batch (if any) at good stopping point
- [ ] Git subtree configuration correct
- [ ] Verification gate defined
- [ ] Team notified

---

## Template: legacy-update-YYYYMMDD-HHMMSS.md

Create separate file for each update at `apps/<app-name>/docs/migration/service/legacy-updates/legacy-update-YYYYMMDD-HHMMSS.md`:

**Example:** `apps/ticket-portal/docs/migration/service/legacy-updates/legacy-update-20260212-150320.md`

```markdown
# Legacy Update - <APP_NAME> - YYYY-MM-DD HH:MM:SS

### Legacy Repo Commit

- **Commit:** `<sha>`
- **Date:** `<date>`
- **Summary:** <what changed>

### Integration Status

- **Subtree pull:** ✅ Success
- **Merge to migrate/\*:** ✅ Clean / ⚠️ Conflicts resolved
- **Update Batches:** <list batches used>

### Changes Identified

- **New services:** <list or "None">
- **New endpoints:** <list or "None">
- **Modified endpoints:** <list or "None">
- **Breaking changes:** <list or "None">

### Actions Taken

- <action 1>
- <action 2>

### Verification Results

- **Typecheck:** ✅/❌
- **Build:** ✅/❌
- **Tests:** ✅/❌/N/A
- **Sanity:** ✅/❌

### Current Refactor Status

- **Main Batch:** <e.g., "Completed Batch 5, ready for Batch 6">
- **Services Refactored:** <list>

### Next Steps

- <next step>

---
```

---

## Summary

These batch prompts enable:

✅ **Systematic updates** - Clear, copy-paste prompts  
✅ **Safe conflict resolution** - Strategy-driven approach  
✅ **Incremental integration** - New services refactored properly  
✅ **No breaking changes** - Verification at every step  
✅ **Full documentation** - Complete audit trail  
✅ **Seamless workflow** - Integrates with main refactor batches
