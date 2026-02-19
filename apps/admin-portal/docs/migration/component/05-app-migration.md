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
    <div>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <PolicyTable /> {/* async server component */}
      </Suspense>
    </div>
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

_Related: [04-build-shared-components.md](./04-build-shared-components.md) · [01-app-audit.md](./01-app-audit.md) · [07-cleanup.md](./07-cleanup.md)_
