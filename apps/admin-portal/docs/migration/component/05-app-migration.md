# 05 — Per-App Migration

> **Phase:** Migrate
> **Branch:** `migrate-app/<APP_NAME>` — run on EACH app's dedicated branch
> **Run count:** Once per app per batch
> **Prerequisite:** Phase 04 batch available (components merged into `@repo/ui` on `feat/ui` and accessible from this branch)
> **Prev:** [04-build-shared-components.md](./04-build-shared-components.md) · **Next:** [07-cleanup.md](./07-cleanup.md)

---

## Purpose

Migrate `apps/<APP_NAME>` from local component copies to shared `@repo/ui` components, batch by batch. Zero behavior regressions are allowed. Each batch must pass its verification gate before the next batch begins.

> **Process per batch:** Batch 1 (easy swaps) can be done as one batch. Batch 4 (new components) should be done component by component to limit risk surface.

---

## Prerequisites Checklist

- [ ] You are on branch `migrate-app/<APP_NAME>`
- [ ] Phase 01 audit is complete for this app
- [ ] SoC Evaluation completed for all components in `_audit-report.md` (fields: Is monolith / SoC potential / SoC strategy / Batch 1.5 candidate)
- [ ] If any Batch 1.5 candidates (HIGH or MEDIUM) exist → Batch 1.5 must run before Batch 2/3/4
- [ ] The target Batch's components are available in `@repo/ui` (check `packages/ui/src/index.ts`)
- [ ] `packages/ui/docs/normalization/_output/21-adapter-mapping.md` is accessible

> **Legacy update arrives during this phase?** Pause at the current component boundary (finish the component you're on, don't stop mid-component), then follow [`legacy-update-integration-guide.md`](./legacy-update-integration-guide.md) for the correct pause/resume procedure based on your current batch position.

---

## Deliverables

| File                                                                    | Description                                      |
| ----------------------------------------------------------------------- | ------------------------------------------------ |
| `apps/<APP_NAME>/docs/migration/component/_output/_migration-plan.md`   | Batch-by-batch plan with status for this app     |
| `apps/<APP_NAME>/docs/migration/component/_output/_migration-log.md`    | Append-only log of every change made             |
| `apps/<APP_NAME>/docs/migration/component/_output/_parity-checklist.md` | Updated status (from ⬜ to ✅ as items complete) |
| Code changes in `apps/<APP_NAME>/src/**`                                | Updated imports, deleted local copies            |

---

## §Batch 1.5 — SoC Pre-Migration Refactor

> **Run:** After Phase 01 audit is complete, before Batch 2/3/4 begins.
> **Skip if:** Zero components rated `Batch 1.5 candidate: YES` in `_audit-report.md`.
> **Scope:** ALL components (any classification) where `SoC potential: HIGH` or `MEDIUM` — not just `KEEP_APP_LOCAL`.
> **Standard:** [06-component-standards.md §6.2](./06-component-standards.md#62-universal-soc-evaluation) · [§6.5](./06-component-standards.md#65-app-local-refactor-patterns) · [§6.6](./06-component-standards.md#66-re-classification-after-split)
> **Prompt:** [migration-batch-prompts.md Batch 1.5](./migration-batch-prompts.md)

### Objective

Split monolith components into a domain-wiring **Container** and a pure-display **Shell** before any migration batch runs. This ensures:

- Migration batches (2/3/4) operate on clean, separated components
- Shells that qualify as `packages/ui` candidates are surfaced early (not after stabilization)
- Callers see zero change — the Container retains the same export name, path, and props

### Non-Breaking Change Contract

> [!IMPORTANT]
> The external API of the Container is **completely frozen**. This is the same contract as all migration work — a user of the app cannot observe that Batch 1.5 happened.

```
VERIFIABLE: zero diff in any file that imports the original component
VERIFIABLE: rendered output is pixel-identical before/after (smoke route check)
VERIFIABLE: TypeScript types pass without changes to callers
```

### What Is Refactored

Only components from `_audit-report.md` where `Batch 1.5 candidate: YES`. Processed one component per atomic commit.

### Patterns

See [06-component-standards.md §6.5](./06-component-standards.md#65-app-local-refactor-patterns) for full pattern code examples.

| Pattern                   | When to use                                                           |
| ------------------------- | --------------------------------------------------------------------- |
| `container-shell`         | Component mixes data hook + display JSX                               |
| `prop-injection`          | Domain coupling is only in type annotations                           |
| `render-prop` / `as` prop | Framework imports (`next/link`, `next/image`) inside a reusable shell |
| `hook-extraction`         | Data hook + domain types + logic all combined in one component        |

### Verification Gate (per component — non-negotiable)

```bash
pnpm --filter <APP_PACKAGE> check-types  # zero new errors
pnpm --filter <APP_PACKAGE> lint         # zero new errors
pnpm --filter <APP_PACKAGE> build        # clean build
# Then: smoke-check the component's primary render route visually
# Then: grep -r "ComponentName" src/ -- confirm zero caller files changed
```

### Guardrails (same as §6.5 — non-negotiable)

```
ALLOWED:
- Creating *Shell.tsx / *Display.tsx / *Layout.tsx in the same directory
- Extracting pure-display JSX into the Shell
- Extracting data-fetching logic into a co-located useXxxData hook
- Replacing domain types in Shell props with plain generic equivalents
- Applying the Box pass within the Shell during the same changeset
- Importing @repo/ui Skeleton/Spinner in the Shell for loading states

FORBIDDEN — zero tolerance:
- Changing the Container's exported name, file path, or prop interface
- Touching any caller of the original component
- Changing any rendered output visible to the user
- Adding new state, effects, or API calls to either Shell or Container
- Processing more than one component per atomic commit
- Skipping the verification gate between components
```

### Output (mandatory after Batch 1.5)

1. **`_audit-report.md` amended:** Original monolith entry marked `SPLIT`; two new entries added (Container + Shell) with their classifications
2. **`_component-backlog.csv` amended:** Original row marked `SPLIT`; new Shell row added
3. **`_migration-log.md`:** Append `## Batch 1.5 — SoC Pre-Migration Refactor` section
4. **`_per-app-baseline-summary.md`:** Append `## Batch 1.5 Amendment` block (components split, NEW_SHARED_COMPONENT candidates, KEEP_APP_LOCAL-only Shells)

### Shell → packages/ui Pathway

Shells that pass the [§6.6 Shell Classification Matrix](./06-component-standards.md#66-re-classification-after-split) (`NEW_SHARED_COMPONENT`) are queued for Phase 04 on `feat/ui`. This makes Batch 1.5 a **primary source of packages/ui candidates from app-local monoliths**.

---

## Phase Prompt (Batch 1 — ADOPT_NOW)

Replace `<APP_NAME>` before running.

```md
You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

## Objective

Execute Batch 1 migration: update all `ADOPT_NOW` imports in `apps/<APP_NAME>`
to use `@repo/ui` instead of local component copies. No behavior changes allowed.

## Inputs (read first)

- `apps/<APP_NAME>/docs/migration/component/_output/_audit-report.md` (ADOPT_NOW section)
- `apps/<APP_NAME>/docs/migration/component/_output/_parity-checklist.md`
- `packages/ui/src/index.ts` (confirm all target exports exist)

## Guardrails (non-negotiable)

You are performing a MIGRATION, not a refactor or redesign.

ALLOWED:

- Updating import paths from local → @repo/ui
- Deleting confirmed-replaced local component files after all imports updated and typecheck passes

FORBIDDEN — will result in rollback:

- Changing any component logic, prop values, or visual output at usage sites
- Refactoring, improving, or cleaning up unrelated code while you're in a file
- Adding new features, removing existing features, changing text content
- Any change not directly required to complete the import swap

If you find something that should be improved, add it to migration-log.md under
"Post-Migration Improvement Candidates" — do NOT act on it now.

## Execution Rules

1. For each ADOPT_NOW component:
   a. Confirm exact export name from `packages/ui/src/index.ts`
   b. Find ALL import locations in `apps/<APP_NAME>/src/**`
   c. Update import from local path → `@repo/ui`
   d. Verify props still compile (no prop API mismatches)
   e. Delete local component file ONLY after all imports updated and typecheck passes
2. Do NOT change any component logic, props passed at usage sites, or visual output
3. Record every changed file in migration-log.md

## \_migration-log.md Format (append per component)
```

## Batch 1 — <ComponentName> — <date>

- Imports updated: [list of files updated]
- Local file deleted: `src/components/ui/<ComponentName>.tsx`
- Typecheck: PASS
- Build: PASS
- Parity notes: [any observed differences — must be caused by design system token adoption only]
- Post-Migration Improvement Candidates: [list or "None"]

```

## Verification Gate (ALL must pass before calling Batch 1 complete)

> Read `apps/<APP_NAME>/docs/migration/verification-gate.md` for exact commands.

- Typecheck passes (per verification-gate.md)
- Lint passes (per verification-gate.md)
- Build passes (per verification-gate.md)
- Smoke routes from parity-checklist.md pass
- No new console errors in browser
- Behavioral parity confirmed: users cannot detect any change in behavior
```

---

## Phase Prompt (Batch 2 — ADOPT_WITH_ADAPTER)

````md
You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

## Objective

Execute Batch 2 migration: create thin local adapter wrappers for `ADOPT_WITH_ADAPTER`
components, then update usage sites to use the adapter (which wraps @repo/ui).

## Adapter Pattern

```typescript
// apps/<APP_NAME>/src/components/ui/adapted/ComponentName.tsx
// This adapter bridges the app's existing API to @repo/ui's canonical API
import { ComponentName as BaseComponentName } from '@repo/ui';
import type { ComponentNameProps as BaseProps } from '@repo/ui';

// Map app's local prop names to @repo/ui canonical names
interface ComponentNameProps extends Omit<BaseProps, 'variant'> {
  type?: 'primary' | 'danger'; // app's legacy naming
}

export function ComponentName({ type, ...rest }: ComponentNameProps) {
  const variant = type === 'danger' ? 'destructive' : type ?? 'default';
  return <BaseComponentName {...rest} variant={variant} />;
}
```
````

## Guardrails (non-negotiable)

You are performing a MIGRATION, not a refactor or redesign.

ALLOWED:

- Creating the thin adapter wrapper (mapping legacy prop API → @repo/ui canonical API)
- Updating usage sites to import from the adapter
- Deleting the original local component after the adapter is verified

FORBIDDEN — will result in rollback:

- Changing any business logic, event handlers, or data flow at usage sites
- Making the adapter do anything beyond prop mapping (no logic, no state, no effects)
- Refactoring unrelated code in any file you touch
- Changing visual output beyond what design system token adoption causes

If you find something that should be improved, add it to migration-log.md under
"Post-Migration Improvement Candidates" — do NOT act on it now.

## Execution Rules

1. Create adapter ONLY for API mismatches documented in `_output/21-adapter-mapping.md`
2. Adapter lives in `apps/<APP_NAME>/src/components/ui/adapted/`
3. Usage sites import from adapter (not directly from @repo/ui)
4. Local original component deleted after adapter is in place and all gates pass
5. Document adapter rationale in migration-log.md

## Acceptance Criteria

- No behavioral change at any usage site
- All original prop usages still compile via adapter
- Adapter is < 30 lines (if longer, reconsider — adapter must be pure prop mapping only)
- User cannot detect any change in interaction or visual output

````

---

## Phase Prompt (Batch 3/4 — EXTEND or NEW)

```md
You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

## Objective
Execute Batch 3/4 migration: replace local component with the newly built @repo/ui
`<COMPONENT_NAME>` (which was developed in Phase 04 on feat/ui).

## Pre-migration Verification
1. Confirm `<COMPONENT_NAME>` is exported from `packages/ui/src/index.ts`
2. Review the spec: `packages/ui/src/<ComponentName>/<ComponentName>.spec.md`
3. Review adapter notes: `packages/ui/docs/normalization/_output/21-adapter-mapping.md`

## Guardrails (non-negotiable)

You are performing a MIGRATION, not a refactor or redesign.

ALLOWED:
- Updating usage site imports to @repo/ui (or adapter if needed)
- Adapting props at usage sites to match the @repo/ui API via the adapter pattern
- Deleting the local copy after all usage sites verified and gate passes

FORBIDDEN — will result in rollback:
- Changing event handlers, data flows, or side effects at usage sites
- Altering or removing any features, states, or variants the component had
- Changing text content, copy, error messages, ARIA labels, or placeholder text
- Refactoring or cleaning up unrelated code in files you touch
- Introducing visual changes beyond design system token adoption

If you find something that should be improved, add it to migration-log.md under
"Post-Migration Improvement Candidates" — do NOT act on it now.

## Execution Rules
1. Update all usage sites in `apps/<APP_NAME>/src/**` to import from `@repo/ui`
2. Adapt props at usage sites if API changed (use adapter pattern if needed)
3. Run verification gate (per verification-gate.md)
4. Delete local copy ONLY after gate passes

## Parity Verification (per usage site — all must be ✅)

See full checklist template in `06-component-standards.md` Section 8.7.

- [ ] User interactions: click, hover, focus, keyboard — identical
- [ ] Loading / error / empty states — identical
- [ ] Form submit, validate, reset — identical
- [ ] ARIA labels and keyboard navigation — identical or improved (never removed)
- [ ] Visual output — identical (minor token-caused delta acceptable, document it)
- [ ] No new console or runtime errors

## Verification Gate

> Read `apps/<APP_NAME>/docs/migration/verification-gate.md` for exact commands.

- Typecheck passes (per verification-gate.md)
- Lint passes (per verification-gate.md)
- Build passes (per verification-gate.md)
- All smoke routes from parity-checklist.md pass
- Behavioral parity confirmed: users cannot detect any change
````

---

## Migration Status Tracking

Update `apps/<APP_NAME>/docs/migration/component/_output/_migration-plan.md` after each component:

```
| Component | Batch | Class | Status | Date |
|---|---|---|---|---|
| Button | 1 | ADOPT_NOW | ✅ DONE | 2026-02-20 |
| Table | 4 | NEW_SHARED | 🟡 IN PROGRESS | 2026-02-21 |
| DataTable | 4 | NEW_SHARED | ⬜ WAITING | — |
```

---

## Phase Prompt (Batch 5 — Stabilization)

> Run after ALL Batch 1–4 items are complete for this app.

```md
You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

## Objective

Perform Batch 5 Stabilization: a comprehensive parity audit across the entire app
after completing all migration batches. This ensures no regressions were missed
and the app is fully ready for cleanup (Phase 07).

## Inputs (all must be read)

- `apps/<APP_NAME>/docs/migration/component/_output/_migration-log.md`
- `apps/<APP_NAME>/docs/migration/component/_output/_parity-checklist.md`
- `apps/<APP_NAME>/docs/migration/component/_output/_audit-report.md`
- `packages/ui/docs/normalization/_output/21-adapter-mapping.md`

## Batch 5 Tasks

### 1. Full App Verification Gate

Run the complete verification suite from `verification-gate.md`:

- `pnpm check-types --filter=<app-name>`
- `pnpm lint --filter=<app-name>`
- `pnpm build --filter=<app-name>`

Zero errors allowed.

### 2. Adapter Audit

For every adapter in `apps/<APP_NAME>/src/components/ui/adapted/`:

- Is it still needed? (Has the upstream API gap been closed in @repo/ui?)
- Document each adapter's continued necessity in `_migration-log.md` under "Adapter Status"
- Flag adapters ready for deletion in `_migration-log.md` — they will be processed in Phase 07

### 3. Parity Checklist Final Sign-Off

For every item in `_parity-checklist.md` still showing ⬜:

- Test in browser: interaction, keyboard nav, visual
- Mark as ✅ PASS or ❌ FAIL with evidence

### 4. Smoke Route Full Run

Navigate through every route listed in `verification-gate.md`:

- Verify no UI regression
- Verify no broken layouts
- Verify no console errors (runtime or hydration)

### 5. Migration Log Finalization

- Mark all migration entries as Status: DONE or Status: DEFERRED
- Move any DEFERRED items to `Post-Migration Improvement Candidates`
- Confirm every component has an entry

## Acceptance Criteria

- All `_parity-checklist.md` items are ✅ PASS (or documented exception)
- Zero TypeScript errors, lint errors, or build errors
- No unreviewed adapters remain
- `_migration-log.md` is complete — no components with missing status
- App is cleared for Phase 07 Cleanup
```

---

## §Native Element Replacement (Box Pass)

<a id="native-element-replacement"></a>

> [!IMPORTANT]
> **All bare native HTML elements in migrated component files must be replaced with `Box` from `@repo/ui`.** This is not optional — it is part of the migration's explicit goal to route all layout primitives through the design system.

### What counts as a "bare native element"

Any `div`, `span`, `section`, `article`, `main`, `aside`, `header`, `footer`, `ul`, `ol`, `li`, `p`, `h1`–`h6`, `strong`, `em`, `code`, `pre`, `hr`, `figure`, `figcaption` used **directly** in JSX (not via a `@repo/ui` component) is a bare native element.

Exceptions — do NOT replace with Box:

- `<html>`, `<body>`, `<head>` (layout files)
- Radix portal targets (internal plumbing)
- Next.js App Router boundary helpers (`<Suspense>`, `<ErrorBoundary>` wrappers in layout files)
- Elements inside `packages/ui` components (those are already in the system)

### When to do the Box pass

**Do it inline during the component's normal batch migration** — not as a separate batch. When you update the import and verify the component, also swap any bare native elements to `Box` in the same changeset. This keeps the scope contained and parity verification unified.

### How to do the Box pass

```tsx
// Before — bare native elements (typical pattern in legacy components)
import React from 'react';

// After — Box pass complete
import { Box } from '@repo/ui';

export function PolicyCard({ title, status, children }) {
  return (
    <div className="rounded-md border border-border p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">{status}</span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function PolicyCard({ title, status, children }) {
  return (
    <Box className="rounded-md border border-border p-4">
      <Box className="flex items-center justify-between">
        <Box as="span" className="text-sm font-medium">
          {title}
        </Box>
        <Box as="span" className="text-xs text-muted-foreground">
          {status}
        </Box>
      </Box>
      <Box className="mt-2">{children}</Box>
    </Box>
  );
}
```

### Guardrails for the Box pass

```
ALLOWED:
- Replacing bare native elements with <Box as="[same-element]"> or <Box> for divs
- Adding the @repo/ui Box import

FORBIDDEN — same parity contract as all other migration work:
- Changing className values
- Changing the element's semantic role (e.g., div → span)
- Merging or splitting adjacent elements
- Changing children order or nesting structure
- Removing or adding any element not directly being replaced
```

### Logging the Box pass

In `_migration-log.md`, add a line per component:

```
- Box pass: replaced N bare native elements in ComponentName.tsx
```

---

## Next.js App Router Integration Rules

> [!IMPORTANT]
> This section applies to all apps using the Next.js App Router. `@repo/ui` components are framework-agnostic — these rules define how consuming apps bridge the gap.

### "use client" Boundary

All `@repo/ui` components are **client components by default**. They contain event handlers, state, and Radix primitives — none of which are compatible with React Server Components.

```
rule: NEVER put 'use client' inside packages/ui
rule: In consuming apps, if you import @repo/ui into a Server Component file,
      wrap the import in a client boundary file first
```

```tsx
// apps/<APP_NAME>/src/components/ui/confirm-dialog.tsx
'use client'; // ← boundary declared in the app, not in packages/ui
import { Dialog, DialogContent, DialogTitle } from '@repo/ui';

export function ConfirmDialog({ ...props }) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogTitle>{props.title}</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}

// Now Server Components can use <ConfirmDialog> safely
// because the 'use client' boundary is in the app layer
```

### next/link and next/image at Usage Site

`@repo/ui` components must not import `next/link` or `next/image`. When usage sites need Next.js-specific rendering, wrap at the app layer:

```tsx
// ❌ WRONG — inside packages/ui (breaks app-agnostic contract)
import Link from 'next/link'
export function NavItem({ href, children }) {
  return <Link href={href}>{children}</Link>
}

// ✅ CORRECT — use asChild at the app usage site
import { Button } from '@repo/ui'
import Link from 'next/link'

// Usage site in the app:
<Button asChild variant="ghost">
  <Link href="/dashboard">Dashboard</Link>
</Button>
```

### Suspense + PPR Boundary Placement

When using `@repo/ui` loading states (Skeleton, Spinner) with Next.js App Router streaming:

```tsx
// apps/<APP_NAME>/src/app/dashboard/page.tsx
import { Suspense } from 'react';

import { Skeleton } from '@repo/ui';
import { DataTable } from '@repo/ui';

// @repo/ui Skeleton as fallback — correct pattern
export default function DashboardPage() {
  return (
    <Box>
      {' '}
      {/* Box replaces bare <div> */}
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <PolicyTable /> {/* async server component */}
      </Suspense>
    </Box>
  );
}
```

**PPR (Next.js 16+ `cacheComponents: true`):** If the app uses Cache Components, wrap dynamic data sections in Suspense — static shell from `@repo/ui` (nav, headers) renders instantly from CDN:

```tsx
// Static shell (layout) — instant from CDN
<nav>...</nav>   // @repo/ui NavigationMenu — static, no Suspense needed

// Dynamic section — streams in
<Suspense fallback={<Skeleton className="h-[200px]" />}>
  <UserNotifications />   // reads cookies → must be outside 'use cache'
</Suspense>
```

### next/font → CSS Variable Injection

`@repo/ui` uses CSS custom property tokens for typography. To connect `next/font` to the design system:

```tsx
// apps/<APP_NAME>/src/app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans', // ← injects as CSS custom property
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      {/* ^^ font variable lives on <html>, @repo/ui CSS vars read it via Tailwind config */}
      <body>{children}</body>
    </html>
  );
}

// tailwind.config.ts in the app:
// fontFamily: { sans: ['var(--font-sans)', ...fontFamilies.sans] }
// @repo/ui picks up --font-sans automatically via Tailwind's font-sans class
```

### Debugging Boundaries Post-Migration

After migrating components, use **`next-devtools MCP`** to inspect:

- RSC vs client component tree (verify `@repo/ui` imports don't accidentally pull in server-side code)
- Suspense boundary waterfall detection
- Bundle size impact of new `@repo/ui` imports

```
next-devtools MCP:
  → inspect component tree on key routes listed in smoke-routes
  → verify no "use server" marker appears inside @repo/ui subtree
  → check Time to First Byte hasn't regressed (PPR-enabled apps)
```

---

<a id="phase-05a"></a>

## §Phase 05A — App-Local SoC Refactor

> [!IMPORTANT]
> **When to run:** After Batch 9 (Stabilization) acceptance criteria all pass, before Batch 10 (Cleanup). Use the [Batch 9.5 prompt in migration-batch-prompts.md](./migration-batch-prompts.md#batch-95--app-local-soc-refactor-phase-05a).
>
> **Skip if:** Zero KEEP_APP_LOCAL components rated HIGH or MEDIUM in `_audit-report.md` under `Refactor potential`.

### Objective

Refactor KEEP_APP_LOCAL components for better separation of concerns by splitting them into:

- **Container** (same file, same export) — domain logic + data wiring
- **Shell** (new `*Shell.tsx` file, same directory) — pure display, no domain logic

**Callers see zero change.** External API of every container remains frozen.

### Trigger: What Gets Refactored

Only components from `_audit-report.md` where `Refactor potential: HIGH` or `Refactor potential: MEDIUM`. These were tagged during Batch 1 audit.

`LOW` and `NONE` components are **not** in scope for Phase 05A.

### Patterns

See [06-component-standards.md §6.5](./06-component-standards.md#65-app-local-refactor-patterns) for full patterns with code examples.

| Pattern                                                              | When to use                                                                                                    |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Container/Shell** — split monolithic into container + `*Shell.tsx` | Component mixes domain data + display JSX                                                                      |
| **Hook Extraction** — pull data logic into `useXxxData` hook         | Component calls a service hook (`use<Domain>()`) directly inside render logic, mixing data wiring with display |
| **Prop Injection** — replace domain types with plain props in Shell  | Domain coupling is only in type annotations                                                                    |

### Phase 05A Guardrails

```
ALLOWED:
- Creating *Shell.tsx / *Display.tsx / *Layout.tsx in the same directory
- Extracting pure-display JSX into the Shell
- Extracting data-fetching logic into a co-located useXxxData hook
- Replacing domain types in Shell props with plain generic equivalents
- Applying the Box pass (§1.4) within the Shell during the same changeset
- Importing @repo/ui Skeleton/Spinner in the Shell for loading states

FORBIDDEN — zero tolerance, violation = rollback this component:
- Changing the container's exported name, file path, or prop interface
- Changing ANY caller (zero caller files may be touched)
- Changing any rendered output visible to the user
- Adding new state, effects, or API calls in either Shell or Container
- Processing more than one component per atomic commit
- Skipping the verification gate between components
```

### Verification Gate (per component)

```bash
pnpm --filter <APP_PACKAGE> check-types  # zero errors
pnpm --filter <APP_PACKAGE> lint         # zero errors
pnpm --filter <APP_PACKAGE> build        # clean build
```

Then: manually verify the component's smoke route still renders identically.

### Output

All Phase 05A results are logged under `## Phase 05A — App-Local Refactor` in `_migration-log.md`.

For each component, record: refactor strategy applied, container/shell file paths, domain logic removed, packages/ui candidacy result, Box pass count, gate results, and grep confirmation of zero caller changes.

### Shell → packages/ui Pathway

When a Shell passes the §6.5 "Good Shell Criteria" checklist (plain props only, no framework imports, no env vars, cross-app demand) → classify it as a `NEW_SHARED_COMPONENT` candidate in `_migration-log.md` and queue it for Phase 04 (Build packages/ui).

This makes Phase 05A a **secondary source of packages/ui candidates** — components that were previously missed or not yet ready during Phase 01 audit.

---

_Related: [04-build-shared-components.md](./04-build-shared-components.md) · [01-app-audit.md](./01-app-audit.md) · [07-cleanup.md](./07-cleanup.md)_
