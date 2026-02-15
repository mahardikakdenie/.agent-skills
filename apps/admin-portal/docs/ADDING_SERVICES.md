# Adding a New Service

Use this checklist when integrating a new API domain.

## 1. Map the Service Boundary

- Identify the base URL (env var or fixed URL).
- Create exactly one service folder for that base URL.

## 2. Create Files

Create:

- `src/services/<service>/api/<service>.endpoints.ts`
- `src/services/<service>/api/<service>.types.ts`
- `src/services/<service>/api/<service>.service.ts`
- `src/services/<service>/query-keys.ts`
- `src/services/<service>/hooks/queries/*`
- `src/services/<service>/hooks/mutations/*`
- `src/services/<service>/hooks/queries/index.ts`
- `src/services/<service>/hooks/mutations/index.ts`

## 3. Implement API Layer

- Define all endpoints as constants in `*.endpoints.ts`.
- Add typed API methods in `*.service.ts`.
- Reuse `createApiClient` from `src/lib/api-client`.

## 4. Implement Query Keys and Hooks

- Centralize keys in `query-keys.ts`.
- Use query hooks for reads (GET).
- Use mutation hooks for writes (POST/PUT/DELETE).
- Add invalidation in mutation hooks for affected keys.
- Keep hook signatures consistent with optional `options` params.

## 5. Consume in UI

- Import hooks from `src/services/<service>/hooks/{queries,mutations}`.
- Avoid direct fetch/axios usage in components.
- Avoid hardcoded URLs in components.

## 6. Verify

Run:

- `pnpm --filter admin-portal exec tsc --noEmit`
- `pnpm --filter admin-portal run build`
- `pnpm --filter admin-portal run lint`
