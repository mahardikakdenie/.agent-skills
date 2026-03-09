# 04 — Build Shared Components (packages/ui)

> **Batch:** Batches 4-5 - Build Shared Components
> **Branch:** `feat/ui` — all packages/ui development happens exclusively here
> **Run count:** Iteratively per batch (Batch 3 → Batch 4)
> **Prerequisite:** Phase 03 master plan and batch structure complete
> **Input gate:** Before choosing what to build next, always read `packages/ui/docs/normalization/_output/11-master-component-roadmap.md` — it is the authoritative queue for which component is next, its tier, priority, consumer apps, and SDD requirements
> **Prev:** [03-migration-plan.md](./03-migration-plan.md) · **Next:** [05-app-migration.md](./05-app-migration.md)

---

## Purpose

Implement all new and extended components in `packages/ui` following the Spec-Driven Development (SDD) lifecycle. Every component that enters `packages/ui` must pass: **spec review → Storybook → implementation → verification gate → export**.

> **Batch scope:** Batch 1 and Batch 2 require no `packages/ui` changes (those are app-side work only). This phase handles Batch 3 (extend existing) and Batch 4 (new components).

---

## SDD Lifecycle (mandatory per component)

```
┌──────────────────────────────────────────────────────────┐
│  SPEC-DRIVEN DEVELOPMENT LIFECYCLE                       │
├───────┬──────────────────────────────────────────────────┤
│ SPEC  │ Write ComponentName.spec.md                      │
│       │ • TypeScript interface (proposed)                │
│       │ • Variants, sizes, states                        │
│       │ • Accessibility requirements                     │
│       │ • Usage do/don't, app-agnostic checklist        │
│       │ ⛔ No implementation yet                          │
├───────┼──────────────────────────────────────────────────┤
│ STORY │ Write ComponentName.stories.tsx                  │
│       │ • All variants rendered in Storybook             │
│       │ • All states: default, hover, focus, disabled,   │
│       │   loading, error (where applicable)              │
│       │ ⛔ Storybook will error — this is intentional    │
│       │    (RED state confirms spec is driving code)     │
├───────┼──────────────────────────────────────────────────┤
│ BUILD │ Implement ComponentName.tsx                       │
│       │ • Make all stories go GREEN                      │
│       │ • Follow spec exactly — no undocumented changes  │
│       │ • Export from packages/ui/src/index.ts           │
├───────┼──────────────────────────────────────────────────┤
│ GATE  │ Verification gate (see below)                    │
│       │ • All checks must pass before marking DONE       │
└───────┴──────────────────────────────────────────────────┘
```

---

## Component Directory Structure

> **Rule:** Start with the minimum tier that fits. Only add files when complexity genuinely requires it — over-splitting simple components creates noise.

### Tier 1 — Simple (primitives, display-only)

_Examples: `Badge`, `Spinner`, `Separator`, `Avatar`_

```
packages/ui/src/ComponentName/
├── ComponentName.spec.md     # Written spec (source of truth)
├── ComponentName.stories.tsx # All variants + states
├── ComponentName.tsx         # Implementation
└── index.ts                  # Public exports
```

---

### Tier 2 — Standard (interactive, CVA variants, controlled state)

_Examples: `Button`, `Input`, `Select`, `Checkbox`, `Switch`, `Toast`_

```
packages/ui/src/ComponentName/
├── ComponentName.spec.md          # Written spec
├── ComponentName.tsx              # Main implementation
├── ComponentName.types.ts         # Exported TypeScript interfaces & prop types
├── ComponentName.stories.tsx      # All variants + states
└── index.ts                       # Public exports
```

> Add `ComponentName.types.ts` when the prop interface is consumed externally (e.g., adapter wrappers in apps need to import the type). Keeps `ComponentName.tsx` focused on implementation.

---

### Tier 3 — Complex / Compound (sub-components, hooks, internal logic)

_Examples: `DataTable`, `Dialog`, `Combobox`, `DatePicker`, `NavigationMenu`, `Accordion`_

```
packages/ui/src/ComponentName/
├── ComponentName.spec.md              # Written spec (composite spec for all sub-components)
├── ComponentName.types.ts             # All shared interfaces, prop types, enums
├── ComponentName.tsx                  # Root / orchestrator component
├── ComponentName.utils.ts             # Pure helper functions (formatting, sorting, etc.)
├── ComponentName.hooks.ts             # Internal React hooks (state machines, derived state)
├── parts/
│   ├── ComponentNameHeader.tsx        # Named sub-component
│   ├── ComponentNameBody.tsx
│   ├── ComponentNameFooter.tsx
│   └── ... (as needed)
├── ComponentName.stories.tsx          # Top-level stories
├── ComponentName.stories.parts.tsx    # Sub-component / slot stories (optional if long)
└── index.ts                           # Public exports (root + any public sub-components)
```

**When to split into `parts/`:** When you have 2+ named sub-components that consumers compose directly (e.g., `<Dialog.Trigger>`, `<DataTable.Column>`, `<Accordion.Item>`). A single component with internal-only sub-components does NOT need `parts/`.

**When to extract `ComponentName.hooks.ts`:** When internal state logic exceeds ~40 lines or is reusable within the component tree. Examples: `useDataTableState`, `useComboboxSearch`.

**When to extract `ComponentName.utils.ts`:** When there are pure functions (no React) that are independently testable or shared across sub-components.

---

### Index Export Patterns

**Simple/Standard — named exports only:**

```ts
// packages/ui/src/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button.types';
```

**Compound — namespace + named exports (both patterns acceptable):**

```ts
// packages/ui/src/DataTable/index.ts

// Option A: Namespace object (dot-notation usage: <DataTable.Root>, <DataTable.Column>)
export { DataTable } from './DataTable'; // DataTable is a namespace object

// Option B: Flat named exports (tree-shakeable, preferred for Radix-style primitives)
export {
  DataTableRoot,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableCell,
} from './DataTable';
export type { DataTableProps, DataTableColumnDef } from './DataTable.types';
```

> **Prefer Option B (flat named exports)** for new components — better tree-shaking. Only use namespace objects if the component has a strong compositional identity (e.g., a `<Tabs>` family clearly reads as `<Tabs.Root>`, `<Tabs.Trigger>`).

---

### Two-Level Export Architecture

Every component participates in a **two-level re-export chain**. Understanding this prevents confusion when both files look like they're exporting the same things.

```
Consumer:  import { Button, ButtonProps } from '@repo/ui'
                              ↓
packages/ui/src/index.ts     ← Level 2: package public API barrel
  export * from './Button'
                              ↓
packages/ui/src/Button/index.ts  ← Level 1: component module entry point
  export { Button } from './Button'
  export type { ButtonProps } from './Button.types'
```

| Level | File                         | Role                                                                   | Pattern                                         |
| ----- | ---------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------- |
| **1** | `src/ComponentName/index.ts` | Component module boundary — resolves all internal files into one entry | Named `export { ... }` + `export type { ... }`  |
| **2** | `src/index.ts`               | Package public API — one file that is the entire `@repo/ui` surface    | `export * from './ComponentName'` per component |

**Why not `export * from './ComponentName'` everywhere?**

Level 1 (`ComponentName/index.ts`) uses **explicit named exports** (not `export *`) to:

- Separate value exports from type exports (required for `isolatedModules: true`)
- Keep internal implementation files private (e.g., helper utils not in the public API)

Level 2 (`src/index.ts`) uses **`export *`** because Level 1 has already done the filtering — by the time it reaches `src/index.ts`, everything exported from the folder is intentionally public.

**Adding a new component to the barrel (mandatory step per SDD lifecycle):**

```ts
// packages/ui/src/index.ts — append one line per new component
export * from './ComponentName'; // ← that's it; Level 1 handles the rest
```

> [!IMPORTANT]
> Never manually redeclare the named export list in `src/index.ts`. If you find yourself writing `export { Foo, Bar } from './ComponentName'` in the barrel, that is a sign Level 1's `ComponentName/index.ts` is incomplete — fix it there instead.

---

## Deliverables per Phase 04 Run

The required files depend on the component tier:

| File                                       | Simple | Standard |  Complex  |
| ------------------------------------------ | :----: | :------: | :-------: |
| `ComponentName.spec.md`                    |   ✅   |    ✅    |    ✅     |
| `ComponentName.tsx`                        |   ✅   |    ✅    | ✅ (root) |
| `ComponentName.types.ts`                   |   ❌   |    ✅    |    ✅     |
| `ComponentName.utils.ts`                   |   ❌   |    ❌    | if needed |
| `ComponentName.hooks.ts`                   |   ❌   |    ❌    | if needed |
| `parts/ComponentNameXxx.tsx`               |   ❌   |    ❌    | if needed |
| `ComponentName.stories.tsx`                |   ✅   |    ✅    |    ✅     |
| `ComponentName.stories.parts.tsx`          |   ❌   |    ❌    | if needed |
| `index.ts`                                 |   ✅   |    ✅    |    ✅     |
| `packages/ui/src/index.ts` (barrel)        |   ✅   |    ✅    |    ✅     |
| `20-foundation-change-log.md` (append)     |   ✅   |    ✅    |    ✅     |
| `21-adapter-mapping.md` (append if needed) |   ✅   |    ✅    |    ✅     |

---

## Turborepo Pipeline (packages/ui builds)

> For the 28-app workspace, always use Turborepo filtering to avoid rebuilding ALL apps when `packages/ui` changes.

```bash
# Build @repo/ui only
pnpm turbo run build --filter=@repo/ui

# Build @repo/ui + all apps that consume it (validates no type regressions)
pnpm turbo run build --filter=...@repo/ui

# Build only changed packages + their dependents (CI-recommended)
pnpm turbo run build --affected

# Run typecheck on @repo/ui alone (fast — use during development)
pnpm turbo run check-types --filter=@repo/ui
```

**Pipeline dependency:** Apps declare `@repo/ui` as a workspace dependency → Turborepo's `dependsOn: ["^build"]` automatically ensures `@repo/ui` builds before any consuming app. No manual ordering needed.

**Cache:** `packages/ui` build outputs are cached by Turborepo. An unchanged `@repo/ui` will restore from cache — zero rebuild cost for apps triggered by unrelated changes.

---

## Batch Prompt (Batch 3 — Extend Existing)

Replace `<COMPONENT_NAME>` before running.

```md
You are a Principal Frontend Engineer on branch `feat/ui`.

## Objective

Extend the existing `<COMPONENT_NAME>` in packages/ui to add:
[list specific variants/props needed, from 11-master-component-roadmap.md]

## Inputs (read first)

- `packages/ui/src/<COMPONENT_NAME>/<COMPONENT_NAME>.tsx` (current implementation)
- `packages/ui/docs/normalization/_output/02-api-conventions.md` (canonical API)
- `packages/ui/docs/normalization/_output/11-master-component-roadmap.md` (<COMPONENT_NAME> entry)

## App-Agnostic Rules (NON-NEGOTIABLE)

- No Next.js imports (`next/image`, `next/link`, `next/router`)
- No business logic, API calls, domain types
- No hardcoded app strings or env vars (`NEXT_PUBLIC_*`)
- All new props must follow 02-api-conventions.md naming
- All new variants must use CVA pattern

## SDD Steps

1. Update `<COMPONENT_NAME>.spec.md` — document new variants/props
2. Add stories to `<COMPONENT_NAME>.stories.tsx` for new cases (RED state OK)
3. Implement changes in `<COMPONENT_NAME>.tsx` (make Storybook GREEN)
4. Update `index.ts` exports if new types added

## Verification Gate (ALL must pass)

- `pnpm --filter @repo/ui check-types` passes
- `pnpm --filter @repo/ui lint` passes
- `pnpm --filter @repo/ui build` passes
- Storybook renders new stories without errors

## App-Agnostic Checklist

- [ ] No Next.js imports
- [ ] No app-specific packages
- [ ] No hardcoded strings (all via props)
- [ ] No fetch/axios/useQuery/useMutation
- [ ] No auth or permission logic
- [ ] No process.env.NEXT*PUBLIC*\*
- [ ] TypeScript props exported from index.ts
- [ ] Storybook covers all new variants/states
- [ ] Storybook story `title` follows `'<Group>/<ComponentName>'` taxonomy ([§6.4](./06-component-standards.md#64-storybook-category-taxonomy))
- [ ] Keyboard nav works
- [ ] ARIA attributes present
```

---

## Batch Prompt (Batch 4 — New Component)

Replace `<COMPONENT_NAME>` before running.

```md
You are a Principal Frontend Engineer on branch `feat/ui`.

## Objective

Build a new shared component `<COMPONENT_NAME>` for packages/ui.

## Inputs (read first)

- `packages/ui/docs/normalization/_output/02-api-conventions.md`
- `packages/ui/docs/normalization/_output/03-token-theming-contract.md`
- `packages/ui/docs/normalization/_output/11-master-component-roadmap.md` (<COMPONENT_NAME> entry)
- Per-app `_spec-input.md` files (in per-app audit `_output/` folder)

## Step 1 — Write Spec (`<COMPONENT_NAME>.spec.md`)

Document BEFORE writing any code. Every section below is mandatory unless marked _(if applicable)_.

```

# <ComponentName> Spec

## Metadata

| Field | Value |
| ----- | ----- |
| **Storybook Group** | `Buttons` \| `Inputs` \| `Overlays` \| `Feedback` \| `Navigation` \| `Data Display` \| `Layout` \| `Misc` |
| **Tier** | 1 — Primitive \| 2 — Composite \| 3 — App-local |
| **Based on** | `@radix-ui/react-<primitive>` \| custom composition \| none |
| **Status** | Draft \| Spec Review \| Approved |

---

## Overview

[1–2 paragraphs: what this component does, what design pattern it follows (e.g. controlled input, Radix-based overlay, compound table), and where it fits in the system.]

**When to use:**
- [Bullet: specific scenario 1]
- [Bullet: specific scenario 2]

**When NOT to use:**
- [Bullet: use X instead when Y]
- [Bullet: keep app-local when Z]

---

## Design Decisions

| Decision | Choice | Rationale |
| -------- | ------ | --------- |
| Primitive | `@radix-ui/react-X` / none | [why] |
| CVA strategy | flat \| compound \| slot-based | [why] |
| Controlled vs uncontrolled | both \| controlled-only | [why] |
| Portal | yes (for overlays) \| no | [why] |
| Sub-components | yes — see §Compound Sub-components \| no | [why] |

> **DataTable rule:** MUST use `@tanstack/react-table` v8 if component has sorting/filtering.
> **Date rule:** MUST use `react-day-picker` + `date-fns` for Calendar / DatePicker.

---

## Props Interface

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'ghost'` | `'default'` | No | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Size of the component |
| `disabled` | `boolean` | `false` | No | Disables interaction; sets `aria-disabled` |
| `loading` | `boolean` | `false` | No | Shows spinner; blocks interaction |
| `className` | `string` | `undefined` | No | Merged via `cn()` — applied last |
| `asChild` | `boolean` | `false` | No | Renders as child element (Radix `Slot`) |
| *(add all relevant props)* | | | | |

### Complex Prop Shapes _(if applicable)_

\`\`\`ts
// e.g. for column definitions, menu items, etc.
interface <ComponentName>Item {
  id: string;
  label: string;
  // ...
}
\`\`\`

---

## Variants

| Variant | Description | When to use |
| ------- | ----------- | ----------- |
| `default` | [visual description] | Primary usage |
| `destructive` | [visual description] | Dangerous or irreversible actions |
| `outline` | [visual description] | Secondary, de-emphasized |
| `ghost` | [visual description] | Minimal chrome, icon-centric |

### Size Scale

| Size | Height | Font | Padding | Use case |
| ---- | ------ | ---- | ------- | -------- |
| `sm` | 32px | 12px | px-3 | Dense UI, inline actions |
| `md` | 40px | 14px | px-4 | Default |
| `lg` | 48px | 16px | px-6 | Hero CTAs, form submits |

---

## States

| State | Visual Behavior | Accessibility |
| ----- | --------------- | ------------- |
| Default | [describe normal appearance] | `role="..."` |
| Hover | [describe hover style] | — |
| Focus | `focus-visible:ring-2 ring-ring ring-offset-2` | Visible focus ring; keyboard navigable |
| Active / Pressed | [describe active/clicked style] | `aria-pressed` if toggle |
| Disabled | Muted opacity; cursor `not-allowed` | `aria-disabled="true"`; no pointer events |
| Loading | Spinner visible; click blocked | `aria-busy="true"`; label still present |
| Error | Destructive color; icon + message | `aria-invalid="true"`; `aria-errormessage` linked |
| Empty _(if applicable)_ | Empty state illustration / copy | `aria-label` describing empty state |

---

## Compound Sub-components _(if applicable)_

| Sub-component | Purpose | Key props |
| ------------- | ------- | --------- |
| `<ComponentName>.Root` | Wraps and provides context | `open`, `onOpenChange` |
| `<ComponentName>.Trigger` | Activates the component | inherits HTMLButtonElement |
| `<ComponentName>.Content` | Main content area | `align`, `side` |
| *(list all)* | | |

---

## Accessibility

### ARIA Roles & Attributes

| Element | Role / Attribute | Value |
| ------- | ---------------- | ----- |
| Root | `role` | `"dialog"` / `"listbox"` / _(as appropriate)_ |
| Label | `aria-label` / `aria-labelledby` | Must be present |
| Error message | `aria-errormessage` | ID of error element |
| Busy state | `aria-busy` | `"true"` when loading |

### Keyboard Map

| Key | Behavior |
| --- | -------- |
| `Tab` | Move focus to next focusable element |
| `Shift+Tab` | Move focus to previous |
| `Enter` / `Space` | Activate / confirm |
| `Escape` | Close overlay / cancel |
| `Arrow Up/Down` | Navigate list items (for listbox/menu) |
| `Home` / `End` | Jump to first / last item |

### Focus Management

- [Describe where focus goes on open, close, after action]
- [Describe focus trap behavior if any]

### Screen Reader Notes

- [Describe what is announced on state change]
- [Describe any live region usage]

---

## Usage Examples

### 1. Basic usage
\`\`\`tsx
<ComponentName variant="default" size="md">
  Label
</ComponentName>
\`\`\`

### 2. With icon / slot
\`\`\`tsx
<ComponentName variant="outline" size="sm" icon={<PlusIcon />}>
  Add item
</ComponentName>
\`\`\`

### 3. Loading state
\`\`\`tsx
<ComponentName loading>Saving...</ComponentName>
\`\`\`

### 4. Composed / real-world usage _(show it inside a realistic parent)_
\`\`\`tsx
<form onSubmit={handleSubmit}>
  <ComponentName type="submit" loading={isPending}>
    Save changes
  </ComponentName>
</form>
\`\`\`

---

## Do / Don't

| ✅ Do | ❌ Don't |
| ----- | -------- |
| Use `variant="destructive"` for delete actions | Use red-colored custom buttons for delete |
| Use `loading` prop when an action is in-flight | Disable the button and show a separate spinner |
| Use `asChild` to render as `<a>` for link-buttons | Wrap in `<button>` inside `<a>` |
| Export prop types from `index.ts` | Keep prop types internal only |
| Use CSS variable tokens for all colors | Use hardcoded hex or Tailwind color names |
| *(add 3–5 more rows specific to this component)* | |

---

## Storybook Stories Required

**Story file title:** `'<Group>/<ComponentName>'` — see [§6.4 taxonomy](./06-component-standards.md#64-storybook-category-taxonomy)

### Mandatory (all components)

- [ ] `Default` — baseline happy path; all props at defaults; controls panel wired
- [ ] `AllVariants` — all `variant` values rendered side-by-side in one frame
- [ ] `AllSizes` — all `size` values rendered side-by-side
- [ ] `Interactive` — `play()` function: focuses component, performs action, asserts output
- [ ] `DisabledState` — disabled appearance + confirm `aria-disabled` in DOM
- [ ] `ResponsiveLayout` — rendered at 320 px and 1440 px viewport widths

### Conditional (add when component supports it)

- [ ] `LoadingState` — spinner visible, interaction blocked, `aria-busy` confirmed
- [ ] `ErrorState` — error styling, error message prop shown, `aria-invalid` confirmed
- [ ] `EmptyState` — zero-data / no-content variant _(for data display components)_
- [ ] `WithSlots` — all optional slot props populated (icon, prefix, suffix, footer, header)
- [ ] `ControlledMode` — controlled `value` + `onChange` demonstrated _(for inputs)_
- [ ] `LongContentEdgeCase` — text overflow / wrapping edge case
- [ ] `RTLSupport` — `dir="rtl"` applied _(if directional layout)_
- [ ] `DarkMode` — rendered inside dark-theme decorator _(if tokens support dark mode)_
- [ ] `ComposedUsage` — component used inside realistic parent (e.g. Button in a Form; Dialog with a Table inside)

### Advanced (compound / complex components only)

- [ ] `SubcomponentsShowcase` — each named sub-component rendered independently
- [ ] `KeyboardNavigation` — `play()` drives full keyboard flow (Tab, Arrow keys, Enter, Esc)
- [ ] `WithRealData` — representative realistic data exported from `.stories.parts.tsx` (no Lorem ipsum)

---

## Open Questions

- [ ] [Question 1 — what needs to be resolved before implementation]
- [ ] [Question 2]

---

## Changelog

| Date | Author | Change |
| ---- | ------ | ------ |
| YYYY-MM-DD | [name] | Initial spec |

```

## Step 2 — Write Storybook Stories (`<COMPONENT_NAME>.stories.tsx`)

Cover every story listed in the spec. Storybook will error until Step 3 — this is intentional (RED state confirms spec is driving implementation).

### Story Quality Rules (mandatory)

**1. Meta object — controls must work**
Every prop listed in the spec's Props Interface must be wired to `argTypes` so the Storybook controls panel works without `any` types:
\`\`\`tsx
const meta: Meta<typeof ComponentName> = {
  title: '<Group>/ComponentName',      // §6.4 taxonomy
  component: ComponentName,
  tags: ['autodocs'],
  args: {
    variant: 'default',                // always provide a baseline
    size: 'md',
    disabled: false,
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'destructive', 'outline', 'ghost'] },
    size:    { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    onClick:  { action: 'clicked' },   // wire event handlers to actions
  },
};
\`\`\`

**2. Each story must have**
- `name` field — human-readable, Sentence case (e.g. `name: 'All variants'`)
- `parameters.docs.description.story` — one-line description of what this story demonstrates
- Own `args` override that are minimal (only what differs from `meta.args`)

**3. `play()` function — required for all interactive stories**
Use `@storybook/test` (`userEvent`, `expect`, `within`) to automate interactions. Do not describe interactions as comments — execute them:
\`\`\`tsx
export const Interactive: Story = {
  name: 'Interactive',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /label/i });
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-pressed', 'true'); // or whatever behavior
  },
};
\`\`\`

**4. Decorators — wrap stories that need context**
If the component requires a Provider (ToastProvider, ThemeProvider, DialogProvider, etc.), add it as a story-level decorator rather than embedding it in the component:
\`\`\`tsx
export const WithToastContext: Story = {
  decorators: [(Story) => <ToastProvider><Story /></ToastProvider>],
};
\`\`\`

**5. Realistic data — export from `.stories.parts.tsx`**
For complex components (tables, lists, menus), put sample data in a companion file so stories stay readable:
\`\`\`tsx
// ComponentName.stories.parts.tsx
export const SAMPLE_USERS = [
  { id: '1', name: 'Andi Pratama', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Budi Santoso', role: 'Viewer', status: 'Inactive' },
];
\`\`\`

**6. Viewport stories**
Use Storybook's `parameters.viewport` for responsive stories:
\`\`\`tsx
export const ResponsiveLayout: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
\`\`\`

> **`$design-system` skill tip:** Before writing stories, read `SKILL.md` → `COMPONENTS.md`
> (Accessibility, JSDoc Standards, and Component Rules sections) for accessibility checklist
> and focus-visible patterns to validate against your spec's Accessibility section.

## Step 3 — Implement (`<COMPONENT_NAME>.tsx`)

> **shadcn MCP tip:** Use `shadcn MCP` to search for `<COMPONENT_NAME>` — if it exists in the registry, use its Radix + Tailwind implementation as a starting baseline, then normalize to `packages/ui` conventions:
> - Replace any raw hex/named colors → CSS variable tokens (`bg-primary`, `text-destructive`)
> - Wrap with `React.forwardRef` + set `displayName`
> - Extract variant logic into CVA
> - `cn()` import: use **`import { cn } from '@repo/helper'`** in both `packages/ui` and app code so the workspace shares a single helper. Do NOT import `clsx` or `tailwind-merge` directly inside component files.
> - Verify no `next/*` imports remain

> **context7 MCP tip:** For any Radix primitive used:
> `resolve-library-id "@radix-ui/react-<primitive>"` → `get-library-docs <id>`
> Read the full prop API before writing the component interface.

> **TanStack Table tip:** If building `DataTable`:
> `pnpm add @tanstack/react-table` (do NOT add `react-table` v7).
> Follow [06-component-standards.md](./06-component-standards.md) Section 12 patterns.

> **Date Component tip:** If building `Calendar` or `DatePicker`:
> `pnpm add react-day-picker date-fns` (standard pair).
> Follow [06-component-standards.md](./06-component-standards.md) Section 13 composition rules.
Make all Storybook stories render without errors.

## Step 4 — Export
Add to `packages/ui/src/<ComponentName>/index.ts` and `packages/ui/src/index.ts`.

## Step 5 — Document
Append to `packages/ui/docs/normalization/_output/20-foundation-change-log.md`.
Add adapter notes if needed to `packages/ui/docs/normalization/_output/21-adapter-mapping.md`.

## App-Agnostic Checklist (mandatory before PR)

### Implementation Standards (per [06-component-standards.md](./06-component-standards.md) Sections 9–10)
- [ ] `cn()` from `@repo/helper` — `import { cn } from '@repo/helper'` (single shared helper; never import `clsx` or `tailwind-merge` directly in component files)
- [ ] Variant logic defined with CVA; `cn(variantClasses, className)` merge order correct
- [ ] Tailwind classes use only CSS variable tokens (no hardcoded hex/rgb/named colors)
- [ ] Radix `data-[state=*]` selectors used for interactive states (no style props for state)
- [ ] `React.forwardRef` used; `displayName` set
- [ ] `asChild` exposed if consumers may need to change root element
- [ ] Radix Portal used (not `ReactDOM.createPortal`) for overlays
- [ ] Radix packages declared as direct deps in `packages/ui/package.json`
- [ ] Complex data components use `@tanstack/react-table` (no custom sorting/filtering logic)
- [ ] Date components use `react-day-picker` (no other date libs)

### App-Agnostic Rules
- [ ] No `next/*` imports (`next/link`, `next/image`, `next/router`, `next/navigation`)
- [ ] No app-specific packages
- [ ] No hardcoded strings (all via props)
- [ ] No `fetch`/`axios`/`useQuery`/`useMutation`
- [ ] No auth checks or permission logic
- [ ] No `process.env.NEXT_PUBLIC_*`
- [ ] TypeScript props interface exported from `index.ts`

### Storybook & a11y Gate
- [ ] Stories cover ALL variants + ALL states (default, hover, focus, disabled, loading, error)
- [ ] Storybook a11y addon (axe-core) shows zero violations on all stories
- [ ] Keyboard-only navigation tested manually (Tab, Enter, Esc, Arrow where applicable)
- [ ] `DialogTitle` / `DialogDescription` present (even if `sr-only`) for dialog-type components
- [ ] Focus ring visible (`focus-visible:ring-2 focus-visible:ring-ring`)

## Verification Gate (ALL must pass before batch item is DONE)
- `pnpm --filter @repo/ui check-types`
- `pnpm --filter @repo/ui lint`
- `pnpm --filter @repo/ui build`
- Storybook: all stories render, no errors
```

---

## Batch Progress Tracking

Update `packages/ui/docs/normalization/_output/13-implementation-batches.md` after each component:

```
| Component | Batch | Spec | Story | Build | Gate | Status |
|---|---|---|---|---|---|---|
| Spinner | 4 | ✅ | ✅ | ✅ | ✅ | DONE |
| Table | 4 | ✅ | ✅ | 🟡 | ⬜ | IN PROGRESS |
| DataTable | 4 | ✅ | ⬜ | ⬜ | ⬜ | SPEC REVIEW |
```

---

_Related: [03-migration-plan.md](./03-migration-plan.md) · [05-app-migration.md](./05-app-migration.md) · [06-component-standards.md](./06-component-standards.md)_
