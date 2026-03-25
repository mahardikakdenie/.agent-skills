# Command Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Misc` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Complex` |
| Based on | `cmdk` |

---

## Overview

`Command` is the shared low-level command surface for searchable action lists, command palettes, and inline quick-action menus that need cmdk's keyboard and filtering behavior without pulling app-specific routing or service logic into `@repo/ui`. It ships as a compound component family so apps can compose inline lists, grouped result sets, and shortcut rows with the same shared styling and accessibility baseline.

This contract intentionally does not ship a second overlay API. Inline usage stays on `Command` itself, while palette-style usage composes `Command` inside the already-shared `Dialog` primitives. That keeps one command surface and one overlay surface instead of widening the API with flat `items[]`, `variant="dialog"`, or duplicate open-state props.

**When to use:**

- Use `Command` for searchable action discovery, quick navigation lists, and inline command menus where the results are already available in memory.
- Use `CommandGroup` when results need clear headings or sectioning.
- Use `CommandShortcut` for secondary keyboard hints or trailing metadata that should stay visually aligned.
- Compose `Command` inside shared `Dialog` when the UI should behave like a command palette instead of an inline panel.

**When NOT to use:**

- Use `Combobox` for searchable single selection where the control owns a selected value and trigger shell.
- Use `DropdownMenu` for non-searchable action menus.
- Keep remote fetching, router integration, analytics side effects, and domain-specific command execution in app code.
- Do not add a dedicated `CommandDialog` export when shared `Dialog` composition already covers that need.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive stack | `cmdk` compound primitives | Matches the audited app baselines and the registry/API source without re-implementing keyboard search behavior. |
| Public API shape | compound | Grouping, shortcuts, and consumer-owned item content are clearer as composition than as a rigid `items[]` schema. |
| Overlay strategy | compose with shared `Dialog` | Avoids a duplicate overlay contract and keeps dialog semantics centralized in one shared component family. |
| Controlled vs uncontrolled search | both via cmdk primitives | cmdk already supports controlled and uncontrolled root/input usage; the shared wrapper should preserve that flexibility. |
| Box-only DOM rule | explicit boundary | Authored wrappers and helper nodes use `Box`; cmdk primitives remain the documented third-party DOM boundary. |

---

## Props Interface

### Root

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `'Command menu'` | No | Accessible label announced for the command surface. |
| `className` | `string` | `undefined` | No | Consumer override merged onto the root command surface. |
| `value` | `string` | internal state | No | Controlled search value for the command root. |
| `onValueChange` | `(value: string) => void` | `undefined` | No | Called when the search value changes. |
| `filter` | `(value: string, search: string, keywords?: string[]) => number` | cmdk default | No | Optional custom ranking/filtering logic. |
| `loop` | `boolean` | `false` | No | Loops keyboard selection from the last item back to the first. |
| `children` | `ReactNode` | - | Yes | Compound command content. |

### Compound sub-components

| Sub-component | Key props | Notes |
| --- | --- | --- |
| `CommandInput` | `value`, `onValueChange`, `placeholder`, native input props | Search field with shared icon row. |
| `CommandList` | `children` | Scroll container for command results. |
| `CommandEmpty` | `children` | Empty-state message shown when no results match. |
| `CommandGroup` | `heading`, `children` | Section wrapper for grouped results. |
| `CommandItem` | `value`, `keywords`, `disabled`, `onSelect` | Selectable result row. |
| `CommandSeparator` | `className` | Visual divider between groups or item sets. |
| `CommandShortcut` | `children` | Trailing aligned metadata, typically keyboard hints. |

### Box-only authored DOM policy

- Shared authored wrappers in `Command.tsx` use `Box` for every authored DOM node.
- `cmdk` primitives are the explicit third-party DOM boundary for the root, input, list, group, item, empty, and separator nodes.
- Stories must also avoid authored native tags and use `Box` for wrapper markup.

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Default | Rounded surface with searchable input and result list | Root exposes an accessible `label` |
| Searching | Search input filters visible items in place | Input remains a standard text field |
| Empty | Centered muted message inside the list area | Empty message remains readable text, not icon-only |
| Grouped | Group heading separates related commands | Headings remain visible and structured |
| Disabled item | Item stays visible but muted and non-interactive | cmdk preserves disabled semantics |
| Selected / highlighted | Active row uses accent background and foreground tokens | cmdk manages active descendant behavior |
| Dialog composed | Same command surface inside shared `Dialog` shell | Dialog title and description remain required for palette usage |

---

## Accessibility

- `label` is required conceptually and defaults to `Command menu` so the root always has an accessible name.
- `CommandInput` remains a native text input through cmdk and should use an explicit placeholder such as `Search commands…`.
- Keyboard interactions come from cmdk: Arrow keys move through items, Enter selects an active item, and Home/End follow the underlying list behavior.
- Dialog-composed usage must provide shared `DialogTitle` and `DialogDescription`, even when visually hidden, so the command palette has an accessible purpose.
- Disabled items remain visible in the results list and should not be removed purely for styling.

---

## Usage Examples

### 1. Inline command list

```tsx
<Command label="Quick actions">
  <CommandInput placeholder="Search commands…" />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandItem value="billing">Billing</CommandItem>
    <CommandItem value="settings">Settings</CommandItem>
  </CommandList>
</Command>
```

### 2. Grouped commands with shortcuts

```tsx
<Command label="Workspace commands">
  <CommandInput placeholder="Search commands…" />
  <CommandList>
    <CommandGroup heading="Profile">
      <CommandItem value="profile">
        <Box as="span">Profile</Box>
        <CommandShortcut>⌘P</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

### 3. Command palette composition

```tsx
<Dialog defaultOpen>
  <DialogContent className="overflow-hidden p-0">
    <DialogHeader className="sr-only">
      <DialogTitle>Command palette</DialogTitle>
      <DialogDescription>Search destinations and actions.</DialogDescription>
    </DialogHeader>
    <Command className="rounded-none border-0 shadow-none" label="Command palette">
      <CommandInput placeholder="Search commands…" />
      <CommandList>{/* items */}</CommandList>
    </Command>
  </DialogContent>
</Dialog>
```

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Compose `Command` with `Dialog` for palette-style overlays | Add a second shared overlay API just for command palettes |
| Use `CommandGroup` and `CommandShortcut` for richer layouts | Flatten every command into one rigid `items[]` shape |
| Keep command execution side effects in app code | Embed routing, data fetching, or auth logic inside `@repo/ui` |
| Use `keywords` on `CommandItem` when filtering needs aliases | Add extra hidden text nodes purely for search indexing |
| Keep authored wrappers on `Box` | Hand-write `div`, `span`, or `button` tags in shared source or stories |

---

## Storybook Stories Required

**Story file title:** `'Misc/Command'`

- [x] `Default`
- [x] `EmptyState`
- [x] `GroupedResults`
- [x] `WithShortcuts`
- [x] `DialogComposed`
- [x] `FilteringInteraction`

Roadmap alignment:

- `Command.Basic` -> `Default`
- `Command.Empty` -> `EmptyState`
- `Command.Groups` -> `GroupedResults`
- `Command.Shortcuts` -> `WithShortcuts`

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-12 | Initial Command spec with compound cmdk contract and shared Dialog composition guidance |
