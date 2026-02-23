# Verification Gate - admin-portal

This file defines the mandatory verification gate for component migration work in `apps/admin-portal`.

## 0. Package Manager Normalization (Prerequisite)

Before running the gate, ensure pnpm-only lockfile normalization is satisfied for both scopes below:

- App scope check (`apps/admin-portal`): no `yarn.lock` or `package-lock.json` under app files (exclude `node_modules` and `.next`).
- Workspace root check: no `./yarn.lock` and no `./package-lock.json`.
- Root `package.json` keeps `"packageManager": "pnpm@..."`.
- Root `pnpm-lock.yaml` exists and is the single lockfile source of truth.

If rogue lockfiles are found, remove them in the correct scope, then run `pnpm install` before continuing.

Commit-message scope rule when lockfiles are removed:
- App-only removal: `chore(admin-portal): enforce pnpm - remove yarn.lock / package-lock.json`
- Root or multi-scope removal: `chore: enforce pnpm - remove yarn.lock / package-lock.json`

## 1. Typecheck Command

`pnpm --filter admin-portal check-types`

## 2. Lint Command

`pnpm --filter admin-portal lint`

## 3. Build Command

`pnpm --filter admin-portal build`

Build/runtime mode note:

- `dev` runs with Turbopack by default (`next dev`).
- `build` runs with `next build` (no forced `--webpack`).
- No custom obfuscation step is applied; rely on Next.js production minification and default source-map behavior.

## 4. Turborepo Package Name

- App package name: `admin-portal`
- Correct filter selector: `--filter admin-portal`

> [!NOTE]
> **Sections §1–5 above apply to ALL migration types** (service migration and component migration).
> **Sections §6–7 below apply to COMPONENT MIGRATION ONLY.** Service migration uses only §1–5 from this file.

## 5. Smoke Routes (Critical Only)

Auth pre-step (required when redirected to login):

- Email: process.env.SMOKE_TEST_EMAIL
- Password: process.env.SMOKE_TEST_PASSWORD
- If any smoke route redirects to login, authenticate first with the credentials above, then continue route checks in the same browser session.

Run smoke checks on these critical routes after migration changes:

1. `/dashboard/transaction`
2. `/dashboard/policy`
3. `/dashboard/claim`
4. `/transaction/list`
5. `/policy/list`
6. `/policy/endorsement/list`
7. `/claim/list`
8. `/membership/list`
9. `/finance/billing`
10. `/masterdata/user`

## 6. Before/After Artifact Capture — Component Migration Only

Artifacts are the primary comparison object between the pre-migration baseline and the post-migration state.

### Directory structure

```
apps/admin-portal/docs/migration/component/_artifacts/smoke-routes/
├── before/
│   ├── 01-dashboard-transaction.png
│   ├── 02-dashboard-policy.png
│   └── ... (one file per route above, numbered to match Section 5)
└── after/
    ├── 01-dashboard-transaction.png
    ├── 02-dashboard-policy.png
    └── ...
```

### Capture rules

- **Before** — taken from baseline state before migration patches are applied.
- **After** — taken after migration patches are applied and the build passes.
- **Naming** — zero-padded route number + kebab-case route label (e.g., `01-dashboard-transaction.png`).
- **Viewport** — 1440×900, full-page screenshot.
- **Auth state** — taken while authenticated (never the login page itself).

### PASS / FAIL criteria

A route is **PASS** when ALL of the following hold after comparing before vs after screenshot and running one interaction pass:

| Check | PASS condition |
|-------|---------------|
| Visual parity | Layout, spacing, hierarchy, typography, key color usage unchanged — or delta is caused solely by design system token adoption |
| Interaction parity | Click, hover, keyboard nav, focus states behave identically |
| State parity | Loading, empty, disabled, success, error states consistent |
| Data/UI parity | Table columns, filters, sort, pagination unchanged |
| Console/network sanity | Zero new console errors or failing network requests |

A route is **FAIL** if any check above does not hold and the delta is **not** an approved token-level design system change.

### Comparison log

Record diffs in `_artifacts/smoke-routes/comparison-log.md` using this structure per route:

```markdown
## Route: /dashboard/transaction (#1)

| Field              | Before | After | Delta |
|-------------------|--------|-------|-------|
| Screenshot        | [before](./before/01-dashboard-transaction.png) | [after](./after/01-dashboard-transaction.png) | Visual diff |
| Console errors    | 0 | 0 | — |
| Network errors    | 0 | 0 | — |
| Visual parity     | ✅ | ✅ | — |
| Interaction parity| ✅ | ✅ | — |
| State parity      | ✅ | ✅ | — |
| Data/UI parity    | ✅ | ✅ | — |
| Result            | — | — | ✅ PASS |
| Intentional delta | — | — | none |
```

Gate is **passed** only when all 10 routes have a completed comparison entry with no unresolved deltas.

## 7. Parity Baseline — Component Migration Only

For each smoke route, verify all of the following:

- Visual parity: layout, spacing, hierarchy, typography, and key color usage are unchanged except for approved token-level deltas.
- Interaction parity: click, hover, keyboard navigation, and focus states behave the same as baseline.
- State parity: loading, empty, disabled, success, and error states remain consistent.
- Data/UI parity: table columns, filters, sort behavior, and pagination controls match current behavior.
- Console/network sanity: no new console errors or failing network requests introduced by migration.

Evidence method:

1. Capture before/after screenshots of each smoke route and store them under `apps/admin-portal/docs/migration/component/_artifacts/smoke-routes/`.
2. Run one interaction pass per route (filter, navigate, submit, modal open/close where available).
3. Record any intentional deltas and approval context in the migration output docs.
