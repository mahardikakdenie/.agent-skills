# 08 — Operational Standards & Ongoing Maintenance

> **Phase:** Operational Standards
> **Branch:** `feat/ui`
> **Run count:** Once — after Phase 07 cleanup complete
> **Prerequisite:** Phase 07 cleanup report and deprecation map exist
> **Prev:** [07-cleanup.md](./07-cleanup.md) · **Final phase**

---

## Purpose

Convert all migration outcomes into permanent operating documentation that standardizes how `packages/ui` grows and how future apps are onboarded. The output of this phase eliminates the need for another migration project — new apps follow the playbook, new components follow the intake process.

---

## Deliverables

| File                                                  | Description                                                              |
| ----------------------------------------------------- | ------------------------------------------------------------------------ |
| `packages/ui/docs/SHARED_UI_ARCHITECTURE.md`          | Component taxonomy, dependency graph, app-agnostic contract              |
| `packages/ui/docs/SHARED_UI_IMPLEMENTATION_GUIDE.md`  | How to add new components (SDD lifecycle, spec + story templates)        |
| `packages/ui/docs/SHARED_UI_MIGRATION_PLAYBOOK.md`    | How to onboard a new app to `@repo/ui`                                   |
| `packages/ui/docs/SHARED_UI_OPERATIONAL_STANDARDS.md` | Intake criteria, review gates, versioning, ownership, deprecation policy |
| `packages/ui/docs/SHARED_UI_CONTRIBUTING.md`          | "How to fix a bug" guide for app developers                              |
| `packages/ui/docs/SHARED_UI_CHANGELOG.md`             | Seeded from `20-foundation-change-log.md`                                |

---

## Document Structure Templates

The AI executing Batch 11 must produce documents conforming to these structures. These are skeleton headers — expand each section using the migration inputs listed in the Phase Prompt.

### `SHARED_UI_ARCHITECTURE.md` skeleton

```markdown
# @repo/ui Architecture

## Overview

## Component Taxonomy (Tier 1 / 2 / 3)

## App-Agnostic Contract

## Dependency Graph

## CSS Variable Contract

## Composition Patterns

## Framework Constraints
```

### `SHARED_UI_IMPLEMENTATION_GUIDE.md` skeleton

```markdown
# Adding a New Component to @repo/ui

## Request Intake (RFC Process)

## SDD Lifecycle

## Spec Template

## Story Template

## Implementation Checklist

## PR Checklist

## Export Guide
```

### `SHARED_UI_MIGRATION_PLAYBOOK.md` skeleton

```markdown
# Onboarding a New App to @repo/ui

## Prerequisites

## Step 1 — Audit Your App's Components

## Step 2 — Classify Components

## Step 3 — Import Swaps (ADOPT_NOW)

## Step 4 — Adapter Wrappers (ADOPT_WITH_ADAPTER)

## Step 5 — Verification Gate

## Step 6 — Cleanup

## Rollback Procedure
```

### `SHARED_UI_OPERATIONAL_STANDARDS.md` skeleton

```markdown
# @repo/ui Operational Standards

## Intake Criteria

## Review Gates

## Versioning Policy

## Ownership Model

## Deprecation Policy

## Breaking Change Policy

## Incident Protocol
```

### `SHARED_UI_CONTRIBUTING.md` skeleton

```markdown
# Contributing to @repo/ui

## How to Report a Bug

## How to Fix a Bug (Step-by-Step)

## How to Propose a New Component

## Development Setup

## Running Storybook Locally

## PR Requirements

## Common Pitfalls
```

### `SHARED_UI_CHANGELOG.md` skeleton

```markdown
# @repo/ui Changelog

## [Unreleased]

## [1.0.0] — <migration completion date>

### Added

### Changed

### Deprecated

### Removed

### Notes
```

---

## Phase Prompt

```md
You are a Principal Engineering Documentation Lead on branch `feat/ui`.

## Objective

Convert all migration outcomes into permanent, durable documentation and
operational standards so that future development stays consistent without requiring another
enterprise migration project.

## Inputs (all must be read)

- `packages/ui/docs/normalization/_output/00-foundation.md` through `06-risk-register.md`
- `packages/ui/docs/normalization/_output/10-cross-app-reconciliation.md`
- `packages/ui/docs/normalization/_output/11-master-component-roadmap.md`
- `packages/ui/docs/normalization/_output/20-foundation-change-log.md`
- `packages/ui/docs/normalization/_output/21-adapter-mapping.md`
- `packages/ui/docs/normalization/_output/30-cleanup-report.md`
- `packages/ui/docs/normalization/_output/31-deprecation-map.md`
- `packages/ui/src/index.ts` (final component API surface)

## Required Output: `packages/ui/docs/SHARED_UI_ARCHITECTURE.md`

Document the stable architecture:

1. **Component library overview** — purpose, scope, consumer apps
2. **Component taxonomy** (Tier 1 / 2 / 3) — final post-migration state
3. **App-agnostic contract** — what packages/ui guarantees and what it explicitly does not do
4. **Dependency graph** — which Radix primitives, which internal packages/
5. **CSS variable contract** — required tokens apps must define
6. **Composition patterns** — slot pattern, render prop pattern, CVA variant pattern
7. **Framework constraints** — why no Next.js, how apps handle Next.js specifics (adapter pattern)

## Required Output: `packages/ui/docs/SHARED_UI_IMPLEMENTATION_GUIDE.md`

Step-by-step guide for adding a new component to packages/ui:

1. **Request intake** — how to propose a new component (spec-first RFC process)
2. **SDD lifecycle** — SPEC → STORY → REVIEW → BUILD → VALIDATE → EXPORT
3. **Spec template** — full ComponentName.spec.md template
4. **Story template** — full ComponentName.stories.tsx template
5. **Implementation checklist** — app-agnostic checklist (from [06-component-standards.md](./06-component-standards.md))
6. **PR checklist** — what reviewers check before merging
7. **Export guide** — how to add to index.ts correctly

## Required Output: `packages/ui/docs/SHARED_UI_MIGRATION_PLAYBOOK.md`

Step-by-step playbook for onboarding a new app to @repo/ui.
Any team should be able to follow this without agent assistance:

1. **Setup** — add `@repo/ui` to app's package.json, configure globals.css tokens
2. **Phase 01 audit** — run per-app baseline audit (link to [01-app-audit.md](./01-app-audit.md))
3. **Contribute baseline** — how to hand off per-app-baseline-summary.md to feat/ui
4. **Wait for master plan** — what happens on feat/ui (reference Phase 02-03)
5. **Execute migration** — follow batch plan (link to [05-app-migration.md](./05-app-migration.md))
6. **Verification** — per-batch verification gate checklist
7. **Cleanup** — what to clean up locally

## Required Output: `packages/ui/docs/SHARED_UI_OPERATIONAL_STANDARDS.md`

Formal operational standards:

### Component Intake Process

- How to request a new shared component
- Required: spec doc (RFC format), cross-app use case evidence
- Review: 2 frontend leads must approve spec before implementation begins
- Priority classification process (P0-P3)

### Modification Process

- How to propose extending an existing component (new variant/prop)
- Required: spec amendment PR
- Required: no breaking changes without major version bump in CHANGELOG.md

### Breaking Change Protocol (The "Deprecate-Warn-Remove" Cycle)

Breaking changes in `@repo/ui` are expensive (28 apps affected). We follow a strict 3-phase cycle:

1. **Phase 1: Soft Deprecation (Minor Bump)**
   - Add new prop/variant/component.
   - Mark old prop as `@deprecated` in TSDoc with message: "Use `newProp` instead. Will be removed in v2.0.0".
   - `console.warn` in development mode if deprecated path is used.
   - **Apps:** Can upgrade freely; receive warning but no breakage.

2. **Phase 2: Hard Deprecation (Major Bump)**
   - **Action:** Remove the deprecated code.
   - **Versioning:** Must bump `packages/ui` major version (e.g., 1.x → 2.0).
   - **Migration Guide:** Pull Request must include a `MIGRATION_GUIDE.md` entry.
   - **Codemod:** (Optional but recommended) `jscodeshift` script to auto-fix consumers.

3. **Phase 3: App Migration Window (2 Sprints)**
   - Apps pin to v1.x until they schedule migration work.
   - Platform team supports v1.x for 2 sprints (critical security patches only).
   - After 2 sprints, v1.x support ends.

### Versioning Strategy

We use **Fixed Mode** versioning for the workspace (recommended for consistency).

- All `packages/*` and `apps/*` share a single version source of truth.
- Reason: Avoids "dependency hell" where App A uses Button v1 and App B uses Button v2.
- **Rule:** When `packages/ui` has a breaking change, the entire monorepo workspace version bumps major.
- **Benefits:**
  - Single `git tag` for releases.
  - Simplified CI/CD pipeline (one release workflow).
  - Clear compatibility matrix (Workspace v2.0 works with itself).

### Hotfix Workflow (Emergency Patches)

If a critical bug is found in `@repo/ui` (e.g., a11y regression or crash):

1. **Branch:** Create `hotfix/ui-patch-description` from `main`.
2. **Fix:** Apply minimal fix (no features, no refactors).
3. **Verify:** Run affected app tests via `turbo run test --filter=...@repo/ui`.
4. **Release:** Bump patch version (1.0.0 → 1.0.1).
5. **Propagate:** Apps automatically pick up non-breaking patch on next install (due to workspace protocol).

### Ownership Model
```

packages/ui: owned by UI Platform team

- Any PR touching packages/ui/src/\*\* requires review from designated UI maintainer
- UI maintainer list: [to be populated by team]

apps/\*: owned by respective app team

- App teams own their migration pace (within platform timelines)
- App teams own app-local components (domain forms, table configs)

````

### Adapter Pattern Policy
- App-local adapters are allowed but must be documented
- Adapters should push API alignment proposals to packages/ui (don't just adapt forever)
- Adapters must be reviewed quarterly and removed when no longer needed

### Visual Change Budget
- Spacing/layout improvements: allowed without approval
- Color changes: requires design sign-off
- Component restructure: requires spec amendment + design sign-off
- Full visual redesign: treated as new component intake

### Migration Tooling Specification (For Future Automation)

To reduce human error, the Platform Team will implement `pnpm migrate:verify`. This tool must implement:

```typescript
// Spec for migration-cli
interface VerificationCheck {
  phase: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  checks: [
    { type: 'file-existence', paths: ['docs/migration/component/_output/audit.md'] },
    { type: 'content-grep', pattern: 'TODO', forbidden: true },
    { type: 'type-check', command: 'pnpm check-types' },
    { type: 'visual-diff', command: 'pnpm test:visual' } // Phase 2
  ]
}
```

**Requirements:**
1. **Idempotent:** Can run 100 times without side effects.
2. **Fail-Fast:** Stops at first error.
3. **JSON Output:** Emits `migration-report.json` for CI parsing.

## Required Output: `packages/ui/docs/SHARED_UI_CHANGELOG.md`
Seed from `20-foundation-change-log.md`. Format:
```markdown
# Shared UI Changelog

## [Unreleased]

## [1.0.0] — <migration completion date>
### Added
- <list all new components from Batch 4>

### Changed
- <list all Batch 3 extensions>

### Notes
- Full migration from per-app shadcn copies to @repo/ui
- See `packages/ui/docs/normalization/` for full migration audit trail
````

## Acceptance Criteria

- New developer can onboard to packages/ui using IMPLEMENTATION_GUIDE without asking anyone
- New app team can migrate to @repo/ui using MIGRATION_PLAYBOOK without agent assistance
- OPERATIONAL_STANDARDS is specific enough to prevent future component drift
- ARCHITECTURE clearly differentiates what packages/ui is vs what it is not

```

---

## What This Phase Locks In

After Phase 08 is complete, the migration project is closed. Going forward:

- All `packages/ui` development follows `SHARED_UI_IMPLEMENTATION_GUIDE.md`
- All new app onboarding follows `SHARED_UI_MIGRATION_PLAYBOOK.md`
- All component requests go through the intake process in `SHARED_UI_OPERATIONAL_STANDARDS.md`
- The `normalization/` docs are archived (historical reference, not operational)


## Change Control

### Foundation Amendment

Any change to **what is migrated or how** (not just when) must be an explicit **Foundation Amendment PR** against `packages/ui/docs/normalization/_output/00-foundation.md` on `feat/ui`.

**A Foundation Amendment is required for:**
- Reclassifying a component (`KEEP_APP_LOCAL` → `NEW_SHARED_COMPONENT`)
- Adding a new mandatory dependency to `packages/ui`
- Changing the batch ordering or shared-vs-local boundary rules
- Relaxing any verification gate requirement

**PR requirements:**
1. What changed + why
2. Which apps/batches are affected
3. Rollback plan

### Non-Negotiable Rules

These rules may NOT be overridden by any individual. They require a Foundation Amendment PR:

1. **No phase starts before its prerequisite is gated.** No exceptions.
2. **`integrate/<APP_NAME>` is read-only.** Any commit to it requires an incident report.
3. **Migration changes imports only.** Behavior, copy, or feature changes are forbidden mid-migration.
4. **Every batch must pass its verification gate before the next starts.** No skipping.
5. **Visual delta beyond design-token adoption requires Design Lead sign-off.**

### Audit Trail Requirements

Every migration batch must leave a complete audit trail before being marked `DONE`:

| Artifact | Location | Required |
| :--- | :--- | :--- |
| Per-app audit report | `_output/_audit-report.md` | ✅ |
| Migration log (append-only) | `_output/_migration-log.md` | ✅ |
| Parity checklist (all items ✅) | `_output/_parity-checklist.md` | ✅ |
| Cleanup report | `_output/_cleanup-report.md` | ✅ Phase 07 |
| Legacy update logs | `legacy-updates/legacy-update-*.md` | ✅ per update |
| Foundation change log | `normalization/_output/20-foundation-change-log.md` | ✅ Phase 04 |

---

*Related: [07-cleanup.md](./07-cleanup.md) · [README.md](./README.md) · [00-overview.md](./00-overview.md)*
```
