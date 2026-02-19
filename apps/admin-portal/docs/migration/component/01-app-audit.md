# 01 — Per-App Component Audit

> **Phase:** Audit
> **Branch:** `migrate-app/<APP_NAME>` — run on EACH app's dedicated branch
> **Run count:** Once per app
> **Produces:** `per-app-baseline-summary.md` (key handoff to Phase 02)
> **Prev:** [00-overview.md](./00-overview.md) · **Next (on feat/ui):** [02-design-system-foundation.md](./02-design-system-foundation.md)

---

## Purpose

Produce a comprehensive, classified inventory of every UI component in `apps/<APP_NAME>`. This is the source of truth for what the app needs from `packages/ui`. The output feeds directly into the cross-app reconciliation and master plan on `feat/ui`.

> **Why per-branch:** On `migrate-app/admin-portal`, only `apps/admin-portal` exists. You cannot see other apps. Every app must run this phase independently on its own branch.

---

## Prerequisites

- [ ] You are on branch `migrate-app/<APP_NAME>`
- [ ] `packages/ui` is accessible (it appears on all branches)
- [ ] `packages/*` (config, helper, interface, eslint-config, typescript-config) are accessible
- [ ] `packages/ui` is NOT currently in the middle of a Batch 3/4 build on `feat/ui`

> **If `packages/ui` is mid-build:** The `packages/ui/src/index.ts` on `feat/ui` may have components that are partially implemented (stories exist but the component may not compile). This is expected and safe — on `migrate-app/<APP_NAME>` you always see the **last merged, stable** state of `packages/ui`. The audit reads from this stable surface. Do NOT switch to `feat/ui` mid-audit. If you need to confirm whether a planned component exists, check `packages/ui/docs/normalization/_output/11-master-component-roadmap.md` (if it exists) rather than checking `packages/ui/src/`.

---

## Deliverables

| File                                                                                | Description                                                        |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/<APP_NAME>/docs/migration/component/_output/_audit-report.md`                 | Full classified component inventory                                |
| `apps/<APP_NAME>/docs/migration/component/_output/_spec-input.md`                   | Spec requirements for each component targeting `packages/ui`       |
| `apps/<APP_NAME>/docs/migration/component/_output/_component-backlog.csv`           | Machine-readable backlog for master plan aggregation               |
| `apps/<APP_NAME>/docs/migration/component/_output/_parity-checklist.md`             | Behavior parity requirements to preserve                           |
| **`apps/<APP_NAME>/docs/migration/component/_output/_per-app-baseline-summary.md`** | **KEY HANDOFF — self-contained one-pager for feat/ui aggregation** |

---

## Phase Prompt

Replace `<APP_NAME>` before running.

```md
You are a Principal Frontend Architect + Design System Auditor operating on branch `migrate-app/<APP_NAME>`.

## Context

- Branch: `migrate-app/<APP_NAME>`
- Only `apps/<APP_NAME>` is present in `apps/` on this branch.
- `packages/ui` (@repo/ui) and all `packages/*` are available.
- Do NOT assume other apps exist. Do NOT glob `apps/**`.

## Objective

Produce a complete, evidence-based component audit for `apps/<APP_NAME>` that:

1. Inventories every UI component in the app
2. Classifies each component against `@repo/ui` capabilities
3. Normalizes naming, variants, and props against enterprise standards (see [06-component-standards.md](./06-component-standards.md))
4. Prepares `per-app-baseline-summary.md` for cross-app aggregation on `feat/ui`

## Required Discovery (full traversal, no shortcuts)

- `packages/ui/src/**` — current @repo/ui components, exports, prop APIs
- `packages/ui/package.json` — dependencies and capabilities
- `packages/config/**`, `packages/helper/**`, `packages/interface/**` — shared workspace packages (consumed by all packages and apps)
- `apps/<APP_NAME>/src/components/**`
- `apps/<APP_NAME>/src/views/**`
- `apps/<APP_NAME>/src/app/**`
- `apps/<APP_NAME>/src/hooks/**`
- All import statements across `apps/<APP_NAME>/src/**` referencing local UI
- `apps/<APP_NAME>/components.json` (if exists — shadcn config)
- `apps/<APP_NAME>/package.json` — UI dependencies in use

## Component Classification Model (assign exactly ONE per component need)

| Class                  | Meaning                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| `ADOPT_NOW`            | Already in @repo/ui, zero changes needed — just swap import                |
| `ADOPT_WITH_ADAPTER`   | In @repo/ui but API mismatch — needs thin local adapter in app             |
| `EXTEND_EXISTING`      | In @repo/ui but missing variant/prop/size — extend in packages/ui          |
| `NEW_SHARED_COMPONENT` | Not in @repo/ui, used by this app, likely needed by others                 |
| `KEEP_APP_LOCAL`       | Business-specific — stays in app (forms, table configs, domain components) |

## Normalization Requirements

For each component, evaluate against [06-component-standards.md](./06-component-standards.md):

- Is the prop API consistent with naming conventions?
- Is the variant naming consistent (size: `sm/md/lg`, not `small/medium/large`)?
- Does it use CSS variables / design tokens or hardcoded values?
- Does it duplicate a @repo/ui component but with different prop names?
- Does it import from `next/*` that must be abstracted for sharing?

## Required Output: `_output/_audit-report.md`

For each component, document:
```

### ComponentName

- **Classification:** <CLASS>
- **Source:** `apps/<APP_NAME>/src/components/path/to/component.tsx`
- **@repo/ui equivalent:** `<ComponentName>` from `@repo/ui` | None
- **Used in:** [list of pages/views/hooks that use it]
- **Normalization delta:** [prop naming issues, variant naming, token gaps]
- **Behavior parity risks:** [what must not change]
- **Migration notes:** [what exactly needs to happen]

```

### Example Entries (realistic — do not copy verbatim)

#### Example 1 — `ADOPT_NOW`

```

### Button

- **Classification:** ADOPT_NOW
- **Source:** `apps/admin-portal/src/components/ui/button.tsx`
- **@repo/ui equivalent:** `Button` from `@repo/ui` — exact API match (variant, size, loading, leftIcon props all match)
- **Used in:** 34 files across `src/views/`, `src/app/`, `src/components/forms/`
- **Normalization delta:** None. Variant names (`default`, `destructive`, `outline`, `ghost`) already match @repo/ui convention
- **Behavior parity risks:** `loading` prop shows spinner + disables click — must be preserved
- **Migration notes:** Global find-replace `from '@/components/ui/button'` → `from '@repo/ui'`. Delete `button.tsx` after all imports updated and typecheck passes.

```

#### Example 2 — `NEW_SHARED_COMPONENT`

```

### StatusBadge

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `apps/admin-portal/src/components/ui/status-badge.tsx`
- **@repo/ui equivalent:** None — closest is `Badge` from `@repo/ui` but StatusBadge adds policy-status color semantics not in Badge
- **Used in:** 12 files across `src/views/policies/`, `src/app/claims/`
- **Normalization delta:** Prop `status` uses domain strings (`"active"`, `"lapsed"`, `"pending"`) — needs to be abstracted to `variant` in @repo/ui version
- **Behavior parity risks:** Color mapping for status values is business-visible (red=lapsed, green=active, yellow=pending) — must be token-driven, not hardcoded
- **Migration notes:** Build `StatusBadge` in `packages/ui` (Phase 04 Batch 4). Keep local copy until packages/ui ships it. Domain status-to-variant mapping stays in the app layer as an adapter.

```

## Required Output: `_output/_component-backlog.csv`
Columns:
```

app_name,component_name,classification,priority,risk_level,source_path,repo_ui_equivalent,migration_effort,parity_risk

```

Priority: P0 (critical path) / P1 (important) / P2 (nice to have) / P3 (low urgency)
Risk: HIGH / MEDIUM / LOW
Effort: XS / S / M / L / XL

## Required Output: `_output/_spec-input.md`
For each `NEW_SHARED_COMPONENT` or `EXTEND_EXISTING`:
```

### ComponentName

- **API Intent:** [what props/variants/sizes it needs in @repo/ui]
- **Visual spec:** [key visual requirements — no pixel-perfect needed]
- **Accessibility:** [ARIA, keyboard, focus requirements]
- **Variants needed:** [list]
- **States needed:** [default, hover, focus, disabled, loading, error]
- **Framework constraints:** [must NOT use next/*, etc.]
- **Consumer usage example:**
  <ComponentName variant="..." size="..." />

```

## Required Output: `_output/_parity-checklist.md`
For each component to be migrated:
```

- [ ] ComponentName: [specific behavior that must be preserved]
- [ ] ComponentName: [specific event/interaction that must remain]

```

## Required Output: `_output/_per-app-baseline-summary.md` (KEY HANDOFF ARTIFACT)
A fully self-contained one-page summary. Must include:
1. **App overview** — tech stack, framework, UI library in use
2. **Component count summary** — total vs classified breakdown per class
3. **P0 critical needs** — what blocks this app's migration if missing from @repo/ui
4. **New shared components needed** — components this app needs that aren't in @repo/ui
5. **Extend existing needed** — components that need extension in @repo/ui
6. **Normalization deltas** — most critical naming/API inconsistencies found
7. **High-risk parity items** — the top 5 behaviors that must not regress
8. **Backlog CSV row count** — for aggregation verification

## Acceptance Criteria
- Every component import in `apps/<APP_NAME>/src/**` is accounted for (no unknowns)
- No component left with class `UNCLASSIFIED`
- `per-app-baseline-summary.md` is self-contained: readable without the full audit
- Backlog CSV is valid (correct columns, no empty required fields)
- Parity checklist covers all `ADOPT_*` and `EXTEND_*` items
```

---

## Output File Locations

```
apps/<APP_NAME>/docs/migration/component/_output/
├── _audit-report.md              ← Full classified inventory
├── _spec-input.md                ← Spec requirements for packages/ui
├── _component-backlog.csv        ← Machine-readable backlog
├── _parity-checklist.md          ← Parity requirements
└── _per-app-baseline-summary.md  ← KEY HANDOFF to Phase 02
```

---

## After Completing Phase 01

1. Commit all output files on `migrate-app/<APP_NAME>` branch
2. Copy `per-app-baseline-summary.md` to `feat/ui` branch at:
   `packages/ui/docs/normalization/per-app/<APP_NAME>-baseline-summary.md`
3. Repeat Phase 01 on each remaining `migrate-app/*` branch
4. When ALL apps are done → switch to `feat/ui` → run [Phase 02](./02-design-system-foundation.md)

---

> **Legacy update arrives during audit?** If a `git subtree pull` is needed mid-audit, see [`legacy-update-integration-guide.md`](./legacy-update-integration-guide.md) — specifically the "Before Batch 1" row in the risk table (lowest risk, simple integration).

_Related: [00-overview.md](./00-overview.md) · [06-component-standards.md](./06-component-standards.md) · [02-design-system-foundation.md](./02-design-system-foundation.md) · [legacy-update-integration-guide.md](./legacy-update-integration-guide.md)_
