# Component Taxonomy (Batch 2 Refresh)

## Snapshot
- Inputs analyzed: 27 per-app baseline summary files
- Current shared export in `@repo/ui`: `Box`
- Canonical shared set for rollout planning: 38 components (including `Box`)

## Tier 1 - Primitives
| Component | Status in @repo/ui | Apps needing |
| --- | --- | --- |
| Box | exists | 27 |
| Button | missing | 15 |
| Input | missing | 25 |
| Textarea | missing | 12 |
| Label | missing | 6 |
| Checkbox | missing | 18 |
| RadioGroup | missing | 7 |
| Switch | missing | 8 |
| Select | missing | 22 |
| Badge | missing | 6 |
| Avatar | missing | 3 |
| Skeleton | missing | 4 |
| Spinner | missing | 2 |

## Tier 2 - Composites
| Component | Status in @repo/ui | Apps needing |
| --- | --- | --- |
| Alert | missing | 16 |
| LoadingWrapper | missing | 17 |
| Card | missing | 7 |
| Form | missing | 7 |
| Table | missing | 8 |
| DataTable | missing | 2 |
| Pagination | missing | 11 |
| Breadcrumb | missing | 8 |
| Tabs | missing | 9 |
| NavigationMenu | missing | 7 |
| Menubar | missing | 2 |
| DropdownMenu | missing | 8 |
| Dialog | missing | 25 |
| Drawer | missing | 4 |
| Popover | missing | 5 |
| Tooltip | missing | 6 |
| Calendar | missing | 6 |
| DatePicker | missing | 18 |
| DateRangePicker | missing | 3 |
| DateTimePicker | missing | 3 |
| Command | missing | 3 |
| Combobox | missing | 3 |
| PageHeader | missing | 3 |
| Image | missing | 10 |
| Accordion | missing | 1 |

## Tier 3 - App Local (Kept Local)
- Domain workflow containers and route pages
- Auth/session/routing orchestration shells
- Brand/campaign specific wrappers
- Data-coupled visualization wrappers
- High-coupling business forms and table schemas

## Consolidation Rules Applied
- Modal/Dialog/BottomSheet/Drewer -> Dialog + Drawer
- InputEmail/InputPhone/InputCurrency/etc -> Input
- SelectAutocomplete/SelectPhoneCode/MultiSelect -> Select family
- FlashMessage/ErrorContent/Notification -> Alert family