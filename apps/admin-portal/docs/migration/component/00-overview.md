# 00 - Branch Model & Migration Lifecycle

> **Role:** Pre-work orientation - read this before running any migration prompt.
> **Scope:** Branch topology, lifecycle flow, verification gates, legacy update integration, and handoff contracts.
> **Branch:** Any (reference doc, kept on `migrate-app/<APP_NAME>` as read-only anchor).
> **Next:** [01-app-audit.md](./01-app-audit.md)

---

## Document Navigation

**This Document:**

- Branch model & read-only contract
- Full lifecycle visual diagram
- Batch execution decision tree
- Per-batch orientation (what, where, when)
- Verification gates by batch
- Legacy update integration points
- Handoff artifact contracts

**Batch Guides:**

| #   | Document                                                                                 | Batch Scope | Branch              | Run                     |
| --- | ---------------------------------------------------------------------------------------- | ---------- | ------------------- | ----------------------- |
| 01  | [Per-App Component Audit](./01-app-audit.md)                                             | Batch 1                 | `migrate-app/<app>` | per app                 |
| 02  | [Design System Foundation](./02-design-system-foundation.md)                             | Batch 2                 | `feat/ui`           | once                    |
| 03  | [Migration Plan & Batches](./03-migration-plan.md)                                       | Batch 3                 | `feat/ui`           | once                    |
| 04  | [Build Shared Components](./04-build-shared-components.md)                               | Batches 4-5             | `feat/ui`           | per batch               |
| 05  | [Per-App Migration](./05-app-migration.md)                                               | Batches 5.5-9           | `migrate-app/<app>` | per app/batch           |
| 05A | [App-Local SoC Refactor](./05-app-migration.md#phase-05a)                                | Batch 9.5               | `migrate-app/<app>` | per app (after Batch 9) |
| 1.5 | [SoC Pre-Migration Refactor](./05-app-migration.md#batch-15--soc-pre-migration-refactor) | Batch 1.5               | `migrate-app/<app>` | per app (after Batch 1) |
| 06  | [Component Standards & Conventions](./06-component-standards.md)                         | Always-on reference     | All (reference)     | always-on               |
| 07  | [Cleanup & Deprecation](./07-cleanup.md)                                                 | Batch 10 (+10.5)        | `migrate-app/<app>` | per app                 |
| 08  | [Operational Standards](./08-operational-standards.md)                                   | Batch 11                | `feat/ui`           | once                    |
| 09  | [Dependency Version Upgrades](./09-dependency-upgrades.md)                               | Batch 0.5               | `migrate-app/<app>` | per app                 |

**Support Documents (always-on, not batch-gated):**

| File                                                                             | Purpose                             |
| -------------------------------------------------------------------------------- | ----------------------------------- |
| [`legacy-update-routines.md`](./legacy-update-routines.md)                       | Step-by-step legacy update workflow |
| [`legacy-update-integration-guide.md`](./legacy-update-integration-guide.md)     | Quick reference & decision tree     |
| [`legacy-update-batch-prompts.md`](./legacy-update-batch-prompts.md)             | Copy-paste AI prompts               |
| [`legacy-updates/`](./legacy-updates/)                                           | Per-update timestamped audit logs   |
| [`apps/<APP_NAME>/docs/migration/verification-gate.md`](../verification-gate.md) | Per-app verification commands       |

---

## 5. Artifact Classification (Inputs vs Outputs)

To ensure multi-app reusability, we strictly separate **instructions** from **data**:

| Type                  | Directory Location          | Naming Convention  | Description                                                                 |
| --------------------- | --------------------------- | ------------------ | --------------------------------------------------------------------------- |
| **Static Guides**     | `docs/migration/component/` | `01-app-audit.md`  | The permanent instructions. Never modified by the migration process itself. |
| **Dynamic Artifacts** | `.../component/_output/`    | `_audit-report.md` | Generated reports, logs, and plans. Specific to _this_ app's migration.     |

> [!IMPORTANT]
> When onboarding a new app, copy the **Static Guides** only.
> Never copy the `_output/` folder from another app.

---

## 1. Branch Model

### 1.1 Full Merge Flow

```txt
feat/ui -------------------------------------------- packages/ui development only
    |
    |  PR merged into stage
    v
stage ---------------------------------------------- integration / staging gate
    |
    |  merged into main
    v
main -----------------   integrate/<APP_NAME> -------- READ-ONLY (git subtree pull only)
(stable base)                     |
                                  |  merged into migrate-app/<APP_NAME>
                                  v
                            migrate-app/<APP_NAME> -------- refactor / migration work branch
                                  |
                                  |  merged into migrate-app/base (incrementally per app)
                                  v
                            migrate-app/base -------------- (all apps accumulate here)
                                  |
                                  |  merged into stage ONLY when ALL apps are migrated
                                  v
                                stage  <--- (final merge, closes the loop)
```

### 1.2 Branch Purpose & Rules

| Branch                   | Writeable?       | Merge Direction                                     | Notes                                                 |
| :----------------------- | :--------------- | :-------------------------------------------------- | :---------------------------------------------------- |
| `feat/ui`                | Yes           | -> `stage`                                           | `packages/ui` development only; never touches `apps/` |
| `stage`                  | PR-gated      | -> `main`, -> `integrate/<APP_NAME>`                  | Integration gate; all PRs land here first             |
| `main`                   | PR-gated      | -                                                   | Stable monorepo base; no direct commits               |
| `integrate/<APP_NAME>`   | **READ-ONLY** | <- legacy remote, -> `migrate-app/<APP_NAME>`         | 1:1 mirror of legacy repo via `git subtree pull` only |
| `migrate-app/<APP_NAME>` | Yes           | <- `integrate/<APP_NAME>`, -> `migrate-app/base`      | All refactor/migration work per app                   |
| `migrate-app/base`       | PR-gated      | <- `migrate-app/<APP_NAME>` (incremental), -> `stage` | Accumulates all migrated apps                         |

> [!IMPORTANT]
> On any `migrate-app/<APP_NAME>` branch, **only that app's directory exists** in `apps/`.
> Never run a global `apps/**` discovery on a `migrate-app/<APP_NAME>` branch.
> All cross-app aggregation happens exclusively on `feat/ui`.

### 1.3 `integrate/*` Read-Only Contract

`integrate/<APP_NAME>` is a **git-subtree mirror** of the legacy repository - 1:1 at all times.

```bash
# ONLY allowed write operation on integrate/<APP_NAME>
git checkout integrate/<APP_NAME>
git subtree pull --prefix=<APP_PATH> <LEGACY_REMOTE> <LEGACY_BRANCH>
git push origin integrate/<APP_NAME>
```txt

**Key consequence:** Because `integrate/<APP_NAME>` is never locally modified, subtree pulls are **always conflict-free**. Conflicts only surface when merging `integrate/<APP_NAME>` -> `migrate-app/<APP_NAME>`.

### 1.4 Legacy Update Workflow

When the legacy repo receives new commits, propagate them using this flow:

```
1. git subtree pull -> integrate/<APP_NAME>   (always clean)
2. git merge integrate/<APP_NAME>            (on migrate-app/<APP_NAME> - may conflict)
3. Resolve conflicts on migrate-app/<APP_NAME>   (categorize: migrated / non-migrated component)
4. Analyze & adjust                          (Batch 3 -> 4 / 5 / 5A depending on scenario)
5. Verify + document                         (Batch 6 -> legacy-updates/legacy-update-YYYYMMDD-HHMMSS.md)
```md

For detailed routines, conflict resolution strategy, batch sequences, and copy-paste AI prompts, see:

- [`legacy-update-routines.md`](./legacy-update-routines.md)
- [`legacy-update-integration-guide.md`](./legacy-update-integration-guide.md)
- [`legacy-update-batch-prompts.md`](./legacy-update-batch-prompts.md)

### 1.5 Placeholder Reference

| Placeholder       | Example value         | Description                                 |
| ----------------- | --------------------- | ------------------------------------------- |
| `<APP_NAME>`      | `admin-portal`        | App slug (matches `apps/` directory name)   |
| `<APP_PATH>`      | `apps/admin-portal`   | Monorepo-relative path to the app root      |
| `<LEGACY_REMOTE>` | `legacy-admin-portal` | Git remote name pointing to the legacy repo |
| `<LEGACY_BRANCH>` | `stage`               | Default branch of the legacy repo           |

---

## 2. Shared Infrastructure (visible on ALL branches)

```
packages/
|-- ui/            <- @repo/ui - the shared component library
|-- config/        <- shared configs (tailwind, postcss, etc.)
|-- eslint-config/ <- shared ESLint rules
|-- typescript-config/ <- shared tsconfig bases
|-- helper/        <- shared utility helpers
|-- interface/     <- shared TypeScript interfaces/types
```mermaid

---

## 3. Full Migration Lifecycle

### 3.1 Main Flow (Batch x Branch)

```mermaid
flowchart TB
  classDef stage fill:#f4f6f8,stroke:#6b7280,color:#111,stroke-width:2px;
  classDef gate fill:#fff7ed,stroke:#ea580c,color:#7c2d12,stroke-width:2px;
  classDef artifact fill:#ecfdf3,stroke:#16a34a,color:#14532d,stroke-width:2px;
  classDef fix fill:#fef2f2,stroke:#dc2626,color:#7f1d1d,stroke-width:2px;
  classDef legacy fill:#fefce8,stroke:#eab308,color:#713f12,stroke-width:2px;

  START([Start: Scope Selected]):::stage

  subgraph MIGRATE_BRANCH["migrate-app/<APP_NAME> - per app"]
    P01[Batch 0: Per-App Audit<br/>Inventory + classify all components]:::stage
    A01[_audit-report.md - _spec-input.md<br/>_component-backlog.csv<br/>_per-app-baseline-summary.md]:::artifact
    P01 --> A01
  end

  subgraph FEAT_UI_BRANCH["feat/ui - cross-app, run once"]
    P02[Foundation Setup: Design System Foundation<br/>Cross-app reconciliation -> @repo/ui foundation]:::stage
    A02[00-foundation.md ... 06-risk-register.md]:::artifact
    P02 --> A02

    P03[Batch Planning: Migration Plan<br/>Batch design 1 -> 2 -> 3 -> 3A -> 4 -> 5 -> 6]:::stage
    A03[10-cross-app-reconciliation.md<br/>11-master-component-roadmap.md<br/>13-implementation-batches.md]:::artifact
    P03 --> A03

    P04[Shared Build: Build Shared Components<br/>SDD - SPEC -> STORY -> BUILD -> GATE per batch]:::stage
    G04{Verification Gate<br/>per batch item}:::gate
    F04[Fix or rollback<br/>re-run gate]:::fix
    A04[Component specs + stories<br/>packages/ui index.ts exports<br/>20-foundation-change-log.md<br/>21-adapter-mapping.md]:::artifact
    P04 --> G04
    G04 -- pass --> A04
    G04 -- fail --> F04 --> G04
  end

  subgraph MIGRATE_BRANCH2["migrate-app/<APP_NAME> - per app, per batch"]
    P09[Batch 0.5: Dependency Upgrades<br/>Batch 0.5 - React 19 - Tailwind v4 - TS 5.9.2<br/>Must pass gate before Batch 1]:::stage
    G09{Verification Gate<br/>Batch 0.5}:::gate
    F09[Fix type errors<br/>fix config]:::fix
    P09 --> G09
    G09 -- pass --> P05[Per-App Migration<br/>Batch 1 -> 2 -> 3 -> 4 - consume @repo/ui]:::stage
    G09 -- fail --> F09 --> G09

    G05{Verification Gate<br/>per batch}:::gate
    F05[Fix or rollback<br/>re-run gate]:::fix
    A05[_migration-plan.md - _migration-log.md<br/>_parity-checklist.md]:::artifact
    P05 --> G05
    G05 -- pass --> A05
    G05 -- fail --> F05 --> G05

    P05A["Batch 9.5: App-Local SoC Refactor<br/>Batch 9.5 - container/shell split<br/>KEEP_APP_LOCAL HIGH+MEDIUM only"]:::stage
    G05A{"Gate: Batch 9.5<br/>types - lint - build - smoke"}:::gate
    F05A[Fix or rollback]:::fix
    P05[Per-App Migration]:::stage --> P05A --> G05A
    G05A -- pass --> P07[Batch 10: Cleanup]:::stage
    G05A -- fail --> F05A --> G05A
    G07{Verification Gate<br/>per app}:::gate
    F07[Fix or rollback]:::fix
    A07[_cleanup-report.md]:::artifact
    P07 --> G07
    G07 -- pass --> A07
    G07 -- fail --> F07 --> G07
  end

  subgraph FINAL["feat/ui - final standards"]
    P08[Batch 11: Operational Standards]:::stage
    A08[SHARED_UI_ARCHITECTURE.md<br/>SHARED_UI_IMPLEMENTATION_GUIDE.md<br/>SHARED_UI_MIGRATION_PLAYBOOK.md<br/>SHARED_UI_OPERATIONAL_STANDARDS.md<br/>SHARED_UI_CONTRIBUTING.md<br/>SHARED_UI_CHANGELOG.md]:::artifact
    P08 --> A08
  end

  subgraph REF["Reference"]
    P06[Component Standards<br/>Always Active]:::stage
  end

  START --> MIGRATE_BRANCH
  A01 -->|"handoff"| P02
  A01 -->|"SoC split before Batch 2+"| P15["Batch 1.5: SoC Pre-Migration Refactor\nSplit HIGH/MEDIUM monolith candidates"]:::stage
  P15 --> G15{"Gate: Batch 1.5\ntypes - lint - build - smoke"}:::gate
  G15 -- pass --> P05
  G15 -- fail --> F15[Fix or rollback]:::fix --> G15
  A02 --> P03
  A03 --> P04
  A01 -->|"handoff"| P09
  A04 -->|"handoff"| P05
  A07 -->|"merge to base"| FINAL

  LEGACY[Legacy Update<br/>can arrive at ANY batch]:::legacy
  LEGACY -.- P01
  LEGACY -.- P05
  LEGACY -.- P07

  P06 -.- P04
  P06 -.- P05
```

**Legend:** Gray = Lifecycle stages -  Orange = Verification gates - Green = Artifacts - Red = Fix/rollback - Yellow = Legacy update

### 3.2 Batch Execution Decision Tree (Per-App Migration)

Each component from `_audit-report.md` maps to exactly one batch:

```mermaid
flowchart TD
  classDef batch fill:#f0f9ff,stroke:#0284c7,color:#0c4a6e,stroke-width:2px;
  classDef decision fill:#fef3c7,stroke:#d97706,color:#78350f,stroke-width:2px;
  classDef gate fill:#fff7ed,stroke:#ea580c,color:#7c2d12,stroke-width:2px;

  classDef soc fill:#f3e8ff,stroke:#9333ea,color:#3b0764,stroke-width:2px;

  START([Component from _audit-report.md]) --> Q1S{"SoC Potential? (All components)"}:::soc

  Q1S --> |"HIGH or MEDIUM - Batch 1.5 candidate"| W15["Batch 1.5: SoC Pre-Migration Refactor<br/>Split into Container + Shell"]:::batch
  W15 --> G15{Gate: Batch 1.5}:::gate
  G15 -- fail --> F15["Fix or rollback"]:::decision --> G15
  G15 -- pass --> W15B["Re-classify Shell per 6.6"]:::soc
  W15B --> Q1

  Q1S --> |"LOW or NONE"| Q1{Classification?}:::decision

  Q1 --> |ADOPT_NOW| WA[Batch 1: Direct Import Swap<br/>Replace local with @repo/ui]:::batch
  Q1 --> |ADOPT_WITH_ADAPTER| WB[Batch 2: Adapter Pattern<br/>Thin wrapper to bridge API diff]:::batch
  Q1 --> |EXTEND_EXISTING| WC[Batch 3: Extend @repo/ui first<br/>on feat/ui, then import swap]:::batch
  Q1 --> |NEW_SHARED_COMPONENT| WD[Batch 4: Build new in @repo/ui<br/>on feat/ui, then import swap]:::batch
  Q1 --> |KEEP_APP_LOCAL| Q1K{Refactor potential?}:::decision
  Q1K --> |HIGH or MEDIUM| WK[Batch 9.5: App-Local SoC Refactor<br/>Batch 9.5 - container/shell split]:::batch
  Q1K --> |LOW or NONE| SKIP[No migration - stays app-local<br/>Record in _audit-report.md as N/A]:::batch

  WA --> GA{Gate: Batch 1}:::gate
  WB --> GB{Gate: Batch 2}:::gate
  WC --> GC{Gate: Batch 3}:::gate
  WD --> GD{Gate: Batch 4}:::gate

  GA -- pass --> WE[Batch 5: Stabilization<br/>Parity verification + adapter audit]:::batch
  GB -- pass --> WE
  GC -- pass --> WE
  GD -- pass --> WE

  GA -- fail --> FA[Fix -> re-run]:::decision --> GA
  GB -- fail --> FB[Fix -> re-run]:::decision --> GB
  GC -- fail --> FC[Fix -> re-run]:::decision --> GC
  GD -- fail --> FD[Fix -> re-run]:::decision --> GD

  WE --> GE{Gate: Batch 5<br/>all adapters audited}:::gate
  GE -- pass --> WF[Batch 9.5 - if candidates exist<br/>Batch 9.5 SoC Refactor<br/>Then Batch 10: Cleanup]:::batch
  WK --> GK{Gate: Batch 9.5}:::gate
  GK -- pass --> WF
  GK -- fail --> FK[Fix -> re-run]:::decision --> GK
  GE -- fail --> FE[Fix parity issues]:::decision --> GE

  WF --> BATCHDONE([Batch complete - app ready for Batch 10])
```mermaid

### 3.3 Failure Handling (applies to all gates)

```mermaid
flowchart TD
  classDef fix fill:#fef2f2,stroke:#dc2626,color:#7f1d1d,stroke-width:2px;
  classDef gate fill:#fff7ed,stroke:#ea580c,color:#7c2d12,stroke-width:2px;
  classDef stage fill:#f4f6f8,stroke:#6b7280,color:#111,stroke-width:2px;

  FAIL[Verification Gate Fails]:::gate --> B{Critical Failure?}
  B -->|No - fixable| C[Diagnose root cause]:::fix --> D[Minimal fix<br/>do NOT touch unrelated code]:::fix --> RERUN[Re-run gate]:::gate
  RERUN --> P{Pass?}
  P -->|Yes| NEXT[Continue to next stage]:::stage
  P -->|No| C
  B -->|Yes - too risky| ROLLBACK[git reset --hard<br/>git push -f origin migrate-app/<APP_NAME>]:::fix
  ROLLBACK --> DOC[Document in _migration-log.md]:::fix --> REASSESS[Reassess approach<br/>reclassify if needed]:::fix
```

---

## 4. Verification Gates by Batch/Stage

> [!IMPORTANT]
> Exact commands for each app are in `apps/<APP_NAME>/docs/migration/verification-gate.md`.
> Always read that file first - do NOT guess commands.

| Batch/Stage                  | Gate Scope                 | Commands                                                                                        |
| ---------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------- |
| 01 - Audit                   | None (docs only)           | -                                                                                               |
| 02 - Foundation              | None (docs only)           | -                                                                                               |
| 03 - Migration Plan          | None (docs only)           | -                                                                                               |
| 04 - Build UI                | Per batch item: `@repo/ui` | `check-types` - `build` - `storybook:build` - a11y addon                                        |
| 09/Batch 0.5 - Dep Upgrade   | Per app                    | `check-types` - `lint` - `build` - version alignment check (React 19.x, Tailwind 4.x, TS 5.9.2) |
| 05 - Per-App Migration       | Per batch: app             | From `verification-gate.md` + visual/behavior parity                                            |
| 05A - App-Local SoC Refactor | Per component (Batch 9.5)  | `check-types` - `lint` - `build` - smoke route per component                                    |
| 07 - Cleanup                 | Full monorepo              | All apps `check-types` - `build` + no broken imports scan                                       |
| 09/Batch 10.5 - Dep Deferred | Per app                    | `check-types` - `lint` - `build` - deferred item table logged                                   |
| 08 - Operational Standards   | Docs review                | -                                                                                               |

---

## 5. Handoff Artifact Contracts

These are the critical handoff contracts between batch/stage steps on different branches:

| From                           | To                             | Artifact                                                     | Location                                          |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ | ------------------------------------------------- |
| Batch 0 (`migrate-app/<app>`)  | Foundation Setup (`feat/ui`)   | `_per-app-baseline-summary.md`                                | Copy to `packages/ui/docs/normalization/per-app/` |
| Foundation Setup (`feat/ui`)   | All apps                       | `00-foundation.md` through `06-risk-register.md`             | `packages/ui/docs/normalization/_output/`         |
| Batch Planning (`feat/ui`)     | Shared Build                   | `10-cross-app-reconciliation.md`, `11-master-component-roadmap.md`, `12-master-backlog.csv`, `13-implementation-batches.md` | `packages/ui/docs/normalization/_output/` |
| Shared Build (`feat/ui`)       | Per-App Migration (`migrate-app/<app>`) | `packages/ui/src/index.ts` exports + `21-adapter-mapping.md` | `packages/ui` + `packages/ui/docs/normalization/_output/` |
| Per-App Migration (`migrate-app/<app>`) | Batch 10 Cleanup              | `_migration-log.md` (all Status=DONE)                         | `apps/<APP_NAME>/docs/migration/component/`       |

---

## 6. App Classification (Batch 0 priority order)

| Priority | App Type           | Apps                                                                                                         |
| -------- | ------------------ | ------------------------------------------------------------------------------------------------------------ |
|  P0    | Admin/Ops portals  | `admin-portal`, `admin-portal-boost`, `claim-portal`, `ticket-portal`                                        |
|  P0    | Auth/SSO           | `sso-portal`                                                                                                 |
|  P1    | Agent portals      | `agent-admin`, `agent-portal`, `agent-web-portal`                                                            |
|  P1    | Affiliate portals  | `affiliate-admin`, `affiliate-portal`                                                                        |
|  P1    | Customer/Partner   | `customer-portal`, `partner-portal`                                                                          |
|  P2    | E-commerce         | `ecommerce-gelm`, `ecommerce-teman`                                                                          |
|  P2    | Partner variants   | `gegm-friendcover`, `gegm-friendcover-admin`                                                                 |
|  P2    | Teman affiliates   | `teman-affiliate-admin`, `teman-affiliate-portal`, `teman-affiliate-microsite`                               |
|  P3    | Microsites/Landing | `agent-microsite`, `gelm-xproject-microsite`, `getrev-da-microsite`, `grab-landing-page`, `haruuz-microsite` |
|  P3    | Websites/AI        | `mykawan-website`, `gen-ai-portal`, `boost-product-fe`                                                       |

---

_Related: [README.md](./README.md) - [01-app-audit.md](./01-app-audit.md) - [legacy-update-integration-guide.md](./legacy-update-integration-guide.md)_
