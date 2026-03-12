# Table Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Data Display` |
| Component Tier | `Tier 1 (Primitive)` |
| Structure Tier | `Standard` |
| Based on | `Box` + semantic table elements |

---

## Overview

`Table` is the shared structural primitive for semantic tabular markup in `@repo/ui`. It provides styled wrappers for the native table element plus the standard sections and cell types so later shared work, especially `DataTable`, can compose on one canonical baseline without bringing sorting, filtering, pagination, or domain-specific rendering logic into the primitive itself.

The shared contract is intentionally narrow. It owns the semantic table skeleton, default borders, caption treatment, selected-row styling hooks, and tokenized cell spacing. Consumers still own overflow containers, density tweaks, row actions, empty-state copy, loading states, and all data orchestration.

**When to use:**

- Build semantic tables where the parent already owns the rows, cells, and any higher-order logic.
- Use it as the visual foundation for a future headless data component such as `DataTable`.
- Compose responsive overflow, dense spacing, empty states, and selected rows through `Box`, `className`, and standard table attributes.

**When NOT to use:**

- Do not put sorting, filtering, pagination state, loading logic, or row selection orchestration into `Table`; that belongs to `DataTable` or app-local shells.
- Do not use `Table` for card grids, key-value summaries, or mobile-only stacked list layouts that are not semantically tabular.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive | `Box` with semantic `as="table"`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`, `caption` | Satisfies the Box-only DOM policy while preserving correct native table semantics. |
| CVA strategy | Slot-based internal styles | Keeps the public API flat while giving every structural part a stable tokenized baseline. |
| Controlled vs uncontrolled | n/a | `Table` is structural and stateless. |
| Portal | no | Tables remain in normal document flow. |
| Sub-components | `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption` | Compound structure is the cleanest way to avoid boolean prop sprawl and to preserve semantic HTML. |
| Responsive behavior | consumer-owned wrapper | Different apps need different overflow and sticky-column policies, so the shared primitive does not add a `responsive` prop. |
| Density behavior | consumer-owned via `className` | Baselines show denser admin tables, but the contract does not justify a public `size` or `dense` prop on the primitive. |
| DataTable foundation | explicit | The primitive aligns its slots and selected-row hook with the planned `DataTable` layer without taking on headless logic early. |
| Box-only DOM rule | explicit | All authored DOM in the implementation and stories must render through `Box`. |

---

## Props Interface

### Root component

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | `undefined` | No | Consumer override merged last through `cn()`. |
| `children` | `React.ReactNode` | `undefined` | No | Table caption, sections, and rows. |
| `...props` | `React.HTMLAttributes<HTMLTableElement>` | - | No | Native table attributes such as `aria-label`, `id`, `role`, and `data-*`. |

### Sub-components

| Component | Props type | Purpose |
| --- | --- | --- |
| `TableHeader` | `React.HTMLAttributes<HTMLTableSectionElement>` | Wraps semantic header rows. |
| `TableBody` | `React.HTMLAttributes<HTMLTableSectionElement>` | Wraps semantic data rows. |
| `TableFooter` | `React.HTMLAttributes<HTMLTableSectionElement>` | Wraps totals or summary rows. |
| `TableRow` | `React.HTMLAttributes<HTMLTableRowElement>` | Shared row primitive; supports `data-state="selected"` for visual emphasis. |
| `TableHead` | `React.ThHTMLAttributes<HTMLTableCellElement>` | Header cell primitive; consumers own `scope` and alignment. |
| `TableCell` | `React.TdHTMLAttributes<HTMLTableCellElement>` | Body/footer cell primitive; consumers own `colSpan`, alignment, and custom density. |
| `TableCaption` | `React.HTMLAttributes<HTMLTableCaptionElement>` | Caption for contextual or assistive summary copy. |

---

## Variants

`Table` deliberately has no public `variant` or `size` props. The shared primitive is structural, and repeated visual needs from the app baselines are handled through composition.

| Composition path | Description | When to use |
| --- | --- | --- |
| Default | Shared tokenized table shell with standard cell spacing | General list and reporting tables |
| Dense | Consumer-supplied smaller paddings and type scale via `className` on cells and headers | Denser admin and report surfaces |
| Responsive | Consumer-owned overflow wrapper around `Table` | Narrow viewports or wide column sets |
| Horizontal scroll | Consumer-owned `overflow-x-auto` wrapper around a wide table | Wide reporting tables or many-column admin views |
| Vertical scroll | Consumer-owned fixed-height `overflow-y-auto` viewport | Long activity/history tables where rows must scroll within a panel |
| Selected row | `data-state="selected"` on `TableRow` | Highlighted rows in future `DataTable` or app-local selection flows |

---

## States

| State | Visual behavior | Accessibility |
| --- | --- | --- |
| Default | Tokenized borders, header text treatment, body row hover, and caption styling | Preserves native table semantics with no extra ARIA required by default |
| Dense composition | Smaller cell spacing and text size through `className` overrides | Semantic structure is unchanged |
| Empty composition | A single full-width body cell with centered muted copy | Uses a normal table row and `colSpan` rather than custom empty wrappers |
| Selected row | `data-state="selected"` keeps the active row highlighted without new props | Visual-only hook; selection semantics remain consumer-owned |
| Responsive composition | Horizontal overflow is handled by a parent wrapper, not by the table itself | Maintains a real `<table>` for assistive technologies |

---

## Accessibility

### Semantic requirements

| Element | Requirement | Notes |
| --- | --- | --- |
| `Table` | Native `<table>` semantics | Prefer a visible caption or an `aria-label` when context is not obvious nearby. |
| `TableHead` | Use `scope="col"` or `scope="row"` when appropriate | Consumers control the exact scope because the primitive cannot infer column vs row headers. |
| `TableCaption` | Use for short summary or context copy when helpful | Especially useful for dense reporting tables. |
| Empty state | Keep empty content inside a semantic body row and cell | Avoid replacing the table with non-tabular fallback markup. |

### Keyboard and focus behavior

- `Table` itself is non-interactive and does not introduce tab stops.
- Interactive elements placed inside cells, such as buttons or links, remain consumer-owned and follow their own keyboard semantics.
- The primitive does not trap, move, or manage focus.

### Screen reader notes

- Use `TableCaption` or an `aria-label` so screen readers announce what the table represents.
- Keep header cells semantic through `TableHead` and the correct `scope` usage.
- Selected-row styling via `data-state` is visual only; any announced selection model stays in consuming logic.

---

## Box-only DOM Policy

- All authored DOM in `Table` implementation and stories must render through `Box`.
- Semantic table output must use `Box as="table"`, `Box as="thead"`, `Box as="tbody"`, `Box as="tfoot"`, `Box as="tr"`, `Box as="th"`, `Box as="td"`, and `Box as="caption"` instead of direct native JSX tags.
- Responsive overflow wrappers in stories must also use `Box`, not native container tags.

---

## Usage Examples

### 1. Basic structural table

```tsx
<Box className="overflow-hidden rounded-lg border border-border">
  <Table aria-label="Recent invoices">
    <TableHeader>
      <TableRow>
        <TableHead scope="col">Invoice</TableHead>
        <TableHead scope="col">Status</TableHead>
        <TableHead scope="col" className="text-right">
          Amount
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>{/* consumer-owned rows */}</TableBody>
  </Table>
</Box>
```

### 2. Dense composition

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="h-9 px-3 text-xs uppercase tracking-wide">Policy</TableHead>
      <TableHead className="h-9 px-3 text-xs uppercase tracking-wide">Premium</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="px-3 py-2 text-xs">FS-102938</TableCell>
      <TableCell className="px-3 py-2 text-xs text-right">RM 420.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### 3. Empty-state composition

```tsx
<Table>
  <TableHeader>{/* column headers */}</TableHeader>
  <TableBody>
    <TableRow>
      <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
        No matching records were found.
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### 4. Horizontal scroll composition

```tsx
<Box className="overflow-x-auto rounded-lg border border-border">
  <Table className="min-w-[44rem]">{/* rows */}</Table>
</Box>
```

### 5. Vertical scroll composition

```tsx
<Box className="max-h-72 overflow-y-auto rounded-lg border border-border">
  <Table>{/* long row set */}</Table>
</Box>
```

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Keep `Table` structural and semantic. | Add sorting, filtering, pagination, or fetch logic to the primitive. |
| Use `TableHead`, `TableCell`, and the correct `scope` values for accessible tabular markup. | Replace headers with plain styled body cells or non-semantic wrappers. |
| Compose dense and responsive treatments through `className` and `Box` wrappers. | Add public `dense`, `compact`, or `responsive` booleans without an approved contract amendment. |
| Use `data-state="selected"` on rows when a higher-level surface owns selection state. | Encode selected-row business logic inside the shared primitive. |
| Keep empty states inside semantic rows and cells. | Swap the entire table out for non-tabular fallback markup. |
| Keep authored JSX Box-only. | Hand-write native `table`, `thead`, `tbody`, `tr`, `th`, `td`, or `caption` tags in shared source or stories. |

---

## Storybook Stories Required

**Story file title:** `Data Display/Table`

- [x] `Basic`
- [x] `FooterSummary`
- [x] `RowHeader`
- [x] `WithCheckboxCells`
- [x] `SelectedRow`
- [x] `Dense`
- [x] `Empty`
- [x] `HorizontalScrollable`
- [x] `VerticalScrollable`

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-10 | Initial Table spec |
| 2026-03-10 | Expanded Storybook coverage for footer, row-header, checkbox-cell, and selected-row cases |
