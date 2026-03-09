# Drawer Spec

## Metadata

| Field           | Value      |
| --------------- | ---------- |
| Storybook Group | `Overlays` |
| Based on        | `vaul`     |

---

## Overview

`Drawer` is the shared slide-over and bottom-sheet shell for overlay flows that should stay distinct from centered modal semantics. It covers the cross-app patterns surfaced in the baselines: mobile bottom sheets, side panels, drag-dismiss interactions, optional header copy, and footer-driven action areas while keeping business content, async workflows, and domain-specific orchestration local to consuming apps.

The shared API is intentionally compound. `Drawer` owns open state wiring and directional behavior, while `DrawerTrigger`, `DrawerContent`, `DrawerHeader`, `DrawerFooter`, `DrawerTitle`, `DrawerDescription`, `DrawerClose`, and `DrawerHandle` give consuming apps flexible composition without widening the root contract into boolean-prop sprawl. This follows the compound-component guidance from `$vercel-composition-patterns` and keeps the drawer shell reusable across bottom-sheet and side-panel use cases.

**When to use:**

- Use `Drawer` for mobile-first sheets, secondary detail panels, and action trays that should slide from an edge.
- Use `Drawer` when the overlay body is app-specific but the shell semantics, focus handling, and dismiss behavior should be standardized.

**When NOT to use:**

- Do not use `Drawer` for centered modal confirmation flows; use `Dialog` when modal semantics are the better fit.
- Do not move domain validation, API submission state, or route-aware orchestration into the shared drawer shell.

---

## Design Decisions

| Decision                   | Choice           | Rationale                                                                                                                                |
| -------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Primitive                  | `vaul`           | Vaul provides drawer-specific drag, edge-based motion, and overlay semantics on top of dialog primitives.                                |
| Composition model          | Compound exports | The overlay shell needs trigger, content, header, footer, and close primitives without turning `DrawerContent` into a large prop bag.    |
| Controlled vs uncontrolled | both             | Consumers need programmatic control for app flows, but trigger-driven uncontrolled usage must stay available.                            |
| Portal                     | yes              | Drawers must escape stacking contexts and inert the background correctly.                                                                |
| Direction handling         | Root context     | `direction` is set once on `Drawer` and reused by `DrawerContent`, `DrawerHeader`, and `DrawerHandle` styling without duplicating props. |
| Box-only DOM rule          | explicit         | All authored wrappers in shared JSX render through `Box`; third-party primitives are only used where the library owns the DOM node.      |

---

## Box-Only DOM Policy

- Authored wrapper markup in `Drawer` stories and implementation must use `Box` for every DOM node we render ourselves.
- Semantic elements must be expressed through `Box as="..."`, including action rows, headings wrappers, paragraphs, and form examples.
- Vaul primitives that own their own DOM nodes (`DrawerPrimitive.Title`, `DrawerPrimitive.Description`, and other forced primitive nodes) are the only non-`Box` authored JSX allowed in this component because the library controls those elements directly.
- No native JSX tags such as `div`, `button`, `section`, `footer`, `p`, or `span` may appear in the shared authored JSX for this component or its stories.

---

## Props Interface

### Root

| Prop        | Type                                     | Default     | Required | Description                                                                                             |
| ----------- | ---------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `open`      | `boolean`                                | `undefined` | No       | Controlled open state.                                                                                  |
| `onClose`   | `() => void`                             | `undefined` | No       | Called when the drawer requests closing through overlay click, Escape, drag-dismiss, or a close action. |
| `direction` | `'bottom' \| 'right' \| 'left' \| 'top'` | `'bottom'`  | No       | Edge from which the drawer enters.                                                                      |
| `children`  | `React.ReactNode`                        | `undefined` | Yes      | Trigger, content, and any drawer sub-components.                                                        |

### Content

| Prop          | Type                            | Default     | Required | Description                                                                                |
| ------------- | ------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------ |
| `title`       | `string`                        | `undefined` | No       | Convenience title rendered inside the shared header when a custom header is not supplied.  |
| `description` | `string`                        | `undefined` | No       | Supporting copy rendered below the title in the shared header.                             |
| `actions`     | `React.ReactNode`               | `undefined` | No       | Optional action row rendered below the header copy and above the main body.                |
| `footer`      | `React.ReactNode`               | `undefined` | No       | Optional footer area rendered after the main body content.                                 |
| `className`   | `string`                        | `undefined` | No       | Consumer override merged onto the drawer panel root.                                       |
| `children`    | `React.ReactNode`               | `undefined` | Yes      | Main drawer body content.                                                                  |
| `...props`    | `DrawerPrimitive.Content` props | -           | No       | Supports `aria-*`, `onPointerDownOutside`, `onEscapeKeyDown`, and related primitive props. |

### Compound exports

| Export              | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `DrawerTrigger`     | Opens the drawer; supports `asChild` through Vaul. |
| `DrawerOverlay`     | Shared overlay surface.                            |
| `DrawerContent`     | Shared drawer panel shell.                         |
| `DrawerHandle`      | Drag handle for top and bottom drawers.            |
| `DrawerHeader`      | Shared header layout wrapper.                      |
| `DrawerFooter`      | Shared footer layout wrapper.                      |
| `DrawerTitle`       | Accessible drawer title.                           |
| `DrawerDescription` | Accessible drawer description.                     |
| `DrawerClose`       | Close primitive; supports `asChild`.               |

---

## Variants

### Directions

| Direction | Behavior                                                       | Use case                                   |
| --------- | -------------------------------------------------------------- | ------------------------------------------ |
| `bottom`  | Bottom sheet with rounded top corners and optional drag handle | Mobile actions, filters, compact forms     |
| `top`     | Top sheet with rounded bottom corners                          | Notification trays or downward task panels |
| `left`    | Side panel anchored left with full-height body                 | Navigation-like secondary workflows        |
| `right`   | Side panel anchored right with full-height body                | Detail drawers, inspectors, side forms     |

### Layout slots

| Slot                    | Behavior                                          |
| ----------------------- | ------------------------------------------------- |
| `title` + `description` | Convenience header path for common drawer shells  |
| `actions`               | Inline action row between header copy and body    |
| `footer`                | Trailing region for CTA sets or secondary actions |

---

## States

| State           | Visual Behavior                                                                           | Accessibility                                          |
| --------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Closed          | Panel and overlay hidden                                                                  | Trigger remains focus target                           |
| Open            | Overlay visible, panel attached to the configured edge                                    | Focus moves into the drawer per Vaul dialog behavior   |
| Dragging        | Bottom/top sheet handle remains visible and panel follows pointer                         | Overlay and dismiss behavior remain library-managed    |
| Scrollable      | Body content scrolls within the panel without collapsing layout                           | Title and description stay available to assistive tech |
| Dismissed       | Close animation plays and panel leaves view                                               | Focus returns to the trigger when one exists           |
| Non-dismissible | Panel stays open on outside interaction and Escape when caller configures primitive props | Caller owns explicit close affordance                  |

---

## Accessibility

### ARIA Roles & Attributes

| Element      | Role / Attribute          | Value                                                                                     |
| ------------ | ------------------------- | ----------------------------------------------------------------------------------------- |
| Root content | `role`                    | Dialog semantics via Vaul                                                                 |
| Title        | `aria-labelledby` target  | Must exist through `DrawerTitle` or the `title` prop path                                 |
| Description  | `aria-describedby` target | Must exist through `DrawerDescription` or the `description` prop path                     |
| Close action | Accessible name           | Consumer must provide visible text or `aria-label` when using icon-only close affordances |

### Keyboard Map

| Key               | Behavior                                                 |
| ----------------- | -------------------------------------------------------- |
| `Tab`             | Moves focus through focusable elements inside the drawer |
| `Shift+Tab`       | Moves focus backward inside the drawer                   |
| `Escape`          | Requests drawer close when dismissal is allowed          |
| `Enter` / `Space` | Activates focused buttons and trigger/close controls     |

### Focus Management

- Opening the drawer should move focus into the content per Vaul dialog behavior.
- Closing the drawer should return focus to the trigger when one exists.
- Title and description must remain in the accessibility tree even when consumers visually hide them.

### Screen Reader Notes

- Consumers should provide a meaningful title for any drawer that contains interactive content.
- The `title` and `description` convenience props exist to keep common drawers compliant without requiring custom subcomponent composition.

---

## Usage Examples

### 1. Basic bottom sheet

```tsx
<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">Open drawer</Button>
  </DrawerTrigger>
  <DrawerContent title="Filter results" description="Adjust the current list filters.">
    <Box className="grid gap-4">
      <Box as="p" className="text-sm text-muted-foreground">
        Current filters summary
      </Box>
      <Button>Apply filters</Button>
    </Box>
  </DrawerContent>
</Drawer>
```

### 2. Side drawer

```tsx
<Drawer direction="right">
  <DrawerTrigger asChild>
    <Button variant="outline">View details</Button>
  </DrawerTrigger>
  <DrawerContent
    title="Customer details"
    description="Secondary detail panel without replacing the current page."
  >
    <Box className="grid gap-3">
      <Box as="p" className="text-sm text-muted-foreground">
        App-local detail content lives here.
      </Box>
    </Box>
  </DrawerContent>
</Drawer>
```

### 3. Composed header and footer

```tsx
<Drawer>
  <DrawerTrigger asChild>
    <Button>Open form</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Complete profile</DrawerTitle>
      <DrawerDescription>Fill in the required profile fields before continuing.</DrawerDescription>
    </DrawerHeader>
    <Box as="form" className="grid gap-4">
      <Box as="label" className="grid gap-2">
        <Box as="span" className="text-sm font-medium text-foreground">
          Display name
        </Box>
        <Box as="input" className="h-10 rounded-xl border border-input px-3 text-sm" type="text" />
      </Box>
    </Box>
    <DrawerFooter>
      <Button>Save changes</Button>
      <DrawerClose asChild>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

---

## Do / Don't

| Do                                                                                                    | Don't                                                                         |
| ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Use `direction` to switch between bottom-sheet and side-panel layouts.                                | Add separate shared components for each edge variant.                         |
| Keep the shared API shell-focused and place domain content in `children`.                             | Put business validation, fetches, or route logic into the shared drawer.      |
| Provide `DrawerTitle`/`DrawerDescription` or the `title`/`description` props for accessible overlays. | Ship unnamed drawers with interactive content.                                |
| Use `DrawerClose asChild` when a consumer-owned button should dismiss the drawer.                     | Recreate close logic with app-local state wrappers for common cases.          |
| Keep authored layout wrappers on `Box`.                                                               | Hand-write native `div`, `footer`, `section`, or `button` tags in shared JSX. |

---

## Storybook Stories Required

**Story file title:** `'Overlays/Drawer'`

- [x] `Basic`
- [x] `Sides`
- [x] `Scrollable`
- [x] `FormAction`
- [x] `Controlled`
- [x] `NonDismissible`
- [x] `Interactive`
- [x] `ResponsiveLayout`

---

## Changelog

| Date       | Change              |
| ---------- | ------------------- |
| 2026-03-10 | Initial Drawer spec |
