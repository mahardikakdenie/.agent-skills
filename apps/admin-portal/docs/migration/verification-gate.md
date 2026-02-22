# Verification Gate - admin-portal

This file defines the mandatory verification gate for component migration work in `apps/admin-portal`.

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

## 5. Smoke Routes (No Visual Regression)

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

## 6. Parity Baseline (Behavior Must Be Unchanged)

For each smoke route, verify all of the following:

- Visual parity: layout, spacing, hierarchy, typography, and key color usage are unchanged except for approved token-level deltas.
- Interaction parity: click, hover, keyboard navigation, and focus states behave the same as baseline.
- State parity: loading, empty, disabled, success, and error states remain consistent.
- Data/UI parity: table columns, filters, sort behavior, and pagination controls match current behavior.
- Console/network sanity: no new console errors or failing network requests introduced by migration.

Evidence method:

1. Capture before/after screenshots of each smoke route.
2. Run one interaction pass per route (filter, navigate, submit, modal open/close where available).
3. Record any intentional deltas and approval context in the migration output docs.
