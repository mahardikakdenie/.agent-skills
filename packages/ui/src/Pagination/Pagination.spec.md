# Pagination Spec

## Metadata

| Field           | Value                      |
| --------------- | -------------------------- |
| Storybook Group | `Navigation`               |
| Component Tier  | `Tier 2 (Composite)`       |
| Structure Tier  | `Standard`                 |
| Based on        | `Box` + custom composition |

---

## Overview

`Pagination` is the shared navigation shell for paged lists, tables, and search results. It owns only the UI contract: current page display, first/previous/next/last affordances, numeric page jumps, compact ellipsis handling for large result sets, and an optional page-size selector when the parent surface wants that control.

This component does not fetch data, derive page counts from totals, sync routes, or own table state. App code or higher-level shared data shells stay responsible for translating domain pagination models into the canonical `currentPage`, `totalPages`, and optional `pageSize` props.

**When to use:**

- Use `Pagination` under shared or app-local lists and tables that already know their current page and total page count.
- Use the optional page-size selector when the surrounding surface supports page-size changes through caller-owned state.

**When NOT to use:**

- Do not use `Pagination` as a router-aware breadcrumb or stepper substitute.
- Do not move fetching, filter state, or table orchestration into this component; keep that logic in the parent surface.

---

## Design Decisions

| Decision | Choice | Rationale |
| -------- | ------ | --------- |
| Primitive | `Box` + custom composition + shared `Select` | The shell stays semantic `nav` plus buttons and list items, while the optional rows-per-page control reuses the shipped shared Select surface for a cleaner consistent field treatment. |
| CVA strategy | Slot-based internal variants | The public API stays flat, while the control states still use shared CVA-backed styling. |
| Controlled vs uncontrolled | controlled-only | Pagination should reflect parent-owned paging state rather than duplicating it internally. |
| Composition pattern | flat API | `vercel-composition-patterns` review does not justify public compound exports; a single shell avoids boolean and slot sprawl. |
| Page-size selector | optional shared `Select` | Reuses the canonical shared dropdown control instead of maintaining a second inline selector pattern inside table and list footers. |
| Box-only DOM rule | explicit | The root `nav`, list, buttons, status text, and visible rows-per-page label all render through `Box`; the Select internals stay inside the already-approved shared Select component boundary. |

---

## Props Interface

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `currentPage` | `number` | - | Yes | Current 1-based page index from the parent surface. |
| `totalPages` | `number` | - | Yes | Total available page count. Values below 1 clamp to 1 for rendering safety. |
| `onPageChange` | `(page: number) => void` | - | Yes | Called when a user selects a different page. |
| `pageSize` | `number` | `undefined` | No | Current rows-per-page value shown in the optional selector. |
| `onPageSizeChange` | `(size: number) => void` | `undefined` | No | Called when the optional rows-per-page selector changes. |
| `pageSizeOptions` | `number[]` | `undefined` | No | Available rows-per-page choices for the optional selector. |
| `className` | `string` | `undefined` | No | Consumer override merged last through `cn()`. |
| `...props` | `React.HTMLAttributes<HTMLElement>` | - | No | Root `nav` attributes such as `id`, `aria-*`, and `data-*`. |

---

## Variants

`Pagination` has no public `variant` or `size` props. Its visual states come from slot styling and page-count-aware compaction.

| Variant | Description | When to use |
| ------- | ----------- | ----------- |
| Default range | Numeric page buttons plus first/previous/next/last controls | Most paged surfaces with a manageable number of pages. |
| Compact range | Numeric buttons collapse to an ellipsis window around the active page | Large page counts where showing every page button would create visual noise. |
| With page size selector | Adds a small rows-per-page control before the status text | Tables and list views that expose page-size changes. |

---

## States

| State | Visual Behavior | Accessibility |
| ----- | --------------- | ------------- |
| Default | Bordered navigation controls, active page highlight, muted summary text | Root uses `nav` semantics with `aria-label="Pagination"`. |
| Active page | Current page renders as a highlighted non-button token | Uses `aria-current="page"` so screen readers announce the active page. |
| Edge disabled | First/previous or next/last controls disable at list boundaries | Disabled controls use native `disabled` semantics and cannot be activated. |
| Compact | Large page counts insert an ellipsis between boundary pages and the local page window | Ellipsis stays decorative with `aria-hidden`. |
| Page-size selector | Optional labeled shared `Select` sits alongside the page status | The rows-per-page trigger is explicitly labeled through the visible "Rows per page" text. |
| Single page | Boundary controls are disabled and only page `1` remains active | The component still announces `Page 1 of 1`. |

---

## Accessibility

### ARIA Roles & Attributes

| Element | Role / Attribute | Value |
| ------- | ---------------- | ----- |
| Root | implicit role | Native `<nav>` semantics via `Box as="nav"` |
| Root | `aria-label` | `"Pagination"` |
| Active page | `aria-current` | `"page"` |
| Status text | `aria-live` | `"polite"` |
| Page-size selector | accessible label | Visible "Rows per page" label and `aria-label` on the `select` |

### Keyboard Map

| Key | Behavior |
| --- | -------- |
| `Tab` | Moves focus across the enabled pagination controls and optional selector |
| `Enter` / `Space` | Activates the focused navigation button |
| Arrow keys | Navigate the opened rows-per-page Select options using the shared Select keyboard behavior |

### Focus Management

- Focus stays on the clicked pagination control after a page change.
- The component does not trap or move focus programmatically; list and table parents remain in control of content-focus strategy.

### Screen Reader Notes

- The live page summary announces the current page and total page count after controlled state updates.
- The active page is exposed through `aria-current="page"` instead of a disabled active button.

---

## Usage Examples

### 1. Basic usage

```tsx
<Pagination currentPage={3} totalPages={12} onPageChange={setPage} />
```

### 2. With page-size selector

```tsx
<Pagination
  currentPage={2}
  totalPages={9}
  pageSize={20}
  pageSizeOptions={[10, 20, 50]}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
/>
```

### 3. Compact large-page usage

```tsx
<Pagination currentPage={48} totalPages={120} onPageChange={setPage} />
```

### 4. Composed usage

```tsx
<Box className="grid gap-4">
  <Table>{/* caller-owned rows */}</Table>
  <Pagination
    currentPage={page}
    totalPages={pageCount}
    pageSize={pageSize}
    pageSizeOptions={[10, 20, 50]}
    onPageChange={setPage}
    onPageSizeChange={setPageSize}
  />
</Box>
```

---

## Do / Don't

| Do | Don't |
| --- | ----- |
| Keep `Pagination` controlled from the parent surface with caller-owned page state. | Add internal fetch logic, routing, or table orchestration to the component. |
| Use the optional page-size selector only when the parent already supports page-size updates. | Render an inert page-size selector without wiring `onPageSizeChange`. |
| Let the compact ellipsis behavior derive from `totalPages` rather than adding more mode props. | Introduce extra public booleans such as `compact`, `showEdges`, or `condensed`. |
| Keep authored JSX on `Box` for the root nav, list items, buttons, labels, select, and options. | Hand-write native `nav`, `button`, `ul`, `li`, `select`, `option`, or SVG tags in shared authored JSX. |
| Pass semantic root attributes such as `id`, `aria-describedby`, or `data-*` through the root props. | Use `Pagination` as a breadcrumb, stepper, or router-specific navigation primitive. |

---

## Storybook Stories Required

**Story file title:** `'Navigation/Pagination'`

- [x] `Default`
- [x] `WithPageSizeSelector`
- [x] `Compact`
- [x] `DisabledState`

---

## Changelog

| Date | Change |
| ---- | ------ |
| 2026-03-10 | Initial Pagination spec |
