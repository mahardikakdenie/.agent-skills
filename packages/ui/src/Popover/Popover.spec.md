# Popover Spec

## Metadata

| Field           | Value                     |
| --------------- | ------------------------- |
| Storybook Group | `Overlays`                |
| Component Tier  | `Tier 2 (Composite)`      |
| Structure Tier  | `Standard`                |
| Based on        | `@radix-ui/react-popover` |

---

## Overview

`Popover` is the shared contextual overlay shell for `@repo/ui`. It is the non-modal, anchored floating surface used for compact details, inline actions, and small form layouts that need more structure than `Tooltip` but should not take on the modal semantics of `Dialog` or the action-list semantics of `DropdownMenu`.

The shared contract stays intentionally small: open state, trigger and anchor composition, content positioning, and a tokenized floating surface. Domain-specific filtering, date logic, routing, service orchestration, and menu behavior stay outside this component so it remains the overlay foundation for later `DatePicker`, `DateRangePicker`, `Combobox`, and app-local contextual shells.

**When to use:**

- Use `Popover` for compact contextual details or settings panels that open from a trigger and remain anchored to it.
- Use it as the shared floating shell for later picker and combobox work.
- Compose shared inputs or structural content inside the popover when a small in-place overlay is enough.

**When NOT to use:**

- Do not use `Popover` for destructive confirmations or modal workflows; use `Dialog`.
- Do not use it for action menus, checkbox menus, or submenu trees; use `DropdownMenu`.
- Do not collapse domain-specific filter state, date formatting policy, or router logic into the shared popover API.

---

## Design Decisions

| Decision                   | Choice                          | Rationale                                                                                                                                                   |
| -------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primitive                  | `@radix-ui/react-popover`       | The roadmap explicitly targets Radix Popover as the overlay foundation dependency for later waves.                                                          |
| Public API shape           | compound exports                | `Popover`, `PopoverTrigger`, `PopoverAnchor`, `PopoverContent`, and `PopoverClose` match the actual Radix composition model and avoid boolean prop sprawl.  |
| Controlled vs uncontrolled | both                            | The roadmap requires `Popover.Controlled`, and cross-app baselines include externally managed open state.                                                   |
| Open callbacks             | `onOpen` + `onClose`            | This stays aligned with the workspace naming rules and gives controlled consumers explicit lifecycle hooks without exposing a raw app-specific state layer. |
| Portal                     | yes                             | Floating content must escape local stacking and overflow contexts.                                                                                          |
| Modal behavior             | no new shared prop in this pass | The foundation contract remains focused on anchored non-modal behavior unless a later explicit amendment requires more.                                     |
| Box-only DOM policy        | full on authored wrappers       | The shared content shell and all story layout markup use `Box`; Radix owns only the primitive DOM it must render internally.                                |

---

## Props Interface

### Root

| Prop          | Type              | Default     | Required | Description                            |
| ------------- | ----------------- | ----------- | -------- | -------------------------------------- |
| `open`        | `boolean`         | `undefined` | No       | Controlled open state.                 |
| `defaultOpen` | `boolean`         | `false`     | No       | Initial open state when uncontrolled.  |
| `onOpen`      | `() => void`      | `undefined` | No       | Called when the popover opens.         |
| `onClose`     | `() => void`      | `undefined` | No       | Called when the popover closes.        |
| `children`    | `React.ReactNode` | -           | Yes      | Composed trigger, anchor, and content. |

### Content

| Prop               | Type                                                                        | Default     | Required | Description                                                             |
| ------------------ | --------------------------------------------------------------------------- | ----------- | -------- | ----------------------------------------------------------------------- |
| `align`            | `'start' \| 'center' \| 'end'`                                              | `'center'`  | No       | Preferred alignment against the trigger or anchor.                      |
| `side`             | `'top' \| 'right' \| 'bottom' \| 'left'`                                    | `'bottom'`  | No       | Preferred side for content placement.                                   |
| `sideOffset`       | `number`                                                                    | `8`         | No       | Offset from the anchor edge.                                            |
| `collisionPadding` | `number \| Partial<Record<'top' \| 'right' \| 'bottom' \| 'left', number>>` | `8`         | No       | Viewport collision padding passed through to Radix.                     |
| `className`        | `string`                                                                    | `undefined` | No       | Consumer override merged onto the shared floating shell through `cn()`. |
| `children`         | `React.ReactNode`                                                           | -           | Yes      | Content rendered inside the floating surface.                           |

### Supported Radix pass-throughs

`PopoverContentProps` also passes through the non-structural Radix `Content` props that matter for composition and accessibility, including:

- `onOpenAutoFocus`
- `onCloseAutoFocus`
- `onEscapeKeyDown`
- `onPointerDownOutside`
- `onFocusOutside`
- `onInteractOutside`
- `forceMount`
- `alignOffset`
- `avoidCollisions`
- `collisionBoundary`
- `sticky`
- `hideWhenDetached`

---

## Visual Contract

`Popover` does not expose public visual variants or sizes in this pass. The shared visual contract is one neutral floating surface that consumers can extend with `className` when a specific content width or inner spacing is needed.

| Treatment              | Description                                                              | When to use                                            |
| ---------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------ |
| Default floating shell | Rounded tokenized panel with border, shadow, and Radix side-aware motion | General contextual details or inline overlay content   |
| Narrow anchored shell  | Trigger- or anchor-adjacent content constrained by viewport width        | Dense filter or quick-action overlays on small screens |
| Form shell             | Same surface with consumer-owned layout and shared inputs inside         | Small inline forms or pickers                          |

---

## States

| State            | Visual Behavior                                                           | Accessibility                                                                      |
| ---------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Closed           | Content unmounted or hidden by Radix                                      | Trigger remains available in normal tab order                                      |
| Open             | Floating content animates in from the resolved side                       | Radix manages focus entry and escape handling                                      |
| Side collision   | Content repositions and updates `data-side` / `data-align` attributes     | Keyboard behavior remains intact while placement changes                           |
| Controlled       | Parent owns visibility while the shared root emits `onOpen` and `onClose` | Focus still returns to the trigger on close unless a consumer override prevents it |
| Disabled trigger | Upstream trigger remains non-interactive                                  | No popover is opened and no extra accessibility layer is added by the shared root  |

---

## Compound Sub-components

| Sub-component    | Purpose                               | Key props                                  |
| ---------------- | ------------------------------------- | ------------------------------------------ |
| `Popover`        | Root state container                  | `open`, `defaultOpen`, `onOpen`, `onClose` |
| `PopoverTrigger` | Toggle element                        | native Radix trigger props, `asChild`      |
| `PopoverAnchor`  | Optional explicit anchor target       | native Radix anchor props, `asChild`       |
| `PopoverContent` | Floating content shell                | `align`, `side`, `sideOffset`, `className` |
| `PopoverClose`   | Optional close trigger inside content | native Radix close props, `asChild`        |
| `PopoverPortal`  | Optional explicit portal export       | native Radix portal behavior               |

---

## Accessibility

### ARIA and behavior expectations

| Surface        | Requirement                           | Notes                                                                                                               |
| -------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Trigger        | Clear accessible name                 | Consumers must supply visible or accessible text on the trigger.                                                    |
| Content        | Meaningful inner structure            | Consumers should provide a heading or clear descriptive copy when the content contains more than a trivial message. |
| Keyboard close | `Escape` closes the content           | Radix provides this behavior by default.                                                                            |
| Focus return   | Focus returns to the trigger on close | Consumers may override Radix auto-focus events only when they have a stronger focus plan.                           |

### Keyboard map

| Key               | Behavior                                                              |
| ----------------- | --------------------------------------------------------------------- |
| `Enter` / `Space` | Activates the trigger when the trigger element supports it            |
| `Tab`             | Moves focus through focusable elements inside the popover             |
| `Shift+Tab`       | Moves focus backwards through the content and back toward the trigger |
| `Escape`          | Closes the popover                                                    |

### Focus management

- `Popover` relies on Radix to move focus into the content when appropriate.
- `PopoverClose` and outside interaction return focus to the trigger unless a consumer intercepts that behavior.
- Consumers should keep the content lightweight and readable so focus order stays obvious.

### Screen reader notes

- The trigger should communicate the intent of the overlay, not just the fact that it opens.
- The content should not be used as a substitute for a full dialog when the task requires explicit labeling, confirmation, or modal isolation.
- Consumer-provided form fields inside the popover should continue to use the shared `Form`, `Input`, and `Label` accessibility patterns.

---

## Box-only DOM Policy

- All authored shared JSX in `Popover.tsx` and `Popover.stories.tsx` uses `Box` for the DOM nodes we own directly.
- The floating surface itself is authored as `Box` through `PopoverContent`.
- Radix still owns the primitive portal and positioning DOM it must render internally; that library boundary is the only accepted non-Box DOM path here.
- Do not hand-write native JSX tags in the shared source or stories for this component.

---

## Usage Examples

### 1. Basic contextual details

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" size="sm">
      View details
    </Button>
  </PopoverTrigger>
  <PopoverContent>
    <Box className="grid gap-2">
      <Box as="h3" className="text-sm font-semibold">
        Policy summary
      </Box>
      <Box as="p" className="text-sm text-muted-foreground">
        Renewal details and reminder copy.
      </Box>
    </Box>
  </PopoverContent>
</Popover>
```

### 2. Compact form shell

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" size="sm">
      Quick note
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <Box className="grid gap-3">
      <Input label="Subject" placeholder="Add a short subject" />
      <Input label="Owner" placeholder="Assign a reviewer" />
      <Box className="flex justify-end gap-2">
        <PopoverClose asChild>
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
        </PopoverClose>
        <PopoverClose asChild>
          <Button size="sm">Save</Button>
        </PopoverClose>
      </Box>
    </Box>
  </PopoverContent>
</Popover>
```

### 3. Controlled state

```tsx
const [open, setOpen] = React.useState(false);

<Popover open={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)}>
  <PopoverTrigger asChild>
    <Button variant="outline" size="sm">
      Open filters
    </Button>
  </PopoverTrigger>
  <PopoverContent align="start" className="w-72">
    ...
  </PopoverContent>
</Popover>;
```

### 4. Custom anchor

```tsx
<Popover>
  <PopoverAnchor asChild>
    <Box className="rounded-full border border-dashed border-border px-3 py-1 text-xs">
      Anchored tag
    </Box>
  </PopoverAnchor>
  <PopoverTrigger asChild>
    <Button variant="outline" size="sm">
      Open anchor demo
    </Button>
  </PopoverTrigger>
  <PopoverContent side="right">...</PopoverContent>
</Popover>
```

---

## Do / Don't

| Do                                                                                                         | Don't                                                                                            |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Use `Popover` for anchored, non-modal contextual content.                                                  | Use it as a substitute for modal confirmations or multi-step workflows.                          |
| Compose shared inputs or lightweight structural content inside `PopoverContent`.                           | Move domain filter state, routing logic, or data fetching into the shared popover module.        |
| Use `PopoverTrigger asChild` when the trigger should be a shared `Button` or other consumer-owned element. | Wrap an interactive element inside another interactive element just to get popover styling.      |
| Use `PopoverAnchor` when placement should follow a surface other than the trigger.                         | Add extra positioning booleans instead of using the anchor and Radix placement props.            |
| Keep action lists on `DropdownMenu` and brief hover help on `Tooltip`.                                     | Collapse menus, tooltips, and date pickers into one overly generic overlay component.            |
| Rely on token classes and `className` overrides for width or spacing changes.                              | Add app-specific style props such as custom background, arrow color, or route-tuned width flags. |

---

## Storybook Stories Required

**Story file title:** `'Overlays/Popover'`

- [x] `Basic`
- [x] `Form`
- [x] `Controlled`
- [x] `DisabledTrigger`
- [x] `Anchored`

## Changelog

| Date       | Change               |
| ---------- | -------------------- |
| 2026-03-12 | Initial Popover spec |
