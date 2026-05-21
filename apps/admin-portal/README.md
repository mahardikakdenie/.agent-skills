# Admin Portal

Internal operations portal for Friendsuretech. Manages transactions, policies, claims, membership, sanctions, promotions, product catalog, finance workflows, master data, reports, and configuration pages. Access is permission-driven via JWT.

## Getting Started

Run from the **repository root**:

```bash
pnpm --filter admin-portal dev
pnpm --filter admin-portal dev:https   # HTTPS dev server
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` and fill in the values:

```bash
cp apps/admin-portal/.env.example apps/admin-portal/.env
```

See [`AGENTS.md`](./AGENTS.md) for the full list of required env vars and their purpose.

## Other Commands

```bash
pnpm --filter admin-portal lint
pnpm --filter admin-portal check-types
pnpm --filter admin-portal build
```

## Docker

Build and run from the monorepo root:

```bash
docker build -f apps/admin-portal/Dockerfile -t admin-portal:local .
docker run -p 3000:3000 --env-file apps/admin-portal/.env admin-portal:local
```

## References

- [`AGENTS.md`](./AGENTS.md) — development conventions, directory map, routing rules, service patterns, and change checklist
- [`docs/SERVICE_ARCHITECTURE.md`](./docs/SERVICE_ARCHITECTURE.md) — service layer architecture
- [`docs/SERVICE_IMPLEMENTATION_GUIDE.md`](./docs/SERVICE_IMPLEMENTATION_GUIDE.md) — step-by-step service implementation
- [`docs/SERVICE_REACTQUERY_PATTERNS.md`](./docs/SERVICE_REACTQUERY_PATTERNS.md) — TanStack Query patterns
