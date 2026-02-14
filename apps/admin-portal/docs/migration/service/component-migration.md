# Component Migration Tracking - admin-portal

> **Purpose:** Centralized tracking for ALL component migrations (main refactor Batch 6 AND incremental legacy update Batch 5A). This is the single source of truth for component migration status and history.

---

## Status Overview

- **Main Refactor (Batch 6):** Not Started
- **Total Components Migrated (Main):** 0
- **Incremental Updates:** 0
- **Last Updated:** N/A

---

## Main Refactor: Batch 6 Component Migration

### Migration Summary

- **Started:** YYYY-MM-DD HH:MM
- **Completed:** YYYY-MM-DD HH:MM (or "In Progress")
- **Total Services:** X
- **Total Components:** Y
- **Status:** ⏸️ Not Started / 🔄 In Progress / ✅ Complete

### Components Migrated by Service

#### Service: [service-name]

**Service Base URL:** `[base URL from audit.md]`

**Components:**

- [ ] `src/path/to/component.tsx` - [Brief description]
  - **Before:** [Old pattern, e.g., "useState + useEffect"]
  - **After:** [New hook, e.g., "useServiceData"]
  - **Verified:** ⏸️ / ✅ / ❌
  - **Issues:** [None or describe]

- [ ] `src/path/to/another.tsx` - [Brief description]
  - **Before:** [Old pattern]
  - **After:** [New hook]
  - **Verified:** ⏸️ / ✅ / ❌
  - **Issues:** [None or describe]

_(Repeat for all services)_

### Migration Patterns Applied

- [ ] Replaced `useState + useEffect` with `useQuery` hooks
- [ ] Replaced manual mutations with `useMutation` hooks
- [ ] Automatic cache invalidation working
- [ ] Loading/error states from hooks
- [ ] Optimistic updates (where applicable)

### Components NOT Migrated

_(List any components that were intentionally not migrated with reasons)_

- `src/path/to/legacy.tsx` - [Reason, e.g., "Deprecated, will be removed in next sprint"]

### Verification Results

#### Per-Component Verification

- **Total components migrated:** X
- **Components with issues:** Y (all fixed / N pending)
- **Components rolled back:** Z

#### Full Verification Gate

- **Typecheck:** ⏸️ / ✅ / ❌
- **Build:** ⏸️ / ✅ / ❌ (build time: Xs)
- **Tests:** ⏸️ / ✅ / ❌ (X/Y passed)
- **Lint:** ⏸️ / ✅ / ❌
- **Sanity Check:** ⏸️ / ✅ / ❌
  - [Critical flow 1]: ⏸️ / ✅ / ❌
  - [Critical flow 2]: ⏸️ / ✅ / ❌
  - [Critical flow 3]: ⏸️ / ✅ / ❌

### Issues Encountered

_(Document any issues during migration and how they were resolved)_

#### Issue 1: [Title]

- **Component:** `src/path/to/component.tsx`
- **Cause:** [Description]
- **Fix:** [Solution]
- **Status:** ✅ Resolved / ⏸️ Pending

### Next Steps

- [x] Batch 6 complete
- [ ] Proceed to Batch 7 (Cleanup)

---

## Incremental Updates: Legacy Update Component Migrations

_(This section tracks component migrations from legacy update Batch 5A)_

### Update: YYYY-MM-DD HH:MM ([Service Name] - Batch 5A)

**Context:** [Brief description of what was added from legacy repo]

**Legacy Update Reference:** [`legacy-updates/legacy-update-YYYYMMDD-HHMMSS.md`](./legacy-updates/legacy-update-YYYYMMDD-HHMMSS.md)

**New Service Created:** `[service-name]`

**Components Migrated:**

- [x] `src/path/to/component.tsx` - [Description]
  - **Before:** [Old pattern]
  - **After:** [New hook from new service]
  - **Verified:** ✅

- [x] `src/path/to/another.tsx` - [Description]
  - **Before:** [Old pattern]
  - **After:** [New hook]
  - **Verified:** ✅

**Verification:** ✅ All passed (Typecheck, Build, Tests, Sanity)

**Issues:** None / [Describe if any]

---

### Update: YYYY-MM-DD HH:MM ([Next Service] - Batch 5A)

_(Template for future incremental updates - copy and fill in)_

**Context:** [Brief description]

**Legacy Update Reference:** [`legacy-updates/legacy-update-YYYYMMDD-HHMMSS.md`](./legacy-updates/legacy-update-YYYYMMDD-HHMMSS.md)

**New Service Created:** `[service-name]`

**Components Migrated:**

- [x] `[component-path]` - [Description]

**Verification:** ✅ / ❌

**Issues:** [None or describe]

---

## Migration History Summary

| Date       | Type             | Service      | Components   | Status | Reference                                                                      |
| ---------- | ---------------- | ------------ | ------------ | ------ | ------------------------------------------------------------------------------ |
| YYYY-MM-DD | Main Batch 6     | All services | X components | ✅     | (this doc)                                                                     |
| YYYY-MM-DD | Incremental (5A) | [service]    | Y components | ✅     | [legacy-update-YYYYMMDD.md](./legacy-updates/legacy-update-YYYYMMDD-HHMMSS.md) |

---

## Notes

- **Main Batch 6** migrates ALL components to use services created in Batch 4-5
- **Incremental Batch 5A** migrates ONLY components affected by new service from legacy update
- Each migration must pass verification gate before marking complete
- See [`refactor-batch-prompts.md`](./refactor-batch-prompts.md) for main refactor guidance
- See [`legacy-update-batch-prompts.md`](./legacy-update-batch-prompts.md) for incremental update guidance

---

## Related Documents

**Main Refactor:**

- [`refactor-spec.md`](./refactor-spec.md) - Master specification (Phase 5-6)
- [`refactor-batch-prompts.md`](./refactor-batch-prompts.md) - Batch 6-7 prompts
- [`plan.md`](./plan.md) - Services planned for migration

**Incremental Updates:**

- [`legacy-update-batch-prompts.md`](./legacy-update-batch-prompts.md) - Batch 5A prompt
- [`legacy-update-routines.md`](./legacy-update-routines.md) - Routine 5A details
- [`legacy-updates/`](./legacy-updates/) - Legacy update logs
