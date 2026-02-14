# Service Refactor Batch Prompts (Safe, Incremental, Multi-App)

Use these prompts per app. Replace the placeholders before running. Each batch has a single copy/paste prompt.

Placeholders

- `<APP_NAME>`: admin-portal
- `<APP_PATH>`: apps/admin-portal
- `<SPEC_PATH>`: spec file (default: `<APP_PATH>/docs/migration/service/refactor-spec.md`)

## Batch 0 - Verification Gate Setup (No Smoke Required)

Prompt:

```
Use <SPEC_PATH> "App-Specific Inputs" and "Verification Gate (Mandatory)".
For <APP_NAME> in <APP_PATH>, create <APP_PATH>/docs/verification-gate.md with:
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
Create query-keys.ts, hooks/queries/*, and hooks/mutations/* in each service.
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
4. Update form submissions to use mutations where applicable
5. Document migrations in <APP_PATH>/docs/migration/service/component-migration.md:
   - Update "Main Refactor: Batch 6" section
   - List all migrated components by service
   - Mark each component with verification status
   - Include any issues encountered and resolutions
   - Update verification results section
6. After all component migrations are complete, run the full Verification Gate for <APP_NAME> and report results

Rules: If `$vercel-react-best-practices` is available, apply it to React/Next.js refactors. If verification fails, use `$systematic-debugging` (if available), fix and re-run the gate. Rollback only if a safe fix is not possible within the step.
```

## Batch 7 - Cleanup + Docs (Phase 6)

Prompt:

```
Use <SPEC_PATH> Phase 6. Cleanup old services only after all components are migrated.
Rules: Remove obsolete service files. Remove unused API URLs/constants only if no longer referenced. Add/refresh documentation as defined in the spec. Run the full Verification Gate for <APP_NAME> and report results. If verification fails, use `$systematic-debugging` (if available), fix and re-run the gate. Rollback only if a safe fix is not possible within the step.
```

## Multi-App Usage

Repeat Batch 0 to Batch 7 for each app. Each app must have its own verification gate file.
