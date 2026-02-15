# Service Refactor Lifecycle

> **Purpose:** Enterprise-level visual and procedural guide for the complete service layer refactoring lifecycle. This document provides comprehensive phase details, decision trees, verification requirements, and integration workflows for multi-app monorepo migration.

---

## Document Navigation

**This Document (Lifecycle):**

- Visual workflow with Mermaid diagrams
- Detailed phase descriptions (0-6)
- Verification gate requirements
- Legacy update integration points
- Decision trees and safety patterns

**Related Documents:**

- [`refactor-spec.md`](./refactor-spec.md) - Master specification, architecture requirements, guardrails
- [`refactor-batch-prompts.md`](./refactor-batch-prompts.md) - Copy-paste prompts for main refactor (Batch 0-7)
- [`audit.md`](./audit.md) - Service inventory (Phase 1 output)
- [`plan.md`](./plan.md) - Per-service implementation blueprint (Phase 2 output)
- [`component-migration.md`](./component-migration.md) - Component migration tracking (Phase 5)
- [`legacy-update-integration-guide.md`](./legacy-update-integration-guide.md) - Quick reference for legacy updates
- [`legacy-update-routines.md`](./legacy-update-routines.md) - Detailed legacy update workflows
- [`legacy-update-batch-prompts.md`](./legacy-update-batch-prompts.md) - Copy-paste prompts for legacy updates
- [`../verification-gate.md`](../verification-gate.md) - Per-app verification commands

---

## Lifecycle Scope

### Multi-App Applicability

This lifecycle is designed for **monorepo multi-app scenarios**. Execute the complete lifecycle **per app**:

- Each app has its own `verification-gate.md`
- Each app has its own `audit.md` and `plan.md`
- Each app progresses through phases independently
- Cross-app coordination happens at Phase 0 (verification gate setup)

### Lifecycle vs Legacy Updates

**This lifecycle describes the MAIN refactor process.** Legacy repository updates are **independent** and can occur at any time. See [Legacy Update Integration](#legacy-update-integration) section for pause/resume workflows and decision trees.

---

## Visual Lifecycle Workflow

```mermaid
flowchart TB
  classDef phase fill:#f4f6f8,stroke:#6b7280,color:#111,stroke-width:2px;
  classDef gate fill:#fff7ed,stroke:#ea580c,color:#7c2d12,stroke-width:2px;
  classDef decision fill:#ecfeff,stroke:#0ea5e9,color:#0c4a6e,stroke-width:2px;
  classDef artifact fill:#ecfdf3,stroke:#16a34a,color:#14532d,stroke-width:2px;
  classDef fix fill:#fef2f2,stroke:#dc2626,color:#7f1d1d,stroke-width:2px;
  classDef legacy fill:#fefce8,stroke:#eab308,color:#713f12,stroke-width:2px;

  A([Start: App Selected]):::phase
  B[Phase 0: Verification Gate Setup<br/>Define commands per app]:::phase
  B0[Artifact: verification-gate.md]:::artifact
  C[Phase 1: Audit Current State<br/>Inventory per service by base URL]:::phase
  C1[Artifact: audit.md]:::artifact
  D[Phase 2: Refactoring Plan<br/>Per-service blueprint]:::phase
  D1[Artifact: plan.md]:::artifact
  E[Phase 3: Implement Foundation<br/>API client + React Query setup]:::phase
  G{Verification Gate<br/>typecheck, build, lint, tests, sanity}:::gate
  F[Fix issue or rollback<br/>then re-run gate]:::fix

  A --> B --> B0 --> C --> C1 --> D --> D1 --> E --> G
  G -- pass --> S
  G -- fail --> F --> G

  subgraph S[Phases 4-6: Service Implementation & Migration]
    S1[Phase 4A: Implement API Layer<br/>ALL services first]:::phase --> G1{Verification Gate}:::gate
    G1 -- pass --> S2[Phase 4B: Query Keys and Hooks<br/>ALL services first]:::phase
    S2 --> G2{Verification Gate}:::gate
    G2 -- pass --> S3[Phase 5: Migrate Components<br/>Per component, after all services ready]:::phase
    S3 --> G3{Verification Gate<br/>After ALL migrations}:::gate
    G3 -- pass --> S4[Phase 6: Cleanup and Docs]:::phase
    S4 --> G4{Verification Gate}:::gate
    G4 -- pass --> S4a[Cleanup Verified]:::phase
    G4 -- fail --> F4[Fix issue or rollback<br/>then re-run gate]:::fix --> G4

    G1 -- fail --> F1[Fix issue or rollback<br/>then re-run gate]:::fix --> G1
    G2 -- fail --> F2[Fix issue or rollback<br/>then re-run gate]:::fix --> G2
    G3 -- fail --> F3[Fix issue or rollback<br/>then re-run gate]:::fix --> G3
  end

  S4a --> L[Final Artifacts:<br/>SERVICE_ARCHITECTURE.md<br/>SERVICE_IMPLEMENTATION_GUIDE.md<br/>SERVICE_REACTQUERY_PATTERNS.md]:::artifact
  L --> M([Done]):::phase

  %% Legacy Update Integration Points
  LEGACY[Legacy Update Can Occur<br/>at ANY phase]:::legacy
  LEGACY -.->|See Integration Section| C
  LEGACY -.->|See Integration Section| D
  LEGACY -.->|See Integration Section| E
  LEGACY -.->|See Integration Section| S1
  LEGACY -.->|See Integration Section| S2
  LEGACY -.->|See Integration Section| S3
  LEGACY -.->|See Integration Section| S4
```

**Legend:**

- **Gray boxes** = Phases
- **Orange diamonds** = Verification gates (mandatory)
- **Green boxes** = Artifacts created/updated
- **Red boxes** = Failure handling
- **Yellow box** = Legacy update integration (independent of main flow)

---

## Phase Descriptions

### Phase 0: Verification Gate Setup

**Purpose:** Define per-app verification commands and establish baseline quality gates before starting refactor.

**Scope:** Documentation only, no code changes.

**Pre-conditions:**

- App selected for refactoring
- App buildable and runnable

**Inputs:**

- App-specific commands (dev, typecheck, build, lint, test)
- Sanity check strategy (manual or automated)
- Agent skills availability

**Step-by-Step Instructions:**

1. **Identify verification commands:**
   - Typecheck: `pnpm typecheck` or equivalent
   - Build: `pnpm build` or equivalent
   - Lint: `pnpm lint` or `N/A`
   - Test: `pnpm test` or `N/A`
   - Sanity: Define manual checks or automated E2E tests

2. **Document covered routes/flows:**
   - List critical pages that sanity checks will cover
   - Define expected behaviors for each flow

3. **Check agent skills availability:**
   - `$systematic-debugging`: yes/no
   - `$vercel-react-best-practices`: yes/no

4. **Create verification gate document:**
   - Path: `<APP_PATH>/docs/verification-gate.md`
   - Use template from `refactor-spec.md`

**Outputs & Deliverables:**

- `<APP_PATH>/docs/verification-gate.md` created

**Verification Requirements:**

- None (Phase 0 is documentation only)

**Common Issues & Solutions:**

- **Issue:** No test command available
  - **Solution:** Set test command to `N/A`, rely on sanity checks

- **Issue:** Multiple build commands (client/server)
  - **Solution:** Document all commands, run all in verification gate

**Post-conditions:**

- Verification gate document exists and is complete
- Ready to proceed to Phase 1

---

### Phase 1: Audit Current State

**Purpose:** Create comprehensive inventory of all existing services, separated by service domain (base URL), to inform refactoring plan.

**Scope:** Documentation only, no code changes.

**Pre-conditions:**

- Phase 0 complete (verification gate defined)

**Inputs:**

- Existing codebase
- Environment variables (for base URL identification)
- `refactor-spec.md` (service boundary rules)

**Step-by-Step Instructions:**

1. **Identify service boundaries by base URL:**
   - One service per base URL (not per folder structure)
   - Check env vars for `NEXT_PUBLIC_*_BASE_URL` patterns
   - Group endpoints by base URL

2. **For each service, audit:**
   - All service files and locations
   - All API endpoints used
   - Hardcoded API calls in components/hooks
   - Types and interfaces
   - Base URL usage and client instances

3. **Create audit document:**
   - Path: `<APP_PATH>/docs/migration/service/audit.md`
   - One section per service
   - Include endpoint listing, types, file locations, pain points

4. **Assess complexity per service:**
   - Low: < 10 endpoints, simple types
   - Medium: 10-30 endpoints, moderate complexity
   - High: > 30 endpoints, complex types, breaking changes

**Outputs & Deliverables:**

- `<APP_PATH>/docs/migration/service/audit.md` created
- Service inventory with per-service sections
- Complexity assessment per service

**Verification Requirements:**

- None (Phase 1 is documentation only)

**Common Issues & Solutions:**

- **Issue:** Multiple folders share same base URL
  - **Solution:** Merge into ONE service (not separate services)

- **Issue:** Hardcoded API calls scattered in components
  - **Solution:** Document all locations, prioritize migration

**Post-conditions:**

- Complete service inventory available
- Service boundaries clearly defined
- Ready to proceed to Phase 2

---

### Phase 2: Create Refactoring Plan

**Purpose:** Generate enterprise refactoring blueprint with per-service implementation details.

**Scope:** Documentation only, no code changes.

**Pre-conditions:**

- Phase 1 complete (audit exists)

**Inputs:**

- `audit.md` (service inventory)
- `refactor-spec.md` (architecture requirements)

**Step-by-Step Instructions:**

1. **Define directory structure:**
   - Show complete file tree for colocated architecture
   - Explain each layer (api, hooks, query-keys)

2. **Map base URLs to services:**
   - List each service with its base URL
   - Confirm which API client instance to use

3. **Create per-service plans:**
   For each service from audit:
   - Service name and scope
   - Base URL mapping
   - Endpoints list
   - Types list
   - Query keys outline
   - Hooks plan (queries + mutations)

4. **Create implementation checklist:**
   - Phase 3: Foundation
   - Phase 4A: API layer (all services)
   - Phase 4B: Hooks (all services)
   - Phase 5: Component migration
   - Phase 6: Cleanup and docs

5. **Add code examples:**
   - Complete service example
   - Query hook example
   - Mutation hook example

**Outputs & Deliverables:**

- `<APP_PATH>/docs/migration/service/plan.md` created
- Per-service implementation blueprint
- Code examples and patterns

**Verification Requirements:**

- None (Phase 2 is documentation only)

**Common Issues & Solutions:**

- **Issue:** Unclear which endpoints belong to which service
  - **Solution:** Review audit.md base URL grouping

- **Issue:** Too many services (> 15)
  - **Solution:** Review service boundaries, consider if some can merge

**Post-conditions:**

- Complete implementation blueprint available
- Ready to proceed to Phase 3 (first code changes)

---

### Phase 3: Implement Foundation

**Purpose:** Set up shared infrastructure (API client and TanStack Query) for all services.

**Scope:** Foundation code only, no service implementations yet.

**Pre-conditions:**

- Phase 2 complete (plan exists)
- Verification gate defined

**Inputs:**

- `plan.md` (base URL mappings)
- `refactor-spec.md` (technology stack)

**Step-by-Step Instructions:**

1. **Install dependencies:**

   ```bash
   pnpm add @tanstack/react-query @tanstack/react-query-devtools
   pnpm add zod  # optional
   pnpm add axios  # if needed
   ```

2. **Create API client:**
   - `src/lib/api-client/client.ts` - Base Axios instance
   - `src/lib/api-client/config.ts` - Base URLs from env
   - `src/lib/api-client/interceptors/auth.interceptor.ts` - Token handling
   - `src/lib/api-client/interceptors/error.interceptor.ts` - Error transformation
   - `src/lib/api-client/interceptors/logger.interceptor.ts` (optional)

3. **Create React Query setup:**
   - `src/lib/react-query/query-client.ts` - QueryClient with defaults
   - `src/lib/react-query/query-provider.tsx` - Provider wrapper
   - `src/lib/react-query/devtools.tsx` - DevTools (dev only)

4. **Integrate into app:**
   - Wrap app with QueryProvider
   - Add DevTools in development mode

5. **Compatibility check:**
   - Keep existing client compatible or re-export from new setup
   - Do NOT modify old services or components

**Outputs & Deliverables:**

- `src/lib/api-client/` created with full setup
- `src/lib/react-query/` created with providers
- App wrapped with QueryProvider

**Verification Requirements:**

- **Mandatory Gate:** Run full verification gate after Phase 3
- Typecheck passes
- Build succeeds
- App still runs (no breaking changes)
- DevTools accessible in dev mode

**Common Issues & Solutions:**

- **Issue:** Build fails due to missing providers
  - **Solution:** Ensure QueryProvider wraps entire app tree

- **Issue:** Existing interceptors conflict
  - **Solution:** Re-export from new setup, maintain compatibility

**Post-conditions:**

- Foundation infrastructure ready
- Verification gate passed
- Ready to proceed to Phase 4A

---

### Phase 4A: Implement API Layer (All Services First)

**Purpose:** Implement API layer (endpoints, types, service functions) for ALL services before hooks.

**Scope:** API layer only, no hooks yet, no component changes.

**Pre-conditions:**

- Phase 3 complete and verified
- Foundation infrastructure ready

**Inputs:**

- `plan.md` (per-service endpoints, types)
- Foundation API client

**Step-by-Step Instructions:**

**For EACH service** (repeat until all services complete):

1. **Create service directory:**

   ```
   src/services/[service-name]/api/
   ```

2. **Create endpoints file:**
   - `[service].endpoints.ts`
   - Export URL constants
   - Use template literals for dynamic routes

3. **Create types file:**
   - `[service].types.ts`
   - Define request/response interfaces
   - Add Zod schemas if using validation

4. **Create service file:**
   - `[service].service.ts`
   - Import API client with correct base URL
   - Export service object with API functions
   - Use types from `[service].types.ts`

5. **Do NOT:**
   - Modify old services
   - Modify components
   - Create hooks yet (that's Phase 4B)

**Outputs & Deliverables:**

- `src/services/[service]/api/` for all services
- Endpoints, types, and service files complete
- No hooks created yet

**Verification Requirements:**

- **Mandatory Gate:** Run full verification gate after Phase 4A completes for ALL services
- Typecheck passes
- Build succeeds
- No runtime errors (app still works)

**Common Issues & Solutions:**

- **Issue:** Circular dependencies between services
  - **Solution:** Use shared types in `src/types/`

- **Issue:** Dynamic base URLs not configurable
  - **Solution:** Use config.ts to centralize base URL logic

**Post-conditions:**

- API layer complete for all services
- Verification gate passed
- Ready to proceed to Phase 4B

---

### Phase 4B: Implement Query Keys + Hooks (All Services First)

**Purpose:** Implement query keys and hooks (queries + mutations) for ALL services.

**Scope:** Hooks only, no component changes yet.

**Pre-conditions:**

- Phase 4A complete and verified
- API layer exists for all services

**Inputs:**

- `plan.md` (hooks outline per service)
- API layer from Phase 4A

**Step-by-Step Instructions:**

**For EACH service** (repeat until all services complete):

1. **Create query-keys file:**
   - `src/services/[service]/query-keys.ts`
   - Export query key factory
   - Use hierarchical key structure

2. **Create query hooks:**
   - `src/services/[service]/hooks/queries/`
   - One file per GET endpoint
   - Use `useQuery` from TanStack Query
   - Accept optional `options` param for composition

3. **Create mutation hooks:**
   - `src/services/[service]/hooks/mutations/`
   - One file per POST/PUT/DELETE endpoint
   - Use `useMutation` from TanStack Query
   - Add cache invalidation logic
   - Accept optional `options` param, compose `onSuccess`

4. **Create hook barrel files:**
   - `src/services/[service]/hooks/queries/index.ts`
   - `src/services/[service]/hooks/mutations/index.ts`

5. **Hook signature rules:**
   - Queries: `options?: Omit<UseQueryOptions<...>, 'queryKey' | 'queryFn'>`
   - Mutations: `options?: UseMutationOptions<...>`
   - Always spread `...options` in hook
   - For mutations with `onSuccess`, call `options?.onSuccess` inside

6. **Do NOT:**
   - Modify old services
   - Modify components yet (that's Phase 5)

**Outputs & Deliverables:**

- `query-keys.ts` for all services
- `hooks/queries/` for all services
- `hooks/mutations/` for all services
- `hooks/queries/index.ts` and `hooks/mutations/index.ts` for all services

**Verification Requirements:**

- **Mandatory Gate:** Run full verification gate after Phase 4B completes for ALL services
- Typecheck passes
- Build succeeds
- No runtime errors

**Common Issues & Solutions:**

- **Issue:** Query keys not invalidating correctly
  - **Solution:** Review hierarchical key structure

- **Issue:** TypeScript errors on hook options
  - **Solution:** Verify `Omit` types are correct

**Post-conditions:**

- Hooks complete for all services
- Verification gate passed
- Ready to proceed to Phase 5

---

### Phase 5: Migrate Components

**Purpose:** Update components to use new hooks, one feature/component at a time.

**Scope:** Component migrations only, after all services ready.

**Pre-conditions:**

- Phase 4A and 4B complete and verified
- All services have API layer + hooks

**Inputs:**

- New service hooks
- Existing components using old patterns

**Step-by-Step Instructions:**

1. **Identify migration order:**
   - Start with simple read-only components
   - Then forms and mutations
   - Save complex workflows for last

2. **Migrate one component at a time:**

   ```typescript
   // ❌ Old pattern
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   useEffect(() => { /* fetch data */ }, []);

   // ✅ New pattern
   import { useServiceData } from '@/services/service/hooks/queries';
   const { data, isLoading } = useServiceData({ filters });
   ```

3. **Update form submissions:**

   ```typescript
   // ❌ Old pattern
   const handleSubmit = async (values) => {
     setLoading(true);
     await oldService.update(values);
     setLoading(false);
     refetch();
   };

   // ✅ New pattern
   const { mutate, isPending } = useUpdateData();
   const handleSubmit = (values) => {
     mutate(values, {
       onSuccess: () => { /* automatic cache invalidation */ }
     });
   };
   ```

4. **Enforce service hook consumption:**
   - Replace manual `useQuery`/`useMutation` usage in components with custom hooks from `services/*/hooks/{queries,mutations}` when equivalent hooks are available
   - If a manual wrapper is still required, document the reason in `component-migration.md`

5. **Test each component after migration:**
   - Page loads without errors
   - Data fetching works
   - User interactions work
   - No console/network errors

6. **Track migrations:**
   - Update `component-migration.md` for each component
   - Mark verification status per component

7. **Do NOT:**
   - Delete old services yet (wait for Phase 6)
   - Migrate all at once (incremental only)

**Outputs & Deliverables:**

- All components migrated to new hooks
- `component-migration.md` fully updated
- Old service imports removed from all components

**Verification Requirements:**

- **Mandatory Gate:** Run full verification gate AFTER ALL component migrations complete
- Typecheck passes
- Build succeeds
- All critical user flows work
- No regressions detected

**Common Issues & Solutions:**

- **Issue:** Component breaks after migration
  - **Solution:** Test thoroughly before committing, rollback if needed

- **Issue:** Loading states not working correctly
  - **Solution:** Use `isLoading`, `isFetching`, `isPending` appropriately

**Post-conditions:**

- All components using new hooks
- Verification gate passed
- Ready to proceed to Phase 6

---

### Phase 6: Cleanup & Documentation

**Purpose:** Remove old code and create permanent documentation.

**Scope:** Cleanup and final docs only.

**Pre-conditions:**

- Phase 5 complete and verified
- 100% of components migrated

**Inputs:**

- Old service files (to be deleted)
- Refactored codebase

**Step-by-Step Instructions:**

1. **Delete old service files:**
   - Remove old service files from `src/services/`
   - Remove old HTTP client wrappers
   - Keep only new colocated structure

**Principle:** Old and new services coexist until Phase 6.

**Implementation:**

- Keep old services untouched in original locations
- Create new services in `src/services/[service]/`
- Both old and new code paths work simultaneously
- Delete old services ONLY after 100% component migration

**Benefit:** Easy rollback, incremental migration, no breaking changes

### Incremental Migration

**Rules:**

- Migrate ONE service at a time (Phase 4A/4B)
- Migrate ONE component at a time (Phase 5)
- Never big-bang switch
- Test after each migration step

**Benefit:** Isolated failures, easy to identify root cause

### Rollback Procedures

**When to rollback:**

- Verification gate fails catastrophically
- Fix would expand scope significantly
- Team decides to reassess approach

**How to rollback:**

```bash
# Identify safe commit
git log --oneline

# Rollback migrate/* branch
git reset --hard <commit-before-phase>
git push -f origin migrate/<app-name>
```

**After rollback:**

- Document why rollback occurred
- Update task.md with new status
- Reassess approach or consult team

### Checkpoint Documentation

**At each phase transition, document:**

- Phase completed
- Verification gate results
- Any issues encountered and resolutions
- Next phase to start

**In task.md:**

```markdown
## Phase 4A Complete

- Status: ✅ Complete
- Services implemented: claims, policy, transaction
- Verification: All passed
- Issues: None
- Next: Phase 4B (hooks)
- Timestamp: 2026-02-15 03:00:00
```

---

## Quick Reference

### Phase Checklist (One-Line Summary)

- [ ] **Phase 0:** Define verification commands → `verification-gate.md`
- [ ] **Phase 1:** Audit services by base URL → `audit.md`
- [ ] **Phase 2:** Create per-service plan → `plan.md`
- [ ] **Phase 3:** Implement foundation → `src/lib/` + **Gate**
- [ ] **Phase 4A:** Implement API layer for all services → **Gate**
- [ ] **Phase 4B:** Implement hooks for all services → **Gate**
- [ ] **Phase 5:** Migrate all components → **Gate**
- [ ] **Phase 6:** Cleanup and docs → **Gate**

### Common Commands

**Verification:**

```bash
pnpm typecheck
pnpm build
pnpm lint
pnpm test
pnpm dev  # manual sanity check
```

**Git (legacy updates):**

```bash
git checkout integrate/<app-name>
git subtree pull --prefix=apps/<app-name> <remote> <branch>
git checkout migrate/<app-name>
git merge integrate/<app-name>
```

**Rollback:**

```bash
git reset --hard <safe-commit>
git push -f origin migrate/<app-name>
```

### Document Cross-Reference

- **Specification:** [`refactor-spec.md`](./refactor-spec.md) - Master spec, architecture, guardrails
- **Main Prompts:** [`refactor-batch-prompts.md`](./refactor-batch-prompts.md) - Copy-paste prompts for main refactor
- **Audit:** [`audit.md`](./audit.md) - Service inventory (Phase 1 output)
- **Plan:** [`plan.md`](./plan.md) - Implementation blueprint (Phase 2 output)
- **Component Tracking:** [`component-migration.md`](./component-migration.md) - Migration tracking (Phase 5)
- **Legacy Updates:** [`legacy-update-integration-guide.md`](./legacy-update-integration-guide.md) - Quick reference
- **Legacy Routines:** [`legacy-update-routines.md`](./legacy-update-routines.md) - Detailed workflows
- **Legacy Prompts:** [`legacy-update-batch-prompts.md`](./legacy-update-batch-prompts.md) - Copy-paste prompts
- **Verification:** [`../verification-gate.md`](../verification-gate.md) - Per-app commands

### Troubleshooting Index

**Build Failures:**

- [Phase 3: Foundation](#phase-3-implement-foundation) - Provider integration
- [Phase 4A: API Layer](#phase-4a-implement-api-layer-all-services-first) - Circular dependencies
- [Phase 6: Cleanup](#phase-6-cleanup--documentation) - Broken imports

**Type Errors:**

- [Phase 4A: API Layer](#phase-4a-implement-api-layer-all-services-first) - Type definitions
- [Phase 4B: Hooks](#phase-4b-implement-query-keys--hooks-all-services-first) - Hook options types

**Runtime Errors:**

- [Phase 5: Component Migration](#phase-5-migrate-components) - Migration patterns
- [Verification Gates](#verification-gates) - Gate failure handling

**Legacy Update Conflicts:**

- [Legacy Update Integration](#legacy-update-integration) - Risk matrix and workflows
- [Pause/Resume Workflow](#pauseresume-workflow) - How to pause/resume

**Rollback:**

- [Failure Handling Workflow](#failure-handling-workflow-fix-first-approach) - When and how to rollback

---

## Notes

**Multi-App Reminder:**

- This lifecycle repeats **per app** in the monorepo
- Each app has its own `verification-gate.md`, `audit.md`, `plan.md`
- Cross-app coordination happens at Phase 0

**Legacy Updates:**

- Can occur at **any time** during refactor
- Use separate batch sequence (see `legacy-update-batch-prompts.md`)
- Pause main refactor → integrate update → resume

**Safety First:**

- Verification gates are **mandatory**
- Fix-first approach before rollback
- Incremental migration only (no big-bang)
- Document all significant decisions
