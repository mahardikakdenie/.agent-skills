# 11 - Master Component Roadmap

> Batch: Batch 3 - Migration Plan
> Branch: `feat/ui`
> Run date: 2026-03-09
> Input authority: `03-migration-plan.md`, `00`-`06` normalization outputs, and the deduplicated per-app backlog merge in `12-master-backlog.csv`

## 1. Planning Assumptions

### Shared readiness prerequisites

| Prerequisite | Why it must exist before shared rollout | Owner lane | Blocks |
| --- | --- | --- | --- |
| Semantic token preset in `@repo/config` | Shared components cannot depend on app-specific CSS variable drift | `feat/ui` foundation | Batch 3A, Batch 4, and Batch 5 |
| Missing shared dependencies installed and version-locked | `cmdk`, `date-fns`, `@tanstack/react-table`, `tailwindcss-animate`, `react-day-picker`, `vaul`, and required Radix packages gate multiple roadmap entries | `feat/ui` foundation | B4-B5.4 |
| `@repo/ui` remains app-agnostic | No `next/*`, no business logic, no env coupling inside shared components | `feat/ui` packages/ui | All rows |
| `02-api-conventions.md` stays aligned with roadmap amendments | Every roadmap row that cites `02 amendment` must remain mirrored in `02` before implementation starts | `feat/ui` design-system lane | All rows marked `02 amendment` |
| `05` app readiness is honored downstream | Ready vs conditional app adoption must not be bypassed | Downstream app lanes | Batch 5 and Batch 6 |

### Roadmap operating rules

- Box is the only Batch 3 extension item in this rerun.
- Batch 3A must complete immediately after Box planning is locked and before any Wave B4 execution starts.
- Every Batch 4 and Batch 5 component starts with `ComponentName.spec.md`; stories and implementation cannot begin before that spec exists.
- Shared authored JSX must render through `Box`, including semantic HTML and SVG output via `Box as="..."`; do not hand-write native JSX tags in shared component source.
- All non-`Box` shared items remain Batch 4 build scope, regardless of sub-wave sequencing.
- Consumer demand is represented as normalized counts from `05-coverage-baseline.md`, not raw per-app export lists.
- `Spinner` and `Skeleton` remain the only canonical shared loading surfaces; loading wrappers, suspense fallbacks, branded full-page loaders, retry/error-aware shells, and domain-aware loading containers stay app-local unless a future narrower wrapper is explicitly approved.
- `RichTextEditor` now uses a bounded shared Tiptap contract for app-agnostic formatted text entry; uploads, mentions, media, and workflow-specific viewer behavior remain app-local.
- Cross-check on 2026-03-09 confirms the current `@repo/ui` export surface is still `Box` only; no Batch 4 row may move to `DONE` until that changes.

## 2. Batch 3 - Extend Existing

| Component | Tier | Based on | API | New dependencies needed | Structure tier | SDD requirements | Consumer apps | Effort | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Box | 1 (Primitive) | `@radix-ui/react-slot` | `asChild`, `padding`, `container`, `centered` | none | Standard | `Box.Default`, `Box.Padding`, `Box.Container`, `Box.Centered` | Existing primitive; 27-app baseline footprint in `01` | S | Extend only the layout primitive contract; do not absorb app-specific page shells |

## 3. Wave B4 - Core Foundation Build

| Component | Tier | Based on | API | New dependencies needed | Structure tier | SDD requirements | Consumer apps | Effort | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Alert | 2 (Composite) | Tier 1 composition | `02` Alert | none | Standard | `Alert.Default`, `Alert.Variants`, `Alert.WithIcon`, `Alert.Dismissible` | 22 apps; see `05` | S | Presentational feedback only |
| Badge | 1 (Primitive) | none | `02` Badge | none | Simple | `Badge.Default`, `Badge.Variants`, `Badge.Dot` | 11 apps; see `05` | XS | Small visual primitive only |
| Button | 1 (Primitive) | `@radix-ui/react-slot` | `02` Button | none | Standard | `Button.Default`, `Button.Variants`, `Button.Sizes`, `Button.Loading`, `Button.AsChild` | 23 apps; see `05` | M | First broad shared primitive wave |
| Card | 2 (Composite) | Tier 1 composition | `02` Card | none | Standard | `Card.Basic`, `Card.HeaderFooter` | 12 apps; see `05` | S | Structural card only |
| Checkbox | 1 (Primitive) | `@radix-ui/react-checkbox` | `02` Checkbox | `@radix-ui/react-checkbox` | Standard | `Checkbox.Default`, `Checkbox.Indeterminate`, `Checkbox.Disabled` | 20 apps; see `05` | S | Must cover invalid and indeterminate states |
| Dialog | 2 (Composite) | `@radix-ui/react-dialog` | `02` Dialog | `@radix-ui/react-dialog` | Complex | `Dialog.Basic`, `Dialog.Scrollable`, `Dialog.Destructive`, `Dialog.AsyncClose`, `Dialog.A11y` | 26 apps; see `05` | L | Explicit a11y risk gate |
| Drawer | 2 (Composite) | `vaul` | `02` Drawer | `vaul` | Complex | `Drawer.Basic`, `Drawer.Sides`, `Drawer.Scrollable`, `Drawer.FormAction` | 10 apps; see `05` | M | Keep distinct from modal semantics |
| Input | 1 (Primitive) | semantic `input` target via `Box as="input"` | `02` Input | none | Standard | `Input.Default`, `Input.Types`, `Input.WithAffix`, `Input.Error`, `Input.Disabled` | 26 apps; see `05` | M | Core primitive for later waves |
| Label | 1 (Primitive) | `@radix-ui/react-label` | `02` amendment: `htmlFor`, `required`, `disabled`, `tone` | `@radix-ui/react-label` | Simple | `Label.Default`, `Label.Required`, `Label.Disabled` | 10 apps; see `05` | XS | Needed before `Form` |
| Pagination | 2 (Composite) | Tier 1 composition | `02` amendment: `currentPage`, `totalPages`, `onPageChange`, optional `pageSize`, optional navigation-surface `variant` | none | Standard | `Pagination.Default`, `Pagination.WithPageSizeSelector`, `Pagination.Compact`, `Pagination.DisabledState`, `Pagination.ShadowVariant` | 16 apps; see `05` | S | UI navigation only |
| RadioGroup | 1 (Primitive) | `@radix-ui/react-radio-group` | `02` RadioGroup | `@radix-ui/react-radio-group` | Standard | `RadioGroup.Default`, `RadioGroup.Sizes`, `RadioGroup.Disabled`, `RadioGroup.Description`, `RadioGroup.Error` | 11 apps; see `05` | S | Align with `Form` naming and shared validation messaging |
| Select | 1 (Primitive) | `@radix-ui/react-select` | `02` Select | `@radix-ui/react-select` | Standard | `Select.Default`, `Select.Placeholder`, `Select.LongList`, `Select.Disabled`, `Select.DisabledOption`, `Select.Error`, `Select.Clearable`, `Select.CustomOptionContent`, `Select.CompoundComposition` | 25 apps; see `05` | L | Static select only; flat default API plus additive compound migration path |
| Skeleton | 1 (Primitive) | none | `02` Skeleton | none | Simple | `Skeleton.Block`, `Skeleton.Text`, `Skeleton.Card` | 10 apps; see `05` | XS | Small composable primitive |
| Spinner | 1 (Primitive) | none | `02` amendment: `size`, `label`, `inline`, `overlay` | none | Simple | `Spinner.Inline`, `Spinner.Overlay`, `Spinner.Sizes` | 8 apps; see `05` | XS | Separate from wrapper loading |
| Switch | 1 (Primitive) | `@radix-ui/react-switch` | `02` Switch | `@radix-ui/react-switch` | Standard | `Switch.Default`, `Switch.Disabled`, `Switch.Description` | 9 apps; see `05` | XS | Toggle primitive only |
| Table | 1 (Primitive) | semantic table targets via `Box as="table"` and related tags | `02` Table | none | Standard | `Table.Basic`, `Table.Dense`, `Table.Empty` | 12 apps; see `05` | S | Foundation for `DataTable` |
| Tabs | 2 (Composite) | `@radix-ui/react-tabs` | `02` amendment: `value`, `defaultValue`, `onValueChange`, `orientation`, root `variant` (`outline | ghost`), and trigger-level `variant` override | `@radix-ui/react-tabs` | Standard | `Tabs.Default`, `Tabs.DisabledState`, `Tabs.VerticalOrientation`, `Tabs.Scrollable`, `Tabs.ControlledMode` | 13 apps; see `05` | S | Route sync stays local |
| Textarea | 1 (Primitive) | semantic `textarea` target via `Box as="textarea"` | `02` Textarea | none | Standard | `Textarea.Default`, `Textarea.Resize`, `Textarea.Error`, `Textarea.Disabled` | 18 apps; see `05` | S | Plain-text multiline input only |

## 4. Wave B5.1 - Date and Overlay Normalization

| Component | Tier | Based on | API | New dependencies needed | Structure tier | SDD requirements | Consumer apps | Effort | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Breadcrumb | 2 (Composite) | Tier 1 composition | `02` amendment: optional `items[]`, `separator`, `currentLabel`, and additive compound exports | none | Standard | `Breadcrumb.Default`, `Breadcrumb.CurrentItem`, `Breadcrumb.CustomSeparator`, `Breadcrumb.Compound`, `Breadcrumb.LongLabels` | 12 apps; see `05` | S | Shared shell only; supports both flat data trails and compound legacy migration |
| Calendar | 2 (Composite) | `react-day-picker` | `02` Calendar | `react-day-picker`, `date-fns` | Standard | `Calendar.Single`, `Calendar.DisabledDates`, `Calendar.RangePreview` | 9 apps; see `05` | M | Build before picker wrappers |
| DatePicker | 2 (Composite) | `Calendar` + `Popover` | `02` DatePicker | `react-day-picker`, `date-fns`, `@radix-ui/react-popover` | Complex | `DatePicker.Default`, `DatePicker.WithMinMax`, `DatePicker.WithTime`, `DatePicker.ErrorState`, `DatePicker.FormField`, `DatePicker.CustomFormat` | 22 apps; see `05` | L | High-demand date control with Input-aligned shell, optional time entry, and optional display formatting |
| DropdownMenu | 2 (Composite) | `@radix-ui/react-dropdown-menu` | `02` amendment: compound dropdown exports, root `onAction` / `disabled` / `modal` / `variant`, and item-level `variant` overrides | `@radix-ui/react-dropdown-menu` | Complex | `DropdownMenu.Basic`, `DropdownMenu.CheckboxItems`, `DropdownMenu.Submenu`, `DropdownMenu.DisabledState`, `DropdownMenu.ControlledOpen`, `DropdownMenu.ShadowVariant` | 12 apps; see `05` | M | Shared action menu only |
| Form | 2 (Composite) | `react-hook-form` + `Label` + `Input` | `02` Form | none | Complex | `Form.Field`, `Form.Error`, `Form.Description`, `Form.ArrayField` | 9 apps; see `05` | M | Shared field scaffolding only |
| Popover | 2 (Composite) | `@radix-ui/react-popover` | `02` Popover | `@radix-ui/react-popover` | Standard | `Popover.Basic`, `Popover.Form`, `Popover.Controlled` | 9 apps; see `05` | S | Overlay foundation dependency |
| Tooltip | 2 (Composite) | `@radix-ui/react-tooltip` | `02` Tooltip | `@radix-ui/react-tooltip` | Standard | `Tooltip.Basic`, `Tooltip.SideVariants`, `Tooltip.LongContent` | 9 apps; see `05` | XS | Small a11y-sensitive surface |

## 5. Wave B5.2 - Advanced Input and Data Display

| Component | Tier | Based on | API | New dependencies needed | Structure tier | SDD requirements | Consumer apps | Effort | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Avatar | 1 (Primitive) | `@radix-ui/react-avatar` | `02` amendment: `src`, `alt`, `fallback`, `size` | `@radix-ui/react-avatar` | Simple | `Avatar.Image`, `Avatar.Fallback`, `Avatar.Sizes` | 6 apps; see `05` | XS | Visual identity primitive only |
| Combobox | 2 (Composite) | `Command` + `Popover` | `02` Combobox | `cmdk`, `@radix-ui/react-popover` | Complex | `Combobox.Basic`, `Combobox.Search`, `Combobox.Empty`, `Combobox.DisabledOption`, `Combobox.Clearable`, `Combobox.ExternalSearchAndCreate`, `Combobox.CustomOptionContent` | 8 apps; see `05` | L | Searchable selection contract with optional controlled search text, clear reset, parent-owned search refresh, bounded create-on-enter, and custom row rendering |
| DataTable | 2 (Composite) | `Table` + `@tanstack/react-table` v8 | `02` DataTable | `@tanstack/react-table` | Complex | Capability-first matrix: `Sorting`, `ColumnOrdering`, `ColumnPinning`, `ColumnSizing`, `ColumnVisibility`, `ColumnFiltering`, `GlobalFiltering`, `FuzzyFiltering`, `ColumnFaceting`, `GlobalFaceting`, `Grouping`, `Expanding`, `Pagination`, `RowSelection`, `RowPinning`, `StickyHeader`, `StickyFooter`, `Virtualization` | 6 apps; see `05` | XL | Highest-risk data-display item |
| DateRangePicker | 2 (Composite) | `Calendar` + `Popover` | `02` amendment: `value`, `onChange`, optional `changeBehavior`, `presets`, `minDate`, `maxDate`, optional time bounds | `react-day-picker`, `date-fns`, `@radix-ui/react-popover` | Complex | `DateRangePicker.Basic`, `DateRangePicker.CompleteOnlyChange`, `DateRangePicker.Presets`, `DateRangePicker.WithTime`, `DateRangePicker.Invalid` | 7 apps; see `05` | L | Start after `DatePicker` stabilizes; optional start/end times remain in this contract and complete-only parent commits stay generic |
| FileUpload | 2 (Composite) | Tier 1 composition | `02` FileUpload | none | Standard | `FileUpload.Basic`, `FileUpload.Multiple`, `FileUpload.Error`, `FileUpload.Disabled` | 12 apps; see `05` | M | Upload transport stays local |
| Image | 2 (Composite) | semantic `img` target via `Box as="img"` + fallback composition | `02` amendment: `src`, `alt`, `fallback`, `ratio`, `fit` | optional `@radix-ui/react-avatar` fallback pattern | Standard | `Image.Basic`, `Image.Fallback`, `Image.AspectRatio` | 13 apps; see `05` | M | No `next/image` coupling |
| NavigationMenu | 2 (Composite) | `@radix-ui/react-navigation-menu` | `02` amendment: compound `NavigationMenu` surface (`NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink`, `NavigationMenuIndicator`, `NavigationMenuViewport`) plus root `variant` and trigger/link `variant` overrides | `@radix-ui/react-navigation-menu` | Complex | `NavigationMenu.Basic`, `NavigationMenu.ActiveLink`, `NavigationMenu.VerticalOrientation`, `NavigationMenu.AsChildLinks`, `NavigationMenu.DisabledTrigger`, `NavigationMenu.ShadowVariant` | 8 apps; see `05` | M | Route trees stay local; apps map local route data into the shared compound API |
| OtpInput | 2 (Composite) | Tier 1 composition | `02` OtpInput | none | Standard | `OtpInput.Basic`, `OtpInput.Error`, `OtpInput.Disabled` | 6 apps; see `05` | S | Segmented input contract |
## 6. Wave B5.3 - Remaining Medium-Demand Components

| Component | Tier | Based on | API | New dependencies needed | Structure tier | SDD requirements | Consumer apps | Effort | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Accordion | 2 (Composite) | `@radix-ui/react-accordion` | `02` amendment: `type`, `collapsible`, `value`, `onValueChange` | `@radix-ui/react-accordion` | Complex | `Accordion.Basic`, `Accordion.Multiple`, `Accordion.Disabled` | 4 apps; see `05` | M | Lower-demand compound component |
| Command | 2 (Composite) | `cmdk` | `02` amendment: compound `cmdk` surface (`Command`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator`, `CommandShortcut`) | `cmdk` | Complex | `Command.Basic`, `Command.Empty`, `Command.Groups`, `Command.Shortcuts` | 5 apps; see `05` | M | Shared command surface; dialog composition stays on shared `Dialog` |

## 7. Wave B5.4 - Long Tail and Decision-Gated Work

| Component | Tier | Based on | API | New dependencies needed | Structure tier | SDD requirements | Consumer apps | Effort | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Menubar | 2 (Composite) | `@radix-ui/react-menubar` | `02` amendment: compound menubar exports (`Menubar`, `MenubarMenu`, `MenubarTrigger`, `MenubarContent`, `MenubarItem`, `MenubarCheckboxItem`, `MenubarRadioGroup`, `MenubarRadioItem`, `MenubarLabel`, `MenubarSeparator`, `MenubarSub`, `MenubarSubTrigger`, `MenubarSubContent`, `MenubarShortcut`), optional root `onAction`, root `disabled`, root `variant`, and trigger/item/sub-trigger `variant` overrides | `@radix-ui/react-menubar` | Complex | `Menubar.Basic`, `Menubar.SelectionItems`, `Menubar.Submenu`, `Menubar.ControlledValue`, `Menubar.DisabledMenus`, `Menubar.ShadowVariant` | 4 apps; see `05` | M | Long-tail admin demand |
| MonthPicker | 2 (Composite) | `Calendar` + `Popover` | `02` amendment: `value`, `onChange`, `minMonth`, `maxMonth` | `react-day-picker`, `date-fns`, `@radix-ui/react-popover` | Complex | `MonthPicker.Basic`, `MonthPicker.MinMax` | 3 apps; see `05` | M | Distinct month-only contract |
| Timeline | 2 (Composite) | Tier 1 composition | `02` amendment: `items`, `orientation`, `statusTone` | none | Standard | `Timeline.Basic`, `Timeline.Dense`, `Timeline.Status` | 3 apps; see `05` | S | Presentation-only timeline |
| RichTextEditor | 2 (Composite) | `@tiptap/react` + `@tiptap/starter-kit` + `@tiptap/extension-link` | `value`, `onChange`, `toolbar`, `readonly`, `sanitize`, `label`, `helperText`, `error` | `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `dompurify` | Complex | `RichTextEditor.Basic`, `RichTextEditor.Toolbar`, `RichTextEditor.Sanitization`, `RichTextEditor.Readonly` | 1 app; see `05` | XL | Decision gate opened on 2026-03-16 for a bounded shared contract only; uploads, mentions, slash commands, media, and viewer-specific rendering remain app-local. Shared structure coverage currently runs through `Heading 3`, and shared toolbar shortcut coverage should stay limited to the implemented editor surface, with `Mod+K` for link editing and `Mod+Y` as the canonical redo path |

## 8. Roadmap Operating Notes

- This roadmap is the canonical shared-program implementation view layered on top of the raw deduplicated backlog in `12-master-backlog.csv`.
- `consumer apps` in this rerun means normalized demand counts from `05`, not explicit app-name lists.
- Any API marked 2 amendment must be mirrored back into 2-api-conventions.md before implementation starts.
- Batch 3A token bootstrap is a hard gate for every row after Box.
- `RichTextEditor` is no longer engine-blocked, but it remains intentionally narrow and outside the migration path for app-specific editorial workflows.





