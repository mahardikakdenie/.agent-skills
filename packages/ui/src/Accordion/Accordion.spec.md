# Accordion Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Layout` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Complex` |
| Based on | `@radix-ui/react-accordion` |

---

## Overview

`Accordion` is the shared disclosure pattern for stacked sections that reveal supporting content without introducing routing, service logic, or page-level workflow behavior into `@repo/ui`. It wraps Radix Accordion for WAI-ARIA semantics, roving focus, and single or multiple expansion while keeping the authored shared structure on `Box`.

The public API stays compound through `Accordion`, `AccordionItem`, `AccordionHeader`, `AccordionTrigger`, and `AccordionContent`. This is the explicit `$vercel-composition-patterns` decision for the component: one known per-app baseline used an `items[]` array, but the content shape varies too widely across apps to lock shared usage to a single record schema. Parents can still map arrays into children composition, while the shared component remains flexible and app-agnostic.

**When to use:**

- Use `Accordion` for FAQ rows, grouped policy details, settings disclosures, or stacked secondary details that should stay inline.
- Use `type="single"` when only one section should stay open at a time.
- Use `type="multiple"` when several sections can remain expanded together.
- Map local `items[]` data into shared compound children rather than widening the shared API with a fixed content schema.

**When NOT to use:**

- Do not use `Accordion` for navigation tabs, route-driven sections, or drill-down menus.
- Do not move service hooks, route state, or domain formatting logic into the shared component.
- Do not use it when the content must float above the page; use `Dialog`, `Drawer`, or `Popover`.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive | `@radix-ui/react-accordion` | The roadmap explicitly targets Radix Accordion and the primitive already solves keyboard and ARIA behavior correctly. |
| Public API shape | compound exports | Keeps content flexible and avoids an over-specific `items[]` contract that would not survive cross-app variation. |
| Controlled vs uncontrolled | both | Existing baselines use both default-open and externally managed active-section flows. |
| Visual variants | none in this pass | Cross-app demand does not justify shared visual mode props yet; structural styling plus `className` is sufficient. |
| State model | single and multiple modes | Matches both the roadmap contract and the claim-portal baseline. |
| Motion strategy | CSS grid-row transition | Avoids extra animation dependencies while keeping open and close motion legible. |
| Box-only DOM policy | explicit | Root, item, heading, trigger, content wrapper, and story markup all render through `Box` or Radix `asChild` composition. |

---

## Props Interface

### Root

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `type` | `'single' \| 'multiple'` | `'single'` | No | Controls whether one or several sections may stay open. |
| `collapsible` | `boolean` | `false` | No | Allows the open section to fully collapse when `type="single"`. |
| `value` | `string \| string[]` | `undefined` | No | Controlled open item value(s). |
| `defaultValue` | `string \| string[]` | `undefined` | No | Uncontrolled initial open item value(s). |
| `onValueChange` | `(value: string) => void` or `(value: string[]) => void` | `undefined` | No | Called when the open item set changes. In single collapsible mode, a fully closed state comes back as `''` from Radix. |
| `className` | `string` | `undefined` | No | Consumer override merged onto the shared root wrapper. |
| `children` | `React.ReactNode` | - | Yes | Composed `AccordionItem` children. |

### Compound exports

| Component | Props type | Purpose |
| --- | --- | --- |
| `AccordionItem` | `AccordionPrimitive.Item` props + `className` | Shared item shell; requires a unique `value`. |
| `AccordionHeader` | `AccordionPrimitive.Header` props + `className` | Semantic heading wrapper for the trigger. |
| `AccordionTrigger` | `AccordionPrimitive.Trigger` props + `className` | Shared disclosure button with built-in chevron indicator. |
| `AccordionContent` | `AccordionPrimitive.Content` props + `className` | Animated inline content wrapper for expanded panel content. |

---

## Visual Contract

`Accordion` does not expose public `variant` or `size` props in this pass. The normalized visual baseline is a bordered stacked disclosure list with shared spacing and focus behavior.

| Shared treatment | Description | When to use |
| --- | --- | --- |
| Default item shell | Rounded bordered section with neutral card surface | General inline disclosures and settings detail blocks |
| Open item | Subtle border emphasis and content reveal | Active or expanded section |
| Disabled item | Muted opacity and blocked interaction | Temporarily unavailable sections |
| Consumer tuning | `className` on root, item, trigger, or content | Narrow parity deltas that do not justify a new shared prop |

---

## States

| State | Visual behavior | Accessibility |
| --- | --- | --- |
| Collapsed | Trigger visible, content hidden | Trigger exposes `aria-expanded="false"` |
| Expanded | Trigger remains visible and content reveals inline | Trigger exposes `aria-expanded="true"` and links to content via Radix ids |
| Single mode | Opening one item closes the previously open item | Keyboard focus stays on the active trigger |
| Multiple mode | Several items may remain open together | Each trigger manages its own expanded state |
| Disabled | Trigger dims and does not respond to input | Disabled item is removed from interaction |
| Focus | Trigger shows visible focus ring | Keyboard users can track focus clearly |

---

## Accessibility

### ARIA roles & attributes

| Element | Role / Attribute | Value |
| --- | --- | --- |
| Header | semantic heading | Provided through `AccordionHeader` with `Box as="h3"` |
| Trigger | native button | Managed by Radix with `aria-expanded` and `aria-controls` |
| Content | region / content wrapper | Managed by Radix and linked back to the trigger |
| Disabled item | `data-disabled` / native disabled behavior | Prevents activation and focus movement onto the trigger |

### Keyboard map

| Key | Behavior |
| --- | --- |
| `Tab` / `Shift+Tab` | Moves into and out of the accordion in document order |
| `Enter` / `Space` | Toggles the focused section |
| `ArrowDown` | Moves focus to the next trigger |
| `ArrowUp` | Moves focus to the previous trigger |
| `Home` | Moves focus to the first trigger |
| `End` | Moves focus to the last trigger |

### Focus management

- Focus remains on the trigger after open or close.
- Arrow-key navigation moves between triggers without forcing focus into content.
- Consumers should keep focusable elements inside `AccordionContent` in a logical order because the shared component does not add focus traps.

### Screen reader notes

- Trigger text should stay concise and descriptive because it becomes the accessible name for the disclosure control.
- If an item is disabled, keep the reason visible in adjacent copy instead of relying on hidden-only explanation.
- When local data is currently shaped as `items[]`, map each item to a composed `AccordionItem` so the visible heading and body content remain explicit in JSX.

---

## Box-only DOM policy

- All authored shared JSX in `Accordion.tsx` and `Accordion.stories.tsx` renders through `Box`.
- The root wrapper, item shell, heading wrapper, trigger button, animated content wrapper, and content body all use `Box` directly or through Radix `asChild`.
- No native JSX tags such as `div`, `h3`, `button`, `section`, or `p` are authored directly in the shared component or its stories.

---

## Usage Examples

### 1. Basic single accordion

```tsx
<Accordion type="single" collapsible defaultValue="coverage">
  <AccordionItem value="coverage">
    <AccordionHeader>
      <AccordionTrigger>Coverage details</AccordionTrigger>
    </AccordionHeader>
    <AccordionContent>
      <Box as="p" className="text-sm text-muted-foreground">
        Coverage opens after payment confirmation.
      </Box>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### 2. Multiple mode

```tsx
<Accordion type="multiple" defaultValue={['payment', 'documents']}>
  <AccordionItem value="payment">
    <AccordionHeader>
      <AccordionTrigger>Payment schedule</AccordionTrigger>
    </AccordionHeader>
    <AccordionContent>...</AccordionContent>
  </AccordionItem>
  <AccordionItem value="documents">
    <AccordionHeader>
      <AccordionTrigger>Required documents</AccordionTrigger>
    </AccordionHeader>
    <AccordionContent>...</AccordionContent>
  </AccordionItem>
</Accordion>
```

### 3. Controlled usage

```tsx
const [value, setValue] = React.useState('eligibility');

<Accordion type="single" collapsible value={value} onValueChange={setValue}>
  <AccordionItem value="eligibility">
    <AccordionHeader>
      <AccordionTrigger>Eligibility rules</AccordionTrigger>
    </AccordionHeader>
    <AccordionContent>...</AccordionContent>
  </AccordionItem>
</Accordion>;
```

### 4. Adapting a local `items[]` baseline

```tsx
<Accordion type="single" collapsible>
  {items.map((item) => (
    <AccordionItem key={item.value} value={item.value} disabled={item.disabled}>
      <AccordionHeader>
        <AccordionTrigger>{item.label}</AccordionTrigger>
      </AccordionHeader>
      <AccordionContent>{item.content}</AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Use compound children so each item can own its own content structure. | Add a fixed `items[]` API to the shared component just because one app currently uses that shape. |
| Use `type="single"` with `collapsible` for FAQ and summary sections. | Rebuild close/open state in app code for the shared baseline. |
| Map local arrays into `AccordionItem` children when migrating. | Move domain formatting or service logic into the shared trigger or content. |
| Keep trigger labels short and meaningful. | Put long paragraphs directly into the trigger label. |
| Use `className` for narrow spacing parity deltas. | Add new boolean props for every local border, spacing, or icon variation. |
| Keep authored shared markup on `Box`. | Hand-write native DOM tags in the shared component or stories. |

---

## Storybook Stories Required

**Story file title:** `Layout/Accordion`

- [x] `Default`
- [x] `Multiple Mode`
- [x] `Disabled Item`
- [x] `Controlled Mode`

Roadmap alignment:

- `Accordion.Basic` -> `Default`
- `Accordion.Multiple` -> `Multiple Mode`
- `Accordion.Disabled` -> `Disabled Item`

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-12 | Initial Accordion spec |
