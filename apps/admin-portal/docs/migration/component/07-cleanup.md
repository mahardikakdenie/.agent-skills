# 07 - Cleanup & Deprecation

> **Batch:** Batch 10 (+10.5) - Cleanup & Deprecation
> **Branch:** `migrate-app/<app>`
> **Run count:** Once per app - after Batch 9 stabilization
> **Prerequisite:** Batch 9 page tracker confirms all in-scope pages are `PASS`
> **Prev:** [05-app-migration.md](./05-app-migration.md) - **Next:** [08-operational-standards.md](./08-operational-standards.md)
> **AI execution:** Use **Batch 10** and **Batch 10.5** in [`migration-batch-prompts.md`](./migration-batch-prompts.md) to run this phase with AI assistance

---

## Purpose

After the app is fully migrated and stabilized (Batch 9), perform final cleanup on the `migrate-app/<app>` branch:

1. Remove confirmed-replaced local duplicate components
2. Eliminate dead adapters and stale barrel exports
3. **Audit `package.json` dependency ownership** - remove only confirmed orphan packages from
   `apps/<APP>` where app source/config no longer imports or requires them directly
4. **Verify dependency version alignment** - confirm React, TypeScript, and `eslint-config-next`
   are at the correct versions per the upgrade matrix in [09-dependency-upgrades.md](./09-dependency-upgrades.md)
5. Verify a clean typecheck/lint/build before continuing to Batch 10.5

> **Scope:** This phase runs **per app** on `migrate-app/<app>`. Cross-app synthesis outputs
> (`30-cleanup-report.md`, `31-deprecation-map.md`) are produced only after ALL apps complete
> Batch 10 and Batch 10.5, on `feat/ui`.

---

## Prerequisites Checklist

- [ ] You are on `migrate-app/<app>`
- [ ] Batch 9 page tracker confirms all in-scope routes are `PASS`
- [ ] No active regressions pending fix

---

## Deliverables

| File                                                                  | Description                                                                             |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `apps/<APP_NAME>/docs/migration/component/_output/_cleanup-report.md` | Per-app cleanup summary (required before merge to `migrate-app/base`)                   |
| `apps/<APP_NAME>/package.json`                                        | Updated only when confirmed orphan deps are removed                                     |
| `packages/ui/docs/normalization/_output/30-cleanup-report.md`         | **Cross-app synthesis** - generated later after ALL apps complete Batch 10 + 10.5       |
| `packages/ui/docs/normalization/_output/31-deprecation-map.md`        | **Cross-app synthesis** - generated later on `feat/ui`; do not create in per-app Batch 10 |

---

## Batch Prompt

````md
You are a Principal Frontend Engineer on branch `migrate-app/<app>`.

## Objective

Perform post-migration cleanup for this app only:

1. Remove all confirmed-replaced local duplicate components from this app
2. Remove dead import re-exports and stale local adapter wrappers in this app
3. Verify app build and tests pass with a clean graph
4. Produce the per-app cleanup report

## Inputs (all must be read)

- `apps/<APP_NAME>/docs/migration/component/_output/_batch-9-page-tracker.md`
- `apps/<APP_NAME>/docs/migration/component/_output/_migration-log.md`
- `apps/<APP_NAME>/docs/migration/component/_output/_audit-report.md`
- `apps/<APP_NAME>/docs/migration/component/_output/_parity-checklist.md`
- `apps/<APP_NAME>/docs/migration/verification-gate.md`

## Preflight

Do not delete anything until `_batch-9-page-tracker.md` shows all in-scope pages as `PASS`.
For current `admin-portal`, the expected handoff is 115 discovered `page.tsx` routes,
114 in-scope pages, 114 `PASS`, and one `OUT_OF_SCOPE` auth callback route.

If any in-scope route is `NOT_STARTED`, `IN_PROGRESS`, `FAIL`, `BLOCKED`, or
`DEFERRED_DATA_TABLE`, return to Batch 9 first.

## Cleanup Rules

### Safe to remove:

- Local component files in `apps/*/src/components/ui/*.tsx` where:
  - `_migration-log.md` confirms it was replaced by @repo/ui
  - All usage sites have been updated
  - App typecheck/lint/build still passes after removal
- Adapter wrapper files in `apps/*/src/components/ui/adapted/*.tsx` where:
  - The upstream API gap in @repo/ui has been closed (no longer needed)
- Dead `index.ts` re-exports pointing to deleted files
- Stale `// TODO: migrate to @repo/ui` comments

### Do not remove:

- Components classified `KEEP_APP_LOCAL` (domain forms, table configs, etc.)
- Adapter wrappers still needed due to intentional API difference
- Any component without confirmed replacement (has no `_migration-log.md` entry)
- packages/ui components even if used by fewer apps than expected (keep in package)
- Any `packages/ui` source or docs during per-app Batch 10

### Verification Commands (Safety Check)

Before deleting any component, verify zero usage with `ripgrep`:

```bash
# Check for any remaining imports of Button in the app
rg "import .* from .*/ui/button" apps/<APP_NAME>/src

# Check for any usage of the local component file
rg "<LocalComponentName>" apps/<APP_NAME>/src

# Check for any file still referencing the old path
rg "components/ui/<component-name>" apps/<APP_NAME>/src
```bash
````

### Barrel File Sanitation

When deleting `apps/<APP_NAME>/src/components/ui/<component>.tsx`:

1. Open `apps/<APP_NAME>/src/components/ui/index.ts` (if it exists)
2. Remove the export line: `export * from './<component>'`
3. Verify no other file imports from the barrel file (e.g., `import { Button } from '@/components/ui'`)
   - If they do, update them to `import { Button } from '@repo/ui'`

---

## Phase 4 - Dependency Audit & Cleanup

> **The dependency hygiene principle:**
> Every runtime entry in `package.json` must have at least one **direct import/require** in that package's
> own source or config code. A dep belongs at the level that **uses it directly** - not at the level that
> happens to also depend on it. The question is never "does another package also have this?" -
> it is always "does **this app's code** import or require it directly?"

### What this is NOT

This is **not** a "remove anything that packages/ui also owns" sweep. If an app's
`KEEP_APP_LOCAL` component, utility, page, or service directly imports `react-hook-form`,
`clsx`, `lucide-react`, or any other package - the app owns that dep legitimately and it
**must stay**.

The only situation that warrants removal is: the app lists a dep in `package.json`, no
`apps/<APP>/src/` file and no app config file imports/requires it anymore, and the deleted
local migration files were the only known consumers.

### Scope - All Workspace Packages

This audit covers **all packages in the monorepo workspace**, not just `@repo/ui`:

| Package           | Also produces transitive deps like...                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| `@repo/ui`        | `@radix-ui/*`, `clsx`, `class-variance-authority`, `lucide-react`, `vaul`, `react-day-picker`, `react-hook-form` |
| `@repo/helper`    | utility libraries the helper wraps internally                                                                    |
| `@repo/interface` | pure types - no runtime transitive deps to worry about                                                           |
| `@repo/config`    | Tailwind config - no runtime transitive deps                                                                     |

When `@repo/ui` (or any workspace package) ships a dep as its own `dependency`, consuming
apps may get it **transitively at runtime**. That is only relevant after proving the app's
own code no longer imports or requires the package directly. Do not remove a dependency just
because a workspace package also owns it.

### Audit Process

#### Step 1 - Identify candidate orphan deps

For each dep in `apps/<APP>/package.json`, ask: **does any file in `apps/<APP>/src/` or app root config directly import/require it?**

```bash
# Quick audit - iterate over each dep and count direct imports in src/
# Example for a single package:
rg "(from ['\"]react-hook-form(/|['\"])|import ['\"]react-hook-form(/|['\"])|require\(['\"]react-hook-form(/|['\"])|import\(['\"]react-hook-form(/|['\"]))" apps/<APP_NAME>/src --type ts --type tsx
# -> No results AND react-hook-form is in packages/ui deps? -> Candidate for removal
# -> Any results in KEEP_APP_LOCAL files, services, pages? -> KEEP

# Broader: generate a dep-usage report
node -e "
const pkg = require('./apps/<APP_NAME>/package.json');
const deps = Object.keys({...pkg.dependencies, ...pkg.devDependencies});
deps.forEach(d => process.stdout.write(d + '\n'));
" | while read dep; do
  count=$(rg "(from ['\"]${dep}(/|['\"])|import ['\"]${dep}(/|['\"])|require\(['\"]${dep}(/|['\"])|import\(['\"]${dep}(/|['\"]))" apps/<APP_NAME>/src --type ts --type tsx -l 2>/dev/null | wc -l)
  echo "$count $dep"
done | sort -n
# Lines showing 0 = no direct imports found -> candidates for further review
```

> Output `0` for a dep means **no direct import found in app source** - not an automatic
> removal. Check app config files and deleted-file history before deciding.

#### Step 2 - Confirm each candidate individually

For each dep showing `0` direct imports:

1. **Is it used in `next.config.ts`, `tailwind.config.ts`, `postcss.config.*`, `eslint.config.*`, or other config files at app root?**
   -> Those are valid direct usages even though they're not in `src/`. **KEEP**.
2. **Is it a peer dep of another direct dep the app uses?** (e.g., `react` is a peer of
   `react-hook-form`)
   -> App must own all React-related peer deps explicitly. **KEEP**.
3. **Is it in `devDependencies` and used only during build/test?** (e.g., `postcss`,
   `eslint`, `@types/*`)
   -> Audit `@types/*` separately: if the underlying package is being removed, the `@types`
   for it is also removed. If the underlying package is kept, so is its `@types`.
   -> Exception: if the package is `webpack-obfuscator`, remove it per
   [09-dependency-upgrades.md](./09-dependency-upgrades.md) Part A6 to keep Turbopack-compatible defaults.
4. **Was it only imported inside local component files that have now been deleted?**
   -> This is the only true orphan case. Confirm the files are gone, then **REMOVE**.

#### Step 3 - Decision table

| Condition                                                                                          | Decision                                                                  |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| App's `src/` code directly imports/requires the package (KEEP_APP_LOCAL, services, pages, utilities) | **KEEP** - app directly owns it                                     |
| Package is used in `next.config.ts`, `tailwind.config.ts`, or other root configs                   | **KEEP** - valid direct usage                                          |
| Package is a peer dep of another dep the app uses (e.g., `react`, `react-dom`)                     | **KEEP** - required by the ecosystem                                   |
| Package is a `devDependency` used during build or type-checking                                    | **KEEP** - part of the app's build toolchain                           |
| Package is a monorepo workspace package (`@repo/*`)                                                | **KEEP** - always explicit, never rely on transitive `@repo/*` linking |
| App's `src/` has zero direct imports AND the package was only used by now-deleted local components | **REMOVE after verification** - confirmed orphan                                |
| App's `src/` has zero direct imports AND unclear why it's there                                    |  **Investigate first** - do not remove until reason is confirmed        |

#### Step 4 - Examples of deps that look redundant but are legitimately app-owned

```txt
react-hook-form   -> used directly in KEEP_APP_LOCAL domain forms (BrokerFeeForm, ClaimForm)
lucide-react      -> used directly in page-level components, not just @repo/ui components
clsx              -> used directly in app utility functions or KEEP_APP_LOCAL components
date-fns          -> used directly in services, formatters, or page components
recharts          -> used directly in dashboard page components with domain data
zod               -> used directly in app-level form validation schemas
axios             -> used directly in API client / service layer
```

If the app code imports any of the above, **keep them even if `@repo/ui` also has them**.
The app is a first-class consumer, not a pass-through.

#### Step 5 - Remove confirmed orphans

```bash
# Only after Step 2 confirms zero legitimate usage:
pnpm --filter <APP_PACKAGE_NAME> remove <orphan-dep>

# Verify immediately:
pnpm --filter <APP_PACKAGE_NAME> check-types   # must pass
pnpm --filter <APP_PACKAGE_NAME> build         # must pass

# Confirm the dep still resolves transitively if it's in a workspace package:
pnpm --filter <APP_PACKAGE_NAME> list <removed-dep>
```

### Packages Always Kept at App Level (Never Remove)

Regardless of transitive availability, these always stay explicit in `apps/<APP>/package.json`:

```
next                     - the app's framework; must be explicit
react / react-dom        - runtime host; every Next.js app owns these directly
tailwindcss              - app builds its own CSS; @repo/ui's version is for Storybook only
tailwindcss-animate      - Tailwind plugin referenced directly in tailwind.config.ts
postcss                  - CSS build toolchain
eslint / eslint-config-next - linting toolchain
typescript               - compiler
@types/node              - required by Next.js config (ts/mjs)
@types/react             - required for TSX compilation
@types/react-dom         - required for TSX compilation
@repo/ui                 - always explicit; the shared lib
@repo/helper             - always explicit; workspace utility
@repo/interface          - always explicit; shared domain types
@repo/eslint-config      - always explicit; linting config
@repo/typescript-config  - always explicit; TS config extension
```

> **Rule on `@repo/*` packages:** Never rely on transitive resolution of workspace packages.
> If an app uses `@repo/helper`, it must list it explicitly in `package.json` - even if
> `@repo/ui` also depends on it. Transitive workspace linking is fragile and defeats the
> explicit ownership contract.

The cross-app zero-usage review for `packages/ui/src/index.ts` is not part of per-app Batch 10.
Run it later on `feat/ui` after all apps complete Batch 10 and Batch 10.5.

### Cross-App Zero-Usage `packages/ui` Component Policy

A `packages/ui` component with zero usages across ALL currently migrated apps is NOT automatically deleted.
Apply this decision table during the later cross-app synthesis, not during per-app cleanup:

| Scenario                                                                    | Action                                                                                                                                                                          |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component was built speculatively and no app has ever used it               | Mark `@deprecated` in the component file and raise it in Phase 08 review. If still unused after 2 consecutive migration cycles (or 6 months), remove with a major version bump. |
| Component was used during migration but all consumers have since removed it | Keep for now. Document in `31-deprecation-map.md` as a candidate for removal. Review in the next quarterly `packages/ui` audit.                                                 |
| Component is used by apps not yet migrated (still in queue)                 | **KEEP** - it is actively needed. Do not mark deprecated.                                                                                                                       |
| Component was built for a `NEW_SHARED_COMPONENT` that only one app needed   | Retain. Reassess shared-vs-local boundary per `06-component-standards.md` Section 6 if still unused at end of full migration program.                                           |

> **Rule:** Never silently delete a `packages/ui` export - it breaks any app that imports it. Always maintain the deprecation paper trail in `31-deprecation-map.md`.

## Required Output: `apps/<APP_NAME>/docs/migration/component/_output/_cleanup-report.md`

```

## Cleanup Report - <APP_NAME> - <date>

### Batch 9 Handoff

- Tracker file: `_batch-9-page-tracker.md`
- Total discovered page routes: N
- In-scope pages: N
- PASS: N
- OUT_OF_SCOPE: N
- Non-pass in-scope pages: 0

### Summary

- App cleaned: <APP_NAME>
- Files removed: N
- Lines removed: ~N
- Adapters removed: N
- Adapters retained (intentional): N (with reason)
- Dependencies removed: N (list them)
- Dependencies retained: N (with direct-usage/config/toolchain/peer/never-remove reason)

### Files Removed

| File | Action | Rationale | Verification |
| ---- | ------ | --------- | ------------ |
| apps/<APP_NAME>/src/components/ui/button.tsx | REMOVED | Fully replaced by @repo/ui Button | check-types PASS |

### Files Retained

| File | Action | Reason |
| ---- | ------ | ------ |
| apps/<APP_NAME>/src/components/forms/broker-fee-form/index.tsx | RETAINED | KEEP_APP_LOCAL domain form |

### Dependency Audit

| Package | Action | Evidence | Notes |
| ------- | ------ | -------- | ----- |
| @radix-ui/react-dialog | REMOVED / RETAINED | zero direct usage / direct import files | explain decision |
| react-hook-form | RETAINED | used directly in app-local forms | app-owned dependency |

### Verification Gate

- Typecheck: PASS - `<verification-gate.md Section 1 command>`
- Lint: PASS - `<verification-gate.md Section 2 command>`
- Build: PASS - `<verification-gate.md Section 3 command>`

### Follow-ups

- Batch 10.5 deferred dependency items: <list or none>
- Cross-app cleanup/deprecation synthesis: pending on `feat/ui` after all apps complete Batch 10 + 10.5
```

## Cross-App Cleanup and Deprecation Outputs

Do not create these files during per-app Batch 10:

- `packages/ui/docs/normalization/_output/30-cleanup-report.md`
- `packages/ui/docs/normalization/_output/31-deprecation-map.md`

Those are cross-app synthesis artifacts for `feat/ui` after every app has completed Batch 10
and Batch 10.5.

## Verification Gate (ALL must pass)

- App typecheck: exact command from `verification-gate.md` Section 1, e.g. `pnpm --filter <app-name> check-types`
- App lint: exact command from `verification-gate.md` Section 2, e.g. `pnpm --filter <app-name> lint`
- App build: exact command from `verification-gate.md` Section 3, e.g. `pnpm --filter <app-name> build`
- Smoke checks on critical flows (parity-checklist)
- No new console/runtime errors
- `jq '.dependencies | keys[]' apps/<APP>/package.json` - confirm removed deps are gone
- `pnpm list --filter=<app-name> <removed-dep-name>` - confirm dep still resolves transitively
- Dependency version alignment check:
  ```bash
  # Confirm React 19 is resolved
  node -e "console.log(require('./apps/<APP_NAME>/node_modules/react/package.json').version)"
  # Must output 19.x.x

  # Confirm eslint-config-next matches next major
  node -e "const p = require('./apps/<APP_NAME>/package.json'); console.log('next:', p.dependencies.next, 'eslint-config-next:', p.devDependencies['eslint-config-next'])"
  # next major and eslint-config-next major must match
  ```
- Post-upgrade checklist in `09-dependency-upgrades.md` fully signed off

## Acceptance Criteria

- Zero replaced duplicates remain without documented reason
- Zero broken imports after removals
- No critical flow regression across this app
- Zero undocumented `package.json` deps (each dep is directly used, config/toolchain owned, peer-required, never-remove, or removed as a confirmed orphan)
- App `package.json` only owns deps that app-local source/config code directly uses or must explicitly own
- Cleanup report provides full before/after accounting including dep changes

````

## After Completing Phase 07

1. Commit all cleanup changes and reports
2. Run the app verification gate from `verification-gate.md` one final time
3. Proceed to Batch 10.5 for deferred dependency resolution
4. Proceed to [08-operational-standards.md](./08-operational-standards.md) only after all apps finish Batch 10 and Batch 10.5

---

_Related: [05-app-migration.md](./05-app-migration.md) - [08-operational-standards.md](./08-operational-standards.md) - [09-dependency-upgrades.md](./09-dependency-upgrades.md)_
