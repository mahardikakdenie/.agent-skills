# 03 - Operating Model and RACI

## Governance Principles
- Single control branch for normalization and shared-component rollout: `feat/ui`.
- App branches remain source of migration truth per app.
- Decision records must be traceable to explicit docs and commits.

## RACI

| Workstream | PM | DS Lead | FE Lead | App Owner | QA Lead |
| --- | --- | --- | --- | --- | --- |
| Program plan and milestone control | A | C | C | I | I |
| Canonical API and token decisions | C | A | R | C | C |
| Batch execution on `feat/ui` | I | R | A | C | C |
| Legacy update merge per app | I | C | A | R | C |
| Gate verification (`check-types/lint/build`) | I | C | A | R | R |
| Status reporting and RAID upkeep | A | C | C | C | C |

Legend: R = Responsible, A = Accountable, C = Consulted, I = Informed

## Ceremonies
- Weekly steering: roadmap, risks, escalations.
- Twice-weekly migration sync: batch progress and blockers.
- Release-readiness review: gate results and rollback posture.

## Escalation SLA
- P1 blocker (build break, merge deadlock): escalate within same day.
- P2 blocker (missed gate, unresolved dependency): escalate within 1 business day.
- P3 blocker (documentation lag): resolve in current reporting cycle.

## Change Control
- Any change to foundation contracts, component taxonomy, or gate definitions requires explicit PR note plus stakeholder approval.