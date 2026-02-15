# Admin Portal Service Architecture

This app uses a colocated, service-first architecture for API integrations.

## Directory Layout

```text
src/
|-- lib/
|   |-- api-client/          # shared axios client + interceptors
|   |-- react-query/         # QueryClient and providers
|-- services/
|   |-- [service-name]/
|   |   |-- api/
|   |   |   |-- [service].endpoints.ts
|   |   |   |-- [service].service.ts
|   |   |   |-- [service].types.ts
|   |   |-- hooks/
|   |   |   |-- queries/
|   |   |   |-- mutations/
|   |   |-- query-keys.ts
```

## Service Boundaries

- One service directory represents one base URL/domain.
- Endpoints, API calls, query keys, and hooks are kept in the same service folder.
- Components should consume service hooks or service API functions, not raw axios calls.

## Data Flow

1. UI calls `useQuery`/`useMutation` hooks from `src/services/*/hooks`.
2. Hooks call methods in `src/services/*/api/*.service.ts`.
3. API methods use shared client utilities from `src/lib/api-client`.
4. Query cache behavior is controlled by `src/services/*/query-keys.ts`.

## Cleanup Status

- Legacy flat service files in `src/services/*.ts` were removed in Batch 7.
- The colocated service architecture is now the active and maintained service layer.
