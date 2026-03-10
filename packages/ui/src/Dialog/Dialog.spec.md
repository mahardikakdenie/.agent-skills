# Dialog Spec

## Metadata

| Field           | Value                |
| --------------- | -------------------- |
| Storybook Group | `Overlays`           |
| Component Tier  | `Tier 2 (Composite)` |
| Structure Tier  | `Complex`            |
| Based on        | `@radix-ui/react-dialog` |

---

## Overview

`Dialog` is the shared centered modal shell for blocking confirmations, focused form tasks, and short-lived detail flows that should temporarily inert the surrounding page. It standardizes open/close behavior, overlay styling, focus trapping, scroll containment, and accessible title/description handling while keeping business logic, routing, async orchestration, and domain-specific content in the consuming app.

The shared API stays compound. `Dialog` owns the modal state boundary, while `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`, and `DialogOverlay` give consuming apps explicit composition points without turning the root or content contract into a boolean-prop bundle. This follows the compound-component guidance from `$vercel-composition-patterns` and avoids introducing one-off flags for destructive mode, async mode, or layout variants that should remain composition concerns.

**When to use:**

- Use `Dialog` for centered modal flows that must trap focus and block background interaction.
- Use `Dialog` when the shell behavior should be standardized but the inner content remains app-owned.

**When NOT to use:**

- Do not use `Dialog` for mobile-first bottom sheets or edge-attached panels; use `Drawer`.
- Do not put domain validation, service hooks, or route-specific behavior into the shared dialog shell.

---

## Design Decisions

| Decision                   | Choice                   | Rationale                                                                                                          |
| -------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Primitive                  | `@radix-ui/react-dialog` | Radix provides modal semantics, focus trap, Escape handling, inert background behavior, and accessible labelling. |
| Composition model          | Compound exports         | Shared consumers need trigger/content/close/header/footer/title/description composition without prop sprawl.      |
| Controlled vs uncontrolled | both                     | Apps need programmatic control for async flows while retaining trigger-driven default usage.                       |
| Portal                     | yes                      | Dialogs must escape stacking contexts and lock interaction behind the overlay.                                     |
| Size model                 | `size` on content        | Cross-app width differences map cleanly to `sm | md | lg | xl | full` without introducing layout booleans.         |
| A11y fallback              | automatic hidden copy    | Dialogs should always expose a title and description to assistive tech, even when the caller omits visible copy.  |
| Box-only DOM rule          | explicit                 | Every authored wrapper and semantic element we control should render through `Box` using `as` or `asChild`.       |

---

## Box-Only DOM Policy

- Authored wrapper markup in `Dialog` stories and implementation must use `Box` for every DOM node we render ourselves.
- Semantic elements must be expressed through `Box as="..."`, including panel shells, headers, footers, action rows, headings, paragraphs, forms, and lists.
- Radix primitives that own accessibility behavior should render through `asChild` into `Box` wherever the primitive supports it, including `Overlay`, `Content`, `Title`, and `Description`.
- No native JSX tags such as `div`, `section`, `footer`, `h2`, `p`, `button`, `form`, `ul`, or `li` may appear in shared authored JSX for this component or its stories.

---

## Props Interface

### Root

| Prop          | Type              | Default     | Required | Description                                                                               |
| ------------- | ----------------- | ----------- | -------- | ----------------------------------------------------------------------------------------- |
| `open`        | `boolean`         | `undefined` | No       | Controlled open state.                                                                    |
| `defaultOpen` | `boolean`         | `undefined` | No       | Initial open state for uncontrolled usage.                                                |
| `onClose`     | `() => void`      | `undefined` | No       | Called when the dialog requests closing through overlay click, Escape, or a close action. |
| `children`    | `React.ReactNode` | `undefined` | Yes      | Trigger, content, and any dialog sub-components.                                          |

### Content

| Prop          | Type                                     | Default     | Required | Description                                                                                          |
| ------------- | ---------------------------------------- | ----------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `title`       | `string`                                 | `undefined` | No       | Convenience title rendered inside the shared header when a custom title is not supplied.             |
| `description` | `string`                                 | `undefined` | No       | Supporting copy rendered below the title in the shared header.                                       |
| `actions`     | `React.ReactNode`                        | `undefined` | No       | Optional action row rendered below the header copy and above the body content.                       |
| `footer`      | `React.ReactNode`                        | `undefined` | No       | Optional footer slot rendered after the body content.                                                |
| `size`        | `'sm' | 'md' | 'lg' | 'xl' | 'full'`   | `'md'`      | No       | Width preset for the shared dialog panel.                                                            |
| `className`   | `string`                                 | `undefined` | No       | Consumer override merged onto the dialog panel root.                                                 |
| `children`    | `React.ReactNode`                        | `undefined` | Yes      | Main dialog body content.                                                                            |
| `...props`    | `DialogPrimitive.Content` props          | -           | No       | Supports modal content hooks such as `onEscapeKeyDown`, `onPointerDownOutside`, and `aria-*` props. |

### Compound exports

| Export              | Purpose                                                     |
| ------------------- | ----------------------------------------------------------- |
| `DialogTrigger`     | Opens the dialog; supports `asChild` via Radix.             |
| `DialogOverlay`     | Shared overlay surface.                                     |
| `DialogContent`     | Shared centered panel shell.                                |
| `DialogHeader`      | Shared header layout wrapper.                               |
| `DialogFooter`      | Shared footer layout wrapper.                               |
| `DialogTitle`       | Accessible dialog title.                                    |
| `DialogDescription` | Accessible dialog description.                              |
| `DialogClose`       | Close primitive; supports `asChild`.                        |

---

## Variants

### Sizes

| Size   | Behavior                                                             | Use case                                        |
| ------ | -------------------------------------------------------------------- | ----------------------------------------------- |
| `sm`   | Narrow confirmation width                                            | Short confirmations and compact one-step forms  |
| `md`   | Default modal width                                                  | General-purpose forms and detail dialogs        |
| `lg`   | Wider panel with more body space                                     | Longer copy and richer body layouts             |
| `xl`   | Large centered panel                                                 | Dense settings or comparison content            |
| `full` | Near-viewport shell with centered positioning and internal scrolling | High-density workflows that still need modal UX |

### Layout slots

| Slot                    | Behavior                                        |
| ----------------------- | ----------------------------------------------- |
| `title` + `description` | Convenience header path for common dialog shells |
| `actions`               | Optional row between header copy and body        |
| `footer`                | Trailing region for CTA sets or dismiss actions  |

---

## States

| State           | Visual Behavior                                                                      | Accessibility                                              |
| --------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| Closed          | Overlay and panel hidden                                                             | Trigger remains the focus return target                    |
| Open            | Overlay visible, centered panel rendered, focus trapped in the dialog                | Screen readers announce title and description              |
| Scrollable      | Header and footer remain fixed relative to the shell while the body region scrolls   | Reading order stays title -> description -> body -> footer |
| Destructive     | Destructive emphasis comes from composed content/actions, not a dialog-level variant | Modal semantics remain identical                           |
| Async close     | Caller controls `open` and may defer close until async completion                    | Focus stays in the dialog until the caller closes it       |
| Non-dismissible | Caller may prevent outside interaction and Escape dismissal through forwarded props  | Explicit close affordance remains required                 |

---

## Accessibility

### ARIA Roles & Attributes

| Element      | Role / Attribute          | Value                                                                                          |
| ------------ | ------------------------- | ---------------------------------------------------------------------------------------------- |
| Root content | `role`                    | Dialog semantics via Radix                                                                     |
| Title        | `aria-labelledby` target  | Must exist through `DialogTitle`, the `title` convenience prop, or an injected hidden fallback |
| Description  | `aria-describedby` target | Must exist through `DialogDescription`, the `description` convenience prop, or a hidden fallback |
| Close action | Accessible name           | Consumer must provide visible text or `aria-label` when using icon-only close affordances      |

### Keyboard Map

| Key               | Behavior                                                 |
| ----------------- | -------------------------------------------------------- |
| `Tab`             | Moves focus through focusable elements inside the dialog |
| `Shift+Tab`       | Moves focus backward inside the dialog                   |
| `Escape`          | Requests dialog close when dismissal is allowed          |
| `Enter` / `Space` | Activates focused trigger, close controls, and buttons   |

### Focus Management

- Opening the dialog should move focus into the content per Radix modal behavior.
- Closing the dialog should return focus to the trigger when one exists.
- Interactive elements inside the dialog must keep a visible `focus-visible:ring-2 focus-visible:ring-ring` treatment.

### Screen Reader Notes

- Every interactive dialog needs a meaningful title and description in the accessibility tree.
- The shared shell should prevent unnamed dialogs by injecting hidden fallback copy when consumers omit both title and description.

---

## Usage Examples

### 1. Basic dialog

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent title="Edit profile" description="Update the visible profile details for this account.">
    <Box className="grid gap-4">
      <Box as="p" className="text-sm leading-6 text-muted-foreground">
        App-local content remains inside the shared dialog shell.
      </Box>
    </Box>
  </DialogContent>
</Dialog>
```

### 2. Destructive confirmation

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="destructive">Delete Record</Button>
  </DialogTrigger>
  <DialogContent
    size="sm"
    title="Delete Record"
    description="This action cannot be undone."
    footer={
      <>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button variant="destructive">Delete</Button>
      </>
    }
  >
    <Box as="p" className="text-sm leading-6 text-muted-foreground">
      Review the impact before confirming removal.
    </Box>
  </DialogContent>
</Dialog>
```

### 3. Async close with controlled state

```tsx
function ExampleDialog() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <DialogContent
        title="Save Changes"
        description="Close only after the async action completes."
        footer={
          <>
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              loading={loading}
              onClick={async () => {
                setLoading(true);
                await saveChanges();
                setLoading(false);
                setOpen(false);
              }}
            >
              Save Changes
            </Button>
          </>
        }
      >
        <Box as="p" className="text-sm leading-6 text-muted-foreground">
          The consumer owns the async lifecycle and close timing.
        </Box>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Do / Don't

| Do                                                                                                  | Don't                                                                                    |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Use compound exports to compose trigger, content, title, description, and close actions explicitly | Add dialog-level booleans such as `destructive`, `async`, `scrollable`, or `withFooter` |
| Keep destructive and async behaviors in composed content/actions                                    | Move business logic or domain workflows into the shared shell                            |
| Use `size` and `className` for layout differences                                                   | Reintroduce width/height override prop names from app-local modal variants               |
| Keep authored wrappers on `Box` and use `asChild` on Radix primitives where available              | Hand-write native `div`, `section`, `footer`, `h2`, or `p` tags in shared JSX           |
| Provide a visible or hidden accessible title and description for interactive dialogs                | Ship unnamed dialogs or rely on placeholder body copy as the only accessible context     |

---

## Storybook Stories Required

**Story file title:** `'Overlays/Dialog'`

- [x] `Basic`
- [x] `Scrollable`
- [x] `Sizes`
- [x] `Destructive`
- [x] `AsyncClose`
- [x] `A11y`
- [x] `ResponsiveLayout`

---

## Changelog

| Date       | Change              |
| ---------- | ------------------- |
| 2026-03-10 | Initial Dialog spec |

