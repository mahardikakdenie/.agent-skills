# Tooltip Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Overlays` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Standard` |
| Based on | `@radix-ui/react-tooltip` |

---

## Overview

`Tooltip` is the shared assistive overlay for brief hover or focus guidance in `@repo/ui`. It wraps Radix Tooltip for timing, keyboard behavior, and viewport-aware positioning while keeping the authored shared surface on `Box`.

The shared contract intentionally stays narrow: standalone `Tooltip` usage with an internal provider fallback, grouped timing through `TooltipProvider`, optional controlled open state on `Tooltip`, consumer-owned triggers via `TooltipTrigger asChild`, and a tokenized `TooltipContent` surface with optional `TooltipArrow`. Rich inline forms, action menus, and longer contextual panels stay on `Popover` or app-local shells.

**When to use:**

- Use `Tooltip` for short helper text that clarifies an icon, action, or compact status surface.
- Use `Tooltip` directly for standalone helper copy; it installs a local provider when no shared provider is present.
- Use `TooltipProvider` when multiple related tooltips should share the same open delay window.
- Use `TooltipTrigger asChild` to attach the tooltip to a shared `Button` or other consumer-owned trigger element.

**When NOT to use:**

- Do not use `Tooltip` for critical information or flows that must remain visible; render the content inline instead.
- Do not use it for forms, menus, or actionable panels; use `Popover` or `DropdownMenu`.
- Do not move app-specific color props, route state, or service logic into the shared tooltip API.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive | `@radix-ui/react-tooltip` | The roadmap explicitly targets Radix Tooltip and the per-app baselines already center on that primitive shape. |
| Provider abstraction | local fallback plus optional shared provider | The installed Radix Tooltip version requires provider context, so the shared `Tooltip` installs a local provider automatically while `TooltipProvider` remains the opt-in shared timing boundary. |
| Public API shape | compound exports | `$vercel-composition-patterns` review favors composition here because grouped timing, custom triggers, and optional arrows fit compound parts better than a single overloaded wrapper prop surface. |
| Controlled vs uncontrolled | both | Some app baselines use simple uncontrolled hover help, while future shared consumers may need externally driven open state. |
| Timing normalization | `delayDuration` / provider defaults | This maps the mixed legacy `delay` and `delayDuration` patterns onto the Radix-native contract. |
| Hoverable content | default `disableHoverableContent=true` | The shared tooltip should remain assistive and non-sticky by default instead of behaving like a richer floating panel. |
| Box-only DOM policy | explicit on authored wrappers | `TooltipContent` and all stories render their owned DOM through `Box`; Radix owns only the primitive DOM it must render internally. |

---

## Props Interface

### Provider

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `delayDuration` | `number` | `200` | No | Shared open delay for all nested tooltips. |
| `skipDelayDuration` | `number` | `300` | No | Delay skip window between nearby tooltip interactions. |
| `disableHoverableContent` | `boolean` | `true` | No | Prevents the tooltip from staying open when pointer focus moves onto the content. |
| `children` | `React.ReactNode` | - | Yes | Wrapped tooltip roots. |

### Root

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | No | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | No | Uncontrolled initial open state. |
| `onOpen` | `() => void` | `undefined` | No | Called when the tooltip opens. |
| `onClose` | `() => void` | `undefined` | No | Called when the tooltip closes. |
| `delayDuration` | `number` | `200` | No | Local open delay override for a single tooltip. |
| `disableHoverableContent` | `boolean` | `true` | No | Local hover-behavior override. |
| `disabled` | `boolean` | `false` | No | Prevents tooltip activation and disables the composed trigger when supported. |
| `children` | `React.ReactNode` | - | Yes | Composed trigger and content. |

### Content

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `side` | `'top' | 'right' | 'bottom' | 'left'` | `'top'` | No | Preferred content side relative to the trigger. |
| `align` | `'start' | 'center' | 'end'` | `'center'` | No | Preferred content alignment. |
| `sideOffset` | `number` | `8` | No | Distance between the trigger and tooltip content. |
| `className` | `string` | `undefined` | No | Consumer override merged onto the shared tooltip surface. |
| `children` | `React.ReactNode` | - | Yes | Tooltip copy and optional `TooltipArrow`. |

### Compound exports

| Sub-component | Purpose | Key props |
| --- | --- | --- |
| `TooltipProvider` | Shared delay and hover behavior for groups of nearby tooltips | `delayDuration`, `skipDelayDuration`, `disableHoverableContent` |
| `Tooltip` | Root state wrapper with automatic local provider fallback | `open`, `defaultOpen`, `onOpen`, `onClose`, `delayDuration`, `disabled` |
| `TooltipTrigger` | Trigger element, typically with `asChild` | native Radix trigger props |
| `TooltipContent` | Floating assistive copy surface | `side`, `align`, `sideOffset`, `className` |
| `TooltipArrow` | Optional tokenized arrow | native Radix arrow props |
| `TooltipPortal` | Optional explicit portal export | native Radix portal behavior |

---

## Visual Contract

`Tooltip` does not expose public size or variant props in this pass. The shared surface stays neutral and lightweight so apps do not use tooltips as branded micro-panels.

| Treatment | Description | When to use |
| --- | --- | --- |
| Default helper surface | Small rounded tokenized panel with border, shadow, and side-aware motion | General icon and action help text |
| Long-copy helper surface | Same tokenized panel with wrapping copy and constrained width | One to three short sentences of assistive guidance |
| Optional arrow | Tokenized arrow attached to the content | Use when visual direction helps anchor the helper to the trigger |

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Closed | Content is not rendered | Trigger remains in normal tab order |
| Delayed open | Content animates in after the configured delay | Trigger and content expose Radix tooltip semantics |
| Standalone root | A single tooltip renders without any explicit surrounding provider | Shared wrapper installs the required local provider automatically |
| Instant open | Content opens immediately within the skip-delay window | Grouped tooltips stay responsive without extra app state |
| Disabled | Trigger is non-interactive and no tooltip opens on hover or focus | Shared root forces the tooltip closed and prevents assistive content from appearing |
| Side collision | Content repositions and updates `data-side` | Tooltip remains readable inside the viewport |

---

## Accessibility

### ARIA & interaction expectations

| Element | Requirement | Notes |
| --- | --- | --- |
| Trigger | Accessible name required | Icon-only triggers must already provide `aria-label` or visible text. |
| Content | Non-interactive helper copy | Tooltip content should stay informational; do not place actionable controls inside it. |
| Keyboard close | `Escape` closes the tooltip | Provided by Radix. |
| Focus behavior | Focus stays on the trigger | The tooltip opens on focus and closes on blur or Escape. |

### Keyboard map

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus to the trigger; focused trigger opens the tooltip after the configured delay |
| `Shift+Tab` | Leaves the trigger and closes the tooltip |
| `Escape` | Closes the tooltip while keeping focus on the trigger |
| Pointer hover | Opens the tooltip after the configured delay |

### Screen reader notes

- Tooltip content supplements the trigger label; it should not replace a proper accessible name.
- Shared `Tooltip` usage is safe without an explicit `TooltipProvider`; add `TooltipProvider` only when coordinating delay behavior across related tooltips.
- If the copy is necessary to complete the task, render it inline or use a richer overlay instead of hiding it in a tooltip.

---

## Box-only DOM policy

- All authored shared JSX in `Tooltip.tsx` and `Tooltip.stories.tsx` uses `Box` for the DOM nodes we own directly.
- `TooltipContent` renders its floating surface through `Box` via Radix `asChild`.
- Story wrappers and supporting layout markup use `Box` or existing shared components such as `Button`.
- Radix still owns the primitive DOM it must render internally for positioning and tooltip semantics; that library boundary is the accepted exception.

---

## Usage Examples

### 1. Basic usage

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline" size="sm">
      Coverage Notes
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    Renewal details become available after review.
    <TooltipArrow />
  </TooltipContent>
</Tooltip>
```

### 2. Icon trigger

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="sm" aria-label="View help">
      <CircleHelp aria-hidden="true" className="h-4 w-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent side="right">
    View policy guidance
    <TooltipArrow />
  </TooltipContent>
</Tooltip>
```

### 3. Shared provider timing

```tsx
<TooltipProvider delayDuration={150} skipDelayDuration={400}>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline" size="sm">
        Payment
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      Payment windows close at midnight.
      <TooltipArrow />
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### 4. Controlled usage

```tsx
const [open, setOpen] = React.useState(false);

<Tooltip
  open={open}
  onOpen={() => setOpen(true)}
  onClose={() => setOpen(false)}
  delayDuration={0}
>
  <TooltipTrigger asChild>
    <Button variant="outline" size="sm">
      Eligibility
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    Coverage guidance for the selected plan.
    <TooltipArrow />
  </TooltipContent>
</Tooltip>;
```

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Use `Tooltip` for short helper text attached to an existing trigger. | Use it for critical instructions that users must always see. |
| Use `TooltipTrigger asChild` with shared buttons or consumer-owned triggers. | Wrap interactive elements in extra interactive wrappers. |
| Use `TooltipProvider` when nearby tooltips should share timing. | Wrap every single tooltip in a one-off provider unless grouped timing is actually needed. |
| Keep tooltip copy short, specific, and assistive. | Turn the tooltip into a mini popover with forms, menus, or CTAs. |
| Use tokenized `className` overrides only for width or spacing adjustments. | Add app-specific background, text, or arrow color props to the shared API. |
| Keep icon-only triggers accessible with `aria-label`. | Rely on the tooltip alone to label an icon button. |

---

## Storybook Stories Required

**Story file title:** `'Overlays/Tooltip'`

- [x] `Basic`
- [x] `Side Variants`
- [x] `Long Content`
- [x] `Disabled State`
- [x] `Provider Group`

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-12 | Initial Tooltip spec |
| 2026-03-12 | Clarified the automatic local-provider fallback for standalone Tooltip usage |
