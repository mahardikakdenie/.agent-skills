# NavigationMenu Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Navigation` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Complex` |
| Based on | `@radix-ui/react-navigation-menu` |

---

## Overview

`NavigationMenu` is the shared app-agnostic navigation primitive for top-level site or workspace navigation that needs accessible disclosure behavior, viewport-backed content panels, and active-link semantics without baking route trees or framework routing into `@repo/ui`. It wraps Radix NavigationMenu and keeps all authored shared wrappers on `Box`, while apps retain ownership of route shaping, permission gating, and link elements.

The shared public API is intentionally compound: `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink`, `NavigationMenuIndicator`, and `NavigationMenuViewport`. This resolves the earlier route-tree blocker by replacing the flat `items[]` and `onNavigate` draft with a composition-first contract that keeps route data local and avoids boolean and schema sprawl.

**When to use:**

- Use `NavigationMenu` for persistent primary navigation with a mix of direct links and disclosure-backed content panels.
- Use `NavigationMenuLink` for top-level direct destinations and for navigational links rendered inside dropdown content.
- Use `NavigationMenuViewport` and `NavigationMenuIndicator` when the menu needs the advanced Radix floating-panel and active-trigger affordances.

**When NOT to use:**

- Do not move route trees, auth gating, breadcrumb generation, or app-specific information architecture into `@repo/ui`.
- Do not use `NavigationMenu` for contextual action menus; use `DropdownMenu` or `Menubar` instead.
- Do not use `NavigationMenu` for collapsible sidebars or app shells that also own page layout.
- Do not auto-open disclosure content in the baseline story or first-paint examples unless the example is explicitly demonstrating the open state.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive | `@radix-ui/react-navigation-menu` | Radix already owns the correct hover, focus, keyboard, indicator, viewport, and active-link semantics. |
| Public API shape | Compound exports | Prevents the blocked route-tree `items[]` contract from leaking app information architecture into `@repo/ui`. |
| Controlled vs uncontrolled | both | Root value state can stay internal or be controlled for analytics, previews, or app-owned routing sync. |
| Portal | no | Radix NavigationMenu is designed around root-relative content and viewport composition rather than a detached portal. |
| Orientation | `horizontal` and `vertical` | Supports top nav bars and stacked navigation groupings without adding route-aware modes. |
| Story baseline | closed by default | Enterprise navigation demos should represent the stable first-paint state unless the story is explicitly about open content. |
| Indicator placement | sibling to list in authored examples | `NavigationMenuList` is semantically rendered as `ul` in this workspace, so the indicator should not be authored as a direct child of the list. |
| Horizontal indicator treatment | subtle active bar | A low-noise bar reads cleaner than a floating caret between the rail and disclosure panel. |
| Open panel anchoring | below the horizontal rail | Trigger-backed content must preserve the visibility of the top-level navigation list while open. |
| Box-only DOM rule | explicit | All authored shared wrappers use `Box`; Radix primitives are the only accepted third-party DOM boundary. |

---

## Props Interface

### Root

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | `undefined` | No | Controlled active item value. |
| `defaultValue` | `string` | `undefined` | No | Uncontrolled initial active item value. |
| `onValueChange` | `(value: string) => void` | `undefined` | No | Called when the active item changes. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | No | Layout direction for the root and list wrappers. |
| `delayDuration` | `number` | `200` | No | Trigger-open pointer delay forwarded to Radix. |
| `skipDelayDuration` | `number` | `300` | No | Follow-up pointer delay window forwarded to Radix. |
| `dir` | `'ltr' \| 'rtl'` | inherited | No | Text direction forwarded to Radix. |
| `variant` | `'outline' \| 'shadow' \| 'ghost' \| 'default'` | `'outline'` | No | Shared navigation-surface treatment applied to `NavigationMenuTrigger` and `NavigationMenuLink`. Legacy `default` remains a compatibility alias for `shadow`. |
| `className` | `string` | `undefined` | No | Consumer override merged onto the root wrapper. |
| `children` | `React.ReactNode` | - | Yes | Composed navigation structure. |

### Compound exports

| Sub-component | Purpose | Key props |
| --- | --- | --- |
| `NavigationMenuList` | Shared wrapper for top-level items | `className` |
| `NavigationMenuItem` | One top-level navigation item | `value`, `className` |
| `NavigationMenuTrigger` | Opens a content panel for an item | inherits Radix trigger props plus optional `variant` override |
| `NavigationMenuContent` | Shared content panel surface | `forceMount`, `onPointerEnter`, `onPointerLeave` |
| `NavigationMenuLink` | Styled navigation link with optional `asChild` | `active`, `href`, `asChild`, `variant` |
| `NavigationMenuIndicator` | Active item indicator | `forceMount` |
| `NavigationMenuViewport` | Shared viewport surface for animated content sizing | `forceMount` |

---

## Variants

`NavigationMenu` keeps its layout contract narrow, but its owned interactive surfaces now normalize around one shared variant vocabulary. The root `variant` cascades to triggers and links, while explicit trigger/link `variant` props still win locally.

| Shared treatment | Description | When to use |
| --- | --- | --- |
| `outline` trigger/link | Bordered interactive surface with no resting shadow | Default navigation treatment and the fallback when `variant` is omitted |
| `shadow` trigger/link | Bordered interactive surface with `shadow-sm` on the actual trigger or link | Use when the navigation affordance should read as elevated |
| `ghost` trigger/link | Borderless transparent interactive surface | Use on already elevated or visually dense navigation rails |
| Active link | Accent-backed link state | Current route styling supplied by the app through `active` |
| Content panel | Tokenized popover-like card | Mega-menu, grouped destinations, or richer navigation copy |
| Viewport | Animated content viewport | Menus that rely on Radix advanced viewport sizing |
| Indicator | Small active trigger marker | Uses a subtle active bar in horizontal mode and a caret marker in vertical mode |

---

## States

| State | Visual behavior | Accessibility |
| --- | --- | --- |
| Idle | Top-level links and triggers sit on a neutral surface | Roving focus starts from the list order |
| Hover | Triggers and links use the muted hover fill | Pointer movement does not remove keyboard access |
| Focus | Visible ring on link or trigger | Keyboard users get a persistent focus target |
| Open | Trigger becomes active and content opens below the horizontal rail or inline in vertical mode | Radix announces the expanded state and manages focus flow without hiding sibling top-level items |
| Active route | `NavigationMenuLink` uses accent styling | `active` maps to `aria-current` behavior through Radix link semantics |
| Disabled | Trigger stops interaction and becomes muted | Disabled state is passed through Radix trigger semantics |
| Vertical layout | List stacks and viewport aligns below the list | Keyboard flow still follows Radix orientation rules |

---

## Accessibility

### ARIA Roles & Attributes

| Element | Role / Attribute | Value |
| --- | --- | --- |
| Root | implicit role | Radix navigation-menu semantics |
| Trigger | ARIA state | Managed by Radix trigger semantics |
| Link | `aria-current` | Managed through the Radix `active` prop |
| Content | implicit role | Radix content semantics |
| Indicator / Viewport | decorative container | Hidden from assistive technology when not needed |

### Keyboard Map

| Key | Behavior |
| --- | --- |
| `Tab` / `Shift+Tab` | Enter and leave the navigation in document order |
| `ArrowRight` / `ArrowLeft` | Move between horizontal top-level items |
| `ArrowDown` / `ArrowUp` | Move between vertical items or into relevant content flows |
| `Enter` / `Space` | Activate a link or open a trigger-backed item |
| `Escape` | Close the open content panel and return focus to the trigger |
| `Home` / `End` | Move to the first or last top-level item |

### Focus Management

- Focus stays on the active trigger when content opens and closes.
- Content panels should keep navigational links inside `NavigationMenuLink` so keyboard movement and active semantics stay consistent.
- Consumers should keep custom child links focusable when using `NavigationMenuLink asChild`.

### Screen Reader Notes

- All navigational links inside content panels should still use `NavigationMenuLink`.
- The current destination should use the `active` prop instead of app-local class-only styling so assistive semantics stay aligned.
- Decorative indicator and chevron affordances must not be the only carrier of meaning.

---

## Usage Examples

### 1. Basic

```tsx
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuLink href="/pricing">Pricing</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem value="solutions">
      <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
      <NavigationMenuContent>
        <Box className="grid gap-2 md:w-[28rem] md:grid-cols-2">
          <NavigationMenuLink href="/claims" className="block h-auto rounded-xl p-4">
            Claims workflows
          </NavigationMenuLink>
        </Box>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
  <NavigationMenuIndicator />
  <NavigationMenuViewport />
</NavigationMenu>
```

### 2. Active route

```tsx
<NavigationMenuLink href="/dashboard" active>
  Dashboard
</NavigationMenuLink>
```

### 3. Custom routing element

```tsx
<NavigationMenuLink asChild active>
  <Box as="a" href="/partners">
    Partners
  </Box>
</NavigationMenuLink>
```

### 4. Vertical layout

```tsx
<NavigationMenu orientation="vertical">
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuLink href="/overview">Overview</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem value="products">
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <Box className="grid gap-2">
          <NavigationMenuLink href="/products/core" className="justify-start">
            Core plan
          </NavigationMenuLink>
        </Box>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Compose route trees locally and map them into the shared compound parts. | Pass a full route tree into a flat shared `items[]` prop. |
| Use `NavigationMenuLink active` for current-route styling. | Hardcode only visual active styles without the shared active semantic path. |
| Keep links inside content panels on `NavigationMenuLink`. | Drop to raw anchors inside content and lose Radix link behavior. |
| Keep `NavigationMenuIndicator` as a sibling of `NavigationMenuList` in authored examples. | Place the indicator inside the semantic list and create invalid `ul` child structure. |
| Use `DropdownMenu` for action lists and `Menubar` for command bars. | Force `NavigationMenu` to cover every menu-like interaction. |
| Keep authored JSX on `Box` and let Radix be the only DOM boundary. | Hand-author native tags in shared source or stories. |
| Use `NavigationMenuViewport` only when the menu benefits from animated shared sizing. | Assume every menu needs a viewport even when it only contains direct links. |

---

## Storybook Stories Required

**Story file title:** `Navigation/NavigationMenu`

- [x] `Basic`
- [x] `ActiveLink`
- [x] `VerticalOrientation`
- [x] `AsChildLinks`
- [x] `DisabledTrigger`

---

## Box-only DOM policy

- All authored shared JSX in `NavigationMenu.tsx` and `NavigationMenu.stories.tsx` renders through `Box`.
- Root, list, item, trigger shell, link shell, content panel, indicator, viewport wrapper, and story layout wrappers all use `Box`.
- Radix primitives remain the documented third-party DOM boundary; no direct native JSX tags are authored in the shared implementation or stories.

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-13 | Initial NavigationMenu spec and compound route-agnostic contract |
| 2026-03-13 | Story guidance updated so baseline examples stay closed and authored indicator examples remain outside the semantic list |
