# Component Taxonomy

## Reconciliation Result

Cross-app consolidation was completed before taxonomy lock:
- Raw cross-app shared needs rows: **705**
- Consolidated shared rows: **506**
- Canonical shared component set: **37** (+ existing `Box`)
- Local/deferred rows (not shared in this phase): **199**

## Tier 1 - Primitives

| Component | @repo/ui status (current branch) | Apps needing | Notes |
| --- | --- | --- | --- |
| Box | ✅ exists | 27 | Foundation primitive (Tier 0/Tier 1 base) |
| Button | ❌ missing | 15 | Includes `ButtonCalendar`/`UiButton` consolidation |
| Input | ❌ missing | 25 | Consolidates `Input*` field variants |
| Textarea | ❌ missing | 12 | Standard text-area contract |
| Label | ❌ missing | 6 | Shared field label primitive |
| Checkbox | ❌ missing | 18 | Shared boolean control |
| RadioGroup | ❌ missing | 7 | Shared radio selection |
| Switch | ❌ missing | 8 | Shared binary toggle |
| Select | ❌ missing | 22 | Consolidates `SelectAutocomplete`, `SelectPhoneCode`, `MultiSelect` |
| Badge | ❌ missing | 6 | Shared status label primitive |
| Avatar | ❌ missing | 3 | Shared identity primitive |
| Skeleton | ❌ missing | 4 | Shared loading skeleton primitive |
| Spinner | ❌ missing | 2 | Shared loading spinner primitive |

## Tier 2 - Composites

| Component | @repo/ui status (current branch) | Apps needing | Notes |
| --- | --- | --- | --- |
| Alert | ❌ missing | 16 | Consolidates flash/error/notification patterns |
| LoadingWrapper | ❌ missing | 17 | Canonical loading state wrapper |
| Card | ❌ missing | 7 | Content grouping composite |
| Form | ❌ missing | 7 | `react-hook-form` integration primitives |
| Table | ❌ missing | 8 | Table shell + semantic states |
| DataTable | ❌ missing | 2 | Advanced table behavior |
| Pagination | ❌ missing | 11 | Shared paging control |
| Breadcrumb | ❌ missing | 8 | Route trail composite |
| Tabs | ❌ missing | 9 | Segment/tab navigation |
| NavigationMenu | ❌ missing | 7 | Menu navigation composite |
| Menubar | ❌ missing | 2 | Desktop-style menu bar |
| DropdownMenu | ❌ missing | 8 | Context/action menu |
| Dialog | ❌ missing | 25 | Consolidates modal/sheet dialog patterns |
| Drawer | ❌ missing | 4 | Mobile and side-panel overlays |
| Popover | ❌ missing | 5 | Floating contextual surface |
| Tooltip | ❌ missing | 6 | Hover/focus helper surface |
| Calendar | ❌ missing | 6 | Date grid display composite |
| DatePicker | ❌ missing | 18 | Single-date picking |
| DateRangePicker | ❌ missing | 3 | Range picking |
| DateTimePicker | ❌ missing | 3 | Date+time picking |
| Command | ❌ missing | 3 | Command palette primitive composite |
| Combobox | ❌ missing | 3 | Search + select combo |
| PageHeader | ❌ missing | 3 | Shared title/actions header |
| Image | ❌ missing | 10 | Shared image/fallback display |
| Accordion | ❌ missing | 1 | Expand/collapse content sections |

## Tier 3 - App-Local (Not Extracted in Batch 2)

Rulings from cross-app reconciliation:
- Domain workflow containers and route pages stay local.
  - Examples: claim/payment/declaration flows, dashboard route views, policy detail route containers.
- Branded/marketing identity components stay local.
  - Examples: campaign-specific shells, branded navs, one-off microsite wrappers.
- Data-coupled visualization wrappers stay local in this phase.
  - Examples: app-specific chart composites and KPI wrappers.
- Auth shell and routing orchestration remain local.
  - Route guards/session orchestration are not `@repo/ui` concerns.

## Consolidation Decisions (Section 6.3 Applied)

| Raw candidates observed | Canonical taxonomy decision | Why |
| --- | --- | --- |
| `Modal`, `Dialog`, `BottomSheetModal`, `Drewer` | `Dialog` + `Drawer` only | Same intent, limited API deltas, avoid overlay duplication |
| `InputCurrency`, `InputEmail`, `InputName`, `InputNumber`, `InputPhone`, `InputText` | `Input` | Single primitive with mode/formatter props |
| `SelectAutocomplete`, `SelectPhoneCode`, `MultiSelect` | `Select` family | One select family with mode/search/phone extensions |
| `FlashMessage`, `ErrorContent`, `Notification` | `Alert` family | Same feedback semantics, tokenized variants |
| `Ui*` prefixed wrappers | Base component names | Remove duplicate wrappers and preserve one shared API surface |
