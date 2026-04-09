# 21 - Adapter Mapping

> Batch: Batch 4 - Build Shared Components
> Branch: `feat/ui`
> Run date: 2026-03-10
> Last reconciled: 2026-04-06

## Box

Direct adoption guidance:

- Legacy body wrappers that only add responsive horizontal spacing map to `padding`.
- Legacy page containers that only constrain width map to `container`.
- Legacy wrappers whose only responsibility is centering generic content map to `centered`.

Keep local:

- Route chrome, sidebar/header composition, auth gates, and app-specific page shells.
- Any wrapper that combines layout with domain state, routing, feature flags, or branded presentation.

## Alert

Direct adoption guidance:

- Inline status banners and flash-message shells that render inside normal page flow map to `Alert`.
- Existing success/info/warning/error notification bodies map to `variant=success | info | warning | destructive`.
- Local banner headings and body copy map to `title` and `description`; custom leading visuals map to `icon`.
- App-controlled close buttons map to `dismissible` + `onClose`.

Keep local:

- Toast/snackbar timers, portal positioning, and auto-hide orchestration.
- Modal-style confirmations or blocking error states that should instead migrate to `Dialog` or `Drawer`.
- Alert wrappers that still embed routing, domain recovery actions, or service retry logic beyond a simple callback.

## Badge

Direct adoption guidance:

- Legacy status pills, chips, and compact metadata labels map to `Badge`.
- Existing semantic states such as approved, active, pending, blocked, or failed map to `variant=success | info | warning | destructive | default | secondary | outline` as appropriate.
- Dense table/list labels map to `size="sm"`; general inline labels map to `size="md"`.
- Leading dots remain child composition inside `children` rather than a dedicated shared prop.

Keep local:

- Interactive pills that behave like filters, tabs, or navigation controls.
- Domain status helpers that still compute text, tone, or visibility from business logic before rendering.

## Skeleton

Direct adoption guidance:

- Legacy text, avatar, block, and card placeholder surfaces map to `Skeleton`.
- Existing width and height props or utility-driven shape classes should collapse into `className` on the shared primitive.
- Repeated line groups, table rows, and card shells should stay consumer-composed with `Box`, `Card`, `Table`, or app-local loading wrappers instead of adding shared mode props.
- Standalone placeholders that must be announced can map accessible status behavior through native `role` and `aria-*` props.

Keep local:

- Branded full-page loaders, logo animations, and campaign-specific shimmer treatments.
- Blocking overlay loaders and loading shells that also own copy, retry actions, or orchestration logic.
- Domain-aware loading wrappers that decide when to render skeletons based on service or workflow state beyond plain props.

## Pagination

Direct adoption guidance:

- Legacy pagers that already expose current page and total page count map directly to `currentPage`, `totalPages`, and `onPageChange`.
- APIs using `totalItems`, `totalData`, `limit`, or `itemsPerPage` should compute `totalPages` in the parent surface before rendering `Pagination`.
- Existing rows-per-page selectors map to `pageSize`, `pageSizeOptions`, and `onPageSizeChange`.
- First, previous, next, and last buttons plus numeric page jumps map directly to the shared control set; active-page emphasis maps to the built-in `aria-current="page"` state.
- Legacy elevated pager shells or borderless compact pagers should normalize to `variant="shadow"` or `variant="ghost"`; canonical new usage defaults to `variant="outline"`, while `variant="default"` remains a migration-safe alias for `shadow`.

Keep local:

- Query-string syncing, router state, and table/data fetching orchestration.
- Total-count math tied to backend response shapes or domain pagination metadata.
- Infinite-scroll or cursor-based pagination patterns that are not page-number based.
- Large notification bodies or rich feedback shells that should instead map to `Alert`.

## Button

Direct adoption guidance:

- Legacy CTA, submit, and toolbar action controls map to `Button`.
- Existing primary/filled treatments map to `variant="default"` or `variant="primary"`; outlined actions map to `variant="outline"`; danger maps to `variant="destructive"`; warning maps to `variant="warning"`.
- Legacy `isLoading` or `pending` props map to `loading`; `withIcon` patterns map to `leftIcon` or `rightIcon`.
- Consumer-owned anchors or router wrappers that only need button styling map to `asChild`.

Keep local:

- Auth-provider, SSO, payment, or SDK-backed buttons that encapsulate third-party logic.
- Buttons whose disabled/loading state still depends on domain permissions, workflow guards, or service orchestration beyond plain props.
- Route-aware wrappers that still own navigation construction instead of receiving a child element.

## Card

Direct adoption guidance:

- Legacy neutral content panels, dashboard summary shells, and reusable section containers map to `Card` plus `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter`.
- Existing bordered or elevated card treatments should map to the shared structural surface first, then keep any extra shadow or density tuning in `className`.
- Clickable cards should keep interaction semantics consumer-owned by passing `role`, `tabIndex`, keyboard handlers, and hover classes rather than introducing a shared interactive prop.

Keep local:

- Domain-specific statistic, product, transaction, and plan cards that still encode business formatting, computed labels, or workflow state.
- Cards that encapsulate routing, service orchestration, permission checks, or API-driven side effects beyond plain composition.
- Branded marketing or campaign cards whose identity depends on app-specific illustration systems, copy policy, or campaign logic.

## Accordion

Direct adoption guidance:

- Legacy inline disclosure groups, FAQ rows, coverage-detail expanders, and stacked settings detail sections map to `Accordion`.
- Existing `type`, `defaultValue`, `value`, `onValueChange`, and `collapsible` props map directly to the shared root contract.
- Local `items[]` baselines should be adapted by mapping each item into `AccordionItem`, `AccordionHeader`, `AccordionTrigger`, and `AccordionContent` rather than widening the shared API with a fixed content schema.
- Existing collapsed and expanded visuals should first normalize to the shared bordered disclosure shell, then use `className` for narrow spacing or density parity.

Keep local:

- Accordion-like wrappers that still compute business labels, build routes, or fetch data inline before rendering.
- Disclosure groups whose content is tightly coupled to app-specific workflow state, service orchestration, or domain-only formatting.
- Navigation trees, stepper flows, and menu structures that are semantically different from an inline accordion disclosure pattern.

## Checkbox

Direct adoption guidance:

- Legacy consent checkboxes, settings toggles, and row-selection controls map to `Checkbox`.
- Existing `checked`, `defaultChecked`, `onChange`, or `onCheckedChange` flows normalize to `checked`, `defaultChecked`, and `onCheckedChange`.
- Inline field copy maps to `label`, `description`, and `error`; required indicators stay on `required` instead of app-local suffix markup.
- Partial-selection or "select all" states map to `checked="indeterminate"`.
- Dense list or table controls map to `size="sm"`; general form usage maps to `size="md"`.

Keep local:

- Checkbox groups that still own domain validation, conditional side effects, or submission orchestration.
- Composite multi-select shells that fetch options, compute summaries, or persist selection state beyond a single checkbox field.
- Route- or workflow-specific wrappers that combine checkbox rendering with business copy, navigation, auth, or service logic.

## Drawer

Direct adoption guidance:

- Legacy `Drewer`, `BottomSheetModal`, and `DrawerModal` shells map to `Drawer` plus the shared compound exports (`DrawerTrigger`, `DrawerContent`, `DrawerHeader`, `DrawerFooter`, `DrawerTitle`, `DrawerDescription`, `DrawerClose`).
- Existing mobile sheets map to `direction="bottom"`; inspector or side-panel shells map to `direction="left" | "right"`; top-entry trays map to `direction="top"`.
- Shared copy slots map to `title`, `description`, `actions`, and `footer`; consumer-owned dismiss buttons should compose through `DrawerClose asChild`.
- Controlled app flows should map external close handling to `onClose` while keeping the business state that decides when to open the drawer local.

Keep local:

- Drawers that still embed auth, payment, data fetching, workflow guards, or domain submission logic beyond shell composition.
- Centered modal confirmations that should instead migrate to `Dialog`.
- Branded or campaign-specific sheets whose art direction, animation, or content policy is intentionally app-owned.

## Shared Field-Shell Variant Family

Direct adoption guidance:

- The current shared field-shell components normalize visual chrome through `variant="outline" | "shadow" | "ghost"`, with `outline` as the canonical default for new shared usage.
- Legacy elevated field shells that visually matched the older default treatment should map to `variant="shadow"`; `variant="default"` remains only as a compatibility alias where the shipped component surface still accepts it.
- Older booleans and styling flags such as `withBorder`, `isWithShadow`, `bordered`, `plain`, or muted ghost-style wrappers should collapse into this shared variant family plus `className`, not into new component-specific appearance props.

Scope:

- `Input`, `Textarea`, `Select`, `Combobox`, `DatePicker`, `DateRangePicker`, `MonthPicker`, `FileUpload`, `OtpInput`, and `RichTextEditor`

## Input

Direct adoption guidance:

- Legacy text, email, password, phone, and numeric field shells map to `Input`.
- Very compact or specialized toolbar usage maps to `size="xs"`; dense table/list controls map to `size="sm"`; standard form usage maps to `size="md"`; larger touch targets map to `size="lg"`.
- Local `errorMessage`, `hasError`, and similar invalid props normalize to `error`; helper and supporting copy map to `helperText`.
- Leading and trailing inline adornments map to `leftIcon` and `rightIcon`; local clear affordances map to `clearable`.
- Existing semantic entry hints such as `isCurrency`, `isFormatNumber`, or phone intent normalize to `inputMode="currency" | "number" | "phone"` while formatting and masking stay local.
- Native form attributes such as `placeholder`, `name`, `autoComplete`, `maxLength`, `min`, and `max` remain standard input props on the shared primitive.

Keep local:

- Currency masking, password-visibility toggles, and phone-code pickers that still require workflow-specific formatting or extra controls.
- Async autocomplete, remote validation, option fetching, or search-result panels that should migrate to `Select`, `Combobox`, or an app-local shell.
- Domain-aware field wrappers that still compute validation copy, submit readiness, or service-side state before rendering.

## Textarea

Direct adoption guidance:

- Legacy `Textarea`, `TextArea`, remarks fields, notes boxes, and plain-text description inputs map to `Textarea`.
- Existing invalid props such as `errorMessage`, `hasError`, or `error` normalize to the shared `error` contract; helper or hint copy maps to `helperText`.
- Existing clear buttons or `onClear` handlers collapse into `clearable`, while controlled value flows normalize to `value`, `defaultValue`, `onChange`, and `onValueChange`.
- Native textarea attributes such as `rows`, `maxLength`, `minLength`, `name`, `placeholder`, and `autoComplete` stay on the shared primitive.

Keep local:

- Auto-grow implementations, custom resize modes, or explicit height variants such as `compact`, `auto-grow`, `height`, or `shadow`.
- Rich-text, markdown, mention, upload, or editor-style surfaces.
- Domain-aware wrappers that still compute validation copy, apply business formatting, or trigger workflow side effects while editing.

## RichTextEditor

Direct adoption guidance:

- Legacy rich-text comment, note, or description fields that already emit HTML map to `RichTextEditor`.
- Existing editor callbacks normalize to `value`, `defaultValue`, and `onChange`; compact reply or comment flows map to `toolbar="minimal"`.
- Existing readonly viewers that only need the same formatted shell map to `readonly` plus `toolbar="none"` when the edit chrome should be removed.
- Existing sanitization steps should collapse into the shared default sanitizer unless an app-owned sanitizer function is explicitly required.
- Existing inline editor shortcut hints should collapse into the shared tooltip model for supported actions instead of re-documenting different copy for the same baseline toolbar.
- Existing link-edit keyboard affordances should normalize to the shared `Mod+K` entry point rather than adding app-local toolbar hints for the same interaction.

Keep local:

- Upload, attachment, mention, slash-command, emoji, media embed, or AI-assist editor behavior.
- Viewer shells that still inject domain-specific rendering, entity linking, permission checks, or unsafe HTML exceptions.
- Persistence, autosave, service orchestration, collaboration state, and business validation beyond plain field-level error copy.
- Global keyboard shortcut registration, cross-page command policy, and any editor shortcut overrides that should apply outside the shared field surface.

## Label

Direct adoption guidance:

- Legacy field captions, checkbox labels, radio labels, and simple form-copy wrappers map to `Label`.
- Existing `htmlFor` or `for` linkage should map directly to `htmlFor`; visual required suffixes map to the shared `required` prop.
- Local muted or invalid caption styling should normalize to `tone="muted"` or `tone="destructive"` instead of app-specific color classes.

Keep local:

- Field wrappers that also render helper text, descriptions, validation copy, or layout composition beyond the caption itself.
- Domain-aware captions that still compute copy, localization fallbacks, or workflow state before rendering.
- Route- or form-library-specific wrappers that inject validation orchestration instead of plain label semantics.

## RadioGroup

Direct adoption guidance:

- Legacy single-select option groups, preference pickers, and mutually exclusive form choices map to `RadioGroup` plus `RadioGroupItem`.
- Existing `value`, `defaultValue`, `onChange`, or `onValueChange` flows normalize to `value`, `defaultValue`, and `onValueChange` on the shared root.
- Inline option copy maps to per-item `label` and `description`; group-level validation maps to shared `error` and `required` props.
- Dense filter or settings usage maps to `size="sm"`; standard form usage maps to `size="md"`; more spacious touch targets map to `size="lg"`.
- Horizontal and vertical layouts map to the shared `orientation` prop instead of local layout booleans.

Keep local:

- Domain-aware card selectors or plan selectors that still combine radio semantics with pricing logic, routing, or submission orchestration.
- Option groups that fetch choices, derive labels from business entities, or inject workflow-specific side effects on selection.
- Composite filter shells where the radio group is only one part of a larger domain-specific control.

## Spinner

Direct adoption guidance:

- Legacy `Spinner` and generic `Loader` components that only render an indeterminate activity indicator map to `Spinner`.
- Existing compact and standard loader sizes map to `size="sm" | "md" | "lg"`; visible loading copy maps to `label`.
- In-flow busy states inside buttons, status rows, or small panels map to `inline`.
- Simple dimmed busy states that only need centered indicator treatment can use `overlay`; surrounding page/layout wrapper behavior and fallback composition stay app-local.

Keep local:

- Branded logo loaders, campaign animations, and product-specific loader artwork.
- Timed wrappers, delayed-loading orchestration, and loading shells that also own title/description/action policy.
- Domain-aware fallback components that combine loading with retry, empty-state, or error-state logic; those should stay local and compose `Spinner` / `Skeleton` directly when needed.

## Loading Wrappers and Suspense Fallbacks

Direct adoption guidance:

- Legacy `Loading`, `Loader`, `LoadingWrapper`, and `SuspenseFallback` shells do not map to a canonical shared wrapper in `@repo/ui`.
- Use `Spinner` for indeterminate activity, `Skeleton` for structural placeholders, and compose them directly with `Box`, `Card`, `Table`, or app-local layout shells.
- Keep inline swap behavior, full-page loading swaps, mounted-content blockers, and suspense fallback layout in app code, even when the visual indicator itself comes from shared primitives.
- Reuse local wrapper components per app when they encode recurring layout only for that app, but do not treat them as migration targets into `@repo/ui`.

Admin-portal queue correction note:

- `apps/admin-portal/src/components/ui/loading.tsx` and `apps/admin-portal/src/components/ui/Loading/index.tsx` should not stay in the standalone Batch 4 queue.
- Reconcile those entries to `KEEP_APP_LOCAL`, retain the wrapper API in the app, and swap the internal visual indicator to shared `Spinner` instead of inventing a canonical shared `Loading` wrapper.
- The migration boundary here is primitive adoption, not wrapper extraction: preserve the local `isLoading`, `overlay`, `fullScreen`, `loadingText`, and mounted-content blocking behavior while converging only the spinner implementation.

Keep local:

- Branded logo loaders, campaign animations, and library-specific art direction.
- Loading shells that also own retry, empty, or error-state policy, or that depend on domain-specific `title`, `description`, or `actions` decisions.
- Fetch orchestration, delayed-timer policy, and workflow state that decides when loading begins or ends.

## Dialog

Direct adoption guidance:

- Legacy centered modal shells, confirmation dialogs, and focused form overlays that only standardize backdrop, focus trap, and close behavior map to `Dialog`.
- Legacy `isOpen` + `onClose` modal props map to `open` + `onClose`; legacy width or backdrop override props map to `size` + `className`.
- Existing header/body/footer structures map either to `DialogContent` convenience props (`title`, `description`, `actions`, `footer`) or to the compound exports `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, and `DialogClose asChild`.
- Destructive confirmations stay a Dialog composition concern with `Button variant="destructive"`, not a dialog-level variant.

Keep local:

- Route-aware modal flows, auth gates, domain forms with service hooks, and mutation orchestration that extend beyond shell behavior.
- Mobile bottom sheets, edge-attached panels, and drag-dismiss patterns that should adopt `Drawer` instead of `Dialog`.
- Media viewers, branded modal artwork, and modal stacks with app-specific animation or sequencing policy.

## Select

Direct adoption guidance:

- Legacy static single-select dropdowns map to `Select`.
- Existing `value`, `defaultValue`, `onChange`, or `onValueChange` flows normalize to `value`, `defaultValue`, and `onValueChange`.
- Legacy placeholder props such as `placeholderSelect` collapse into `placeholder`.
- Shared field copy maps to `label`, while inline validation text maps to `error`.
- Very compact or specialized toolbar usage maps to `size="xs"`; dense table/list controls map to `size="sm"`; standard form usage maps to `size="md"`; larger touch targets map to `size="lg"`.
- Existing clear affordances or forced-reset flags normalize to `clearable`, and cleared state should flow through `onValueChange(undefined)` so the trigger returns to its placeholder treatment.
- Existing border, background, chevron, and placeholder-style overrides should collapse into the canonical shared surface plus `className`, not into new shared mode props.
- Existing richer option rows with helper text, codes, or lightweight metadata can map to `renderOption`, but trigger text should continue to come from `label`.

Keep local:

- Searchable, filterable, async, or typeahead selection flows; those should migrate to `Combobox`.
- Multi-select, checkbox-list, staged-confirmation, or summary-label pickers.
- Phone-code-specific selection and any select wrapper that still embeds query params, routing, service hooks, or domain-specific option shaping.

Admin-portal Batch 8 / Batch 4 note:

- The upstream blocker is resolved by the shared compound export surface now available from `@repo/ui`: `Select`, `SelectTrigger`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectValue`, `SelectLabel`, `SelectSeparator`, `SelectScrollUpButton`, and `SelectScrollDownButton`.
- For the 49 current admin-portal files that import from `@/components/ui/select`, the primary migration path is now a direct import-source swap to `@repo/ui` while preserving the existing Radix-style composition and current `value`, `defaultValue`, `onValueChange`, `disabled`, and `className` usage.
- Sites that manually render trigger text inside `<SelectValue>{...}</SelectValue>` can keep that pattern on the shared component; it remains a supported Radix-compatible composition path.
- The shared `SelectTrigger` and `SelectValue` now include `min-w-0`, `overflow-hidden`, and a `select-value-wrapper` slot by default; legacy apps with long selected labels or narrow container constraints no longer need to apply local flex-shrink or width-capping overrides to prevent layout breaks.
- The flat `options` API remains valid and is still the preferred shared default for simple static selects, but admin-portal Batch 8 does not need to flatten existing compound usage during the initial migration.
- Two known legacy cleanups remain app-side and should be handled during migration because they are not part of the shared contract:
  - Replace the local-only `content` prop on `SelectValue` with standard `placeholder` or explicit children.
  - Normalize malformed trees where `SelectContent` is nested inside `SelectTrigger`; the shared component follows the standard Radix sibling structure under `Select`.
- This is a shared API extension, not a thin local adapter path. No app-local state orchestration or business logic is required to bridge the current compound usage surface.

## Switch

Direct adoption guidance:

- Legacy settings toggles, binary preference controls, and simple enable-or-disable rows map to `Switch`.
- Existing `checked`, `defaultChecked`, `onChange`, or `onCheckedChange` flows normalize to `checked`, `defaultChecked`, and `onCheckedChange`.
- Inline label text maps to `label`; dense settings rows map to `size="sm"`, while larger touch targets map to `size="lg"`.
- Disabled rows should map to `disabled`; the shared primitive keeps visible checked-vs-unchecked track contrast without needing app-side opacity wrappers.
- Field-level invalid copy maps to `error`; shared invalid treatment and accessible message wiring stay on the primitive.
- Longer supporting copy remains consumer composition and should link through `aria-describedby` when needed instead of widening the shared primitive contract.

Keep local:

- Toggle-like segmented navigation, filter pills, or tab replacements that are not true binary switches.
- Switch wrappers that trigger routing, service calls, analytics, or domain workflows directly on toggle.
- Validation-heavy field shells that need custom descriptions, inline error policy, or async persistence messaging beyond the shared primitive.

## Table

Direct adoption guidance:

- Legacy structural table primitives and neutral table shells map to `Table` plus `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, and `TableCaption`.
- Existing admin or report-table density tweaks should stay in `className` on the table parts instead of widening the shared primitive with `dense` or `compact` booleans.
- Existing selected-row visuals can map to `data-state="selected"` on `TableRow`.
- Responsive table overflow should stay consumer-owned by wrapping `Table` in a `Box` container with `overflow-x-auto`.
- Footer totals and summary rows map to `TableFooter`; empty states stay as a full-width `TableCell` inside `TableBody`, preferably using a compact icon, a short title, and one supporting line when the empty treatment needs more than plain text.
- Visible captions are optional. Use `TableCaption` only when it adds meaningful context for assistive tech or dense reporting surfaces, not as default table chrome.

Keep local:

- Sorting, filtering, search slots, pagination controls, expandable rows, row selection orchestration, and loading or retry wrappers; those belong to `DataTable` or app-local shells.
- Domain-specific table cells that compute status, format business entities, trigger navigation, or call services directly.
- Non-tabular mobile card transformations that replace semantic table markup entirely.

## DataTable

Direct adoption guidance:

- Legacy admin tables, policy lists, invoice tables, and claims tables that already combine a semantic table shell with client-side sorting, filtering, grouping, or page-number pagination map to `DataTable`.
- Existing headless column definitions should normalize to TanStack `ColumnDef<TData>` records passed through the shared `columns` prop; business formatting should stay inside cell renderers while the shared component owns the shell and row-model plumbing.
- Existing TanStack-based table hooks can normalize to controlled `table` mode by feeding `useDataTable(...)` output into `DataTable` or `DataTableVirtualized`; simpler adapters can stay on the managed `data` + `columns` path.
- Existing row-level visual hooks such as `getRowClassName(item, index)` now map to the shared `getRowClassName={({ row, rowIndex }) => ...}` prop.
- Legacy header styling fields such as `classNameHeading` now need to map by target: shell-level classes belong on `columnDef.meta.headerCellClassName`, while alignment or label-wrapper classes that should ride on the shared sortable trigger belong on `columnDef.meta.headerContentClassName`.
- Legacy body-cell styling fields such as `className` now map to `columnDef.meta.cellClassName`.
- If legacy tables rely on static shell classes for loading alignment or spacing parity, keep those classes on string-valued `columnDef.meta.cellClassName` so the shared loading-row renderer can reuse them on skeleton `<td>` shells. Pinned-column marker attributes and sticky offset styles now stay on the shared path automatically for pinned loading cells.
- Legacy inner-content styling fields such as `contentClassName`, `valueClassName`, or local truncation/alignment helpers now map to `columnDef.meta.cellContentClassName` when the override belongs on the shared overflow-measured body-content wrapper rather than the `<td>` shell.
- Legacy loading placeholder config can stay on the shared loading-row path by mapping width/class tweaks into `columnDef.meta.loadingSkeletonClassName` or bespoke per-column skeleton content into `columnDef.meta.loadingSkeleton`.
- App-local horizontal overflow fades, pinned-column mask offsets, or hover-only custom scrollbars that only exist to signal extra columns should be removed during migration; the shared `DataTable` viewport now owns those pinned-aware cues for both standard and virtualized shells.
- Legacy resize affordances such as tiny icon buttons, hidden drag rails, or separate keyboard-width steppers at the edge of the header should collapse into the shared separator handle instead of surviving as parallel header chrome.
- Existing toolbar search inputs should collapse into consumer-owned `renderToolbar={(table) => ...}` composition. Do not assume the Storybook-only `DataTableToolbar` helper is part of the package public API.
- Existing empty, loading, no-results, and summary rows map to `emptyState`, `loadingState`, `renderStatus`, and `renderFooter`.
- Existing shared pager layouts can keep the shipped table pagination control through `renderPagination={(table) => ...}` plus `DataTablePagination` instead of rebuilding page-number controls from scratch.
- Existing virtualized long lists that still fit a generic tabular contract can normalize to `DataTableVirtualized`; only app-specific virtualization shells that exceed the shared contract should stay local.

Adapter path:

- Direct import is enough when the app already defines TanStack `ColumnDef<TData>` records or can do so inline.
- A thin adapter is expected when the legacy table API still exposes lightweight column config objects plus styling fields such as `classNameHeading`, `className`, or `getRowClassName`.
- Thin adapter shape:
  - Map each legacy column into `ColumnDef<TData>`.
  - Map header-shell classes into `meta.headerCellClassName`.
  - Map header label / sortable-trigger wrapper classes into `meta.headerContentClassName`.
  - Map `className` into `meta.cellClassName`.
  - Keep shell-level loading-parity classes on string `meta.cellClassName`; function-valued cell class hooks still require row context and do not run for the default loading skeleton rows, while pinned-column marker attributes and sticky offset styles stay shared automatically for pinned loading cells.
  - Map inner content-wrapper classes such as `contentClassName` or truncation overrides into `meta.cellContentClassName`.
  - Map per-column loading placeholder classes into `meta.loadingSkeletonClassName`, or full custom placeholder nodes into `meta.loadingSkeleton`, when the app should keep the shared loading row instead of replacing `loadingState`.
  - Delete app-local overflow wrappers, edge fades, and custom horizontal scrollbar chrome when they only exist to hint at hidden columns; the shared viewport shell now handles reveal timing and pinned-column cue insets.
  - Delete app-local resize buttons, drag indicators, or keyboard width steppers when they only exist to make column sizing discoverable; the shared handle now owns the header gutter, focus treatment, and keyboard resizing path.
  - Delete app-local sticky-centering wrappers or container-width math from `emptyState`, `loadingState`, and `renderStatus` content; the shared `DataTableViewport` now provides `[container-type:inline-size]` plus a sticky `w-[100cqw]` centering shell so status content stays visually anchored during horizontal scrolling.
  - Map `getRowClassName(item, index)` into `getRowClassName={({ row, rowIndex }) => legacyGetRowClassName?.(row.original, rowIndex)}`.  - Keep sorting, filtering, pagination, routing, and business actions in the app adapter or parent surface.

Admin-portal Batch 8 / Batch 4 note:

- The upstream blocker is resolved at the shared `@repo/ui` contract level.
- Admin-portal should migrate through a thin adapter rather than through DOM class patching or a widened app-specific shared API.
- No admin-only classes, variants, or behavior moved into `@repo/ui`; only the generic styling surfaces were added.

Keep local:

- Data fetching, query orchestration, backend pagination cursors, optimistic updates, row-level mutations, and service-hook wiring.
- Domain-specific row selection workflows, mobile card fallbacks, or draggable interactions that exceed the shipped shared contract.
- Route-aware row clicks, permission-driven action visibility, bulk workflows, and business-specific filter semantics before data reaches the shared table.

## Tabs

Direct adoption guidance:

- Legacy tabsets that already separate a trigger row from panel content map to `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent`.
- Existing controlled `value` plus `onChange` or `onValueChange` flows normalize to `value` and `onValueChange`; simple local-state tabsets can normalize to `defaultValue`.
- Vertical settings rails map to `orientation="vertical"`; wider horizontal trigger sets can rely on the shared overflow shell, edge fade cues, and the shared scrollbar affordance that reveals on hover, thumb drag, or brief shell keyboard panning instead of adding app-local scroll wrappers directly on the tablist.
- App-local fade masks, hover-only custom scrollbars, or separate shell-level arrow/page panning that only exist to support long horizontal rails should collapse into the shared `TabsList` shell rather than wrapping the tab row again.
- Existing panel bodies should stay consumer-owned and move inside `TabsContent` rather than being flattened into new shared props.
- Older transparent or low-chrome tab treatments should normalize to root `variant="ghost"`; standard shared usage stays on `variant="outline"`; underline-led admin rails can normalize to `variant="underline"`; and individual `TabsTrigger` instances can still override between the three shipped treatments locally.

Keep local:

- Route-synchronized tabs, query-param tabs, and any tab wrapper that owns navigation state or deep-link logic.
- Segmented filters, stepped workflows, or binary selection surfaces that are not semantically tab navigation.
- Domain-specific tab containers that still fetch data, compute badge counts, or trigger side effects during tab changes.

## Breadcrumb

Direct adoption guidance:

- Legacy ancestor trails and page-header breadcrumb shells map to `Breadcrumb`.
- Existing ordered breadcrumb arrays normalize to the canonical flat `items` API, where each item supplies `label`, optional `href`, and optional `current`.
- Existing JSX-authored breadcrumb trees can migrate directly to the additive compound shared exports: `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, and `BreadcrumbSeparator`.
- Cases where the current page label is rendered separately from ancestor links map to `currentLabel` instead of forcing a duplicate item shape.
- Decorative chevrons, slashes, or similar separators map to the shared `separator` prop; the same root-level separator also feeds compound `BreadcrumbSeparator` instances by default.
- Framework links and callback-style crumbs stay app-local through `BreadcrumbLink asChild`, so `next/link`, router adapters, and button handlers do not move into `@repo/ui`.

Keep local:

- Framework-specific link wrappers such as `next/link`, router adapters, and query-string-aware navigation helpers.
- Breadcrumb containers that still compute labels from domain entities, route params, or permission state before rendering.
- Overflow menus, collapsed breadcrumb disclosure, or route-tree behavior that exceeds the flat shared trail contract.

## Calendar

Direct adoption guidance:

- Legacy inline day-grid calendars map to `Calendar`.
- Existing single-date, multi-date, and date-range selection flows normalize to `mode="single" | "multiple" | "range"` plus shared `selected` and `onSelect` handling.
- Disabled-date rules such as weekends, closed dates, and min/max bounds map to DayPicker `disabled` matchers and month/year navigation bounds (`fromMonth`, `toMonth`, `fromYear`, `toYear`).
- Existing month and year browsing controls should collapse into the shared DayPicker navigation contract (`captionLayout`, `month`, `defaultMonth`, `onMonthChange`) instead of app-local button APIs.

Keep local:

- Triggered field shells with labels, placeholders, validation copy, and clear actions that belong to `DatePicker`, `DateRangePicker`, or app-local form composition.
- Business-specific date presets, route/query synchronization, and submission logic.
- Date-time, month-only, and rich preset pickers that exceed the inline calendar-grid contract.

## DropdownMenu

Direct adoption guidance:

- Legacy action menus, kebab menus, row menus, and compact toolbar menus map to `DropdownMenu` plus its compound exports.
- Existing click handlers that dispatch a string action can normalize to root-level `onAction` plus per-item `value`.
- Existing grouped sections, non-interactive headings, and divider rows map to `DropdownMenuGroup`, `DropdownMenuLabel`, and `DropdownMenuSeparator`.
- Existing toggle and view-mode menu rows map to `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, and `DropdownMenuRadioItem` instead of custom icon + ARIA wiring.
- Existing nested export or more-actions groups map to `DropdownMenuSub`, `DropdownMenuSubTrigger`, and `DropdownMenuSubContent`.
- Legacy elevated action rows or transparent toolbar menus should normalize to root `variant="shadow"` or `variant="ghost"`; individual rows and submenu triggers can still override `variant` locally, and legacy `variant="default"` remains a migration-safe alias for `shadow`.

Keep local:

- Menus that still build routes, read permission state, call services directly, or derive item visibility from domain logic.
- Searchable, async, or large command surfaces that belong to `Combobox`, `Command`, or app-local composition.
- Full navigation trees and information architecture concerns that belong to `NavigationMenu`, `Menubar`, or app-local route shells.

## Menubar

Direct adoption guidance:

- Legacy persistent desktop command bars and top-level action menus map to `Menubar` plus its compound exports.
- Existing local menu arrays should stay app-shaped in the parent and be mapped into `MenubarMenu`, `MenubarTrigger`, `MenubarContent`, and `MenubarItem` instead of widening the shared API back into a flat `items[]` contract.
- Existing shortcut labels map to `MenubarShortcut`; grouped headings and separators map to `MenubarLabel` and `MenubarSeparator`.
- Existing toggleable view preferences map to `MenubarCheckboxItem`, `MenubarRadioGroup`, and `MenubarRadioItem`, while nested export or share branches map to `MenubarSub`, `MenubarSubTrigger`, and `MenubarSubContent`.
- Existing click handlers that dispatch a simple action string can normalize to root-level `onAction` plus per-item `value`.
- Older raised command bars or transparent trigger rows should normalize to root `variant="shadow"` or `variant="ghost"`; triggers, items, and submenu triggers can still override `variant` locally, and legacy `variant="default"` remains a migration-safe alias for `shadow`.

Keep local:

- Route-aware app chrome, top nav bars, breadcrumb shells, and information architecture that depend on routing or page layout policy.
- Permission-based command visibility, global keyboard shortcut registration, service calls, and business-specific command derivation.
- Contextual icon-button menus that should stay on `DropdownMenu`, and large searchable command surfaces that should stay on `Command` or app-local composition.

## NavigationMenu

Direct adoption guidance:

- Legacy top-nav and marketing-site navigation menus map to `NavigationMenu` plus its compound exports.
- Existing local route arrays should stay app-shaped in the parent and be mapped into `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, and `NavigationMenuLink` instead of widening the shared API back into a flat `items[]` contract.
- Existing current-route styling should normalize to `NavigationMenuLink active`, while framework-specific routing still composes locally through `asChild`.
- Existing richer mega-menu panels should map to `NavigationMenuContent` plus `NavigationMenuViewport`, with all inner destinations still rendered through `NavigationMenuLink`.
- Existing active-trigger affordances map to `NavigationMenuIndicator` instead of app-local underline or arrow wrappers.
- Older raised nav pills or low-chrome marketing rails should normalize to root `variant="shadow"` or `variant="ghost"`; triggers and links can still override `variant` locally, and legacy `variant="default"` remains a migration-safe alias for `shadow`.

Keep local:

- Route-tree generation, auth gating, locale-aware href shaping, and permission-based visibility.
- Mobile drawer navigation, sidebar collapse behavior, and page-shell layout orchestration.
- Analytics, routing side effects, and framework adapters such as `next/link` wrappers beyond the shared `asChild` path.

## Form

Direct adoption guidance:

- Legacy `form.tsx` field shells, RHF controller wrappers, and shared field-copy helpers map to `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, and `FormMessage`.
- Existing `Controller` render blocks that only standardize label, description, and error wiring should collapse into `FormField` plus the shared compound slots.
- Existing helper text and validation message elements should map to `FormDescription` and `FormMessage` instead of ad-hoc `p` tags or duplicated per-app wrappers.
- Existing repeated field patterns should keep `useFieldArray` in app code and render repeated `FormField` items rather than introducing a second shared array abstraction.

Keep local:

- Zod schemas, mutation handlers, domain validation rules, submit orchestration, and multi-step workflow state.
- Form shells that still embed business copy, navigation side effects, API calls, or auth and permission logic.
- Field wrappers that intentionally diverge for product-specific layout, marketing copy, or workflow choreography beyond shared accessibility wiring.

## Popover

Direct adoption guidance:

- Legacy floating detail panels, compact filter cards, anchored inline forms, and lightweight contextual overlays map to Popover plus PopoverTrigger, PopoverContent, PopoverClose, and PopoverAnchor when a non-modal floating surface is the real interaction pattern.
- Existing open / onOpenChange, isOpen / onClose, or uncontrolled toggle flows normalize to open, defaultOpen, onOpen, and onClose on the shared root.
- Existing placement props such as side, alignment, offset, or preferred edge map to `side`, `align`, and `sideOffset` on `PopoverContent`.
- Existing layouts that anchor the overlay to a chip, status pill, or inline marker instead of the trigger map to PopoverAnchor rather than new positioning booleans.
- Existing inner forms or compact detail layouts should compose shared primitives such as Box, Button, Input, and Form inside PopoverContent instead of widening the popover contract.

Keep local:

- Action-list menus, row menus, and selectable command lists; those should stay on DropdownMenu, Command, or app-local menu composition.
- Hover-only or brief hint content that fits the Tooltip interaction model.
- Modal confirmations, blocking workflows, and flows that require dialog semantics or stronger labeling and focus isolation.
- Domain-specific overlay state tied to routing, auth, service hooks, or business entity shaping.

## Tooltip

Direct adoption guidance:

- Legacy hover-help wrappers and assistive hint components map to `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent`, and optional `TooltipArrow`.
- Existing flat props such as `content`, `position`, and `delay` normalize to `TooltipContent` children, `side`, and `delayDuration`.
- Existing grouped timing behavior across dense icon rows should move to `TooltipProvider` instead of repeating custom timers in each tooltip instance.
- Existing `isShow={false}` or equivalent flags that intentionally suppress tooltip rendering map to `disabled`.
- App-specific `backgroundColor`, `textColor`, and `arrowColor` props should collapse into the shared tokenized surface plus `className` instead of widening the shared API.

Keep local:

- Rich contextual panels, compact forms, and larger explanatory overlays that should adopt `Popover`.
- Action lists, nested commands, and menu-like surfaces that belong to `DropdownMenu`.
- Business-specific tooltip content that depends on routing, service state, or domain formatting before the helper text is produced.

## DatePicker

Direct adoption guidance:

- Legacy single-date popover fields and date-trigger buttons map to `DatePicker`.
- Mobile-specific bottom sheet pickers or date modals map to `presentation="drawer"`.
- Existing `initialValue`, `minimumDate`, `maximumDate`, `isDisabled`, `isForceClear`, `errorMessage`, and `isLongDate` or similar display-format toggles normalize to `value`, `minDate`, `maxDate`, `disabled`, `clearable`, `error`, and `formatDate`.
- Very compact or specialized toolbar usage maps to `size="xs"`; dense table/list controls map to `size="sm"`; standard form usage maps to `size="md"`; larger touch targets map to `size="lg"`.
- Standalone field labels map to `label`; shared form composition should prefer `FormLabel` plus `FormControl` instead of duplicating field wrapper markup.
- Existing visual booleans such as `isWithShadow` and one-off shell-density knobs should prefer the shared `variant`, `size`, `className`, or `classNames` paths instead of new DatePicker-specific styling props.
- Existing clear callbacks should collapse into `onChange(null)` plus `clearable`; month-bound or eligibility windows should map to `minDate` and `maxDate`; single-value date-time flows should enable `withTime` and use `minDateTime` / `maxDateTime` where needed.
- Legacy date-only popover fields should keep the shared calendar as the primary surface instead of adding a second decorative wrapper; framed side-rail chrome belongs only to `withTime` usage.

Keep local:

- Month-only, preset-heavy, or workflow-confirmed picker flows that exceed the shared single-date contract.
- Save/apply buttons, explicit submit callbacks, and business-specific side effects attached to date selection.
- Localization adapters, year-only jumpers, or route/query synchronization that extend beyond the shared single-date field contract.

## DateRangePicker

Direct adoption guidance:

- Legacy date-range dropdowns, report-window pickers, and bounded start/end filter fields map to `DateRangePicker`.
- Very compact or specialized toolbar usage maps to `size="xs"`; dense table/list controls map to `size="sm"`; standard form usage maps to `size="md"`; larger touch targets map to `size="lg"`.
- Existing `defaultFromDate`, `defaultEndDate`, `onDateChange`, and similar split start/end callbacks should normalize to one `value` object plus `onChange`.
- Existing min/max range bounds map directly to `minDate` and `maxDate`; date-time range bounds map to `minDateTime` and `maxDateTime` when `withTime` is enabled.
- Existing reset affordances should collapse into `clearable` plus `onChange(null)`.
- Legacy flows that should only commit after both boundaries are chosen should map to `changeBehavior="complete"` instead of adding an app-local buffering adapter.
- Existing generic shortcuts such as "last 7 days" or "this month" should normalize to `presets`, provided they do not encode business rules or workflow side effects.
- Plain date-only range pickers should keep the shared two-month calendar as the main bare surface; framed popover chrome belongs to `withTime` or explicit preset rows.
- Shared form composition should provide visible labels through `FormLabel` and `FormControl` rather than widening the picker contract with another label prop.

Keep local:

- Save/apply buttons, explicit submit flows, and business-specific side effects attached to range selection.
- Domain-specific or server-driven preset logic, route/query synchronization, and analytics orchestration.
- Month-only, quarter, or localized workflow pickers that exceed the shared start/end range contract.

Admin-portal Batch 8 / Batch 4 note:

- The dashboard filter picker can now migrate directly to shared `DateRangePicker` by mapping the existing shared `dateRange` state to `value`, wiring the existing setter to `onChange`, and setting `changeBehavior="complete"` so URL/query updates still wait for a full range.
- No app-local adapter state is required; the shared picker keeps incomplete selections visible internally until the end date is chosen.

## Avatar

Direct adoption guidance:

- Legacy profile-photo shells, initials badges, assignee thumbnails, and compact identity chips map to `Avatar`.
- Existing `imageUrl`, `profilePicture`, `avatarSrc`, or similar props normalize to `src`; existing `name`, `fullName`, or `altText` copy normalizes to `alt`.
- Local initials, placeholder text, or icon tiles should collapse into `fallback` instead of keeping a second avatar-with-default wrapper.
- Existing size booleans or numeric avatar presets should normalize to `size="sm" | "md" | "lg" | "xl"`.
- Consumer-owned click behavior should remain local through standard HTML props or wrapper composition rather than adding shared navigation props.

Keep local:

- Presence dots, stacked avatar groups, role badges, and online-state decoration.
- Route-aware profile links, analytics hooks, or business-specific identity formatting.
- Large responsive media, hero portraits, or optimized image delivery that should adopt `Image` or app-local framework image wrappers.

## Combobox

Direct adoption guidance:

- Legacy searchable single-select fields, searchable dropdown buttons, and filter pickers map to `Combobox`.
- Very compact or specialized toolbar usage maps to `size="xs"`; dense table/list controls map to `size="sm"`; standard form usage maps to `size="md"`; larger touch targets map to `size="lg"`.
- Existing selected id or code values normalize to `value`; existing `onChange`, `setValue`, or `onSelect` callbacks normalize to `onValueChange`.
- Existing controlled search-query props or state normalize to `searchValue`, while query-change handlers normalize to `onSearchValueChange`.
- Existing option arrays should map to `options` with `{ label, value, disabled?, keywords? }` instead of widening the shared API with app-shaped records.
- Existing field labels, required markers, validation text, loading states, and reset affordances map to `label`, `required`, `error`, `loading`, and `clearable`.
- Parent-owned remote search stays outside the shared package: optionally control the visible query through `searchValue`, wire the local debounced or async handler to `onSearchValueChange`, refresh `options` in the parent, and use `loading` for the in-flight state when the shared loading row matches the intended UX.
- Bounded create-on-enter flows now map to `onCreateOption` plus `createOptionLabel`; the parent remains responsible for defining the created option, updating `options`, and driving the selected `value`.
- Rich option rows should move into `renderOption` while trigger text still resolves from `option.label`.

Keep local:

- Debounce implementation, remote fetching, transport, caching, and server-driven filtering orchestration.
- Searching helper copy or other non-blocking status text that should remain separate from the shared loading row.
- Multi-select, tagging, multi-step creation flows, phone-code-specific picker behavior, and domain-specific create semantics beyond a generic create callback.
- Domain-specific option shaping, analytics, routing side effects, or permission logic beyond plain props.

Admin-portal Batch 8 / Batch 4 note:

- The legacy customer picker in `apps/admin-portal/src/app/transaction/list/add/page.tsx` can now migrate directly to shared `Combobox` by mapping `id/name` records into shared `options`, wiring the existing debounced search function to `onSearchValueChange`, and moving the add-new customer branch into `onCreateOption` with `createOptionLabel`.
- The legacy `SelectAutocomplete` wrapper in `apps/admin-portal/src/components/ui/Fields/SelectAutocomplete/index.tsx` is not a second shared-component target. Reconcile it to the same shared `Combobox` contract instead of queuing standalone shared-ui intake for `SelectAutocomplete`.
- That wrapper's controlled `searchValue` prop can now map directly to shared `searchValue`, so the remaining parity question is downstream migration shape, not shared-component identity.
- No app-local debounce, fetch, searching-state copy, or business creation logic moves into `@repo/ui`; only the field shell, query control, list interaction, and bounded create affordance become shared.

## Command

Direct adoption guidance:

- Legacy searchable command palettes, quick-action lists, and inline command menus map to `Command` plus `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, `CommandEmpty`, `CommandSeparator`, and `CommandShortcut`.
- Existing flat action arrays should stay app-shaped in the parent and be rendered into compound command items rather than widening the shared API back into `items[]`.
- Palette-style overlays should compose `Command` inside the shared `Dialog` primitives instead of introducing a separate `CommandDialog` wrapper.
- Existing search-value control, custom ranking, and keyboard loop behavior should normalize to the underlying cmdk root props already exposed by `Command`.

Keep local:

- Route execution, analytics tracking, permission checks, and business-specific action handlers.
- Remote fetching, debounced transport, and domain-aware result formatting.
- Form-field selection flows that should instead adopt `Combobox`, and non-searchable action menus that should stay on `DropdownMenu`.

## FileUpload

Direct adoption guidance:

- Legacy attachment pickers, supporting-document inputs, and lightweight upload entry fields map to `FileUpload`.
- Existing `file`, `files`, `selectedFiles`, or similar local state should normalize to `value`; selection callbacks normalize to `onChange`.
- Existing persisted filename strings or already-uploaded file labels should map to `displayValue` instead of widening `value` away from the shared `File | File[] | null` contract.
- Existing accepted-format, multiple-selection, max-size, label, invalid-state, and clear/reset behavior map to `accept`, `multiple`, `maxSize`, `label`, `error`, `clearable`, and `onClear`.
- Sequential multi-file picks should append through the shared component rather than replacing the entire selection list in parent code.
- The shared dropzone already provides direct drag-and-drop feedback and release-state copy, so local wrappers should not recreate competing hover-only drop targets around the same field.

Keep local:

- Upload transport, presigned URL flows, progress indicators, retry logic, and auth-aware file handling.
- Image cropping, camera capture, OCR, preview galleries, and identity-document workflows.
- Domain-specific validation rules or submission orchestration beyond generic file selection and size checks.

Admin-portal Batch 8 / Batch 4 note:

- The upstream blocker is resolved by the shared `displayValue` prop on `FileUpload`. Admin-portal can now show the existing filename string it stores in claim form state without forcing `@repo/ui` to accept non-`File` values on `value`.
- The admin-portal claim upload page should migrate through a thin local adapter, not a direct import, because its `onFileChange({ file, base64, fileName })` contract still performs app-owned `FileReader` to base64 conversion for claim payload assembly.
- Thin adapter shape:
  - Map legacy `value` to shared props with `value={typeof value === 'string' || Array.isArray(value) ? null : value}` and `displayValue={typeof value === 'string' || Array.isArray(value) ? value : null}`.
  - Map legacy `onChange(file)` directly from shared `onChange` for any callers that still need the raw `File`.
  - Map legacy `onFileChange` inside the adapter by reading the selected shared `File` into a data URL locally, then calling the existing app callback with `{ file, base64, fileName }`.
  - Keep `accept`, `disabled`, `label`, `error`, and `clearable` as straight pass-through props.
- Do not move base64 conversion into `@repo/ui`. It is a claim-page data-shaping concern, not generic selection UI behavior.

## Image

Direct adoption guidance:

- Legacy generic thumbnails, preview cards, logos, and image-with-fallback shells map to `Image`.
- Existing `src`, `imageUrl`, `thumbnail`, or nullable image props normalize to `src`; local placeholder content should collapse into `fallback`.
- Existing aspect-ratio wrapper classes should normalize to `ratio="auto" | "square" | "video" | "portrait"` where the layout pattern is shared.
- Existing object-fit classes or booleans should normalize to `fit="cover" | "contain" | "fill"`.
- Consumer-owned click handlers or wrapper semantics should remain local rather than introducing image-specific navigation props.

Keep local:

- `next/image` optimization, blur placeholders, priority loading, and CDN transform logic.
- Lightboxes, zoom viewers, gallery orchestration, and media-fetch lifecycles.
- Business-specific media formatting, routing, or analytics behavior beyond the shared display shell.

## MonthPicker

Direct adoption guidance:

- Legacy month-year-only picker fields, billing-month selectors, and reporting-period month dropdowns map to `MonthPicker`.
- Very compact or specialized toolbar usage maps to `size="xs"`; dense table/list controls map to `size="sm"`; standard form usage maps to `size="md"`; larger touch targets map to `size="lg"`.
- Existing month state and callbacks should normalize to `value` and `onChange`; emitted values should stay month-only instead of preserving hidden day-level state.
- Existing min/max month bounds normalize to `minMonth` and `maxMonth`; clear/reset affordances normalize to `clearable`; custom empty-state messaging normalizes to `placeholder`.
- Input-like style toggles should prefer the shared `variant`, `size`, or `className` paths instead of introducing new month-picker-specific booleans.
- Shared form composition should provide visible labels through `FormLabel` and `FormControl` rather than widening the picker API with a second label contract.

Keep local:

- Quarter pickers, year-only selectors, preset-heavy period flows, and workflow-confirmed month submission patterns.
- Save/apply buttons, route/query synchronization, and business-specific side effects tied to month selection.
- Localization adapters or domain validation rules that exceed the shared month-only field contract.

## OtpInput

Direct adoption guidance:

- Legacy segmented verification-code, PIN, and one-time-password fields map to `OtpInput`.
- Very compact verification fields map to `size="sm"`; standard form usage maps to `size="md"`; larger touch targets map to `size="lg"`.
- Existing `code`, `otp`, `pin`, or similar string state should normalize to `value`; change handlers normalize to `onValueChange`.
- Existing slot-count props should normalize to `length`; shared visual styling should normalize to `variant` and `size`; invalid-state copy should map to `error`.
- Existing first-slot focus behavior should map to `autoFocus`, while built-in digit sanitization, paste distribution, and focus advance replace app-local key handling.

Keep local:

- Resend timers, attempt limits, cooldown state, and verification API orchestration.
- Success states, delivery-channel messaging, submit-button behavior, and modal or page shell logic.
- Domain-specific security rules or workflow branching beyond basic segmented code entry.

## Timeline

Direct adoption guidance:

- Legacy status histories, milestone trackers, and ordered progress summaries map to `Timeline`.
- Existing local event arrays should normalize to `items` with `id`, `title`, `description`, and optional `statusTone`.
- Existing vertical or horizontal milestone layouts should normalize to `orientation="vertical" | "horizontal"`.
- Shared semantic marker emphasis should prefer the top-level `statusTone`, while per-item event meaning should stay on each item record.
- Dense or quiet timeline layouts should tune spacing through `className` instead of reintroducing boolean size props.

Keep local:

- Interactive steppers, gantt views, schedulers, and drag-and-drop workflow boards.
- Sorting, filtering, fetching, or route-aware actions attached to each event row.
- Domain-specific date formatting, actor metadata, and business logic beyond presentation-only ordered history.
