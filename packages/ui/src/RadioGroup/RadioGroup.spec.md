# RadioGroup Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Inputs` |
| Component Tier | `Tier 1 (Primitive)` |
| Structure Tier | `Standard` |
| Based on | `@radix-ui/react-radio-group` |

---

## Overview

`RadioGroup` is the shared single-select choice primitive for short option sets where exactly one item can be active at a time. It pairs a Radix-managed radio-group root with a shared `RadioGroupItem` shell that can render a label and optional supporting description while keeping all authored DOM inside `@repo/ui` on `Box`.

The shared contract now covers the baseline form needs that showed up repeatedly across audited apps: controlled or uncontrolled selection, vertical or horizontal layout, size density, per-item descriptive copy, and a group-level validation state through `error`. Per-app presentation differences beyond those shared needs, such as card shells or media-rich radios, remain a `className` or app-local wrapper concern instead of becoming new boolean or variant props.

**When to use:**

- Use `RadioGroup` for mutually exclusive selections in forms, filters, and settings flows.
- Use `RadioGroupItem` when the option needs a readable label and optional helper copy next to the control.
- Use the built-in `error` prop when the group participates in form validation and needs an accessible destructive state.

**When NOT to use:**

- Do not use `RadioGroup` for multi-select behavior; use `Checkbox` or an app-local selection shell instead.
- Do not introduce router, fetch, validation orchestration, or domain mapping into the shared primitive.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive | `@radix-ui/react-radio-group` | Radix provides accessible radio semantics, controlled/uncontrolled support, and correct keyboard behavior. |
| Public API shape | Compound exports: `RadioGroup` + `RadioGroupItem` | Matches the `children`-based contract in `02-api-conventions.md` without adding option-array or render-prop sprawl. |
| Controlled vs uncontrolled | both | Radix supports `value`/`onValueChange` and `defaultValue`; consumers can choose the mode they need. |
| Layout API | `orientation` only | Cross-app baselines vary between stacked and inline layouts, but orientation is the only shared layout switch required at the root. |
| Density API | `size?: 'sm' | 'md' | 'lg'` | Several app baselines need compact vs default field density, and this is consistent with the wider shared input family. |
| Validation API | `error?: string | boolean` on the group | Form-aligned validation belongs on the group surface, not repeated on every item. |
| Item content | `label` + optional `description` props | Aligns with form naming conventions and covers the common per-app option-copy pattern. |
| Box-only DOM rule | explicit | Root wrapper, item row, semantic `label`, descriptions, and indicator wrappers all render through `Box` with `as` or `asChild`. |
| Composition review | keep explicit, avoid prop proliferation | `$vercel-composition-patterns` review still favors a small compound API over booleans such as `inline`, `card`, or `withDescription`. |

---

## Props Interface

### `RadioGroup`

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | `undefined` | No | Controlled selected item value. |
| `defaultValue` | `string` | `undefined` | No | Uncontrolled initial selected item value. |
| `onValueChange` | `(value: string) => void` | `undefined` | No | Called when the selected item changes. |
| `disabled` | `boolean` | `false` | No | Disables the whole group and every child item. |
| `required` | `boolean` | `false` | No | Marks the group as required for form submission semantics. |
| `orientation` | `'horizontal' | 'vertical'` | `'vertical'` | No | Controls item layout direction. |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` | No | Applies shared density sizing to the radio control and associated text. |
| `error` | `string | boolean` | `false` | No | Applies destructive styling and optionally renders an accessible validation message. |
| `children` | `React.ReactNode` | - | Yes | Composed `RadioGroupItem` children. |
| `className` | `string` | `undefined` | No | Consumer override merged last through `cn()`. |
| `...props` | `React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>` | - | No | Pass-through Radix root props such as `name`, `dir`, `loop`, `id`, and `aria-*`. |

### `RadioGroupItem`

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | - | Yes | Unique item value submitted by the group. |
| `label` | `string` | `undefined` | No | Primary text associated with the radio control. |
| `description` | `string` | `undefined` | No | Secondary supporting copy under the label. |
| `disabled` | `boolean` | `false` | No | Disables only this item. |
| `className` | `string` | `undefined` | No | Consumer override merged last through `cn()`. |
| `...props` | `React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>` | - | No | Pass-through Radix item props such as `id` and `aria-*`. |

---

## Variants

`RadioGroup` keeps the public API small and explicit. The shared presentation surface comes from layout plus density, rather than adding card-mode or style-mode booleans.

| Layout / treatment | Mechanism | Use case |
| --- | --- | --- |
| Vertical stack | `orientation="vertical"` | Forms, settings screens, and helper-text-heavy options. |
| Horizontal row | `orientation="horizontal"` | Compact choice sets with shorter labels. |
| Small density | `size="sm"` | Tighter form layouts and compact filters. |
| Medium density | `size="md"` | Default shared radio-group layout. |
| Large density | `size="lg"` | Larger touch targets and emphasis-heavy forms. |
| Descriptive item | `description` on `RadioGroupItem` | Inputs that need additional context or compliance copy. |

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Default | Unchecked circular control with label and optional description | Root exposes native radio-group semantics through Radix. |
| Checked | Filled indicator dot and active border/ring treatment | Selected item exposes `aria-checked="true"` and remains tabbable. |
| Disabled | Muted label/description and non-interactive control | Disabled items expose disabled semantics and leave arrow navigation intact for enabled siblings. |
| Group disabled | Entire set renders muted and non-interactive | Root and items expose disabled state via Radix data attributes and disabled behavior. |
| Description | Secondary copy sits below the label without changing selection semantics | Description is linked with `aria-describedby` on the radio item. |
| Error | Control and label shift to destructive styling while descriptions remain muted; optional message renders beneath the group | Root exposes `aria-invalid` and links the validation message through `aria-describedby`. |

---

## Accessibility

### ARIA Roles & Attributes

| Element | Role / Attribute | Value |
| --- | --- | --- |
| Root | implicit role | Native `radiogroup` semantics from Radix Root |
| Root | `aria-invalid` | Applied when `error` is truthy |
| Root | `aria-describedby` | References the optional error message and any caller-provided description ids |
| Item | implicit role | Native `radio` semantics from Radix Item |
| Item | `aria-describedby` | References the optional item description element |
| Label | `htmlFor` | Associates the visible label with the radio control |

### Keyboard Map

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus to the checked item, or the first item when none is selected |
| `Space` | Checks the focused item |
| `ArrowDown` / `ArrowRight` | Moves focus to the next item and, in standard browser interaction, selects it |
| `ArrowUp` / `ArrowLeft` | Moves focus to the previous item and, in standard browser interaction, selects it |

### Focus Management

- `RadioGroup` does not trap or move focus outside the standard radio-group pattern.
- Focus remains on the currently active radio item after selection changes.
- Visible focus treatment stays on the radio control itself.

### Screen Reader Notes

- Item labels provide the accessible name for each radio.
- Optional descriptions remain supplemental and do not replace the primary label.
- Validation messaging is announced through the group-level `aria-describedby` chain when `error` is a string.

---

## Usage Examples

### 1. Basic usage

```tsx
<RadioGroup defaultValue="email" name="contact-method">
  <RadioGroupItem value="email" label="Email" />
  <RadioGroupItem value="sms" label="SMS" />
</RadioGroup>
```

### 2. With descriptions

```tsx
<RadioGroup value={value} onValueChange={setValue}>
  <RadioGroupItem
    value="standard"
    label="Standard delivery"
    description="Estimated arrival in 3 to 5 business days."
  />
  <RadioGroupItem
    value="express"
    label="Express delivery"
    description="Prioritized handling and next-day delivery where available."
  />
</RadioGroup>
```

### 3. Error handling

```tsx
<RadioGroup
  value={contactMethod}
  onValueChange={setContactMethod}
  error="Please choose a notification method before continuing."
  required
>
  <RadioGroupItem value="email" label="Email" />
  <RadioGroupItem value="sms" label="SMS" />
</RadioGroup>
```

### 4. Box-only authored DOM guidance

```tsx
<Box as="fieldset" className="grid gap-3">
  <Box as="legend" className="text-sm font-medium text-foreground">
    Notification preference
  </Box>
  <RadioGroup defaultValue="email" size="sm">
    <RadioGroupItem value="email" label="Email" />
    <RadioGroupItem value="push" label="Push notification" />
  </RadioGroup>
</Box>
```

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Compose options with `RadioGroupItem` children so the group keeps native radio semantics. | Replace the shared contract with option arrays, custom renders, or router-aware behavior. |
| Use `orientation`, `size`, and `className` for shared layout and density differences. | Add new public booleans such as `inline`, `card`, `compact`, or `withDescription`. |
| Use the built-in `error` prop for form validation messaging. | Repeat duplicate validation text on every item. |
| Keep authored shared DOM on `Box`, including labels, descriptions, and indicator wrappers. | Hand-author native JSX tags such as `div`, `label`, `button`, or `span` in shared source or stories. |
| Keep value mapping and form orchestration in the consumer. | Put fetch logic, validation rules, or domain-specific state in `RadioGroup`. |

---

## Storybook Stories Required

**Story file title:** `'Inputs/RadioGroup'`

- [x] `Default`
- [x] `Sizes`
- [x] `Horizontal`
- [x] `DisabledState`
- [x] `WithDescription`
- [x] `ErrorState`
- [x] `Interactive`
- [x] `ResponsiveLayout`

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-10 | Initial RadioGroup spec |
| 2026-03-10 | Added shared `size` and `error` support plus matching Storybook coverage |

