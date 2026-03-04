# PM Documentation Pack - Shared Component Migration

This folder provides project-management documentation for Jira ticket **Implement Shareable Component in UI Package**.

## Audience
- Project Manager
- Engineering Manager
- Design System Lead
- QA Lead

## Documents
- `01-program-charter.md`: objectives, scope, deliverables, KPIs.
- `02-roadmap-and-lifecycle.md`: phase roadmap, stage-gates, and lifecycle policy.
- `03-operating-model-raci.md`: enterprise governance model, ownership, cadence, escalation.
- `04-status-dashboard.md`: current status snapshot and per-app tracker.
- `05-traceability-and-sources.md`: evidence chain from app migration docs to feat/ui outputs.

## Source of truth hierarchy
1. App-level migration evidence in `migrate-app_<APP_NAME>/apps/<APP_NAME>/docs/migration/component/`.
2. Batch 2 source map in `packages/ui/docs/normalization/_batch2/source-map.md`.
3. Program outputs in `packages/ui/docs/normalization/_output/`.
4. PM control docs in this folder (`_pm`).

## Update policy
- Update `04-status-dashboard.md` at minimum once per reporting cycle (daily or every major merge wave).
- If roadmap, scope, or gate criteria change, update `01` and `02` in the same PR.
- If ownership changes, update `03` in the same PR.