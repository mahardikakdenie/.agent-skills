# 07 — Cleanup & Deprecation

> **Batch:** Batch 10 (+10.5) - Cleanup & Deprecation
> **Branch:** `migrate-app/<app>`
> **Run count:** Once per app — after Batch 5 stabilization
> **Prerequisite:** Phase 05 Batch 5 (Stabilization) complete
> **Prev:** [05-app-migration.md](./05-app-migration.md) · **Next:** [08-operational-standards.md](./08-operational-standards.md)
> **AI execution:** Use **Batch 10** and **Batch 10.5** in [`migration-batch-prompts.md`](./migration-batch-prompts.md) to run this phase with AI assistance

---

## Purpose

After the app is fully migrated and stabilized (Batch 5), perform final cleanup on the `migrate-app/<app>` branch:

1. Remove confirmed-replaced local duplicate components
2. Eliminate dead adapters and stale barrel exports
3. **Deduplicate `package.json` dependencies** — remove packages from `apps/<APP>` that are now
   fully owned as transitive dependencies through `@repo/ui`, eliminating redundancy and version drift
4. **Verify dependency version alignment** — confirm React, TypeScript, and `eslint-config-next`
   are at the correct versions per the upgrade matrix in [09-dependency-upgrades.md](./09-dependency-upgrades.md)
5. Verify a clean build before merging to `migrate-app/base`

> **Scope:** This phase runs **per app** on `migrate-app/<app>`. Cross-app synthesis outputs
> (`30-cleanup-report.md`, `31-deprecation-map.md`) are produced only after ALL apps complete Phase 07.

---

## Prerequisites Checklist

- [ ] You are on `migrate-app/<app>`
- [ ] Phase 05 Batch 5 (Stabilization) is passed
- [ ] No active regressions pending fix

---

## Deliverables

| File                                                                  | Description                                                                             |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `apps/<APP_NAME>/docs/migration/component/_output/_cleanup-report.md` | Per-app cleanup summary (required before merge to `migrate-app/base`)                   |
| `apps/<APP_NAME>/package.json`                                        | Updated — redundant deps removed after deduplication audit                              |
| `packages/ui/docs/normalization/_output/30-cleanup-report.md`         | **Cross-app synthesis** — generated once after ALL apps complete Phase 07, on `feat/ui` |
| `packages/ui/docs/normalization/_output/31-deprecation-map.md`        | **Cross-app synthesis** — what was deprecated across all apps, generated on `feat/ui`   |

---

## Batch Prompt

````md
You are a Principal Frontend Engineer on branch `migrate-app/<app>`.

## Objective

Perform post-migration cleanup across the entire workspace:

1. Remove all confirmed-replaced local duplicate components from this app
2. Remove dead import re-exports and stale local adapter wrappers in this app
3. Verify app build and tests pass with a clean graph
4. Produce the per-app cleanup report

## Inputs (all must be read)

- `apps/<APP_NAME>/docs/migration/component/_output/_migration-log.md`
- `apps/<APP_NAME>/docs/migration/component/_output/_parity-checklist.md`

## Cleanup Rules

### ✅ Safe to remove:

- Local component files in `apps/*/src/components/ui/*.tsx` where:
  - `_migration-log.md` confirms it was replaced by @repo/ui
  - All usage sites have been updated
  - App typecheck/lint/build still passes after removal
- Adapter wrapper files in `apps/*/src/components/ui/adapted/*.tsx` where:
  - The upstream API gap in @repo/ui has been closed (no longer needed)
- Dead `index.ts` re-exports pointing to deleted files
- Stale `// TODO: migrate to @repo/ui` comments

### ⛔ Do NOT remove:

- Components classified `KEEP_APP_LOCAL` (domain forms, table configs, etc.)
- Adapter wrappers still needed due to intentional API difference
- Any component without confirmed replacement (has no `_migration-log.md` entry)
- packages/ui components even if used by fewer apps than expected (keep in package)

### Verification Commands (Safety Check)

Before deleting any component, verify zero usage with `ripgrep`:

```bash
# Check for any remaining imports of Button in the app
rg "import .* from .*/ui/button" apps/<APP_NAME>/src

# Check for any usage of the local component file
rg "<LocalComponentName>" apps/<APP_NAME>/src

# Check for any file still referencing the old path
rg "components/ui/<component-name>" apps/<APP_NAME>/src
```
````

### Barrel File Sanitation

When deleting `apps/<APP_NAME>/src/components/ui/<component>.tsx`:

1. Open `apps/<APP_NAME>/src/components/ui/index.ts` (if it exists)
2. Remove the export line: `export * from './<component>'`
3. Verify no other file imports from the barrel file (e.g., `import { Button } from '@/components/ui'`)
   - If they do, update them to `import { Button } from '@repo/ui'`

---

## Phase 4 — Dependency Audit & Cleanup

> **The dependency hygiene principle:**
> Every entry in `package.json` must have at least one **direct `import`** in that package's
> own source code. A dep belongs at the level that **uses it directly** — not at the level that
> happens to also depend on it. The question is never "does another package also have this?" —
> it is always "does **this app's code** import it directly?"

### What this is NOT

This is **not** a "remove anything that packages/ui also owns" sweep. If an app's
`KEEP_APP_LOCAL` component, utility, page, or service directly imports `react-hook-form`,
`clsx`, `lucide-react`, or any other package — the app owns that dep legitimately and it
**must stay**.

The only situation that warrants removal is: the app lists a dep in `package.json` and
**no file in `apps/<APP>/src/`** contains a direct import of it anymore — because all
consumers of that dep were local components that have since been replaced by `@repo/ui`.

### Scope — All Workspace Packages

This audit covers **all packages in the monorepo workspace**, not just `@repo/ui`:

| Package           | Also produces transitive deps like…                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| `@repo/ui`        | `@radix-ui/*`, `clsx`, `class-variance-authority`, `lucide-react`, `vaul`, `react-day-picker`, `react-hook-form` |
| `@repo/helper`    | utility libraries the helper wraps internally                                                                    |
| `@repo/interface` | pure types — no runtime transitive deps to worry about                                                           |
| `@repo/config`    | Tailwind config — no runtime transitive deps                                                                     |

When `@repo/ui` (or any workspace package) ships a dep as its own `dependency`, consuming
apps get it **transitively at runtime**. If the app's own code no longer directly imports
from that package, the app's explicit listing is orphaned.

### Audit Process

#### Step 1 — Identify candidate orphan deps

For each dep in `apps/<APP>/package.json`, ask: **does any file in `apps/<APP>/src/` directly import it?**

```bash
# Quick audit — iterate over each dep and count direct imports in src/
# Example for a single package:
rg "from ['\"]react-hook-form['\"]" apps/<APP_NAME>/src --type ts --type tsx
# → No results AND react-hook-form is in packages/ui deps? → Candidate for removal
# → Any results in KEEP_APP_LOCAL files, services, pages? → KEEP

# Broader: generate a dep-usage report
node -e "
const pkg = require('./apps/<APP_NAME>/package.json');
const deps = Object.keys({...pkg.dependencies, ...pkg.devDependencies});
deps.forEach(d => process.stdout.write(d + '\n'));
" | while read dep; do
  count=$(rg "from ['\"]${dep}" apps/<APP_NAME>/src --type ts --type tsx -l 2>/dev/null | wc -l)
  echo "$count $dep"
done | sort -n
# Lines showing 0 = no direct imports found → candidates for further review
```

> Output `0` for a dep means **no direct import found in app source** — not an automatic
> removal. It is the starting point for investigation, not the verdict.

#### Step 2 — Confirm each candidate individually

For each dep showing `0` direct imports:

1. **Is it used in `next.config.ts`, `tailwind.config.ts`, or other config files at app root?**
   → Those are valid direct usages even though they're not in `src/`. **KEEP**.
2. **Is it a peer dep of another direct dep the app uses?** (e.g., `react` is a peer of
   `react-hook-form`)
   → App must own all React-related peer deps explicitly. **KEEP**.
3. **Is it in `devDependencies` and used only during build/test?** (e.g., `postcss`,
   `eslint`, `@types/*`)
   → Audit `@types/*` separately: if the underlying package is being removed, the `@types`
   for it is also removed. If the underlying package is kept, so is its `@types`.
   → Exception: if the package is `webpack-obfuscator`, remove it per
   [09-dependency-upgrades.md](./09-dependency-upgrades.md) Part A6 to keep Turbopack-compatible defaults.
4. **Was it only imported inside local component files that have now been deleted?**
   → This is the only true orphan case. Confirm the files are gone, then **REMOVE**.

#### Step 3 — Decision table

| Condition                                                                                          | Decision                                                                  |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| App's `src/` code directly imports the package (KEEP_APP_LOCAL, services, pages, utilities)        | ✅ **KEEP** — app directly owns it                                        |
| Package is used in `next.config.ts`, `tailwind.config.ts`, or other root configs                   | ✅ **KEEP** — valid direct usage                                          |
| Package is a peer dep of another dep the app uses (e.g., `react`, `react-dom`)                     | ✅ **KEEP** — required by the ecosystem                                   |
| Package is a `devDependency` used during build or type-checking                                    | ✅ **KEEP** — part of the app's build toolchain                           |
| Package is a monorepo workspace package (`@repo/*`)                                                | ✅ **KEEP** — always explicit, never rely on transitive `@repo/*` linking |
| App's `src/` has zero direct imports AND the package was only used by now-deleted local components | ⛔ **REMOVE** — true orphan                                               |
| App's `src/` has zero direct imports AND unclear why it's there                                    | 🔍 **Investigate first** — do not remove until reason is confirmed        |

#### Step 4 — Examples of deps that look redundant but are legitimately app-owned

```
react-hook-form   → used directly in KEEP_APP_LOCAL domain forms (BrokerFeeForm, ClaimForm)
lucide-react      → used directly in page-level components, not just @repo/ui components
clsx              → used directly in app utility functions or KEEP_APP_LOCAL components
date-fns          → used directly in services, formatters, or page components
recharts          → used directly in dashboard page components with domain data
zod               → used directly in app-level form validation schemas
axios             → used directly in API client / service layer
```

If the app code imports any of the above, **keep them even if `@repo/ui` also has them**.
The app is a first-class consumer, not a pass-through.

#### Step 5 — Remove confirmed orphans

```bash
# Only after Step 2 confirms zero legitimate usage:
pnpm --filter <APP_PACKAGE> remove <orphan-dep>

# Verify immediately using the exact app typecheck/build commands from `verification-gate.md` §1 and §3.

# Confirm the dep still resolves transitively if it's in a workspace package:
pnpm --filter <APP_PACKAGE> list <removed-dep>
```

### Packages Always Kept at App Level (Never Remove)

Regardless of transitive availability, these always stay explicit in `apps/<APP>/package.json`:

```
next                     — the app's framework; must be explicit
react / react-dom        — runtime host; every Next.js app owns these directly
tailwindcss              — app builds its own CSS; @repo/ui's version is for Storybook only
tailwindcss-animate      — Tailwind plugin referenced directly in tailwind.config.ts
postcss                  — CSS build toolchain
eslint / eslint-config-next — linting toolchain
typescript               — compiler
@types/node              — required by Next.js config (ts/mjs)
@types/react             — required for TSX compilation
@types/react-dom         — required for TSX compilation
@repo/ui                 — always explicit; the shared lib
@repo/helper             — always explicit; workspace utility
@repo/interface          — always explicit; shared domain types
@repo/eslint-config      — always explicit; linting config
@repo/typescript-config  — always explicit; TS config extension
```

> **Rule on `@repo/*` packages:** Never rely on transitive resolution of workspace packages.
> If an app uses `@repo/helper`, it must list it explicitly in `package.json` — even if
> `@repo/ui` also depends on it. Transitive workspace linking is fragile and defeats the
> explicit ownership contract.

- Identify any exported components in `packages/ui/src/index.ts` with zero usages across all apps
- Document in `_output/31-deprecation-map.md` but do NOT remove (kept for future apps)

### Zero-Usage `packages/ui` Component Policy

A `packages/ui` component with zero usages across ALL currently migrated apps is NOT automatically deleted. Apply this decision table:

| Scenario                                                                    | Action                                                                                                                                                                          |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component was built speculatively and no app has ever used it               | Mark `@deprecated` in the component file and raise it in Phase 08 review. If still unused after 2 consecutive migration cycles (or 6 months), remove with a major version bump. |
| Component was used during migration but all consumers have since removed it | Keep for now. Document in `31-deprecation-map.md` as a candidate for removal. Review in the next quarterly `packages/ui` audit.                                                 |
| Component is used by apps not yet migrated (still in queue)                 | **KEEP** — it is actively needed. Do not mark deprecated.                                                                                                                       |
| Component was built for a `NEW_SHARED_COMPONENT` that only one app needed   | Retain. Reassess shared-vs-local boundary per `06-component-standards.md` Section 6 if still unused at end of full migration program.                                           |

> **Rule:** Never silently delete a `packages/ui` export — it breaks any app that imports it. Always maintain the deprecation paper trail in `31-deprecation-map.md`.

## Required Output: `_output/30-cleanup-report.md`

```

## Cleanup Report — <date>

### Summary

- Apps cleaned: N
- Files removed: N
- Lines removed: ~N
- Adapters removed: N
- Adapters retained (intentional): N (with reason)
- Dependencies removed: N (list them)
- Dependencies retained despite redundancy: N (with reason)

### Per-App Cleanup

#### admin-portal

| Component         | Action   | Rationale                            |
| ----------------- | -------- | ------------------------------------ |
| Button.tsx        | REMOVED  | Fully replaced by @repo/ui Button    |
| DataTable.tsx     | REMOVED  | Fully replaced by @repo/ui DataTable |
| BrokerFeeForm.tsx | RETAINED | KEEP_APP_LOCAL (business logic)      |

#### Dependency Deduplication

| Package                   | Action  | Reason                                           |
| ------------------------- | ------- | ------------------------------------------------ |
| @radix-ui/react-dialog    | REMOVED | Transitive via @repo/ui, zero app-local usage    |
| clsx                      | REMOVED | Transitive via @repo/ui, zero app-local usage    |
| class-variance-authority  | REMOVED | Transitive via @repo/ui, zero app-local usage    |
| react-hook-form           | RETAINED | Used directly in KEEP_APP_LOCAL BrokerFeeForm   |

#### [repeat for each app]

### packages/ui Zero-Usage Components

| Component | Usage Count | Decision |
| --------- | ----------- | -------- |
| Box       | 2 apps      | KEEP     |

```

## Required Output: `_output/31-deprecation-map.md`

```

## Deprecation Map — <date>

### Deprecated (removed from apps)

| Component                                      | Removed From | Replaced By     | Date       |
| ---------------------------------------------- | ------------ | --------------- | ---------- |
| apps/admin-portal/src/components/ui/button.tsx | admin-portal | @repo/ui Button | 2026-03-01 |

### Intentionally Retained (app-local)

| Component     | App          | Reason                       |
| ------------- | ------------ | ---------------------------- |
| BrokerFeeForm | admin-portal | Business logic (domain form) |

```

## Verification Gate (ALL must pass)

- App typecheck: use the exact command from `verification-gate.md` §1
- App lint: use the exact command from `verification-gate.md` §2
- App build: use the exact command from `verification-gate.md` §3
- Smoke checks on critical flows (parity-checklist)
- No new console/runtime errors
- `jq '.dependencies | keys[]' apps/<APP>/package.json` — confirm removed deps are gone
- `pnpm list --filter=<app-name> <removed-dep-name>` — confirm dep still resolves transitively
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
- No critical flow regression across any app
- Zero redundant `package.json` deps (all removable deps removed or documented with reason for retention)
- App `package.json` only owns deps that app-local code directly uses
- Cleanup report provides full before/after accounting including dep changes

```

## After Completing Phase 07

1. Commit all cleanup changes and reports
2. Run full monorepo verification gate one final time
3. Proceed to [08-operational-standards.md](./08-operational-standards.md)

---

_Related: [05-app-migration.md](./05-app-migration.md) · [08-operational-standards.md](./08-operational-standards.md) · [09-dependency-upgrades.md](./09-dependency-upgrades.md)_
```
