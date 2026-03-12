# 20 - Foundation Change Log

> Batch: Batch 3 - Migration Plan
> Branch: `feat/ui`
> Last reconciled: 2026-03-10
> Scope: Foundation-level decisions and doc-alignment updates that change how the `_output` set should be interpreted

---

## 2026-03-08 - Box Foundation Amendment Applied

Changed:
- Confirmed `Box` as the only implemented shared export in `@repo/ui`.
- Locked the extended `Box` API surface: `asChild`, `padding`, `container`, and `centered`.
- Confirmed `21-adapter-mapping.md` only covers `Box` because no other shared component is implemented yet.

Impact:
- All downstream planning artifacts must continue treating `Box` as the sole shipped shared primitive until another component is actually exported from `packages/ui/src/index.ts`.

---

## 2026-03-09 - Batch 3A Token Bootstrap Completed

Changed:
- Confirmed the semantic token preset exists at `@repo/config/semantic-tokens.css`.
- Confirmed Batch 3A is complete and remains the hard gate before any Batch 4 shared build.
- Reaffirmed that shared styling must stay semantic-token-only.

Impact:
- Batch 4 may start from a foundation perspective, but component tracker rows stay `PLANNED` until implementation lands in `@repo/ui`.

---

## 2026-03-09 - Output Cross-Check Normalization Pass

Changed:
- Added the missing canonical API sections in `02-api-conventions.md` for every component previously referenced as `02 amendment`.
- Normalized `10-cross-app-reconciliation.md` target batch labels to `B3`, `B4`, and `B5.x` wave names.
- Corrected `13-implementation-batches.md` so Batch 4 status reflects the actual workspace state instead of prematurely marking components `DONE`.
- Updated `11-master-component-roadmap.md` to treat `02` alignment as an active contract, not a missing future task.

Impact:
- The `_output` document set is internally aligned again.
- Actual implementation state is now explicit: `Box` and Batch 3A are done; Batch 4+ shared components remain planned or blocked until code exists.
---

## 2026-03-10 - Box Batch 4 Re-execution Alignment

Changed:
- Re-executed `Box` against the Batch 4 extend-existing procedure instead of relying on the earlier Batch 3 pass alone.
- Made the `Box` type surface explicitly match `02-api-conventions.md` by declaring `className` on `BoxOwnProps`.
- Realigned Storybook metadata and stories to the canonical `Layout/Box` taxonomy and documented the approved semantic/layout usage cases.

Impact:
- `Box` remains the only valid `EXTEND_EXISTING` component in the current shared-program state, but its spec, stories, and exported prop surface are now consistent with the authoritative procedural contract.


---

## 2026-03-10 - Batch 3A Token Foundation Rerun

Changed:
- Re-executed the Batch 3A gate and confirmed `pnpm --filter @repo/ui check-types`, `pnpm --filter @repo/ui lint`, and `pnpm --filter @repo/ui build` all pass.
- Confirmed the real shared token foundation already ships from `@repo/config/semantic-tokens.css` and `@repo/config/tailwind.css`.
- Corrected `03-token-theming-contract.md` sections that still described the semantic preset as missing even though the files existed.
- Clarified the downstream gating language in `13-implementation-batches.md`: Batch 4 is foundation-ready, while Batch 5 still waits on actual shared component completion.

Impact:
- Batch 3A status is now evidence-backed and internally consistent across the normalization outputs.
- Batch 4 is unblocked from a token-foundation perspective.
- Batch 5 remains gated by shared component delivery, not by missing token infrastructure.

---

## 2026-03-10 - Alert Batch 4 Delivery

Changed:
- Implemented `packages/ui/src/Alert` as the first new Batch 4 shared feedback component after `Box`.
- Added the canonical Alert spec, Storybook coverage, typed exports, and token-only semantic variants (`default`, `success`, `info`, `warning`, `destructive`).
- Locked dismiss behavior to a controlled callback model so inline alerts stay app-agnostic and do not absorb toast/snackbar orchestration.
- Normalized icon authoring guidance for the next waves: authored `packages/ui` source should not hand-write inline SVG markup when a shared icon component exists, and Lucide usage must stay on named imports from `'lucide-react'`.

Impact:
- `@repo/ui` export surface now includes `Alert` alongside `Box`.
- Inline flash-message, notification-bar, and banner-style feedback can start mapping toward a single shared Alert contract during downstream adoption.

---

## 2026-03-10 - Box Authorship Rule Tightened

Changed:
- Normalized the `_output` rule set so shared authored JSX now treats `Box` as the required DOM primitive, not just a layout wrapper.
- Replaced wording that previously allowed direct native markup for semantic or browser-required elements.
- Clarified in taxonomy, API, roadmap, and batch tracker docs that semantic HTML and SVG output must be authored via `Box as="..."`, including `input`, `textarea`, `table`, `img`, `svg`, and `path`.

Impact:
- Future Batch 4 and Batch 5 implementations should no longer hand-write native JSX tags in shared source or stories.
- Verification and review should now treat any authored native DOM or SVG tag in `packages/ui` as a documentation-policy violation unless an explicit amendment changes the rule.
---

## 2026-03-10 - Badge Batch 4 Delivery

Changed:
- Implemented `packages/ui/src/Badge` as the next eligible Wave B4 primitive after `Alert`.
- Added the canonical Badge spec, Storybook coverage, typed exports, and CVA-backed `variant` + `size` support aligned to `02-api-conventions.md`.
- Locked the dot treatment to child composition through `children` and Box-authored markup instead of adding new `dot` or `icon` props.

Impact:
- `@repo/ui` export surface now includes `Badge` alongside `Box` and `Alert`.
- App-local status pills, chips, and compact metadata labels can begin mapping toward a single shared Badge contract without introducing extra API sprawl.
---

## 2026-03-10 - Button Batch 4 Delivery

Changed:
- Implemented `packages/ui/src/Button` as the next eligible Wave B4 primitive after `Alert` and `Badge`.
- Added the canonical Button spec, Storybook coverage, typed exports, and CVA-backed `variant` + `size` support aligned to `02-api-conventions.md`.
- Normalized legacy button deltas into the shared API: `loading`, `leftIcon`, `rightIcon`, `asChild`, and the explicit `warning` variant while keeping `default` as the shared filled CTA baseline.
- Locked authored shared markup to the Box-only DOM rule, including the standard button root and story examples, while using Radix Slot composition for the `asChild` path.

Impact:
- `@repo/ui` export surface now includes `Button` alongside `Box`, `Alert`, and `Badge`.
- App-local CTA, toolbar, and submit button shells can begin mapping toward a single shared Button contract without routing or business-logic coupling.

## 2026-03-10 - Card Batch 4 Delivery

Changed:
- Implemented `packages/ui/src/Card` as the next eligible Wave B4 shared layout component after `Button`.
- Added the canonical Card spec, Storybook coverage, typed subcomponent exports, and Box-authored slot structure aligned to `02-api-conventions.md`.
- Kept the public API structural by using named composition parts instead of introducing dedicated `variant`, `size`, or interactive boolean props.

Impact:
- `@repo/ui` export surface now includes `Card` alongside `Box`, `Alert`, `Badge`, and `Button`.
- App-local content panels, summary shells, and reusable section containers can begin mapping toward one shared Card contract while keeping domain-specific formatting and interaction policy local.

---

## 2026-03-10 - Checkbox Batch 4 Delivery

Changed:
- Implemented `packages/ui/src/Checkbox` as the next eligible Wave B4 form primitive after `Card`.
- Added the canonical Checkbox spec, Storybook coverage, typed exports, and CVA-backed slot styling aligned to the Batch 4 Box-authored DOM rule.
- Locked the shared Checkbox contract around `checked`, `defaultChecked`, `onCheckedChange`, `label`, `description`, `error`, `size`, and explicit indeterminate support instead of adding extra boolean props.

Impact:
- `@repo/ui` export surface now includes `Checkbox` alongside `Box`, `Alert`, `Badge`, `Button`, and `Card`.
- App-local consent toggles, settings checkboxes, and partial-selection controls can begin mapping toward one shared Checkbox primitive without domain-specific wrapper logic.

---

## 2026-03-10 - Drawer Batch 4 Delivery

Changed:
- Implemented `packages/ui/src/Drawer` as the next eligible Wave B4 overlay shell after `Checkbox`, skipping only the documented holds ahead of it at that time (shared loading-wrapper consolidation was still under consideration, and `Dialog` remained behind its explicit high-risk gate).
- Added the canonical Drawer spec, Storybook coverage, typed exports, and `vaul`-backed compound primitives for trigger, content, close, header, footer, title, description, overlay, and handle composition.
- Locked the shared Drawer contract around `open`, `onClose`, `direction`, and shell-only slot props (`title`, `description`, `actions`, `footer`) while keeping all authored wrapper DOM on `Box`.

Impact:
- `@repo/ui` export surface now includes `Drawer` alongside `Box`, `Alert`, `Badge`, `Button`, `Card`, and `Checkbox`.
- Bottom sheets, side panels, and reusable secondary-detail overlays can now normalize toward one shared drawer shell while keeping domain workflows and modal-specific semantics local.

---

## 2026-03-10 - Input Batch 4 Delivery

Changed:
- Implemented `packages/ui/src/Input` as the next eligible Wave B4 primitive after `Drawer`.
- Added the canonical Input spec, Storybook coverage, typed exports, and CVA-backed slot styling aligned to `02-api-conventions.md`.
- Normalized repeated per-app field deltas into the shared contract: `variant`, `size`, `inputMode`, `label`, `helperText`, `error`, `leftIcon`, `rightIcon`, `loading`, `clearable`, and `onValueChange`.
- Kept authored shared markup on `Box`, including the label, semantic input, helper and error copy, and the clear action button.

Impact:
- `@repo/ui` export surface now includes `Input` alongside `Box`, `Alert`, `Badge`, `Button`, `Card`, `Checkbox`, and `Drawer`.
- App-local text, email, phone, numeric, and search field shells can begin converging on one shared Input primitive while keeping masking, password toggles, currency formatting, and domain validation local.

---

## 2026-03-10 - Label Batch 4 Delivery

Changed:
- Implemented `packages/ui/src/Label` as the next eligible Wave B4 primitive after `Input`.
- Added the canonical Label spec, Storybook coverage, typed exports, and token-backed tone support aligned to `02-api-conventions.md`.
- Kept authored shared markup on `Box` by composing `@radix-ui/react-label` through `asChild`, while limiting the shared API to `htmlFor`, `required`, `disabled`, and `tone`.

Impact:
- `@repo/ui` export surface now includes `Label` alongside `Box`, `Alert`, `Badge`, `Button`, `Card`, `Checkbox`, `Drawer`, and `Input`.
- App-local field captions can begin converging on one shared Label primitive before `Form`, `RadioGroup`, `Select`, and later field-shell work lands.

---

## 2026-03-10 - Pagination Batch 4 Delivery

Changed:
- Implemented `packages/ui/src/Pagination` as the next eligible Wave B4 shared navigation primitive after `Label`.
- Added the canonical Pagination spec, Storybook coverage, typed exports, and Box-authored `nav`/list/button/select structure aligned to `02-api-conventions.md`.
- Normalized recurring per-app pager deltas into the shared contract: `currentPage`, `totalPages`, `onPageChange`, optional `pageSize`, optional `onPageSizeChange`, and optional `pageSizeOptions`.
- Kept the public API flat after `vercel-composition-patterns` review by deriving compact ellipsis behavior from large page counts instead of adding extra mode booleans or public subcomponents.

Impact:
- `@repo/ui` export surface now includes `Pagination` alongside `Box`, `Alert`, `Badge`, `Button`, `Card`, `Checkbox`, `Drawer`, `Input`, and `Label`.
- App-local list and table pagers can begin converging on one shared navigation shell while keeping route syncing, total-count math, and data orchestration in parent surfaces.
---

## 2026-03-10 - RadioGroup Batch 4 Delivery

Changed:
- Implemented `packages/ui/src/RadioGroup` as the next eligible Wave B4 input primitive after `Pagination`, while keeping the previously documented holds in place (shared loading-wrapper consolidation was still unresolved, and `Dialog` and `Select` remained behind their explicit high-risk gates).
- Added the canonical RadioGroup spec, Storybook coverage, typed exports, and Box-authored compound `RadioGroup` / `RadioGroupItem` wrappers on top of `@radix-ui/react-radio-group`.
- Locked the shared RadioGroup contract around `value`, `defaultValue`, `onValueChange`, `orientation`, `disabled`, `required`, plus per-item `label` and `description`, instead of expanding the public API with extra layout or card-mode booleans.

Impact:
- `@repo/ui` export surface now includes `RadioGroup` alongside `Box`, `Alert`, `Badge`, `Button`, `Card`, `Checkbox`, `Drawer`, `Input`, `Label`, and `Pagination`.
- App-local single-select form controls can begin converging on one shared radio-group primitive while keeping validation orchestration, domain mapping, and higher-order card layouts in consuming surfaces.
---

## 2026-03-10 - RadioGroup Contract Refinement

Changed:
- Amended the normalized RadioGroup contract in `02-api-conventions.md` and `11-master-component-roadmap.md` to include shared `size` and `error` support after reviewing the audited app baselines for form validation and density needs.
- Expanded the shipped RadioGroup implementation and Storybook coverage to include `Sizes` and `ErrorState`, while keeping the API compound and app-agnostic.

Impact:
- RadioGroup now aligns more closely with the shared input family and recurring per-app validation patterns without introducing route, domain, or card-layout coupling.

## 2026-03-10 - Skeleton Batch 4 Delivery

Changed:
- Implemented `packages/ui/src/Skeleton` as the next eligible Wave B4 primitive after `RadioGroup`, keeping the previously documented holds in place (shared loading-wrapper consolidation was still unresolved, and `Dialog` and `Select` stayed behind their explicit gates).
- Added the canonical Skeleton spec, Storybook coverage, typed exports, and a Box-authored primitive with CVA-backed pulse styling.
- Kept the public API intentionally flat after composition review: shared text, block, and card placeholder patterns are documented and demonstrated through composition plus `className` rather than extra mode props.
- Defaulted decorative placeholders to `aria-hidden="true"` while preserving an opt-in accessible status path through native `role` and `aria-*` props.

Impact:
- `@repo/ui` export surface now includes `Skeleton` alongside `Box`, `Alert`, `Badge`, `Button`, `Card`, `Checkbox`, `Drawer`, `Input`, `Label`, `Pagination`, and `RadioGroup`.
- App-local loading placeholders can begin converging on one shared Skeleton primitive while keeping branded loaders, blocking overlays, retry messaging, and orchestration logic local.

---

## 2026-03-10 - Spinner Batch 4 Delivery

Changed:
- Implemented `packages/ui/src/Spinner` as the next eligible Wave B4 primitive after `Skeleton`, while honoring the existing Wave B4 holds on `Dialog` and `Select`.
- Added the canonical Spinner spec, Storybook coverage, typed exports, and CVA-backed `size` plus derived layout styling aligned to `02-api-conventions.md`.
- Normalized repeated per-app loader baselines into the shared contract: `size`, optional `label`, `inline`, and `overlay`, while keeping branded loaders, timed wrappers, and richer loading shells out of the primitive.
- Kept authored shared markup on `Box` and implemented the indicator as an asymmetrical CSS border ring so motion stays obvious without authoring native SVG tags.

Impact:
- `@repo/ui` export surface now includes `Spinner` alongside `Box`, `Alert`, `Badge`, `Button`, `Card`, `Checkbox`, `Drawer`, `Input`, `Label`, `Pagination`, `RadioGroup`, and `Skeleton`.
- At that point, `Skeleton` and `Spinner` had closed the primitive side of the loading decision; the remaining question was whether any shared loading wrapper should exist at all.


## 2026-03-10 - Historical ContentLoadingWrapper Batch 4 Delivery Attempt

Changed:
- This entry is retained for chronology only.
- The earlier attempt to treat `ContentLoadingWrapper` as a canonical shared component was later reversed the same day by program decision.
- The historical attempt had normalized repeated per-app loading-wrapper deltas into one shared contract and composed shared `Spinner` + `Skeleton` primitives beneath that wrapper.

Impact:
- This historical attempt does not represent the current canonical shared-package policy.
- Current authority is the reversal entry below: `Spinner` and `Skeleton` remain shared, while loading wrappers and suspense fallbacks stay app-local.

---

## 2026-03-10 - Loading Wrapper Policy Reversal

Changed:
- Reversed the earlier normalization assumption that `ContentLoadingWrapper` should remain a canonical shared component in `@repo/ui`.
- Removed or demoted prior roadmap, taxonomy, reconciliation, tracker, adapter, API, and risk-register language that treated `ContentLoadingWrapper` as the default shared loading target.
- Locked the shared loading policy to `Spinner` and `Skeleton` primitives only; app teams now compose loading wrappers, suspense fallbacks, branded full-page loaders, retry/error-aware shells, and domain-aware loading containers locally.

Impact:
- The canonical shared loading surface in `@repo/ui` now stops at primitives.
- Existing migration docs should map `Loader` / `Loading` / `LoadingWrapper` / `SuspenseFallback` families to app-local composition rather than a shared wrapper export.
- Any future shared loading wrapper requires a new, narrower program decision instead of inheriting the reversed `ContentLoadingWrapper` plan.

---

## 2026-03-10 - Dialog Batch 4 Delivery

Changed:
- Implemented `packages/ui/src/Dialog` as the next eligible Wave B4 overlay shell after re-opening the previously documented accessibility gate.
- Added the canonical Dialog spec, Storybook coverage, typed exports, and `@radix-ui/react-dialog` compound primitives for trigger, overlay, content, close, header, footer, title, and description composition.
- Locked the shared Dialog contract around `open`, `defaultOpen`, `onClose`, `size`, and shell-only slot props (`title`, `description`, `actions`, `footer`) while keeping destructive and async behaviors in composed content.
- Kept authored shared markup on `Box`, including the overlay, content shell, header/footer wrappers, and the `Title`/`Description` elements through Radix `asChild` composition.

Impact:
- `@repo/ui` export surface now includes `Dialog` alongside the previously shipped Batch 4 primitives.
- Centered modal shells, confirmation dialogs, and focused form overlays can now normalize toward one shared modal contract while leaving domain workflows, route coupling, and bottom-sheet behavior local.

---

## 2026-03-10 - Select Batch 4 Delivery

Changed:
- Implemented `packages/ui/src/Select` as the next eligible Wave B4 input primitive after `Dialog`.
- Added the canonical Select spec, Storybook coverage, typed exports, and a Radix-backed static single-select wrapper with Box-authored trigger, menu content, and option rows.
- Resolved the documented select-family drift by locking this shared contract to static single selection only: placeholder, loading, disabled, label, error, controlled/uncontrolled value, and controlled/uncontrolled open state callbacks.
- Realigned `02-api-conventions.md` so `Select` no longer advertises searchable, multi-select, or phone-code mode flags that belong to `Combobox` or later follow-up work instead.

Impact:
- `@repo/ui` export surface now includes `Select` alongside the previously shipped Batch 4 primitives.
- App-local static dropdowns can begin converging on one shared Select primitive, while searchable selection remains on the future `Combobox` path and multi-select / phone-code flows remain out of this contract.


---

## 2026-03-10 - Switch Batch 4 Delivery

Changed:
- Implemented `packages/ui/src/Switch` as the next eligible Wave B4 primitive after `Select`.
- Added the canonical Switch spec, Storybook coverage, typed exports, and `@radix-ui/react-switch` composition with Box-authored control, thumb, and label markup.
- Kept the shared API intentionally narrow after composition review: `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `required`, `label`, and `size`, while supporting longer descriptive copy through consumer composition instead of a wider field-shell prop surface.

Impact:
- `@repo/ui` export surface now includes `Switch` alongside the previously shipped Batch 4 primitives.
- App-local settings toggles and binary preference controls can begin converging on one shared Switch primitive while validation orchestration, supporting copy layouts, and persistence side effects stay local.

---

## 2026-03-10 - Switch Contract Refinement

Changed:
- Amended the normalized Switch contract in `02-api-conventions.md` and `11-master-component-roadmap.md` to include shared `error` support.
- Expanded the shipped Switch implementation and Storybook coverage to include an accessible inline error message, destructive invalid styling, and `aria-invalid` plus `aria-describedby` wiring.
- Corrected the implementation to keep the controlled and uncontrolled Radix paths separate instead of forwarding both `checked` and `defaultChecked` simultaneously.

Impact:
- Switch now aligns with the shared input family for field-level validation treatment without expanding into a full field-shell abstraction.
- App-local toggle wrappers can normalize invalid state handling to the shared `error` contract while keeping supporting descriptions and workflow logic local.

---
## 2026-03-10 - Table Batch 4 Delivery

Changed:
- Implemented `packages/ui/src/Table` as the next eligible Wave B4 primitive after `Switch`.
- Added the canonical Table spec, Storybook coverage, typed exports, and Box-authored semantic wrappers for `table`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`, and `caption`.
- Kept the shared contract intentionally structural after composition review: responsive overflow, dense spacing, selection orchestration, search, sorting, and pagination remain consumer-owned or belong to the future `DataTable` layer.
- Added a selected-row styling hook through `data-state="selected"` so later `DataTable` work can compose on the same primitive without widening the public API early.

Impact:
- `@repo/ui` export surface now includes `Table` alongside the previously shipped Batch 4 primitives.
- App-local table shells can begin converging on one shared semantic foundation while higher-order data logic stays outside the primitive boundary until `DataTable` lands.

---

## 2026-03-10 - Tabs Batch 4 Delivery

Changed:
- Implemented `packages/ui/src/Tabs` as the next eligible Wave B4 navigation primitive after `Table`.
- Added the canonical Tabs spec, Storybook coverage, typed exports, and `@radix-ui/react-tabs` compound primitives for `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent`.
- Kept the root API intentionally narrow after composition review: `value`, `defaultValue`, `onValueChange`, and `orientation` remain the only normalized root props while scrollable trigger overflow and active-state styling stay internal to the shared shell.
- Kept authored shared markup on `Box`, including the root wrapper, list shell, button-backed triggers, and tabpanel wrapper through Radix `asChild` composition.

Impact:
- `@repo/ui` export surface now includes `Tabs` alongside the previously shipped Batch 4 primitives.
- App-local detail tabs, settings tabs, and section switchers can begin converging on one shared compound tabs primitive while route synchronization, query-string coupling, and workflow state remain local.

---

## 2026-03-10 - Textarea Batch 4 Delivery

Changed:
- Implemented `packages/ui/src/Textarea` as the final eligible Wave B4 primitive after `Tabs`.
- Added the canonical Textarea spec, Storybook coverage, typed exports, and Box-authored multiline field markup aligned to `02-api-conventions.md`.
- Normalized recurring multiline-field deltas into the shared contract: `label`, `helperText`, `error`, `clearable`, and `onValueChange`, while keeping auto-grow logic, rich-text behavior, custom height modes, and workflow-specific formatting local.
- Applied the current web-interface guidance during the final review by keeping visible labels and described-by error wiring intact, preserving native multiline semantics, and defaulting shared placeholder examples to the current copy style.

Impact:
- `@repo/ui` export surface now includes `Textarea`, completing Wave B4 alongside the previously shipped shared primitives.
- App-local notes, remarks, and plain-text description fields can begin converging on one shared Textarea primitive while richer editor behavior, autoresize logic, and domain-specific formatting remain local.

---

## 2026-03-11 - Textarea and Select Input Refinements

Changed:
- Corrected the shared `Textarea` field-shell implementation so the visible border, focus ring, and browser resize behavior now live on the actual `textarea` element instead of an outer wrapper.
- Tightened the `Textarea` clear affordance styling so it presents the same clickable hover and cursor treatment as the rest of the shared input family.
- Expanded the shared `Select` contract with `clearable` reset behavior and updated its `onValueChange` contract to allow `undefined` when a selected value is cleared back to the placeholder state.
- Updated the Select spec, stories, and normalization outputs to document and verify the new clearable behavior.

Impact:
- The shared `Textarea` resize handle now stays visually aligned with the rendered field chrome in Storybook and consuming apps.
- Shared static selects can now absorb recurring app-local clear affordances without widening into searchable or multi-select behavior.
---

## 2026-03-11 - Breadcrumb Batch 5.1 Delivery

Changed:
- Implemented `packages/ui/src/Breadcrumb` as the first eligible Wave B5.1 navigation component after Wave B4 stabilization.
- Added the canonical Breadcrumb spec, Storybook coverage, typed exports, and Box-authored semantic `nav` / `ol` / `li` markup aligned to `02-api-conventions.md`.
- Locked the shared contract around `items`, optional `separator`, and optional `currentLabel`, while keeping router adapters, framework links, and route-building logic local to consuming apps.
- Kept the API intentionally flat after composition review instead of introducing compound breadcrumb subcomponents or render-prop wrappers.

Impact:
- `@repo/ui` export surface now includes `Breadcrumb` alongside the previously shipped navigation primitives.
- App-local breadcrumb shells can begin converging on one shared semantic trail component while preserving app-owned routing and link composition policy.


---

## 2026-03-11 - Calendar Batch 5.1 Delivery

Changed:
- Implemented `packages/ui/src/Calendar` as the next eligible Wave B5.1 component after `Breadcrumb`.
- Added the canonical Calendar spec, Storybook coverage, typed `single` / `multiple` / `range` selection contracts, and tokenized class-map styling on top of `react-day-picker`.
- Added `date-fns` as a direct `@repo/ui` dependency and used it for shared caption and weekday formatting so the wrapper satisfies the roadmap's required date stack.
- Kept the Box-only DOM rule explicit at the authored boundary: the shared wrapper and stories use `Box`, while `react-day-picker` remains the documented third-party DOM constraint inside the rendered calendar grid.

Impact:
- `@repo/ui` export surface now includes `Calendar` alongside the previously shipped primitives and composite shells.
- Downstream apps can begin converging inline day-grid selection and disabled-date calendar views on one shared component before `DatePicker`, `DateRangePicker`, and related wrappers land.

---

## 2026-03-11 - DropdownMenu Batch 5.1 Delivery

Changed:
- Implemented `packages/ui/src/DropdownMenu` as the next eligible Wave B5.1 component after `Calendar`, since `DatePicker` remained blocked by `Popover` and `DropdownMenu` was the next `PLANNED` row with no unmet prerequisite.
- Added the canonical DropdownMenu spec, Storybook coverage, typed exports, and a Radix-backed compound menu surface for trigger, content, items, checkbox items, radio items, labels, separators, and submenu composition.
- Added `@radix-ui/react-dropdown-menu` as a direct `@repo/ui` dependency and aligned `02-api-conventions.md` to the shipped compound contract instead of the older flat `items[]` sketch.
- Kept authored shared wrappers on `Box` through Radix `asChild` composition while leaving Radix Portal internals as the documented third-party DOM constraint.

Impact:
- `@repo/ui` export surface now includes `DropdownMenu` alongside the previously shipped overlay and navigation primitives.
- App-local row-action menus, compact toolbar menus, and lightweight preference menus can begin converging on one shared compound action-menu contract while routing, permission logic, and domain-specific item shaping stay local.

---

## 2026-03-11 - Form Batch 5.1 Delivery

Changed:
- Implemented `packages/ui/src/Form` as the next eligible Wave B5.1 component after `DropdownMenu`, since `DatePicker` still depends on `Popover` and `Form` was the first remaining `PLANNED` row in order with its documented prerequisites already satisfied.
- Added the canonical Form spec, Storybook coverage, typed exports, and a React Hook Form aligned compound API for `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, and `FormMessage`.
- Used `FormProvider` plus `useController` to normalize field state, accessible description and error wiring, and custom-control composition while keeping schemas, submission logic, and domain validation in app code.
- Kept authored shared markup on `Box`, including the semantic `form` root, item wrappers, helper copy, and validation messages.

Impact:
- `@repo/ui` export surface now includes `Form` alongside the previously shipped input primitives and overlay shells.
- App-local field wrappers can begin converging on one shared RHF composition layer while domain schemas, mutations, and step orchestration remain local.
---

## 2026-03-12 - Popover Batch 5.1 Delivery

Changed:
- Implemented packages/ui/src/Popover as the next eligible Wave B5.1 component after Form, since DatePicker was still blocked and Popover was the first remaining PLANNED row in order with no unmet prerequisite.
- Added the canonical Popover spec, Storybook coverage, typed exports, and a Radix-backed compound surface for trigger, anchor, content, close, and portal composition.
- Aligned 2-api-conventions.md to the shipped root contract by documenting onOpen together with onClose for explicit controlled lifecycle hooks.
- Kept authored shared wrappers on Box, including the tokenized content shell and all authored story markup, while leaving Radix portal and positioning internals as the documented third-party DOM boundary.

Impact:
- @repo/ui export surface now includes Popover alongside the previously shipped overlay and input primitives.
- Downstream shared work such as DatePicker, DateRangePicker, Combobox, and compact anchored app-local forms can now compose on one canonical floating surface while domain state, routing, and service logic stay local.

---

## 2026-03-12 - DatePicker Batch 5.1 Delivery

Changed:
- Implemented `packages/ui/src/DatePicker` as the next eligible Wave B5.1 component after `Popover`, once its `Calendar` and `Popover` dependencies were both available in the shared package.
- Added the canonical DatePicker spec, Storybook coverage, typed exports, and a shared single-date field shell composed from `Calendar` + `Popover`.
- Normalized recurring per-app date input deltas into the shared contract: `value`, `onChange`, `minDate`, `maxDate`, `disabled`, `clearable`, `required`, `label`, `placeholder`, `error`, `open`, and `onClose`.
- Kept authored shared markup on `Box`, using an input-style trigger shell and clear affordance while leaving `react-day-picker` and Radix portal internals as the documented third-party DOM boundaries.

Impact:
- `@repo/ui` export surface now includes `DatePicker` alongside the previously shipped input and overlay primitives.
- Downstream apps can begin converging single-date form fields and filter triggers on one shared contract while range pickers, date-time flows, presets, and business-specific save/apply workflows remain outside this component.

---

## 2026-03-12 - DatePicker Contract Refinement

Changed:
- Expanded the shared DatePicker contract with optional ormatDate?: (date: Date) => string support for display-only formatting overrides while keeping the selected value typed as Date.
- Synced the visual contract in the canonical docs so DatePicker now explicitly aligns with the shared Input ariant and size scales.
- Updated DatePicker Storybook coverage and adapter guidance to document custom display formatting, Input-aligned shell variants, and migration from app-local isLongDate style toggles.

Impact:
- Downstream apps can adopt long-date or alternate display strings without forking the shared date field or leaking formatter-token APIs into the component contract.
- DatePicker adoption guidance now explicitly covers both display-format migration and visual normalization toward the shared input family.


---
## 2026-03-12 - Tooltip Batch 5.1 Delivery

Changed:
- Implemented `packages/ui/src/Tooltip` as the final eligible Wave B5.1 component after `DatePicker`.
- Added the canonical Tooltip spec, Storybook coverage, typed exports, and a Radix-backed compound surface for `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent`, and `TooltipArrow`.
- Realigned `02-api-conventions.md` to the shipped compound contract by normalizing legacy `content`, `position`, and `delay` props into `TooltipContent`, `side`, and `delayDuration`.
- Kept authored shared markup on `Box` for the tooltip content shell and all story layout markup while leaving Radix portal and positioning internals as the documented third-party DOM boundary.

Impact:
- `@repo/ui` export surface now includes `Tooltip` and Wave B5.1 is fully complete.
- Downstream apps can begin converging brief hover and focus help onto one shared assistive tooltip contract while richer contextual panels remain on `Popover` and app-local shells.


---
## 2026-03-12 - Tooltip Standalone Provider Fix

Changed:
- Patched `packages/ui/src/Tooltip` so standalone `Tooltip` usage installs a local Radix provider automatically when no surrounding `TooltipProvider` is present.
- Kept `TooltipProvider` as the opt-in shared timing boundary instead of forcing every consumer and Storybook story to wrap single tooltips manually.
- Updated the Tooltip spec and API conventions to document the provider fallback explicitly.

Impact:
- Storybook and downstream consumers can render a single shared tooltip without hitting the Radix provider-context runtime error.
- Shared skip-delay behavior across nearby tooltip groups still works through explicit `TooltipProvider` usage.
