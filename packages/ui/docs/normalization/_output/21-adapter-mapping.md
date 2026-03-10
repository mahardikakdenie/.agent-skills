# 21 - Adapter Mapping

> Batch: Batch 4 - Build Shared Components
> Branch: `feat/ui`
> Run date: 2026-03-10

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

## Input

Direct adoption guidance:

- Legacy text, email, password, phone, and numeric field shells map to `Input`.
- Local `errorMessage`, `hasError`, and similar invalid props normalize to `error`; helper and supporting copy map to `helperText`.
- Leading and trailing inline adornments map to `leftIcon` and `rightIcon`; local clear affordances map to `clearable`.
- Existing semantic entry hints such as `isCurrency`, `isFormatNumber`, or phone intent normalize to `inputMode="currency" | "number" | "phone"` while formatting and masking stay local.
- Native form attributes such as `placeholder`, `name`, `autoComplete`, `maxLength`, `min`, and `max` remain standard input props on the shared primitive.

Keep local:

- Currency masking, password-visibility toggles, and phone-code pickers that still require workflow-specific formatting or extra controls.
- Async autocomplete, remote validation, option fetching, or search-result panels that should migrate to `Select`, `Combobox`, or an app-local shell.
- Domain-aware field wrappers that still compute validation copy, submit readiness, or service-side state before rendering.

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

Keep local:

- Branded logo loaders, campaign animations, and library-specific art direction.
- Loading shells that also own retry, empty, or error-state policy, or that depend on domain-specific `title`, `description`, or `actions` decisions.
- Fetch orchestration, delayed-timer policy, and workflow state that decides when loading begins or ends.
