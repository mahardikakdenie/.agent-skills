# 04 - Status Dashboard

## Snapshot Date
- Last updated: 2026-03-04
- Batch 2 source map generated at: 2026-03-03T16:26:22.445Z

## Executive Summary
- Total in-scope apps (migrate-app_base excluded): **27**
- Baseline summaries copied to feat/ui: **27/27**
- Batch 1.5 explicit evidence in copied baselines: **24/27**
- Apps with legacy-update execution evidence (legacy-update-*.md): **16/27**
- Batch 2 normalization output docs present in packages/ui/docs/normalization/_output: **7/7** (0 through 6)

## RAG Definitions
- Green: prerequisites complete and no open critical blocker.
- Amber: prerequisite complete but legacy-update reconciliation or gate validation still active.
- Red: prerequisite missing or gate failed.

## Program-Level RAG
- Baseline Copy Prerequisite: **Green**
- Batch 2 Foundation Artifacts: **Green**
- Legacy Update Stability Across Apps: **Amber**
  - Reason: legacy-update workstream is active and must remain synchronized while batch execution continues.

## Per-App Tracker
| App | Baseline Copied to feat/ui | Batch 1.5 Evidence in Baseline | Legacy Update Logs | PM Next Action |
| --- | --- | --- | ---: | --- |
| admin-portal | Yes | Yes | 1 | Ready for Batch 2 intake on feat/ui after latest legacy update merge is validated |
| admin-portal-boost | Yes | Yes | 0 | Run legacy update delta-check, then continue Batch 2 intake on feat/ui |
| affiliate-admin | Yes | Yes | 0 | Run legacy update delta-check, then continue Batch 2 intake on feat/ui |
| affiliate-portal | Yes | Yes | 0 | Run legacy update delta-check, then continue Batch 2 intake on feat/ui |
| agent-admin | Yes | Yes | 1 | Ready for Batch 2 intake on feat/ui after latest legacy update merge is validated |
| agent-microsite | Yes | No/Not Recorded | 1 | Ready for Batch 2 intake on feat/ui after latest legacy update merge is validated |
| agent-portal | Yes | Yes | 0 | Run legacy update delta-check, then continue Batch 2 intake on feat/ui |
| agent-web-portal | Yes | Yes | 1 | Ready for Batch 2 intake on feat/ui after latest legacy update merge is validated |
| boost-product-fe | Yes | Yes | 0 | Run legacy update delta-check, then continue Batch 2 intake on feat/ui |
| claim-portal | Yes | Yes | 1 | Ready for Batch 2 intake on feat/ui after latest legacy update merge is validated |
| customer-portal | Yes | No/Not Recorded | 1 | Ready for Batch 2 intake on feat/ui after latest legacy update merge is validated |
| ecommerce-gelm | Yes | Yes | 0 | Run legacy update delta-check, then continue Batch 2 intake on feat/ui |
| ecommerce-teman | Yes | Yes | 0 | Run legacy update delta-check, then continue Batch 2 intake on feat/ui |
| gegm-friendcover | Yes | Yes | 1 | Ready for Batch 2 intake on feat/ui after latest legacy update merge is validated |
| gegm-friendcover-admin | Yes | Yes | 1 | Ready for Batch 2 intake on feat/ui after latest legacy update merge is validated |
| gelm-xproject-microsite | Yes | Yes | 1 | Ready for Batch 2 intake on feat/ui after latest legacy update merge is validated |
| gen-ai-portal | Yes | Yes | 0 | Run legacy update delta-check, then continue Batch 2 intake on feat/ui |
| getrev-da-microsite | Yes | Yes | 0 | Run legacy update delta-check, then continue Batch 2 intake on feat/ui |
| grab-landing-page | Yes | Yes | 0 | Run legacy update delta-check, then continue Batch 2 intake on feat/ui |
| haruuz-microsite | Yes | Yes | 1 | Ready for Batch 2 intake on feat/ui after latest legacy update merge is validated |
| mykawan-website | Yes | Yes | 1 | Ready for Batch 2 intake on feat/ui after latest legacy update merge is validated |
| partner-portal | Yes | No/Not Recorded | 1 | Ready for Batch 2 intake on feat/ui after latest legacy update merge is validated |
| sso-portal | Yes | Yes | 1 | Ready for Batch 2 intake on feat/ui after latest legacy update merge is validated |
| teman-affiliate-admin | Yes | Yes | 1 | Ready for Batch 2 intake on feat/ui after latest legacy update merge is validated |
| teman-affiliate-microsite | Yes | Yes | 1 | Ready for Batch 2 intake on feat/ui after latest legacy update merge is validated |
| teman-affiliate-portal | Yes | Yes | 0 | Run legacy update delta-check, then continue Batch 2 intake on feat/ui |
| ticket-portal | Yes | Yes | 1 | Ready for Batch 2 intake on feat/ui after latest legacy update merge is validated |

## PM Focus This Cycle
1. Keep legacy-update cadence synchronized with Batch 2 intake to avoid drift.
2. Track shared-candidate queue from L5 outputs and sequence into @repo/ui implementation waves.
3. Enforce gate discipline (check-types/lint/build) before status transitions.