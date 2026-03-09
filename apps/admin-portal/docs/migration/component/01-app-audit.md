# 01 â€” Per-App Component Audit

> **Batch:** Batch 1 - Per-App Component Audit
> **Branch:** `migrate-app/<APP_NAME>` â€” run on EACH app's dedicated branch
> **Run count:** Once per app
> **Produces:** `_per-app-baseline-summary.md` (key handoff to Phase 02)
> **Prev:** [00-overview.md](./00-overview.md) Â· **Next (on feat/ui):** [02-design-system-foundation.md](./02-design-system-foundation.md)

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

> **If `packages/ui` is mid-build:** The `packages/ui/src/index.ts` on `feat/ui` may have components that are partially implemented (stories exist but the component may not compile). This is expected and safe â€” on `migrate-app/<APP_NAME>` you always see the **last merged, stable** state of `packages/ui`. The audit reads from this stable surface. Do NOT switch to `feat/ui` mid-audit. If you need to confirm whether a planned component exists, check `packages/ui/docs/normalization/_output/11-master-component-roadmap.md` (if it exists) rather than checking `packages/ui/src/`.

---

## Deliverables

| File                                                                                | Description                                                        |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/<APP_NAME>/docs/migration/component/_output/_audit-report.md`                 | Full classified component inventory                                |
| `apps/<APP_NAME>/docs/migration/component/_output/_spec-input.md`                   | Spec requirements for each component targeting `packages/ui`       |
| `apps/<APP_NAME>/docs/migration/component/_output/_component-backlog.csv`           | Machine-readable backlog for master plan aggregation               |
| `apps/<APP_NAME>/docs/migration/component/_output/_parity-checklist.md`             | Behavior parity requirements to preserve                           |
| **`apps/<APP_NAME>/docs/migration/component/_output/_per-app-baseline-summary.md`** | **KEY HANDOFF â€” self-contained one-pager for feat/ui aggregation** |

---

## Batch Prompt

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
3. Normalizes naming, variants, and props against shared standards (see [06-component-standards.md](./06-component-standards.md))
4. Prepares `_per-app-baseline-summary.md` for cross-app aggregation on `feat/ui`

## Required Discovery (full traversal, no shortcuts)

- `packages/ui/src/**` â€” current @repo/ui components, exports, prop APIs
- `packages/ui/package.json` â€” dependencies and capabilities
- `packages/config/**`, `packages/helper/**`, `packages/interface/**` â€” shared workspace packages (consumed by all packages and apps)
- `apps/<APP_NAME>/src/components/**`
- `apps/<APP_NAME>/src/views/**`
- `apps/<APP_NAME>/src/app/**`
- `apps/<APP_NAME>/src/hooks/**`
- All import statements across `apps/<APP_NAME>/src/**` referencing local UI
- `apps/<APP_NAME>/components.json` (if exists â€” shadcn config)
- `apps/<APP_NAME>/package.json` â€” UI dependencies in use
- **Bare native HTML elements** â€” scan for JSX files that return bare `div`, `span`, `section`, `article`, `main`, `aside`, `header`, `footer`, `ul`, `ol`, `li`, `p`, `h1`â€“`h6`, `strong`, `em` without routing them through a `@repo/ui` component. These are candidates for the Box pass (Batches 6-9).

## Component Classification Model (assign exactly ONE per component need)

| Class                  | Meaning                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| `ADOPT_NOW`            | Already in @repo/ui, zero changes needed â€” just swap import                |
| `ADOPT_WITH_ADAPTER`   | In @repo/ui but API mismatch â€” needs thin local adapter in app             |
| `EXTEND_EXISTING`      | In @repo/ui but missing variant/prop/size â€” extend in packages/ui          |
| `NEW_SHARED_COMPONENT` | Not in @repo/ui, used by this app, likely needed by others                 |
| `KEEP_APP_LOCAL`       | Business-specific â€” stays in app (forms, table configs, domain components) |

> **Universal SoC Evaluation (applies to ALL components):** After assigning any classification, always run the SoC Evaluation ([06-component-standards.md Â§6.2](./06-component-standards.md#62-universal-soc-evaluation)). For every component, record `Is monolith`, `SoC potential`, `SoC strategy`, and `Batch 1.5 candidate`. Do NOT skip this step â€” `NONE` is a valid and expected answer for non-monolith components. Components rated HIGH or MEDIUM are Batch 1.5 candidates and must NOT be assigned a migration batch yet. Their final classification is determined after Batch 1.5 splits them into Shell + Container.

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

- **Classification:** <CLASS> | MIGRATE_AFTER_SPLIT
- **Source:** `apps/<APP_NAME>/src/components/path/to/component.tsx`
- **@repo/ui equivalent:** `<ComponentName>` from `@repo/ui` | None
- **Used in:** [list of pages/views/hooks that use it]
- **Normalization delta:** [prop naming issues, variant naming, token gaps]
- **Behavior parity risks:** [what must not change]
- **Native element count:** [number of bare div/span/etc directly in this component's JSX â€” "0" if none]
- **Migration notes:** [what exactly needs to happen]
- **Is monolith:** YES | NO â† ALL components; required field
- **SoC potential:** HIGH | MEDIUM | LOW | NONE â† ALL components; required field
- **SoC strategy:** `<container-shell | prop-injection | render-prop | hook-extraction | none>` â€” [what becomes the Shell, what stays in Container] â† ALL components; required field
- **Batch 1.5 candidate:** YES | NO â† ALL components; YES only if SoC potential is HIGH or MEDIUM
- **Refactor potential:** HIGH | MEDIUM | LOW | NONE â† KEEP_APP_LOCAL only; omit for all other classifications
- **Refactor strategy:** `<container-shell | hook-extraction | prop-injection | none>` â€” [brief rationale] â† KEEP_APP_LOCAL only
- **Story group:** `Buttons` | `Inputs` | `Overlays` | `Feedback` | `Navigation` | `Data Display` | `Layout` | `Misc` â† NEW_SHARED_COMPONENT and EXTEND_EXISTING only

```

### Example Entries (realistic â€” do not copy verbatim)

#### Example 1 â€” `ADOPT_NOW`

```

### Button

- **Classification:** ADOPT_NOW
- **Source:** `apps/admin-portal/src/components/ui/button.tsx`
- **@repo/ui equivalent:** `Button` from `@repo/ui` â€” exact API match (variant, size, loading, leftIcon props all match)
- **Used in:** 34 files across `src/views/`, `src/app/`, `src/components/forms/`
- **Normalization delta:** None. Variant names (`default`, `destructive`, `outline`, `ghost`) already match @repo/ui convention
- **Behavior parity risks:** `loading` prop shows spinner + disables click â€” must be preserved
- **Migration notes:** Global find-replace `from '@/components/ui/button'` â†’ `from '@repo/ui'`. Delete `button.tsx` after all imports updated and typecheck passes.

```

#### Example 2 â€” `NEW_SHARED_COMPONENT`

```

### StatusBadge

- **Classification:** NEW_SHARED_COMPONENT
- **Source:** `apps/admin-portal/src/components/ui/status-badge.tsx`
- **@repo/ui equivalent:** None â€” closest is `Badge` from `@repo/ui` but StatusBadge adds policy-status color semantics not in Badge
- **Used in:** 12 files across `src/views/policies/`, `src/app/claims/`
- **Normalization delta:** Prop `status` uses domain strings (`"active"`, `"lapsed"`, `"pending"`) â€” needs to be abstracted to `variant` in @repo/ui version
- **Behavior parity risks:** Color mapping for status values is business-visible (red=lapsed, green=active, yellow=pending) â€” must be token-driven, not hardcoded
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
- **Visual spec:** [key visual requirements â€” no pixel-perfect needed]
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
1. **App overview** â€” tech stack, framework, UI library in use
2. **Component count summary** â€” total vs classified breakdown per class
3. **P0 critical needs** â€” what blocks this app's migration if missing from @repo/ui
4. **New shared components needed** â€” components this app needs that aren't in @repo/ui
5. **Extend existing needed** â€” components that need extension in @repo/ui
6. **Normalization deltas** â€” most critical naming/API inconsistencies found
7. **High-risk parity items** â€” the top 5 behaviors that must not regress
8. **Backlog CSV row count** â€” for aggregation verification
9. **SoC Evaluation Summary** â€” total Batch 1.5 candidates; breakdown by SoC potential (HIGH/MEDIUM/LOW/NONE); monolith count; projected NEW_SHARED_COMPONENT candidates from Batch 1.5 splits
10. **KEEP_APP_LOCAL refactor candidates** â€” KEEP_APP_LOCAL components rated HIGH or MEDIUM SoC potential; top 3 with SoC strategy and whether their Shell layer is a `packages/ui` candidate

> After Batch 1.5 or Phase 05A completes, append `## Batch 1.5 Amendment` or `## Phase 05A Amendment` section recording: components split, NEW_SHARED_COMPONENT candidates surfaced, and KEEP_APP_LOCAL-only Shells. Phase 02 cross-app reconciliation reads this amendment.

## Acceptance Criteria
- Every component import in `apps/<APP_NAME>/src/**` is accounted for (no unknowns)
- No component left with class `UNCLASSIFIED`
- `_per-app-baseline-summary.md` is self-contained: readable without the full audit
- Backlog CSV is valid (correct columns, no empty required fields)
- Parity checklist covers all `ADOPT_*` and `EXTEND_*` items
```

---

## Output File Locations

```
apps/<APP_NAME>/docs/migration/component/_output/
â”œâ”€â”€ _audit-report.md              â† Full classified inventory
â”œâ”€â”€ _spec-input.md                â† Spec requirements for packages/ui
â”œâ”€â”€ _component-backlog.csv        â† Machine-readable backlog
â”œâ”€â”€ _parity-checklist.md          â† Parity requirements
â””â”€â”€ _per-app-baseline-summary.md  â† KEY HANDOFF to Phase 02
```

---

## After Completing Phase 01

1. Commit all output files on `migrate-app/<APP_NAME>` branch
2. Copy `_per-app-baseline-summary.md` to `feat/ui` at:
   `packages/ui/docs/normalization/per-app/<APP_NAME>-baseline-summary.md`
3. Copy the rest of the app audit artifacts (`_audit-report.md`, `_spec-input.md`, `_component-backlog.csv`, `_parity-checklist.md`) to the matching app path on `feat/ui`:
   `apps/<APP_NAME>/docs/migration/component/_output/`
4. Repeat Phase 01 on each remaining `migrate-app/*` branch
5. When ALL apps are done -> switch to `feat/ui` -> run [Phase 02](./02-design-system-foundation.md)

---

> **Legacy update arrives during audit?** If a `git subtree pull` is needed mid-audit, see [`legacy-update-integration-guide.md`](./legacy-update-integration-guide.md) â€” specifically the "Before Batch 1" row in the risk table (lowest risk, simple integration).

_Related: [00-overview.md](./00-overview.md) Â· [06-component-standards.md](./06-component-standards.md) Â· [02-design-system-foundation.md](./02-design-system-foundation.md) Â· [legacy-update-integration-guide.md](./legacy-update-integration-guide.md)_
