# Admin Portal Migration Plan

Updated: 2026-03-25

| Batch | Scope | Status | Notes |
| --- | --- | --- | --- |
| Batch 0.5 | Dependency upgrade and verification gate setup | COMPLETE | Logged on 2026-02-22. |
| Batch 1 | App audit | COMPLETE | Audit locked: ADOPT_NOW 0, ADOPT_WITH_ADAPTER 0, NEW_SHARED_COMPONENT 34, KEEP_APP_LOCAL 235. |
| Batch 1.5 | SoC pre-migration refactor | COMPLETE | 4 splits completed, 34 justified skips, 0 remaining candidates. |
| Batch 5.5 | App consumer bootstrap | COMPLETE | Shared semantic preset imported, required token contract verified in-browser, `--radius` explicit, dark-mode bridge added, gate passed on 2026-03-25. |
| Batch 6 / Batch 1 | ADOPT_NOW app swaps | COMPLETE (NO-OP, reconciled after 5.5) | `_audit-report.md` contains 0 verified ADOPT_NOW targets; status revalidated after the Batch 5.5 bootstrap. |
| Batch 7 / Batch 2 | ADOPT_WITH_ADAPTER app swaps | COMPLETE (NO-OP, reconciled after 5.5) | `_audit-report.md` contains 0 verified adapter targets; status revalidated after the Batch 5.5 bootstrap. |
| Batch 8 / Batch 3 | Later shared-component adoption | BLOCKED / NOT READY | Do not proceed until new app-side targets are delivered from Phase 04 and the current Batch 5.5 gate remains intact. |
| Batch 9 / Batch 4 | Remaining shared-component adoption | BLOCKED / NOT READY | Do not proceed until new app-side targets are delivered from Phase 04 and the current Batch 5.5 gate remains intact. |
| Batch 10 | Cleanup | BLOCKED | Wait until actual app-side adoption batches have completed. |
| Batch 11 | Operational standards / closeout | BLOCKED | Wait until cleanup and final migration verification are complete. |
