# Service Refactor Batch Prompts (Safe, Incremental, Multi-App)

Use these prompts per app. Replace the placeholders before running. Each batch has a single copy/paste prompt.

Placeholders

- `<APP_NAME>`: admin-portal
- `<APP_PATH>`: apps/admin-portal
- `<SPEC_PATH>`: spec file (default: `<APP_PATH>/docs/migration/service/refactor-spec.md`)

## Related Documents

- `<APP_PATH>/docs/migration/service/refactor-spec.md` - Master specification
- `<APP_PATH>/docs/migration/service/refactor-lifecycle.md` - Visual lifecycle
- `<APP_PATH>/docs/migration/service/audit.md` - Service audit (Phase 1)
- `<APP_PATH>/docs/migration/service/plan.md` - Migration plan (Phase 2)
- `<APP_PATH>/docs/migration/service/component-migration.md` - Component migration tracking
- `<APP_PATH>/docs/migration/verification-gate.md` - Verification commands

---

## Batch 0 - Verification Gate Setup (No Smoke Required)

Prompt:

```
Use <SPEC_PATH> "App-Specific Inputs" and "Verification Gate (Mandatory)".
For <APP_NAME> in <APP_PATH>, create <APP_PATH>/docs/migration/verification-gate.md with:
Typecheck command, Build command, Lint command, Test command (or N/A), Sanity check command (or N/A), covered routes/flows (if any), and agent skills availability (systematic-debugging, vercel-react-best-practices).
Update <SPEC_PATH> only if it needs generic clarifications. Do not hardcode app-specific commands in the spec.
Do not modify any service files or components in this batch.
```

## Batch 1 - Audit (Phase 1)

Prompt:

```
Use <SPEC_PATH> Phase 1 (Audit). Audit ALL services for <APP_NAME> by **base URL** (one service per base URL).
Output must be separated per service/domain in <APP_PATH>/docs/migration/service/audit.md (one section per service).
Include endpoint list, types/interfaces, legacy file locations, hardcoded API calls, and base URL/client usage.
Do not modify any other files.
```

## Batch 2 - Plan (Phase 2)

Prompt:

```
Use <SPEC_PATH> Phase 2 (Plan). Rewrite <APP_PATH>/docs/migration/service/plan.md into a per-service plan **grouped by base URL** (one service per base URL).
For each service include base URL mapping, endpoints, types, query keys outline, and list of query hooks + mutation hooks.
Follow the structure/template in <SPEC_PATH>.
Do not modify any other files.
```

## Batch 3 - Foundation (Phase 3)

Prompt:

```
Use <SPEC_PATH> Phase 3 (Foundation). Implement the shared API client + React Query setup for <APP_NAME> in <APP_PATH>.
Create/Update:
- <APP_PATH>/src/lib/api-client/client.ts
- <APP_PATH>/src/lib/api-client/config.ts
- <APP_PATH>/src/lib/api-client/interceptors/auth.interceptor.ts
- <APP_PATH>/src/lib/api-client/interceptors/error.interceptor.ts
- <APP_PATH>/src/lib/api-client/interceptors/logger.interceptor.ts (optional)
- <APP_PATH>/src/lib/react-query/query-client.ts
- <APP_PATH>/src/lib/react-query/query-provider.tsx
- <APP_PATH>/src/lib/react-query/devtools.tsx (optional)
Rules: Do not modify old services or components. Keep existing behavior intact. If an existing client exists (e.g., interceptor.ts), keep it compatible or re-export from the new API client setup.
After completing Phase 3, run the full Verification Gate for <APP_NAME> and report results.
If verification fails, use `$systematic-debugging` (if available), fix and re-run the gate. Rollback only if a safe fix is not possible within the step.
```

## Batch 4 - Implement API Layer Only (Phase 4A)

Prompt:

```
Use <SPEC_PATH> Phase 4A. Implement ONLY the API layer for ALL services listed in <APP_PATH>/docs/migration/service/audit.md.
Create <APP_PATH>/src/services/[service]/api with [service].endpoints.ts, [service].types.ts, and [service].service.ts.
Rules: Do not modify old services or components. All endpoints must be constants. All API calls must be implemented. Use per-service base URLs according to the plan.
After completing Phase 4A for all services, run the full Verification Gate for <APP_NAME> and report results.
If verification fails, use `$systematic-debugging` (if available), fix and re-run the gate. Rollback only if a safe fix is not possible within the step.
```

## Batch 5 - Query Keys + Hooks (Phase 4B)

Prompt:

```
Use <SPEC_PATH> Phase 4B. Implement query keys + hooks for ALL services listed in <APP_PATH>/docs/migration/service/audit.md.
Create query-keys.ts, hooks/queries/*, hooks/mutations/*, hooks/queries/index.ts, and hooks/mutations/index.ts in each service.
Rules: Do not modify old services or components. Use proper query keys. Implement useQuery for GET endpoints and useMutation for POST/PUT/DELETE. Add invalidation logic for affected queries. Hook signatures must include an optional `options` param (queries: `options?: Omit<UseQueryOptions<...>, 'queryKey' | 'queryFn'>`; mutations: `options?: UseMutationOptions<...>`). When adding `onSuccess` for invalidation, call `options?.onSuccess`.
After completing Phase 4B for all services, run the full Verification Gate for <APP_NAME> and report results.
If verification fails, use `$systematic-debugging` (if available), fix and re-run the gate. Rollback only if a safe fix is not possible within the step.
```

## Batch 6 - Component Migration (Phase 5)

Prompt:

```
Use <SPEC_PATH> Phase 5. Migrate components to the new service hooks incrementally after Phase 4A and Phase 4B are complete for all services.

Steps:
1. Migrate components one feature/component at a time
2. Keep old services intact until the end
3. Update imports to new hooks
4. Replace manual `useQuery`/`useMutation` with existing custom hooks from `services/*/hooks/{queries,mutations}` when equivalent hooks already exist
5. Update form submissions to use mutation hooks where applicable
6. Document migrations in <APP_PATH>/docs/migration/service/component-migration.md:
   - Update "Main Refactor: Batch 6" section
   - List all migrated components by service
   - Mark each component with verification status
   - Include any issues encountered and resolutions
   - Update verification results section
7. After all component migrations are complete, run the full Verification Gate for <APP_NAME> and report results

Rules: Do not keep manual `useQuery`/`useMutation` wrappers in components if equivalent service hooks already exist; if a manual wrapper is still required, document why in `component-migration.md`. If `$vercel-react-best-practices` is available, apply it to React/Next.js refactors. If verification fails, use `$systematic-debugging` (if available), fix and re-run the gate. Rollback only if a safe fix is not possible within the step.
```

## Batch 7 - Cleanup + Enterprise Docs (Phase 6)

Prompt:

```
Use <SPEC_PATH> Phase 6 and <APP_PATH>/docs/migration/service/service-doc-templates.md.

Phase 6A: Cleanup old services
- Remove obsolete service files only after all components are migrated
- Remove unused API URLs/constants only if no longer referenced
- Keep Shared MODULE components and shared utilities intact

Phase 6B: Generate enterprise-level permanent documentation
Using the templates in service-doc-templates.md, create the following THREE permanent documentation files in <APP_PATH>/docs/:

1. SERVICE_ARCHITECTURE.md - Complete service layer architecture documentation
   - Follow Template 1 in service-doc-templates.md
   - Include mermaid diagrams for service discovery and data flow
   - Document ADRs for key architectural decisions
   - Add comparison table (layer-based vs colocated)
   - Include concrete examples from THIS APP's services
   - NO migration references or migration process discussion

2. SERVICE_IMPLEMENTATION_GUIDE.md - Step-by-step implementation guide
   - Follow Template 2 in service-doc-templates.md
   - Include decision tree mermaid diagram for when to create vs extend services
   - Provide complete implementation checklist with code examples
   - Add troubleshooting section with common issues
   - Document anti-patterns to avoid
   - Include quick reference templates
   - NO migration references or migration process discussion

3. SERVICE_REACTQUERY_PATTERNS.md - TanStack Query best practices and patterns
   - Follow Template 3 in service-doc-templates.md
   - Comprehensive query keys, query hooks, and mutation hooks patterns
   - Cache invalidation strategies with decision matrix
   - Advanced patterns (pagination, infinite queries, polling, optimistic updates)
   - Error handling and performance optimization
   - Testing examples
   - Common pitfalls
   - NO migration references or migration process discussion

Documentation Requirements:
- Use ONLY examples from the actual refactored services in THIS APP
- NO references to migration/ docs (these are permanent, standalone docs)
- NO discussion of migration process or legacy patterns
- Focus on "how to use this architecture going forward"
- Include real service names, base URLs, and endpoints from THIS APP
- All mermaid diagrams must be syntactically correct
- All code examples must be complete and runnable
- Cross-reference only the other permanent docs (SERVICE_*.md files)

After generating documentation, run the full Verification Gate for <APP_NAME> and report results.

Rules: If verification fails, use `$systematic-debugging` (if available), fix and re-run the gate. Rollback only if a safe fix is not possible within the step.
```

## Multi-App Usage

Repeat Batch 0 to Batch 7 for each app. Each app must have its own verification gate file.
