# 05 - Traceability and Sources

## Purpose
Provide a clear evidence chain so PM can verify what is being done, why, and from which source docs.

## Evidence Chain (Top-down)
1. **App migration source docs**
   - Location pattern:
     - `integrate-app_<APP_NAME>/apps/<APP_NAME>/docs/migration/component/`
     - `migrate-app_<APP_NAME>/apps/<APP_NAME>/docs/migration/component/`
   - Key files:
     - `migration-batch-prompts.md`
     - `02-design-system-foundation.md`
     - `06-component-standards.md`
     - `legacy-update-routines.md`
     - `legacy-update-integration-guide.md`

2. **Batch 2 aggregation control (feat/ui)**
   - `packages/ui/docs/normalization/_batch2/source-map.md`
   - `packages/ui/docs/normalization/_batch2/source-map.json`
   - `packages/ui/docs/normalization/_batch2/batch2-ready-prompt.md`

3. **Program normalization outputs (feat/ui)**
   - `packages/ui/docs/normalization/_output/00-foundation.md`
   - `packages/ui/docs/normalization/_output/01-component-taxonomy.md`
   - `packages/ui/docs/normalization/_output/02-api-conventions.md`
   - `packages/ui/docs/normalization/_output/03-token-theming-contract.md`
   - `packages/ui/docs/normalization/_output/04-shared-vs-local-boundary.md`
   - `packages/ui/docs/normalization/_output/05-coverage-baseline.md`
   - `packages/ui/docs/normalization/_output/06-risk-register.md`

4. **Per-app baseline snapshots in feat/ui**
   - `packages/ui/docs/normalization/per-app/<APP_NAME>_baseline-summary.md`

5. **PM governance artifacts**
   - This `_pm` folder.

## Audit Checklist (PM)
- Is app evidence present in app branch docs?
- Is per-app baseline copied to feat/ui?
- Is Batch 2 source map updated and aligned with worktrees?
- Are normalization outputs (`00-06`) available and current?
- Are legacy-update actions logged for apps with upstream changes?
- Do latest status claims match gate outputs (`check-types/lint/build`)?

## Reporting Recommendation
- Include links to all five evidence levels in weekly status reports.
- For escalation, always attach:
  - impacted app name,
  - latest legacy-update log (if any),
  - gate failure evidence,
  - proposed next safe step.