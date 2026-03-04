# 02 - Roadmap and Lifecycle

## Lifecycle Model
1. Discovery and guardrails (Batch 0 to Batch 1)
2. Decomposition and stabilization (Batch 1.5)
3. Design-system normalization and intake (Batch 2)
4. Shared-component build and governance hardening (Batch 3 to Batch 6)
5. App rollout and cleanup (Batch 7 to Batch 10.5)

## Phase Roadmap

| Phase | Core Outcome | Entry Gate | Exit Gate |
| --- | --- | --- | --- |
| Batch 0-1 | Audit and classification baseline | App docs available | Audit artifacts locked |
| Batch 1.5 | Container/Shell split for monolith-risk components | Batch 1 completed | Split outputs and gates pass |
| Batch 2 | Canonical DS foundation and source reconciliation | Per-app baselines copied to feat/ui | `_output/00-06` complete |
| Batch 3-6 | Shared component implementation and policy enforcement | Batch 2 foundation locked | Components ready with standards coverage |
| Batch 7-10.5 | App adoption, cleanup, and dependency stabilization | Shared components available | Migration closed with quality gates |

## Legacy Update Lifecycle (interrupt path)
- Trigger: upstream legacy repo changes.
- Flow: `L1 -> L2 (if conflict) -> L3 -> L4/L5 -> L6`.
- Rule: preserve Batch 1.5 split architecture; never revert to monolith during conflict resolution.
- Shared-candidate rule: queue through `L5`; do not implement in app branch.

## Stage-Gate Policy
- Mandatory technical gate at each merge wave: `check-types`, `lint`, `build`.
- Mandatory documentation gate:
  - `_audit-report.md`
  - `_component-backlog.csv`
  - `_migration-log.md`
  - `_per-app-baseline-summary.md`
  - `legacy-updates/legacy-update-*.md` (for legacy-update waves)

## Program Milestone Set (PM View)
- M1: All app baselines copied to `feat/ui`.
- M2: Batch 2 normalization outputs approved.
- M3: First shared-component wave released from `@repo/ui`.
- M4: App rollout reaches agreed adoption threshold.
- M5: Migration closure and operational handover.