# 05 - Coverage Baseline

> Batch: Batch 2 - Design System Foundation
> Branch: feat/ui
> Run date: 2026-03-06
> Inputs: 27 per-app baseline summaries reconciled

---

## 1. Coverage Summary

| Metric | Count |
|---|---:|
| Canonical shared components (Tier 1 + Tier 2) | 43 |
| Existing in @repo/ui | 1 (Box) |
| To build/extend | 42 |
| P0 components | 16 |
| P1 components | 14 |
| P2 components | 8 |
| P3 components | 4 |

---

## 2. Priority Coverage Plan

### P0 - Critical Path

| Component | Tier | Apps needing | Story group | Target batch |
|---|---:|---:|---|---|
| Button | 1 | 23 | Buttons | B4 |
| Input | 1 | 26 | Inputs | B4 |
| Textarea | 1 | 18 | Inputs | B4 |
| Select | 1 | 25 | Inputs | B4 |
| Checkbox | 1 | 20 | Inputs | B4 |
| Dialog | 2 | 26 | Overlays | B4 |
| Alert | 2 | 22 | Feedback | B4 |
| ContentLoadingWrapper | 2 | 18 | Layout | B4 |
| Skeleton | 1 | 10 | Feedback | B4 |
| Spinner | 1 | 8 | Feedback | B4 |
| Table | 1 | 12 | Data Display | B4 |
| Pagination | 2 | 16 | Navigation | B4 |
| Badge | 1 | 11 | Feedback | B4 |
| Card | 2 | 12 | Layout | B4 |
| DatePicker | 2 | 22 | Inputs | B5.1 |
| Form | 2 | 9 | Misc | B5.1 |

### P1 - High Demand

| Component | Tier | Apps needing | Story group | Target batch |
|---|---:|---:|---|---|
| Tabs | 2 | 13 | Navigation | B4 |
| Drawer | 2 | 10 | Overlays | B4 |
| RadioGroup | 1 | 11 | Inputs | B4 |
| Switch | 1 | 9 | Inputs | B4 |
| Label | 1 | 10 | Misc | B4 |
| Breadcrumb | 2 | 12 | Navigation | B5.1 |
| Popover | 2 | 9 | Overlays | B5.1 |
| Tooltip | 2 | 9 | Overlays | B5.1 |
| DropdownMenu | 2 | 12 | Overlays | B5.1 |
| Combobox | 2 | 8 | Inputs | B5.2 |
| Calendar | 2 | 9 | Data Display | B5.1 |
| FileUpload | 2 | 12 | Inputs | B5.2 |
| Image | 2 | 13 | Data Display | B5.2 |
| DataTable | 2 | 6 | Data Display | B5.2 |

### P2 - Medium Demand

| Component | Tier | Apps needing | Story group | Target batch |
|---|---:|---:|---|---|
| NavigationMenu | 2 | 8 | Navigation | B5.2 |
| PageHeader | 2 | 8 | Layout | B5.2 |
| Avatar | 1 | 6 | Data Display | B5.2 |
| DateRangePicker | 2 | 7 | Inputs | B5.2 |
| DateTimePicker | 2 | 5 | Inputs | B5.3 |
| OtpInput | 2 | 6 | Inputs | B5.2 |
| Command | 2 | 5 | Misc | B5.3 |
| Accordion | 2 | 4 | Layout | B5.3 |

### P3 - Low Demand

| Component | Tier | Apps needing | Story group | Target batch |
|---|---:|---:|---|---|
| Menubar | 2 | 4 | Navigation | B5.4 |
| MonthPicker | 2 | 3 | Inputs | B5.4 |
| Timeline | 2 | 3 | Data Display | B5.4 |
| RichTextEditor | 2 | 1 | Inputs | Phase 3 scope decision |

---

## 3. Deferred from Shared Scope

| Item | Reason |
|---|---|
| ReCaptcha | Auth SDK coupling; keep app-local |
| MicrosoftLoginButton | Auth SDK coupling; keep app-local |
| Kanban board composites | ticket-portal domain-coupled |
| App-specific chart wrappers | data and domain coupling |
| Icon sub-library | deferred; use Lucide directly for now |

---

## 4. Batch Sequencing

| Batch | Scope |
|---|---|
| B4 | Core primitives and high-frequency composites |
| B5.1 | Date and overlay normalization wave 1 |
| B5.2 | Advanced input and data display wave |
| B5.3 | Remaining medium-demand components |
| B5.4 | Long-tail low-demand components |

---

## 5. App Readiness for Shared Adoption

| App | Readiness | Constraint |
|---|---|---|
| admin-portal | ready | none |
| admin-portal-boost | ready | none |
| affiliate-admin | ready | adapter mapping for legacy prop names |
| affiliate-portal | ready | split outputs still tracked |
| agent-admin | ready | hardcoded color cleanup in app layer |
| agent-microsite | ready | next-ui remnants in app layer |
| agent-portal | ready | none |
| agent-web-portal | ready | remaining split candidate tracking |
| boost-product-fe | ready | none |
| claim-portal | ready | none |
| customer-portal | ready | none |
| ecommerce-gelm | ready | none |
| ecommerce-teman | ready | none |
| gegm-friendcover | conditional | partial split backlog remains |
| gegm-friendcover-admin | ready | medium split backlog remains |
| gelm-xproject-microsite | conditional | token normalization first |
| gen-ai-portal | ready | none |
| getrev-da-microsite | ready | small split backlog remains |
| grab-landing-page | conditional | MUI/NextUI token harmonization |
| haruuz-microsite | conditional | HeroUI token harmonization |
| mykawan-website | ready | none |
| partner-portal | ready | legacy prop adapter mapping |
| sso-portal | ready | none |
| teman-affiliate-admin | ready | large app-local inventory |
| teman-affiliate-microsite | conditional | HeroUI token harmonization |
| teman-affiliate-portal | ready | box pass and token standardization |
| ticket-portal | ready | split backlog remains |

---

## 6. Per-App Baseline Metrics (Traceability)

| App | Total audited | NEW_SHARED_COMPONENT | EXTEND_EXISTING | KEEP_APP_LOCAL | MIGRATE_AFTER_SPLIT or split | Source quality |
|---|---:|---:|---:|---:|---:|---|
| admin-portal | 275 | 36 | 0 | 235 | 4 | explicit |
| admin-portal-boost | 68 | 28 | 0 | 24 | 16 | explicit |
| affiliate-admin | 88 | 11 | 0 | 54 | 23 | explicit |
| affiliate-portal | 38 | 9 | 0 | 22 | 7 | explicit |
| agent-admin | 127 | 16 | 0 | 92 | 0 | explicit |
| agent-microsite | 90 | 17 | 0 | 73 | 0 | explicit |
| agent-portal | 44 | 0 | 0 | 29 | 15 | explicit |
| agent-web-portal | 157 | 21 | 0 | 118 | 17 | explicit |
| boost-product-fe | 43 | 16 | 0 | 17 | 10 | explicit |
| claim-portal | 65 | 15 | 0 | 28 | 22 | explicit |
| customer-portal | 193 | 28 | 0 | 68 | 97 | explicit |
| ecommerce-gelm | 62 | 20 | 0 | 28 | 14 | explicit |
| ecommerce-teman | 122 | 22 | 0 | 79 | 21 | explicit |
| gegm-friendcover | 89 | 15 | 0 | 54 | 20 | explicit |
| gegm-friendcover-admin | 178 | 15 | 0 | 114 | 34 | explicit |
| gelm-xproject-microsite | 79 | 10 | 0 | 57 | 12 | derived-total |
| gen-ai-portal | 23 | 5 | 0 | 8 | 10 | explicit |
| getrev-da-microsite | 84 | 27 | 0 | 41 | 16 | explicit |
| grab-landing-page | 48 | 20 | 0 | 17 | 11 | explicit |
| haruuz-microsite | 45 | 7 | 0 | 13 | 24 | explicit |
| mykawan-website | 60 | 12 | 0 | 31 | 17 | explicit |
| partner-portal | 77 | 23 | 0 | 54 | n/a | explicit |
| sso-portal | 22 | 4 | 0 | 12 | 6 | derived-total |
| teman-affiliate-admin | 393 | 61 | 0 | 310 | 22 | explicit |
| teman-affiliate-microsite | 151 | 19 | 0 | 82 | 50 | explicit |
| teman-affiliate-portal | 58 | 18 | 0 | 20 | 20 | derived-total |
| ticket-portal | 158 | 19 | 0 | 94 | 45 | explicit |

Notes:
- derived-total means total was not explicitly stated and was derived as NEW + KEEP + split from the same baseline file.
- This matrix is for traceability and planning confidence; canonical component scope is defined by Sections 1-3.