# 01 - Component Taxonomy

> **Batch:** Batch 2 - Design System Foundation
> **Branch:** `feat/ui`
> **Run date:** 2026-03-06
> **Inputs:** 27 per-app baseline summaries + `06-component-standards.md`
> **Current `@repo/ui` export:** `Box` only

---

## Summary

| Metric | Count |
|---|---|
| Canonical shared set (Tiers 1-2) | 42 (including `Box`) |
| Already in `@repo/ui` | 1 (`Box`) |
| Tier 1 to build | 13 |
| Tier 2 to build | 28 |
| To build / extend | 41 |

---

## Tier 1 - Primitive Components

> Atomic, single-element. Wrap a single Radix UI primitive or semantic DOM target through `Box as="..."` rather than authored native JSX tags. All require `React.forwardRef`, `displayName`, and exported props interface.
> Source: `06-component-standards.md 1`

| Component | Canonical Export | Radix Primitive | `@repo/ui` Status | Apps Needing | Notes |
|---|---|---|---|---|---|
| Box | `Box` | `@radix-ui/react-slot` | [x] exists | 27 | Polymorphic layout primitive; `as` prop; element eliminator |
| Button | `Button` | `@radix-ui/react-slot` | [ ] missing | 23 | Consolidates: `Button`, `UiButton`, `button.tsx` across 15+ apps |
| Input | `Input` | semantic input target via `Box as="input"` | [ ] missing | 26 | Consolidates: `Input`, `InputText`, `InputEmail`, `InputPhone`, `InputCurrency`, `InputName`, `InputNumber`, `FormInput`, `UiInput` |
| Textarea | `Textarea` | semantic textarea target via `Box as="textarea"` | [ ] missing | 18 | Consolidates: `Textarea`, `TextArea`, `TextInput` (text-area variant) |
| Label | `Label` | `@radix-ui/react-label` | [ ] missing | 10 | Standalone label primitive; story group: Misc |
| Checkbox | `Checkbox` | `@radix-ui/react-checkbox` | [ ] missing | 20 | Present in admin-portal, customer-portal, teman-affiliate-microsite, ecommerce-teman, claim-portal, agent-microsite, gelm-xproject-microsite, ticket-portal, getrev-da-microsite, grab-landing-page |
| RadioGroup | `RadioGroup` | `@radix-ui/react-radio-group` | [ ] missing | 11 | Consolidates: `RadioGroup`, `RadioButton`, `CustomRadio`, `CustomRadioGroup` |
| Switch | `Switch` | `@radix-ui/react-switch` | [ ] missing | 9 | Present in teman-affiliate-admin, admin-portal, customer-portal, ticket-portal, teman-affiliate-portal |
| Select | `Select` | `@radix-ui/react-select` | [ ] missing | 25 | Consolidates all Select/MultiSelect/SelectAutocomplete variants; mode flags |
| Table | `Table` | semantic table targets via `Box as="table"` and related tags | [ ] missing | 12 | Structural only - no data. Sub-components: `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`, `TableFooter` |
| Badge | `Badge` | - | [ ] missing | 11 | Consolidates: `Badge` across 7+ apps; short status chip |
| Avatar | `Avatar` | `@radix-ui/react-avatar` | [ ] missing | 6 | Consolidates: `Avatar` across teman-affiliate-admin, gegm-friendcover-admin, claim-portal |
| Skeleton | `Skeleton` | - | [ ] missing | 10 | Structural skeleton loader. Shared primitive; loading wrappers stay app-local |
| Spinner | `Spinner` | - | [ ] missing | 8 | Inline spinner. Shared primitive; loading wrappers stay app-local |

---

## Tier 2 - Composite Components

> Combine multiple primitives into a cohesive UI pattern. May have sub-components (compound component pattern). Must remain app-agnostic.
> Source: `06-component-standards.md 1`

| Component | Canonical Export | Based On / Radix Primitive | `@repo/ui` Status | Apps Needing | Story Group | Notes |
|---|---|---|---|---|---|---|
| Alert | `Alert` | Tier 1 | [ ] missing | 22 | Feedback | Consolidates: `Alert`, `FlashMessage`, `ErrorContent`, `Notification`, `NotificationBar`, `DrawerError`, `AlertBanner`; severity variants |
| Card | `Card` | Tier 1 | [ ] missing | 12 | Layout | Compound: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| Form | `Form` | react-hook-form + Label + Input | [ ] missing | 9 | Misc | Compound: `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage` |
| Breadcrumb | `Breadcrumb` | Tier 1 | [ ] missing | 12 | Navigation | Compound: `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`; consolidates `BreadcrumbsShell` candidates |
| Tabs | `Tabs` | `@radix-ui/react-tabs` | [ ] missing | 13 | Navigation | Compound: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` |
| Dialog | `Dialog` | `@radix-ui/react-dialog` | [ ] missing | 26 | Overlays | Compound: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`; consolidates all Modal/Dialog patterns |
| Drawer | `Drawer` | `vaul` | [ ] missing | 10 | Overlays | Compound: `Drawer`, `DrawerTrigger`, `DrawerContent`, `DrawerHeader`, `DrawerFooter`; consolidates `Drewer`, `BottomSheet`, `DrawerModal` |
| Popover | `Popover` | `@radix-ui/react-popover` | [ ] missing | 9 | Overlays | Compound: `Popover`, `PopoverTrigger`, `PopoverContent` |
| Tooltip | `Tooltip` | `@radix-ui/react-tooltip` | [ ] missing | 9 | Overlays | Compound: `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent` |
| Pagination | `Pagination` | Tier 1 | [ ] missing | 16 | Navigation | Consolidates `Pagination` from 15+ apps; page + pageSize controls |
| Calendar | `Calendar` | `react-day-picker` | [ ] missing | 9 | Data Display | Base date picker UI; single/range/multiple modes |
| DataTable | `DataTable` | `Table` + `@tanstack/react-table` v8 | [ ] missing | 6 | Data Display | Headless logic + `Table` visual; `DataTableToolbar`, `DataTablePagination` sub-components |
| DatePicker | `DatePicker` | `Calendar` + `Popover` | [ ] missing | 22 | Inputs | Consolidates all `Datepicker`/`DatePickerModal`/`DatePickerV2` variants; single mode |
| DateRangePicker | `DateRangePicker` | `Calendar` + `Popover` | [ ] missing | 7 | Inputs | Extends `DatePicker` with `from/to` pair state |
| DateTimePicker | `DateTimePicker` | `Calendar` + `Popover` | [ ] missing | 5 | Inputs | Extends `DatePicker` with time input |
| Command | `Command` | `cmdk` | [ ] missing | 5 | Misc | Compound: `Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandShortcut`, `CommandSeparator` |
| Combobox | `Combobox` | `Command` + `Popover` | [ ] missing | 8 | Inputs | Consolidates: `Combobox`, `Autocomplete`, `InputAutocomplete`, `InputSelectAutocomplete`, `CustomSearchableDropdown` |
| DropdownMenu | `DropdownMenu` | `@radix-ui/react-dropdown-menu` | [ ] missing | 12 | Overlays | Compound: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSeparator` |
| NavigationMenu | `NavigationMenu` | `@radix-ui/react-navigation-menu` | [ ] missing | 8 | Navigation | Compound: `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuLink`, `NavigationMenuContent` |
| Menubar | `Menubar` | `@radix-ui/react-menubar` | [ ] missing | 4 | Navigation | Compound: `Menubar`, `MenubarMenu`, `MenubarTrigger`, `MenubarContent`, `MenubarItem` |
| PageHeader | `PageHeader` | Tier 1 | [ ] missing | 8 | Layout | Top-page header shell (title, actions slot); framework-agnostic |

| FileUpload | `FileUpload` | Tier 1 | [ ] missing | 12 | Inputs | Consolidates: `FileUpload`, `FileInput`, `DropFile`, `DragDropExcel`, `UploadFile`, `FileDropzone` |
| Image | `Image` | semantic `img` target via `Box as="img"` with fallback composition | [ ] missing | 13 | Data Display | Consolidates: `ImageOrDefault`, `OptimizeImageShell`, `ViewImage`; fallback + alt semantics |
| OtpInput | `OtpInput` | Tier 1 | [ ] missing | 6 | Inputs | Consolidates: `OtpInput` from customer-portal, ecommerce-teman, sso-portal, grab-landing-page |
| Accordion | `Accordion` | `@radix-ui/react-accordion` | [ ] missing | 4 | Layout | Compound: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` |
| Timeline | `Timeline` | Tier 1 | [ ] missing | 3 | Data Display | Compound: `Timeline`, `TimelineItem`; from teman-affiliate-admin |
| MonthPicker | `MonthPicker` | `Calendar` + `Popover` | [ ] missing | 3 | Inputs | Month-only picker; from partner-portal, teman-affiliate-portal |
| RichTextEditor | `RichTextEditor` | external editor (TBD) | [ ] missing | 1 | Inputs | From ticket-portal legacy intake; queued for Phase 3 scope decision |

---

## Box Authorship Policy

- `Box` remains the authored DOM primitive for shared source in `packages/ui`.
- When a component needs semantic output such as `input`, `textarea`, `table`, `img`, or SVG tags, author the JSX as `Box` with the matching `as` prop.
- Do not hand-author native JSX tags directly in shared component source or stories.

---

## Tier 3 - App-Local Only

> Never extracted to `packages/ui`. See `04-shared-vs-local-boundary.md` for full rulings.

| Category | Examples | Reason |
|---|---|---|
| Route/page containers | `*Page.tsx`, `*View.tsx` with service hooks | Domain logic + routing coupled |
| Domain forms | `BrokerFeeForm`, `ClaimForm`, `DeclarationPage` | Business validation + API calls |
| Table column configs | `*TableConfig.tsx` | Domain-specific schema |
| Chart/visualization wrappers | Recharts configs with domain data | Data-coupled |
| Branded full-page loaders | Logo animation, company identity loaders | App identity |
| Loading wrappers and suspense fallbacks | `LoadingWrapper`, `SuspenseFallback`, retry-aware loading shells | Compose `Spinner` and `Skeleton` locally; wrapper policy stays app-owned |
| Full-page layouts (sidebar + top nav) | `SidebarShell`, `LayoutViewShell` | App routing |
| Auth shells | SSO callbacks, OTP flows, PKCE handlers | Security + app-specific credentials |
| `ReCaptcha` | `src/common/components/ReCaptcha.tsx` | 3rd-party SDK coupling - permanently app-local |
| `MicrosoftLoginButton` | `sso-portal` | Auth SDK coupling - permanently app-local |

---

## Consolidation Rules Applied

| Raw app naming | Canonical mapping |
|---|---|
| `Modal` / `Dialog` / `BottomSheetModal` / `Drewer` / `DrawerModal` | -> `Dialog` + `Drawer` |
| `isDisabled` | -> `disabled` |
| `isLoading` / `pending` | -> `loading` |
| `isOpen` + `onClose` | -> `open` + `onClose` (canonical per `06-component-standards.md 2`) |
| `onChangeValue` / `onSelect` / `onPick` | -> `onValueChange` or `onChange` |
| `additionalClassName` / `classNames` | -> `className` |
| `isCurrency` / `isFormatNumber` | -> `inputMode="currency"` / `inputMode="number"` |
| `danger` (variant) | -> `destructive` |
| `type` (where used for visual variant) | -> `variant` |
| `ButtonCalendar` / `UiButton` / `button.tsx` | -> `Button` (single API) |
| `Loading` / `Loader` / `LoadingWrapper` / `SuspenseFallback` | -> no canonical shared wrapper; apps compose `Spinner` and `Skeleton` locally |
| Icon sub-library (teman-affiliate-admin SVGs) | -> Use Lucide React directly; icon package deferred to Phase 3 |