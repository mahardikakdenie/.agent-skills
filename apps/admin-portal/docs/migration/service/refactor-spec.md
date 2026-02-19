# Service Refactor Specification

> **Purpose:** This document is the specification for refactoring the service layer to a colocated architecture with TanStack Query integration. It is the single source of truth for scope, requirements, and process.

---

## Specification Overview

This specification defines how to refactor the service layer in this project to implement a **colocated architecture** with the following goals:

Lifecycle diagram: `<APP_PATH>/docs/migration/service/refactor-lifecycle.md` (Mermaid).

### Multi-App Applicability

This spec is designed to be reused across **multiple apps** in a monorepo. Every step, audit, plan, and verification must be executed **per app**.

### Related Documents

**Main Refactor Lifecycle:**

- `<APP_PATH>/docs/migration/service/refactor-lifecycle.md` - Visual lifecycle diagram
- `<APP_PATH>/docs/migration/service/refactor-batch-prompts.md` - Main refactor batch prompts (Batch 0-7)
- `<APP_PATH>/docs/migration/service/component-migration.md` - Component migration tracking (Batch 6 + 5A)
- `<APP_PATH>/docs/verification-gate.md` - Per-app verification commands

**Legacy Repository Updates:**

- `<APP_PATH>/docs/migration/service/legacy-update-integration-guide.md` - Quick reference for integrating legacy updates
- `<APP_PATH>/docs/migration/service/legacy-update-routines.md` - Detailed update routines
- `<APP_PATH>/docs/migration/service/legacy-update-batch-prompts.md` - Copy-paste update prompts

> [!NOTE]
> Legacy updates are **independent of refactor phases** and can occur at any time. See `legacy-update-integration-guide.md` for pause/resume workflow and decision logic.

### App-Specific Inputs (Fill Per App)

For each app, define these inputs before implementation:

- App name and root path
- Dev command
- Typecheck command
- Build command
- Lint command
- Test command (or `N/A`)
- Optional sanity checks (manual or automated) and covered routes/flows
- **Service boundary mapping (required):** list each **base URL** (env var or absolute URL) and the **service name** you will use for it.  
  **Rule:** One service per base URL. If multiple domains/features share a base URL, they are **one service** with subdomains, not separate services.

### Documentation Grouping (Best Practice)

Refactor-specific docs are temporary and must be grouped separately to avoid mixing with permanent project docs.

Use this structure per app:

- `<APP_PATH>/docs/migration/service/audit.md` (temporary)
- `<APP_PATH>/docs/migration/service/plan.md` (temporary)
- `<APP_PATH>/docs/verification-gate.md` (temporary)

Permanent docs remain in `docs/`:

- `docs/ARCHITECTURE.md`
- `docs/ADDING_SERVICES.md`
- `docs/QUERY_PATTERNS.md`

### Primary Goals

1. **Code Splitting & Separation of Concerns** - Organize code by domain/service
2. **Scalability** - Easy to add new services without touching existing code
3. **Maintainability** - Clear structure, easy to navigate and understand
4. **Developer Experience** - Colocated files (everything for one domain in one place)
5. **TanStack Query Integration** - Modern data fetching with caching

### Definition of Done (Full Refactor)

A refactor is **complete** only when all of the following are true:

1. **All audited services** are implemented in the new colocated architecture.
2. **All components** are migrated to use the new service hooks.
3. **Old services are removed** only after 100% migration is complete.
4. **App behavior is unchanged** from a user perspective (no breaking changes).
5. **All verification gates pass** for the app.

### Safety Requirements

- All changes must be **incremental and verified** after each step.
- Implementation is **per service**; component migration is **per component**. Never a big-bang switch.
- If verification fails, **fix the issue and re-verify** before continuing.
- **Rollback** is a last resort when a fix cannot be made safely in the current step.

### Verification Gate (Mandatory)

Each step must pass a verification gate before continuing.

Rules:

- The gate is required after Phase 3 (Foundation), after Phase 4A (API layer for all services), after Phase 4B (hooks for all services), after all component migrations in Phase 5, and after Phase 6 (Cleanup).
- If any check fails, **fix and re-run the gate** before proceeding.
- Rollback is only used if a safe fix is not possible within the step.
- If the exact commands are not defined yet, the assistant must ask and the gate must be defined before continuing.

Verification Gate Template (fill in per app, created in Batch 0):

- Typecheck: `<command>`
- Build: `<command>`
- Tests: `<command or N/A>`
- Lint: `<command or N/A>`
- Sanity check: `<command or N/A>`
- Sanity coverage: list pages/routes and critical flows covered (if any)
- Console/network errors: must be none on previously working pages
- Agent skills available: `systematic-debugging = yes/no`, `vercel-react-best-practices = yes/no`

### Failure Handling (Fix-First)

When a verification gate fails:

1. **Diagnose and fix** the issue in the most localized way.
2. **Re-run the same gate** after the fix.
3. If the fix is safe and passes, **continue** with the next step.
4. If the fix is not safe or would create scope creep, **rollback the last change** and reassess.

Rollback is a **temporary safety brake**, not the end state. The goal is always to fix and proceed until full refactor is complete.

### Optional Agent Skills (If Installed)

These skills are optional. Use them **only if available** on the dev environment.

- `$systematic-debugging`: Mandatory process for any test failure, bug, or unexpected behavior before proposing fixes.
- `$vercel-react-best-practices`: Apply when refactoring React/Next.js components or data fetching to preserve performance.

### Architecture Requirements

**Use Service-Based Colocation:**

```
src/
├── lib/                    # Shared infrastructure
│   ├── api-client/        # HTTP client
│   └── react-query/       # QueryClient setup
├── services/              # Domain services (colocated)
│   └── [service-name]/
│       ├── api/              # API calls, types, endpoints
│       ├── hooks/            # React Query hooks
│       │   ├── queries/      # useQuery hooks
│       │   │   └── index.ts  # Query hook barrel
│       │   ├── mutations/    # useMutation hooks
│       │   │   └── index.ts  # Mutation hook barrel
│       └── query-keys.ts     # TanStack Query keys (service-level)
├── types/                 # Shared types
├── utils/                 # Shared utilities
└── hooks/                 # Shared hooks
```

### Technology Stack

- **TypeScript** - Strongly typed (use `any` only when intentionally needed with clear justification)
- **TanStack Query** - Data fetching & caching
- **Axios** - HTTP client
- **Zod** (optional) - Runtime validation

---

## ️ Guardrails: No Breaking Changes

**CRITICAL:** All refactoring must maintain 100% backward compatibility until migration is complete.

### Non-Breaking Change Requirements

1. **Dual-Mode Operation**
   - Keep old services running alongside new ones
   - Both old and new code paths must work simultaneously
   - No deletion of old code until ALL components are migrated

2. **Incremental Migration**
   - Migrate one service/component at a time
   - Test each migration independently
   - Can rollback any single migration without affecting others

3. **API Compatibility**
   - New service functions must return same data structure as old ones
   - If data transformation needed, wrap old services, don't break them
   - All existing function signatures must remain available

4. **Testing Before Migration**
   - Test new service implementation before component migration
   - Verify data fetching works identically to old service
   - Check error handling matches old behavior

5. **Validation Steps Per Phase**
   - After Foundation (Phase 3): Verify app still runs
   - After Phase 4A (API layer for all services): Verify app still runs
   - After Phase 4B (hooks for all services): Verify app still runs
   - After all Component Migrations (Phase 5): Verify all features still work
   - After Cleanup (Phase 6): Run the full verification gate

6. **Rollback Plan**
   - Keep old code in separate files (don't modify)
   - New code in new locations
   - Easy to revert by changing imports

7. **Feature Stability Check**

   ```bash
   # Before starting refactoring, document all features:
   # - List all working pages/routes
   # - List all CRUD operations
   # - List all user workflows

   # After refactoring, verify:
   # ✅ All pages still load
   # ✅ All CRUD operations work
   # ✅ All user workflows complete successfully
   ```

### Migration Checklist Per Service

- [ ] Create new service structure (don't touch old)
- [ ] Implement API layer and hooks for the service
- [ ] Test new service independently
- [ ] Repeat for all services before migrating components
- [ ] Migrate ONE component to use new service
- [ ] Test that component thoroughly
- [ ] If works: continue migration
- [ ] If breaks: fix or rollback
- [ ] Only after ALL components migrated: delete old service

### Mandatory Verification Per Step

For every required gate (Phase 3, Phase 4A, Phase 4B, after all component migrations in Phase 5, and Phase 6):

- [ ] Typecheck/build (or the closest equivalent).
- [ ] Verify relevant page/routes still load.
- [ ] Verify related CRUD flows work.
- [ ] Check for console/network errors.
- [ ] If no automated tests exist, do targeted manual checks and document them.

### Red Flags (Stop Immediately If You See)

- ❌ App won't build
- ❌ TypeScript errors in existing working code
- ❌ Runtime errors on previously working pages
- ❌ Any feature that worked before stops working
- ❌ Breaking changes to existing component props/APIs

### Safe Refactoring Pattern

```typescript
// ✅ CORRECT: Add new, keep old
// Old service (keep untouched)
export const oldClaimService = { ... };

// New service (in new location)
import { claimsService } from '@/services/claims/api/claims.service';

// ❌ WRONG: Modify existing
// Don't change existing service files during migration
```

---

## 🔄 Refactoring Process

### Phase 1: Audit Current State (Per Service)

**Task:** Create a comprehensive audit of all existing services, separated by service/domain.

**Instructions:**

1. Traverse the entire codebase to identify, **for each service/domain**:
   - **Service boundaries are defined by base URL** (env var or absolute URL). Do **not** mirror current folder/service file naming if they share the same base URL.
   - All service files and their locations
   - All API endpoints used
   - Hardcoded API calls in components/hooks
   - Types and interfaces used
   - Base URL usage and client instances

2. Create `<APP_PATH>/docs/migration/service/audit.md` with **per-service sections**:
   - Complete service inventory (grouped by service)
   - Endpoint listing per service
   - Current architecture patterns per service
   - Pain points and technical debt per service
   - Migration complexity matrix per service

**Deliverable:** A markdown file documenting all services, endpoints, and refactoring priorities **separated per service**.

---

### Phase 2: Create Refactoring Plan (Per Service)

**Task:** Generate the refactoring blueprint **with per-service separation**.

**Instructions:**

1. Create `<APP_PATH>/docs/migration/service/plan.md` with:
   - Directory structure (colocated by service)
   - Implementation checklist (Phase 3-6, including 4A/4B)
   - Code examples for each layer
   - Success metrics
   - **Per-service sections** that include:
     - Service name and scope
     - Base URL mapping
     - Endpoints list
     - Types list
     - Query keys outline
     - Hooks plan (queries + mutations)

2. The plan should include:
   - **Phase 3:** Foundation (lib setup)
   - **Phase 4A:** API Layer (all services first)
   - **Phase 4B:** Query Keys + Hooks (all services first)
   - **Phase 5:** Component Migration
   - **Phase 6:** Cleanup and Documentation

**Template Structure:**

```markdown
# Service Layer Refactoring

## Why Colocation?

- Explain old vs new structure
- Benefits of colocated architecture

## Directory Structure

- Show complete file tree
- Explain each layer

## API Base URL Mapping (Per Service)

- List each service with its base URL
- Confirm which API client instance should be used

## Implementation Checklist

- Detailed steps per phase
- Code examples
- Per-service template

## Per-Service Plan

- Service: <name>
  - Base URL:
  - Endpoints:
  - Types:
  - Query Keys:
  - Queries:
  - Mutations:

## Example: Complete Service

- Full directory structure
- Usage examples
```

**Deliverable:** A comprehensive, reusable refactoring plan document **with per-service separation**.

---

### Phase 3: Implement Foundation

**Task:** Set up shared infrastructure

**Instructions:**

1. Install dependencies:

   ```bash
   npm install @tanstack/react-query @tanstack/react-query-devtools
   npm install zod  # optional
   npm install axios  # if needed
   ```

2. Create `src/lib/api-client/client.ts`:
   - Base Axios instance
   - Request/response interceptors
   - Auth token injection
   - Error handling

3. Create `src/lib/api-client/config.ts`:
   - Base URLs from environment variables
   - Timeout configurations
   - Default headers

4. **Service-Specific API Clients:**
   - Each service should use a dedicated API client instance (or a shared instance that is explicitly bound to the service base URL).
   - API base URLs must be **mapped per service** in the refactoring plan and used consistently in each service's API layer.

5. Create `src/lib/api-client/interceptors/`:
   - `auth.interceptor.ts` - Token management
   - `error.interceptor.ts` - Error transformation
   - `logger.interceptor.ts` - Request logging (optional)

6. Create `src/lib/react-query/query-client.ts`:
   - QueryClient with default options
   - Cache time, stale time, retry logic

7. Create `src/lib/react-query/query-provider.tsx`:
   - Provider component wrapper

8. Create `src/lib/react-query/devtools.tsx`:
   - DevTools component (dev only)

**Deliverable:** Working foundation with HTTP client and TanStack Query setup.

---

### Phase 4A: Implement API Layer (All Services First)

**Task:** Implement the API layer for all services before any component migration.

**Per-Service Instructions:**

For each service (e.g., `claims`), create:

```
services/claims/
├── api/
│   ├── claims.endpoints.ts    # URL constants
│   ├── claims.types.ts        # TypeScript interfaces
│   ├── claims.validators.ts   # Zod schemas (optional)
│   └── claims.service.ts      # API functions
```

**Example `claims.endpoints.ts`:**

```typescript
export const CLAIMS_ENDPOINTS = {
  list: '/v1/claims',
  detail: (id: string) => `/v1/claims/${id}`,
  updateStatus: (id: string) => `/v1/claims/update-status/${id}`,
} as const;
```

**Example `claims.service.ts`:**

```typescript
import { createApiClient, API_BASE_URLS } from '@/lib/api-client';

import { CLAIMS_ENDPOINTS } from './claims.endpoints';
import type { Claim, ClaimFilters } from './claims.types';

const claimsApi = createApiClient({ baseURL: API_BASE_URLS.claims });

export const claimsService = {
  getClaims: (filters: ClaimFilters) =>
    claimsApi.get<Claim[]>(CLAIMS_ENDPOINTS.list, { params: filters }),

  getClaimById: (id: string) => claimsApi.get<Claim>(CLAIMS_ENDPOINTS.detail(id)),
};
```

Rules:

- Implement **all services** in the audit before moving to Phase 4B.
- Do not modify old services or components.
- Run the verification gate after Phase 4A completes.

### Phase 4B: Implement Query Keys + Hooks (All Services First)

**Task:** Implement query keys and hooks for all services before any component migration.

**First, create `query-keys.ts` at service root:**

```
services/claims/query-keys.ts    # Service-level query keys
```

**Then, create hooks:**

```
services/claims/hooks/
├── queries/
│   ├── useClaims.ts      # List query
│   ├── useClaimById.ts   # Detail query
│   └── index.ts          # Query hook barrel
├── mutations/
│   ├── useCreateClaim.ts
│   ├── useUpdateStatus.ts
│   └── index.ts          # Mutation hook barrel
```

**Example `query-keys.ts`:**

```typescript
export const claimKeys = {
  all: ['claims'] as const,
  lists: () => [...claimKeys.all, 'list'] as const,
  list: (filters: ClaimFilters) => [...claimKeys.lists(), filters] as const,
  detail: (id: string) => [...claimKeys.all, 'detail', id] as const,
};
```

**Example `useClaims.ts`:**

```typescript
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { claimsService } from '../../api/claims.service';
import { claimKeys } from '../../query-keys';

type ClaimsResponse = Awaited<ReturnType<typeof claimsService.getClaims>>;
type ClaimsFilters = Parameters<typeof claimsService.getClaims>[0];

export function useClaims(
  filters: ClaimsFilters,
  options?: Omit<UseQueryOptions<ClaimsResponse, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: claimKeys.list(filters),
    queryFn: () => claimsService.getClaims(filters),
    ...options,
  });
}
```

**Example `useCreateClaim.ts`:**

```typescript
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { claimsService } from '../../api/claims.service';
import { claimKeys } from '../../query-keys';

type CreateClaimResponse = Awaited<ReturnType<typeof claimsService.createClaim>>;
type CreateClaimVariables = Parameters<typeof claimsService.createClaim>[0];

export function useCreateClaim(
  options?: UseMutationOptions<CreateClaimResponse, Error, CreateClaimVariables>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: claimsService.createClaim,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: claimKeys.lists() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}
```

Rules:

- Hooks must accept an optional `options` param so consumers can inject React Query options.
- Queries: use `options?: Omit<UseQueryOptions<...>, 'queryKey' | 'queryFn'>` and spread `...options` in `useQuery`.
- Mutations: use `options?: UseMutationOptions<...>` and spread `...options`. If you add `onSuccess` for invalidation, call `options?.onSuccess` inside it.
- Every service must include hook barrel files: `hooks/queries/index.ts` and `hooks/mutations/index.ts`.
- Implement hooks for **all services** before moving to Phase 5.
- Do not modify old services or components.
- Run the verification gate after Phase 4B completes.

**Implementation Order (Phases 4A-4B):**

1. Implement API layer for all services (Phase 4A)
2. Run verification gate
3. Implement query keys + hooks for all services (Phase 4B)
4. Run verification gate
5. Proceed to Phase 5

---

### Phase 5: Migrate Components

**Task:** Update components to use new hooks

**Instructions:**

1. Replace old patterns:

   ```typescript
   // ❌ Old way
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
     const fetchData = async () => {
       setLoading(true);
       const result = await claimService.getClaims();
       setData(result);
       setLoading(false);
     };
     fetchData();
   }, []);
   ```

   ```typescript
   // ✅ New way
   import { useClaims } from '@/services/claims/hooks/queries';

   const { data, isLoading } = useClaims({ status: 'pending' });
   ```

2. Begin only after Phase 4A and Phase 4B are complete for all services
3. Migrate one feature at a time
4. Remove old service imports
5. Update form submissions to use mutations
6. After all component migrations, run the full verification gate before continuing

---

### Phase 6: Cleanup & Documentation

**Task:** Remove old code and document patterns

**Instructions:**

1. Delete old service files
2. Remove old HTTP client wrappers
3. Update imports across codebase
4. Create documentation:
   - `docs/ARCHITECTURE.md` - Explain new structure
   - `docs/ADDING_SERVICES.md` - How to add new services
   - `docs/QUERY_PATTERNS.md` - TanStack Query best practices
5. Run the full verification gate after cleanup

---

## ✅ Success Criteria

### Architecture Success

- [ ] All services self-contained in own directories
- [ ] Import paths clearly show service boundaries
- [ ] Can delete services by deleting folders
- [ ] New services follow same pattern
- [ ] Strongly typed TypeScript (intentional `any` usage only with comments)
- [ ] TanStack Query for all data fetching
- [ ] No hardcoded API calls in components
- [ ] DevTools working for debugging

### No Breaking Changes Validation

- [ ] **All existing features still work** (most critical)
- [ ] No TypeScript errors introduced
- [ ] All pages load without errors
- [ ] All CRUD operations function correctly
- [ ] All user workflows complete as before
- [ ] App builds successfully
- [ ] No console errors on previously working features
- [ ] Performance is same or better
- [ ] Old code only deleted after migration complete

---

## 🎯 Example Commands

**To start refactoring:**

```
Please help me refactor the service layer in this project using the colocated architecture pattern with TanStack Query integration.

Follow these steps:
1. First, audit all existing services and create <APP_PATH>/docs/migration/service/audit.md
2. Then create <APP_PATH>/docs/migration/service/plan.md with the implementation blueprint
3. Wait for my approval before starting implementation
4. Implement services incrementally and verify after each step

Use the structure and patterns described in this spec file.
```

---

## 📚 Additional Context

### Why Colocated Architecture?

**Benefits:**

- ✅ Everything for one domain in one place
- ✅ Easy to find, understand, modify
- ✅ Better code splitting
- ✅ Clear boundaries
- ✅ Easier to delete features
- ✅ Fewer merge conflicts

**vs Layer-Based (Old Way):**

- ❌ Jump between multiple folders
- ❌ Hard to understand feature scope
- ❌ Difficult to code split
- ❌ Merge conflicts on shared layers

### Why TanStack Query?

**Benefits:**

- ✅ Automatic caching & background refetching
- ✅ Request deduplication
- ✅ Optimistic updates
- ✅ DevTools for debugging
- ✅ Declarative data fetching
- ✅ Less boilerplate

---

## 🔗 Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Axios Docs](https://axios-http.com/docs/intro)
- [Colocated Architecture Best Practices](https://kentcdodds.com/blog/colocation)
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---
