# Menubar Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Navigation` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Complex` |
| Based on | `@radix-ui/react-menubar` |

---

## Overview

`Menubar` is the shared desktop-style command bar for grouped top-level actions that should stay visible as part of a page or workspace chrome without becoming route-aware application navigation. It wraps Radix Menubar for persistent menubar semantics, roving focus across top-level triggers, submenu handling, checkbox and radio item behavior, and portal-backed floating content while keeping authored shared wrappers on `Box`.

The public API stays compound through `Menubar`, `MenubarMenu`, `MenubarTrigger`, `MenubarContent`, `MenubarItem`, `MenubarCheckboxItem`, `MenubarRadioGroup`, `MenubarRadioItem`, `MenubarLabel`, `MenubarSeparator`, `MenubarSub`, `MenubarSubTrigger`, `MenubarSubContent`, and `MenubarShortcut`. This is the explicit `$vercel-composition-patterns` decision for the component: the earlier flat `items[]` draft does not survive real cross-app needs such as nested export groups, shortcut copy, checkbox preferences, or radio-mode sections without turning into boolean and union-prop sprawl.

**When to use:**

- Use `Menubar` for persistent desktop command bars such as `File`, `Edit`, `View`, or `Tools` groups.
- Use `MenubarCheckboxItem` and `MenubarRadioItem` for lightweight preferences or view-mode choices inside the command bar.
- Use `MenubarSub` when a top-level or secondary menu item needs a nested action cluster.

**When NOT to use:**

- Do not use `Menubar` for route-tree navigation or marketing-site nav; that belongs to `NavigationMenu` or app-local routing shells.
- Do not use `Menubar` for contextual icon-button action menus; that belongs to `DropdownMenu`.
- Do not move routing, permission checks, service calls, or domain-specific command shaping into the shared component.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive | `@radix-ui/react-menubar` | Radix already provides the correct menubar, menu, checkbox, radio, submenu, focus, and keyboard behavior for this interaction model. |
| Public API shape | Compound exports | Keeps the contract flexible across app baselines and avoids a brittle `items[]` schema. |
| Controlled vs uncontrolled | both | App baselines and the Radix root both support externally controlled active-menu state as well as simple internal state. |
| Action handling | Optional root `onAction` + per-item `value` | Preserves the normalized action callback pattern without forcing items into a flat record array. |
| Portal | yes | Menu and submenu content must escape stacking contexts and align correctly around the menubar. |
| Box-only DOM rule | explicit | Root shell, triggers, content panels, items, labels, separators, shortcut copy, and story wrappers all render through `Box` via Radix `asChild` where supported. |

---

## Props Interface

### Root

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | `undefined` | No | Controlled active top-level menu value. |
| `defaultValue` | `string` | `undefined` | No | Uncontrolled initial active top-level menu value. |
| `onValueChange` | `(value: string) => void` | `undefined` | No | Called when the active top-level menu changes. |
| `loop` | `boolean` | `true` | No | Whether keyboard focus loops across triggers. |
| `dir` | `'ltr' \| 'rtl'` | inherited | No | Directionality forwarded to the roving-focus group. |
| `disabled` | `boolean` | `false` | No | Disables all top-level triggers through shared root context. |
| `onAction` | `(value: string) => void` | `undefined` | No | Shared action callback invoked by item rows that provide a `value`. |
| `className` | `string` | `undefined` | No | Consumer override merged onto the root shell. |
| `children` | `React.ReactNode` | - | Yes | Composed menu structure. |

### Compound exports

| Sub-component | Purpose | Key props |
| --- | --- | --- |
| `MenubarMenu` | Defines one top-level menu group | `value` |
| `MenubarTrigger` | Top-level command-bar trigger | `disabled`, `children` |
| `MenubarContent` | Main menu panel | `align`, `alignOffset`, `sideOffset` |
| `MenubarGroup` | Groups related items within content | `className` |
| `MenubarLabel` | Non-interactive group label | `inset` |
| `MenubarItem` | Standard action row | `value`, `icon`, `shortcut`, `inset`, `destructive` |
| `MenubarCheckboxItem` | Toggle row with checked indicator | `checked`, `onCheckedChange`, `value` |
| `MenubarRadioGroup` | State container for radio rows | `value`, `onValueChange` |
| `MenubarRadioItem` | Radio row with selected indicator | `value`, `shortcut`, `destructive` |
| `MenubarSeparator` | Visual separator between item groups | none |
| `MenubarSub` | Nested submenu state wrapper | `open`, `defaultOpen`, `onOpenChange` |
| `MenubarSubTrigger` | Parent row that opens a submenu | `icon`, `shortcut`, `inset` |
| `MenubarSubContent` | Nested submenu panel | `sideOffset` |
| `MenubarShortcut` | Trailing shortcut or helper copy | `className`, `children` |

---

## Variants

`Menubar` intentionally keeps visual variants internal. Cross-app demand points to one shared desktop command-bar surface rather than multiple `variant`, `tone`, or density branches.

| Shared treatment | Description | When to use |
| --- | --- | --- |
| Default root shell | Compact bordered command bar | General admin or desktop-like command bars |
| Active trigger | Accent-backed top-level trigger | Currently open top-level menu |
| Default item | Neutral action row with hover and keyboard highlight styling | Standard command rows |
| Destructive item | Destructive emphasis for irreversible actions | Delete, revoke, remove, or reset commands |
| Checkbox / radio item | Left indicator slot reserved for selection state | View preferences and mode selection |
| Submenu trigger | Right-chevron affordance with nested content | Secondary command groups |

---

## States

| State | Visual behavior | Accessibility |
| --- | --- | --- |
| Idle | Menubar root visible with no menu content open | Roving focus stays on the trigger row |
| Open | Active trigger uses accent styling and its menu content opens in a portal | Radix exposes the correct menubar/menu semantics |
| Highlighted | Focused item uses accent state styling | Arrow-key navigation stays visible for keyboard users |
| Disabled | Triggers or items become muted and non-interactive | Disabled rows stop pointer and keyboard activation |
| Checkbox selected | Check indicator appears on the left | Selection state is announced through Radix checkbox-item semantics |
| Radio selected | Dot indicator appears on the left | Selected state is announced through Radix radio-item semantics |
| Submenu open | Nested content opens adjacent to the parent row | Keyboard navigation moves into the submenu correctly |
| Destructive | Destructive row stays visually distinct | Explicit action label remains readable and focusable |

---

## Accessibility

### ARIA Roles & Attributes

| Element | Role / Attribute | Value |
| --- | --- | --- |
| Root | implicit role | Radix `menubar` |
| Trigger | implicit role | Radix `menuitem` within the menubar |
| Content | implicit role | Radix `menu` |
| Item | implicit role | Radix `menuitem` |
| Checkbox item | implicit role | Radix `menuitemcheckbox` |
| Radio item | implicit role | Radix `menuitemradio` |
| Separator | `role` | `separator` |

### Keyboard Map

| Key | Behavior |
| --- | --- |
| `Tab` / `Shift+Tab` | Moves into or out of the menubar in document order |
| `ArrowRight` / `ArrowLeft` | Moves focus between top-level triggers |
| `ArrowDown` | Opens the focused menu and highlights the first enabled item |
| `ArrowUp` | Opens the focused menu and highlights the last enabled item |
| `Enter` / `Space` | Opens the focused menu or activates the highlighted item |
| `Escape` | Closes the current menu layer and returns focus to its trigger |
| `Home` / `End` | Jumps to the first or last top-level trigger |

### Focus Management

- Focus stays on the top-level trigger when a menu opens or closes.
- Opening a submenu moves highlight into the nested content and closing it returns focus to the submenu trigger.
- Consumers should keep shortcut labels decorative and let visible command text carry the accessible name for each row.

### Screen Reader Notes

- Menu labels remain visible section headings instead of hidden-only grouping text.
- Checkbox and radio selection announcements come from Radix semantics and should not be replaced with icon-only meaning.
- Destructive styling is supplemental only; command labels must stay explicit.

---

## Usage Examples

### 1. Basic command bar

```tsx
<Menubar onAction={(value) => console.log(value)}>
  <MenubarMenu value="file">
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem value="new">New file</MenubarItem>
      <MenubarItem value="save" shortcut="?S">
        Save
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

### 2. Preferences inside the menubar

```tsx
<Menubar>
  <MenubarMenu value="view">
    <MenubarTrigger>View</MenubarTrigger>
    <MenubarContent>
      <MenubarCheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
        Show sidebar
      </MenubarCheckboxItem>
      <MenubarSeparator />
      <MenubarRadioGroup value={density} onValueChange={setDensity}>
        <MenubarRadioItem value="comfortable">Comfortable</MenubarRadioItem>
        <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
      </MenubarRadioGroup>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

### 3. Submenu

```tsx
<Menubar>
  <MenubarMenu value="export">
    <MenubarTrigger>Export</MenubarTrigger>
    <MenubarContent>
      <MenubarSub>
        <MenubarSubTrigger>Share</MenubarSubTrigger>
        <MenubarSubContent>
          <MenubarItem value="share-pdf">PDF</MenubarItem>
          <MenubarItem value="share-csv">CSV</MenubarItem>
        </MenubarSubContent>
      </MenubarSub>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

### 4. App-local mapping from an array

```tsx
<Menubar onAction={handleAction}>
  {menus.map((menu) => (
    <MenubarMenu key={menu.value} value={menu.value}>
      <MenubarTrigger>{menu.label}</MenubarTrigger>
      <MenubarContent>
        {menu.items.map((item) => (
          <MenubarItem key={item.value} value={item.value}>
            {item.label}
          </MenubarItem>
        ))}
      </MenubarContent>
    </MenubarMenu>
  ))}
</Menubar>
```

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Use compound parts so each top-level menu can own its own item structure. | Force every command bar through a flat `items[]` prop. |
| Use `onAction` only for simple shared value dispatch. | Put routing, service calls, or permission logic inside the shared component. |
| Keep command labels explicit and concise. | Rely on icon-only menu rows or hidden command text. |
| Use checkbox and radio items for local preferences and mode toggles. | Rebuild selection indicators and ARIA manually in app code. |
| Keep authored wrappers on `Box` and use Radix `asChild` where supported. | Hand-author native JSX tags in the shared source or stories. |
| Use `DropdownMenu` for contextual icon-button menus instead of forcing Menubar into that shape. | Treat Menubar as a generic replacement for every action menu. |

---

## Storybook Stories Required

**Story file title:** `Navigation/Menubar`

- [x] `Basic`
- [x] `Checkbox And Radio Items`
- [x] `Submenu`
- [x] `Controlled Value`
- [x] `Disabled State`

---

## Box-only DOM policy

- All authored shared JSX in `Menubar.tsx` and `Menubar.stories.tsx` renders through `Box`.
- Root, trigger, content shell, items, labels, separators, shortcut copy, and submenu shells all use `Box` directly or through Radix `asChild`.
- Radix portal internals remain the documented third-party DOM boundary for this component.

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-12 | Initial Menubar spec |
