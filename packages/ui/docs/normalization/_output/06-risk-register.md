# 06 — Risk Register

> **Batch:** Batch 2 — Design System Foundation
> **Branch:** `feat/ui`
> **Run date:** 2026-03-06
> **Inputs:** 27 per-app baseline summaries + `06-component-standards.md §8 Behavioral Parity & No-Breaking-Change Contract`

---

## Systemic Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Semantic token missing in app `globals.css` | HIGH | Token contract doc + pre-migration lint rule; prefer `@repo/config` presets |
| HeroUI / MUI coupling (gelm-xproject-microsite, haruuz-microsite, teman-affiliate-microsite, grab-landing-page) | HIGH | Token normalization required BEFORE adopting any `@repo/ui` primitive; run in parallel with B4 build |
| Shared package readiness gaps (`cmdk`, `date-fns`, `@tanstack/react-table`, and `tailwindcss-animate` are still incomplete for future batches) | HIGH | Keep `cn()` centralized in `@repo/helper` with a modular `src/*` structure, and close the remaining dependency gaps only when their implementation batch requires them |
| `react-table` v7 apps upgrading to TanStack v8 for `DataTable` | HIGH | Audit each app's `react-table` usage before DataTable migration; upgrade path per app |
| 450+ `MIGRATE_AFTER_SPLIT` queue not yet processed | HIGH | Block shared extraction on any unprocessed monolith; enforce in PR review |
| `onClose` vs `onOpenChange` prop mismatch at usage sites | MEDIUM | Adapter shim pattern mandatory at all site-level usages before PR close; track each exception during downstream planning/migration work |
| `isDisabled` / `isLoading` legacy prop naming | MEDIUM | Adapter pattern; `02-api-conventions.md` legacy→canonical mapping enforced by PR template and downstream migration docs |
| Missing `DialogTitle` / `DialogDescription` (a11y regression) | HIGH | Radix warns; zero axe-core violations gate in Storybook CI |
| Consuming apps declare wrong CSS variable format | MEDIUM | Token contract reference sheet; provide `@repo/config` CSS preset |
| Multiple skipped Batch 1.5 candidates (gegm-friendcover: 17, ticket-portal: 21+3 deferred) | MEDIUM | Phase 05A re-evaluation required before these apps can advance past B4 migration |

---

## Parity Contract (Non-Negotiable)

Source: `06-component-standards.md §8`

**Migration replaces implementation — not behavior.**

| What MUST stay bit-for-bit identical | Examples |
|---|---|
| User interactions | Click handlers, hover, focus, keyboard navigation |
| Form behavior | Submit logic, validation triggers, error display, field clearing |
| Modal/dialog behavior | Open trigger, close trigger, backdrop behavior, focus trap |
| Loading states | Same trigger, same spinner shown, same disabled during load |
| Error states | Same message content, same location, same retry behavior |
| Navigation behavior | Route changes, link targets, breadcrumb paths |
| Accessibility | Tab order, ARIA labels, screen reader announcements |
| API calls | No new calls introduced, no calls removed |

**What MAY change (intentional visual delta only):**
- Slightly different border-radius (from `--radius` token)
- Slightly different color shade (from `--primary`/`--muted` tokens)
- Minor spacing on atoms (from CVA `size` variant)

> [!CAUTION]
> "Slightly different" means **imperceptible to end users**. If a user would notice and comment "this looks different", it is NOT acceptable. Flag for design system team review.

---

## High-Risk Component Profiles

### Dialog / Modal

| Risk dimension | Details |
|---|---|
| Apps affected | 26 apps — highest demand component |
| Prop migration | `isOpen` → `open`, `onClose` stays `onClose` (already canonical), `bgColor`/`widthClassName` → `size`+`className` |
| Animation parity | backdrop fade, content zoom/slide in; all 3 states: open, closing, closed |
| Focus trap | Radix handles — verify no consumer suppression |
| Body scroll lock | Radix handles — verify legacy apps didn't override |
| A11y must-have | `DialogTitle` + `DialogDescription` required (even if `sr-only`) |
| HIGH parity risk apps | admin-portal (ClaimHistoryModal, ClaimDetailModal), claim-portal (AlterationView, NomineeView, CreateNomineeModal), teman-affiliate-microsite (claim-portal flows), customer-portal |
| Rollback trigger | Any regression in open/close, focus trap, backdrop, or Esc behavior |

---

### Select (single, multi, searchable, phone code)

| Risk dimension | Details |
|---|---|
| Apps affected | 25 apps |
| Mode consolidation | `multi` prop, `searchable` prop, `phoneCodeMode` prop — all on one component |
| Prop migration | `value`/`onValueChange` are canonical; `onSelect`, `onPick` → `onValueChange`; `allOptions` → `options` |
| Open/close parity | Trigger open, keyboard nav (Arrow, Enter, Esc), click-outside close |
| Search parity | Debounce, empty state display, filtering behavior |
| Accessibility | `role="combobox"`, `aria-expanded`, `aria-controls` per WCAG |
| HIGH parity risk apps | partner-portal (CustomSelect, MultipleSelect), affiliate-admin (Select variations), agent-admin (CustomSelect, MultiSelect, DatePickerV2) |
| Library note | `@radix-ui/react-select` handles single; searchable/combobox needs `cmdk` pattern (see Combobox) |
| Rollback trigger | Any regression in option rendering, search filtering, keyboard nav |

---

### DatePicker

| Risk dimension | Details |
|---|---|
| Apps affected | 22 apps |
| Variants | Single date, range, datetime, month-only → separate canonical components (DatePicker, DateRangePicker, DateTimePicker, MonthPicker) |
| Library mandate | `react-day-picker` + `date-fns`. Apps using `moment.js` must migrate date formatting before adopting |
| Prop migration | `initialValue` → `value`; `minimumDate`/`maximumDate` → `minDate`/`maxDate`; `isForceClear` → `clearable`; `isDisabled` → `disabled` |
| UX parity | Calendar month navigation, disabled dates rendering, selection highlight, clear/save/cancel flows |
| HIGH parity risk apps | affiliate-portal (DatePicker validation + save/clear flow), customer-portal (`isLongDate` formatting), agent-admin (DatePickerV2 popover/year picker), teman-affiliate-microsite |
| Rollback trigger | Any regression in date selection, navigation, disabled dates, or clear behavior |

---

### DataTable

| Risk dimension | Details |
|---|---|
| Apps affected | 6 apps are explicit `DataTable` candidates; broader `Table` primitives still apply to 12 apps |
| Library mandate | `@tanstack/react-table` v8. Apps on v7 must upgrade |
| Column definition | `ColumnDef<TData>` generic — no domain column schemas in shared package |
| Pagination | Controlled or uncontrolled mode; `pageIndex`, `pageSize`, `onPageChange` |
| Row expansion | Apps with expandable rows must verify Radix-free expand logic |
| HIGH parity risk apps | admin-portal (ClaimHistoryTable with sort+filter), gegm-friendcover-admin (custom filter/date components), ticket-portal (KanbanPage, DetailTask — NOT in DataTable scope; remain app-local) |
| Rollback trigger | Any regression in row rendering, sort, filter, pagination state |

---

### ContentLoadingWrapper

| Risk dimension | Details |
|---|---|
| Apps affected | 18 apps |
| Variant consolidation | `Loader`, `LoadingWrapper`, `SuspenseFallback`, `SpinnerOverlay` → one component with `variant="overlay" \| "inline" \| "page"` |
| Parity risk | Overlay z-index stacking; page-level lock; spinner timing |
| HIGH parity risk apps | mykawan-website (branded spinner), haruuz-microsite (HeroUI Spinner → pure CSS), customer-portal |
| Rollback trigger | Loading indicator not shown/hidden at correct lifecycle point |

---

## App-Level High-Risk Flow Groups

| App | High-Risk Flow | Risk Factor | Notes |
|---|---|---|---|
| admin-portal | Claim history, claim detail modal, claim submission | Complex multi-step stateful flows | Token migration prerequisite; adapter needed |
| customer-portal | Purchase flow, policy view, claim card | Domain + display tightly coupled in some views | isLongDate prop migration; adapter |
| claim-portal | AlterationView, NomineeView, CreateNomineeModal, CancellationView, CreditView | Multi-step workflow + validation + modal coupling | All split in Batch 1.5; shells KEEP_APP_LOCAL |
| ticket-portal | KanbanPage, IdPage (ticket detail) | Complex Kanban state machine | Batch 1.5 only split 24 of 45 candidates; 21 skipped |
| gegm-friendcover | FormPersonalInfoPlaint, ViewGreatHome360Declaration, UploadNric | Large LOC monoliths (500–1236 LOC) | 17 Batch 1.5 skipped; defers Phase 05A |
| gegm-friendcover-admin | CustomFilterDate, CustomMultipleSelect, CustomNestedSelect | Complex interaction models | 41 MEDIUM SoC skipped |
| teman-affiliate-microsite | Claim portal flows, date pickers, HeroUI coupling | HeroUI → shared token migration | Token normalization first |
| haruuz-microsite | HeroUI Spinner → ContentLoadingWrapper migration | Brand animation dependency | Token normalization first |
| gelm-xproject-microsite | HeroUI theme system integration | HeroUI token system conflicts | Token normalization prerequisite |
| grab-landing-page | Compare, FooterTransaction, HeaderCompare | MUI + NextUI mixing; hardcoded colors | Token normalization prerequisite |
| agent-admin | DatePickerV2, CustomSelect, MultiSelect | Non-standard prop names; inline styles | Token + prop migration |

---

## Per-Component Parity Checklist Scope

Source: `06-component-standards.md §8.7`

For every `ADOPT_*`, `EXTEND_*`, or `NEW_SHARED_COMPONENT` migrated in Batch 5, the consuming app PR MUST include:

```
In _parity-checklist.md:

## <ComponentName> — Parity Checklist

### Behavioral Checks (ALL must be ✅ before batch closes)
- [ ] Click/interaction behavior identical
- [ ] Keyboard navigation identical (Tab, Enter, Esc, Arrow)
- [ ] Loading state: same trigger, same display
- [ ] Error state: same message, same location
- [ ] Empty state: same display
- [ ] Form behavior: submit, validate, reset identical
- [ ] ARIA labels and roles identical or improved (never removed)
- [ ] No new console errors
- [ ] No new network requests

### Visual Checks (minor delta allowed — document any diff)
- [ ] Layout unchanged
- [ ] Element order unchanged
- [ ] Text content unchanged
- [ ] Visual delta: _____ → caused by token adoption? YES / NO

### Smoke Route
- Route: _____
- Before screenshot: stored under _artifacts/smoke-routes/before/
- After screenshot: stored under _artifacts/smoke-routes/after/
- Result: ✅ PASS / ❌ FAIL
```

---

## Rollback Strategy

| Trigger | Rollback mechanism |
|---|---|
| Dialog regression (open/focus trap/close) | Revert the app-side migration PR; shared component stays in `@repo/ui` unchanged |
| Token color regression (wrong shade) | Revert app `globals.css` override; shared component unchanged |
| Form behavior regression | Revert entire app batch PR; do not partial-revert (form state is atomic) |
| Accessibility regression (a11y) | PRs blocked from merge until axe-core violations resolved; or revert and fix |
| DataTable v7→v8 upgrade regression | Revert `@tanstack/react-table` upgrade; keep local table until v8 migration planned |
| Any Storybook story turning RED on shared build | Block Batch 5 deployment of `@repo/ui` version; patch before release |

**Rollback policy:** App-migration PRs must be atomic per component (one component per PR). This ensures granular rollback without collateral damage to other migrated components.
