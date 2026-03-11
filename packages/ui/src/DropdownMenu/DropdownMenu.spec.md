# DropdownMenu Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Overlays` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Complex` |
| Based on | `@radix-ui/react-dropdown-menu` |

---

## Overview

`DropdownMenu` is the shared action-menu surface for compact command lists, contextual row actions, and small preference menus. It wraps Radix Dropdown Menu for menu semantics, keyboard behavior, focus management, submenus, and checkbox or radio selection patterns while keeping the authored shared wrappers on `Box`.

This component intentionally ships as a flat compound export family instead of an `items[]` convenience renderer. The roadmap requires basic items, checkbox items, and submenu support in the same shared surface. A compound API keeps that scope app-agnostic, avoids boolean or union-prop sprawl, and lets consuming apps compose labels, separators, action callbacks, and checked state without leaking router, auth, or domain logic into `@repo/ui`.

**When to use:**

- Use `DropdownMenu` for compact action lists triggered by an icon button, row menu, or toolbar action.
- Use `DropdownMenuCheckboxItem` and `DropdownMenuRadioItem` for small local preference toggles or mode selection inside a menu.
- Use `DropdownMenuSub` when one menu item needs a nested action group without leaving the current context.

**When NOT to use:**

- Do not use `DropdownMenu` for full navigation trees; that belongs to `NavigationMenu` or app-local route composition.
- Do not use `DropdownMenu` for searchable option discovery or large datasets; those belong to `Combobox` or app-local search surfaces.
- Do not put service calls, permission logic, route construction, or domain-specific item shaping inside the shared component.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive | `@radix-ui/react-dropdown-menu` | Radix provides the correct menu, submenu, checkbox, radio, focus, and keyboard behavior for this interaction pattern. |
| Public API shape | Compound exports | `$vercel-composition-patterns` review favors composition here because the required submenu and checkbox capabilities do not fit a flat `items[]` contract cleanly. |
| Controlled vs uncontrolled | both | App baselines and overlay patterns in the repo use both controlled and uncontrolled open state. |
| Action handling | optional root `onAction` + per-item `value` | Keeps the shared API app-agnostic while still supporting the normalized `onAction` contract from the roadmap. |
| Portal | yes | Menu content and submenu content must escape stacking contexts and follow Radix overlay guidance. |
| Box-only DOM rule | explicit | Authored content wrappers, items, labels, separators, shortcut copy, and submenu triggers all render through `Box` via `asChild` or `as`. |

---

## Props Interface

### Root

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | No | Controlled open state. |
| `defaultOpen` | `boolean` | `undefined` | No | Uncontrolled initial open state. |
| `onOpen` | `() => void` | `undefined` | No | Called when the menu opens. |
| `onClose` | `() => void` | `undefined` | No | Called when the menu closes. |
| `onAction` | `(value: string) => void` | `undefined` | No | Shared action callback invoked by composed items that provide a `value`. |
| `disabled` | `boolean` | `false` | No | Disables the trigger through shared root context. |
| `modal` | `boolean` | `true` | No | Radix modal behavior flag for focus and pointer handling. |
| `children` | `React.ReactNode` | - | Yes | Composed trigger, content, and item structure. |

### Content

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `align` | `'start' \| 'center' \| 'end'` | `'end'` | No | Horizontal alignment relative to the trigger. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | No | Preferred content side relative to the trigger. |
| `sideOffset` | `number` | `8` | No | Distance between the trigger and menu content. |
| `className` | `string` | `undefined` | No | Consumer override merged onto the content shell. |
| `children` | `React.ReactNode` | - | Yes | Menu labels, items, groups, separators, and submenu structures. |

### Item family

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | `undefined` | No | Action payload forwarded to root `onAction` when the item is selected. |
| `icon` | `React.ReactNode` | `undefined` | No | Leading visual slot for the item label. |
| `shortcut` | `React.ReactNode` | `undefined` | No | Trailing shortcut or helper copy rendered on the right. |
| `inset` | `boolean` | `false` | No | Adds left padding for nested or iconless alignment cases. |
| `destructive` | `boolean` | `false` | No | Applies destructive emphasis for irreversible actions. |
| `disabled` | `boolean` | `false` | No | Prevents selection and applies disabled styling. |
| `className` | `string` | `undefined` | No | Consumer override merged onto the item shell. |
| `children` | `React.ReactNode` | - | Yes | Visible item label and any custom inline content. |

### Checkbox and radio items

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `checked` | `boolean \| 'indeterminate'` | `undefined` | No | Controlled checked state for `DropdownMenuCheckboxItem`. |
| `onCheckedChange` | `(checked: boolean) => void` | `undefined` | No | Called when the checkbox item toggles. |
| `value` | `string` | - | Yes for radio item | Radio item value for `DropdownMenuRadioGroup`. |

---

## Variants

`DropdownMenu` intentionally keeps visual variants internal. Shared menu behavior depends on a single canonical surface rather than a growing `variant`, `tone`, or density matrix.

| Shared treatment | Description | When to use |
| --- | --- | --- |
| Default menu item | Neutral action row with hover and keyboard-highlight styling | General action menus and row menus. |
| Destructive item | Destructive text and highlighted state | Delete, archive, revoke, or similar irreversible actions. |
| Checkbox / radio item | Left indicator slot reserved for selection state | Preference toggles and mutually exclusive view choices. |
| Submenu trigger | Right chevron affordance with nested content | Secondary action groups or mode categories. |

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Closed | Trigger only; no menu content rendered in flow | Trigger remains a button with Radix menu semantics |
| Open | Portal-backed content renders with tokenized surface and motion | Radix handles menu role, focus movement, and Escape close |
| Highlighted | Active item row uses accent tokens | Keyboard navigation exposes highlighted item state |
| Disabled | Item or trigger becomes muted and non-interactive | Disabled state is forwarded through Radix attributes |
| Checkbox selected | Check indicator appears on the left | Checked state is announced by Radix checkbox item semantics |
| Radio selected | Selected indicator appears on the left | Radio group semantics stay on Radix primitives |
| Submenu open | Nested content renders adjacent to the parent item | Right-arrow and pointer movement stay in the menu system |
| Destructive | Destructive item stays visually distinct from neutral items | Action text remains readable and keyboard reachable |

---

## Compound Sub-components

| Sub-component | Purpose | Key props |
| --- | --- | --- |
| `DropdownMenu` | Root open-state wrapper and shared action context | `open`, `defaultOpen`, `onOpen`, `onClose`, `onAction`, `disabled` |
| `DropdownMenuTrigger` | Trigger element, usually composed with `asChild` | Radix trigger props |
| `DropdownMenuContent` | Main menu panel | `align`, `side`, `sideOffset` |
| `DropdownMenuGroup` | Groups related items | Radix group props |
| `DropdownMenuLabel` | Non-interactive section label | `inset` |
| `DropdownMenuItem` | Standard action row | `value`, `icon`, `shortcut`, `destructive` |
| `DropdownMenuCheckboxItem` | Toggle row with checked indicator | `checked`, `onCheckedChange`, `shortcut` |
| `DropdownMenuRadioGroup` | Radio item state container | `value`, `onValueChange` |
| `DropdownMenuRadioItem` | Radio row with selected indicator | `value`, `shortcut` |
| `DropdownMenuSeparator` | Visual separator between groups | none |
| `DropdownMenuSub` | Nested submenu state wrapper | Radix sub props |
| `DropdownMenuSubTrigger` | Parent row that opens a submenu | `icon`, `inset` |
| `DropdownMenuSubContent` | Nested submenu panel | `align`, `sideOffset` |

---

## Accessibility

### ARIA Roles & Attributes

| Element | Role / Attribute | Value |
| --- | --- | --- |
| Trigger | implicit role | Radix trigger button with menu semantics |
| Content | implicit role | Radix `menu` |
| Item | implicit role | Radix `menuitem` |
| Checkbox item | implicit role | Radix `menuitemcheckbox` |
| Radio item | implicit role | Radix `menuitemradio` |
| Separator | `role` | `separator` |

### Keyboard Map

| Key | Behavior |
| --- | --- |
| `Enter` / `Space` | Opens the menu from the trigger and selects the highlighted item |
| `ArrowDown` / `ArrowUp` | Opens the menu and moves highlight through items |
| `ArrowRight` | Opens a submenu when focus is on a submenu trigger |
| `ArrowLeft` | Closes a submenu and returns focus to its trigger |
| `Escape` | Closes the current menu layer and returns focus to the trigger |
| `Tab` | Leaves the trigger; open-menu navigation stays inside Radix menu handling |

### Focus Management

- Opening the menu moves highlight into the first enabled item according to Radix menu behavior.
- Closing the root menu returns focus to the trigger.
- Submenu opening shifts focus into the submenu content and returns it to the submenu trigger when closed.

### Screen Reader Notes

- Section labels are announced as non-interactive grouping copy.
- Checkbox and radio item state changes are announced by Radix semantics.
- Destructive styling does not replace clear action text; labels remain explicit.

---

## Usage Examples

### 1. Basic action menu

```tsx
<DropdownMenu onAction={(value) => console.log(value)}>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem value="edit">Edit profile</DropdownMenuItem>
    <DropdownMenuItem value="share">Share link</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem value="delete" destructive>
      Delete record
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 2. Checkbox items

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Columns</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start">
    <DropdownMenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
      Status
    </DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem checked={showUpdatedAt} onCheckedChange={setShowUpdatedAt}>
      Updated at
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 3. Submenu

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">More</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem value="pdf">Export as PDF</DropdownMenuItem>
        <DropdownMenuItem value="csv">Export as CSV</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  </DropdownMenuContent>
</DropdownMenu>
```

### 4. Real-world row action menu

```tsx
<DropdownMenu onAction={handleRowAction}>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" aria-label="Open row actions">
      <MoreHorizontal />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem value="view">View details</DropdownMenuItem>
    <DropdownMenuItem value="duplicate">Duplicate</DropdownMenuItem>
    <DropdownMenuItem value="archive" destructive>
      Archive
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Use compound parts to compose labels, separators, submenus, and checked items. | Force every menu shape through a flat `items[]` prop. |
| Use root `onAction` only for simple value dispatch. | Put routing, auth, or service logic inside the shared component. |
| Keep menu labels explicit and action text specific. | Rely on icon-only menu rows without accessible text. |
| Use checkbox and radio items for local selection state inside a menu. | Overload plain items with manual checked icons and custom ARIA. |
| Keep authored wrappers on `Box` and rely on Radix `asChild` composition. | Hand-author native JSX tags in the shared source or stories. |
| Use destructive styling only for truly irreversible actions. | Mark routine navigation or neutral settings actions as destructive. |

---

## Storybook Stories Required

**Story file title:** `'Overlays/DropdownMenu'`

- [x] `Basic`
- [x] `CheckboxItems`
- [x] `Submenu`
- [x] `DisabledState`
- [x] `Interactive`
- [x] `ResponsiveLayout`
- [x] `ControlledOpen`

---

## Box-only DOM policy

- Authored shared JSX for this component and its stories must use `Box` for every DOM node we own.
- Trigger composition should prefer `asChild` with an existing shared interactive primitive such as `Button`.
- Menu content, labels, items, separators, shortcut copy, and submenu triggers render through `Box` via Radix `asChild`.
- Third-party DOM authored internally by Radix Portal and primitive internals is the documented library constraint for this component.

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-11 | Initial DropdownMenu spec |