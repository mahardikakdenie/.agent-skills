# 05 — Coverage Baseline

> **Batch:** Batch 2 — Design System Foundation
> **Branch:** `feat/ui`
> **Run date:** 2026-03-06
> **Inputs:** 27 per-app baseline summaries reconciled

---

## Summary

| Metric | Count |
|---|---|
| Total canonical shared components | 43 |
| Already in `@repo/ui` | 1 (`Box`) |
| To build | 42 |
| P0 (critical path; blocks app migration) | 16 |
| P1 (high demand; needed by 8–19 apps) | 14 |
| P2 (medium demand; needed by 3–7 apps) | 8 |
| P3 (low demand; needed by 1–2 apps; deferred) | 4 |

---

## Priority Coverage Plan

### P0 — Critical Path (all 27 apps are blocked without these)

| Component | Tier | Apps Needing | Story Group | Target Batch | Radix Primitive |
|---|---|---|---|---|---|
| Button | 1 | 23 | Buttons | B4 | `@radix-ui/react-slot` |
| Input | 1 | 26 | Inputs | B4 | `<input>` |
| Textarea | 1 | 18 | Inputs | B4 | `<textarea>` |
| Select | 1 | 25 | Inputs | B4 | `@radix-ui/react-select` |
| Checkbox | 1 | 20 | Inputs | B4 | `@radix-ui/react-checkbox` |
| Dialog | 2 | 26 | Overlays | B4 | `@radix-ui/react-dialog` |
| Alert | 2 | 22 | Feedback | B4 | — |
| ContentLoadingWrapper | 2 | 18 | Layout | B4 | — |
| Skeleton | 1 | 10 | Feedback | B4 | — |
| Spinner | 1 | 8 | Feedback | B4 | — |
| Table | 1 | 12 | Data Display | B4 | `<table>` |
| Pagination | 2 | 16 | Navigation | B4 | — |
| Badge | 1 | 11 | Feedback | B4 | — |
| Card | 2 | 12 | Layout | B4 | — |
| DatePicker | 2 | 22 | Inputs | B5.1 | `react-day-picker` |
| Form | 2 | 9 | Misc | B5.1 | react-hook-form |

---

### P1 — High Demand (needed by 8–19 apps)

| Component | Tier | Apps Needing | Story Group | Target Batch | Notes |
|---|---|---|---|---|---|
| Tabs | 2 | 13 | Navigation | B4 | `@radix-ui/react-tabs` |
| Drawer | 2 | 10 | Overlays | B4 | `vaul` |
| RadioGroup | 1 | 11 | Inputs | B4 | `@radix-ui/react-radio-group` |
| Switch | 1 | 9 | Inputs | B4 | `@radix-ui/react-switch` |
| Label | 1 | 10 | Misc | B4 | `@radix-ui/react-label` |
| Breadcrumb | 2 | 12 | Navigation | B5.1 | `renderLink` slot for next/link |
| Popover | 2 | 9 | Overlays | B5.1 | `@radix-ui/react-popover` |
| Tooltip | 2 | 9 | Overlays | B5.1 | `@radix-ui/react-tooltip` |
| DropdownMenu | 2 | 12 | Overlays | B5.1 | `@radix-ui/react-dropdown-menu` |
| Combobox | 2 | 8 | Inputs | B5.2 | `Command` + `Popover` |
| Calendar | 2 | 9 | Data Display | B5.1 | `react-day-picker` |
| FileUpload | 2 | 12 | Inputs | B5.2 | — |
| Image | 2 | 13 | Data Display | B5.2 | `@radix-ui/react-avatar` fallback |
| DataTable | 2 | 6 | Data Display | B5.2 | `@tanstack/react-table` v8 |

---

### P2 — Medium Demand (needed by 3–7 apps)

| Component | Tier | Apps Needing | Story Group | Target Batch | Notes |
|---|---|---|---|---|---|
| NavigationMenu | 2 | 8 | Navigation | B5.2 | `@radix-ui/react-navigation-menu` |
| PageHeader | 2 | 8 | Layout | B5.2 | Structural shell; slot-based |
| Avatar | 1 | 6 | Data Display | B5.2 | `@radix-ui/react-avatar` |
| DateRangePicker | 2 | 7 | Inputs | B5.2 | `Calendar` + `Popover` |
| DateTimePicker | 2 | 5 | Inputs | B5.3 | `Calendar` + `Popover` |
| OtpInput | 2 | 6 | Inputs | B5.2 | — |
| Command | 2 | 5 | Misc | B5.3 | `cmdk` |
| Accordion | 2 | 4 | Layout | B5.3 | `@radix-ui/react-accordion` |

---

### P3 — Low Demand (1–3 apps; deferred to Phase 5.4 or Phase 3)

| Component | Tier | Apps Needing | Story Group | Target Batch | Notes |
|---|---|---|---|---|---|
| Menubar | 2 | 4 | Navigation | B5.4 | `@radix-ui/react-menubar` |
| MonthPicker | 2 | 3 | Inputs | B5.4 | `Calendar` + `Popover` |
| Timeline | 2 | 3 | Data Display | B5.4 | — |
| RichTextEditor | 2 | 1 | Inputs | Phase 3 | External dep; Phase 3 scope decision |

---

## Deferred — Not Building in `packages/ui`

| Item | Reason |
|---|---|
| Icon sub-library | Phase 3 scope decision; use Lucide React directly |
| `ReCaptcha` | Auth SDK; permanently app-local |
| `MicrosoftLoginButton` | Auth SDK; permanently app-local |
| `RichTextEditor` | 1-app demand; deferred to Phase 3 |
| Kanban components | ticket-portal specific; domain-coupled |
| Chart components | recharts+domain; data-coupled |

---

## Build Batch Sequencing

| Batch | Contents | Gate before next batch |
|---|---|---|
| **B4** (Phase 04 first pass) | Button, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Label, Table, Badge, Card, Skeleton, Spinner, Tabs, Drawer, Dialog, Alert, ContentLoadingWrapper, Pagination | All B4 Storybook stories green + axe-core zero violations; type-check pass |
| **B5.1** | DatePicker, Calendar, Form, Breadcrumb, Popover, Tooltip, DropdownMenu, NavigationMenu | B4 gate complete |
| **B5.2** | Combobox, FileUpload, Image, OtpInput, DataTable, DateRangePicker, Avatar, PageHeader | B5.1 gate complete |
| **B5.3** | DateTimePicker, Command, Accordion | B5.2 gate complete |
| **B5.4** | Menubar, MonthPicker, Timeline | B5.3 gate complete |

---

## App Migration Readiness (by B4 completion)

After B4 ships, these apps can immediately begin migration (no token normalization blocker):

| App | Readiness | Blocker (if any) |
|---|---|---|
| admin-portal | ✅ Ready for B4 components | — |
| admin-portal-boost | ✅ Ready | — |
| partner-portal | ✅ Ready | Prop adapter needed for legacy API |
| affiliate-admin | ✅ Ready | Prop adapter needed for `kind` → `variant` |
| ecommerce-teman | ✅ Ready | — |
| customer-portal | ✅ Ready | — |
| mykawan-website | ✅ Ready | — |
| teman-affiliate-admin | ✅ Ready | — |
| agent-admin | ✅ Ready | Hardcoded colors to fix in Phase 5 |
| agent-portal | ✅ Ready | — |
| agent-web-portal | ✅ Ready | 1 remaining Batch 1.5 candidate |
| teman-affiliate-portal | ✅ Ready | Box pass + token migration still needed |
| claim-portal | ✅ Ready | — |
| sso-portal | ✅ Ready | — |
| ticket-portal | ✅ Ready | 21 skipped Batch 1.5 candidates |
| gen-ai-portal | ✅ Ready | — |
| affiliate-portal | ✅ Ready | 3–5 NEW_SHARED_COMPONENT from splits TBD |
| boost-product-fe | ✅ Ready | — |
| getrev-da-microsite | ✅ Ready | 2 skipped Batch 1.5 candidates |
| gelm-xproject-microsite | ⚠️ Token normalization first | HeroUI token conflict |
| haruuz-microsite | ⚠️ Token normalization first | HeroUI coupling |
| teman-affiliate-microsite | ⚠️ Token normalization first | HeroUI coupling |
| grab-landing-page | ⚠️ Token normalization first | MUI + NextUI mixing |
| gegm-friendcover | ⚠️ Partial Batch 1.5 (17 skipped) | — |
| gegm-friendcover-admin | ✅ Ready | 41 MEDIUM skipped Batch 1.5 |
| ecommerce-gelm | ✅ Ready | — |
| agent-microsite | ✅ Ready | NextUI components in app code |