# Legacy Update Batch Prompts

> **Purpose:** Ready-to-use prompts for handling legacy repo updates via git subtree pull during monorepo migration.

---

## Related Documents

- `<APP_PATH>/docs/migration/service/legacy-update-routines.md`
- `<APP_PATH>/docs/migration/service/refactor-spec.md`
- `<APP_PATH>/docs/migration/service/refactor-lifecycle.md`
- `<APP_PATH>/docs/migration/service/audit.md`
- `<APP_PATH>/docs/migration/service/plan.md`
- `<APP_PATH>/docs/verification-gate.md`

---

## Key Principle

**`integrate/*` is 1:1 with legacy repo** (read-only, never modified). Subtree pull to `integrate/*` will NEVER have conflicts. Conflicts only occur when merging `integrate/*` to `migrate/*`.

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
   - Expected: Clean merge (no conflicts, since integrate/* is 1:1 with legacy)
   - Push integrate/<APP_NAME>

2. Routine 2: Merge to migrate/<APP_NAME>
   - Switch to migrate/<APP_NAME>
   - Merge integrate/<APP_NAME>
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
   - Recommended action (Batch 4, 5, or 6)

4. Create <APP_PATH>/docs/migration/service/legacy-updates/legacy-update-YYYYMMDD-HHMMSS.md (use actual datetime) with:
   - Update timestamp
   - Legacy commit SHA
   - List of changes
   - Current refactor phase (Batch X)
   - Recommended next batch

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
- Maintain backward compatibility

Proceed to Batch 6 (verification) after completing adjustments.
```

---

## Update Batch 5: Apply Adjustments (New Service Required)

Use when a new service must be created.

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
   - Include optional options parameter
   - Add cache invalidation

5. Run verification gate after Phase 4B

Rules:
- Do NOT migrate components yet
- Do NOT modify old services
- Follow Phase 4A/4B patterns from main refactor spec

Proceed to Batch 6 (verification) after completing.
```

---

## Update Batch 6: Verification and Documentation

Final step after all adjustments.

### Prompt

```
Verify legacy update integration for <APP_NAME> and complete documentation.

Follow <APP_PATH>/docs/migration/service/legacy-update-routines.md Routine 6:

1. Run full verification gate as defined in <APP_PATH>/docs/verification-gate.md
   (This typically includes: typecheck, build, lint, tests, sanity checks)

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
   - Fix issues
   - Re-run verification

5. Complete <APP_PATH>/docs/migration/service/legacy-updates/legacy-update-YYYYMMDD-HHMMSS.md:
   - Final verification results
   - Notes on issues
   - Actions taken
   - Current refactor batch status (e.g., "Completed Batch 5")

6. Report summary:
   - Changes integrated
   - Services affected
   - New services added (if any)
   - Verification status
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
2. **Immediately refactor** via Batch 5 pattern
3. Run full verification

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
