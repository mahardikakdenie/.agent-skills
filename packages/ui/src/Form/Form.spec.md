# Form Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Inputs` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Complex` |
| Based on | `react-hook-form` + shared `Label`, `Input`, `Select`, and `Box` |

---

## Overview

`Form` is the shared React Hook Form field-composition layer for `@repo/ui`. It provides a consistent, app-agnostic way to connect shared inputs and custom controls to form state, inline descriptions, and accessible validation messaging without forcing every app to rebuild the same `Controller` wiring and `aria-describedby` logic.

This component intentionally stops at the field-shell layer. Schema design, submission handlers, transport logic, mutations, business validation, domain copy, and step orchestration stay in app code. `Form` exists to standardize field composition and accessibility, not to absorb workflow logic.

**When to use:**

- Use `Form` when shared inputs or custom controls need consistent label, description, and error wiring through React Hook Form.
- Use `FormField` when a control needs `useController` state and field-level validation messaging.
- Use `FormMessage` and `FormDescription` to keep helper text and validation output accessible and visually consistent.

**When NOT to use:**

- Do not move Zod schemas, mutation handlers, async submission logic, or domain validation into `@repo/ui`.
- Do not wrap business-specific multi-step flows or workflow shells in this shared component family.
- Do not duplicate label, helper, or error copy on child controls when the field is already composed through `FormLabel`, `FormDescription`, and `FormMessage`.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Public API shape | Compound exports | `$vercel-composition-patterns` review favors compound field composition over a boolean-heavy flat API. |
| RHF integration | `FormProvider` + `useController` | Keeps field state colocated with the rendered control while allowing both native and custom shared inputs. |
| Controlled vs uncontrolled | both | React Hook Form supports both value ownership patterns and app baselines use both. |
| Root element | `Box as="form"` | Keeps authored shared DOM on `Box` while preserving native form semantics. |
| Label and message wiring | shared contexts | The field/item contexts keep `htmlFor`, `aria-describedby`, and inline error ids consistent. |
| Box-only DOM rule | explicit | The root form, item wrapper, description, and message copy all render through `Box`; consumer-authored controls compose through shared primitives. |

---

## Props Interface

### Root

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `form` | `UseFormReturn<TFieldValues>` | - | Yes | React Hook Form instance passed to `FormProvider`. |
| `className` | `string` | `undefined` | No | Consumer override merged onto the root form element through `cn()`. |
| `noValidate` | `boolean` | `true` | No | Disables native browser validation so React Hook Form owns field validation feedback. |
| `children` | `React.ReactNode` | - | Yes | Composed `FormField` items and any layout wrappers. |
| `...props` | `React.FormHTMLAttributes<HTMLFormElement>` | - | No | Native form props such as `onSubmit`, `id`, and `autoComplete`. |

### Field

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `name` | `FieldPath<TFieldValues>` | - | Yes | React Hook Form field path. |
| `rules` | `RegisterOptions` | `undefined` | No | Field-level validation rules for `useController`. |
| `defaultValue` | `FieldPathValue<TFieldValues, TName>` | `undefined` | No | Default value for controlled wrappers. |
| `shouldUnregister` | `boolean` | `undefined` | No | Pass-through to `useController` for mount/unmount behavior. |
| `disabled` | `boolean` | `false` | No | Disables the field at the controller layer. |
| `render` | `(props) => React.ReactNode` | - | Yes | Render function that receives `field`, `fieldState`, and `formState`. |

### Item and text slots

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `FormItem.className` | `string` | `undefined` | No | Consumer override merged onto the field wrapper. |
| `FormLabel.required` | `boolean` | `false` | No | Uses the shared required indicator from `Label`. |
| `FormDescription.children` | `React.ReactNode` | - | No | Supporting helper copy for the field. |
| `FormMessage.children` | `React.ReactNode` | - | No | Optional fallback message when no RHF error is present. |

---

## Variants

`Form` intentionally keeps visual variants flat and structural. The shared contract standardizes spacing, label tone, helper text, and error copy instead of introducing `variant`, `size`, or `layout` booleans at the form-shell level.

| Shared treatment | Description | When to use |
| --- | --- | --- |
| Default field item | Grid-based field stack with label, control, and helper or message slots | Standard shared form composition. |
| Description text | Muted supporting copy beneath the control | Guidance, hints, or optional context. |
| Error message | Destructive inline validation message | Field validation feedback from RHF. |

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Default | Neutral spacing and readable label-copy hierarchy | Native form semantics remain on the control inside `FormControl` |
| Description | Muted helper text appears below the control | `aria-describedby` links the helper copy to the field |
| Error | Label tone and message text turn destructive | `aria-invalid="true"` and `role="alert"` announce the error |
| Disabled | Consumer control becomes non-interactive; label inherits disabled styling when `disabled` is passed through `FormField` | Disabled semantics stay on the actual form control |
| Custom control | Shared field chrome still works around components like `Select` | `FormControl` injects ids and described-by wiring through `Slot` |
| Array field | Repeated items stay structurally consistent | Each repeated control keeps unique ids and linked copy |

---

## Compound Sub-components

| Sub-component | Purpose | Key props |
| --- | --- | --- |
| `Form` | Root wrapper around `FormProvider` and the semantic form element | `form`, `onSubmit`, `className`, `noValidate` |
| `FormField` | Field-level controller wrapper | `name`, `rules`, `render` |
| `FormItem` | Structural field wrapper | `className`, `children` |
| `FormLabel` | Shared label wired to the current field id | `required`, `children` |
| `FormControl` | Slot that injects ids and `aria-*` attributes into the child control | `children` |
| `FormDescription` | Supporting helper text | `children` |
| `FormMessage` | Validation or fallback message slot | `children` |

---

## Accessibility

### ARIA Roles & Attributes

| Element | Role / Attribute | Value |
| --- | --- | --- |
| Root | implicit role | Native `form` semantics via `Box as="form"` |
| Label | `htmlFor` | Links to the generated control id |
| Control | `aria-describedby` | Includes description and message ids when rendered |
| Control | `aria-invalid` | `true` when the current field has a validation error |
| Message | `role` | `alert` |

### Keyboard Map

| Key | Behavior |
| --- | --- |
| `Tab` | Moves between controls and interactive field actions in DOM order |
| `Shift+Tab` | Moves backwards through the form |
| `Enter` | Submits the parent form when the active control and browser semantics allow it |
| `Space` | Activates checkboxes, radios, and other control-specific semantics on the child control |

### Focus Management

- `Form` does not move focus automatically; it keeps focus ownership on the composed control.
- `FormControl` does not trap focus or intercept keyboard behavior.
- Consumers should call `form.setFocus` or similar RHF helpers in app code when workflow-specific focus changes are required.

### Screen Reader Notes

- `FormLabel` provides the accessible name for the composed field when a visible label is rendered.
- `FormDescription` and `FormMessage` are linked through `aria-describedby` so helper and error copy are announced together.
- `FormMessage` uses `role="alert"` so validation changes are announced without requiring a page refresh.

---

## Usage Examples

### 1. Basic shared field

```tsx
const form = useForm({ defaultValues: { email: '' } });

<Form form={form} onSubmit={form.handleSubmit(console.log)}>
  <FormField
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel required>Email</FormLabel>
        <FormControl>
          <Input {...field} inputMode="email" placeholder="name@example.com" />
        </FormControl>
        <FormDescription>We only use this for account notifications.</FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### 2. Custom control composition

```tsx
<FormField
  name="role"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Role</FormLabel>
      <FormControl>
        <Select
          value={field.value}
          onValueChange={field.onChange}
          options={[
            { label: 'Admin', value: 'admin' },
            { label: 'Member', value: 'member' },
          ]}
          placeholder="Select a role"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### 3. Array field composition

```tsx
const form = useForm({
  defaultValues: { contacts: [{ value: '' }] },
});
const contacts = useFieldArray({ control: form.control, name: 'contacts' });

<Form form={form}>
  {contacts.fields.map((contact, index) => (
    <FormField
      key={contact.id}
      name={`contacts.${index}.value`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Contact {index + 1}</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Enter contact detail" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ))}
</Form>
```

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Use `FormField` to colocate RHF controller state with the rendered control. | Rebuild the same `Controller` + aria wiring differently in every app. |
| Keep schemas, submission logic, and mutations in app code. | Move Zod schemas or business handlers into `@repo/ui`. |
| Use `FormLabel`, `FormDescription`, and `FormMessage` for field copy. | Duplicate label or error copy inside both the child input and the form field shell. |
| Compose custom controls like `Select` through `FormControl`. | Add control-specific boolean props to `Form` for every future field type. |
| Keep authored shared DOM on `Box` and shared primitives only. | Hand-write native JSX tags in the shared component or stories. |
| Use `useFieldArray` in app code with repeated `FormField` items. | Add a dedicated shared array-field component before a real reuse need exists. |

---

## Storybook Stories Required

**Story file title:** `'Inputs/Form'`

- [x] `Field`
- [x] `Description`
- [x] `ErrorState`
- [x] `CustomControl`
- [x] `DisabledField`
- [x] `ArrayField`
- [x] `Interactive`
- [x] `ResponsiveLayout`

---

## Box-only DOM policy

- Authored shared JSX for this component and its stories must use `Box` for every DOM node we own.
- The semantic form element renders through `Box as="form"`.
- Field wrappers, helper text, and message copy render through `Box`, and child controls are composed through shared primitives and `Slot`.
- Do not hand-author native DOM tags in shared `Form` source or stories.

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-11 | Initial Form spec |
