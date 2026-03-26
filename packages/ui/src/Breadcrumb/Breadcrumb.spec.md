# Breadcrumb Spec

## Metadata

| Field | Value |
| ----- | ----- |
| Storybook Group | `Navigation` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Standard` |
| Based on | `Box`-backed custom composition |

---

## Overview

`Breadcrumb` is a lightweight ancestor trail for page-level orientation and optional backtracking through a shallow information hierarchy. It stays intentionally app-agnostic: the shared component owns only semantic breadcrumb markup, separator rendering, and current-page semantics, while route construction and router integration stay in the consuming app.

Cross-app baseline evidence converged on two valid authoring modes:

- a concise flat API with ordered `items`, an optional custom separator, and explicit current-page treatment
- a compound composition path for legacy JSX-authored trails and framework-link injection

The shared contract still avoids router wrappers, truncation policy, or route derivation so it can normalize breadcrumb shells without taking ownership of app-specific navigation behavior.

**When to use:**

- Show a page's ancestor path near a title, toolbar, or content header.
- Render plain anchor navigation for route segments already expressed as `href` strings.
- Preserve authored breadcrumb markup when migrating an existing compound trail.
- Append a current-page label when ancestors and current page are authored separately.

**When NOT to use:**

- Do not use `Breadcrumb` for primary navigation menus, route trees, or sidebars; those stay on `NavigationMenu` or app-local shells.
- Do not move router adapters, query-string logic, or framework-specific links into this shared component.

---

## Design Decisions

| Decision | Choice | Rationale |
| -------- | ------ | --------- |
| Root primitive | `Box as="nav"` + `Box as="ol"` | Preserves semantic breadcrumb structure while enforcing the Box-only authored DOM rule. |
| CVA strategy | Slot-based internal CVA classes | The component has no public variant prop, but root, link, current item, and separator surfaces still need canonical token-driven styling. |
| Controlled vs uncontrolled | none | `Breadcrumb` is display-only and has no internal behavioral state. |
| Public API shape | flat `items[]` plus additive compound exports | Keeps the concise convenience path while providing an app-agnostic migration surface for legacy authored trails. |
| Link strategy | plain `href` strings by default; `asChild` for injected links/buttons | Keeps `@repo/ui` free of `next/link` or app router dependencies while still supporting framework-specific composition. |
| Composition review | compound exports accepted as compatibility surface | Shared context remains minimal and only supplies the default separator, so the additive surface stays defensible and app-agnostic. |
| Box-only DOM policy | explicit | All authored markup in implementation and stories must render through `Box`, including `nav`, `ol`, `li`, `a`, `button`, and `span`. |

---

## Props Interface

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `items` | `BreadcrumbItem[]` | - | No | Ordered ancestor items for the concise flat API. Each item may provide `href` and may mark itself as the current page with `current`. |
| `separator` | `React.ReactNode` | chevron icon | No | Decorative separator rendered between breadcrumb items. |
| `currentLabel` | `string` | `undefined` | No | Appends a final current-page crumb when `items` does not already include one. Ignored if any item has `current: true`. |
| `children` | `React.ReactNode` | `undefined` | No | Compound breadcrumb markup authored with `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, and `BreadcrumbSeparator`. |
| `className` | `string` | `undefined` | No | Consumer override merged last through `cn()`. |
| `...props` | `React.HTMLAttributes<HTMLElement>` | - | No | Native `nav` attributes such as `aria-label`, `id`, `data-*`, and test hooks. |

### Complex Prop Shapes

```ts
export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}
```

### Compound Exports

- `BreadcrumbList`: ordered-list wrapper for authored breadcrumb items
- `BreadcrumbItem`: list item wrapper for one crumb
- `BreadcrumbLink`: shared crumb link surface; renders an anchor for `href`, a button for callback-only navigation, or composes via `asChild`
- `BreadcrumbPage`: current-page text with `aria-current="page"`
- `BreadcrumbSeparator`: decorative separator; inherits the root `separator` prop when not given explicit children

---

## Visual Contract

| Surface | Description | Use |
| ------- | ----------- | --- |
| Ancestor link | Muted text with hover and visible focus ring | Use for navigable earlier trail items. |
| Callback crumb | Link-styled button with the same hover and focus affordance | Use for app-owned back/list navigation that is not expressed as a plain `href`. |
| Non-link ancestor | Muted text without interactive affordance | Use when an item is informational only. |
| Current page | Stronger foreground text with `aria-current="page"` | Use for the active page label. |
| Separator | Decorative chevron by default | Use only as visual structure; never as meaningful content. |

---

## States

| State | Visual Behavior | Accessibility |
| ----- | --------------- | ------------- |
| Default | Ordered trail with muted ancestors and a stronger current page | Root is a labeled `nav`; current crumb exposes `aria-current="page"`. |
| Hover | Ancestor links and callback crumbs increase contrast and underline | Visual feedback only on interactive crumbs. |
| Focus | Interactive crumbs show a visible `focus-visible` ring | Keyboard users can see the current focus target. |
| Custom separator | Consumer node replaces the default chevron | Separator stays `aria-hidden` and decorative. |
| Long labels | Trail wraps across lines instead of clipping semantics | Labels remain readable and in DOM order on narrow screens. |

`Breadcrumb` has no loading, disabled, error, or async states.

---

## Accessibility

### Semantics

- Root renders as `nav` with `aria-label="Breadcrumb"` by default.
- Items render inside an ordered list to preserve trail structure.
- The current page renders as non-link text with `aria-current="page"`.
- Callback-only crumbs render as `button`, not clickable `span` or `div` wrappers.
- Separators are always decorative and hidden from assistive technology.

### Keyboard Map

| Key | Behavior |
| --- | -------- |
| `Tab` | Moves focus through interactive ancestor crumbs in DOM order |
| `Shift+Tab` | Moves backward through focused breadcrumb links/buttons |
| `Enter` | Activates the focused ancestor link or callback crumb |
| `Space` | Activates the focused callback crumb when it renders as a button |

### Focus Management

- `Breadcrumb` does not manage focus programmatically.
- Focus remains consumer-owned and follows normal document order.
- Only actual interactive crumbs are tabbable; the current page is not interactive.

### Screen Reader Notes

- Screen readers announce the root as breadcrumb navigation when the default or supplied `aria-label` is present.
- Decorative separators are hidden.
- If `currentLabel` is used, it is appended as the announced current page.

---

## Usage Examples

### 1. Ancestors plus current label

```tsx
<Breadcrumb
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings', href: '/dashboard/settings' },
  ]}
  currentLabel="Profile"
/>
```

### 2. Explicit current item in the trail

```tsx
<Breadcrumb
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings', href: '/dashboard/settings' },
    { label: 'Profile', current: true },
  ]}
/>
```

### 3. Custom decorative separator

```tsx
<Breadcrumb
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Reports', href: '/dashboard/reports' },
  ]}
  currentLabel="Monthly summary"
  separator="/"
/>
```

### 4. Informational middle item without a link

```tsx
<Breadcrumb
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Archived workspace' },
  ]}
  currentLabel="Settings"
/>
```

### 5. Legacy compound composition

```tsx
<Breadcrumb separator="/">
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/dashboard/settings">Settings</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Profile</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### 6. Framework link or callback crumb

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link href="/dashboard">Dashboard</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <button type="button" onClick={handleBackToList}>
          Users
        </button>
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Detail</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

## Do / Don't

| Do | Don't |
| --- | ----- |
| Keep route construction and framework link wrappers in the consuming app. | Import `next/link` or any router package into `@repo/ui`. |
| Mark the active page with `current: true` or provide `currentLabel`. | Make the current breadcrumb item interactive. |
| Use the flat `items[]` API for simple data-driven trails and the compound exports for legacy JSX-authored trails. | Force every migration into `items[]` when the existing authored trail already composes cleanly. |
| Use `BreadcrumbLink asChild` for framework links or callback buttons. | Rely on app-specific router wrappers inside `@repo/ui`. |
| Supply only decorative content through `separator`. | Put meaningful copy or controls into the separator slot. |
| Keep authored shared JSX on `Box` in both implementation and stories. | Hand-write native `nav`, `ol`, `li`, `a`, `button`, or `span` tags in shared authored JSX. |
| Use `className` for local spacing or width adjustments. | Add app-specific truncation, router, or analytics logic to the shared component. |

---

## Storybook Stories Required

**Story file title:** `'Navigation/Breadcrumb'`

- [x] `Default`
- [x] `CurrentItem`
- [x] `CustomSeparator`
- [x] `Compound`
- [x] `LongLabels`

---

## Per-App Baseline Inputs Consulted

- `packages/ui/docs/normalization/per-app/admin-portal_baseline-summary.md`
- `packages/ui/docs/normalization/per-app/admin-portal-boost_baseline-summary.md`
- `packages/ui/docs/normalization/per-app/agent-admin_baseline-summary.md`
- `packages/ui/docs/normalization/per-app/claim-portal_baseline-summary.md`
- `packages/ui/docs/normalization/per-app/teman-affiliate-admin_baseline-summary.md`

Key recurring needs captured:

- Flat ancestor trail API with `items` and optional custom separator
- Compound breadcrumb shells already authored in app code
- Current-page semantics as the last crumb
- Router-specific link behavior staying outside the shared package

---

## Changelog

| Date | Change |
| ---- | ------ |
| 2026-03-11 | Initial Breadcrumb spec |
| 2026-03-27 | Added additive compound exports as the approved legacy migration path while preserving the flat `items[]` API |
