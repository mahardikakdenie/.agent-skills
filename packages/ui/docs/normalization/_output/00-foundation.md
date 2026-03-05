# 00 - Design System Foundation

> Batch: Batch 2 - Design System Foundation
> Branch: feat/ui
> Run date: 2026-03-06
> Inputs: 27 per-app baseline summaries from packages/ui/docs/normalization/per-app
> Required references read: migration-batch-prompts.md (Batch 2), 02-design-system-foundation.md, 06-component-standards.md
> Current @repo/ui export surface: Box only

---

## 1. Objective Lock

This document is the foundation contract for packages/ui.
All Batch 3 to Batch 5 implementation must conform to this contract.

Breaking-change rule once Batch 3 starts:
- Canonical prop names
- Canonical variant values
- Tier assignment
- Token names

Any change to the items above requires a Foundation Amendment PR with app impact and migration plan.

---

## 2. App-Agnostic Principle

Hard rules:
- packages/ui must not import from apps/*.
- packages/ui must not call APIs or access app service hooks.
- packages/ui must not use app domain models in component contracts.
- packages/ui must not use Next.js runtime APIs directly in shared components.
- packages/ui must not read NEXT_PUBLIC_* env values.

Implementation consequence:
- Shared components receive plain serializable props.
- Data fetching, routing, auth, and workflow orchestration remain in app-level containers.

---

## 3. Shared Package Contracts

| Package | Responsibility | Batch 2 ruling |
|---|---|---|
| @repo/config | Token source of truth | Must provide semantic token contract before broad shared rollout |
| @repo/helper | Shared utilities | Keep app-agnostic helpers only |
| @repo/interface | Shared interfaces | Type-only cross-app contracts, no domain leakage |
| apps/* | Product applications | Never imported by packages/ui |

---

## 4. Spec-First and Storybook-First Policy

Each shared component requires:
1. <Component>.spec.md first
2. <Component>.stories.tsx first-class acceptance artifact
3. <Component>.tsx implementation
4. index.ts export

Minimum story coverage:
- default
- all variants
- all sizes (if size exists)
- disabled
- loading (if applicable)
- error (if applicable)
- long content edge case

---

## 5. Accessibility Baseline

Mandatory for all shared components:
- Keyboard operability (tab, enter, space, esc where applicable)
- Visible focus ring
- Correct role and aria attributes
- Dialog title/description semantics
- Error state semantics with aria-invalid and described-by
- WCAG AA contrast minimum

Radix primitive policy:
- Use Radix primitives for dialogs, menus, tooltip, popover, select, checkbox, switch, tabs, and related interaction patterns.

---

## 6. API Normalization Decisions (Locked)

Cross-app consolidation decisions:
- Modal/Dialog/BottomSheet/Drewer family -> Dialog + Drawer
- InputEmail/InputPhone/InputCurrency/InputText/InputName/InputNumber family -> Input with mode-based API
- Select/MultiSelect/SelectAutocomplete/SelectPhoneCode/InputSelect family -> Select family
- FlashMessage/Notification/ErrorContent/AlertBanner family -> Alert family
- Loading/Loader/LoadingWrapper/SuspenseFallback family -> ContentLoadingWrapper + Skeleton
- Datepicker/DatePicker/DayPicker variants -> DatePicker family (single/range/datetime)

---

## 7. Review Gate (Required Before Merge)

- API follows 02-api-conventions.md
- Token usage follows 03-token-theming-contract.md
- Boundary decision follows 04-shared-vs-local-boundary.md
- Coverage row exists in 05-coverage-baseline.md
- Risk row exists in 06-risk-register.md for high-risk areas
- pnpm --filter @repo/ui check-types passes
- pnpm --filter @repo/ui lint passes
- pnpm --filter @repo/ui build passes
- Storybook render and a11y checks pass for introduced components

---

## 8. Batch 2 Input Completeness Matrix

| App | Baseline file | Loaded |
|---|---|---|
| admin-portal | packages/ui/docs/normalization/per-app/admin-portal_baseline-summary.md | yes |
| admin-portal-boost | packages/ui/docs/normalization/per-app/admin-portal-boost_baseline-summary.md | yes |
| affiliate-admin | packages/ui/docs/normalization/per-app/affiliate-admin_baseline-summary.md | yes |
| affiliate-portal | packages/ui/docs/normalization/per-app/affiliate-portal_baseline-summary.md | yes |
| agent-admin | packages/ui/docs/normalization/per-app/agent-admin_baseline-summary.md | yes |
| agent-microsite | packages/ui/docs/normalization/per-app/agent-microsite_baseline-summary.md | yes |
| agent-portal | packages/ui/docs/normalization/per-app/agent-portal_baseline-summary.md | yes |
| agent-web-portal | packages/ui/docs/normalization/per-app/agent-web-portal_baseline-summary.md | yes |
| boost-product-fe | packages/ui/docs/normalization/per-app/boost-product-fe_baseline-summary.md | yes |
| claim-portal | packages/ui/docs/normalization/per-app/claim-portal_baseline-summary.md | yes |
| customer-portal | packages/ui/docs/normalization/per-app/customer-portal_baseline-summary.md | yes |
| ecommerce-gelm | packages/ui/docs/normalization/per-app/ecommerce-gelm_baseline-summary.md | yes |
| ecommerce-teman | packages/ui/docs/normalization/per-app/ecommerce-teman_baseline-summary.md | yes |
| gegm-friendcover | packages/ui/docs/normalization/per-app/gegm-friendcover_baseline-summary.md | yes |
| gegm-friendcover-admin | packages/ui/docs/normalization/per-app/gegm-friendcover-admin_baseline-summary.md | yes |
| gelm-xproject-microsite | packages/ui/docs/normalization/per-app/gelm-xproject-microsite_baseline-summary.md | yes |
| gen-ai-portal | packages/ui/docs/normalization/per-app/gen-ai-portal_baseline-summary.md | yes |
| getrev-da-microsite | packages/ui/docs/normalization/per-app/getrev-da-microsite_baseline-summary.md | yes |
| grab-landing-page | packages/ui/docs/normalization/per-app/grab-landing-page_baseline-summary.md | yes |
| haruuz-microsite | packages/ui/docs/normalization/per-app/haruuz-microsite_baseline-summary.md | yes |
| mykawan-website | packages/ui/docs/normalization/per-app/mykawan-website_baseline-summary.md | yes |
| partner-portal | packages/ui/docs/normalization/per-app/partner-portal_baseline-summary.md | yes |
| sso-portal | packages/ui/docs/normalization/per-app/sso-portal_baseline-summary.md | yes |
| teman-affiliate-admin | packages/ui/docs/normalization/per-app/teman-affiliate-admin_baseline-summary.md | yes |
| teman-affiliate-microsite | packages/ui/docs/normalization/per-app/teman-affiliate-microsite_baseline-summary.md | yes |
| teman-affiliate-portal | packages/ui/docs/normalization/per-app/teman-affiliate-portal_baseline-summary.md | yes |
| ticket-portal | packages/ui/docs/normalization/per-app/ticket-portal_baseline-summary.md | yes |

Validation:
- Baseline files found: 27
- migrate-app_* app worktrees checked (excluding migrate-app_base): 27
- Missing baseline summaries: 0