# Admin Portal Agent Guide

This guide is the working contract for AI agents and maintainers changing
`apps/admin-portal`. Keep it aligned with the codebase. If implementation and this
document disagree, inspect the implementation first, then update this document as
part of the change.

## Product Scope

`admin-portal` is an internal operations portal for Friendsuretech. It manages
dashboards, transactions, policies, claims, membership, sanctions, sources,
promotions, product catalog data, finance workflows, master data, reports, and
configuration pages. The app is permission-driven: visible menus, route access,
and allowed actions are derived from the authenticated user's JWT permissions.

## Runtime And Tooling

- Workspace: pnpm monorepo with Turborepo.
- App package name: `admin-portal` without an `@repo/` scope.
- Node: `>=20.19`.
- Package manager: `pnpm@10.27.0`.
- Framework: Next.js App Router, React 19, TypeScript 5.9.
- Styling: Tailwind CSS with shared semantic tokens from `@repo/config`.
- Shared UI: `@repo/ui`, transpiled by `next.config.mjs`.
- Data fetching: legacy custom hooks plus newer TanStack Query v5 service hooks.
- HTTP: Axios clients from `src/lib/api-client`; older abstractions remain under
  `src/lib/http-client`.

Run commands from the repository root unless you are intentionally working inside
the app directory.

```bash
pnpm --filter admin-portal dev
pnpm --filter admin-portal dev:https
pnpm --filter admin-portal lint
pnpm --filter admin-portal check-types
pnpm --filter admin-portal build
```

Root scripts delegate to Turbo:

```bash
pnpm run lint
pnpm run check-types
pnpm run build
```

There is no app test script at the time of writing. Do not claim tests were run
unless you added or executed a real test command.

## Monorepo Boundaries

- Keep app-specific code inside `apps/admin-portal`.
- Put reusable cross-app UI in `packages/ui` only when it is genuinely reusable.
- Put shared tokens/config/helpers in the existing `packages/*` packages instead
  of importing across package internals.
- Import workspace packages through package exports, for example:
  `import { Box } from "@repo/ui";`
- Do not import files by traversing into `../../packages/.../src`.
- Add dependencies to the owning package:
  `pnpm --filter admin-portal add <package>`.
- Keep root dependencies limited to repository tooling.

## Directory Map

- `src/app`: Next.js route segments, layouts, global CSS, and `proxy.ts` route
  redirection. New pages should stay thin when practical.
- `src/views`: page-level composition and route-owned UI. Prefer this for new or
  actively refactored screens.
- `src/components/core`: reusable admin components such as controls, tables,
  charts, loaders, modals, image wrappers, page headers, icons, and auth entry UI.
- `src/components/forms`: feature forms and form-owned subcomponents.
- `src/components/table-config`: table column factories and table render config.
- `src/services/<domain>/api`: API clients, endpoints, and service types.
- `src/services/<domain>/hooks`: TanStack Query hooks for newer service modules.
- `src/hooks`: legacy route/feature hooks. Reuse existing hooks when touching
  legacy screens; prefer colocated service hooks for new data access.
- `src/context`: app-level providers such as auth and screen state.
- `src/constants`: menus, URLs, app branding constants, API constants.
- `src/lib`: shared infrastructure and utilities. See `src/lib/README.md`.
- `src/types`: shared app domain types.
- `public`: static assets and images.
- `docs`: app-specific notes and migration documentation.

## Next.js App Router Rules

- `src/app/layout.tsx` wires global providers: `QueryProvider`, `AuthProvider`,
  `ScreenProvider`, `Toaster`, and `LayoutView`.
- `src/proxy.ts` is the Next.js 16 proxy file. Do not add `middleware.ts` for the
  same behavior.
- Route `page.tsx` files may be legacy full pages today. For new pages and
  significant refactors, prefer a thin route file that imports a view from
  `src/views`.
- Add `'use client'` only to files that need browser state, effects, contexts, or
  event handlers.
- Keep server-only APIs out of client components. Most admin screens are
  client-heavy, so check imports before moving code across server/client
  boundaries.
- Use `next/navigation` for App Router navigation.
- Use `next/image` or the existing `OptimizeImage` wrapper for images.
- Keep `next.config.mjs` `output: "standalone"` compatible with Docker builds.

Preferred new-page shape:

```tsx
// src/app/masterdata/example/page.tsx
import ExampleView from "@/views/masterdata/example.view";

export default function Page() {
  return <ExampleView />;
}
```

## Routing, Menus, And Permissions

- Main navigation lives in `src/constants/app-menu.const.tsx`.
- Route constants live in `src/constants/app-url.const`.
- `LayoutView` renders menus based on `menuList` and `submenuList` from
  `AuthProvider`.
- `AuthProvider` decodes JWT `permission_list` and maps permissions to menu names.
- When adding a new protected route, update all relevant places together:
  `AppURL`, `AppMenu.menu`, `proxy.ts` matcher or redirect behavior if needed,
  route files, and permission expectations.
- For detail/add/export/import routes, include `additionalPages` in the owning
  submenu so active menu state and access checks stay coherent.

## Authentication

- Authentication is handled in `src/context/auth.context.tsx`.
- Tokens use cookies and global in-memory token storage through
  `src/lib/token-storage.ts`.
- Standard login, logout, provider lookup, and Entra login are exposed by
  `src/services/auth/api/auth.service.ts`.
- Microsoft Entra ID login uses a manual PKCE flow through
  `MicrosoftLoginButton` and `src/views/oauth/msal-callback.view.tsx`.
- Do not introduce `@azure/msal-browser` or another auth framework unless the
  product decision explicitly changes.
- OAuth callback routes under `/oauth/` must render without normal auth blocking.

## API And Data Access

The service layer follows a colocated, domain-first architecture. Full documentation lives in:

- [`docs/SERVICE_ARCHITECTURE.md`](./docs/SERVICE_ARCHITECTURE.md) — structure, boundaries, and ADRs
- [`docs/SERVICE_IMPLEMENTATION_GUIDE.md`](./docs/SERVICE_IMPLEMENTATION_GUIDE.md) — step-by-step implementation checklist
- [`docs/SERVICE_REACTQUERY_PATTERNS.md`](./docs/SERVICE_REACTQUERY_PATTERNS.md) — TanStack Query hook patterns and pitfalls

Key rules to keep in mind:

- One service per base URL — do not split endpoints sharing the same base URL into multiple services.
- Use `createApiClient(API_BASE_URLS.<domain>)` from `@/lib/api-client`.
- Return `response.data` from service methods, not raw Axios responses.
- Put stable query keys in `query-keys.ts`; never hardcode ad hoc arrays in views.
- Let mutations invalidate the smallest relevant query set and always call `options?.onSuccess`.

## Forms

- Existing forms use a mix of `react-hook-form`, `react-final-form`, custom
  controlled inputs, and feature hooks. Match the local form's existing pattern
  when editing it.
- For new forms, prefer `react-hook-form` with schema validation when possible.
- Keep form-owned components under `src/components/forms/<form-name>/components`.
- Keep submit payload shaping close to the service boundary or the form hook, not
  scattered through presentational components.
- Preserve existing loading, disabled, and error states when refactoring.

## UI And Styling

- Use `@repo/ui` primitives where they already fit: `Box`, `Button`, `Select`,
  `DateRangePicker`, `Dialog`, `Drawer`, `Tooltip`, `Table`, and related exports.
- Use app-owned `src/components/core/*` components where a legacy screen already
  depends on them.
- Keep the admin UI dense, operational, and scannable. Avoid landing-page or
  marketing-style layouts inside the portal.
- Prefer Tailwind utilities and shared CSS variables over one-off CSS.
- Use existing colors and semantic tokens:
  `primary`, `primary-foreground`, `primary-light-foreground`, `warning`, and
  shared tokens from `@repo/config/semantic-tokens.css`.
- Add global CSS in `src/app/globals.css` only for true cross-app rules or
  third-party overrides. Prefer component-local Tailwind classes otherwise.
- Keep text within controls from overflowing on desktop and mobile.
- Keep cards at modest radius and avoid nested card layouts unless the existing
  screen already uses them.
- Use `lucide-react` for new icons when a suitable icon exists. Existing
  `react-feather` or image icons can remain where already used.

## Environment Variables

- App env files live under `apps/admin-portal`, not the repository root.
- Public browser-readable values use `NEXT_PUBLIC_*`.
- API base URLs are centralized in `src/lib/api-client/config.ts`.
- Keep `.env.example`, Docker build args, Docker runtime env expectations, and
  `API_BASE_URLS` in sync when adding a required environment variable.
- Do not commit real secrets in `.env`.
- Be careful with `NEXT_PUBLIC_AUTH_TOKEN`: it is exposed to the browser by
  design. Do not put private credentials in it.

Known API URL variables include:

- `NEXT_PUBLIC_AUTH_SERVICE_URL`
- `NEXT_PUBLIC_TRANSACTION_SERVICE_URL`
- `NEXT_PUBLIC_PRODUCT_SERVICE_URL`
- `NEXT_PUBLIC_HELPER_SERVICE_URL`
- `NEXT_PUBLIC_PROMOTION_SERVICE_URL`
- `NEXT_PUBLIC_CHANNEL_SERVICE_URL`
- `NEXT_PUBLIC_API_POLICY_BASE_URL`
- `NEXT_PUBLIC_API_CLAIM_BASE_URL`
- `NEXT_PUBLIC_SANCTION_SERVICE_URL`
- `NEXT_PUBLIC_COUNTRY_SERVICE_URL`
- `NEXT_PUBLIC_FINANCE_SERVICE_URL`
- `NEXT_PUBLIC_THIRD_PARTY_SERVICE_URL`
- `NEXT_PUBLIC_PDF_SERVICE_URL`
- `NEXT_PUBLIC_REPORT_SERVICE_URL`
- `NEXT_PUBLIC_COMMUNICATION_SERVICE_URL`

Branding/theme variables are also consumed in Tailwind config and layout, such as
`NEXT_PUBLIC_PRIMARY_BASE`, `NEXT_PUBLIC_PRIMARY_20`, `NEXT_PUBLIC_PRIMARY_10`,
`NEXT_PUBLIC_LOGO`, `NEXT_PUBLIC_LOGO_SQUARE`, and `NEXT_PUBLIC_MODE`.

## Naming And Imports

- Prefer kebab-case for new filenames:
  `email-template-form.tsx`, `transaction.service.ts`, `home.view.tsx`.
- Existing hook files use `useX.hooks.tsx`; follow nearby convention when editing
  legacy hooks.
- React components use PascalCase.
- Use `@/` for app imports and `@public/` for public assets.
- Do not use deep relative imports across feature boundaries when an alias is
  clearer.
- Prefer named exports for services, utilities, and shared components unless the
  local file already uses a default export pattern.

## TypeScript And Quality

- `strict` is currently disabled in this app. Do not use that as permission to add
  broad `any` types unnecessarily.
- Prefer domain types in `src/types` or colocated service types over inline
  untyped objects.
- Avoid changing generated Next files such as `next-env.d.ts`.
- Do not leave `console.log` or noisy debug output. Production builds remove
  console calls, but source should still be clean.
- Do not hide errors with empty `catch` blocks unless the behavior is explicitly
  fire-and-forget and documented locally.
- Preserve user-facing error toasts and loading wrappers when refactoring.

## Docker And Deployment

- Docker builds are intended to run from the monorepo root:

```bash
docker build -f apps/admin-portal/Dockerfile -t admin-portal:local .
docker run -p 3000:3000 --env-file apps/admin-portal/.env admin-portal:local
```

- The Dockerfile uses `turbo prune admin-portal --docker` and
  `pnpm exec turbo run build --filter=admin-portal...`.
- Keep `next.config.mjs` standalone output and `transpilePackages` compatible
  with this flow.
- If a new workspace package is required at runtime, declare it in
  `apps/admin-portal/package.json` so Turbo prune includes it.

## Skills

Agent skills are available at `.agents/skills/` in the repository root. Use them
when the task matches their scope:

- `design-system` — Token-driven UI components in `packages/ui`
- `forms-validation` — Forms + validation (react-hook-form + zod)
- `impeccable` — UI polish: visual hierarchy, motion, typography, spacing, UX copy
- `monorepo-workspace` — Package topology & inter-package boundaries
- `next-best-practices` — File conventions, RSC, data, error, bundling
- `next-cache-components` — PPR & `use cache` in Next.js 16+
- `next-upgrade` — Upgrade Next.js via official migration guide
- `react-query` — Query/mutation hooks + service layer (TanStack v5)
- `systematic-debugging` — Root cause first, then fix
- `turborepo` — Pipeline, caching, filter, env vars in `turbo.json`
- `vercel-composition-patterns` — Compound components, avoid boolean props
- `vercel-react-best-practices` — Bundle, async, event listener optimization
- `web-design-guidelines` — UI audit: a11y, UX, visual hierarchy

## Documentation Lookup

- For questions about library, framework, SDK, API, CLI, or cloud-service behavior,
  use Context7 MCP before answering or changing code.
- Start with `resolve-library-id`, then `query-docs`.
- This applies even for familiar tools such as Next.js, React, TanStack Query,
  Tailwind, Turborepo, Axios, Radix, shadcn/ui, or Docker.
- Do not use Context7 for business-logic debugging, local refactors, or code
  review unless external library behavior is the actual question.

## Change Checklist

Before finishing work in `admin-portal`:

- Read the nearest existing files before adding new files.
- Keep route, menu, permission, and proxy changes synchronized.
- Keep service, endpoint, type, query key, and hook changes together.
- Keep `.env.example`, `API_BASE_URLS`, and Docker env args synchronized when env
  variables change.
- Run the narrowest useful verification:
  `pnpm --filter admin-portal check-types`, `pnpm --filter admin-portal lint`,
  and/or `pnpm --filter admin-portal build`.
- For shared package changes, run the relevant package checks too, for example
  `pnpm --filter @repo/ui check-types`.
- If verification cannot be run, state exactly why.

## Maintenance Rules For This File

- Keep this guide concise enough to scan. Prefer patterns and source locations
  over exhaustive page inventories.
- When adding a new domain pattern, document the owning folder and the one or two
  files future agents must update.
- Remove obsolete instructions as part of migrations. Do not keep legacy advice
  after the code no longer follows it.
- Do not duplicate long README content here. Link to or reference the source file
  when the detail already lives elsewhere.
