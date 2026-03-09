# Migration Batch Prompts - Component Migration

> **How to use:** One file, one-way. Work through Batch 0 -> Batch 11 in order.
> Copy-paste each prompt block exactly. Replace placeholders before running.
> Legacy Update batches (L1-L6) can interrupt at any point - see the [Legacy Update section](#legacy-update-batches-l1l6).

---

## Placeholders

Replace these in every prompt before running:

| Placeholder       | Value               | Description                               |
| ----------------- | ------------------- | ----------------------------------------- |
| `<APP_NAME>`      | `admin-portal`      | App slug (matches `apps/` directory name) |
| `<APP_PATH>`      | `apps/admin-portal` | Monorepo-relative path to app root        |
| `<APP_PACKAGE>`   | `admin-portal`      | Package name for `pnpm --filter`          |
| `<LEGACY_REMOTE>` | `admin-portal`      | Git remote name for the legacy repo       |
| `<LEGACY_BRANCH>` | `stage`             | Default branch of the legacy repo         |

---

## Related Documents

- `<APP_PATH>/docs/migration/component/00-overview.md` - Branch model & lifecycle
- `<APP_PATH>/docs/migration/component/01-app-audit.md` - Batch 1 spec
- `<APP_PATH>/docs/migration/component/02-design-system-foundation.md` - Batch 2 spec
- `<APP_PATH>/docs/migration/component/03-migration-plan.md` - Batch 3 spec
- `<APP_PATH>/docs/migration/component/04-build-shared-components.md` - Batches 4-5 spec
- `<APP_PATH>/docs/migration/component/05-app-migration.md` - Batches 6-9 spec
- `<APP_PATH>/docs/migration/component/06-component-standards.md` - Component standards (always-on)
- `<APP_PATH>/docs/migration/component/07-cleanup.md` - Batch 10 spec
- `<APP_PATH>/docs/migration/component/08-operational-standards.md` - Batch 11 spec
- `<APP_PATH>/docs/migration/component/legacy-update-routines.md` - Legacy update routines (Routine 1-6)
- `<APP_PATH>/docs/migration/component/legacy-update-integration-guide.md` - Legacy update quick reference
- `<APP_PATH>/docs/migration/verification-gate.md` - App-specific verification commands

---

## Available AI Agent Skills

The following skills may be installed in this project (`skills/`). **Only use a skill if it is installed.** Each batch prompt lists relevant skills with `$skill-name` notation - skip any that are not present.

| Skill                          | When it applies                                                                                                                           |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `$design-system`               | Writing component specs, token conventions, CVA patterns, accessibility standards, design system architecture                             |
| `$monorepo-workspace`          | Package boundaries, what to import from where, cn() correct import, turbo task names, --filter commands, legacy dep state in admin-portal |
| `$vercel-composition-patterns` | Evaluate on every component; apply when compound-component structure, slot APIs, context sharing, or boolean prop proliferation risk exists |
| `$next-best-practices`         | RSC boundary placement, async APIs, `'use client'` / `'use server'`, App Router patterns                                                  |
| `$next-cache-components`       | Components that wrap cached server data (`use cache`, cacheLife, cacheTag, PPR)                                                           |
| `$turborepo`                   | Verification gate commands, `--filter` usage, pipeline task configuration, `pnpm` monorepo                                                |
| `$react-query`                 | Data fetching in migrated components: `useQuery`, `useMutation`, query key conventions, invalidation strategy                             |
| `$forms-validation`            | Form-heavy component migration: `react-hook-form` v7 + `zod` patterns, `@repo/ui` form component integration                              |
| `$agent-browser`               | Smoke route testing, visual parity validation, automated interaction verification                                                         |
| `$next-upgrade`                | Upgrading Next.js during migration setup or if version bump is required                                                                   |
| `$vercel-react-best-practices` | Baseline for component work in `packages/ui` and apps: render behavior, bundle discipline, composition cost, and React/Next.js performance |
| `$systematic-debugging`        | Available in every batch; use before attempting fixes whenever a gate fails, behavior regresses, or the root cause is unclear            |
| `$web-design-guidelines`       | Baseline UI quality review for component implementation and migration: accessibility, semantics, focus, and interface guideline compliance |

---

## Skill Usage Policy

- `$systematic-debugging` is available in **every batch**. If any command fails, parity drifts, behavior regresses, or a root cause is unclear, use it before attempting fixes.
- For **Batches 4-5** (`packages/ui` build) and **Batches 6-9** (app-side component migration), `$web-design-guidelines` and `$vercel-react-best-practices` are baseline skills, not optional add-ons.
- `$vercel-composition-patterns` must be **evaluated for every component**. Actively apply it when the selected component has compound sub-components, slot APIs, shared context, or boolean-prop/API-sprawl risk.
- Use `$design-system`, `$monorepo-workspace`, and `$turborepo` as the core operating set for shared component work on `feat/ui`.
- Use `shadcn MCP` and `context7 MCP` as the default reference pair for Batch 4-5 component build work when a registry baseline or Radix/library API lookup would reduce ambiguity.

---

## Available MCP Servers

The following MCP servers may be available in this workspace. Use them only if they are actually installed in the current session.

| MCP server | When it applies |
| ---------- | ---------------- |
| `next-devtools MCP` | Next.js upgrade/runtime verification, component tree inspection, server log analysis, and RSC/client-boundary checks during app-side work |
| `shadcn MCP` | Shared component scaffolding/baseline lookup for Batch 4-5 component work before normalization into `packages/ui` conventions |
| `context7 MCP` | Radix and library API lookup before finalizing component interfaces, props, and accessibility behavior |

## MCP Usage Policy

- Use `next-devtools MCP` during Batch 0.5 and other app-side runtime verification steps when Next.js upgrade, server logs, or RSC/client boundaries need inspection.
- Use `shadcn MCP` and `context7 MCP` by default for Batch 4-5 component work when they reduce ambiguity or accelerate correct implementation.
- Do not assume an MCP is available just because it is named in this file; verify availability in the current session first.

---

## Batch 0 - Verification Gate Setup

> **Branch:** `migrate-app/<APP_NAME>`
> **Run:** Once per app, before anything else
> **Blocks:** All subsequent batches

````
You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read `<APP_PATH>/docs/migration/component/00-overview.md` Branch Model section.
Read `<APP_PATH>/docs/migration/verification-gate.md` if it already exists.

## Step 0a - Package Manager Normalization (REQUIRED FIRST)

This monorepo uses **pnpm exclusively**. Before doing anything else, enforce this on the app scope first, then workspace root:

```bash
# Detect lock files inside the current app scope
find <APP_PATH> -name "yarn.lock" -not -path "*/node_modules/*"
find <APP_PATH> -name "package-lock.json" -not -path "*/node_modules/*"

# Detect lock files only at workspace root
find . -maxdepth 1 -name "yarn.lock"
find . -maxdepth 1 -name "package-lock.json"
````

If any are found, **delete them immediately**:

```bash
# Remove lock files in the current app scope
find <APP_PATH> -name "yarn.lock" -not -path "*/node_modules/*" -delete
find <APP_PATH> -name "package-lock.json" -not -path "*/node_modules/*" -delete

# Remove lock files only at workspace root
find . -maxdepth 1 -name "yarn.lock" -delete
find . -maxdepth 1 -name "package-lock.json" -delete
```bash

Then reinstall with pnpm to ensure `pnpm-lock.yaml` is the authoritative lock file:

```bash
pnpm install
```

> [!IMPORTANT]
> If `pnpm-lock.yaml` does not exist at the repo root after `pnpm install`, something is
> wrong - do not proceed. Confirm the root `package.json` has `"packageManager": "pnpm@..."`.

Commit the cleanup if any lock files were removed:

```bash
git add -A
```bash

Use commit scope by lock-file location:

- If removed files are only under `apps/<APP_NAME>`: `git commit -m "chore(<APP_NAME>): enforce pnpm - remove yarn.lock / package-lock.json"`
- If removed files include workspace root (or multiple apps): `git commit -m "chore: enforce pnpm - remove yarn.lock / package-lock.json"`

---

## Step 0b - Verification Gate Setup

Create `<APP_PATH>/docs/migration/verification-gate.md` using the **exact template below**.
Replace `<APP_NAME>`, `<APP_PACKAGE>`, and the smoke routes list with values for THIS app
before writing the file. The structure must remain identical across all apps.

To discover the correct smoke routes, run:
```bash
find <APP_PATH>/src/app -name "page.tsx" | sed 's|.*/src/app||' | sed 's|/page.tsx||' | sort
```
Pick the 5-10 most critical routes (dashboards, main list pages, key detail pages).

---

**Template - write this verbatim (with placeholders filled) as `verification-gate.md`:**

````markdown
# Verification Gate - <APP_NAME>

This file defines the mandatory verification gate for component migration work in `apps/<APP_NAME>`.

## 0. Package Manager Normalization (Prerequisite)

Before running the gate, ensure pnpm-only lockfile normalization is satisfied for both scopes below:

- App scope check (`apps/<APP_NAME>`): no `yarn.lock` or `package-lock.json` under app files (exclude `node_modules` and `.next`).
- Workspace root check: no `./yarn.lock` and no `./package-lock.json`.
- Root `package.json` keeps `"packageManager": "pnpm@..."`.
- Root `pnpm-lock.yaml` exists and is the single lockfile source of truth.

If rogue lockfiles are found, remove them in the correct scope, then run `pnpm install` before continuing.

Commit-message scope rule when lockfiles are removed:
- App-only removal: `chore(<APP_NAME>): enforce pnpm - remove yarn.lock / package-lock.json`
- Root or multi-scope removal: `chore: enforce pnpm - remove yarn.lock / package-lock.json`

## 1. Typecheck Command

`<verification-gate.md Section 1 typecheck command>`

## 2. Lint Command

`<verification-gate.md Section 2 lint command>`

## 3. Build Command

`<verification-gate.md Section 3 build command>`

Build/runtime mode note:

- `dev` runs with Turbopack by default (`next dev`).
- `build` runs with `next build` (no forced `--webpack`).
- No custom obfuscation step is applied; rely on Next.js production minification and default source-map behavior.

## 4. Turborepo Package Name

- App package name: `<APP_PACKAGE>`
- Correct filter selector: `--filter <APP_PACKAGE>`

> [!NOTE]
> **Sections 1-5 above apply to ALL migration types** (service migration and component migration).
> **Sections 6-7 below apply to COMPONENT MIGRATION ONLY.** Service migration uses only Section 1-5 from this file.

## 5. Smoke Routes (Critical Only)

Auth pre-step (required when redirected to login):

- Email: process.env.SMOKE_TEST_EMAIL
- Password: process.env.SMOKE_TEST_PASSWORD
- If any smoke route redirects to login, authenticate first with the credentials above, then continue route checks in the same browser session.

Run smoke checks on these critical routes after migration changes:

1. <!-- fill in critical route -->
2. <!-- fill in critical route -->
3. <!-- fill in critical route -->
4. <!-- fill in critical route -->
5. <!-- fill in critical route -->

## 6. Before/After Artifact Capture - Component Migration Only

Artifacts are the primary comparison object between the pre-migration baseline and the post-migration state.

### Directory structure

```txt
apps/<APP_NAME>/docs/migration/component/_artifacts/smoke-routes/
|-- before/
|   |-- 01-<route-label>.png
|   |-- ... (one file per route above, numbered to match Section 5)
|-- after/
    |-- 01-<route-label>.png
    |-- ...
```

### Capture rules

- **Before** - taken from baseline state before migration patches are applied.
- **After** - taken after migration patches are applied and the build passes.
- **Naming** - zero-padded route number + kebab-case route label (e.g., `01-dashboard-transaction.png`).
- **Viewport** - 1440x900, full-page screenshot.
- **Auth state** - taken while authenticated (never the login page itself).

### PASS / FAIL criteria

A route is **PASS** when ALL of the following hold after comparing before vs after screenshot and running one interaction pass:

| Check | PASS condition |
|-------|---------------|
| Visual parity | Layout, spacing, hierarchy, typography, key color usage unchanged - or delta is caused solely by design system token adoption |
| Interaction parity | Click, hover, keyboard nav, focus states behave identically |
| State parity | Loading, empty, disabled, success, error states consistent |
| Data/UI parity | Table columns, filters, sort, pagination unchanged |
| Console/network sanity | Zero new console errors or failing network requests |

A route is **FAIL** if any check above does not hold and the delta is **not** an approved token-level design system change.

### Comparison log

Record diffs in `_artifacts/smoke-routes/comparison-log.md` using this structure per route:

```markdown
## Route: <path> (#<N>)

| Field              | Before | After | Delta |
|-------------------|--------|-------|-------|
| Screenshot        | [before](./before/<NN-label>.png) | [after](./after/<NN-label>.png) | Visual diff |
| Console errors    | 0 | 0 | - |
| Network errors    | 0 | 0 | - |
| Visual parity     | PASS | PASS | - |
| Interaction parity| PASS | PASS | - |
| State parity      | PASS | PASS | - |
| Data/UI parity    | PASS | PASS | - |
| Result            | - | - | PASS |
| Intentional delta | - | - | none |
```md

Gate is **passed** only when all routes have a completed comparison entry with no unresolved deltas.

## 7. Parity Baseline - Component Migration Only

For each smoke route, verify all of the following:

- Visual parity: layout, spacing, hierarchy, typography, and key color usage are unchanged except for approved token-level deltas.
- Interaction parity: click, hover, keyboard navigation, and focus states behave the same as baseline.
- State parity: loading, empty, disabled, success, and error states remain consistent.
- Data/UI parity: table columns, filters, sort behavior, and pagination controls match current behavior.
- Console/network sanity: no new console errors or failing network requests introduced by migration.

Evidence method:

1. Capture before/after screenshots of each smoke route and store them under `apps/<APP_NAME>/docs/migration/component/_artifacts/smoke-routes/`.
2. Run one interaction pass per route (filter, navigate, submit, modal open/close where available).
3. Record any intentional deltas and approval context in the migration output docs.
````

---

After writing the file, run the verification gate and report results. If any command fails, fix only the
pre-existing issue (do not modify component or migration files).

> Skills (if installed): `$monorepo-workspace` (confirm correct --filter selector for this app, script names available); `$turborepo` (confirm correct --filter values, verify task pipeline is set up); `$next-upgrade` (if Next.js version needs updating before migration begins); `$systematic-debugging` (if any gate command fails - trace root cause before attempting fixes)

Do NOT create any migration output files yet.

```

---

## Batch 0.5 - Dependency Version Upgrade (Pre-Migration)

> **Branch:** `migrate-app/<APP_NAME>`
> **Run:** Once per app - immediately after Batch 0 (Verification Gate Setup)
> **Blocks:** All subsequent batches - do NOT start Batch 1 until this gate passes
> **Spec doc:** `<APP_PATH>/docs/migration/component/09-dependency-upgrades.md`

```bash

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read before starting:

- `<APP_PATH>/docs/migration/component/09-dependency-upgrades.md` (full spec - Part A for platform standards, Part B for app-specific audit)
- `<APP_PATH>/docs/migration/verification-gate.md`
- `<APP_PATH>/package.json` (current installed versions)

## Objective

Align `<APP_NAME>`'s dependency versions with the monorepo platform baseline before any component
migration begins. `packages/ui` targets React 19, Tailwind CSS v4, TypeScript 5.9.2, and
Next.js 16 - this app must be fully aligned, including all config and async-API changes,
before @repo/ui components are imported.

If an upgrade requires a config file change or `await` addition, make it. A mechanical update
is part of the upgrade, not a reason to skip it. The goal is working output identical to pre-upgrade.

---

## PART A - Platform-Wide Upgrades (run for every app)

These are monorepo-wide requirements - not optional per-app decisions.

### A1. Pre-Upgrade Snapshot

Capture current versions before making any changes:

```bash
cat <APP_PATH>/package.json | jq '{
  react: .dependencies.react,
  "react-dom": .dependencies["react-dom"],
  "@types/react": .devDependencies["@types/react"],
  "@types/react-dom": .devDependencies["@types/react-dom"],
  typescript: .devDependencies.typescript,
  "tailwindcss": .devDependencies.tailwindcss,
  "eslint-config-next": .devDependencies["eslint-config-next"],
  next: .dependencies.next
}'
```

### A2. Upgrade React -> 19

```bash
pnpm --filter <APP_PACKAGE> add react@^19 react-dom@^19
pnpm --filter <APP_PACKAGE> add -D @types/react@^19 @types/react-dom@^19
```bash

### A3. Align TypeScript + ESLint toolchain

```bash
# Pin TypeScript to match root workspace and packages/ui
pnpm --filter <APP_PACKAGE> add -D typescript@5.9.2

# eslint-config-next must match the installed next major version
# e.g. if next is 15.x -> eslint-config-next@15
pnpm --filter <APP_PACKAGE> add -D eslint-config-next@<NEXT_MAJOR>

# Use range, not pinned version
pnpm --filter <APP_PACKAGE> add -D @types/node@^22
```

### A4. Upgrade Tailwind CSS -> v4

```bash
pnpm --filter <APP_PACKAGE> add -D tailwindcss@^4 @tailwindcss/postcss@^4
```md

Apply **mandatory config changes**:

**`postcss.config.js` (or `.cjs`):**

```diff
-module.exports = {
-  plugins: {
-    tailwindcss: {},
-    autoprefixer: {},
-  },
-};
+module.exports = {
+  plugins: {
+    '@tailwindcss/postcss': {},
+  },
+};
```

> autoprefixer is bundled in Tailwind v4 - removing it from postcss is correct.

**`globals.css` (or `app/globals.css`):**

```diff
-@tailwind base;
-@tailwind components;
-@tailwind utilities;
+@import "tailwindcss";
+@config "../tailwind.config.ts";
```md

> `@config` preserves all existing `tailwind.config.ts` customizations.
> Adjust the relative path to match your config file location.

**`tailwind.config.ts` - remove v3-only keys (do not touch theme/content):**

```diff
-  mode: 'jit',         // v4 default, ignored
-  future: {},          // v3-only
-  experimental: {},    // v3-only
```

If the app uses Tailwind plugins (e.g. `@tailwindcss/forms`, `@tailwindcss/typography`), check
whether they have a Tailwind v4-compatible release and upgrade accordingly.
Any plugin whose utility is now built into Tailwind v4 core - remove its `plugins` entry.

### A5. Upgrade Next.js -> 16

#### Step A5-1 - Run the official Next.js upgrade codemod

This handles the majority of async API changes (params, searchParams, cookies, headers) automatically:

```bash
cd <APP_PATH>
npx @next/codemod@canary upgrade latest
```bash

Review the codemod diff carefully - accept all proposed changes. It patches:

- `page.tsx`, `layout.tsx`, `route.ts` - `await params` / `await searchParams`
- Server Components calling `cookies()` or `headers()` - adds `await`
- `generateMetadata` functions - adds `await params`

#### Step A5-2 - Install Next.js 16 + eslint-config-next

```bash
pnpm --filter <APP_PACKAGE> add next@^16
pnpm --filter <APP_PACKAGE> add -D eslint-config-next@16
```

#### Step A5-3 - Verify with next-devtools MCP

Use next-devtools MCP after starting the dev server:

- Inspect component tree on 3-5 key routes from `verification-gate.md` smoke list
- Confirm no `"params is not a Promise"` or `"cookies() was called outside"` warnings in server logs
- Verify no `"use server"` marker appears inside `@repo/ui` component subtree
- Confirm RSC vs client component boundaries are intact after codemod
- Check Time to First Byte has not regressed (PPR-enabled apps)

#### Step A5-4 - Run check-types after codemod

```bash
<verification-gate.md Section 1 typecheck command>
```bash

Common remaining issues after codemod:

- `Type 'Promise<Params>' is not assignable` -> manually add `await` + mark function `async`
- `cookies() expects no arguments` -> remove call args, use `.get(name)` after `await`
- `searchParams` property access on plain object -> use `const sp = await searchParams` at top

### A6. Remove webpack-obfuscator for Turbopack compatibility (conditional)

Only apply this step if the app currently uses `webpack-obfuscator` in `next.config.*` and/or forces webpack mode in scripts.

```bash
# Detect legacy webpack-only obfuscation
rg "webpack-obfuscator|NEXT_ENABLE_OBFUSCATOR|next build --webpack|next dev --webpack" <APP_PATH>
```

If detected, remove legacy obfuscation wiring:

1. Remove `webpack-obfuscator` import/plugin hook from `next.config.*`.
2. Update scripts to use default Next.js commands (no `--webpack`):
   - `dev`: `next dev`
   - `build`: `next build`
3. Remove dependency:

```bash
pnpm --filter <APP_PACKAGE> remove webpack-obfuscator
```bash

Guardrails:

- Do **not** introduce a custom post-build obfuscation script in this migration batch.
- Keep runtime behavior unchanged; only remove build-time webpack-only obfuscation integration.
- Rely on Next.js production minification defaults and default source-map behavior.

Verification commands (run both):

```bash
<verification-gate.md Section 3 build command>
pnpm --filter <APP_PACKAGE> dev
```

### A7. Install and check for peer dep warnings

```bash
pnpm install
```bash

Review output. Document any warnings.

---

## PART B - App-Specific Package Cleanup (audit first, then act)

Every app has different legacy packages. Do NOT assume what needs removing - audit first.

### B1. Audit all direct dependencies for dead/deprecated packages

```bash
# List all direct deps
cat <APP_PATH>/package.json | jq '{dependencies, devDependencies}'
```

For each package, determine:

1. **Is it deprecated?** (npm warns at install, package archived, no releases in 2+ years)
2. **Is it made redundant by a platform upgrade?** (e.g., a utility now built into React 19, Tailwind v4, or Next.js 16)
3. **Does it have no maintained upgrade path?** (deep dependency on React 16/17-era APIs)
4. **Is it superseded by something already in the deps?** (old + new version of the same thing)

```bash
# For any candidate package - check if it is actually imported anywhere
rg "from '<package-name>'" <APP_PATH>/src <APP_PATH>/app --type ts
# Zero results = no direct source usage -> candidate for removal
# Non-zero = still actively used -> keep or defer
```bash

Also confirm it is not used in config files (next.config.ts, tailwind.config.ts, postcss.config.js)
before removing.

### B2. Decide and act

- **Remove legacy webpack obfuscation** - if the app still uses `webpack-obfuscator`, remove the webpack-only integration per Part A6 (do not replace with a custom obfuscation script in this batch).

- **Remove** - if deprecated AND zero direct usage AND not needed in configs

  ```bash
  pnpm --filter <APP_PACKAGE> remove <package-name>
  ```

  Re-run `check-types` immediately after each removal.

- **Keep and defer** - if still used in source but has no clean upgrade path:
  Record in `_migration-log.md` under "Deferred Items" with:
  - Current version retained
  - Why upgrade is deferred (no upgrade path / requires full refactor)
  - Planned replacement or upgrade approach and target sprint

- **Keep** - if actively used and has a maintained upgrade path that's out of scope for this batch

> Rule: After Batch 0.5, every package in `package.json` must be one of:
> **upgraded** - **removed** - **deferred with documented reason**. Nothing undocumented.

---

## Verification Gate (ALL must pass before calling Batch 0.5 complete)

```bash
# TypeScript - zero errors
<verification-gate.md Section 1 typecheck command>

# Lint - zero errors
<verification-gate.md Section 2 lint command>

# Build - clean
<verification-gate.md Section 3 build command>

# Dev server - start and smoke check 3-5 key routes
# Confirm: no CSS regressions, no console errors, layout identical to pre-upgrade
pnpm --filter <APP_PACKAGE> dev
```

Targeted scans:

```bash
# Confirm React 19 removed import is gone
rg "from 'react-dom/test-utils'" <APP_PATH>/src <APP_PATH>/app
rg 'from "react-dom/test-utils"' <APP_PATH>/src <APP_PATH>/app

# Confirm Tailwind v3 directives are gone
rg "@tailwind base\|@tailwind components\|@tailwind utilities" <APP_PATH>

# Next.js 16 - confirm no remaining sync access to async APIs
# (codemod output should have fixed these - zero hits expected)
rg "const params = " <APP_PATH>/app --include="*.tsx" --include="*.ts"
rg "\.cookies\(\)\." <APP_PATH>/app --include="*.tsx" --include="*.ts"
# If any hits remain, those files still access cookies()/params synchronously - add await
```md

## Common Issues and Fixes

| Problem                                             | Fix                                                                                           |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `Property 'children' does not exist` on `React.FC`  | Add `children?: React.ReactNode` to the Props interface                                       |
| `Type 'X' is not assignable to 'ReactNode'`         | Fix the return type - stricter in React 19                                                    |
| `Module 'react-dom/test-utils' has no export 'act'` | `import { act } from 'react'`                                                                 |
| ESLint rule errors after `eslint-config-next` bump  | Check `.eslintrc` for renamed rule keys                                                       |
| CSS not loading                                     | `postcss.config.js` still uses old tailwindcss plugin - switch to `@tailwindcss/postcss`      |
| Theme tokens missing                                | Add `@config "../tailwind.config.ts"` to `globals.css`                                        |
| `Type 'Promise<Params>' is not assignable to...`    | Codemod missed a params access - add `await` manually, mark fn `async`                        |
| Route behaves differently after codemod             | Check server logs for `cookies()` or `params` sync-access warning - add `await` where flagged |
| ESLint errors on `next/config` imports              | Removed in Next.js 16 - replace with `process.env` or Next.js runtime config                  |

## Guardrails

ALLOWED:

- Upgrading packages per Part A (React 19, Next.js 16, Tailwind v4, TypeScript 5.9.2)
- Running `npx @next/codemod@canary upgrade latest` and accepting all its proposed changes
- Adding `await` to `params`, `searchParams`, `cookies()`, `headers()` calls (codemod output)
- Removing confirmed-dead packages found in Part B audit
- Updating `postcss.config.js`, `globals.css`, `tailwind.config.ts` per Part A steps
- Fixing type errors introduced directly by React 19 / Next.js 16 upgrade

FORBIDDEN:

- Refactoring component logic (even if it would look cleaner in React 19)
- Removing `forwardRef` wrappers - they still work; record as improvement candidate
- Removing packages that appear unused without first checking config files and indirect usage
- Attempting large refactors (e.g. replacing a form library, replacing an editor component) - defer those

## Required Output

Use the template in `09-dependency-upgrades.md` Part D to append to
`<APP_PATH>/docs/migration/component/_output/_migration-log.md`.

Key sections to fill:

- **Platform Packages Upgraded** - record all Part A changes with from/to versions
- **Config Changes** - list every config file changed and what changed
- **App-Specific Packages Removed** - only packages confirmed-dead from Part B
- **App-Specific Deferred Items** - every kept-but-problematic package with reason + plan
- **Verification Gate** - results of all four commands

> Skills (if installed): `$next-upgrade` (React + Next.js version alignment steps); `$systematic-debugging` (if check-types fails - trace before fixing); `$monorepo-workspace` (confirm --filter selector, script names); `$next-best-practices` (validate RSC/client boundaries after React 19 + Next.js 16 upgrade); `next-devtools MCP` (component tree inspection, server log analysis, RSC boundary verification - use after A5-3 dev server smoke check)

Do NOT start Batch 1 (Component Audit) until this gate passes.

````


---

## Batch 1 - Per-App Component Audit

> **Branch:** `migrate-app/<APP_NAME>`
> **Run:** Once per app (run all apps before moving to Batch 2)
> **Output:** `<APP_PATH>/docs/migration/component/_output/` - creates 4 files

## Classification Rules (from 06-component-standards.md)

- ADOPT_NOW - locally-defined component that is already available in @repo/ui with matching API
- ADOPT_WITH_ADAPTER - available in @repo/ui but prop API differs from local usage
- EXTEND_EXISTING - @repo/ui has the component but is missing variants/props this app needs
- NEW_SHARED_COMPONENT - purely visual, used by 2+ apps, not in @repo/ui yet
- KEEP_APP_LOCAL - contains business logic, domain types, API calls, app-specific structure, or used only here

## Execution Steps

1. Scan `<APP_PATH>/src/` for all UI component files (not only `src/components/`).
2. Include UI component candidates from common app-local locations, including:
   - `<APP_PATH>/src/components/**`
   - `<APP_PATH>/src/app/**` (route-level UI components)
   - `<APP_PATH>/src/views/**`
   - `<APP_PATH>/src/features/**` (if present)
   - Any other local `*.tsx`/`*.jsx` files that render reusable UI
3. Exclude non-component files from the audit set (utilities, services, hooks-only files, constants, tests, types, API/route handlers).
4. For each component:
   a. Read the component file
   b. Check if it exists in `packages/ui/src/index.ts`
   c. Compare prop API if it exists
   d. Assign one classification using the rules above
   e. **Universal SoC Evaluation (ALL components):** Run the monolith check per [06-component-standards.md Section 6.2](./06-component-standards.md#62-universal-soc-evaluation)
      - Is monolith? (service hook call + display JSX in same function / domain types in JSX / business logic in render / next/link in shell / URL construction in render)
        - **Service hook** = any `use<Domain>()` from `@/services/<domain>/hooks/` (per SERVICE_ARCHITECTURE.md). Raw `useQuery`/`useMutation` in a component = service layer bypassed - fix separately.
      - Rate SoC potential: HIGH | MEDIUM | LOW | NONE
      - Identify SoC strategy: `container-shell | prop-injection | render-prop | hook-extraction | none`
      - Set Batch 1.5 candidate: YES (if HIGH or MEDIUM) | NO
      - If Batch 1.5 candidate = YES: do NOT assign a migration batch number yet (classification = MIGRATE_AFTER_SPLIT)
   f. If KEEP_APP_LOCAL: also fill `Refactor potential` and `Refactor strategy` fields (subset of SoC eval already done in step 4e)
   g. Note parity risk (LOW / MEDIUM / HIGH) based on behavioral complexity
   h. **Consolidation Gate - If NEW_SHARED_COMPONENT:** run Consolidation Quality Gate ([06-component-standards.md Section 6.3](./06-component-standards.md#63-component-api-consolidation-rules))
      - Same root? Small delta (<= 2 props/slots)? No domain logic? -> If YES to all 3: reclassify as `EXTEND_EXISTING`
      - Assign `story_group` from Section 6.4 taxonomy (e.g. `Buttons`, `Overlays`, `Feedback`)
5. Build parity checklist for all shared-candidate components

## Required Outputs (create all 4)

### `<APP_PATH>/docs/migration/component/_output/_audit-report.md`

One entry per component:
```

### ComponentName

- **File:** `src/components/path/ComponentName.tsx`
- **Classification:** ADOPT_NOW | ADOPT_WITH_ADAPTER | EXTEND_EXISTING | NEW_SHARED_COMPONENT | KEEP_APP_LOCAL | MIGRATE_AFTER_SPLIT
- **Batch:** 1 | 2 | 3 | 4 | 1.5 | N/A
- **@repo/ui status:** exists (exact export name) | partial | missing
- **API delta:** (props that differ, if any)
- **Parity risk:** LOW | MEDIUM | HIGH
- **Risk notes:** (what could regress)
- **Reason kept app-local:** (if KEEP_APP_LOCAL - domain logic / API call / app-specific)
- **Is monolith:** YES | NO  <- ALL components; required
- **SoC potential:** HIGH | MEDIUM | LOW | NONE  <- ALL components; required
- **SoC strategy:** `<container-shell | prop-injection | render-prop | hook-extraction | none>`  <- ALL components; required
- **Batch 1.5 candidate:** YES | NO  <- ALL components; YES only if SoC potential HIGH or MEDIUM
- **Refactor potential:** HIGH | MEDIUM | LOW | NONE  <- KEEP_APP_LOCAL only
- **Refactor strategy:** `<container-shell | hook-extraction | prop-injection | none>` - [brief rationale]  <- KEEP_APP_LOCAL only
- **Story group:** `Buttons` | `Inputs` | `Overlays` | `Feedback` | `Navigation` | `Data Display` | `Layout` | `Misc`  <- NEW_SHARED_COMPONENT and EXTEND_EXISTING only

```md

### `<APP_PATH>/docs/migration/component/_output/_component-backlog.csv`

Columns: `component_name,classification,batch,priority,risk_level,source_path,repo_ui_export,effort,parity_risk,is_monolith,soc_potential,soc_strategy,batch_15_candidate,refactor_potential,refactor_strategy,story_group`

### `<APP_PATH>/docs/migration/component/_output/_parity-checklist.md`

For each non-KEEP_APP_LOCAL component, list:
- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color - token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

### `<APP_PATH>/docs/migration/component/_output/_per-app-baseline-summary.md`

Summary for Batch 2 cross-app reconciliation:
- Total components audited
- Count per classification
- Top 5 highest-parity-risk items with notes
- Components that EXTEND_EXISTING: what variants are missing in @repo/ui
- Components that are NEW_SHARED_COMPONENT: full visual spec (props, variants, states)
- KEEP_APP_LOCAL refactor candidates: total KEEP_APP_LOCAL count; count with SoC potential HIGH or MEDIUM; top 3 with SoC strategy and whether Shell is a `packages/ui` candidate
- SoC Evaluation Summary: total Batch 1.5 candidates; breakdown HIGH/MEDIUM/LOW/NONE; projected NEW_SHARED_COMPONENT from splits

> Skills (if installed): `$vercel-composition-patterns` (identify monolith components with mixed domain+display, boolean prop proliferation); `$next-best-practices` (flag invalid RSC+client boundary mixing as forced monolith signal); `$systematic-debugging` (for ambiguous SoC potential - trace data flow from hook to render before rating)

Do NOT modify any source files. Do NOT modify packages/ui.
```

---

## Batch 1.5 - SoC Pre-Migration Refactor

> **Branch:** `migrate-app/<APP_NAME>`
> **Run:** Once per app - after Batch 1 (Audit) passes, before Batch 2/3/4 begins
> **Prerequisite:** Batch 1 acceptance criteria all pass. All components have SoC Evaluation fields in `_audit-report.md`.
> **Skip if:** Zero components are rated `Batch 1.5 candidate: YES` in `_audit-report.md`.
> **Spec:** `<APP_PATH>/docs/migration/component/05-app-migration.md` Batch 1.5
> **Standards:** `<APP_PATH>/docs/migration/component/06-component-standards.md` Section 6.2 - Section 6.5 - Section 6.6

````

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Enterprise mandate: no monolith component survives migration. Components mixing domain wiring and display JSX must be split into a Container + Shell before migration batches run. No runtime behavior changes are allowed. Callers of the original component see zero diff.

## Pre-Flight Check

1. Read `<APP_PATH>/docs/migration/component/_output/_audit-report.md`
2. Filter: collect all entries where `Batch 1.5 candidate: YES`
3. If zero entries -> STOP. Print "Batch 1.5: No candidates. Skip."
4. List candidates ordered by SoC potential (HIGH first), then by component name
5. Read `<APP_PATH>/docs/migration/component/06-component-standards.md` Section 6.2, Section 6.5, Section 6.6 before proceeding

## Execution (one component per commit, atomic)

For each Batch 1.5 candidate (ordered HIGH -> MEDIUM):

### Step 1 - Plan the Split

- Read the component file
- Confirm the SoC strategy recorded in the audit entry (`container-shell | prop-injection | render-prop | hook-extraction`)
- Identify exactly: what JSX moves to Shell, what logic stays in Container
- Identify the Shell's prop interface (only plain data types - no domain imports, no React Query hooks, no Next.js imports)

### Step 2 - Create the Shell file

- Create `<ComponentName>Shell.tsx` (or `*Display.tsx` / `*Layout.tsx` per Section 6.5 naming convention) in the same directory
- Shell contains ONLY: pure display JSX, typed with plain props, no domain imports, no hook calls, no API calls
- Shell may import from `@repo/ui` (Box, Skeleton, Spinner, etc.)
- Shell may NOT import from `@/hooks`, `@/services`, `@/types/domain`, or `next/*`
- Apply Box pass (Section 1.4) to eliminate bare native HTML elements within the Shell

### Step 3 - Refactor the Container

- Container file name, export name, and prop interface are FROZEN - do not change them
- Container calls the data hook / maps domain types -> plain props -> renders Shell
- All existing callers continue to import and use the Container unchanged

### Step 4 - Verification Gate (per component, non-negotiable)

```bash
<verification-gate.md Section 1 typecheck command>    # zero new type errors
<verification-gate.md Section 2 lint command>           # zero new lint errors
<verification-gate.md Section 3 build command>          # clean build
```md

Then:

- Manually smoke-check the component's primary render route
- Run: `grep -r "<OriginalComponentName>" src/ --include="*.tsx" --include="*.ts"` -> confirm zero caller files changed
- Compare rendered HTML before/after (dev tools snapshot) -> must be identical

If gate fails: rollback this component (`git checkout -- .`) and re-assess SoC strategy. Do NOT skip the gate.

### Step 5 - Classify the Shell

Apply the [06-component-standards.md Section 6.6 Shell Classification Matrix](./06-component-standards.md#66-re-classification-after-split):

- Plain props only + no framework imports + 2+ app demand -> `NEW_SHARED_COMPONENT` -> queue for Batches 4-5
- Plain props only + single-app use -> `KEEP_APP_LOCAL` (Shell stays in app)
- Framework dependency abstracted via render-prop -> `NEW_SHARED_COMPONENT` (framework-agnostic interface)

### Step 6 - Update Audit Records

In `_audit-report.md`:

- Mark original entry: `Classification: SPLIT` (do not delete)
- Add Container entry: `Classification: KEEP_APP_LOCAL`, `Batch 1.5 candidate: DONE`
- Add Shell entry: `Classification: <per Step 5 result>`, note created file path

In `_component-backlog.csv`:

- Update original row: `classification = SPLIT`, add note "split into <Container> + <Shell>"
- Add Shell row with its final classification

### Logging Format (`_migration-log.md`)

Append under `## Batch 1.5 - SoC Pre-Migration Refactor`:

```
### <ComponentName> - <date>
- Strategy: <container-shell | prop-injection | render-prop | hook-extraction>
- Container: <file path> - frozen export, KEEP_APP_LOCAL
- Shell: <file path> - <classification: NEW_SHARED_COMPONENT | KEEP_APP_LOCAL>
- Domain logic removed from Shell: <description>
- Box pass: <N> elements replaced
- Gate result: types pass | lint passes | build passes | smoke passes
- Caller grep: zero caller files changed
- packages/ui candidate: YES (<Shell name>, queued for Batches 4-5) | NO
```md

## Batch 1.5 Completion Criteria

- [ ] All Batch 1.5 candidates (`Batch 1.5 candidate: YES`) have been processed or explicitly skipped with documented reason
- [ ] No component failed the gate without rollback
- [ ] `_audit-report.md` updated: every split is marked SPLIT with new Container + Shell entries
- [ ] `_component-backlog.csv` updated: SPLIT rows marked, Shell rows added
- [ ] `_migration-log.md` has a Batch 1.5 section with one entry per component
- [ ] `_per-app-baseline-summary.md` amended with `## Batch 1.5 Amendment` section:
  - Components split: N
  - NEW_SHARED_COMPONENT candidates from splits: N (list names)
  - KEEP_APP_LOCAL-only Shells: N
- [ ] Zero callers changed (grep verified)
- [ ] `<verification-gate.md Section 3 build command>` passes cleanly after all splits

> Skills (if installed): `$vercel-composition-patterns` (verify Shell has no boolean prop proliferation); `$next-best-practices` (confirm no RSC+client boundary violations introduced); `$systematic-debugging` (if gate fails - trace the regression before reverting)

````

---

## Batch 2 - Design System Foundation

> **Branch:** `feat/ui`
> **Run:** ONCE - only after ALL apps have completed Batch 1
> **Prerequisite:** All `_per-app-baseline-summary.md` copied to `packages/ui/docs/normalization/per-app/`

```
You are a Principal Design System Architect on branch `feat/ui`.

Read ALL of these before starting:
- `<APP_PATH>/docs/migration/component/02-design-system-foundation.md` (full spec)
- ALL files in `packages/ui/docs/normalization/per-app/*_baseline-summary.md`
- `packages/ui/src/**` (current @repo/ui state)
- `packages/config/`, `packages/helper/`, `packages/interface/` (shared workspace packages)
- `<APP_PATH>/docs/migration/component/06-component-standards.md`

If ANY per-app baseline summary is missing, list the missing apps and STOP.

## Objective

Produce the governing foundation that defines how packages/ui will be built and maintained.
This is the constitution: once locked, all Batch 3-05 work must conform to it.

## Cross-App Reconciliation (do this before writing ANY output)

1. Union all NEW_SHARED_COMPONENT + EXTEND_EXISTING needs across all apps
2. Resolve API conflicts - where apps use the same component differently, define ONE canonical API
3. Identify most common naming/variant inconsistencies for normalization
4. Identify dependency gaps in packages/ui
5. Assess whether packages/config / packages/helper / packages/interface can serve the workspace better
6. **Consolidation pass** ([06-component-standards.md Section 6.3](./06-component-standards.md#63-component-api-consolidation-rules)) - Before finalizing canonical names, apply the three-question consolidation test to all NEW_SHARED_COMPONENT candidates across apps:
   - Any two candidates sharing the same Radix primitive that differ by <= 2 props/slots MUST be merged into one entry
   - Document merge decisions (what was collapsed and why) in `10-cross-app-reconciliation.md`
   - Assign each surviving candidate its `story_group` per Section 6.4 and record in `05-coverage-baseline.md`

## Required Outputs (create all 6 in `packages/ui/docs/normalization/_output/`)

1. `00-foundation.md` - Governing principles: app-agnostic rule, spec-first mandate, Storybook mandate,
   breaking change policy, review gates, accessibility minimum bar
2. `01-component-taxonomy.md` - Full taxonomy: Tier 1 (Primitives), Tier 2 (Composites), Tier 3 (App-local),
   with @repo/ui status + cross-app frequency
3. `02-api-conventions.md` - Canonical prop interface for EACH component (existing + planned):
   prop names, variant names, size names, event handler signatures, slot names, ref forwarding
4. `03-token-theming-contract.md` - CSS variable system, required tokens, how apps configure globals.css,
   forbidden hardcoded values, dark mode strategy
5. `04-shared-vs-local-boundary.md` - Decision tree, Zombie Code Policy (dead/zombie/divergent),
   per-category rulings from cross-app analysis
6. `06-risk-register.md` - Per high-risk component: risk type, affected apps, mitigation, rollback plan

Also create `05-coverage-baseline.md`:
Table: Component | Tier | @repo/ui status | Apps needing | Priority | Target batch
Summary: N needed, M exist, X to build.

## Acceptance Criteria
- Every per-app baseline need is addressed (extracted to packages/ui or ruled app-local)
- API conventions eliminate all naming conflicts identified in audits
- Risk register covers every HIGH-risk item from per-app parity checklists

> Skills (if installed): `$design-system` (design system principles, accessibility minimum bars, token naming conventions); `$vercel-composition-patterns` (compound component API conventions in 02-api-conventions.md)

Do NOT modify any apps. Do NOT modify packages/ui components (docs only).
After completing, commit to feat/ui.
```md

---

## Batch 3 - Migration Plan

> **Branch:** `feat/ui`
> **Run:** Once - after Batch 2 complete
> **Prerequisite:** All 7 normalization docs from Batch 2 exist

```
You are a Principal Program Architect on branch `feat/ui`.

Read ALL of these before starting:
- `<APP_PATH>/docs/migration/component/03-migration-plan.md` (full spec)
- ALL `packages/ui/docs/normalization/_output/00-*.md` through `06-*.md`
- ALL `apps/*/docs/migration/component/_output/_audit-report.md`
- ALL `apps/*/docs/migration/component/_output/_component-backlog.csv`
- ALL `apps/*/docs/migration/component/_output/_parity-checklist.md`

## Objective

Convert all per-app audits + the Batch 2 foundation into one executable program plan.

## Required Outputs (create all 4 in `packages/ui/docs/normalization/_output/`)

### `10-cross-app-reconciliation.md`

For each unique component need across all apps - one canonical entry:
```md

### ComponentName

- Classification: ADOPT_NOW | EXTEND_EXISTING | NEW_SHARED_COMPONENT | KEEP_APP_LOCAL
- Apps that need it: [list]
- @repo/ui status: exists | missing | partial
- Canonical API: (reference 02-api-conventions.md section)
- Cross-app conflicts resolved: [how any conflicts were resolved]
- Priority: P0 | P1 | P2 | P3
- Risk: HIGH | MEDIUM | LOW
- Target batch: 1 | 2 | 3 | 4

```

### `11-master-component-roadmap.md`

For each component to build or extend:
```md

### ComponentName

- Tier: 1 (Primitive) | 2 (Composite)
- Based on: (Radix primitive | composition | none)
- API: (canonical props from 02-api-conventions.md)
- New dependencies needed: (e.g., @radix-ui/react-dropdown-menu)
- Structure tier: Simple | Standard | Complex (from 04-build-shared-components.md)
- SDD requirements: spec stories required (list Storybook stories by name)
- Consumer apps: [list]
- Effort: XS | S | M | L | XL

```

### `12-master-backlog.csv`

Merge ALL per-app _component-backlog.csv files. Deduplicate by component_name.
Columns: `component_name,final_classification,batch,priority,risk_level,effort,consumer_apps,repo_ui_status,spec_required,migration_complexity`
- consumer_apps: pipe-separated
- repo_ui_status: exists | missing | partial

### `13-implementation-batches.md`

For each batch (1 through 6, plus explicit Batch 3A between Batch 3 and Batch 4):
- Scope description
- packages/ui work required
- Per-app work required
- Verification gate (exact commands)
- Apps x Components matrix

## Acceptance Criteria
- Master backlog has zero duplicate entries
- Every per-app backlog item maps to exactly one batch + master backlog row
- Batches ordered lowest -> highest risk
- Every batch has explicit verification gates
- Critical path identified

> Skills (if installed): `$monorepo-workspace` (workspace package names, --filter selectors, script names); `$turborepo` (verification gate commands in 13-implementation-batches.md must use correct `pnpm --filter` syntax)

Do NOT modify any apps. Commit to feat/ui when complete.
```md

---

## Batch 3A - Token Foundation Bootstrap

> **Branch:** `feat/ui`
> **Run:** Once - immediately after Batch 3 complete, before Batch 4 or Batch 5 begins
> **Prerequisite:** Batch 3 outputs (`10-cross-app-reconciliation.md`, `11-master-component-roadmap.md`, `12-master-backlog.csv`, `13-implementation-batches.md`) exist and `03-token-theming-contract.md` is locked

```
You are a Principal Frontend Engineer on branch `feat/ui`.

Read before starting:
- `<APP_PATH>/docs/migration/component/04-build-shared-components.md` (shared implementation and verification expectations)
- `<APP_PATH>/docs/migration/component/06-component-standards.md` (Sections 5 and 9-13)
- `packages/ui/docs/normalization/_output/00-foundation.md`
- `packages/ui/docs/normalization/_output/03-token-theming-contract.md`
- `packages/ui/docs/normalization/_output/11-master-component-roadmap.md`
- `packages/config/**`
- `packages/helper/**`
- `packages/ui/src/**` (current shared styling entry points)

## Objective

Execute the token and theming contract from `03-token-theming-contract.md` as real shared infrastructure before any Batch 4 or Batch 5 shared component work begins.
This batch converts the token contract from docs into the workspace bootstrap that `@repo/ui` and consuming apps will rely on.

## Required Changes

1. Add and export the semantic token preset in `packages/config` as the source of truth for shared components.
2. Keep legacy palette-based `@theme` tokens only as temporary backward-compatible support for existing app code during rollout.
3. Ensure shared components consume semantic tokens only (`bg-primary`, `text-foreground`, `border-input`, etc.) and do not introduce raw palette tokens, hardcoded hex, `rgb(...)`, or named color values.
4. Define the consuming-app contract explicitly: apps import the preset in `globals.css`, then override app-brand values locally.
5. Wire dark mode through `[data-theme="dark"]` only.
6. Update setup or foundation docs if they still point consumers to the old palette-only contract.

## Explicit Non-Goals

- Do NOT migrate app usage sites yet.
- Do NOT build new shared components yet.
- Do NOT change app-specific business styling beyond what is required to bootstrap the token contract.

## Acceptance Criteria

- A semantic token preset is exported from `@repo/config`
- The preset covers every required token from `03-token-theming-contract.md`
- `@repo/ui` can rely on semantic tokens without fallback to app-local variable definitions
- `pnpm --filter @repo/ui check-types`
- `pnpm --filter @repo/ui lint`
- `pnpm --filter @repo/ui build`
- `13-implementation-batches.md` explicitly marks Batch 4 and Batch 5 as blocked on Batch 3A completion

> Skills (if installed): `$design-system` (token naming, semantic scale rules, dark-mode contract); `$monorepo-workspace` (shared package boundaries, correct package ownership for config/helper/ui); `$turborepo` (verification commands and dependency sequencing)

Do NOT modify app migration usage sites in this batch. Commit to feat/ui when complete.
```md

---

## Batch 4 - Build packages/ui: Extend Existing (from Batch 3 items; Batch 3A required)

> **Branch:** `feat/ui`
> **Run:** Once per EXTEND_EXISTING component - repeat this prompt per component
> **Prerequisite:** `11-master-component-roadmap.md` and `02-api-conventions.md` exist, and Batch 3A token bootstrap is complete

```
You are a Principal Frontend Engineer on branch `feat/ui`.

Read before starting:
- `<APP_PATH>/docs/migration/component/04-build-shared-components.md` (full SDD spec)
- `<APP_PATH>/docs/migration/component/06-component-standards.md` (Sections 9-13)
- `packages/ui/docs/normalization/_output/02-api-conventions.md`
- `packages/ui/docs/normalization/_output/11-master-component-roadmap.md` (<COMPONENT_NAME> entry)
- `packages/ui/src/<COMPONENT_NAME>/<COMPONENT_NAME>.tsx` (current implementation)

## Objective

Extend `<COMPONENT_NAME>` in packages/ui to add:
[list specific variants/props from 11-master-component-roadmap.md]

Use the structure tier from the roadmap (Simple | Standard | Complex).

## SDD Steps (mandatory order)

1. Update `packages/ui/src/<COMPONENT_NAME>/<COMPONENT_NAME>.spec.md` - document new variants/props
2. Add stories for new cases to `<COMPONENT_NAME>.stories.tsx` (Storybook RED state is OK - intentional)
3. Implement changes in `<COMPONENT_NAME>.tsx` (make Storybook GREEN)
4. Update `index.ts` exports if new types added

## App-Agnostic Rules (NON-NEGOTIABLE)

- No `next/*` imports (`next/image`, `next/link`, `next/router`, `next/navigation`)
- No business logic, API calls, domain types
- No hardcoded app strings or `NEXT_PUBLIC_*` env vars
- All new props must follow `02-api-conventions.md` naming
- All new variants must use CVA pattern
- `cn()` imported from `@repo/helper` (single shared helper - never import `clsx` or `tailwind-merge` directly inside component files)
- Use `Box` for structural wrappers; native elements are reserved for semantic primitives and Radix/browser-required elements only

## Verification Gate (ALL must pass before marking DONE)

- `pnpm --filter @repo/ui check-types`
- `pnpm --filter @repo/ui lint`
- `pnpm --filter @repo/ui build`
- Storybook renders all new stories without errors

> Skills (if installed): `$design-system` (review the extension spec for accessibility, token usage, and variant naming consistency); `$monorepo-workspace` (cn() import from @repo/helper, dependency boundaries, which packages can be added); `$turborepo` (correct --filter and pipeline usage); `$vercel-composition-patterns` (evaluate on every component; actively apply if extending a compound component or tightening API shape); `$vercel-react-best-practices` (required during component work to guard render behavior, bundle cost, and implementation quality); `$web-design-guidelines` (required during extension review to enforce semantics, focus behavior, and accessibility compliance); `$systematic-debugging` (if spec/story/build/gate behavior diverges - trace root cause before fixing)

## After Gate Passes

Append to:
- `packages/ui/docs/normalization/_output/20-foundation-change-log.md`
- `packages/ui/docs/normalization/_output/21-adapter-mapping.md` (if any adapter notes for apps)
Update `packages/ui/docs/normalization/_output/13-implementation-batches.md` tracker.
```md

---

## Batch 5 - Build packages/ui: New Components (from Batch 4 items; Batch 3A required)

> **Branch:** `feat/ui`
> **Run:** Once per NEW_SHARED_COMPONENT - repeat this prompt per component
> **Prerequisite:** `11-master-component-roadmap.md` and `02-api-conventions.md` exist, and Batch 3A token bootstrap is complete

```
You are a Principal Frontend Engineer on branch `feat/ui`.

Read before starting:
- `<APP_PATH>/docs/migration/component/04-build-shared-components.md` (full SDD spec)
- `<APP_PATH>/docs/migration/component/06-component-standards.md` (Sections 9-13)
- `packages/ui/docs/normalization/_output/02-api-conventions.md`
- `packages/ui/docs/normalization/_output/03-token-theming-contract.md`
- `packages/ui/docs/normalization/_output/11-master-component-roadmap.md` (<COMPONENT_NAME> entry)
- Per-app `_output/_per-app-baseline-summary.md` files (for usage context)

## Objective

Build new shared component `<COMPONENT_NAME>` for packages/ui via SDD lifecycle.
Structure tier: [Simple | Standard | Complex - from roadmap]

## Step 1 - Write Spec (`<COMPONENT_NAME>.spec.md`) - NO CODE YET

Document:
- Overview (what it does, what pattern, when to use)
- Design decisions (Radix primitive / CVA strategy / controlled vs uncontrolled)
- Props Interface (table: Prop | Type | Default | Required | Description)
- Variants (visual + size)
- States (Default | Hover | Focus | Disabled | Loading | Error)
- Accessibility (Role, Keyboard bindings, ARIA attributes)
- Usage examples
- Do / Don't table
- Storybook stories list (Default, AllVariants, AllSizes, DisabledState, LoadingState, ErrorState, EdgeCase_LongContent + any compound-specific stories)

> Skills (if installed): `$design-system` (read `SKILL.md` -> `COMPONENTS.md` for accessibility requirements, keyboard patterns, focus states, and ARIA role requirements for `<COMPONENT_NAME>`); `$vercel-composition-patterns` (evaluate on every component; actively apply if this is compound or has boolean prop/API sprawl risk); `$web-design-guidelines` (review spec and story expectations against web interface guidelines, especially semantics, focus, and accessibility); `$systematic-debugging` (if requirements or behavior are ambiguous during spec/stories setup - trace before changing scope)

## Step 2 - Write Stories (`<COMPONENT_NAME>.stories.tsx`) - Storybook will error, this is intentional

Cover every story from the spec. RED state confirms spec is driving implementation.

## Step 3 - Implement

> Skills (if installed): `$monorepo-workspace` (package boundaries, cn() import from @repo/helper, and confirmation that @repo/ui must not import from apps); `$vercel-composition-patterns` (evaluate on every component; actively apply for compound components with sub-components and shared context); `$next-best-practices` (if component renders inside App Router pages - validate RSC vs client boundary placement); `$next-cache-components` (if this component wraps cached server data - apply `use cache` + cacheTag patterns); `$vercel-react-best-practices` (required during implementation - apply bundle, waterfall, and re-render optimizations); `$web-design-guidelines` (required during component build/review - enforce accessibility, semantics, and focus behavior); `$forms-validation` (if building a form-related component - Controller wiring, aria-invalid, error display conventions); `$systematic-debugging` (if Storybook, build, or verification diverges - root cause first, no random fixes)

> MCPs (if available): use `shadcn MCP` to search registry for <COMPONENT_NAME> as baseline - then normalize (CSS variable tokens, forwardRef, CVA, `cn` from `@repo/helper`, `Box` for structural wrappers). Use `context7 MCP` for Radix primitive docs before writing component interface.

Special rules:
- DataTable / sortable component: MUST use `@tanstack/react-table` v8 (never react-table v7)
- Calendar / DatePicker: MUST use `react-day-picker` + `date-fns`

Make ALL Storybook stories render without errors (GREEN state).

## Step 4 - Export

Add to `packages/ui/src/<ComponentName>/index.ts` and `packages/ui/src/index.ts`.

## App-Agnostic Checklist (ALL must pass before PR)

### Implementation
- [ ] `cn()` from `@repo/helper` - `import { cn } from '@repo/helper'`
- [ ] Structural wrappers use `Box`; native elements are used only for semantic primitives or Radix/browser-required nodes
- [ ] CVA for variants; `cn(variantClasses, className)` merge order correct
- [ ] CSS variable tokens only - no hardcoded hex/rgb/named colors
- [ ] Radix `data-[state=*]` selectors for interactive states
- [ ] `React.forwardRef` used; `displayName` set
- [ ] `asChild` exposed if consumers may need to change root element
- [ ] Radix Portal used (not `ReactDOM.createPortal`) for overlays
- [ ] Radix packages declared as direct deps in `packages/ui/package.json`
- [ ] DataTable: uses `@tanstack/react-table`
- [ ] Date components: uses `react-day-picker`

### App-Agnostic
- [ ] No `next/*` imports
- [ ] No app-specific packages
- [ ] No hardcoded strings
- [ ] No `fetch`/`axios`/raw `useQuery`/`useMutation`, and no service hooks (`use<Domain>()` from `@/services/`) - Shell receives all data via props
- [ ] No auth/permission logic
- [ ] No `process.env.NEXT_PUBLIC_*`
- [ ] TypeScript props exported from `index.ts`

### Storybook & a11y
- [ ] Stories cover ALL variants + ALL states
- [ ] Storybook a11y addon (axe-core) shows zero violations
- [ ] Keyboard-only navigation tested (Tab, Enter, Esc, Arrow where applicable)
- [ ] `DialogTitle` / `DialogDescription` present (even if `sr-only`) for dialog-type
- [ ] Focus ring visible (`focus-visible:ring-2 focus-visible:ring-ring`)

## Verification Gate (ALL must pass before marking DONE)

- `pnpm --filter @repo/ui check-types`
- `pnpm --filter @repo/ui lint`
- `pnpm --filter @repo/ui build`
- Storybook: all stories render, zero errors

## After Gate Passes

Append to `20-foundation-change-log.md` and `21-adapter-mapping.md` (if needed).
Update `13-implementation-batches.md` tracker.
```md

---

## Batch 6 - Per-App Migration: Batch 1 - ADOPT_NOW

> **Branch:** `migrate-app/<APP_NAME>`
> **Run:** Once per app
> **Prerequisite:** Batches 4-5 Batch 1 components confirmed in `packages/ui/src/index.ts`

```
You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read before starting:
- `<APP_PATH>/docs/migration/component/05-app-migration.md` (Batch 1 section)
- `<APP_PATH>/docs/migration/component/_output/_audit-report.md` (ADOPT_NOW components only)
- `<APP_PATH>/docs/migration/component/_output/_parity-checklist.md`
- `packages/ui/src/index.ts` (confirm all ADOPT_NOW exports exist before starting)

## Objective

Execute Batch 1: update all ADOPT_NOW imports in `<APP_PATH>/src/**` to use `@repo/ui`
instead of local component copies. Zero behavior changes.

## Guardrails (non-negotiable - violation = immediate rollback)

ALLOWED:
- Updating import paths from local path -> `@repo/ui`
- Deleting confirmed-replaced local files ONLY after all imports updated and typecheck passes

FORBIDDEN:
- Changing any component logic, prop values, or visual output at usage sites
- Refactoring, improving, or cleaning up unrelated code in any file you touch
- Adding/removing features, changing text content, ARIA labels, or placeholder text

If you find something to improve: add to `_migration-log.md` under "Post-Migration Improvement Candidates". Do NOT act on it now.

## Execution (per component)

1. Confirm exact export name from `packages/ui/src/index.ts`
2. Find ALL import locations in `<APP_PATH>/src/**`
3. Update import from local path -> `@repo/ui`
4. Verify props still compile: `<verification-gate.md Section 1 typecheck command>`
5. Delete local component file ONLY after all imports updated and typecheck passes
6. Record in `_migration-log.md`:
```tsx

## Batch 1 - <ComponentName> - <date>

- Imports updated: [list files]
- Local file deleted: `src/components/ui/<ComponentName>.tsx`
- Typecheck: PASS
- Parity notes: [any observed differences - token adoption only]
- Post-Migration Improvement Candidates: [list or "None"]

```

## Verification Gate (ALL must pass before calling Batch 1 complete)

Read `<APP_PATH>/docs/migration/verification-gate.md` for exact commands.
- Typecheck passes
- Lint passes
- Build passes
- Smoke routes from `verification-gate.md Section 5` pass - before/after screenshots captured per `verification-gate.md Section 6`
- No new console errors in browser

> Skills (if installed): `$monorepo-workspace` (check @APP_PACKAGE filter value, verify script names before running commands); `$turborepo` (correct `--filter <APP_PACKAGE>` used in all gate commands); `$react-query` (service hooks from `@/services/` wrap `useQuery`/`useMutation` - if any migrated Container component calls a service hook, validate the service hook's query key and cache invalidation are unchanged); `$vercel-react-best-practices` (required during app-side component migration to catch render, bundle, and interaction regressions after the swap); `$web-design-guidelines` (required to audit the migrated usage sites for semantics, focus, and accessibility parity); `$agent-browser` (automate smoke route verification - navigate critical routes, capture screenshots, flag visual regressions); `$systematic-debugging` (if migration or gate behavior diverges - trace the root cause before fixing)
```md

---

## Batch 7 - Per-App Migration: Batch 2 - ADOPT_WITH_ADAPTER

> **Branch:** `migrate-app/<APP_NAME>`
> **Run:** Once per app (skip if no ADOPT_WITH_ADAPTER components)
> **Prerequisite:** Batch 6 complete and gate passed

````

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read before starting:

- `<APP_PATH>/docs/migration/component/05-app-migration.md` (Batch 2 section)
- `<APP_PATH>/docs/migration/component/_output/_audit-report.md` (ADOPT_WITH_ADAPTER only)
- `packages/ui/docs/normalization/_output/21-adapter-mapping.md`

## Objective

Execute Batch 2: create thin local adapter wrappers for ADOPT_WITH_ADAPTER components,
then update usage sites to import from the adapter (which wraps @repo/ui).

## Adapter Pattern

```typescript
// <APP_PATH>/src/components/ui/adapted/ComponentName.tsx
import { ComponentName as BaseComponentName } from '@repo/ui';
import type { ComponentNameProps as BaseProps } from '@repo/ui';

interface ComponentNameProps extends Omit<BaseProps, 'variant'> {
  type?: 'primary' | 'danger'; // app's legacy naming
}

export function ComponentName({ type, ...rest }: ComponentNameProps) {
  const variant = type === 'danger' ? 'destructive' : type ?? 'default';
  return <BaseComponentName {...rest} variant={variant} />;
}
```

## Rules

- Adapter: ONLY prop mapping - no logic, no state, no effects
- Adapter must be < 30 lines (if longer, reconsider design)
- Adapter lives in `<APP_PATH>/src/components/ui/adapted/`
- Usage sites import from adapter (not directly from @repo/ui)
- Original local component deleted AFTER adapter is verified

FORBIDDEN - same as Batch 6:

- Business logic changes at usage sites
- Changing visual output beyond token adoption
- Refactoring unrelated code

## Verification Gate

Read `<APP_PATH>/docs/migration/verification-gate.md` for exact commands.

- Typecheck, lint, build all pass
- All original prop usages still compile via adapter
- Behavioral parity confirmed

> Skills (if installed): `$turborepo` (correct `--filter` in gate commands); `$forms-validation` (if adapter wraps a form-related component - validate Controller wiring and error display preserved); `$react-query` (if adapter wraps a data-fetching component - confirm query key and service call unchanged); `$vercel-composition-patterns` (evaluate the adapter for API sprawl and ensure it stays pure prop-mapping, < 30 lines); `$vercel-react-best-practices` (guard against extra render work or wrapper churn introduced by the adapter); `$web-design-guidelines` (verify the adapter does not regress semantics, labeling, or focus behavior); `$systematic-debugging` (if adapter parity breaks - trace before patching)

```md

---

## Batch 8 - Per-App Migration: Batch 3/4 - EXTEND or NEW

> **Branch:** `migrate-app/<APP_NAME>`
> **Run:** Once per component - repeat per component
> **Prerequisite:** The target component has been built in packages/ui (Batch 4 or 5 complete)

```

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read before starting:

- `<APP_PATH>/docs/migration/component/05-app-migration.md` (Batch 3/4 section)
- `<APP_PATH>/docs/migration/component/_output/_audit-report.md` (<COMPONENT_NAME> entry)
- `packages/ui/src/<COMPONENT_NAME>/<COMPONENT_NAME>.spec.md`
- `packages/ui/docs/normalization/_output/21-adapter-mapping.md` (<COMPONENT_NAME> entry)

## Pre-Migration Verification

1. Confirm `<COMPONENT_NAME>` is exported from `packages/ui/src/index.ts`
2. Read the spec: `packages/ui/src/<COMPONENT_NAME>/<COMPONENT_NAME>.spec.md`
3. Review adapter notes: `packages/ui/docs/normalization/_output/21-adapter-mapping.md`

## Guardrails (same as Batch 6/7 - non-negotiable)

ALLOWED:

- Updating usage site imports to `@repo/ui` (or adapter if prop API differs)
- Adapting props at usage sites to match the @repo/ui API via adapter pattern
- Deleting the local copy after all usage sites verified and gate passes

FORBIDDEN:

- Changing event handlers, data flows, or side effects at usage sites
- Removing any features, states, or variants the component had
- Changing text content, copy, error messages, ARIA labels, placeholder text
- Refactoring or cleaning up unrelated code in files you touch

## Parity Verification (all usage sites - all must be PASS)

- [ ] User interactions: click, hover, focus, keyboard - identical
- [ ] Loading / error / empty states - identical
- [ ] Form submit, validate, reset - identical
- [ ] ARIA labels and keyboard navigation - identical or improved (never removed)
- [ ] Visual output - identical (minor token-caused delta OK, document it)
- [ ] No new console or runtime errors

## Verification Gate

Read `<APP_PATH>/docs/migration/verification-gate.md` for exact commands.

- Typecheck, lint, build pass
- All smoke routes from `verification-gate.md Section 5` pass - before/after screenshots captured per `verification-gate.md Section 6`
- Behavioral parity confirmed

> Skills (if installed): `$next-best-practices` (validate RSC/client boundary is not broken after swap); `$next-cache-components` (if the swapped component wraps server-cached data - verify `use cache` / cacheTag usage is still correct); `$vercel-react-best-practices` (required during app-side shared-component adoption - check for introduced waterfalls, bundle regressions, or extra render churn after swap); `$web-design-guidelines` (required during parity review - confirm semantics, focus order, and accessibility remain intact); `$agent-browser` (smoke route automation + visual parity screenshots); `$turborepo` (`--filter` correctness); `$systematic-debugging` (if swap parity or gate results fail - trace first, then fix narrowly)

```md

---

## Batch 9 - Per-App Stabilization

> **Branch:** `migrate-app/<APP_NAME>`
> **Run:** Once per app - after ALL Batch 1-4 items are complete for this app
> **This clears the app for Batch 10 Cleanup**

```

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read before starting:

- `<APP_PATH>/docs/migration/component/05-app-migration.md` (Batch 5 section)
- `<APP_PATH>/docs/migration/component/_output/_migration-log.md`
- `<APP_PATH>/docs/migration/component/_output/_parity-checklist.md`
- `<APP_PATH>/docs/migration/component/_output/_audit-report.md`
- `packages/ui/docs/normalization/_output/21-adapter-mapping.md`

## Objective

Comprehensive parity audit of `<APP_NAME>` after completing all migration batches.
Confirms zero regressions. Clears this app for Batch 10.

## Tasks

### 1. Full App Verification Gate

Read `<APP_PATH>/docs/migration/verification-gate.md` for exact commands.
Run ALL commands. Zero errors allowed.

### 2. Adapter Audit

For every adapter in `<APP_PATH>/src/components/ui/adapted/`:

- Is it still needed? (Has the upstream API gap been closed in @repo/ui?)
- Document adapter status in `_migration-log.md` under "Adapter Status"
- Flag adapters ready for deletion in `_migration-log.md` - will be processed in Batch 10

### 3. Parity Checklist Final Sign-Off

For every item in `_parity-checklist.md` still showing [ ]:

- Test in browser: interaction, keyboard nav, visual
- Mark as PASS or FAIL with evidence

### 4. Smoke Route Full Run

Navigate through every route in `verification-gate.md` Section 5.

For each route, capture before/after screenshots and record a comparison entry per `verification-gate.md Section 6`:

- Before screenshot stored under `_artifacts/smoke-routes/before/`
- After screenshot stored under `_artifacts/smoke-routes/after/`
- Entry added to `_artifacts/smoke-routes/comparison-log.md`
- No UI regression, no broken layouts, no console errors (runtime or hydration)

### 5. Migration Log Finalization

- Mark all entries as Status: DONE or Status: DEFERRED
- Move DEFERRED items to "Post-Migration Improvement Candidates"
- Confirm every component has an entry

## Acceptance Criteria (ALL required before declaring Batch 9 done)

- [ ] All `_parity-checklist.md` items are marked PASS or have a documented exception with justification
- [ ] Zero TypeScript errors, lint errors, or build errors
- [ ] No unreviewed adapters remain
- [ ] `_migration-log.md` complete - no components missing status
- [ ] App cleared for Batch 10 Cleanup

Report: batch position, component counts DONE/DEFERRED, any adapters still active and why.

> Skills (if installed): `$agent-browser` (full smoke route run - automate browser navigation of ALL routes from verification-gate.md, capture screenshot evidence for parity checklist sign-off); `$web-design-guidelines` (required final audit of component usage in each smoke route against web interface guidelines - focus, semantics, ARIA); `$vercel-react-best-practices` (required stabilization review for runtime performance, render regressions, and bundle impact); `$systematic-debugging` (if any parity checklist item is FAIL - trace root cause before attempting a fix); `$turborepo` (verify all `--filter` gate commands run correctly)

```md

---

## Batch 9.5 - App-Local SoC Refactor

> **Branch:** `migrate-app/<APP_NAME>`
> **Run:** Once per app - after Batch 9 (Stabilization) passes, before Batch 10 (Cleanup)
> **Prerequisite:** Batch 9 acceptance criteria all pass. `_audit-report.md` must have Refactor Evaluation completed for all KEEP_APP_LOCAL entries.
> **Skip if:** Zero KEEP_APP_LOCAL components are rated HIGH or MEDIUM refactor potential in `_audit-report.md`.
> **Spec doc:** `<APP_PATH>/docs/migration/component/05-app-migration.md` Batch 9.5
> **Standards:** `<APP_PATH>/docs/migration/component/06-component-standards.md` Section 6.5

```

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read ALL of these before starting:

- `<APP_PATH>/docs/migration/component/06-component-standards.md` Section 6.5 (App-Local Refactor Patterns - full section)
- `<APP_PATH>/docs/migration/component/05-app-migration.md` Batch 9.5
- `<APP_PATH>/docs/migration/component/_output/_audit-report.md` (KEEP_APP_LOCAL entries only - read `Refactor potential` and `Refactor strategy` for each)
- `<APP_PATH>/docs/migration/component/_output/_migration-log.md` (current state)
- `<APP_PATH>/docs/migration/verification-gate.md` (gate commands)

## Objective

Execute Batch 9.5: refactor KEEP_APP_LOCAL components rated HIGH or MEDIUM refactor potential
for better separation of concerns. Split each monolithic component into:

- A **domain-wiring container** (same file, same export, same callers - frozen)
- A **pure-display Shell** (new file, `*Shell.tsx`, same directory - no domain types, no hooks, no API calls)

**The user must not be able to tell Batch 9.5 happened. Zero behavior changes.**

## Pre-Flight Check

Before writing any code:

1. Filter `_audit-report.md` for entries where `Refactor potential: HIGH` or `Refactor potential: MEDIUM`
2. Sort by Refactor potential DESC (HIGH first), then by component name
3. List them. If the list is empty -> stop, report "No Batch 9.5 candidates found", skip to Batch 10.

## Execution (ONE COMPONENT AT A TIME)

For each candidate component (process HIGH before MEDIUM):

### Step 1 - Read and understand the original component

- Read the full source file
- Identify: what is domain logic? what is pure display JSX?
- Confirm the `Refactor strategy` from the audit entry matches what you see; if not, document the discrepancy

### Step 2 - Create the Shell file (`*Shell.tsx` / `*Display.tsx` / `*Layout.tsx`)

Follow the naming convention from [06-component-standards.md Section 6.5](./06-component-standards.md#65-app-local-refactor-patterns):

- `ComponentNameShell` - visual card/panel/container
- `ComponentNameDisplay` - single data entity display
- `ComponentNameLayout` - structural layout (header + body + footer)

Shell rules (ALL mandatory):

- Props: only plain data types (`string`, `number`, `boolean`, `React.ReactNode`) - NO domain types
- No service hooks (`use<Domain>()` from `@/services/`), no raw `useQuery`/`useMutation` - Shell receives all data via props
- No `import` from `next/link`, `next/image`, `next/router`, `next/navigation`
- No `process.env.NEXT_PUBLIC_*`
- Apply Box pass inline (Section 1.4): replace bare native elements with `<Box>` from `@repo/ui`
- Use `@repo/ui` Skeleton/Spinner for loading states (already imported in the app)

### Step 3 - Refactor the Container (same file, same export)

- Remove the pure-display JSX (now in Shell)
- Keep all: hooks, API calls, domain types, business logic, data mapping
- Add import for the new `*Shell` file
- Container renders `<ComponentNameShell {...mappedProps} />`
- **Container's export name, file path, and prop interface are FROZEN** - zero changes

### Step 4 - Verify (after each component - do NOT proceed to next without passing)

```bash
# TypeScript - zero errors
<verification-gate.md Section 1 typecheck command>

# Lint - zero errors
<verification-gate.md Section 2 lint command>

# Build - clean
<verification-gate.md Section 3 build command>
```md

Also: manually verify the component's smoke route from `verification-gate.md` still renders identically.

### Step 5 - Evaluate the Shell for packages/ui candidacy

Run the checklist from Section 6.5 "What Makes a Good Shell":

- [ ] Props: only plain data types
- [ ] No data-fetching hooks
- [ ] No Next.js framework imports
- [ ] No env vars
- [ ] Two or more apps would plausibly need this Shell
- [ ] Visual structure not hardcoded to a single domain concept

**If ALL pass** -> classify as `NEW_SHARED_COMPONENT` candidate
**If ANY fail** -> Shell stays app-local (still a valid SoC improvement)

### Step 6 - Log

Append to `_migration-log.md` under `## Batch 9.5 - App-Local Refactor`:

```
### <ComponentName> - <date>

- **Refactor strategy applied:** container-shell | hook-extraction | prop-injection
- **Container:** `<src/components/path/ComponentName.tsx>` - export signature unchanged
- **Shell created:** `<src/components/path/ComponentNameShell.tsx>`
  - Props: [list the new plain-typed props]
  - Domain logic removed: [what was moved out]
- **packages/ui candidate:** YES - `NEW_SHARED_COMPONENT` queued | NO - app-local Shell only
  - If YES: reason why it qualifies cross-app
  - If NO: reason why it stays app-local
- **Box pass:** replaced N bare native elements in Shell
- **Typecheck:** PASS
- **Build:** PASS
- **Smoke route:** [route URL] - PASS
- **No caller changes:** CONFIRMED (grep verified - zero files touched outside the component directory)
```md

## Guardrails Reference (from Section 6.5)

```
ALLOWED:
- Creating the *Shell file in the same directory
- Extracting pure-display JSX into the Shell
- Extracting data-fetching logic into a co-located use<Name>Data hook (Pattern 2)
- Replacing domain types in Shell props with plain generic equivalents (Pattern 3)
- Applying Box pass (Section 1.4) within the Shell
- Importing @repo/ui Skeleton/Spinner in the Shell

FORBIDDEN - zero tolerance, violation = rollback this component:
- Changing the container's exported name, file path, or prop interface
- Changing ANY caller (zero caller files touched)
- Changing rendered output visible to the user
- Adding new state, effects, or API calls in Shell or Container
- Processing more than one component per atomic commit
- Skipping the verification gate between components
```md

## Completion Criteria (ALL required before declaring Batch 9.5 done)

- [ ] All HIGH refactor potential components processed
- [ ] All MEDIUM refactor potential components processed (or documented skip with reason)
- [ ] Every processed component has a log entry in the `_migration-log.md` Batch 9.5 section
- [ ] Every processed component passed typecheck, lint, build, and smoke-route checks
- [ ] `packages/ui` candidates listed (or "None found")
- [ ] Zero caller files changed (grep confirmed)

> Skills (if installed): `$vercel-composition-patterns` (evaluate every Shell refactor for API clarity; actively apply when compound/slot patterns emerge and avoid boolean prop proliferation); `$next-best-practices` (verify Shell has no RSC/client boundary violations after refactor); `$vercel-react-best-practices` (review the Shell split for render cost, wrapper churn, and bundle hygiene); `$web-design-guidelines` (review the Shell output for semantics, focus handling, and accessibility parity); `$systematic-debugging` (if typecheck fails after split - trace before fixing, do NOT revert blindly); `$turborepo` (correct --filter and pipeline usage for gate commands)

Report: list of components refactored, packages/ui candidates surfaced (if any), components skipped with reason.

````

---

## Batch 10 - Cleanup & Deprecation

> **Branch:** `migrate-app/<APP_NAME>` for app cleanup, then `feat/ui` for cross-app synthesis
> **Run:** Once per app (Batch 10 is per-app scope)
> **Prerequisite:** Batch 9 stabilization complete for this app

```

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read before starting:

- `<APP_PATH>/docs/migration/component/07-cleanup.md` (full spec)
- `<APP_PATH>/docs/migration/component/_output/_migration-log.md` (adapter status section)
- `<APP_PATH>/docs/migration/component/_output/_audit-report.md`

## Scope Note

This batch runs PER APP on `migrate-app/<APP_NAME>`.
Cross-app synthesis outputs (`30-cleanup-report.md`, `31-deprecation-map.md`) in packages/ui
are produced ONLY after ALL apps complete Batch 10, on `feat/ui`.

## Tasks

### 1. Remove Safe-to-Delete Local Copies

For each component in `_migration-log.md` with Status: DONE and local file still present:

- Verify ALL imports have been updated to `@repo/ui` (grep the codebase)
- Delete the local file
- Re-run typecheck immediately to confirm no references remain

### 2. Dead Adapter Cleanup

For adapters flagged in `_migration-log.md` as "Adapter Status: READY FOR DELETION":

- Confirm no usage sites import from the adapter anymore
- Delete adapter file
- Re-run typecheck

### 2.5 Dependency Audit & Cleanup

> Read **Section 4** of `<APP_PATH>/docs/migration/component/07-cleanup.md` for the full spec,
> decision table, examples of legitimately app-owned deps, and the never-remove list.

**Principle:** The question is never "does another package already have this dep?" - it is
"does **this app's source code** directly import it?" If yes -> keep. If no -> investigate.

**Step 1 - Generate a direct-import count for every dep:**

```bash
node -e "
const pkg = require('./apps/<APP_NAME>/package.json');
const deps = Object.keys({...pkg.dependencies, ...pkg.devDependencies});
deps.forEach(d => process.stdout.write(d + '\n'));
" | while read dep; do
  count=$(rg "from ['\"]${dep}" apps/<APP_NAME>/src --type ts --type tsx -l 2>/dev/null | wc -l)
  echo "$count $dep"
done | sort -n
# Deps showing 0 = no direct imports found in src/ -> candidates for Step 2 review
```bash

**Step 2 - For each dep showing `0` direct imports, confirm before removing:**

- Used in `next.config.ts`, `tailwind.config.ts`, or other root configs? -> **KEEP**
- Is it a peer dep of another dep the app uses (e.g., `react`, `react-dom`)? -> **KEEP**
- Is it a `devDependency` used during build/type-checking? -> **KEEP** (unless underlying pkg is also being removed)
- Is it a `@repo/*` workspace package? -> **KEEP** - always explicit, never rely on transitive linking
- Was it **only** imported inside local component files that are now deleted? -> **REMOVE** (true orphan)
- Unclear why it's there? -> **Investigate first. Do not remove.**

**Step 3 - Remove confirmed orphan deps only:**

```bash
pnpm --filter <APP_PACKAGE> remove <orphan-dep>
<verification-gate.md Section 1 typecheck command>   # must pass
<verification-gate.md Section 3 build command>         # must pass
```

Also remove `@types/<pkg>` for any removed package (if present). Cover both `dependencies`
and `devDependencies` in the audit.

Document every decision (REMOVED / RETAINED + reason) in `_cleanup-report.md` under
"Dependency Audit".

### 3. packages/ui Dead Code Check (on feat/ui, after ALL apps cleaned)

Switch to `feat/ui` branch.
Identify any exports in `packages/ui/src/index.ts` not imported by any app:

```bash
# Find exports not referenced anywhere in apps/
grep -r "from '@repo/ui'" apps/*/src --include="*.tsx" --include="*.ts" | \
  grep -oP "(?<=import \{ )[^}]+" | tr ',' '\n' | sort -u > /tmp/used_exports.txt
cat packages/ui/src/index.ts | grep "^export" | ... # compare
```bash

Document unused exports with rationale: DELETE | KEEP (another app will use) | DEPRECATE.

### 4. Run Verification Gate

Read `<APP_PATH>/docs/migration/verification-gate.md`.
Run typecheck, lint, build. Zero errors.

If any deps were removed, also confirm:

```bash
# Confirm removed dep is gone from direct deps
jq '.dependencies["<removed-dep>"]' apps/<APP_NAME>/package.json  # must be null
# Confirm it still resolves transitively (runtime still works)
pnpm --filter <APP_PACKAGE> list <removed-dep>
```

### 5. Create Per-App Cleanup Report

`<APP_PATH>/docs/migration/component/_output/_cleanup-report.md`:

- Components removed: [list with rationale]
- Adapters removed: [list with rationale]
- Remaining local components: [list with "reason kept app-local"]
- **Dependency audit:** [each dep -> REMOVED (true orphan) / RETAINED (direct usage: \<files\>) / RETAINED (never-remove list)]
- Verification gate results

## Acceptance Criteria

- Zero replaced duplicates remain without documented reason
- Zero broken imports after removals
- Typecheck, lint, build all pass
- Every dep in `apps/<APP>/package.json` either has confirmed direct usage or is on the never-remove list
- Removed deps documented with proof of zero direct usage
- `_cleanup-report.md` created with dependency audit section

After ALL apps complete Batch 10:
Switch to `feat/ui` -> create cross-app `30-cleanup-report.md` and `31-deprecation-map.md`.

> Skills (if installed): `$monorepo-workspace` (pnpm dep management: `--filter`, workspace packages, explicit ownership contract); `$turborepo` (filter-based grep approach for finding unused exports across apps; verify `pnpm --filter @repo/ui build` still passes after deletions)

```md

---

## Batch 10.5 - Deferred Dependency Resolution (Post-Cleanup)

> **Branch:** `migrate-app/<APP_NAME>`
> **Run:** Once per app - immediately after Batch 10 (Cleanup) passes the verification gate
> **Prerequisite:** Batch 10 `_cleanup-report.md` complete; Batch 0.5 Deferred Items list exists
> **Spec doc:** `<APP_PATH>/docs/migration/component/09-dependency-upgrades.md` (Part B)

```

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read before starting:

- `<APP_PATH>/docs/migration/component/09-dependency-upgrades.md` Part B (app-specific audit pattern)
- `<APP_PATH>/docs/migration/component/_output/_migration-log.md` - find the "Deferred Items" section
  written by Batch 0.5. This is your authoritative list for this batch.
- `<APP_PATH>/docs/migration/component/_output/_cleanup-report.md` (dep audit results from Batch 10)
- `<APP_PATH>/package.json` (current state after Batch 10)

## Objective

Resolve the dependency items **deliberately deferred during Batch 0.5**. Those items were kept
because they had no clean upgrade path within the migration window. Now that component migration
is complete, work through each one using the pattern below.

---

## Step 1 - Read the Deferred Items List

Open `_migration-log.md` and find the "App-Specific Deferred Items" table from Batch 0.5.
That table lists the exact packages deferred for this app, with their reasons and plans.

Work through each item individually using this decision framework:

### For each deferred package:

**1. Audit actual source usage:**

```bash
# Substitute <package-name> with the actual package from the deferred list
rg "from '<package-name>'" <APP_PATH>/src <APP_PATH>/app --type ts
rg 'from "<package-name>"' <APP_PATH>/src <APP_PATH>/app --type ts
rg "require\('<package-name>'\)" <APP_PATH>/src <APP_PATH>/app
```bash

**2. Decide based on usage count:**

| Usage count                             | Decision                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------- |
| 0 usages                                | Remove - confirmed dead dep                                               |
| Low (< threshold set in Batch 0.5 plan) | Migrate to replacement and remove                                         |
| High (>= threshold)                      | Keep at current version; document as remaining tech debt with sprint plan |
| Used only in configs, not source        | Keep if still needed in config; remove if config section was also deleted |

**3. Act:**

Remove if dead:

```bash
pnpm --filter <APP_PACKAGE> remove <package-name>
<verification-gate.md Section 1 typecheck command>  # must still pass after each removal
```

Migrate if low-usage: apply the replacement approach documented in Batch 0.5 plan.
Do not introduce large refactors in this batch - keep replacements narrow and mechanical.

Keep if high-usage: update the migration log with final usage count and revised sprint target.

---

## Step 2 - Verify platform alignment is intact

After all deferred items are resolved, confirm platform versions have not drifted:

```bash
# Confirm React 19 still resolved
node -e "console.log('react:', require('./apps/<APP_NAME>/node_modules/react/package.json').version)"
# Must output: 19.x.x

# Confirm eslint-config-next major matches next
node -e "
const p = require('./apps/<APP_NAME>/package.json');
console.log('next:', p.dependencies.next);
console.log('eslint-config-next:', p.devDependencies['eslint-config-next']);
"
# Major versions must match

# Confirm Tailwind v4
node -e "console.log('tailwindcss:', require('./apps/<APP_NAME>/node_modules/tailwindcss/package.json').version)"
# Must output: 4.x.x
```bash

---

## Step 3 - Verification Gate

```bash
<verification-gate.md Section 1 typecheck command>  # zero errors
<verification-gate.md Section 2 lint command>         # zero errors
<verification-gate.md Section 3 build command>        # clean build
```

---

## Required Output

Append to `<APP_PATH>/docs/migration/component/_output/_migration-log.md`:

```md
## Deferred Dependency Resolution - <date>

### Items resolved from Batch 0.5 Deferred list:

| Package | Action taken | Files affected | Notes |
| ------- | ------------ | -------------- | ----- |
| [package] | REMOVED / MIGRATED / RETAINED | [files or "n/a"] | [reason or new sprint target] |

### Version Alignment Check (post-cleanup)
- react: [resolved version] OK
- tailwindcss: [resolved version] OK
- eslint-config-next: [version] matches next [version] OK

### Remaining tech debt (if any)
[List any packages that were RETAINED with updated sprint target, or "None"]

### Verification Gate
check-types: PASS - lint: PASS - build: PASS
```

> Skills (if installed): `$systematic-debugging` (if removing a package causes type errors - trace before attempting fixes); `$monorepo-workspace` (pnpm remove --filter and dep ownership rules)

Do NOT start Batch 11 until this gate passes.

````

---

## Batch 11 - Operational Standards

> **Branch:** `feat/ui`
> **Run:** Once - after ALL apps complete Batch 10 and Batch 10.5
> **This is the final batch of the migration program**

```md

You are a Principal Design System Engineer on branch `feat/ui`.

Read before starting:

- `<APP_PATH>/docs/migration/component/08-operational-standards.md` (full spec)
- ALL `apps/*/docs/migration/component/_output/_cleanup-report.md`
- `packages/ui/docs/normalization/_output/30-cleanup-report.md`
- `packages/ui/docs/normalization/_output/31-deprecation-map.md`
- `packages/ui/docs/normalization/_output/20-foundation-change-log.md`
- `packages/ui/docs/normalization/_output/13-implementation-batches.md`

## Objective

Convert all migration outcomes into permanent operating documentation.
After this batch, no more migration project is needed - new apps follow the playbook,
new components follow the intake process.

## Required Outputs (create all 6 in `packages/ui/docs/`)

> After this batch completes, these files become the permanent entry points for `@repo/ui` documentation. They are listed in `README.md`'s "Post-Migration Permanent Docs" table.

| File path                                             | Purpose                                                                  |
| ----------------------------------------------------- | ------------------------------------------------------------------------ |
| `packages/ui/docs/SHARED_UI_ARCHITECTURE.md`          | Component taxonomy, dependency graph, app-agnostic contract              |
| `packages/ui/docs/SHARED_UI_IMPLEMENTATION_GUIDE.md`  | Adding new components (SDD lifecycle, spec + story templates)            |
| `packages/ui/docs/SHARED_UI_MIGRATION_PLAYBOOK.md`    | How to onboard a NEW app to @repo/ui (post-migration)                    |
| `packages/ui/docs/SHARED_UI_OPERATIONAL_STANDARDS.md` | Intake criteria, review gates, versioning, ownership, deprecation policy |
| `packages/ui/docs/SHARED_UI_CONTRIBUTING.md`          | "How to fix a bug" guide for app developers                              |
| `packages/ui/docs/SHARED_UI_CHANGELOG.md`             | Seeded from `20-foundation-change-log.md`                                |

## Documentation Requirements

- Use ONLY real component names and real files from the completed migration
- NO references to the migration process (these are permanent, standalone operating docs)
- Focus on "how to work with @repo/ui going forward"
- All mermaid diagrams must be syntactically valid
- All code examples must be complete and runnable

## Acceptance Criteria

- A developer onboarding today can follow SHARED_UI_IMPLEMENTATION_GUIDE.md to add a new component end-to-end
- A new app can be onboarded via SHARED_UI_MIGRATION_PLAYBOOK.md without reading any migration docs
- SHARED_UI_OPERATIONAL_STANDARDS.md replaces any tribal knowledge about the intake process

Commit to feat/ui. This closes the migration program.

> Skills (if installed): `$design-system` (review SHARED_UI_ARCHITECTURE.md for accessibility standards coverage and token naming conventions); `$vercel-composition-patterns` (evaluate all documented component families for compound patterns, context interfaces, and React 19 API conventions); `$vercel-react-best-practices` (ensure the operational docs capture the required performance and render-quality baseline for component work in both ui and apps); `$web-design-guidelines` (run a compliance audit against the final SHARED_UI_CONTRIBUTING.md and SHARED_UI_OPERATIONAL_STANDARDS.md); `$systematic-debugging` (if documentation conflicts with implemented behavior or gate reality - trace and reconcile before finalizing)

```

---

## Legacy Update Batches (L1-L6)

> **When to run:** Whenever the legacy repo has new commits to pull, at ANY point during Batches 0-10.
> **Safe stopping points:** Complete the current component before running L1. Never stop mid-migration.
> **Branch:** `migrate-app/<APP_NAME>`
> **Reference:** `<APP_PATH>/docs/migration/component/legacy-update-routines.md` (full Routine 1-6 details)
> `<APP_PATH>/docs/migration/component/legacy-update-integration-guide.md` (decision trees by batch position)

### Pause Protocol (before running L1)

```bash

If currently at an active migration step, complete the current component first.
Then document pause point in `_migration-log.md`:

## Pause Record

- Current batch: <e.g., Batch 8 - DataTable>
- Component in progress: <ComponentName> - <last completed step>
- Status: [PAUSE] Paused for legacy update
- Timestamp: <YYYY-MM-DD HH:MM>

Commit and push:
git add .
git commit -m "chore: pause Batch 8 migration for legacy update"
git push origin migrate-app/<APP_NAME>

Then run L1.

```

---

### L1 - Subtree Pull & Merge

```txt

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read: `<APP_PATH>/docs/migration/component/legacy-update-routines.md` Routines 1 and 2.

**Routine 1 - Subtree pull to integrate/<APP_NAME> (read-only mirror):**

1. git checkout integrate/<APP_NAME>
2. git subtree pull --prefix=<APP_PATH> <LEGACY_REMOTE> <LEGACY_BRANCH>
   Expected: clean merge - no conflicts (integrate/\* is read-only, 1:1 with legacy)
3. git push origin integrate/<APP_NAME>

**Routine 2 - Merge to migrate-app/<APP_NAME>:**

1. git checkout migrate-app/<APP_NAME>
2. git merge integrate/<APP_NAME>
3. If NO conflicts: push migrate-app/<APP_NAME> and report "Ready for L3"
4. If conflicts: STOP - list conflict files - proceed to L2

**Merge Health Check (MHC) - run immediately after a clean merge (step 3 above):**

```bash
<verification-gate.md Section 1 typecheck command>
<verification-gate.md Section 3 build command>
```

If either command fails, do NOT proceed to L3. Diagnose and fix the merge-introduced breakage first, then re-run the MHC before continuing.

Do NOT make any code adjustments beyond what is needed to pass the MHC. Do NOT resolve semantic conflicts yet.
Report outcome clearly: clean merge + MHC pass, or conflict list.

```txt

---

### L2 - Resolve Conflicts (run only if L1 reports conflicts)

```

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read: `<APP_PATH>/docs/migration/component/legacy-update-routines.md` Routine 3.
Read `<APP_PATH>/docs/migration/component/_output/_migration-log.md` to know which components have `Status: DONE`.

For each conflicted file, assign exactly one category and apply the resolution:

| Category               | Indicator                                             | Resolution                                                       |
| ---------------------- | ----------------------------------------------------- | ---------------------------------------------------------------- |
| Migrated component     | In `_output/_migration-log.md` Status=DONE; imports use @repo/ui | git checkout --ours <file>                                       |
| Non-migrated component | Not in `_output/_migration-log.md`; still uses local imports     | git checkout --theirs <file>                                     |
| In-progress batch item | In `_output/_migration-log.md` Status=IN PROGRESS                | Manual merge - keep our base, apply legacy additions only        |
| Shared infrastructure  | packages/config/**, packages/helper/**, tsconfig      | Manual merge - prefer ours, apply new additions                  |
| App configuration      | package.json, tailwind.config.\*, tsconfig.json       | Manual merge - apply new deps/settings, keep migration overrides |
| Static assets          | public/**, assets/**                                  | git checkout --theirs (unless intentionally replaced)            |

After resolving ALL conflicts:
git add .
git commit -m "chore: merge integrate/<APP_NAME> to migrate-app/<APP_NAME> - component conflict resolution"
git push origin migrate-app/<APP_NAME>

Report: each file, category, and resolution strategy used.

```txt

---

### L3 - Analyze Changes

```

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read: `<APP_PATH>/docs/migration/component/legacy-update-routines.md` Routine 4.
Read: `<APP_PATH>/docs/migration/component/06-component-standards.md` (classification rules).
Read: `<APP_PATH>/docs/migration/component/_output/_audit-report.md` (existing classifications).
Read: `<APP_PATH>/docs/migration/component/_output/_migration-log.md` (batch status).

**Step 1 - Identify what changed:**
git log integrate/<APP_NAME>~5..integrate/<APP_NAME> --oneline
git diff migrate-app/<APP_NAME>..integrate/<APP_NAME> --name-only

**Step 2 - Categorize each changed file:**

| Category                                   | Examples                                | Action                                           |
| ------------------------------------------ | --------------------------------------- | ------------------------------------------------ |
| New component file                         | New .tsx in src/components/             | Classify per 06-component-standards.md           |
| Existing component modified (non-migrated) | We haven't touched it                   | Already handled in L2                            |
| Existing component modified during migration | Legacy changed a component we own | Flag for review - may need packages/ui update |
| Config/dependency change                   | package.json, tsconfig, tailwind.config | List for L4                                      |
| Style/asset change                         | CSS, public/\*\*, images                | List for L4                                      |

**Step 3 - For each NEW component file, classify:**

- Is it purely visual (no API calls, no domain types)?
  YES -> Used by 2+ apps -> NEW_SHARED_COMPONENT or EXTEND_EXISTING -> proceed to L5
  YES -> Only this app -> KEEP_APP_LOCAL -> accept via L4
  NO -> KEEP_APP_LOCAL -> accept via L4

**Step 4 - Create update log:**
Create: `<APP_PATH>/docs/migration/component/legacy-updates/legacy-update-<YYYYMMDD-HHMMSS>.md`
Include: legacy commit SHA, changes by category, classification decisions, current batch position, recommended next step (L4 or L5).

Report all findings. Wait for confirmation before proceeding.

```md

---

### L4 - Apply Non-Component Adjustments

> _Run when L3 has no NEW_SHARED_COMPONENT or EXTEND_EXISTING candidates (config, style, asset, KEEP_APP_LOCAL changes only)_

```

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read: `<APP_PATH>/docs/migration/component/legacy-update-routines.md` Routine 4.3 and 4.4.

Context from L3 (fill in before running):

- Config/dependency changes: <list-from-L3>
- Style/asset changes: <list-from-L3>
- New KEEP_APP_LOCAL components: <list-from-L3>

**Apply each:**

1. New dependencies in package.json -> run `pnpm install`, verify no peer dependency conflicts
2. Tailwind config changes -> apply, verify CSS variable contract still satisfied (06-component-standards.md Section 5), verify @repo/ui tokens still resolve
3. tsconfig / path alias changes -> apply, run `<verification-gate.md Section 1 typecheck command>`
4. Global CSS changes -> apply, ensure migration-specific tokens preserved
5. New KEEP_APP_LOCAL components:
   - Confirm conflict resolved with --theirs in L2
   - Add entry to `_audit-report.md` with class KEEP_APP_LOCAL
   - Add row to `_component-backlog.csv` with batch=N/A

Hard rules:

- Do NOT modify components with Status: DONE in `_output/_migration-log.md`
- Do NOT reintroduce local copies of migrated components

> Skills (if installed): `$turborepo` (`pnpm install` and `<verification-gate.md Section 1 typecheck command>` - ensure correct filter value from verification-gate.md)

Proceed to L6 after completing.

```md

---

### L5 - Queue packages/ui Intake for New Legacy Components

> _Run only when L3 identified NEW_SHARED_COMPONENT or EXTEND_EXISTING candidates_

```

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read: `<APP_PATH>/docs/migration/component/legacy-update-routines.md` Routine 5.

Context from L3:

- New candidate: <ComponentName> at <source-path>
- Classification: NEW_SHARED_COMPONENT | EXTEND_EXISTING
- Rationale: <from-L3>

**For EXTEND_EXISTING:**

1. Identify which existing @repo/ui component needs the extension
2. Document in `<APP_PATH>/docs/migration/component/_output/_per-app-baseline-summary.md`:
   - Component name, API gap (what variants/props are missing)
3. Keep the legacy local file on migrate-app/<APP_NAME> - do NOT delete it yet
   (it will be deleted when packages/ui ships the extension and Batch 8 migration runs)
4. Add note in `_migration-log.md`: "<ComponentName> - waiting for packages/ui Batch 3 extension"

**For NEW_SHARED_COMPONENT:**

1. Document in `<APP_PATH>/docs/migration/component/_output/_per-app-baseline-summary.md`:
   - Full visual spec (props table, variants, states, accessibility)
2. Add row to `_component-backlog.csv` (batch=4)
3. Keep the legacy local file on migrate-app/<APP_NAME> - do NOT delete it yet
4. Add note in `_migration-log.md`: "<ComponentName> - waiting for packages/ui Batch 4 build"

**If this update occurs after Batch 9 cleanup (local files already deleted):**
Document in update log whether to:

- Wait for packages/ui to ship the component first (preferred)
- Or temporarily re-add the legacy local file until packages/ui ships (last resort)

IMPORTANT: Do NOT start packages/ui implementation here. This batch only queues intake.

Add entry to `legacy-update-<YYYYMMDD-HHMMSS>.md`. Proceed to L6.

> Skills (if installed): `$design-system` (read `SKILL.md` -> `COMPONENTS.md` for accessibility requirements, keyboard patterns, focus states when writing the full visual spec for a NEW_SHARED_COMPONENT in \_per-app-baseline-summary.md); `$vercel-composition-patterns` (if the new candidate is a compound component - document compound API pattern in the spec to guide future Batch 5 implementation)

```txt

---

### L6 - Verify + Document

```

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read: `<APP_PATH>/docs/migration/component/legacy-update-routines.md` Routine 6.

**Step 1 - Read verification gate and run:**
Read `<APP_PATH>/docs/migration/verification-gate.md` for exact commands. Do NOT guess.

Run:

- `<verification-gate.md Section 1 typecheck command>`
- `<verification-gate.md Section 2 lint command>`
- `<verification-gate.md Section 3 build command>`

If packages/ui changes were made on feat/ui:

- `pnpm --filter @repo/ui check-types`
- `pnpm --filter @repo/ui build`

**Step 2 - Verify migrated component integrity:**
For every component in `_output/_migration-log.md` with Status=DONE:

- [ ] Import still resolves to @repo/ui (not reverted to local path)
- [ ] No local duplicate re-appeared from the merge
- [ ] Prop API at usage sites still compiles

**Step 3 - If verification fails:**

- Typecheck/lint errors: fix narrowly in the affected file, re-run gate
- Reverted migrated import: `git restore --source=HEAD -- <file>`, re-run gate
- Critical failure (cannot recover without risk):
```bash
git branch backup/migrate-app-<APP_NAME>-pre-legacy-update
git revert <commit-or-merge-commit>
```
Document rollback in update log and STOP. Notify team.

**Step 4 - Complete the update log:**
Fill in `legacy-update-<YYYYMMDD-HHMMSS>.md`:

- Final verification results (command outputs)
- Changes integrated summary
- Conflict resolution summary (if L2 was run)
- packages/ui intake items queued (if L5 was run)
- Current batch position
- Next steps (e.g., "Resume Batch 8 - continue with DataTable")

**Step 5 - Resume Protocol:**
Update `_migration-log.md` Pause Record:

```md

## Pause Record

- <Component>
- Status: [RESUME] Resumed after legacy update
- Legacy update integrated: <timestamp>
- Affected components: <list or "none">
- New packages/ui intake items: <list or "none">

```

**Cross-Track Impact Review:**
If service migration (`migrate-app/<APP_NAME>` service track) is also in progress:

- Review the legacy update log for changes to endpoints, API types, or service contracts
- Assess whether those changes invalidate any in-progress service refactor work (_audit-report.md / _migration-plan.md entries not yet implemented)
- If affected: document the impact and required adjustments in the legacy update log before resuming component migration

Report: verification gate results, components integrity check, next steps.

> Skills (if installed): `$agent-browser` (if a migrated component's smoke route needs post-merge parity verification - automate browser test to confirm no regression from the merge); `$systematic-debugging` (if verification fails post-merge - trace which layer broke before reverting); `$turborepo` (correct `--filter` for both app and @repo/ui gate commands)

```md

---

## Scenario Quick Reference

| Scenario                                                                            | Run these batches                                            |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Normal migration (no legacy updates)                                                | 0 -> 0.5 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10 -> 10.5 -> 11 |
| Legacy update - clean merge, no new components                                      | L1 -> L3 -> L4 -> L6, then resume                               |
| Legacy update - conflicts, no new components                                        | L1 -> L2 -> L3 -> L4 -> L6, then resume                          |
| Legacy update - clean merge, new KEEP_APP_LOCAL                                     | L1 -> L3 -> L4 -> L6, then resume                               |
| Legacy update - clean merge, new packages/ui candidate                              | L1 -> L3 -> L5 -> L6, then resume                               |
| Legacy update - conflicts + new packages/ui candidate                               | L1 -> L2 -> L3 -> L5 -> L6, then resume                          |
| Legacy update - post-cleanup (Batch 9 done) + new packages/ui candidate now shipped | L1 -> L3 -> L5 -> Batch 8 -> L6                                  |

---

## Multi-App Usage

Batches 0, **0.5**, 1, 6, 7, 8, 9, 10, **10.5** run **per app** on each app's `migrate-app/<app>` branch.
Batches 2, 3, 4, 5, 11 run **once** on `feat/ui`.
Legacy Batches L1-L6 run **per app** whenever the legacy repo updates.

> Batch 0.5 = pre-migration dependency upgrade (React 19, Tailwind v4, TypeScript alignment)
> Batch 10.5 = post-cleanup deferred item resolution (moment, draft-js, react-router-dom)

```

```txt
