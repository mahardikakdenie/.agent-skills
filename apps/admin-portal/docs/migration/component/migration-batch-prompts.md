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
| `$vercel-composition-patterns` | Building compound components, avoiding boolean prop proliferation, React 19 API changes                                                   |
| `$next-best-practices`         | RSC boundary placement, async APIs, `'use client'` / `'use server'`, App Router patterns                                                  |
| `$next-cache-components`       | Components that wrap cached server data (`use cache`, cacheLife, cacheTag, PPR)                                                           |
| `$turborepo`                   | Verification gate commands, `--filter` usage, pipeline task configuration, `pnpm` monorepo                                                |
| `$react-query`                 | Data fetching in migrated components: `useQuery`, `useMutation`, query key conventions, invalidation strategy                             |
| `$forms-validation`            | Form-heavy component migration: `react-hook-form` v7 + `zod` patterns, `@repo/ui` form component integration                              |
| `$agent-browser`               | Smoke route testing, visual parity validation, automated interaction verification                                                         |
| `$next-upgrade`                | Upgrading Next.js during migration setup or if version bump is required                                                                   |
| `$vercel-react-best-practices` | React/Next.js performance patterns - waterfalls, bundle size, re-renders, data fetching                                                   |
| `$systematic-debugging`        | When any verification gate fails - root cause first, no random fixes                                                                      |
| `$web-design-guidelines`       | Auditing UI code for web interface guidelines compliance (accessibility, semantics, focus)                                                |

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
```

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
```

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
> **Sections Section 1-5 above apply to ALL migration types** (service migration and component migration).
> **Sections Section 6-7 below apply to COMPONENT MIGRATION ONLY.** Service migration uses only Section 1-5 from this file.

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

```
apps/<APP_NAME>/docs/migration/component/_artifacts/smoke-routes/
+-- before/
|   +-- 01-<route-label>.png
|   +-- ... (one file per route above, numbered to match Section 5)
+-- after/
    +-- 01-<route-label>.png
    +-- ...
```

### Capture rules

- **Before** - taken from baseline state before migration patches are applied.
- **After** - taken after migration patches are applied and the build passes.
- **Naming** - zero-padded route number + kebab-case route label (e.g., `01-dashboard-transaction.png`).
- **Viewport** - 1440900, full-page screenshot.
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
| Visual parity     | yes | yes | - |
| Interaction parity| yes | yes | - |
| State parity      | yes | yes | - |
| Data/UI parity    | yes | yes | - |
| Result            | - | - | yes PASS |
| Intentional delta | - | - | none |
```

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

```

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read before starting:
- `<APP_PATH>/docs/migration/component/04-build-shared-components.md` (full SDD spec)
- `<APP_PATH>/docs/migration/component/06-component-standards.md` (Sections 1.4, 2, 4, 5, 6.4, 7, 8)
- `packages/ui/docs/normalization/_output/02-api-conventions.md`
- `packages/ui/docs/normalization/_output/03-token-theming-contract.md`
- `packages/ui/docs/normalization/_output/11-master-component-roadmap.md` (<COMPONENT_NAME> entry)
- Per-app `_output/_per-app-baseline-summary.md` files (for usage context)

## Objective

Build new shared component `<COMPONENT_NAME>` for packages/ui via SDD lifecycle.
Structure tier: [Simple | Standard | Complex - from roadmap]

The component cannot proceed past spec until `packages/ui/src/<COMPONENT_NAME>/<COMPONENT_NAME>.spec.md` exists in the target folder and captures the intended public API, states, and accessibility contract.
## Step 1 - Plan the Split

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
```

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
- Gate result: types yes | lint yes | build yes | smoke yes
- Caller grep: yes zero caller files changed
- packages/ui candidate: YES (<Shell name>, queued for Batches 4-5) | NO
```

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
   - Any two candidates sharing the same Radix primitive that differ by  2 props/slots MUST be merged into one entry
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
```

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

For each batch (1 through 6, plus explicit Batch 3A between Batch 3 and Batch 4):
- Scope description
- packages/ui work required
- Per-app work required
- Verification gate (exact commands)
- Apps  Components matrix

## Acceptance Criteria
- Master backlog has zero duplicate entries
- Every per-app backlog item maps to exactly one batch + master backlog row
- Batches ordered lowest -> highest risk
- Every batch has explicit verification gates
- Critical path identified

> Skills (if installed): `$monorepo-workspace` (workspace package names, --filter selectors, script names); `$turborepo` (verification gate commands in 13-implementation-batches.md must use correct `pnpm --filter` syntax)

Do NOT modify any apps. Commit to feat/ui when complete.
```

---

## Batch 3A - Token Foundation Bootstrap

> **Branch:** `feat/ui`
> **Run:** Once - immediately after Batch 3 complete, before Batch 4 or Batch 5 begins
> **Prerequisite:** Batch 3 outputs (`10-cross-app-reconciliation.md`, `11-master-component-roadmap.md`, `12-master-backlog.csv`, `13-implementation-batches.md`) exist and `03-token-theming-contract.md` is locked

```
You are a Principal Frontend Engineer on branch `feat/ui`.

Read before starting:
- `<APP_PATH>/docs/migration/component/04-build-shared-components.md` (full SDD spec)
- `<APP_PATH>/docs/migration/component/06-component-standards.md` (Sections 1.4, 2, 4, 5, 6.4, 7, 8)
- `packages/ui/docs/normalization/_output/02-api-conventions.md`
- `packages/ui/docs/normalization/_output/03-token-theming-contract.md`
- `packages/ui/docs/normalization/_output/11-master-component-roadmap.md` (<COMPONENT_NAME> entry)
- Per-app `_output/_per-app-baseline-summary.md` files (for usage context)

## Objective

Build new shared component `<COMPONENT_NAME>` for packages/ui via SDD lifecycle.
Structure tier: [Simple | Standard | Complex - from roadmap]

The component cannot proceed past spec until `packages/ui/src/<COMPONENT_NAME>/<COMPONENT_NAME>.spec.md` exists in the target folder and captures the intended public API, states, and accessibility contract.
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

> Skills (if installed): `$design-system` (read `SKILL.md` -> `COMPONENTS.md` for accessibility requirements, keyboard patterns, focus states, and ARIA role requirements for `<COMPONENT_NAME>`); `$vercel-composition-patterns` (if this is a compound component - validate API avoids boolean prop proliferation)

## Step 2 - Write Stories (`<COMPONENT_NAME>.stories.tsx`) - Storybook will error, this is intentional

Cover every story from the spec. RED state confirms spec is driving implementation.

## Step 3 - Implement

> Skills (if installed): `$monorepo-workspace` (package boundaries, cn() import, that @repo/ui must not import from apps or @repo/helper); `$vercel-composition-patterns` (compound components with sub-components and shared context); `$next-best-practices` (if component renders inside App Router pages - validate RSC vs client boundary placement); `$next-cache-components` (if this component wraps cached server data - apply `use cache` + cacheTag patterns); `$vercel-react-best-practices` (apply bundle, waterfall, and re-render optimizations during implementation); `$forms-validation` (if building a form-related component - Controller wiring, aria-invalid, error display conventions)

> MCPs (if available): use `shadcn MCP` to search registry for <COMPONENT_NAME> as baseline - then normalize (CSS variable tokens, forwardRef, CVA, `cn` from `'../../utils/cn'` internal import). Use `context7 MCP` for Radix primitive docs before writing component interface.

Special rules:
- Structural wrappers inside `packages/ui` must render through `Box` or `Box` with the `as` prop instead of bare `div`, `span`, `section`, `article`, `main`, `aside`, `header`, `footer`, `ul`, `ol`, `li`, or `p`
- Native elements are allowed only when the shared component itself is that semantic primitive (`input`, `textarea`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `img`, etc.) or when a Radix/browser primitive requires that underlying element
- DataTable / sortable component: MUST use `@tanstack/react-table` v8 (never react-table v7)
- Calendar / DatePicker: MUST use `react-day-picker` + `date-fns`

Make ALL Storybook stories render without errors (GREEN state).

## Step 4 - Export

Add to `packages/ui/src/<ComponentName>/index.ts` and `packages/ui/src/index.ts`.

## App-Agnostic Checklist (ALL must pass before PR)

### Implementation
- [ ] `packages/ui/src/<COMPONENT_NAME>/<COMPONENT_NAME>.spec.md` exists and matches the final API
- [ ] Component folder matches the required structure tier from `04-build-shared-components.md`
- [ ] `cn()` from `'../../utils/cn'` (internal - `import { cn } from '../../utils/cn'`)
- [ ] CVA for variants; `cn(variantClasses, className)` merge order correct
- [ ] CSS variable tokens only - no hardcoded hex/rgb/named colors
- [ ] Radix `data-[state=*]` selectors for interactive states
- [ ] `React.forwardRef` used; `displayName` set
- [ ] Structural wrappers use `Box` or `Box` with the `as` prop instead of bare layout HTML elements
- [ ] Native elements are used directly only for semantic primitives or Radix/browser-required markup
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
```

---

## Batch 6 - Per-App Migration: Batch 1 - ADOPT_NOW

> **Branch:** `migrate-app/<APP_NAME>`
> **Run:** Once per app
> **Prerequisite:** Batches 4-5 Batch 1 components confirmed in `packages/ui/src/index.ts`

```
You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read before starting:
- `<APP_PATH>/docs/migration/component/04-build-shared-components.md` (full SDD spec)
- `<APP_PATH>/docs/migration/component/06-component-standards.md` (Sections 1.4, 2, 4, 5, 6.4, 7, 8)
- `packages/ui/docs/normalization/_output/02-api-conventions.md`
- `packages/ui/docs/normalization/_output/03-token-theming-contract.md`
- `packages/ui/docs/normalization/_output/11-master-component-roadmap.md` (<COMPONENT_NAME> entry)
- Per-app `_output/_per-app-baseline-summary.md` files (for usage context)

## Objective

Build new shared component `<COMPONENT_NAME>` for packages/ui via SDD lifecycle.
Structure tier: [Simple | Standard | Complex - from roadmap]

The component cannot proceed past spec until `packages/ui/src/<COMPONENT_NAME>/<COMPONENT_NAME>.spec.md` exists in the target folder and captures the intended public API, states, and accessibility contract.
## Step 1 - Read and understand the original component

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
```

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
```

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
```

## Completion Criteria (ALL required before declaring Batch 9.5 done)

- [ ] All HIGH refactor potential components processed
- [ ] All MEDIUM refactor potential components processed (or documented skip with reason)
- [ ] Every processed component has a log entry in `_migration-log.md Section Batch 9.5`
- [ ] Every processed component passed: typecheck yes lint yes build yes smoke route yes
- [ ] `packages/ui` candidates listed (or "None found")
- [ ] Zero caller files changed (grep confirmed)

> Skills (if installed): `$vercel-composition-patterns` (validate Shell API avoids boolean prop proliferation and follows compound component conventions); `$next-best-practices` (verify Shell has no RSC/client boundary violations after refactor); `$systematic-debugging` (if typecheck fails after split - trace before fixing, do NOT revert blindly); `$turborepo` (correct --filter and pipeline usage for gate commands)

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
- `<APP_PATH>/docs/migration/component/04-build-shared-components.md` (full SDD spec)
- `<APP_PATH>/docs/migration/component/06-component-standards.md` (Sections 1.4, 2, 4, 5, 6.4, 7, 8)
- `packages/ui/docs/normalization/_output/02-api-conventions.md`
- `packages/ui/docs/normalization/_output/03-token-theming-contract.md`
- `packages/ui/docs/normalization/_output/11-master-component-roadmap.md` (<COMPONENT_NAME> entry)
- Per-app `_output/_per-app-baseline-summary.md` files (for usage context)

## Objective

Build new shared component `<COMPONENT_NAME>` for packages/ui via SDD lifecycle.
Structure tier: [Simple | Standard | Complex - from roadmap]

The component cannot proceed past spec until `packages/ui/src/<COMPONENT_NAME>/<COMPONENT_NAME>.spec.md` exists in the target folder and captures the intended public API, states, and accessibility contract.
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
```

**2. Decide based on usage count:**

| Usage count                             | Decision                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------- |
| 0 usages                                | Remove - confirmed dead dep                                               |
| Low (< threshold set in Batch 0.5 plan) | Migrate to replacement and remove                                         |
| High ( threshold)                      | Keep at current version; document as remaining tech debt with sprint plan |
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
```

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

```
## Deferred Dependency Resolution - <date>

### Items resolved from Batch 0.5 Deferred list:

| Package | Action taken | Files affected | Notes |
| ------- | ------------ | -------------- | ----- |
| [package] | REMOVED / MIGRATED / RETAINED | [files or "n/a"] | [reason or new sprint target] |

### Version Alignment Check (post-cleanup)
- react: [resolved version] yes
- tailwindcss: [resolved version] yes
- eslint-config-next: [version] matches next [version] yes

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

> Skills (if installed): `$design-system` (review SHARED_UI_ARCHITECTURE.md for accessibility standards coverage and token naming conventions); `$vercel-composition-patterns` (SHARED_UI_IMPLEMENTATION_GUIDE.md must document compound component patterns, context interface, and React 19 API conventions); `$web-design-guidelines` (run a compliance audit against the final SHARED_UI_CONTRIBUTING.md and SHARED_UI_OPERATIONAL_STANDARDS.md)

```

---

## Legacy Update Batches (L1-L6)

> **When to run:** Whenever the legacy repo has new commits to pull, at ANY point during Batches 0-10.
> **Safe stopping points:** Complete the current component before running L1. Never stop mid-migration.
> **Branch:** `migrate-app/<APP_NAME>`
> **Reference:** `<APP_PATH>/docs/migration/component/legacy-update-routines.md` (full Routine 1-6 details)
> `<APP_PATH>/docs/migration/component/legacy-update-integration-guide.md` (decision trees by batch position)

### Pause Protocol (before running L1)

```

If currently at an active migration step, complete the current component first.
Then document pause point in `_migration-log.md`:

## Pause Record

- Current batch: <e.g., Batch 8 - DataTable>
- Component in progress: <ComponentName> - <last completed step>
- Status:  Paused for legacy update
- Timestamp: <YYYY-MM-DD HH:MM>

Commit and push:
git add .
git commit -m "chore: pause Batch 8 migration for legacy update"
git push origin migrate-app/<APP_NAME>

Then run L1.

```

---

### L1 - Subtree Pull & Merge

```

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

```

---

### L2 - Resolve Conflicts (run only if L1 reports conflicts)

```

You are a Principal Frontend Engineer on branch `migrate-app/<APP_NAME>`.

Read: `<APP_PATH>/docs/migration/component/legacy-update-routines.md` Routine 3.
Read: `<APP_PATH>/docs/migration/component/_output/_migration-log.md` to know which components have Status: DONE.

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

```

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
| Existing component modified (migrated warning)  | Legacy changed a component we own       |  Flag for review - may need packages/ui update |
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

```

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

```

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

```

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
```
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

```

## Pause Record

- <Component>
- Status:  Resumed after legacy update
- Legacy update integrated: <timestamp>
- Affected components: <list or "none">
- New packages/ui intake items: <list or "none">

```

**Cross-Track Impact Review:**
If service migration (`migrate-app/<APP_NAME>` service track) is also in progress:

- Review the legacy update log for changes to endpoints, API types, or service contracts
- Assess whether those changes invalidate any in-progress service refactor work (audit.md / plan.md entries not yet implemented)
- If affected: document the impact and required adjustments in the legacy update log before resuming component migration

Report: verification gate results, components integrity check, next steps.

> Skills (if installed): `$agent-browser` (if a migrated component's smoke route needs post-merge parity verification - automate browser test to confirm no regression from the merge); `$systematic-debugging` (if verification fails post-merge - trace which layer broke before reverting); `$turborepo` (correct `--filter` for both app and @repo/ui gate commands)

```

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

```
