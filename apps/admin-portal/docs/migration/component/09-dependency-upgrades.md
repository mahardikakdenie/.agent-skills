# 09 — Dependency Version Upgrades

> **Phase:** Pre-Migration Setup (runs immediately after Batch 0, before Batch 1)
> **Branch:** `migrate-app/<APP_NAME>`
> **Run count:** Once per app
> **Prerequisite:** Batch 0 (Verification Gate Setup) complete
> **Prev:** [00-overview.md](./00-overview.md) · **Next:** [01-app-audit.md](./01-app-audit.md)
> **AI execution:** Use **Batch 0.5** in [`migration-batch-prompts.md`](./migration-batch-prompts.md)

---

## Why Upgrades Are Part of the Migration

The component migration is a **platform alignment event**, not just an import-swap exercise.
`packages/ui` is built at specific dependency versions and all consuming `apps/*` must align
to those versions — otherwise peer dependency resolution is incorrect and `@repo/ui` types
will conflict with app-level types.

> [!IMPORTANT]
> `packages/ui` already targets **React 19**, **Tailwind CSS v4**, and **TypeScript 5.9.2**.
> An app still on React 18 + Tailwind v3 will experience type conflicts and CSS build
> inconsistencies from batch 1 onward. **Align all platform deps — including their configs —
> before migrating any components.**

**Principle:** If an upgrade requires a config file change, make the config change.
A config update is part of the upgrade, not a reason to skip it.

---

## Part A — Platform-Wide Upgrade Standards

These versions are **monorepo-wide requirements** driven by `packages/ui`. Every app must
align to these — they are not optional per-app decisions.

### A1. Upgrade Matrix (Platform Standards)

| Package | Required target | Notes |
| ------- | --------------- | ----- |
| `react` | `^19` | packages/ui requires React 19 |
| `react-dom` | `^19` | must match `react` |
| `@types/react` | `^19` | must match runtime |
| `@types/react-dom` | `^19` | must match runtime |
| `tailwindcss` | `^4` | packages/ui uses Tailwind v4 |
| `@tailwindcss/postcss` | `^4` | PostCSS plugin for Tailwind v4 (add if not present) |
| `typescript` | `5.9.2` (pin) | Matches root workspace + packages/ui |
| `eslint-config-next` | Must match installed `next` major | Run `cat package.json \| jq '.devDependencies."eslint-config-next"'` |
| `@types/node` | `^22` (range, unpinned) | Avoid exact version pins |

> [!NOTE]
> `next` is likely already at the correct version since it ships separately from packages/ui.
> Confirm with `cat package.json | jq '.dependencies.next'` and leave it unchanged if already current.

### A2. React 18 → 19 Upgrade

#### Breaking changes to know

**`forwardRef` — soft deprecated, still works (zero breakage)**

```tsx
// Still valid in React 19 — do NOT refactor during migration
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <button ref={ref} {...props} />
));
```
Record any `forwardRef` occurrences in `_migration-log.md` under "Post-Migration Improvement
Candidates" — do not refactor them now.

**Context `.Provider` — non-breaking, old syntax still valid**

No action needed. Both `<ThemeContext.Provider>` and `<ThemeContext>` work in React 19.

**`react-dom/test-utils` — removed in React 19**

```tsx
// Before (React 18)
import { act } from 'react-dom/test-utils';
// After (React 19)
import { act } from 'react';
```
Search for this pattern after upgrading and fix any occurrences.

**`React.FC` and `children`**

`React.FC<Props>` no longer infers `children` if not declared in `Props`.
After upgrading, run `check-types` — any "Property 'children' does not exist" error
means you need to add `children?: React.ReactNode` to that component's Props interface.

#### Upgrade commands

```bash
pnpm --filter <APP_PACKAGE> add react@^19 react-dom@^19
pnpm --filter <APP_PACKAGE> add -D @types/react@^19 @types/react-dom@^19
```

### A3. TypeScript + ESLint Toolchain

```bash
# Pin TypeScript to match root workspace and packages/ui
pnpm --filter <APP_PACKAGE> add -D typescript@5.9.2

# eslint-config-next must match installed next major
pnpm --filter <APP_PACKAGE> add -D eslint-config-next@<NEXT_MAJOR>

# Use range for @types/node — do not pin to exact version
pnpm --filter <APP_PACKAGE> add -D @types/node@^22
```

### A4. Tailwind CSS v3 → v4 Migration

#### Step 1 — Install Tailwind v4 + PostCSS plugin

```bash
pnpm --filter <APP_PACKAGE> add -D tailwindcss@^4 @tailwindcss/postcss@^4
```

#### Step 2 — Update `postcss.config.js` (or `.cjs`)

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

> Tailwind v4 bundles autoprefixer internally — removing it from postcss is correct.

#### Step 3 — Update CSS entry point (`globals.css` or `app/globals.css`)

```diff
-@tailwind base;
-@tailwind components;
-@tailwind utilities;
+@import "tailwindcss";
+@config "../tailwind.config.ts";
```

> The `@config` directive preserves all existing `tailwind.config.ts` customizations
> (theme, colors, content paths, plugins). Adjust the relative path to match your config location.

#### Step 4 — Clean up `tailwind.config.ts` — remove v3-only keys

```diff
-  mode: 'jit',         // remove — default in v4, ignored
-  future: {},          // remove — v3-only
-  experimental: {},    // remove — v3-only
```

Keep all `theme`, `content`, and `plugins` entries untouched — they are still valid in v4.

> [!NOTE]
> If the app uses Tailwind plugins (e.g. `@tailwindcss/forms`, `@tailwindcss/typography`),
> check whether they have a v4-compatible release.
> Tailwind v4 built-ins like `line-clamp` no longer need a plugin — remove their plugin entry.

#### Step 5 — Smoke check CSS after upgrade

After `pnpm build`, run the dev server and navigate 3–5 key routes. Confirm layout looks
identical to pre-upgrade.

Common visual differences to watch for:

| Utility | v3 behavior | v4 behavior |
| ------- | ----------- | ----------- |
| `ring` | `ring-3` for 3px | `ring` defaults to 1px — add explicit `ring-3` where needed |
| `divide-x/y` | Works | Same |
| `@apply` in CSS | Works | Same |
| Built-in `line-clamp-*` | via plugin | Built-in — remove plugin entry |

---

## Part B — App-Specific Cleanup (Per-App Audit)

These steps are **not prescriptive** — every app has different legacy packages.
The job is to audit what **this specific app** actually has and make decisions based on that.

### B1. Identify and Remove Deprecated or Dead Packages

Run an audit of the app's `package.json` before and after the platform upgrades:

```bash
# List all direct dependencies with their versions
cat apps/<APP_NAME>/package.json | jq '{dependencies, devDependencies}'
```

For each package, ask:

1. **Is it deprecated?** (npm warns, package archived, no updates in 2+ years)
   → Remove if confirmed unused. If still used, flag as tech debt.

2. **Is it made redundant by a platform upgrade?**
   → e.g., a utility now built into React 19, Tailwind v4, or Next.js 15 core
   → Remove the package and its plugin/import if applicable.

3. **Does it have no maintained upgrade path?** (major dependency on React 16/17-era APIs, no types, etc.)
   → Keep for now at current version. Flag in `_migration-log.md` as a Deferred Item
   with a replacement plan and estimated sprint.

4. **Is it superseded by something already in the dependency tree?**
   → e.g., using both `library-X` and its modern replacement `library-X-v2` in the same app
   → Audit usage and deduplicate.

```bash
# Check if a package is actually imported anywhere in source
rg "from '<package-name>'" apps/<APP_NAME>/src apps/<APP_NAME>/app --type ts
rg 'from "<package-name>"' apps/<APP_NAME>/src apps/<APP_NAME>/app --type ts
# Zero results = candidate for removal (still verify it's not used in configs)
```

### B2. Deferred Items — Flag, Plan, Don't Block

Any package that cannot be cleanly upgraded within this migration window should be:

1. **Left at current version** (do not attempt partial upgrades)
2. **Recorded in `_migration-log.md`** under "Deferred Items" with:
   - Current version
   - Why it is deferred (no upgrade path / requires full refactor / depends on deprecated API)
   - Estimated replacement or upgrade approach
   - Target sprint or milestone

This ensures nothing is forgotten and creates a clear handoff for the cleanup phase (Batch 10.5).

> [!IMPORTANT]
> "Deferred" means explicitly tracked, not forgotten. Do NOT leave undocumented legacy packages
> after Batch 0.5. Every package in `package.json` must be either: upgraded, removed, or deferred
> with a documented reason.

---

## Part C — Verification Gate

All of the following must pass **before proceeding to Batch 1**:

```bash
# TypeScript — zero errors
pnpm --filter <APP_PACKAGE> check-types

# Lint — zero errors
pnpm --filter <APP_PACKAGE> lint

# Production build — clean
pnpm --filter <APP_PACKAGE> build

# Dev server smoke check — no CSS regressions, no console errors
pnpm --filter <APP_PACKAGE> dev
```

Targeted scans to confirm no legacy patterns remain:

```bash
# React 19: removed export — check if any test files use old import
rg "from 'react-dom/test-utils'" apps/<APP_NAME>/src apps/<APP_NAME>/app
rg 'from "react-dom/test-utils"' apps/<APP_NAME>/src apps/<APP_NAME>/app

# Tailwind v4: confirm @tailwind directives are gone
rg "@tailwind base\|@tailwind components\|@tailwind utilities" apps/<APP_NAME>
```

### Common errors and fixes

| Error | Root cause | Fix |
| ----- | ---------- | --- |
| `Property 'children' does not exist` on `React.FC` | React 19 types stricter | Add `children?: React.ReactNode` to Props |
| `Type 'X' is not assignable to 'ReactNode'` | Stricter JSX return type | Fix the return type |
| `Module 'react-dom/test-utils' has no export 'act'` | Removed in React 19 | `import { act } from 'react'` |
| ESLint rule errors after `eslint-config-next` update | Renamed rules | Check `.eslintrc` for deprecated rule names |
| CSS not loading | PostCSS config still uses old tailwindcss plugin | Update to `@tailwindcss/postcss` |
| Theme tokens not applied | Missing `@config` in `globals.css` | Add `@config "../tailwind.config.ts"` |

---

## Part D — Migration Log Template

Append to `apps/<APP_NAME>/docs/migration/component/_output/_migration-log.md`:

```md
## Dependency Upgrade — <date>

### Platform Packages Upgraded
| Package | From | To |
| ------- | ---- | -- |
| react | [old] | ^19 |
| react-dom | [old] | ^19 |
| @types/react | [old] | ^19 |
| @types/react-dom | [old] | ^19 |
| typescript | [old] | 5.9.2 |
| eslint-config-next | [old] | [new] |
| @types/node | [old] | ^22 |
| tailwindcss | [old] | ^4 |
| @tailwindcss/postcss | — | ^4 (added) |

### Config Changes
- postcss.config.js: [what changed]
- globals.css: [@tailwind → @import "tailwindcss"; @config]
- tailwind.config.ts: [keys removed]

### App-Specific Packages Removed
| Package | Reason |
| ------- | ------ |
| [package] | [reason — deprecated / redundant / zero usage] |

### App-Specific Deferred Items
| Package | Version kept | Reason deferred | Plan |
| ------- | ------------ | --------------- | ---- |
| [package] | [version] | [reason] | [replacement approach + sprint] |

### Type Errors Fixed
[list or "None"]

### Peer Dep Warnings
[list or "None"]

### Verification Gate
check-types: PASS · lint: PASS · build: PASS · dev smoke: PASS
```

---

## Reference: Version Sources of Truth

| Source | Location | Governs |
| ------ | -------- | ------- |
| Root workspace | `package.json` (repo root) | pnpm, turbo, typescript |
| `packages/ui` | `packages/ui/package.json` | React, Tailwind, @types/react |
| App | `apps/<APP_NAME>/package.json` | App-specific runtime deps |
| Node engine | Root `package.json` `engines.node` | Minimum Node version |

---

_Related: [00-overview.md](./00-overview.md) · [07-cleanup.md](./07-cleanup.md) · [migration-batch-prompts.md](./migration-batch-prompts.md)_
