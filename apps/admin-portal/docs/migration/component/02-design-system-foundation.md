# 02 â€” Design System Foundation

> **Batch:** Batch 2 - Design System Foundation
> **Branch:** `feat/ui` â€” run ONCE after ALL apps have completed Phase 01
> **Run count:** Once
> **Prerequisite:** All `_per-app-baseline-summary.md` files copied from each `migrate-app/*` branch to `packages/ui/docs/normalization/per-app/`
> **Prev:** [01-app-audit.md](./01-app-audit.md) Â· **Next:** [03-migration-plan.md](./03-migration-plan.md)

---

## Purpose

Establish the governing foundation for `packages/ui` â€” the single design system authority for all apps. This foundation is the **constitution**: once locked, all Phase 03 (implementation) and Phase 04 (migration) work must conform to it. Deviations require a foundation amendment PR.

> **Why on feat/ui:** This is where `packages/ui` development lives. The foundation is committed here and becomes the reference for all subsequent package development.

---

## Prerequisites Checklist

Before running the Phase 02 prompt, verify:

- [ ] You are on branch `feat/ui`
- [ ] All `migrate-app/*` Phase 01 audits are complete
- [ ] All `_per-app-baseline-summary.md` files are present at:
      `packages/ui/docs/normalization/per-app/<APP_NAME>-baseline-summary.md`
- [ ] [06-component-standards.md](./06-component-standards.md) has been reviewed and is accessible

---

## Deliverables

| File                                                                    | Description                                                |
| ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| `packages/ui/docs/normalization/_output/00-foundation.md`               | Governing principles and mandatory decisions               |
| `packages/ui/docs/normalization/_output/01-component-taxonomy.md`       | Complete component taxonomy (all tiers, all apps)          |
| `packages/ui/docs/normalization/_output/02-api-conventions.md`          | Canonical prop API, naming, and slot contracts             |
| `packages/ui/docs/normalization/_output/03-token-theming-contract.md`   | CSS variable system, forbidden hardcoding rules            |
| `packages/ui/docs/normalization/_output/04-shared-vs-local-boundary.md` | Decision framework with app-specific examples              |
| `packages/ui/docs/normalization/_output/05-coverage-baseline.md`        | packages/ui current coverage vs all-app needs gap          |
| `packages/ui/docs/normalization/_output/06-risk-register.md`            | High-risk components, migration edge cases, rollback notes |

---

## Batch Prompt

```md
You are a Principal Design System Architect operating on branch `feat/ui`.

## Context

- Branch: `feat/ui` â€” packages/ui development only
- Per-app baseline summaries from all migrate-app/\* branches are available at:
  `packages/ui/docs/normalization/per-app/`
- Current packages/ui state: `packages/ui/src/**`
- Shared workspace packages (consumed by all `packages/*` and `apps/*`): `packages/config/`, `packages/helper/`, `packages/interface/`
- Normalization reference: [06-component-standards.md](./06-component-standards.md)

## Objective

Using ALL per-app baseline summaries as simultaneous inputs, produce the
governing foundation that defines how packages/ui will be built and maintained
across the entire 28-app workspace.

## Inputs (all must be read before producing outputs)

1. ALL files in `packages/ui/docs/normalization/per-app/*_baseline-summary.md`
2. `packages/ui/src/**` â€” current state of @repo/ui
3. `packages/ui/package.json` â€” current dependencies
4. `packages/config/**`, `packages/helper/**`, `packages/interface/**` â€” shared workspace packages (types, tokens, utilities consumed by all packages and apps)

If any per-app summary is missing: list missing apps and STOP.

## Cross-App Reconciliation (mandatory before writing outputs)

Before writing any foundation doc, perform full cross-app analysis:

1. **Component union** â€” union all `NEW_SHARED_COMPONENT` needs across all apps
   - If 2+ apps need the same component: it's a confirmed packages/ui candidate
   - If only 1 app needs it: evaluate per shared-vs-local rules
2. **API conflict resolution** â€” where apps use the same component differently, define ONE canonical API
3. **Normalization delta aggregation** â€” identify most common naming/variant inconsistencies
4. **Dependency gap analysis** â€” what additional packages does packages/ui need to install?
5. **Shared packages assessment** â€” can `packages/config`, `packages/helper`, `packages/interface` be extended to serve packages/ui or other workspace consumers better? These packages are shared across all `packages/*` and `apps/*` â€” changes to them affect the entire workspace.

### API Naming Conflict Resolution Algorithm

When two or more apps use the same component with conflicting prop names (e.g., App A uses `kind="primary"`, App B uses `variant="default"`), apply this algorithm before writing `02-api-conventions.md`:
```

For each conflicting prop name across apps:

1. Check 06-component-standards.md Section 2 (Prop Naming Conventions)
   - Does the standard define a canonical name for this type of prop? â†’ USE IT regardless of what apps use today.
   - e.g., Standards say `variant` not `type` or `kind` â†’ canonical = `variant`

2. If no standard exists for this prop type:
   a. Count app occurrences: which name is used by more apps?
   b. Prefer the name that requires fewer usage-site changes (lower migration effort)
   c. Prefer the more expressive / semantic name if counts are equal

3. Document the ruling in 02-api-conventions.md:

   ### ComponentName
   - Canonical prop: `variant` (maps from: `kind` in admin-portal, `type` in affiliate-portal)
   - Apps using non-canonical name: [list] â€” these need ADOPT_WITH_ADAPTER classification

4. For each app using the non-canonical name:
   - Upgrade their classification from ADOPT_NOW â†’ ADOPT_WITH_ADAPTER
   - Document the adapter mapping in `packages/ui/docs/normalization/_output/21-adapter-mapping.md`

```

> **Breaking change rule within this phase:** Once `02-api-conventions.md` is committed and Phase 03 begins, changing a canonical prop name is a **breaking change** requiring a Foundation Amendment PR and version bump.

## Required Output: `00-foundation.md`

Document all mandatory decisions, including:

- App-agnostic principle and what it means in practice
- Which internal packages can be consumed by packages/ui and how
- Storybook mandate (all components must have stories)
- Spec-first mandate (all components must have spec docs before implementation)
- Breaking change policy (semantic versioning within workspace)
- Review gates for new components
- Accessibility minimum bar

## Required Output: `01-component-taxonomy.md`

Full component taxonomy across all apps:

- Tier 1 (Primitives): with @repo/ui status (âœ… exists / âŒ missing)
- Tier 2 (Composites): with @repo/ui status
- Tier 3 (App-local only): with reason kept app-local
- Cross-app frequency table (how many apps need each missing component)

## Required Output: `02-api-conventions.md`

For EACH component (existing and planned):

- Canonical prop interface (TypeScript signature)
- Variant names (resolved across all apps' conflicting usage)
- Size names (resolved)
- Event handler signatures
- Slot prop names
- Ref forwarding requirement (yes/no)

## Required Output: `03-token-theming-contract.md`

- **Token Naming Contract** (shadcn-style semantic tokens):
  - Colors: `--primary`, `--primary-foreground`, `--muted`, `--muted-foreground`
  - Radius: `--radius`
  - Charting: `--chart-1` through `--chart-5`
- **Required CSS variables** (every token packages/ui components depend on)
- How apps must configure their global consumer (globals.css)
- Forbidden hardcoded values list (no `rbg()`, no hex, no `!important`)
- Dark mode strategy (class vs data-attribute)

## Required Output: `04-shared-vs-local-boundary.md`

- Decision tree (specific to this workspace's patterns)
- **Zombie Code Policy:**
  - **Dead Code:** Local component replaced by `@repo/ui` AND not used anywhere? â†’ DELETE immediately.
  - **Zombie Code:** Local component used in 1-2 obscure places? â†’ Mark `@deprecated`, schedule cleanup.
  - **Divergent Code:** Local component highly coupled to app domain? â†’ Keep as `app/components/local/*`.
- Per-category rulings from the cross-app analysis

## Required Output: `05-coverage-baseline.md`

Table format:
```

| Component | Tier | @repo/ui | Apps Needing | Priority | Phase 3 Batch |

```
Summarize current gap: N components needed, M already exist, X need to be built.

## Required Output: `06-risk-register.md`
For each high-risk migration:
- Component name
- Risk: behavior divergence / API mismatch / visual regression
- Affected apps
- Mitigation strategy
- Rollback plan

## Acceptance Criteria
- Foundation can be understood by any developer without knowing prior context
- Every per-app baseline need is addressed (extracted to `packages/ui` or ruled app-local)
- API conventions eliminate all naming conflicts identified in per-app audits
- Coverage baseline gives a clear numeric picture of the gap
- Risk register covers every HIGH-risk item from per-app parity checklists

### What constitutes a "breaking change" at the Foundation Phase

At Phase 02, no code has been written yet â€” but decisions made here become breaking later. A **breaking change** at this phase is any ruling in `02-api-conventions.md` or `00-foundation.md` that, if reversed after Phase 03 begins, would require modifying already-committed `packages/ui` component code or already-updated app import sites.

| Decision | Breaking if reversed after Phase 03 starts |
| -------- | ------------------------------------------- |
| Canonical prop name (e.g., `variant` vs `type`) | âœ… Breaking â€” all built components reference it |
| Canonical variant value (e.g., `"default"` vs `"primary"`) | âœ… Breaking â€” CVA definitions use it |
| Tier assignment (Tier 1 vs Tier 2) | âœ… Breaking â€” affects file structure and exports |
| Shared-vs-local boundary ruling | âš ï¸ Partially breaking â€” changes which apps need adapters |
| Token name (e.g., `--primary` vs `--brand`) | âœ… Breaking â€” every component's CSS uses it |
| Accessibility minimum bar (e.g., WCAG AA vs AAA) | âš ï¸ Non-breaking â€” can be upgraded without changing API |

> **Rule:** Any change to the first four rows above, once Phase 03 has started, requires a **Foundation Amendment PR** reviewed and approved by at least 2 app team leads before the change is merged to `feat/ui`.

---

## After Completing Phase 02

1. Commit all normalization docs to `feat/ui`
2. Review foundation with team before proceeding to Phase 03
3. Distribute `02-api-conventions.md` to app teams as their implementation reference
4. Proceed to [03-migration-plan.md](./03-migration-plan.md) â†’ [04-build-shared-components.md](./04-build-shared-components.md)

---

_Related: [01-app-audit.md](./01-app-audit.md) Â· [06-component-standards.md](./06-component-standards.md) Â· [03-migration-plan.md](./03-migration-plan.md)_
```
