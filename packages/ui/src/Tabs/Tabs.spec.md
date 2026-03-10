# Tabs Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Navigation` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Standard` |
| Based on | `@radix-ui/react-tabs` |

---

## Overview

`Tabs` is the shared navigation primitive for switching between related views, detail sections, and inline settings panels without introducing route coupling or business logic into `@repo/ui`. It wraps Radix Tabs for accessible `tablist`, `tab`, and `tabpanel` semantics while keeping all authored shared DOM on `Box`.

The shared contract is intentionally narrow. The root component only standardizes controlled and uncontrolled value handling plus orientation, while the public API stays compound through `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent`. This follows the `vercel-composition-patterns` guidance for compound structure and avoids expanding the root with boolean visual modes for every app-specific tab style.

**When to use:**

- Use `Tabs` when multiple sibling panels share one compact navigation surface.
- Use the shared compound exports when panel content is already owned by the consuming feature.
- Use `orientation="vertical"` for settings and detail pages that need a left-hand navigation rail.

**When NOT to use:**

- Do not put route synchronization, URL query management, or business workflow logic inside the shared component; keep that in the consumer.
- Do not use `Tabs` as a segmented filter, stepper, or mutually exclusive form control when `RadioGroup`, `Pagination`, or an app-local pattern is the correct semantic fit.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive | `@radix-ui/react-tabs` + `Box` | Radix provides the correct tab semantics and keyboard behavior while `Box` satisfies the authored DOM rule. |
| Public API | compound exports | `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent` scale better than root-level boolean props for every layout permutation. |
| CVA strategy | slot-based internal styles | The root, list, triggers, and content shell need separate token treatment without adding public visual variants too early. |
| Controlled vs uncontrolled | both | Cross-app baselines mix app-driven active values and simple default tabs, and Radix supports both cleanly. |
| Activation mode | automatic only | The normalized API does not expose extra activation toggles; arrow-key focus should switch panels immediately for the shared baseline. |
| Scroll behavior | built into list shell | Long horizontal trigger sets need overflow support without a new `scrollable` prop. |
| Portal | no | Tabs stay in normal document flow. |
| Box-only DOM rule | explicit | Authored root, list, trigger, panel, and story wrappers must render through `Box` or composed shared primitives. |

---

## Props Interface

### Root component

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | `undefined` | No | Controlled active tab value. |
| `defaultValue` | `string` | `undefined` | No | Uncontrolled initial tab value. |
| `onValueChange` | `(value: string) => void` | `undefined` | No | Called when the active tab changes. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | No | Changes keyboard navigation and list/panel layout direction. |
| `className` | `string` | `undefined` | No | Consumer override merged last through `cn()`. |
| `children` | `React.ReactNode` | `undefined` | No | `TabsList`, `TabsTrigger`, and `TabsContent` composition. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | No | Standard DOM props such as `id`, `data-*`, `aria-*`, and `dir`. |

### Sub-components

| Component | Props type | Purpose |
| --- | --- | --- |
| `TabsList` | `TabsPrimitive.List` props | Shared tablist shell; consumers should provide `aria-label` or `aria-labelledby` when the nearby heading is not sufficient. |
| `TabsTrigger` | `TabsPrimitive.Trigger` props | Interactive tab button; requires `value` and supports `disabled`. |
| `TabsContent` | `TabsPrimitive.Content` props | Tab panel wrapper; requires a matching `value`. |

---

## Variants

`Tabs` deliberately ships without public `variant` or `size` props. Cross-app baselines showed both underline and pill-style tabs, but the normalized contract does not justify encoding that drift as shared API yet.

| Shared treatment | Description | When to use |
| --- | --- | --- |
| Default list shell | Tokenized list container with subtle surface separation | General navigation tabs and settings panels |
| Active trigger | Raised active trigger surface with foreground emphasis | Shared baseline selected state |
| Vertical orientation | Stacked list with full-width triggers next to content | Side-rail settings and detail pages |
| Scrollable horizontal list | Overflow-enabled trigger row without wrapping | Longer tab labels or many sibling tabs |
| App-local visual tuning | `className` on list/trigger/content | Narrow parity deltas that do not justify a new shared prop |

---

## States

| State | Visual behavior | Accessibility |
| --- | --- | --- |
| Inactive | Muted foreground with hover emphasis | Exposes `role="tab"` and `aria-selected="false"` through Radix |
| Active | Foreground emphasis with selected surface treatment | Exposes `aria-selected="true"` and links to the active panel |
| Focus | Visible focus ring on the trigger | Keyboard focus remains visible on every trigger |
| Disabled | Muted opacity and blocked pointer interaction | Exposes disabled semantics through Radix |
| Vertical | List stacks and triggers stretch to full width | Arrow keys switch to vertical navigation behavior |
| Scrollable | Horizontal list overflows instead of wrapping | Maintains one tablist with normal keyboard behavior |

---

## Accessibility

### ARIA Roles & Attributes

| Element | Role / Attribute | Value |
| --- | --- | --- |
| Root | `data-orientation` | Provided by Radix for layout styling |
| List | `role` | Native Radix tablist semantics |
| Trigger | `role` | Native Radix tab semantics |
| Trigger | `aria-selected` | Managed by Radix based on the active value |
| Trigger | `aria-controls` | Managed by Radix to link trigger and panel |
| Content | `role` | Native Radix tabpanel semantics |
| Content | `data-state` | `active` or `inactive` for styling hooks |

### Keyboard Map

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus into or out of the tablist based on document order |
| `ArrowRight` / `ArrowLeft` | Moves focus and activates the next or previous trigger in horizontal mode |
| `ArrowDown` / `ArrowUp` | Moves focus and activates the next or previous trigger in vertical mode |
| `Home` | Moves focus to the first trigger and activates it |
| `End` | Moves focus to the last trigger and activates it |
| `Enter` / `Space` | Activates the focused trigger when needed |

### Focus Management

- Focus stays on the active trigger after keyboard navigation.
- Changing the selected tab does not move focus into the panel automatically.
- Consumers should keep focusable content inside panels in a logical reading order.

### Screen Reader Notes

- `TabsList` should receive `aria-label` or `aria-labelledby` when the visible context is not explicit.
- Each trigger and panel pairing is announced through Radix-managed ids and roles.
- Disabled triggers remain in the semantics but cannot be activated.

---

## Box-only DOM Policy

- All authored DOM in `Tabs` implementation and stories must render through `Box`.
- The root wrapper, tablist shell, button-backed triggers, and tabpanel wrapper all render through `Box` or through Radix primitives using `asChild` with `Box`.
- No native JSX tags are authored directly in the component or story source.

---

## Usage Examples

### 1. Basic usage

```tsx
<Tabs defaultValue="overview">
  <TabsList aria-label="Policy sections">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="documents">Documents</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="documents">Documents content</TabsContent>
</Tabs>
```

### 2. Controlled usage

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList aria-label="Account sections">
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
  </TabsList>
  <TabsContent value="profile">Profile panel</TabsContent>
  <TabsContent value="security">Security panel</TabsContent>
</Tabs>
```

### 3. Vertical layout

```tsx
<Tabs defaultValue="general" orientation="vertical">
  <TabsList aria-label="Settings sections">
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>
  <TabsContent value="general">General settings</TabsContent>
  <TabsContent value="billing">Billing settings</TabsContent>
</Tabs>
```

### 4. Scrollable trigger list

```tsx
<Tabs defaultValue="summary">
  <TabsList aria-label="Report views">
    <TabsTrigger value="summary">Summary</TabsTrigger>
    <TabsTrigger value="transactions">Transactions</TabsTrigger>
    <TabsTrigger value="commissions">Commissions</TabsTrigger>
    <TabsTrigger value="payouts">Payouts</TabsTrigger>
    <TabsTrigger value="documents">Documents</TabsTrigger>
  </TabsList>
  {/* matching panels */}
</Tabs>
```

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Use the compound exports so panel composition stays explicit and flexible. | Add root-level boolean props such as `withUnderline`, `isPill`, or `stacked` without a documented contract change. |
| Provide an accessible label for `TabsList` when nearby context does not already name the tabset. | Leave the tablist unnamed in ambiguous contexts. |
| Keep route sync, analytics, and business workflow changes in the consumer. | Put URL state, service hooks, or domain logic inside the shared tab primitive. |
| Use `orientation="vertical"` when the navigation needs a side rail. | Fake vertical tabs with unrelated layout wrappers and lose the keyboard-orientation semantics. |
| Let long trigger sets scroll horizontally through the shared list shell. | Force long labels to wrap into multiple lines inside the trigger row. |
| Keep authored shared JSX Box-only. | Hand-write native `div`, `button`, or `section` tags in shared source or stories. |

---

## Storybook Stories Required

**Story file title:** `Navigation/Tabs`

- [x] `Default`
- [x] `DisabledState`
- [x] `VerticalOrientation`
- [x] `Scrollable`
- [x] `Interactive`
- [x] `ControlledMode`
- [x] `ResponsiveLayout`

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-10 | Initial Tabs spec |
