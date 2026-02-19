# UI Component Migration — Master Index

> **Coverage:** All apps in `apps/`, shared library `packages/ui`, internal support in `packages/*`
> **Branch model:** `migrate-app/<app>` per app · `feat/ui` for shared library work
> **Standard:** Enterprise-level spec-driven development (SDD)

---

## Phase Documents

| #   | Document                                                         | Phase      | Branch              | Run           |
| --- | ---------------------------------------------------------------- | ---------- | ------------------- | ------------- |
| —   | [**00 Branch Model & Lifecycle**](./00-overview.md)              | Pre-work   | Reference           | always-on     |
| 01  | [Per-App Component Audit](./01-app-audit.md)                     | Audit      | `migrate-app/<app>` | per app       |
| 02  | [Design System Foundation](./02-design-system-foundation.md)     | Foundation | `feat/ui`           | once          |
| 03  | [Migration Plan & Batches](./03-migration-plan.md)               | Planning   | `feat/ui`           | once          |
| 04  | [Build Shared Components](./04-build-shared-components.md)       | Build      | `feat/ui`           | per batch     |
| 05  | [Per-App Migration](./05-app-migration.md)                       | Migrate    | `migrate-app/<app>` | per app/batch |
| 06  | [Component Standards & Conventions](./06-component-standards.md) | Standard   | All (reference)     | always-on     |
| 07  | [Cleanup & Deprecation](./07-cleanup.md)                         | Cleanup    | `migrate-app/<app>` | per app       |
| 08  | [Operational Standards](./08-operational-standards.md)           | Standards  | `feat/ui`           | once          |

---

## Support Documents (always-on, not phase-gated)

These apply at any point during migration — particularly when a legacy update arrives:

| File                                                                         | Purpose                                                                |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [`migration-batch-prompts.md`](./migration-batch-prompts.md)                 | **Master execution file** — Batches 0–11 + Legacy L1–L6 (copy-paste)   |
| [`legacy-update-routines.md`](./legacy-update-routines.md)                   | Step-by-step legacy update workflow (Routine 1–6)                      |
| [`legacy-update-integration-guide.md`](./legacy-update-integration-guide.md) | Quick reference: when to update, pause/resume by batch                 |
| [`legacy-update-batch-prompts.md`](./legacy-update-batch-prompts.md)         | Copy-paste AI prompts (Batch 1–6 + 5A)                                 |
| [`legacy-updates/`](./legacy-updates/)                                       | Per-update timestamped audit logs (`legacy-update-YYYYMMDD-HHMMSS.md`) |
| [`../verification-gate.md`](../verification-gate.md)                         | App-specific verification commands (typecheck/lint/build/test)         |

---

## Execution Flow

> **Where to start:** New to this migration? Read [00-overview.md](./00-overview.md) first (branch model + full lifecycle), then return here and follow the phase table top-to-bottom. Your first action on an app branch is always **Batch 0** in [`migration-batch-prompts.md`](./migration-batch-prompts.md).

```
[Reference]             Phase 06 (Standards) — Governs all phases
                        │
[migrate-app/<app>]         Phase 01 (per app, per branch)
        │
        │  handoff: per-app-baseline-summary.md
        ▼
[feat/ui]               Phase 02  →  Phase 03  →  Phase 04 (per batch)
                        Foundation    Batches       packages/ui Build
        │
        │  handoff: @repo/ui updated exports + adapter-mapping.md
        ▼
[migrate-app/<app>]         Phase 05 (per app, consume @repo/ui) → Phase 07 (cleanup)
        │
        ▼
[feat/ui]               Phase 08 (standards) → SHARED_UI_* permanent docs
```

---

## Key Rules (non-negotiable across all phases)

1. **Spec first** — no component enters `packages/ui` without a written spec + Storybook story
2. **App-agnostic** — `packages/ui` has zero business logic, API calls, domain types, or framework-specific imports
3. **Behavior parity** — 100% behavioral backward compatibility is mandatory. Users must not be able to detect that migration occurred. See [`06-component-standards.md` Section 8](./06-component-standards.md) for the full contract
4. **No opportunistic refactoring** — migration changes imports only. Document improvements in `migration-log.md` under "Post-Migration Improvement Candidates" — do not act on them during migration
5. **Evidence-based** — every claim references a real repo path
6. **Phase gate** — a phase may not start until its prerequisites are verified complete
7. **Read verification-gate.md first** — always read `apps/<APP_NAME>/docs/migration/verification-gate.md` before running any verification commands
8. **UX continuity** — after migration, the app must feel identical. Minor visual delta from design system token adoption is the only acceptable change
9. **Wrong branch recovery** — if you realize you are on the wrong branch mid-phase: (a) `git stash` all uncommitted work, (b) `git checkout <correct-branch>`, (c) `git stash pop`, (d) verify you're in the right `apps/` directory before continuing. Never commit phase work to the wrong branch. If already committed to the wrong branch, revert the commit (`git revert HEAD`) and cherry-pick to the correct branch.

---

## Post-Migration Permanent Docs (created in Phase 08)

After all apps complete migration and Phase 08 runs on `feat/ui`, the following permanent documentation is produced in `packages/ui/docs/`:

| File                                 | Purpose                                                                       |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| `SHARED_UI_ARCHITECTURE.md`          | Component library architecture, taxonomy, token contract                      |
| `SHARED_UI_IMPLEMENTATION_GUIDE.md`  | How to build components in `@repo/ui` (SDD, file structure, export patterns)  |
| `SHARED_UI_CONTRIBUTING.md`          | Intake process, PR checklist, review gates                                    |
| `SHARED_UI_OPERATIONAL_STANDARDS.md` | Versioning, ownership, deprecation policy, adapter policy                     |
| `SHARED_UI_MIGRATION_PLAYBOOK.md`    | Step-by-step guide to onboard a new app to `@repo/ui`                         |
| `CHANGELOG.md`                       | Component addition/change history (seeded from `20-foundation-change-log.md`) |

> These docs live only in `packages/ui/docs/` and are produced **once** by [Phase 08](./08-operational-standards.md). They are not duplicated in app directories.

---

## Workspace Apps (from `git worktree list`)

| Worktree                                | Branch                                  | Type       |
| --------------------------------------- | --------------------------------------- | ---------- |
| `migrate-app_admin-portal`              | `migrate-app/admin-portal`              | Admin      |
| `migrate-app_admin-portal-boost`        | `migrate-app/admin-portal-boost`        | Admin      |
| `migrate-app_affiliate-admin`           | `migrate-app/affiliate-admin`           | Affiliate  |
| `migrate-app_affiliate-portal`          | `migrate-app/affiliate-portal`          | Affiliate  |
| `migrate-app_agent-admin`               | `migrate-app/agent-admin`               | Agent      |
| `migrate-app_agent-microsite`           | `migrate-app/agent-microsite`           | Microsite  |
| `migrate-app_agent-portal`              | `migrate-app/agent-portal`              | Agent      |
| `migrate-app_agent-web-portal`          | `migrate-app/agent-web-portal`          | Agent      |
| `migrate-app_boost-product-fe`          | `migrate-app/boost-product-fe`          | Product    |
| `migrate-app_claim-portal`              | `migrate-app/claim-portal`              | Ops        |
| `migrate-app_customer-portal`           | `migrate-app/customer-portal`           | Customer   |
| `migrate-app_ecommerce-gelm`            | `migrate-app/ecommerce-gelm`            | E-commerce |
| `migrate-app_ecommerce-teman`           | `migrate-app/ecommerce-teman`           | E-commerce |
| `migrate-app_gegm-friendcover`          | `migrate-app/gegm-friendcover`          | Partner    |
| `migrate-app_gegm-friendcover-admin`    | `migrate-app/gegm-friendcover-admin`    | Admin      |
| `migrate-app_gelm-xproject-microsite`   | `migrate-app/gelm-xproject-microsite`   | Microsite  |
| `migrate-app_gen-ai-portal`             | `migrate-app/gen-ai-portal`             | AI         |
| `migrate-app_getrev-da-microsite`       | `migrate-app/getrev-da-microsite`       | Microsite  |
| `migrate-app_grab-landing-page`         | `migrate-app/grab-landing-page`         | Landing    |
| `migrate-app_haruuz-microsite`          | `migrate-app/haruuz-microsite`          | Microsite  |
| `migrate-app_mykawan-website`           | `migrate-app/mykawan-website`           | Website    |
| `migrate-app_partner-portal`            | `migrate-app/partner-portal`            | Partner    |
| `migrate-app_sso-portal`                | `migrate-app/sso-portal`                | Auth       |
| `migrate-app_teman-affiliate-admin`     | `migrate-app/teman-affiliate-admin`     | Affiliate  |
| `migrate-app_teman-affiliate-microsite` | `migrate-app/teman-affiliate-microsite` | Microsite  |
| `migrate-app_teman-affiliate-portal`    | `migrate-app/teman-affiliate-portal`    | Affiliate  |
| `migrate-app_ticket-portal`             | `migrate-app/ticket-portal`             | Ops        |
| `migrate-app_base`                      | `migrate-app/base`                      | Base       |

> **Note:** `feat/ui` is the dedicated branch for `packages/ui` development. No app migration work happens there.

---

_See [00-overview.md](./00-overview.md) for full branch model, lifecycle diagrams, and handoff protocol._
