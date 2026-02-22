# 06 — Component Standards & Conventions

> **Role:** Always-on reference — consulted during every phase.
> **Branch:** Any (reference doc; anchored on `migrate-app/admin-portal`, reproduced on `feat/ui`)
> **Owned by:** `feat/ui` maintainers (UI foundation decisions made in Phase 02 lock this)
> **Prev:** Phase 02 locks this · **Used by:** Phases 01, 03, 04, 05

---

## Purpose

Establish the single source of truth for component naming, prop conventions, variant systems, theming rules, and the shared-vs-local boundary. Every phase references this doc to ensure consistency across all 28+ apps and `packages/ui`.

---

> **Section Navigation:**
> [§1 Taxonomy](#1-component-taxonomy) · [§1.4 Box](#14-box--the-native-element-eliminator) · [§2 Prop Naming](#2-prop-naming-conventions) · [§3 TypeScript](#3-typescript-conventions) · [§4 Variant System](#4-variant-system-cva) · [§5 Theming & Tokens](#5-theming--token-contract) · [§6 Shared-vs-Local Boundary](#6-shared-vs-local-boundary-framework) · [§6.2 Salvage Evaluation](#62-keepapplocal-salvage-evaluation) · [§6.3 API Consolidation](#63-component-api-consolidation-rules) · [§6.4 Storybook Taxonomy](#64-storybook-category-taxonomy) · [§7 Accessibility](#7-accessibility-baseline) · [§8 Parity Contract](#8-parity-contract--migration-guardrails)
>
> When referencing a section from another doc, use the anchor format: `06-component-standards.md#6-shared-vs-local-boundary-framework`

---

<a id="1-component-taxonomy"></a>

## 1. Component Taxonomy

### Tier 1 — Primitive Components

Atomic, single-element components. Wrap a single Radix UI primitive or HTML element.

| Component    | @repo/ui export | Radix Primitive               |
| ------------ | --------------- | ----------------------------- |
| `Box`        | ✅ `Box`        | `@radix-ui/react-slot`        |
| `Button`     | ✅ `Button`     | `@radix-ui/react-slot`        |
| `Input`      | ✅ `Input`      | `<input>`                     |
| `Textarea`   | ✅ `Textarea`   | `<textarea>`                  |
| `Label`      | ✅ `Label`      | `@radix-ui/react-label`       |
| `Checkbox`   | ✅ `Checkbox`   | `@radix-ui/react-checkbox`    |
| `Switch`     | ✅ `Switch`     | `@radix-ui/react-switch`      |
| `RadioGroup` | ✅ `RadioGroup` | `@radix-ui/react-radio-group` |
| `Select`     | ✅ `Select`     | `@radix-ui/react-select`      |
| `Skeleton`   | ✅ `Skeleton`   | —                             |
| `Badge`      | ✅ `Badge`      | —                             |
| `Avatar`     | ✅ `Avatar`     | `@radix-ui/react-avatar`      |
| `Spinner`    | ❌ missing      | —                             |
| `Table`      | ❌ missing      | —                             |

> **`Box` is the foundational Tier 0 primitive.** All Tier 1 components that wrap a single native HTML element build on `Box` (or use the same forwarding pattern). See [§1.4 Box — The Native Element Eliminator](#14-box--the-native-element-eliminator) for migration guidance.

### Tier 2 — Composite Components

Combine multiple primitives into a cohesive UI pattern.

| Component               | @repo/ui export | Based On                              |
| ----------------------- | --------------- | ------------------------------------- |
| `Alert`                 | ✅ `Alert`      | Tier 1                                |
| `Card`                  | ✅ `Card`       | Tier 1                                |
| `Form`                  | ✅ `Form`       | `react-hook-form` + `Label` + `Input` |
| `Breadcrumb`            | ✅ `Breadcrumb` | Tier 1                                |
| `Tabs`                  | ✅ `Tabs`       | `@radix-ui/react-tabs`                |
| `Dialog`                | ✅ `Dialog`     | `@radix-ui/react-dialog`              |
| `Drawer`                | ✅ `Drawer`     | `vaul`                                |
| `Popover`               | ✅ `Popover`    | `@radix-ui/react-popover`             |
| `Tooltip`               | ✅ `Tooltip`    | `@radix-ui/react-tooltip`             |
| `Pagination`            | ✅ `Pagination` | Tier 1                                |
| `Calendar`              | ✅ `Calendar`   | `react-day-picker`                    |
| `DataTable`             | ❌ missing      | `Table` + `Pagination`                |
| `DatePicker`            | ❌ missing      | `Calendar` + `Popover`                |
| `DateRangePicker`       | ❌ missing      | `Calendar` + `Popover`                |
| `Combobox`              | ❌ missing      | `Command` + `Popover`                 |
| `Command`               | ❌ missing      | `cmdk`                                |
| `DropdownMenu`          | ❌ missing      | Radix DropdownMenu                    |
| `NavigationMenu`        | ❌ missing      | Radix NavigationMenu                  |
| `Menubar`               | ❌ missing      | Radix Menubar                         |
| `PageHeader`            | ❌ missing      | Tier 1                                |
| `ContentLoadingWrapper` | ❌ missing      | `Skeleton`                            |

### Tier 3 — App-Local Only (never extracted to `packages/ui`)

| Pattern                                       | Reason                 |
| --------------------------------------------- | ---------------------- |
| Domain forms (BrokerFeeForm, ClaimForm, etc.) | Business logic         |
| Table column configs (`*TableConfig.tsx`)     | Domain-specific schema |
| Chart/recharts wrappers                       | Data-coupled           |
| Branded loader (logo animation)               | App identity           |
| Full-page layout (sidebar, top nav)           | App routing            |

---

<a id="14-box--the-native-element-eliminator"></a>

### 1.4 Box — The Native Element Eliminator

> [!IMPORTANT]
> One of the explicit goals of this migration is to **eliminate all bare native HTML elements** (`div`, `span`, `section`, `article`, `main`, `aside`, `header`, `footer`, `ul`, `ol`, `li`, `p`, etc.) from app component code. `Box` is the vehicle for this.

`Box` is a **polymorphic, type-safe layout primitive** exported from `@repo/ui`. It renders any HTML element via the `as` prop and forwards all correct HTML attributes and `ref` types to that element.

```tsx
// Before — bare native elements
<div className="flex items-center gap-4">
  <span className="text-sm">Hello</span>
</div>

// After — all elements flow through the design system
import { Box } from '@repo/ui';

<Box className="flex items-center gap-4">
  <Box as="span" className="text-sm">Hello</Box>
</Box>
```

#### When to use `Box`

| Scenario                              | Pattern                                                   |
| ------------------------------------- | --------------------------------------------------------- |
| Replace a plain `div`                 | `<Box className="...">` (default `as="div"`)              |
| Replace any semantic element          | `<Box as="section">`, `<Box as="ul">`, `<Box as="p">`     |
| Replace an inline element             | `<Box as="span">`, `<Box as="strong">`                    |
| Wrap with no extra DOM node (asChild) | `<Box asChild className="..."><button>...</button></Box>` |

#### Type safety guarantee

`Box` is fully generic — when you set `as="a"`, TypeScript only allows valid `<a>` attributes (`href`, `target`, etc.). Invalid attributes produce compile-time errors:

```tsx
// ✅ Valid — href is a valid <a> attribute
<Box as="a" href="/home">Home</Box>

// ❌ TypeScript error — href is not valid on <div>
<Box href="/home">Home</Box>
```

#### Migration rule for Phase 05

When executing app migration (Phase 05), **every component returned from audit that contains bare native HTML elements qualifies for a Box pass** as part of its migration batch — no additional batch needed, this is part of the normal import swap. See [05-app-migration.md](./05-app-migration.md) §Native Element Replacement for the exact guardrails.

#### Do NOT use Box for

- Components that already map to a semantic `@repo/ui` primitive (`Button`, `Input`, `Label`, etc.)
- Interactive elements that need Radix-managed ARIA (use the appropriate Radix-backed component)
- Wrapping entire page layouts (Box is per-element, not a layout system)

<a id="2-prop-naming-conventions"></a>

## 2. Prop Naming Conventions

### Size Variants (mandatory)

```typescript
size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
// DEFAULT: 'md'
// FORBIDDEN: 'small', 'medium', 'large', 'tiny', 'huge'
```

### Visual Variants (mandatory)

```typescript
variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
// DEFAULT: 'default'
// FORBIDDEN: 'danger' (use 'destructive'), 'warning-style', 'info-color'
```

### State Props (mandatory naming)

```typescript
disabled?: boolean          // not: isDisabled, readOnly (unless truly readonly)
loading?: boolean           // not: isLoading, pending
error?: string | boolean    // not: hasError, errorMessage (use both: error + errorMessage)
required?: boolean          // not: isRequired
```

### Content/Slot Props

```typescript
children: React.ReactNode            // primary slot
label?: string                       // short text label
description?: string                 // longer descriptive text
placeholder?: string                 // input placeholder
icon?: React.ReactNode               // icon slot
leftIcon?: React.ReactNode           // icon before content
rightIcon?: React.ReactNode          // icon after content
actions?: React.ReactNode            // action button slot
```

### Event Handler Naming

```typescript
onClick?: (event: React.MouseEvent<HTMLElement>) => void
onChange?: (value: T) => void        // NOT: onChangeValue, handleChange
onSubmit?: (data: T) => void
onClose?: () => void                 // NOT: handleClose, onDismiss
onOpen?: () => void
onSelect?: (value: T) => void
```

### Forbidden Prop Patterns

```typescript
// FORBIDDEN — app-specific
apiUrl?: string
fetchData?: () => Promise<T>
serviceMethod?: (...) => void

// FORBIDDEN — domain types
policy?: Policy
claim?: Claim
user?: User

// FORBIDDEN — Next.js specific in packages/ui
href?: import('next/link').LinkProps['href']  // use: href?: string
src?: import('next/image').ImageProps['src']   // use: src?: string | StaticImport
```

---

<a id="3-typescript-conventions"></a>

## 3. TypeScript Conventions

### Component Interface Pattern

```typescript
// Always export the props interface
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

### Generic Data Components

```typescript
// Use generics for data-display components
export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  loading?: boolean;
  // ...
}

export function DataTable<TData>({ data, columns, loading }: DataTableProps<TData>) {
  // ...
}
```

### Ref Forwarding (mandatory for primitive components)

```typescript
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(inputVariants(), className)} {...props} />
  )
);
Input.displayName = 'Input';
```

---

<a id="4-variant-system-cva"></a>

## 4. Variant System (CVA)

All variant logic must use `class-variance-authority`:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@repo/ui/utils';

// or local cn

const componentVariants = cva(
  // base classes
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export type ComponentVariants = VariantProps<typeof componentVariants>;
```

---

<a id="5-theming--token-contract"></a>

## 5. Theming & Token Contract

### Required CSS Variables (defined in consuming app's globals.css)

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.5rem;
}
```

### Forbidden in `packages/ui`

```typescript
// FORBIDDEN — hardcoded values
className="bg-[#016da1]"     // use CSS variables
className="text-blue-600"    // use semantic tokens
style={{ color: '#016da1' }} // use CSS variables

// FORBIDDEN — NEXT_PUBLIC env vars
process.env.NEXT_PUBLIC_MODE  // app-specific

// FORBIDDEN — app-specific assets
import logo from '/public/logo.svg'  // app-specific
```

---

<a id="6-shared-vs-local-boundary-framework"></a>

## 6. Shared-vs-Local Boundary Framework

### Decision Tree

```
Is the component purely visual with no business logic?
  YES → Is it used (or likely used) by 2+ apps?
    YES → SHARED candidate → packages/ui
    NO  → KEEP_APP_LOCAL
  NO  → Has the business logic and UI been separated?
    YES → Extract UI part → packages/ui; keep logic in app
    NO  → KEEP_APP_LOCAL (refactor later if needed)

Does the component call APIs or use service hooks?
  YES → KEEP_APP_LOCAL (use packages/ui primitives inside it)

Does the component reference domain entities (Policy, Claim, etc.)?
  YES → KEEP_APP_LOCAL

Does the component use next/link, next/image, or router?
  YES → Extract the framework dependency (use 'as' prop or render prop)
       then evaluate for shared extraction
```

### Always KEEP_APP_LOCAL

- Domain forms (any form with API calls or business validation)
- Table column configs (column schemas are domain-specific)
- Page-level layouts (sidebar with nav config, top bar with user info)
- Branded full-page loaders (logo, company animation)
- Chart data wrappers (recharts configs with domain data shapes)
- Components with `useQuery`/`useMutation` inside

### Always Eligible for packages/ui

- Pure display components (no API, no domain types)
- Input primitives and their enhanced versions (with label + error)
- Modal/dialog/drawer shells (no business content)
- Loading indicators (spinner, skeleton)
- Empty states (with slot for icon + copy)
- Data tables (generic column system, no hardcoded domain columns)
- Navigation primitives (no hardcoded routes)

---

<a id="62-keepapplocal-salvage-evaluation"></a>

### 6.2 KEEP_APP_LOCAL Salvage Evaluation

> [!TIP]
> Before accepting a `KEEP_APP_LOCAL` classification as final, always run this salvage check. Components with a thin app-specific layer over a reusable visual shell are candidates for extraction with one targeted abstraction.

#### When to Attempt Salvage

Attempt salvage if the component has **at most 2 separable app-specific concerns**.

**Do NOT attempt salvage if:**

- Business logic lives **inside** the component JSX (not merely passed in via props)
- The component has 3+ distinct app-specific concerns
- The component performs its own API calls or mutations
- The component is used only by this app and is not likely needed by any other

#### Salvage Potential Levels

| Level | Criteria |
| ------ | -------- |
| `HIGH` | 1 app-specific concern; clear abstraction path; result usable by 2+ apps |
| `MEDIUM` | 2 concerns; abstraction possible but requires design decisions |
| `LOW` | Marginally salvageable; effort likely outweighs benefit |
| `NONE` | 3+ concerns, internal API calls, domain-only, or single-app use only |

#### Abstraction Pattern Reference

| App-specific element | Abstraction pattern | Outcome |
| -------------------- | ------------------- | ------- |
| Next.js `<Link>` or `<Image>` | `as` prop or `renderLink` render prop | Generic shell; framework injected by consumer |
| Data-fetch hook inside component | Extract hook → pass data as plain props | Pure display component eligible for `packages/ui` |
| Domain type in props (`Policy`, `Claim`, etc.) | Replace with generic shape or `<T>` generic | Type-agnostic — consumers provide concrete type |
| Single hardcoded business string/label | Make it a required `children` or `label` prop | No business logic remains in component |
| Conditional rendering varying by app | Slot API (`leftSlot`, `rightSlot`) or `renderX` render prop | Consumer controls the variable part |
| URL construction or routing logic | Accept computed `href` as prop | Component stays framework-agnostic |

#### Effort and Classification Rules

- **HIGH or MEDIUM salvage potential:** Tag the `KEEP_APP_LOCAL` audit entry with `Salvage potential` + `Salvage strategy`. The CSV classification stays `KEEP_APP_LOCAL` — add `salvage_potential` and `salvage_strategy` columns. This flags the component for a future extraction sprint; the actual refactor is **not** done during Batch 1.
- **LOW or NONE:** Record `Salvage potential: NONE` and proceed. No further action needed at audit time.

> Salvage work is scheduled **after** Batch 1 audit is complete and cross-app demand is confirmed in Phase 02. Never delay the audit to perform salvage work inline.

_Cross-reference: [01-app-audit.md — step 4f](./01-app-audit.md) · [migration-batch-prompts.md — Batch 1 step 4e](./migration-batch-prompts.md)_

---

<a id="63-component-api-consolidation-rules"></a>

### 6.3 Component API Consolidation Rules

> [!IMPORTANT]
> Every component added to `packages/ui` must earn its place as a **single, prop-configurable unit**. Sibling components that differ only by 1–2 props or slots are a sign of premature extraction — they proliferate the API surface, inflate the Storybook index, and signal that the audit classification was wrong.

#### The Consolidation Test

Before classifying a component as `NEW_SHARED_COMPONENT`, apply this three-question test:

1. **Same root?** — Does a proposed sibling share the same root element or Radix primitive as an existing (or already-planned) `packages/ui` component?
2. **Small delta?** — Does the sibling differ from that component by ≤ 2 props or optional slots?
3. **No domain logic?** — Is the difference purely presentational (a loading spinner, a footer slot, an icon position)?

If **all three** answers are YES → do **not** add a second component. Merge the difference into the existing component as a prop or slot.

#### Common Anti-Patterns (and Their Fixes)

| Anti-pattern (wrong) | Correct approach |
| -------------------- | ---------------- |
| `Button` + `ButtonWithLoading` as separate components | One `Button` with `loading?: boolean` prop |
| `Table` + `TableHeader` as separate components | One compound `Table` with `Table.Header` sub-component |
| `Modal` + `ModalWithFooter` as separate components | One `Dialog` with `footer?: React.ReactNode` slot |
| `Card` + `CardWithImage` as separate components | One `Card` with `image?: React.ReactNode` slot |
| `Input` + `InputWithLabel` as separate components | One `Input` with `label?: string` + `description?: string` props |
| `Avatar` + `AvatarWithBadge` as separate components | One `Avatar` with `badge?: React.ReactNode` slot |

#### When App-Specific Variation Is OK

If a variation is **only needed by one app** and the variation is purely presentational, the correct pattern is **NOT** a new shared component. Instead:

- Wrap the shared component locally with fixed prop values: `const PrimaryButton = (p) => <Button variant="primary" {...p} />`
- Use `className` for app-level visual overrides (tokens are still used; no hardcoded values)
- Use `asChild` to merge behavior into app-specific elements

This is the **app-local wrapper pattern** — it keeps `packages/ui` lean while giving apps full flexibility.

#### When to Allow a Distinct Component

A genuinely distinct component is justified only when:

- The **DOM structure or accessibility semantics** are fundamentally different (e.g., a visually icon-only button needs `aria-label` and a square aspect — try `Button` with `iconOnly` prop first, create `IconButton` only if the prop surface becomes unmanageable)
- The component is **based on a different Radix primitive** (e.g., `Select` vs `Combobox` — same concept, completely different interaction model)
- The component has **clearly different information architecture** (e.g., `DataTable` with sorting/filtering vs `Table` as a plain HTML table wrapper)

_Cross-reference: [Batch 1 step 4g](./migration-batch-prompts.md) · [04-build-shared-components.md](./04-build-shared-components.md) App-Agnostic Checklist_

---

<a id="64-storybook-category-taxonomy"></a>

### 6.4 Storybook Category Taxonomy

Every component exported from `packages/ui` must be assigned to exactly one Storybook story group. This ensures the Storybook index is always structured, scannable, and trackable across the 28-app migration.

#### Canonical Story Groups

| Story Group | Components |
| ----------- | ---------- |
| `Buttons` | `Button`, `IconButton`, `ToggleButton` |
| `Inputs` | `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Combobox`, `DatePicker`, `DateRangePicker` |
| `Overlays` | `Dialog`, `Drawer`, `Popover`, `Tooltip`, `DropdownMenu`, `ContextMenu`, `Sheet` |
| `Feedback` | `Alert`, `Toast`, `Badge`, `Spinner`, `Skeleton`, `Progress` |
| `Navigation` | `Breadcrumb`, `Tabs`, `Pagination`, `NavigationMenu`, `Menubar`, `Sidebar` |
| `Data Display` | `Table`, `DataTable`, `DataList`, `Avatar`, `Calendar` |
| `Layout` | `Box`, `Card`, `Separator`, `PageHeader`, `ContentLoadingWrapper` |
| `Misc` | `Command`, `Label`, `Form` (field-level primitives) |

#### Story `title` Convention (mandatory)

```tsx
// ComponentName.stories.tsx
const meta: Meta<typeof ComponentName> = {
  title: 'Buttons/Button',   // '<Group>/<ComponentName>' — always this exact format
  component: ComponentName,
  // ...
};
```

The `title` field determines which folder the story lands in inside the Storybook sidebar. Using the canonical group names from the table above is **non-negotiable** — ad-hoc group names (`'UI/Button'`, `'Components/Button'`) are rejected at PR review.

#### Classification Tracking

The `story_group` field must be populated in:
- The component's `ComponentName.spec.md` (under Overview)
- The `_component-backlog.csv` (as the `story_group` column)
- The `11-master-component-roadmap.md` entry (under the component's record)

This enables cross-app tracking: how many `Overlays` do we still need to build? Are all `Inputs` covered? The answer is always one query on the backlog CSV.

_Cross-reference: [04-build-shared-components.md §Spec Template](./04-build-shared-components.md) · [Batch 1 audit template](./migration-batch-prompts.md)_

---

<a id="7-accessibility-baseline"></a>

## 7. Accessibility Baseline

Every `packages/ui` component must meet:

| Requirement         | Standard                                              |
| ------------------- | ----------------------------------------------------- |
| Semantic HTML       | Correct element for the job (`button` not `div`)      |
| Keyboard navigation | Tab, Enter/Space, Esc, Arrow keys where applicable    |
| Focus visible       | `focus-visible:ring-2` or equivalent                  |
| ARIA labels         | All interactive elements with visible or `aria-label` |
| Screen reader       | Status announced (loading, disabled, error states)    |
| Color contrast      | Minimum WCAG AA (4.5:1 for normal text)               |

---

<a id="8-parity-contract--migration-guardrails"></a>

## 8. Behavioral Parity & No-Breaking-Change Contract

> [!IMPORTANT]
> This is the **most critical guardrail** in the entire migration. Every phase prompt and every AI agent executing migration work MUST treat this section as non-negotiable.

### 8.1 The Core Principle

**Migration replaces implementation — not behavior.**

The user must not be able to tell that a migration happened. The app should feel identical before and after. The only acceptable changes are those **explicitly caused by design system token adoption** (minor color/radius/spacing from CSS variables), and even those must be minimal and approved.

### 8.2 What MUST Remain 100% Identical (Behavior Contract)

These must be **bit-for-bit equivalent** before and after migration:

| Category                  | Examples                                                              |
| ------------------------- | --------------------------------------------------------------------- |
| **User interactions**     | Click handlers, hover behavior, focus behavior, keyboard navigation   |
| **Form behavior**         | Submit logic, validation triggers, error display, field clearing      |
| **Data display**          | Table contents, pagination logic, sort/filter behavior                |
| **Loading states**        | Spinner shown, skeleton shown, loading text, disabled during load     |
| **Error states**          | Error message content, error display location, retry behavior         |
| **Empty states**          | Empty message, empty action buttons                                   |
| **Modal/dialog behavior** | Open trigger, close trigger, backdrop behavior, focus trap            |
| **Navigation behavior**   | Route changes, link targets, breadcrumb paths                         |
| **Accessibility**         | Tab order, ARIA labels, screen reader announcements, focus management |
| **API calls**             | No new calls introduced, no calls removed, same payload shapes        |
| **Side effects**          | Toast messages, cache invalidation, state resets after actions        |

### 8.3 What MAY Change (Approved Visual Delta)

These are acceptable **only** because they result directly from design system token adoption:

| Change                                        | Acceptable Condition                                         |
| --------------------------------------------- | ------------------------------------------------------------ |
| Slightly different border-radius              | Caused by `--radius` CSS variable from the new design system |
| Slightly different color shade                | Caused by `--primary`, `--muted`, etc. token adoption        |
| Slightly different font-weight or line-height | Caused by typography token from shared config                |
| Slightly different padding/spacing on atoms   | Caused by CVA `size` variant definition in @repo/ui          |
| Shadow or border style minor diff             | Caused by `--border`, `--ring` token adoption                |

> [!WARNING]
> "Slightly different" means **imperceptible to end users in normal use**. If a user would notice it and comment "this looks different", it is NOT acceptable. Escalate to the UI foundation team.

### 8.4 What is STRICTLY FORBIDDEN During Migration

```
❌ Refactoring component logic "while you're in there"
❌ Changing prop names at usage sites (use adapter pattern instead)
❌ Removing features, variants, or states a component had
❌ Redesigning layouts, spacing, or overall composition
❌ Changing copy / text content / placeholder text
❌ Adding new features or states not in the original
❌ Changing the order of elements inside a component
❌ Removing or changing ARIA attributes
❌ Modifying event handler signatures or behavior
❌ Changing loading state triggers or timing
❌ Altering form validation rules or error messages
```

### 8.5 UX Continuity Rule

> **"The user should not feel like they are using a new app."**

After migration, a user who uses the app daily should notice **nothing different** about the experience — not the layout, not the interactions, not the visual weight. If there is any doubt about whether a change crosses this line, **the answer is to not make the change** and flag it for design system team review.

This applies even to "improvements" — migration is not the time to improve UX. That comes after migration, in a separate design iteration cycle.

### 8.6 AI Guardrail Instruction (always include in phase prompts)

Every phase prompt that involves code changes MUST include this block:

```
## Guardrails (non-negotiable)

You are performing a MIGRATION, not a refactor or redesign.

ALLOWED:
- Updating import paths from local → @repo/ui
- Adapting props at usage sites to match the @repo/ui API (via adapter pattern)
- Deleting confirmed-replaced local component files

FORBIDDEN — will result in rollback:
- Changing any component logic at usage sites
- Changing prop values passed (unless adapting to @repo/ui API, via adapter)
- Changing any visual output beyond what the design system token adoption causes
- Refactoring, improving, or "cleaning up" unrelated code
- Adding new features, removing existing features
- Changing text content, copy, error messages, or placeholders

If you identify something that should be improved, document it in migration-log.md
under "Post-Migration Improvement Candidates" and skip it for now.
```

### 8.7 Parity Checklist Template (per component)

For every ADOPT*\*, EXTEND*\*, or NEW_SHARED component in `parity-checklist.md`:

````markdown
## <ComponentName> — Parity Checklist

### Behavioral Checks (ALL must be ✅ before batch closes)

- [ ] Click/interaction behavior identical
- [ ] Keyboard navigation identical (Tab, Enter, Esc, Arrow)
- [ ] Loading state: shown same as before, same trigger
- [ ] Error state: shown same as before, same message location
- [ ] Empty state: shown same as before
- [ ] Form behavior: submit, validate, reset identical
- [ ] ARIA labels and roles identical or improved (never removed)
- [ ] No new console errors
- [ ] No new network requests

### Visual Checks (minor delta allowed per Section 8.3 — document any diff)

- [ ] Layout and composition unchanged
- [ ] Element order unchanged
- [ ] Text content and copy unchanged
- [ ] Visual delta (if any): \***\*\*\*\*\*\*\***\_\_\_\***\*\*\*\*\*\*\***
  - Is it caused by design system token adoption? YES / NO
  - If YES: acceptable — log it below
  - If NO: STOP — escalate to design team before proceeding

### Smoke Route (verify in browser)

- Route: \***\*\*\*\*\*\*\***\_\_\_\***\*\*\*\*\*\*\***
- Before screenshot: [attach or describe]
- After screenshot: [attach or describe]
- Result: ✅ PASS / ❌ FAIL

### Sign-off

- Migrated by: \***\*\*\*\*\*\*\***\_\_\_\***\*\*\*\*\*\*\***
- Date: \***\*\*\*\*\*\*\***\_\_\_\***\*\*\*\*\*\*\***

### Sign-off

- Migrated by: \***\*\*\*\*\*\*\***\_\_\_\***\*\*\*\*\*\*\***
- Date: \***\*\*\*\*\*\*\***\_\_\_\***\*\*\*\*\*\*\***
- Approved visual delta (if any): \***\*\*\*\*\*\*\***\_\_\_\***\*\*\*\*\*\*\***

### Migration PR Template (Copy-Paste)

```markdown
## Migration PR Checklist

- [ ] **Specs:** Implements `@repo/ui` spec [LINK]
- [ ] **Visuals:** Screenshots attached below (Before vs After)
- [ ] **Behavior:** Verified interactive states (Hover, Focus, Disabled)
- [ ] **A11y:** Verified screen reader announcement

### Visual Proof

| Before      | After       |
| :---------- | :---------- |
| ![img](...) | ![img](...) |
```
````

````

---

## 9. Tailwind Composition Rules

> [!IMPORTANT]
> This section is the definitive low-level guide for writing Tailwind CSS inside `packages/ui` components. Every Batch 3/4 implementation MUST follow these rules.

### 9.1 `cn()` — The Universal Class Merge Utility

All `packages/ui` components use `cn()`, which wraps `clsx` + `tailwind-merge`:

```ts
// packages/ui/src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
````

**Import rules:**

| Context                                          | Import path                           |
| ------------------------------------------------ | ------------------------------------- |
| Inside `packages/ui` components (Batch 3/4 work) | `import { cn } from '../../utils/cn'` |
| App code consuming `@repo/ui`                    | `import { cn } from '@repo/helper'`   |

> Never install `tailwind-merge` or `clsx` directly in component files — always import from the
> internal `utils/cn` (inside `packages/ui`) or `@repo/helper` (in apps). Never cross these boundaries.

### 9.2 CVA + `cn()` Composition Pattern

The canonical pattern for all `packages/ui` components is: **CVA for variant logic → `cn()` for merge + extension**.

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../utils/cn';

// internal path inside packages/ui

const buttonVariants = cva(
  // Base classes — always applied
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

// Component: CVA generates variant classes, cn() merges + allows className override
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';
```

**Merge order rule:** `cn(variantClasses, className)` — variant classes come first, consumer `className` comes last. `tailwind-merge` resolves conflicts in favour of the last item (consumer wins).

### 9.3 Tailwind Class Composition Rules

| Rule                             | Correct                        | Incorrect             |
| -------------------------------- | ------------------------------ | --------------------- |
| Avoid arbitrary values           | `p-4`                          | `p-[16px]`            |
| Use CSS variable tokens          | `bg-primary`                   | `bg-blue-600`         |
| Prefer responsive variants first | `text-sm md:text-base`         | inline style          |
| Never hardcode colors            | `text-destructive`             | `text-red-500`        |
| Use semantic spacing             | `gap-2 px-4`                   | `gap-[8px] px-[16px]` |
| Dark mode via token              | token handles it automatically | `dark:bg-gray-800`    |

**Forbidden:** hardcoded hex, rgb, or named CSS colors in any `packages/ui` class string. All colors must come from CSS custom property tokens (`--primary`, `--destructive`, etc.) mapped to Tailwind config.

### 9.4 `data-[state=*]` Selectors for Radix States

Radix UI primitives expose state via HTML `data-*` attributes. Tailwind targets them with bracket selectors:

```tsx
// Common Radix state selectors
'data-[state=open]:animate-in';
'data-[state=closed]:animate-out';
'data-[state=checked]:bg-primary';
'data-[state=unchecked]:bg-input';
'data-[state=on]:bg-accent';
'data-[state=off]:text-muted-foreground';
'data-[disabled]:opacity-50';
'data-[highlighted]:bg-accent';

// Side-specific positioning (for Tooltip, Popover, Select)
'data-[side=top]:slide-in-from-bottom-2';
'data-[side=bottom]:slide-in-from-top-2';
'data-[side=left]:slide-in-from-right-2';
'data-[side=right]:slide-in-from-left-2';
```

These selectors are how Radix-based components express interactive states entirely via Tailwind — no CSS-in-JS, no style props.

### 9.5 Animation Utility Pattern

Use `tailwindcss-animate` (already in the design system) for enter/exit animations:

```tsx
// Overlay / Dialog / Sheet
'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95';
'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95';

// Sliding panels (side position aware)
'data-[state=open]:animate-in data-[state=closed]:animate-out';
'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]';
'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]';
```

---

## 10. Radix Primitive Patterns

> [!IMPORTANT]
> All `packages/ui` components that need accessibility (dialogs, dropdowns, tooltips, menus, checkboxes, radios, selects) MUST be built on Radix UI primitives. Custom reimplementations of these patterns are not allowed.

### 10.1 When to Use Each Radix Primitive

| Component Need         | Radix Primitive Package           |
| ---------------------- | --------------------------------- |
| Dialog / Modal         | `@radix-ui/react-dialog`          |
| Dropdown Menu          | `@radix-ui/react-dropdown-menu`   |
| Context Menu           | `@radix-ui/react-context-menu`    |
| Select / Combobox      | `@radix-ui/react-select`          |
| Tooltip                | `@radix-ui/react-tooltip`         |
| Popover                | `@radix-ui/react-popover`         |
| Checkbox               | `@radix-ui/react-checkbox`        |
| Radio Group            | `@radix-ui/react-radio-group`     |
| Switch                 | `@radix-ui/react-switch`          |
| Tabs                   | `@radix-ui/react-tabs`            |
| Accordion              | `@radix-ui/react-accordion`       |
| Toast / Notification   | `@radix-ui/react-toast`           |
| Navigation Menu        | `@radix-ui/react-navigation-menu` |
| Slider                 | `@radix-ui/react-slider`          |
| Progress               | `@radix-ui/react-progress`        |
| Scroll Area            | `@radix-ui/react-scroll-area`     |
| Separator              | `@radix-ui/react-separator`       |
| Avatar                 | `@radix-ui/react-avatar`          |
| Label                  | `@radix-ui/react-label`           |
| Slot (asChild utility) | `@radix-ui/react-slot`            |

> **MCP tip (Phase 04 SPEC step):** Use `context7 MCP` to look up the exact API for any Radix primitive:
> `resolve-library-id "@radix-ui/react-dialog"` → then `get-library-docs` to read props and examples.

### 10.2 `asChild` Pattern

`asChild` allows a component to render its props onto a child element instead of its own DOM element. Use for polymorphic components where the root element must be controlled by the consumer.

```tsx
import { Slot } from '@radix-ui/react-slot'

// With asChild={false} (default): renders <button>
<Button>Click me</Button>

// With asChild={true}: renders <a> with all button styles + props
<Button asChild>
  <a href="/dashboard">Go to Dashboard</a>
</Button>

// Implementation pattern:
const Comp = asChild ? Slot : 'button'
return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
```

**Rules:**

- Only expose `asChild` if consumers legitimately need to change the root element (links, custom elements)
- Do NOT use `asChild` for layout composition — use children or explicit slot props instead
- `Slot` merges refs, event handlers, and className correctly — do not re-implement this logic

### 10.3 Compound Component Structure

Complex Radix-based components must follow the compound component pattern with a **Root + sub-components** structure. Naming convention:

```
ComponentName           ← Root (main export, wraps Radix root)
ComponentNameTrigger    ← Trigger element
ComponentNameContent    ← Content panel / popover / overlay
ComponentNameHeader     ← Header section (if applicable)
ComponentNameFooter     ← Footer section (if applicable)
ComponentNameTitle      ← Title text
ComponentNameDescription← Description text
ComponentNameClose      ← Close button
ComponentNameItem       ← Repeating item (menus, lists)
ComponentNameSeparator  ← Divider
```

**Example — Dialog:**

```tsx
// packages/ui/src/Dialog/Dialog.tsx
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '../../utils/cn'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
        'grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg',
        'duration-200',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
        'sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogTitle = React.forwardRef<...>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

// Export all sub-components from index.ts
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
}
```

### 10.4 Controlled vs Uncontrolled

Radix primitives are **uncontrolled by default** (internal state). Expose controlled variants when consuming apps need to drive state externally.

| Scenario                                     | Pattern                                           |
| -------------------------------------------- | ------------------------------------------------- |
| Simple usage (open/close managed internally) | Uncontrolled — use Radix default                  |
| App needs to open programmatically           | Controlled — expose `open` + `onOpenChange`       |
| App needs to read state for analytics        | Controlled — expose `onOpenChange` callback       |
| Form integration (Checkbox, Switch)          | Controlled — expose `checked` + `onCheckedChange` |

```tsx
// Always forward both controlled and uncontrolled props from Radix
// Radix handles the internal/controlled distinction automatically
<DialogPrimitive.Root
  open={open}           // optional — if provided, controlled
  onOpenChange={onOpenChange} // optional — if provided, controlled
  defaultOpen={defaultOpen}   // optional — uncontrolled initial state
>
```

### 10.5 `forwardRef` + `displayName` (mandatory)

Every `packages/ui` component that wraps a DOM element or Radix primitive MUST use `forwardRef` and set `displayName`:

```tsx
const ComponentName = React.forwardRef<
  React.ElementRef<typeof RadixPrimitive.Sub>, // ← ref type from Radix
  React.ComponentPropsWithoutRef<typeof RadixPrimitive.Sub> // ← props spread
>(({ className, ...props }, ref) => (
  <RadixPrimitive.Sub ref={ref} className={cn('...base classes...', className)} {...props} />
));
ComponentName.displayName = RadixPrimitive.Sub.displayName;
// or:
ComponentName.displayName = 'ComponentName';
```

> [!NOTE]
> **React 19 projects** can accept `ref` as a regular prop without `forwardRef`. Check the project's React version in `package.json`. The `vercel-composition-patterns` skill documents this under `react19-no-forwardref`.

### 10.6 Portal Strategy

Use Radix's built-in `Portal` sub-component for content that must escape DOM stacking contexts (dropdowns, tooltips, modals). **Do NOT use `ReactDOM.createPortal` directly** — Radix Portal is more robust and handles SSR correctly.

```tsx
// Correct — use the Radix Portal included with each primitive
import * as DialogPrimitive from '@radix-ui/react-dialog'

const DialogContent = (...) => (
  <DialogPrimitive.Portal>   {/* ← Radix Portal handles DOM escape */}
    <DialogPrimitive.Overlay>...</DialogPrimitive.Overlay>
    <DialogPrimitive.Content>...</DialogPrimitive.Content>
  </DialogPrimitive.Portal>
)
```

When to NOT use Portal: tooltips that must scroll with inline content (set `forceMount` and manage visibility via CSS instead).

### 10.7 Peer Dependency Declaration

Radix packages consumed by `packages/ui` must be declared as **direct dependencies** in `packages/ui/package.json` (not peer deps). Apps consume `@repo/ui` — they should not need to install Radix packages themselves.

```json
// packages/ui/package.json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "tailwind-merge": "^2.0.0",
    "clsx": "^2.0.0"
  },
  "peerDependencies": {
    "react": "^18 || ^19",
    "react-dom": "^18 || ^19"
  }
}
```

> **shadcn MCP tip (Phase 04 BUILD):** Use `shadcn MCP` to scaffold an initial component and inspect its Radix + Tailwind implementation as a baseline. Then normalize the output to `packages/ui` conventions (CVA, cn, forwardRef, displayName, no hardcoded styles).

### 10.8 a11y Non-Negotiables for Radix Components

Radix handles most a11y automatically (ARIA roles, keyboard nav, focus trap). Your responsibility:

```txt
✅ Always include DialogTitle + DialogDescription (even if visually hidden via sr-only)
   — Radix warns if Title is missing: accessibility regression
✅ Never suppress Radix's default keyboard behavior (Esc to close, Arrow nav in menus)
✅ Always set a visible focus ring — use focus-visible:ring-2 focus-visible:ring-ring
✅ Test with keyboard-only navigation after every component build
✅ Run Storybook a11y addon (axe-core) before marking component DONE
```

---

## 11. Scaffolding New Components (Workflow Reference)

When building a new Batch 4 component, use this sequence of tools:

### Step 1 — Look up the Radix primitive API

```
context7 MCP:
  resolve-library-id "@radix-ui/react-<primitive>"
  get-library-docs <id> --topic "props API"
```

### Step 2 — Get a11y checklist

```
$design-system skill:
  Read SKILL.md → Core Principle §6 (Accessibility — Non-Negotiable)
  Read COMPONENTS.md → Component Rules + JSDoc Standards sections
  → Extract keyboard bindings, ARIA attributes, focus-visible ring requirements
     and incorporate them into the spec's Accessibility section
```

### Step 3 — Scaffold baseline from shadcn

```
shadcn MCP:
  search for <component-name>
  → copy implementation as baseline
  → normalize to packages/ui conventions (Section 9 + 10)
```

### Step 4 — Write spec, stories, implement

Follow SDD lifecycle in [04-build-shared-components.md](./04-build-shared-components.md).

### Step 5 — Verify visual parity after app migration

```
playwright MCP (Phase 05):
  screenshot <smoke-route> before migration
  screenshot <smoke-route> after migration
  → compare, document any visual delta
```

---

## 12. Data Component Patterns (TanStack Table)

> [!IMPORTANT]
> All complex data components (`DataTable`, `DataGrid`) MUST use **TanStack Table v8** (headless) for logic and `@repo/ui` primitives for rendering.

### 12.1 Headless vs UI Separation

| Component       | Responsibility    | Implementation                                         |
| --------------- | ----------------- | ------------------------------------------------------ |
| **`Table`**     | Pure UI (Visuals) | `<table>`, `tr`, `td` with Tailwind classes. No logic. |
| **`DataTable`** | Logic (Headless)  | Composes `Table` + `useReactTable` hook.               |

### 12.2 Implementation Rules

1.  **Install:** `pnpm add @tanstack/react-table` (in `packages/ui`).
2.  **Structure:**

    ```tsx
    // packages/ui/src/DataTable/DataTable.tsx
    import { useReactTable, flexRender, getCoreRowModel } from '@tanstack/react-table';

    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../Table';

    export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
      const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

      return (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>{/* render headers */}</TableRow>
              ))}
            </TableHeader>
            <TableBody>{/* render rows */}</TableBody>
          </Table>
        </div>
      );
    }
    ```

3.  **Features:** Support generic types `<TData, TValue>` to allow fully typed columns from apps.
4.  **Pagination:** Expose pagination state/controls via props if controlled, or internal state if uncontrolled.

---

## 13. Date Component Patterns (react-day-picker)

> [!IMPORTANT]
> All date selection components (`Calendar`, `DatePicker`, `DateRangePicker`) MUST use **react-day-picker** for calendar logic.

### 13.1 Composition Pattern

| Component             | Role      | Implementation                                                      |
| --------------------- | --------- | ------------------------------------------------------------------- |
| **`Calendar`**        | Base      | Wraps `react-day-picker` with Tailwind styling (shadcn-compatible). |
| **`DatePicker`**      | Composite | `Popover` + `Calendar` (mode="single") + `Input` for display.       |
| **`DateRangePicker`** | Composite | `Popover` + `Calendar` (mode="range") + `Input` for display.        |

### 13.2 Implementation Rules

1.  **Install:** `pnpm add react-day-picker date-fns` (in `packages/ui`).
2.  **Formatting:** Always use `date-fns` for date manipulation and formatting strings.
3.  **Styling:** Override `classNames` prop of `DayPicker` to use `@repo/ui` standard button styles:
    ```tsx
    <DayPicker
      classNames={{
        day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        // ...full shadcn-ui class map
      }}
    />
    ```
4.  **Localization:** Accept `locale` prop but default to `en-US` (from `date-fns/locale`).

---

_Related: [01-app-audit.md](./01-app-audit.md) · [02-design-system-foundation.md](./02-design-system-foundation.md) · [04-build-shared-components.md](./04-build-shared-components.md) · [05-app-migration.md](./05-app-migration.md)_
