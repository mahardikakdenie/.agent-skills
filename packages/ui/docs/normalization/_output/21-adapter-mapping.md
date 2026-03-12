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
- Existing clear affordances or forced-reset flags normalize to `clearable`, and cleared state should flow through `onValueChange(undefined)` so the trigger returns to its placeholder treatment.
- Existing border, background, chevron, and placeholder-style overrides should collapse into the canonical shared surface plus `className`, not into new shared mode props.
- Existing richer option rows with helper text, codes, or lightweight metadata can map to `renderOption`, but trigger text should continue to come from `label`.

Keep local:

- Searchable, filterable, async, or typeahead selection flows; those should migrate to `Combobox`.
- Multi-select, checkbox-list, staged-confirmation, or summary-label pickers.
- Phone-code-specific selection and any select wrapper that still embeds query params, routing, service hooks, or domain-specific option shaping.

## Switch

Direct adoption guidance:

- Legacy settings toggles, binary preference controls, and simple enable-or-disable rows map to `Switch`.
- Existing `checked`, `defaultChecked`, `onChange`, or `onCheckedChange` flows normalize to `checked`, `defaultChecked`, and `onCheckedChange`.
- Inline label text maps to `label`; dense settings rows map to `size="sm"`, while larger touch targets map to `size="lg"`.
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
- Footer totals and summary rows map to `TableFooter`; empty states stay as a full-width `TableCell` inside `TableBody`.

Keep local:

- Sorting, filtering, search slots, pagination controls, expandable rows, row selection orchestration, and loading or retry wrappers; those belong to `DataTable` or app-local shells.
- Domain-specific table cells that compute status, format business entities, trigger navigation, or call services directly.
- Non-tabular mobile card transformations that replace semantic table markup entirely.

## Tabs

Direct adoption guidance:

- Legacy tabsets that already separate a trigger row from panel content map to `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent`.
- Existing controlled `value` plus `onChange` or `onValueChange` flows normalize to `value` and `onValueChange`; simple local-state tabsets can normalize to `defaultValue`.
- Vertical settings rails map to `orientation="vertical"`; wider horizontal trigger sets can rely on the shared overflow behavior instead of adding app-local scroll wrappers directly on the tablist.
- Existing panel bodies should stay consumer-owned and move inside `TabsContent` rather than being flattened into new shared props.

Keep local:

- Route-synchronized tabs, query-param tabs, and any tab wrapper that owns navigation state or deep-link logic.
- Segmented filters, stepped workflows, or binary selection surfaces that are not semantically tab navigation.
- Domain-specific tab containers that still fetch data, compute badge counts, or trigger side effects during tab changes.

## Breadcrumb

Direct adoption guidance:

- Legacy ancestor trails and page-header breadcrumb shells map to `Breadcrumb`.
- Existing ordered breadcrumb arrays normalize to `items`, where each item supplies `label`, optional `href`, and optional `current`.
- Cases where the current page label is rendered separately from ancestor links map to `currentLabel` instead of forcing a duplicate item shape.
- Decorative chevrons, slashes, or similar separators map to the shared `separator` prop.

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

Keep local:

- Menus that still build routes, read permission state, call services directly, or derive item visibility from domain logic.
- Searchable, async, or large command surfaces that belong to `Combobox`, `Command`, or app-local composition.
- Full navigation trees and information architecture concerns that belong to `NavigationMenu`, `Menubar`, or app-local route shells.

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
- Existing placement props such as side, alignment, offset, or preferred edge map to side, lign, and sideOffset on PopoverContent.
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
- Existing `initialValue`, `minimumDate`, `maximumDate`, `isDisabled`, `isForceClear`, `errorMessage`, and `isLongDate` or similar display-format toggles normalize to `value`, `minDate`, `maxDate`, `disabled`, `clearable`, `error`, and `formatDate`.
- Standalone field labels map to `label`; shared form composition should prefer `FormLabel` plus `FormControl` instead of duplicating field wrapper markup.
- Existing visual booleans such as `isWithShadow` and one-off shell-density knobs should prefer the shared `variant`, `size`, or `className` paths instead of new DatePicker-specific styling props.
- Existing clear callbacks should collapse into `onChange(null)` plus `clearable`; month-bound or eligibility windows should map to `minDate` and `maxDate`.

Keep local:

- Date-range, date-time, month-only, preset, or workflow-confirmed picker flows.
- Save/apply buttons, explicit submit callbacks, and business-specific side effects attached to date selection.
- Localization adapters, year-only jumpers, or route/query synchronization that extend beyond the shared single-date field contract.
## Avatar

Direct adoption guidance:

- Legacy profile-photo chips, reviewer identity markers, and compact assignee avatars map to `Avatar`.
- Existing `src`, image URL, or photo fields normalize to `src`; identity text used for accessible image labels should map to `alt`.
- Existing text-tile or initials fallbacks map to `fallback`, or can be omitted when the shared primitive can derive initials from `alt`.
- Existing width and height presets should collapse into the shared `size` scale first, with only minor local polish left to `className`.
- Clickable identity surfaces can keep consumer-owned `onClick`, `role`, and `tabIndex` on the shared root instead of expanding the shared API with navigation props.

Keep local:

- Presence badges, online/offline indicators, and workflow-specific status dots.
- Large responsive media, optimized image pipelines, and framework-coupled image behavior that belong to app-local image wrappers or the later shared `Image` contract.
- Menu triggers, auth-profile dropdowns, and identity widgets that still embed routing, permissions, or service-driven user state.
## Combobox

Direct adoption guidance:

- Legacy searchable single-select fields, assignee pickers, bank pickers, country selectors, and lightweight autocomplete dropdowns map to `Combobox`.
- Existing `selected`, `selectedValue`, `onSelect`, `onChange`, `isLoading`, and `errorMessage` style props normalize to `value`, `onValueChange`, `loading`, and `error`.
- Existing reset affordances map to `clearable`, and richer result rows with secondary metadata can map to `renderOption` while the canonical option text still comes from `label`.
- Existing search input hints map to `searchPlaceholder`; trigger placeholder copy maps to `placeholder`; visible field captions map to `label`.
- Existing local option records should be shaped in the parent as `{ label, value, disabled?, keywords? }` before they cross into the shared component.

Keep local:

- Remote fetching, debounced query orchestration, mutation-backed option creation, and `allowCreate` style behaviors.
- Multi-select, checkbox-list, tag-entry, phone-code, or command-palette variants that exceed the shared single-select contract.
- Domain-specific result rendering, grouped sections, analytics side effects, route syncing, and service-hook wrappers around selection.
## FileUpload

Direct adoption guidance:

- Legacy `UploadFile`, lightweight attachment pickers, and native file-input shells map to `FileUpload`.
- Existing selected-file callbacks should normalize to `onChange` with `File | File[] | null`; browser-level file filters should move to `accept`, `multiple`, and `maxSize`.
- Existing inline validation copy should normalize to `error`, while form-library composition should wrap `FileUpload` with shared `FormControl`, `FormDescription`, and `FormMessage` rather than duplicating field-shell markup.
- Existing reset or remove-all affordances map to `clearable` plus optional `onClear`.

Keep local:

- Upload transport, presigned URL fetches, mutation state, retries, and progress indicators.
- Image previews, cropping, OCR, camera capture flows, and document-type-specific rules such as NRIC or identity verification handling.
- Multi-step upload workflows or domain-specific wrappers that still encode business validation, auth checks, or routing side effects.

## Image

Direct adoption guidance:

- Legacy `Image`, `ImageOrDefault`, and `OptimizeImageShell` style wrappers that only normalize media display, fallback content, or object-fit behavior map to `Image`.
- Existing `src`, `alt`, `width`, `height`, `className`, and click handlers map directly to the shared primitive plus native image attributes.
- Missing-image text tiles such as `"No image available"` map to `fallback`; local `image-or-default` wrappers should collapse into one shared primitive instead of remaining a parallel component family.
- Existing fixed media shells should map to `ratio="square" | "video" | "portrait"` plus `fit="cover" | "contain" | "fill"` instead of app-local wrapper divs and object-fit utility drift.

Keep local:

- `next/image` optimization, blur placeholders, priority loading, fill-layout behavior, and CDN-transform policy.
- Zoom viewers, lightboxes, route-aware click behavior, and media flows that still encode app navigation or business logic.
- Branded marketing art direction, lazy-loading orchestration beyond native image props, and media components that still depend on app-specific service state or asset pipelines.

## OtpInput

Direct adoption guidance:

- Legacy `otp-input.tsx` style segmented verification-code fields map to `OtpInput`.
- Existing `onChange` handlers that currently receive the joined OTP string should normalize to `onValueChange`.
- Existing fixed six-digit flows can rely on the shared default `length={6}`; shorter or longer verification codes should map to the explicit `length` prop.
- Existing visual shell toggles or local dense/minimal OTP chrome should normalize to `variant="default" | "outline" | "ghost"` before adding more app-local styling branches.
- Local invalid or blocked-entry visuals should normalize to `error`, while disabled resend or verification states should map to `disabled`.
- Existing dense or spacious OTP slot treatments should collapse into the shared `size="sm" | "md" | "lg"` scale instead of app-local spacing classes.

Keep local:

- Resend timers, cooldown banners, delivery-channel copy, blocked-attempt dialogs, and route or auth orchestration.
- Submission buttons, verification API calls, and any business rules that decide when a code is valid or when the user may retry.
- App-local wrappers that still combine OTP entry with marketing copy, captcha, or domain-specific success/error workflow handling.

## PageHeader

No shared adapter path is approved for `PageHeader` in this rerun.

Keep local:

- Legacy `PageTitle`, `PageHeader`, and title-row shells remain app-owned composition.
- Back buttons, sticky top bars, language controls, mobile navigation bars, and any shell that owns navigation behavior stay local.
- Framework-specific links, route-aware breadcrumb generation, query-string or history integration, and permission-based action policy stay local.
- Branded hero headers, marketing mastheads, and domain-specific workflow headers stay local.
- Compose lower-level shared primitives such as `Box`, `Card`, `Breadcrumb`, `Badge`, and `Button` inside each app instead of normalizing onto one shared `PageHeader` export.


