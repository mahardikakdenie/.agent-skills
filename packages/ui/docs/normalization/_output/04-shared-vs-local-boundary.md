# 04 — Shared-vs-Local Boundary

> **Batch:** Batch 2 — Design System Foundation
> **Branch:** `feat/ui`
> **Run date:** 2026-03-06
> **Source:** `06-component-standards.md §6 Shared-vs-Local Boundary Framework`

---

## Decision Tree

Source: `06-component-standards.md §6`

```
Is the component purely visual with no business logic?
  YES → Is it used (or likely used) by 2+ apps?
    YES → SHARED candidate → packages/ui
    NO  → KEEP_APP_LOCAL
  NO  → Has the business logic and UI been separated (Batch 1.5 done)?
    YES → Extract UI Shell → packages/ui; keep Container in app
    NO  → KEEP_APP_LOCAL (Batch 1.5 split first, then re-evaluate)

Does the component call APIs or use service hooks?
  YES → KEEP_APP_LOCAL (use packages/ui primitives inside it)

Does the component reference domain entities (Policy, Claim, Affiliate, etc.)?
  YES → KEEP_APP_LOCAL

Does the component use next/link, next/image, router, or navigation?
  YES → Extract the framework dependency (use 'as' prop or render-prop pattern)
       then evaluate for shared extraction

Is this an auth flow (SSO, OTP, PKCE, ReCaptcha, MicrosoftLoginButton)?
  YES → KEEP_APP_LOCAL permanently (security-sensitive, SDK-coupled)
```

---

## Always KEEP_APP_LOCAL

Source: `06-component-standards.md §6`

| Category | Examples | Reason |
|---|---|---|
| Domain forms (any with API calls or business validation) | `BrokerFeeForm`, `ClaimForm`, `DeclarationPage`, `PolicyForm` | Business logic |
| Table column configs | `*TableConfig.tsx`, column schema definitions | Domain-specific schema |
| Page-level layouts | `SidebarShell`, `LayoutViewShell`, `DashboardLayout` | App routing + nav config |
| Branded full-page loaders | Logo animation, company identity loaders | App identity |
| Chart wrappers with domain data | `RechartsDashboard`, `CommissionChart` | Data-coupled |
| Container components | `*Container.tsx` wrapping `use<Domain>()` hooks | Service layer coupling |
| Auth / SSO flows | `LoginPage`, `OtpPage`, `ReCaptcha`, `MicrosoftLoginButton` | Security + 3rd-party SDK |
| MIGRATE_AFTER_SPLIT pending queue | All unmarked Batch 1.5 items | Cannot share until Container/Shell split complete |

---

## Always Eligible for `packages/ui`

| Category | Examples |
|---|---|
| Pure display primitives | `Button`, `Input`, `Checkbox`, `Badge`, `Avatar` |
| Enhanced input wrappers (label + error) | `FormField`, `InputWithError` (→ absorbed by `Input` API) |
| Modal/dialog/drawer shells (no business content) | `Dialog`, `Drawer`, `Popover` |
| Loading indicators | `Spinner`, `Skeleton`, `ContentLoadingWrapper` |
| Empty states | Generic empty state with icon + copy slot |
| Data tables (generic column system; no hardcoded domain columns) | `DataTable` with `ColumnDef<TData>` interface |
| Navigation primitives (no hardcoded routes) | `Pagination`, `Breadcrumb`, `Tabs` |
| Layout primitives | `Box`, `Card`, `PageHeader` |

---

## Category-Level Boundary Rulings

Based on cross-app reconciliation of all 27 baseline summaries:

| Component type | Ruling | Basis |
|---|---|---|
| `Dialog` / `Modal` (shell, no content) | ✅ SHARED — `@repo/ui` | 26 apps need it; Radix-based |
| Domain forms embeded in Dialog | ❌ LOCAL — content stays in app | Business logic in dialog body |
| `Select` (single, multi, searchable, phone code) | ✅ SHARED — `@repo/ui` | 25 apps; consolidated via mode prop |
| `Select` with API call for options | ❌ LOCAL — container wraps Select primitive | Data fetching not in shared layer |
| `DataTable` | ✅ SHARED — generic (no domain columns) | 6 apps are explicit `DataTable` candidates; broader `Table` primitives are needed by 12 apps |
| Domain table column configs | ❌ LOCAL | Schema-specific |
| `ContentLoadingWrapper` (inline/overlay/page) | ✅ SHARED | 18 apps need unified loading UI |
| Branded full-page loaders (logo) | ❌ LOCAL | App identity |
| `Breadcrumb` shell | ✅ SHARED | 12 apps; `renderLink` slot for framework injection |
| Route-linked breadcrumbs | ❌ LOCAL — wraps `Breadcrumb` with route config | `next/link` stays out of packages/ui |
| `Pagination` | ✅ SHARED | 16 apps |
| `Tabs` | ✅ SHARED | 13 apps |
| `Alert` / `FlashMessage` / `Notification` | ✅ SHARED — `Alert` family | 22 apps; severity variant collapses types |
| `NavigationBar` (top-bar with route config) | ❌ LOCAL (mostly) | Router/config coupling |
| `PageHeader` (structural shell) | ✅ SHARED — structural title + actions slot | No hardcoded routes; slot-based |
| `Combobox` / `InputSelectAutocomplete` | ✅ SHARED | 8 apps; `Command` + `Popover` base |
| Custom Nested/Hierarchical Select (with domain-specific hierarchy) | ❌ LOCAL | Domain hierarchy baked in |
| `FileUpload` | ✅ SHARED | 12 apps; pure upload UX |
| `OtpInput` | ✅ SHARED | 6 apps; pure input UI |
| `ReCaptcha`, `MicrosoftLoginButton` | ❌ LOCAL permanently | 3rd-party SDK |
| Icon sub-library | ⏸ DEFERRED — use Lucide React directly | Phase 3 scope decision |
| `RichTextEditor` | ⏸ DEFERRED — Phase 3 scope decision | 1 app; heavy external dep |

---

## Zombie / Dead / Divergent Code Policy

Source: `06-component-standards.md §6.6`

After Batch 1.5 splits, each app's component set is classified. These rules govern what survives:

| Classification | Status after Batch 1.5 | What happens in Batch 5 |
|---|---|---|
| `ADOPT_NOW` | Shell migrates to `@repo/ui` import | Local copy deleted after parity gate |
| `ADOPT_WITH_ADAPTER` | Adapter shim written at usage site | Both shim + new import coexist until adapter migration |
| `EXTEND_EXISTING` | Gap filled in `@repo/ui` spec | Local extension deleted after shared version ships |
| `NEW_SHARED_COMPONENT` | Component built in Phase 04 | Local copy replaced when shared version passes parity gate |
| `KEEP_APP_LOCAL` (final) | Stays in app | Not touched during migration batches |
| `SPLIT` (Batch 1.5 complete) | Container is `KEEP_APP_LOCAL`; Shell is classified separately | Shell → `NEW_SHARED_COMPONENT` or `KEEP_APP_LOCAL` |
| `MIGRATE_AFTER_SPLIT` (pending) | Blocked until Batch 1.5 complete | Re-process after split |

**Zombie code rule:** Any local `src/components/ui/` file that is a structural duplicate of a shipped `@repo/ui` component MUST be deleted in the same migration PR that introduces the `@repo/ui` import. No parallel existence of dead duplicates is allowed more than 1 sprint after migration.

Adapter note: any candidate classified as `ADOPT_WITH_ADAPTER` must normalize at the app boundary in a later migration batch. Shared package APIs stay canonical even when the app transition is staged.

---

## Batch 1.5 Shell Classification

Post-Batch 1.5, shells from all 27 apps were evaluated:

| Result after split | Count (sum across 27 apps) | Ruling |
|---|---|---|
| NEW_SHARED_COMPONENT from splits | ~15 confirmed | Queued for Phase 04 — tracked in `05-coverage-baseline.md` |
| KEEP_APP_LOCAL shells (domain-specific display) | ~300+ | Remain in respective apps; not extracted |
| SKIPPED by apps (documented with reason) | 100+ | Deferred to Phase 05A re-evaluation |

Notable cross-app shared shell candidates surfaced from Batch 1.5:
- `BreadcrumbsShell` (agent-admin) → canonical candidate for `Breadcrumb` with `renderLink` slot
- `DashboardSidebarShell` (gen-ai-portal) → app-local only (domain nav config)
- `InfoProductShell`, `ViewImageShell` (grab-landing-page) → Phase 04 candidates
- `CompareShell`, `FormStepShell`, `NavigationBarShell` (ecommerce-gelm) → Phase 04 candidates
- `SelectPhoneCodeShell`, `NavigationBarShell`, `FileUploadShell` (sso-portal) → Phase 04 candidates

---

## `@repo/ui` Package Boundary Enforcement

These imports are **forbidden** inside `packages/ui` source files:

```ts
// FORBIDDEN — app imports
import anything from 'apps/*'
import anything from '@/services/*'
import anything from '@/hooks/*'

// FORBIDDEN — framework coupling
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRouter } from 'next/router'

// FORBIDDEN — domain types
import type { Policy } from '@/types/policy'
import type { Claim } from '@/types/claim'

// FORBIDDEN — environment
process.env.NEXT_PUBLIC_*
```

**Allowed pattern** for components that render links (e.g., `Breadcrumb`):

```tsx
// Pass an asChild render-prop or 'as' polymorphic prop — consumer injects next/link
<BreadcrumbLink asChild>
  <Link href="/dashboard">Dashboard</Link>
</BreadcrumbLink>
```
