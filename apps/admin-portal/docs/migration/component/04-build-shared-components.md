# 04 — Build Shared Components (packages/ui)

> **Phase:** Build (Spec-Driven Development)
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

## Phase Prompt (Batch 3 — Extend Existing)

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
- [ ] Keyboard nav works
- [ ] ARIA attributes present
```

---

## Phase Prompt (Batch 4 — New Component)

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

Document BEFORE writing any code:
```

# <ComponentName> Spec

## Overview

[One paragraph: what it does, what pattern it follows, when to use it]

## Design Decisions

- Why [Radix primitive / custom / composition strategy]
- **Data Table Strategy:** MUST use `TanStack Table v8` (headless) if component involves sorting/filtering.
- **Date Strategy:** MUST use `react-day-picker` + `date-fns` for Calendar/DatePicker.
- CVA variant strategy
- [Controlled vs uncontrolled decision]

## Props Interface

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| ...  | ...  | ...     | ...      | ...         |

## Variants

[visual + size variants with descriptions]

## States

- Default | Hover | Focus | Disabled | Loading | Error

## Accessibility

- Role: [aria role]
- Keyboard: [key bindings]
- ARIA: [attributes used]

## Usage Examples

\`\`\`tsx
<ComponentName variant="default" size="md">Content</ComponentName>
\`\`\`

## Do / Don't

| ✅ Do | ❌ Don't |
| ----- | -------- |
| ...   | ...      |

## Storybook Stories Required

- [ ] Default
- [ ] AllVariants
- [ ] AllSizes
- [ ] DisabledState
- [ ] LoadingState (if applicable)
- [ ] ErrorState (if applicable)
- [ ] EdgeCase_LongContent

```

## Step 2 — Write Storybook Stories (`<COMPONENT_NAME>.stories.tsx`)
Cover every story listed in spec. Storybook will error until Step 3. This is intentional.

> **`$design-system` skill tip:** Before writing stories, read `SKILL.md` → `COMPONENTS.md`
> (Accessibility, JSDoc Standards, and Component Rules sections) to incorporate the
> accessibility checklist and focus-visible patterns directly into your spec's Accessibility section.

## Step 3 — Implement (`<COMPONENT_NAME>.tsx`)

> **shadcn MCP tip:** Use `shadcn MCP` to search for `<COMPONENT_NAME>` — if it exists in the registry, use its Radix + Tailwind implementation as a starting baseline, then normalize to `packages/ui` conventions:
> - Replace any raw hex/named colors → CSS variable tokens (`bg-primary`, `text-destructive`)
> - Wrap with `React.forwardRef` + set `displayName`
> - Extract variant logic into CVA
> - `cn()` import: inside `packages/ui` use **`import { cn } from '../../utils/cn'`** (internal). Do NOT import from `@repo/helper` inside the package itself.
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
- [ ] `cn()` from internal `'../../utils/cn'` — `import { cn } from '../../utils/cn'` (never from `@repo/helper` or directly from `tailwind-merge`)
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
