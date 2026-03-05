# Coverage Baseline

## Summary

- Raw cross-app shared-demand rows considered: **705**
- Consolidated canonical shared component set: **38** (includes `Box`)
- Existing in `@repo/ui` today: **1** (`Box`)
- To build/extend in Batch 3+: **37**
- Ruled local/deferred by boundary: **199** rows

## Component Coverage Table

| Component | Tier | @repo/ui status | Apps needing | Priority | Target batch |
| --- | --- | --- | --- | --- | --- |
| Box | Tier 1 | ✅ exists | 27 | P0 | B3.0 (locked baseline) |
| Input | Tier 1 | ❌ missing | 25 | P0 | B3.1 |
| Dialog | Tier 2 | ❌ missing | 25 | P0 | B3.2 |
| Select | Tier 1 | ❌ missing | 22 | P0 | B3.1 |
| Checkbox | Tier 1 | ❌ missing | 18 | P0 | B3.1 |
| DatePicker | Tier 2 | ❌ missing | 18 | P0 | B3.3 |
| LoadingWrapper | Tier 2 | ❌ missing | 17 | P1 | B3.2 |
| Alert | Tier 2 | ❌ missing | 16 | P1 | B3.2 |
| Button | Tier 1 | ❌ missing | 15 | P1 | B3.1 |
| Textarea | Tier 1 | ❌ missing | 12 | P1 | B3.1 |
| Pagination | Tier 2 | ❌ missing | 11 | P2 | B3.3 |
| Image | Tier 2 | ❌ missing | 10 | P2 | B3.4 |
| Tabs | Tier 2 | ❌ missing | 9 | P2 | B3.3 |
| Table | Tier 2 | ❌ missing | 8 | P2 | B3.3 |
| DropdownMenu | Tier 2 | ❌ missing | 8 | P2 | B3.3 |
| Switch | Tier 1 | ❌ missing | 8 | P2 | B3.1 |
| Breadcrumb | Tier 2 | ❌ missing | 8 | P2 | B3.3 |
| Form | Tier 2 | ❌ missing | 7 | P2 | B3.1 |
| Card | Tier 2 | ❌ missing | 7 | P2 | B3.3 |
| RadioGroup | Tier 1 | ❌ missing | 7 | P2 | B3.1 |
| NavigationMenu | Tier 2 | ❌ missing | 7 | P2 | B3.3 |
| Badge | Tier 1 | ❌ missing | 6 | P3 | B3.1 |
| Calendar | Tier 2 | ❌ missing | 6 | P3 | B3.3 |
| Tooltip | Tier 2 | ❌ missing | 6 | P3 | B3.2 |
| Label | Tier 1 | ❌ missing | 6 | P3 | B3.1 |
| Popover | Tier 2 | ❌ missing | 5 | P3 | B3.2 |
| Skeleton | Tier 1 | ❌ missing | 4 | P3 | B3.2 |
| Drawer | Tier 2 | ❌ missing | 4 | P3 | B3.2 |
| Avatar | Tier 1 | ❌ missing | 3 | P3 | B3.4 |
| DateTimePicker | Tier 2 | ❌ missing | 3 | P3 | B3.3 |
| DateRangePicker | Tier 2 | ❌ missing | 3 | P3 | B3.3 |
| Command | Tier 2 | ❌ missing | 3 | P3 | B3.4 |
| Combobox | Tier 2 | ❌ missing | 3 | P3 | B3.4 |
| PageHeader | Tier 2 | ❌ missing | 3 | P3 | B3.4 |
| Menubar | Tier 2 | ❌ missing | 2 | P3 | B3.3 |
| DataTable | Tier 2 | ❌ missing | 2 | P3 | B3.4 |
| Spinner | Tier 1 | ❌ missing | 2 | P3 | B3.2 |
| Accordion | Tier 2 | ❌ missing | 1 | P3 | B3.5 |

## Local/Deferred Coverage (Not in Shared Build Queue)

| Bucket | Rows | Decision |
| --- | --- | --- |
| Domain-coupled workflow/page components | 81 | KEEP_APP_LOCAL |
| Unmapped UI wrappers and icon-level wrappers | 105 | Keep local now or collapse into existing canonical shared APIs when reused |
| Total local/deferred | 199 | Excluded from Batch 3 shared build scope |
