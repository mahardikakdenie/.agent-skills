# Migration Batch Prompts — Component Migration

> **How to use:** One file, one-way. Work through Batch 0 → Batch 11 in order.
> Copy-paste each prompt block exactly. Replace placeholders before running.
> Legacy Update batches (L1–L6) can interrupt at any point — see the [Legacy Update section](#legacy-update-batches-l1l6).

---

## Placeholders

Replace these in every prompt before running:

| Placeholder       | Value                | Description                               |
| ----------------- | -------------------- | ----------------------------------------- |
| `<APP_NAME>`      | `admin-portal`       | App slug (matches `apps/` directory name) |
| `<APP_PATH>`      | `apps/admin-portal`  | Monorepo-relative path to app root        |
| `<APP_PACKAGE>`   | `@repo/admin-portal` | Package name for `pnpm --filter`          |
| `<LEGACY_REMOTE>` | `admin-portal`       | Git remote name for the legacy repo       |
| `<LEGACY_BRANCH>` | `stage`               | Default branch of the legacy repo         |

---

## Related Documents

- `<APP_PATH>/docs/migration/component/00-overview.md` — Branch model & lifecycle
- `<APP_PATH>/docs/migration/component/01-app-audit.md` — Phase 01 spec
- `<APP_PATH>/docs/migration/component/02-design-system-foundation.md` — Phase 02 spec
- `<APP_PATH>/docs/migration/component/03-migration-plan.md` — Phase 03 spec
- `<APP_PATH>/docs/migration/component/04-build-shared-components.md` — Phase 04 spec
- `<APP_PATH>/docs/migration/component/05-app-migration.md` — Phase 05 spec
- `<APP_PATH>/docs/migration/component/06-component-standards.md` — Component standards (always-on)
- `<APP_PATH>/docs/migration/component/07-cleanup.md` — Phase 07 spec
- `<APP_PATH>/docs/migration/component/08-operational-standards.md` — Phase 08 spec
- `<APP_PATH>/docs/migration/component/legacy-update-routines.md` — Legacy update routines (Routine 1–6)
- `<APP_PATH>/docs/migration/component/legacy-update-integration-guide.md` — Legacy update quick reference
- `<APP_PATH>/docs/migration/verification-gate.md` — App-specific verification commands

---

## Available AI Agent Skills

The following skills may be installed in this project (`skills/`). **Only use a skill if it is installed.** Each batch prompt lists relevant skills with `$skill-name` notation — skip any that are not present.

| Skill                          | When it applies                                                                                                                           |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `$design-system`               | Writing component specs, token conventions, CVA patterns, accessibility standards, design system architecture                             |
| `$monorepo-workspace`          | Package boundaries, what to import from where, cn() correct import, turbo task names, --filter commands, legacy dep state in admin-portal |
| `$vercel-composition-patterns` | Building compound components, avoiding boolean prop proliferation, React 19 API changes                                                   |
| `$next-best-practices`         | RSC boundary placement, async APIs, `'use client'` / `'use server'`, App Router patterns                                                  |
| `$next-cache-components`       | Components that wrap cached server data (`use cache`, cacheLife, cacheTag, PPR)                                                           |
| `$turborepo`                   | Verification gate commands, `--filter` usage, pipeline task configuration, `pnpm` monorepo                                                |
| `$react-query`                 | Data fetching in migrated components: `useQuery`, `useMutation`, query key conventions, invalidation strategy                             |
| `$forms-validation`            | Form-heavy component migration: `react-hook-form` v7 + `zod` patterns, `@repo/ui` form component integration                              |
| `$agent-browser`               | Smoke route testing, visual parity validation, automated interaction verification                                                         |
| `$next-upgrade`                | Upgrading Next.js during migration setup or if version bump is required                                                                   |
| `$vercel-react-best-practices` | React/Next.js performance patterns — waterfalls, bundle size, re-renders, data fetching                                                   |
| `$systematic-debugging`        | When any verification gate fails — root cause first, no random fixes                                                                      |
| `$web-design-guidelines`       | Auditing UI code for web interface guidelines compliance (accessibility, semantics, focus)                                                |

---

## Batch 0 — Verification Gate Setup

> **Branch:** `migrate-app/<APP_NAME>`
> **Run:** Once per app, before anything else
> **Blocks:** All subsequent batches

```
You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read `<APP_PATH>/docs/migration/component/00-overview.md` Branch Model section.
Read `<APP_PATH>/docs/migration/verification-gate.md` if it already exists.

Create or update `<APP_PATH>/docs/migration/verification-gate.md` with the exact
commands for THIS app:

Required sections:
1. Typecheck command: `pnpm --filter <APP_PACKAGE> check-types`
2. Lint command: `pnpm --filter <APP_PACKAGE> lint`
3. Build command: `pnpm --filter <APP_PACKAGE> build`
4. Turborepo package name: (confirm correct --filter value)
5. Smoke routes: list 5–10 critical routes that must not visually regress
6. Parity baseline: how to confirm component behavior unchanged (e.g., visual + interaction)

Run the verification gate now and report results. If any command fails, fix only the
pre-existing issue (do not modify component or migration files).

> Skills (if installed): `$monorepo-workspace` (confirm correct --filter selector for this app, script names available); `$turborepo` (confirm correct --filter values, verify task pipeline is set up); `$next-upgrade` (if Next.js version needs updating before migration begins); `$systematic-debugging` (if any gate command fails — trace root cause before attempting fixes)

Do NOT create any migration output files yet.
```

---

## Batch 1 — Per-App Component Audit (Phase 01)

> **Branch:** `migrate-app/<APP_NAME>`
> **Run:** Once per app (run all apps before moving to Batch 2)
> **Output:** `<APP_PATH>/docs/migration/component/_output/` — creates 4 files

```
You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read ALL of these before starting:
- `<APP_PATH>/docs/migration/component/01-app-audit.md` (full spec for this phase)
- `<APP_PATH>/docs/migration/component/06-component-standards.md` (classification rules)

## Objective

Audit ALL UI components in `<APP_PATH>/src/` and classify every one.

## Classification Rules (from 06-component-standards.md)

- ADOPT_NOW — locally-defined component that is already available in @repo/ui with matching API
- ADOPT_WITH_ADAPTER — available in @repo/ui but prop API differs from local usage
- EXTEND_EXISTING — @repo/ui has the component but is missing variants/props this app needs
- NEW_SHARED_COMPONENT — purely visual, used by 2+ apps, not in @repo/ui yet
- KEEP_APP_LOCAL — contains business logic, domain types, API calls, app-specific structure, or used only here

## Execution Steps

1. Scan `<APP_PATH>/src/components/` for all component files
2. For each component:
   a. Read the component file
   b. Check if it exists in `packages/ui/src/index.ts`
   c. Compare prop API if it exists
   d. Assign one classification using the rules above
   e. Note parity risk (LOW / MEDIUM / HIGH) based on behavioral complexity
3. Build parity checklist for all shared-candidate components

## Required Outputs (create all 4)

### `<APP_PATH>/docs/migration/component/_output/_audit-report.md`

One entry per component:
```

### ComponentName

- **File:** `src/components/path/ComponentName.tsx`
- **Classification:** ADOPT_NOW | ADOPT_WITH_ADAPTER | EXTEND_EXISTING | NEW_SHARED_COMPONENT | KEEP_APP_LOCAL
- **Batch:** 1 | 2 | 3 | 4 | N/A
- **@repo/ui status:** exists (exact export name) | partial | missing
- **API delta:** (props that differ, if any)
- **Parity risk:** LOW | MEDIUM | HIGH
- **Risk notes:** (what could regress)
- **Reason kept app-local:** (if KEEP_APP_LOCAL — domain logic / API call / app-specific)

```

### `<APP_PATH>/docs/migration/component/_output/_component-backlog.csv`

Columns: `component_name,classification,batch,priority,risk_level,source_path,repo_ui_export,effort,parity_risk`

### `<APP_PATH>/docs/migration/component/_output/_parity-checklist.md`

For each non-KEEP_APP_LOCAL component, list:
- [ ] Interaction parity (click, hover, keyboard)
- [ ] Visual parity (layout, spacing, color — token delta OK)
- [ ] State parity (loading, error, disabled, empty)
- [ ] Prop API still compiles after swap

### `<APP_PATH>/docs/migration/component/_output/_per-app-baseline-summary.md`

Summary for Phase 02 cross-app reconciliation:
- Total components audited
- Count per classification
- Top 5 highest-parity-risk items with notes
- Components that EXTEND_EXISTING: what variants are missing in @repo/ui
- Components that are NEW_SHARED_COMPONENT: full visual spec (props, variants, states)

> Skills (if installed): `$vercel-composition-patterns` (identify components with boolean prop proliferation that need compound patterns); `$next-best-practices` (flag components with invalid RSC usage, async client components)

Do NOT modify any source files. Do NOT modify packages/ui.
```

---

## Batch 2 — Design System Foundation (Phase 02)

> **Branch:** `feat/ui`
> **Run:** ONCE — only after ALL apps have completed Batch 1
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
This is the constitution: once locked, all Phase 03–05 work must conform to it.

## Cross-App Reconciliation (do this before writing ANY output)

1. Union all NEW_SHARED_COMPONENT + EXTEND_EXISTING needs across all apps
2. Resolve API conflicts — where apps use the same component differently, define ONE canonical API
3. Identify most common naming/variant inconsistencies for normalization
4. Identify dependency gaps in packages/ui
5. Assess whether packages/config / packages/helper / packages/interface can serve the workspace better

## Required Outputs (create all 6 in `packages/ui/docs/normalization/_output/`)

1. `00-foundation.md` — Governing principles: app-agnostic rule, spec-first mandate, Storybook mandate,
   breaking change policy, review gates, accessibility minimum bar
2. `01-component-taxonomy.md` — Full taxonomy: Tier 1 (Primitives), Tier 2 (Composites), Tier 3 (App-local),
   with @repo/ui status + cross-app frequency
3. `02-api-conventions.md` — Canonical prop interface for EACH component (existing + planned):
   prop names, variant names, size names, event handler signatures, slot names, ref forwarding
4. `03-token-theming-contract.md` — CSS variable system, required tokens, how apps configure globals.css,
   forbidden hardcoded values, dark mode strategy
5. `04-shared-vs-local-boundary.md` — Decision tree, Zombie Code Policy (dead/zombie/divergent),
   per-category rulings from cross-app analysis
6. `06-risk-register.md` — Per high-risk component: risk type, affected apps, mitigation, rollback plan

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
```

---

## Batch 3 — Migration Plan (Phase 03)

> **Branch:** `feat/ui`
> **Run:** Once — after Batch 2 complete
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

Convert all per-app audits + the Phase 02 foundation into one executable program plan.

## Required Outputs (create all 4 in `packages/ui/docs/normalization/_output/`)

### `10-cross-app-reconciliation.md`

For each unique component need across all apps — one canonical entry:
```

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
```

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

For each batch (1 through 6):
- Scope description
- packages/ui work required
- Per-app work required
- Verification gate (exact commands)
- Apps × Components matrix

## Acceptance Criteria
- Master backlog has zero duplicate entries
- Every per-app backlog item maps to exactly one batch + master backlog row
- Batches ordered lowest → highest risk
- Every batch has explicit verification gates
- Critical path identified

> Skills (if installed): `$monorepo-workspace` (workspace package names, --filter selectors, script names); `$turborepo` (verification gate commands in 13-implementation-batches.md must use correct `pnpm --filter` syntax)

Do NOT modify any apps. Commit to feat/ui when complete.
```

---

## Batch 4 — Build packages/ui: Extend Existing (Phase 04 — Batch 3 items)

> **Branch:** `feat/ui`
> **Run:** Once per EXTEND_EXISTING component — repeat this prompt per component
> **Prerequisite:** `11-master-component-roadmap.md` and `02-api-conventions.md` exist

```
You are a Principal Frontend Engineer on branch `feat/ui`.

Read before starting:
- `<APP_PATH>/docs/migration/component/04-build-shared-components.md` (full SDD spec)
- `<APP_PATH>/docs/migration/component/06-component-standards.md` (Sections 9–13)
- `packages/ui/docs/normalization/_output/02-api-conventions.md`
- `packages/ui/docs/normalization/_output/11-master-component-roadmap.md` (<COMPONENT_NAME> entry)
- `packages/ui/src/<COMPONENT_NAME>/<COMPONENT_NAME>.tsx` (current implementation)

## Objective

Extend `<COMPONENT_NAME>` in packages/ui to add:
[list specific variants/props from 11-master-component-roadmap.md]

Use the structure tier from the roadmap (Simple | Standard | Complex).

## SDD Steps (mandatory order)

1. Update `packages/ui/src/<COMPONENT_NAME>/<COMPONENT_NAME>.spec.md` — document new variants/props
2. Add stories for new cases to `<COMPONENT_NAME>.stories.tsx` (Storybook RED state is OK — intentional)
3. Implement changes in `<COMPONENT_NAME>.tsx` (make Storybook GREEN)
4. Update `index.ts` exports if new types added

## App-Agnostic Rules (NON-NEGOTIABLE)

- No `next/*` imports (`next/image`, `next/link`, `next/router`, `next/navigation`)
- No business logic, API calls, domain types
- No hardcoded app strings or `NEXT_PUBLIC_*` env vars
- All new props must follow `02-api-conventions.md` naming
- All new variants must use CVA pattern
- `cn()` imported from `'../../utils/cn'` (internal to `packages/ui` — never from `tailwind-merge` directly or from `@repo/helper`)

## Verification Gate (ALL must pass before marking DONE)

- `pnpm --filter @repo/ui check-types`
- `pnpm --filter @repo/ui lint`
- `pnpm --filter @repo/ui build`
- Storybook renders all new stories without errors

> Skills (if installed): `$monorepo-workspace` (cn() import path, dependency boundaries, which packages can be added); `$turborepo` (correct --filter and pipeline usage); `$vercel-composition-patterns` (if extending a compound component, validate composition API is not breaking consumers)

## After Gate Passes

Append to:
- `packages/ui/docs/normalization/_output/20-foundation-change-log.md`
- `packages/ui/docs/normalization/_output/21-adapter-mapping.md` (if any adapter notes for apps)
Update `packages/ui/docs/normalization/_output/13-implementation-batches.md` tracker.
```

---

## Batch 5 — Build packages/ui: New Components (Phase 04 — Batch 4 items)

> **Branch:** `feat/ui`
> **Run:** Once per NEW_SHARED_COMPONENT — repeat this prompt per component
> **Prerequisite:** `11-master-component-roadmap.md` and `02-api-conventions.md` exist

```
You are a Principal Frontend Engineer on branch `feat/ui`.

Read before starting:
- `<APP_PATH>/docs/migration/component/04-build-shared-components.md` (full SDD spec)
- `<APP_PATH>/docs/migration/component/06-component-standards.md` (Sections 9–13)
- `packages/ui/docs/normalization/_output/02-api-conventions.md`
- `packages/ui/docs/normalization/_output/03-token-theming-contract.md`
- `packages/ui/docs/normalization/_output/11-master-component-roadmap.md` (<COMPONENT_NAME> entry)
- Per-app `_output/_per-app-baseline-summary.md` files (for usage context)

## Objective

Build new shared component `<COMPONENT_NAME>` for packages/ui via SDD lifecycle.
Structure tier: [Simple | Standard | Complex — from roadmap]

## Step 1 — Write Spec (`<COMPONENT_NAME>.spec.md`) — NO CODE YET

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

> Skills (if installed): `$design-system` (read `SKILL.md` → `COMPONENTS.md` for accessibility requirements, keyboard patterns, focus states, and ARIA role requirements for `<COMPONENT_NAME>`); `$vercel-composition-patterns` (if this is a compound component — validate API avoids boolean prop proliferation)

## Step 2 — Write Stories (`<COMPONENT_NAME>.stories.tsx`) — Storybook will error, this is intentional

Cover every story from the spec. RED state confirms spec is driving implementation.

## Step 3 — Implement

> Skills (if installed): `$monorepo-workspace` (package boundaries, cn() import, that @repo/ui must not import from apps or @repo/helper); `$vercel-composition-patterns` (compound components with sub-components and shared context); `$next-best-practices` (if component renders inside App Router pages — validate RSC vs client boundary placement); `$next-cache-components` (if this component wraps cached server data — apply `use cache` + cacheTag patterns); `$vercel-react-best-practices` (apply bundle, waterfall, and re-render optimizations during implementation); `$forms-validation` (if building a form-related component — Controller wiring, aria-invalid, error display conventions)

> MCPs (if available): use `shadcn MCP` to search registry for <COMPONENT_NAME> as baseline — then normalize (CSS variable tokens, forwardRef, CVA, `cn` from `'../../utils/cn'` internal import). Use `context7 MCP` for Radix primitive docs before writing component interface.

Special rules:
- DataTable / sortable component: MUST use `@tanstack/react-table` v8 (never react-table v7)
- Calendar / DatePicker: MUST use `react-day-picker` + `date-fns`

Make ALL Storybook stories render without errors (GREEN state).

## Step 4 — Export

Add to `packages/ui/src/<ComponentName>/index.ts` and `packages/ui/src/index.ts`.

## App-Agnostic Checklist (ALL must pass before PR)

### Implementation
- [ ] `cn()` from `'../../utils/cn'` (internal — `import { cn } from '../../utils/cn'`)
- [ ] CVA for variants; `cn(variantClasses, className)` merge order correct
- [ ] CSS variable tokens only — no hardcoded hex/rgb/named colors
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
- [ ] No `fetch`/`axios`/`useQuery`/`useMutation`
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
```

---

## Batch 6 — Per-App Migration: Batch 1 — ADOPT_NOW

> **Branch:** `migrate-app/<APP_NAME>`
> **Run:** Once per app
> **Prerequisite:** Phase 04 Batch 1 components confirmed in `packages/ui/src/index.ts`

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

## Guardrails (non-negotiable — violation = immediate rollback)

ALLOWED:
- Updating import paths from local path → `@repo/ui`
- Deleting confirmed-replaced local files ONLY after all imports updated and typecheck passes

FORBIDDEN:
- Changing any component logic, prop values, or visual output at usage sites
- Refactoring, improving, or cleaning up unrelated code in any file you touch
- Adding/removing features, changing text content, ARIA labels, or placeholder text

If you find something to improve: add to `_migration-log.md` under "Post-Migration Improvement Candidates". Do NOT act on it now.

## Execution (per component)

1. Confirm exact export name from `packages/ui/src/index.ts`
2. Find ALL import locations in `<APP_PATH>/src/**`
3. Update import from local path → `@repo/ui`
4. Verify props still compile: `pnpm --filter <APP_PACKAGE> check-types`
5. Delete local component file ONLY after all imports updated and typecheck passes
6. Record in `_migration-log.md`:
```

## Batch 1 — <ComponentName> — <date>

- Imports updated: [list files]
- Local file deleted: `src/components/ui/<ComponentName>.tsx`
- Typecheck: PASS
- Parity notes: [any observed differences — token adoption only]
- Post-Migration Improvement Candidates: [list or "None"]

```

## Verification Gate (ALL must pass before calling Batch 1 complete)

Read `<APP_PATH>/docs/migration/verification-gate.md` for exact commands.
- Typecheck passes
- Lint passes
- Build passes
- Smoke routes from `_parity-checklist.md` pass
- No new console errors in browser

> Skills (if installed): `$monorepo-workspace` (check @APP_PACKAGE filter value, verify script names before running commands); `$turborepo` (correct `--filter <APP_PACKAGE>` used in all gate commands); `$react-query` (if any migrated component wraps a `useQuery` or `useMutation` call — validate query key and service integration unchanged); `$agent-browser` (automate smoke route verification — navigate critical routes, capture screenshots, flag visual regressions)
```

---

## Batch 7 — Per-App Migration: Batch 2 — ADOPT_WITH_ADAPTER

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
````

## Rules

- Adapter: ONLY prop mapping — no logic, no state, no effects
- Adapter must be < 30 lines (if longer, reconsider design)
- Adapter lives in `<APP_PATH>/src/components/ui/adapted/`
- Usage sites import from adapter (not directly from @repo/ui)
- Original local component deleted AFTER adapter is verified

FORBIDDEN — same as Batch 6:

- Business logic changes at usage sites
- Changing visual output beyond token adoption
- Refactoring unrelated code

## Verification Gate

Read `<APP_PATH>/docs/migration/verification-gate.md` for exact commands.

- Typecheck, lint, build all pass
- All original prop usages still compile via adapter
- Behavioral parity confirmed

> Skills (if installed): `$turborepo` (correct `--filter` in gate commands); `$forms-validation` (if adapter wraps a form-related component — validate Controller wiring and error display preserved); `$react-query` (if adapter wraps a data-fetching component — confirm query key and service call unchanged); `$vercel-composition-patterns` (validate the adapter does not introduce state or side-effects — adapters must be pure prop-mapping, < 30 lines)

```

---

## Batch 8 — Per-App Migration: Batch 3/4 — EXTEND or NEW

> **Branch:** `migrate-app/<APP_NAME>`
> **Run:** Once per component — repeat per component
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
3. Review adapter notes: `21-adapter-mapping.md`

## Guardrails (same as Batch 6/7 — non-negotiable)

ALLOWED:

- Updating usage site imports to `@repo/ui` (or adapter if prop API differs)
- Adapting props at usage sites to match the @repo/ui API via adapter pattern
- Deleting the local copy after all usage sites verified and gate passes

FORBIDDEN:

- Changing event handlers, data flows, or side effects at usage sites
- Removing any features, states, or variants the component had
- Changing text content, copy, error messages, ARIA labels, placeholder text
- Refactoring or cleaning up unrelated code in files you touch

## Parity Verification (all usage sites — all must be ✅)

- [ ] User interactions: click, hover, focus, keyboard — identical
- [ ] Loading / error / empty states — identical
- [ ] Form submit, validate, reset — identical
- [ ] ARIA labels and keyboard navigation — identical or improved (never removed)
- [ ] Visual output — identical (minor token-caused delta OK, document it)
- [ ] No new console or runtime errors

## Verification Gate

Read `<APP_PATH>/docs/migration/verification-gate.md` for exact commands.

- Typecheck, lint, build pass
- All smoke routes from `_parity-checklist.md` pass
- Behavioral parity confirmed

> Skills (if installed): `$next-best-practices` (validate RSC/client boundary is not broken after swap); `$next-cache-components` (if the swapped component wraps server-cached data — verify `use cache` / cacheTag usage is still correct); `$vercel-react-best-practices` (check for introduced waterfalls or bundle regressions after swap); `$agent-browser` (smoke route automation + visual parity screenshots); `$turborepo` (`--filter` correctness)

```

---

## Batch 9 — Per-App Stabilization (Phase 05 Batch 5)

> **Branch:** `migrate-app/<APP_NAME>`
> **Run:** Once per app — after ALL Batch 1–4 items are complete for this app
> **This clears the app for Phase 07 Cleanup**

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
Confirms zero regressions. Clears this app for Phase 07.

## Tasks

### 1. Full App Verification Gate

Read `<APP_PATH>/docs/migration/verification-gate.md` for exact commands.
Run ALL commands. Zero errors allowed.

### 2. Adapter Audit

For every adapter in `<APP_PATH>/src/components/ui/adapted/`:

- Is it still needed? (Has the upstream API gap been closed in @repo/ui?)
- Document adapter status in `_migration-log.md` under "Adapter Status"
- Flag adapters ready for deletion in `_migration-log.md` — will be processed in Phase 07

### 3. Parity Checklist Final Sign-Off

For every item in `_parity-checklist.md` still showing ⬜:

- Test in browser: interaction, keyboard nav, visual
- Mark as ✅ PASS or ❌ FAIL with evidence

### 4. Smoke Route Full Run

Navigate through every route in `verification-gate.md`:

- No UI regression
- No broken layouts
- No console errors (runtime or hydration)

### 5. Migration Log Finalization

- Mark all entries as Status: DONE or Status: DEFERRED
- Move DEFERRED items to "Post-Migration Improvement Candidates"
- Confirm every component has an entry

## Acceptance Criteria (ALL required before declaring Batch 9 done)

- [ ] All `_parity-checklist.md` items are ✅ PASS (or documented exception with justification)
- [ ] Zero TypeScript errors, lint errors, or build errors
- [ ] No unreviewed adapters remain
- [ ] `_migration-log.md` complete — no components missing status
- [ ] App cleared for Phase 07 Cleanup

Report: batch position, component counts DONE/DEFERRED, any adapters still active and why.

> Skills (if installed): `$agent-browser` (full smoke route run — automate browser navigation of ALL routes from verification-gate.md, capture screenshot evidence for parity checklist sign-off); `$web-design-guidelines` (audit final component usage in each smoke route against web interface guidelines — focus, semantics, ARIA); `$systematic-debugging` (if any parity checklist item is ❌ FAIL — trace root cause before attempting a fix); `$turborepo` (verify all `--filter` gate commands run correctly)

```

---

## Batch 10 — Cleanup & Deprecation (Phase 07)

> **Branch:** `migrate-app/<APP_NAME>` for app cleanup, then `feat/ui` for cross-app synthesis
> **Run:** Once per app (Phase 07 is per-app scope)
> **Prerequisite:** Batch 9 stabilization complete for this app

```

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read before starting:

- `<APP_PATH>/docs/migration/component/07-cleanup.md` (full spec)
- `<APP_PATH>/docs/migration/component/_output/_migration-log.md` (adapter status section)
- `<APP_PATH>/docs/migration/component/_output/_audit-report.md`

## Scope Note

This phase runs PER APP on `migrate-app/<APP_NAME>`.
Cross-app synthesis outputs (`30-cleanup-report.md`, `31-deprecation-map.md`) in packages/ui
are produced ONLY after ALL apps complete Phase 07, on `feat/ui`.

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

> Read **Phase 4** of `<APP_PATH>/docs/migration/component/07-cleanup.md` for the full spec,
> decision table, examples of legitimately app-owned deps, and the never-remove list.

**Principle:** The question is never "does another package already have this dep?" — it is
"does **this app's source code** directly import it?" If yes → keep. If no → investigate.

**Step 1 — Generate a direct-import count for every dep:**

```bash
node -e "
const pkg = require('./apps/<APP_NAME>/package.json');
const deps = Object.keys({...pkg.dependencies, ...pkg.devDependencies});
deps.forEach(d => process.stdout.write(d + '\n'));
" | while read dep; do
  count=$(rg "from ['\"]${dep}" apps/<APP_NAME>/src --type ts --type tsx -l 2>/dev/null | wc -l)
  echo "$count $dep"
done | sort -n
# Deps showing 0 = no direct imports found in src/ → candidates for Step 2 review
```

**Step 2 — For each dep showing `0` direct imports, confirm before removing:**

- Used in `next.config.ts`, `tailwind.config.ts`, or other root configs? → **KEEP**
- Is it a peer dep of another dep the app uses (e.g., `react`, `react-dom`)? → **KEEP**
- Is it a `devDependency` used during build/type-checking? → **KEEP** (unless underlying pkg is also being removed)
- Is it a `@repo/*` workspace package? → **KEEP** — always explicit, never rely on transitive linking
- Was it **only** imported inside local component files that are now deleted? → **REMOVE** (true orphan)
- Unclear why it's there? → **Investigate first. Do not remove.**

**Step 3 — Remove confirmed orphan deps only:**

```bash
pnpm --filter <APP_PACKAGE_NAME> remove <orphan-dep>
pnpm --filter <APP_PACKAGE_NAME> check-types   # must pass
pnpm --filter <APP_PACKAGE_NAME> build         # must pass
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
```

Document unused exports with rationale: DELETE | KEEP (another app will use) | DEPRECATE.

### 4. Run Verification Gate

Read `<APP_PATH>/docs/migration/verification-gate.md`.
Run typecheck, lint, build. Zero errors.

If any deps were removed, also confirm:

```bash
# Confirm removed dep is gone from direct deps
jq '.dependencies["<removed-dep>"]' apps/<APP_NAME>/package.json  # must be null
# Confirm it still resolves transitively (runtime still works)
pnpm --filter <APP_PACKAGE_NAME> list <removed-dep>
```

### 5. Create Per-App Cleanup Report

`<APP_PATH>/docs/migration/component/_output/_cleanup-report.md`:

- Components removed: [list with rationale]
- Adapters removed: [list with rationale]
- Remaining local components: [list with "reason kept app-local"]
- **Dependency audit:** [each dep → REMOVED (true orphan) / RETAINED (direct usage: \<files\>) / RETAINED (never-remove list)]
- Verification gate results

## Acceptance Criteria

- Zero replaced duplicates remain without documented reason
- Zero broken imports after removals
- Typecheck, lint, build all pass
- Every dep in `apps/<APP>/package.json` either has confirmed direct usage or is on the never-remove list
- Removed deps documented with proof of zero direct usage
- `_cleanup-report.md` created with dependency audit section

After ALL apps complete Batch 10:
Switch to `feat/ui` → create cross-app `30-cleanup-report.md` and `31-deprecation-map.md`.

> Skills (if installed): `$monorepo-workspace` (pnpm dep management: `--filter`, workspace packages, explicit ownership contract); `$turborepo` (filter-based grep approach for finding unused exports across apps; verify `pnpm --filter @repo/ui build` still passes after deletions)

```

---

## Batch 11 — Operational Standards (Phase 08)

> **Branch:** `feat/ui`
> **Run:** Once — after ALL apps complete Batch 10
> **This is the final phase of the migration**

```

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
After this phase, no more migration project is needed — new apps follow the playbook,
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

> Skills (if installed): `$design-system` (review SHARED_UI_ARCHITECTURE.md for accessibility standards coverage and token naming conventions); `$vercel-composition-patterns` (SHARED_UI_IMPLEMENTATION_GUIDE.md must document compound component patterns, context interface, and React 19 API conventions); `$web-design-guidelines` (run a compliance audit against the final SHARED_UI_CONTRIBUTING.md and SHARED_UI_OPERATIONAL_STANDARDS.md)

```

---

## Legacy Update Batches (L1–L6)

> **When to run:** Whenever the legacy repo has new commits to pull, at ANY point during Batches 0–10.
> **Safe stopping points:** Complete the current component before running L1. Never stop mid-migration.
> **Branch:** `migrate-app/<APP_NAME>`
> **Reference:** `<APP_PATH>/docs/migration/component/legacy-update-routines.md` (full Routine 1–6 details)
> `<APP_PATH>/docs/migration/component/legacy-update-integration-guide.md` (decision trees by batch position)

### Pause Protocol (before running L1)

```

If currently at an active migration step, complete the current component first.
Then document pause point in `_migration-plan.md`:

## Pause Record

- Current batch: <e.g., Batch 8 — DataTable>
- Component in progress: <ComponentName> — <last completed step>
- Status: ⏸️ Paused for legacy update
- Timestamp: <YYYY-MM-DD HH:MM>

Commit and push:
git add .
git commit -m "chore: pause Batch 8 migration for legacy update"
git push origin migrate-app/<APP_NAME>

Then run L1.

```

---

### L1 — Subtree Pull & Merge

```

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read: `<APP_PATH>/docs/migration/component/legacy-update-routines.md` Routines 1 and 2.

**Routine 1 — Subtree pull to integrate/<APP_NAME> (read-only mirror):**

1. git checkout integrate/<APP_NAME>
2. git subtree pull --prefix=<APP_PATH> <LEGACY_REMOTE> <LEGACY_BRANCH>
   Expected: clean merge — no conflicts (integrate/\* is read-only, 1:1 with legacy)
3. git push origin integrate/<APP_NAME>

**Routine 2 — Merge to migrate-app/<APP_NAME>:**

1. git checkout migrate-app/<APP_NAME>
2. git merge integrate/<APP_NAME>
3. If NO conflicts: push migrate-app/<APP_NAME> and report "Ready for L3"
4. If conflicts: STOP — list conflict files — proceed to L2

Do NOT make any code adjustments. Do NOT resolve conflicts yet.
Report outcome clearly: clean merge or conflict list.

```

---

### L2 — Resolve Conflicts (run only if L1 reports conflicts)

```

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read: `<APP_PATH>/docs/migration/component/legacy-update-routines.md` Routine 3.
Read: `<APP_PATH>/docs/migration/component/_output/_migration-log.md` to know which components have Status: DONE.

For each conflicted file, assign exactly one category and apply the resolution:

| Category               | Indicator                                             | Resolution                                                       |
| ---------------------- | ----------------------------------------------------- | ---------------------------------------------------------------- |
| Migrated component     | In migration-log.md Status=DONE; imports use @repo/ui | git checkout --ours <file>                                       |
| Non-migrated component | Not in migration-log.md; still uses local imports     | git checkout --theirs <file>                                     |
| In-progress batch item | In migration-log.md Status=IN PROGRESS                | Manual merge — keep our base, apply legacy additions only        |
| Shared infrastructure  | packages/config/**, packages/helper/**, tsconfig      | Manual merge — prefer ours, apply new additions                  |
| App configuration      | package.json, tailwind.config.\*, tsconfig.json       | Manual merge — apply new deps/settings, keep migration overrides |
| Static assets          | public/**, assets/**                                  | git checkout --theirs (unless intentionally replaced)            |

After resolving ALL conflicts:
git add .
git commit -m "chore: merge integrate/<APP_NAME> to migrate-app/<APP_NAME> — component conflict resolution"
git push origin migrate-app/<APP_NAME>

Report: each file, category, and resolution strategy used.

```

---

### L3 — Analyze Changes

```

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read: `<APP_PATH>/docs/migration/component/legacy-update-routines.md` Routine 4.
Read: `<APP_PATH>/docs/migration/component/06-component-standards.md` (classification rules).
Read: `<APP_PATH>/docs/migration/component/_output/_audit-report.md` (existing classifications).
Read: `<APP_PATH>/docs/migration/component/_output/_migration-log.md` (batch status).

**Step 1 — Identify what changed:**
git log integrate/<APP_NAME>~5..integrate/<APP_NAME> --oneline
git diff migrate-app/<APP_NAME>..integrate/<APP_NAME> --name-only

**Step 2 — Categorize each changed file:**

| Category                                   | Examples                                | Action                                           |
| ------------------------------------------ | --------------------------------------- | ------------------------------------------------ |
| New component file                         | New .tsx in src/components/             | Classify per 06-component-standards.md           |
| Existing component modified (non-migrated) | We haven't touched it                   | Already handled in L2                            |
| Existing component modified (migrated ⚠️)  | Legacy changed a component we own       | 🚨 Flag for review — may need packages/ui update |
| Config/dependency change                   | package.json, tsconfig, tailwind.config | List for L4                                      |
| Style/asset change                         | CSS, public/\*\*, images                | List for L4                                      |

**Step 3 — For each NEW component file, classify:**

- Is it purely visual (no API calls, no domain types)?
  YES → Used by 2+ apps → NEW_SHARED_COMPONENT or EXTEND_EXISTING → proceed to L5
  YES → Only this app → KEEP_APP_LOCAL → accept via L4
  NO → KEEP_APP_LOCAL → accept via L4

**Step 4 — Create update log:**
Create: `<APP_PATH>/docs/migration/component/legacy-updates/legacy-update-<YYYYMMDD-HHMMSS>.md`
Include: legacy commit SHA, changes by category, classification decisions, current batch position, recommended next step (L4 or L5).

Report all findings. Wait for confirmation before proceeding.

```

---

### L4 — Apply Non-Component Adjustments

> _Run when L3 has no NEW_SHARED_COMPONENT or EXTEND_EXISTING candidates (config, style, asset, KEEP_APP_LOCAL changes only)_

```

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read: `<APP_PATH>/docs/migration/component/legacy-update-routines.md` Routine 4.3 and 4.4.

Context from L3 (fill in before running):

- Config/dependency changes: <list-from-L3>
- Style/asset changes: <list-from-L3>
- New KEEP_APP_LOCAL components: <list-from-L3>

**Apply each:**

1. New dependencies in package.json → run `pnpm install`, verify no peer dependency conflicts
2. Tailwind config changes → apply, verify CSS variable contract still satisfied (06-component-standards.md Section 5), verify @repo/ui tokens still resolve
3. tsconfig / path alias changes → apply, run `pnpm --filter <APP_PACKAGE> check-types`
4. Global CSS changes → apply, ensure migration-specific tokens preserved
5. New KEEP_APP_LOCAL components:
   - Confirm conflict resolved with --theirs in L2
   - Add entry to `_audit-report.md` with class KEEP_APP_LOCAL
   - Add row to `_component-backlog.csv` with batch=N/A

Hard rules:

- Do NOT modify components with Status: DONE in migration-log.md
- Do NOT reintroduce local copies of migrated components

> Skills (if installed): `$turborepo` (`pnpm install` and `pnpm --filter <APP_PACKAGE> check-types` — ensure correct filter value from verification-gate.md)

Proceed to L6 after completing.

```

---

### L5 — Queue packages/ui Intake for New Legacy Components

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
3. Keep the legacy local file on migrate-app/<APP_NAME> — do NOT delete it yet
   (it will be deleted when packages/ui ships the extension and Batch 8 migration runs)
4. Add note in `_migration-log.md`: "<ComponentName> — waiting for packages/ui Batch 3 extension"

**For NEW_SHARED_COMPONENT:**

1. Document in `<APP_PATH>/docs/migration/component/_output/_per-app-baseline-summary.md`:
   - Full visual spec (props table, variants, states, accessibility)
2. Add row to `_component-backlog.csv` (batch=4)
3. Keep the legacy local file on migrate-app/<APP_NAME> — do NOT delete it yet
4. Add note in `_migration-log.md`: "<ComponentName> — waiting for packages/ui Batch 4 build"

**If this update occurs after Batch 9 cleanup (local files already deleted):**
Document in update log whether to:

- Wait for packages/ui to ship the component first (preferred)
- Or temporarily re-add the legacy local file until packages/ui ships (last resort)

IMPORTANT: Do NOT start packages/ui implementation here. This batch only queues intake.

Add entry to `legacy-update-<YYYYMMDD-HHMMSS>.md`. Proceed to L6.

> Skills (if installed): `$design-system` (read `SKILL.md` → `COMPONENTS.md` for accessibility requirements, keyboard patterns, focus states when writing the full visual spec for a NEW_SHARED_COMPONENT in \_per-app-baseline-summary.md); `$vercel-composition-patterns` (if the new candidate is a compound component — document compound API pattern in the spec to guide future Batch 5 implementation)

```

---

### L6 — Verify + Document

```

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read: `<APP_PATH>/docs/migration/component/legacy-update-routines.md` Routine 6.

**Step 1 — Read verification gate and run:**
Read `<APP_PATH>/docs/migration/verification-gate.md` for exact commands. Do NOT guess.

Run:

- `pnpm --filter <APP_PACKAGE> check-types`
- `pnpm --filter <APP_PACKAGE> lint`
- `pnpm --filter <APP_PACKAGE> build`

If packages/ui changes were made on feat/ui:

- `pnpm --filter @repo/ui check-types`
- `pnpm --filter @repo/ui build`

**Step 2 — Verify migrated component integrity:**
For every component in migration-log.md with Status=DONE:

- [ ] Import still resolves to @repo/ui (not reverted to local path)
- [ ] No local duplicate re-appeared from the merge
- [ ] Prop API at usage sites still compiles

**Step 3 — If verification fails:**

- Typecheck/lint errors: fix narrowly in the affected file, re-run gate
- Reverted migrated import: `git checkout HEAD <file>`, re-run gate
- Critical failure (cannot recover without risk):
  ```
  git reset --hard <commit-before-merge>
  git push -f origin migrate-app/<APP_NAME>
  ```
  Document rollback in update log and STOP. Notify team.

**Step 4 — Complete the update log:**
Fill in `legacy-update-<YYYYMMDD-HHMMSS>.md`:

- Final verification results (command outputs)
- Changes integrated summary
- Conflict resolution summary (if L2 was run)
- packages/ui intake items queued (if L5 was run)
- Current batch position
- Next steps (e.g., "Resume Batch 8 — continue with DataTable")

**Step 5 — Resume Protocol:**
Update `_migration-plan.md` Pause Record:

```
## Pause Record
- <Component>
- Status: ▶️ Resumed after legacy update
- Legacy update integrated: <timestamp>
- Affected components: <list or "none">
- New packages/ui intake items: <list or "none">
```

Report: verification gate results, components integrity check, next steps.

> Skills (if installed): `$agent-browser` (if a migrated component's smoke route needs post-merge parity verification — automate browser test to confirm no regression from the merge); `$systematic-debugging` (if verification fails post-merge — trace which layer broke before reverting); `$turborepo` (correct `--filter` for both app and @repo/ui gate commands)

```

---

## Scenario Quick Reference

| Scenario | Run these batches |
|---|---|
| Normal migration (no legacy updates) | 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 |
| Legacy update — clean merge, no new components | L1 → L3 → L4 → L6, then resume |
| Legacy update — conflicts, no new components | L1 → L2 → L3 → L4 → L6, then resume |
| Legacy update — clean merge, new KEEP_APP_LOCAL | L1 → L3 → L4 → L6, then resume |
| Legacy update — clean merge, new packages/ui candidate | L1 → L3 → L5 → L6, then resume |
| Legacy update — conflicts + new packages/ui candidate | L1 → L2 → L3 → L5 → L6, then resume |
| Legacy update — post-cleanup (Batch 9 done) + new packages/ui candidate now shipped | L1 → L3 → L5 → Batch 8 → L6 |

---

## Multi-App Usage

Batches 0, 1, 6, 7, 8, 9, 10 run **per app** on each app's `migrate-app/<app>` branch.
Batches 2, 3, 4, 5, 11 run **once** on `feat/ui`.
Legacy Batches L1–L6 run **per app** whenever the legacy repo updates.
```
