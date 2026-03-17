# OtpInput Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Inputs` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Standard` |
| Based on | `Tier 1 composition` |

---

## Overview

`OtpInput` is the shared segmented one-time-password entry field for verification and confirmation flows that need a short fixed-length code without carrying route logic, resend timers, or submission policy into `@repo/ui`. The recurring app baselines all converge on the same low-level behavior: numeric-only slot entry, automatic focus advance, backspace navigation, whole-code paste, disabled treatment, and a simple error state that can be wired into page or modal shells owned by the consuming app. Its visual chrome now follows the shared `Input` and `DatePicker` family by supporting the same `default`, `outline`, and `ghost` variant vocabulary.

The shared component stays intentionally flat. It does not own transport, cooldown timers, channel messaging, resend actions, or business validation rules. Those concerns remain local and compose around `OtpInput`, while `@repo/ui` standardizes the segmented field UI, keyboard behavior, and accessibility wiring.

**When to use:**

- Use `OtpInput` for fixed-length verification codes in login, nomination, voucher, and confirmation flows.
- Use `length`, `size`, `disabled`, `error`, and `autoFocus` to cover the shared visual and interaction needs without adding workflow-specific props.

**When NOT to use:**

- Do not use `OtpInput` for resend timers, attempt blocking, delivery-channel copy, or submit-button orchestration.
- Do not move async verification, success state, or modal/page shell logic into this component.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive | segmented native inputs via `Box as="input"` | Preserves browser text-entry semantics while satisfying the Box-only DOM policy. |
| CVA strategy | slot-based | Each OTP slot needs shared size scaling plus filled, active, disabled, and invalid state styling. |
| Controlled vs uncontrolled | both | Consumers may fully control `value`, but the component also supports local state when only `onValueChange` is needed. |
| Composition model | flat API | `vercel-composition-patterns` review does not justify a compound API; this is a single field shell rather than a family of public sub-components. |
| Paste behavior | whole-code and partial distribution | Real baselines depend on full-code paste, and partial distribution improves keyboard and mobile autofill ergonomics without widening the API. |
| Keyboard model | slot-local with directional focus movement | Keeps interaction predictable for segmented entry while remaining accessible to keyboard users. |
| Box-only DOM rule | explicit | All authored shared JSX and stories render through `Box`, including the semantic input nodes and error/status copy. |

---

## Props Interface

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | `undefined` | No | Controlled OTP value. Non-digit characters are ignored and extra characters are trimmed to `length`. |
| `onValueChange` | `(value: string) => void` | `undefined` | No | Called whenever the normalized OTP string changes. |
| `length` | `number` | `6` | No | Number of OTP slots to render. |
| `variant` | `'default' \| 'outline' \| 'ghost'` | `'default'` | No | Shared slot chrome aligned with `Input` and `DatePicker`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Shared OTP slot size scale. |
| `disabled` | `boolean` | `false` | No | Disables entry and focus movement. |
| `error` | `string \| boolean` | `false` | No | Marks the field invalid; string values render inline error copy. |
| `autoFocus` | `boolean` | `false` | No | Focuses the first empty slot on mount when enabled. |
| `className` | `string` | `undefined` | No | Consumer override merged onto the outer field wrapper through `cn()`. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | No | Standard root props such as `id`, `aria-*`, `role`, `data-*`, and event handlers for the outer group. |

---

## Variants

### Variants

| Variant | Description | When to use |
| --- | --- | --- |
| `default` | Bordered slot with background and subtle shadow | Standard forms, modal verification, and general OTP flows |
| `outline` | Lower-elevation bordered slot | Layered surfaces and denser cards where shadow is unnecessary |
| `ghost` | Minimal chrome with muted background | Inline verification utilities and quieter supporting surfaces |

### Size scale

| Size | Behavior | Intended use |
| --- | --- | --- |
| `sm` | Compact square slots with dense spacing | Tight modals, narrow cards, and supporting verification surfaces |
| `md` | Default slot size and spacing | General page and modal verification flows |
| `lg` | Larger slot size for stronger visual emphasis | Spacious layouts or touch-forward confirmation flows |

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Empty | Neutral tokenized slots with numeric keyboard hinting | Each slot is labeled by digit position |
| Focused slot | Compact near-slot focus ring with lighter active border/fill support | Focus remains keyboard visible on the currently active slot |
| Filled | Entered digits tint the slot to show progress | Live status text announces progress politely |
| Disabled | Muted surface and no keyboard or pointer entry | Each slot uses native `disabled` |
| Error | Destructive border and inline error copy | Uses `aria-invalid="true"` and links message through `aria-describedby` |
| Pasted value | Digits distribute across consecutive slots | Normalized progress announcement updates after paste |

`OtpInput` has no built-in loading or success visual state; those remain consumer-owned.

---

## Accessibility

### ARIA Roles & Attributes

| Element | Role / Attribute | Value |
| --- | --- | --- |
| Root | `role` | `group` |
| Root | `aria-invalid` | `true` when `error` is present |
| Slot input | `aria-label` | `"Digit {n} of {length}"` |
| Slot input | `aria-describedby` | Includes live status and error ids |
| Error message | `role` | `alert` |
| Status text | `aria-live` | `polite` |

### Keyboard Map

| Key | Behavior |
| --- | --- |
| `Tab` / `Shift+Tab` | Moves focus into or out of the segmented input group |
| `0-9` | Fills the current slot and advances focus |
| `Backspace` | Clears the current slot or moves backward when the current slot is empty |
| `Delete` | Clears the current slot without changing group structure |
| `ArrowLeft` / `ArrowRight` | Moves focus to the previous or next slot |
| `Home` / `End` | Jumps to the first or last slot |
| Paste | Distributes pasted digits across the available slots |

### Focus Management

- `autoFocus` places focus on the first empty slot on mount when the field is enabled.
- After a digit is entered, focus advances to the next slot unless the last slot is reached.
- After backspace on an empty slot, focus moves to the previous slot and clears it.
- Whole-code paste focuses the last filled slot so keyboard users can continue editing immediately.

### Screen Reader Notes

- A visually hidden live region announces OTP progress, for example `3 of 6 digits entered`.
- Consumers should supply an external label or `aria-label` on the group when surrounding copy does not already identify the code field.
- Visible error strings are announced through `role="alert"` and shared `aria-describedby` wiring.

---

## Usage Examples

### 1. Basic usage

```tsx
<OtpInput onValueChange={setCode} />
```

### 2. Controlled usage

```tsx
<OtpInput value={code} onValueChange={setCode} length={6} />
```

### 3. Error state

```tsx
<OtpInput
  value={code}
  onValueChange={setCode}
  error="Please enter the six-digit code."
/>
```

### 4. Form composition

```tsx
<FormField
  name="otp"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel>Verification code</FormLabel>
      <FormControl>
        <OtpInput
          value={field.value}
          onValueChange={field.onChange}
          error={fieldState.error?.message}
          autoFocus
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Use `onValueChange` to keep OTP state in the parent flow or form controller. | Keep app-local `onChange` signatures as the shared public API. |
| Use `variant` to align OTP slot chrome with nearby `Input` and `DatePicker` fields. | Add OTP-specific booleans such as `withShadow` or `minimal` instead of using the shared variant vocabulary. |
| Use `error` for invalid state and inline error copy. | Introduce separate `status`, `success`, or workflow-result props. |
| Keep resend timers, delivery-channel copy, and verification submission outside the component. | Pull OTP countdowns, retries, or service calls into `OtpInput`. |
| Rely on built-in digit sanitization and paste distribution for whole-code entry. | Expect alphabetic characters or arbitrary formatting to remain in the value. |
| Keep authored shared JSX and stories on `Box`, including every input and message node. | Hand-write native `div`, `input`, `p`, or `span` tags in shared authored JSX. |
| Provide an accessible external label when the surrounding UI does not already identify the field. | Leave the segmented input unlabeled in consuming flows. |

---

## Storybook Stories Required

**Story file title:** `'Inputs/OtpInput'`

- [x] `Default`
- [x] `Variants`
- [x] `Sizes`
- [x] `DisabledState`
- [x] `ErrorState`
- [x] `AutoFocus`

---

## Box-only DOM policy

- Authored shared JSX for this component and its stories must use `Box` for every DOM node.
- Semantic inputs and supporting copy render through `Box as="input"` and `Box as="p"`.
- No authored native `div`, `input`, `span`, `p`, or similar tags appear directly in the shared implementation or Storybook stories.

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-12 | Initial OtpInput spec |
| 2026-03-17 | Documented the lighter segmented-slot focus recipe and reduced active-plus-focus stacking |
