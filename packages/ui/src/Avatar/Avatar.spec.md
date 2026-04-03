# Avatar Spec

## Metadata

| Field           | Value                            |
| --------------- | -------------------------------- |
| Storybook Group | `Data Display`                   |
| Component Tier  | `Tier 1 (Primitive)`             |
| Structure Tier  | `Simple`                         |
| Based on        | `@radix-ui/react-avatar` + `Box` |

---

## Overview

`Avatar` is the shared identity-image primitive for compact user or entity representation. It renders a circular image when a source is available and falls back to caller-provided content or derived initials when the image is missing or fails to load. The shared contract stays intentionally small so downstream apps can compose richer identity patterns without pulling route logic, presence state, or business formatting into `@repo/ui`.

Cross-app references show two recurring needs: a conventional profile avatar surface and a fallback text tile when no image is available. The roadmap resolves both through one shared primitive with `src`, `alt`, `fallback`, and `size`, while grouped stacks, presence badges, and optimized marketing images remain outside this contract.

**When to use:**

- Use `Avatar` for profile photos, assignee chips, reviewer identity rows, and other compact identity markers.
- Use `fallback` for branded initials, short labels, or decorative fallback content when an image is unavailable.
- Compose grouped or clickable avatar layouts in app code by passing standard HTML props and wrapper layout primitives.

**When NOT to use:**

- Do not use `Avatar` for large content images, responsive media, or framework-optimized image pipelines; keep those on app-local image components or the later shared `Image` contract.
- Do not add presence dots, online status, or route-aware click behavior to the shared primitive itself; compose those locally around `Avatar`.

---

## Design Decisions

| Decision                   | Choice                   | Rationale                                                                                                      |
| -------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Primitive                  | `@radix-ui/react-avatar` | Keeps image loading and fallback behavior on an accessible, well-tested primitive.                             |
| CVA strategy               | slot-based               | Root and fallback both need shared size scaling without expanding the public API with extra booleans.          |
| Controlled vs uncontrolled | none                     | `Avatar` is display-only; apps only pass content and optional event handlers.                                  |
| Sub-components             | no                       | `vercel-composition-patterns` review does not justify a compound family for this flat identity primitive.      |
| Fallback behavior          | fixed internal delay     | A small internal `delayMs` avoids flash-of-fallback on fast connections without widening the public interface. |
| Box-only DOM rule          | explicit                 | Authored JSX must use `Box` for the root, image, fallback, and stories; no direct native tags are authored.    |

---

## Props Interface

| Prop        | Type                                    | Default                   | Required | Description                                                                                       |
| ----------- | --------------------------------------- | ------------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `src`       | `string`                                | `undefined`               | No       | Image source URL for the avatar image.                                                            |
| `alt`       | `string`                                | `undefined`               | No       | Accessible image description and the source for derived initials when `fallback` is not provided. |
| `fallback`  | `React.ReactNode`                       | derived initials or `'?'` | No       | Explicit fallback content shown when the image is missing or fails to load.                       |
| `variant`   | `'outline' \| 'shadow'`                 | `'outline'`               | No       | Shared avatar-shell surface treatment applied to the actual avatar root.                          |
| `size`      | `'sm' \| 'md' \| 'lg' \| 'xl'`          | `'md'`                    | No       | Shared avatar size scale.                                                                         |
| `className` | `string`                                | `undefined`               | No       | Consumer override merged last through `cn()`.                                                     |
| `...props`  | `React.HTMLAttributes<HTMLSpanElement>` | -                         | No       | Standard root props such as `id`, `aria-*`, `role`, `tabIndex`, `onClick`, and `data-*`.          |

### Derived fallback rule

- If `fallback` is provided, it is rendered as-is.
- If `fallback` is absent and `alt` contains text, `Avatar` derives initials from the first one or two words.
- If both `fallback` and `alt` are absent, the primitive falls back to `'?'`.

---

## Variants

`Avatar` keeps the size scale and now adds one narrow surface axis for the shell itself.

### Surface treatment

| Variant   | Behavior                                       | Intended use                                                             |
| --------- | ---------------------------------------------- | ------------------------------------------------------------------------ |
| `outline` | Bordered circular shell with no resting shadow | Default identity marker and the fallback when `variant` is omitted       |
| `shadow`  | Bordered circular shell with `shadow-sm`       | Use when the avatar needs stronger separation from a surrounding surface |

### Size scale

| Size | Behavior                             | Intended use                                          |
| ---- | ------------------------------------ | ----------------------------------------------------- |
| `sm` | 32px avatar with tight fallback text | Dense rows, tables, compact metadata                  |
| `md` | 40px avatar                          | Default form, list, and header usage                  |
| `lg` | 48px avatar                          | Prominent identity blocks and detail rows             |
| `xl` | 64px avatar                          | Profile summaries and larger hero identity treatments |

---

## States

| State             | Visual Behavior                                                               | Accessibility                                                                                     |
| ----------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Image loaded      | Circular image fills the full avatar frame                                    | `img` uses the provided `alt` string.                                                             |
| Missing source    | Fallback content shows immediately inside the muted circular surface          | Fallback text stays readable even when no image is available.                                     |
| Broken image      | Fallback replaces the failed image inside the same shell                      | The shared shell stays stable; no layout shift beyond expected image replacement.                 |
| Derived initials  | Two-letter or one-letter uppercase initials render when `fallback` is omitted | Initials provide readable identity context when `alt` is meaningful.                              |
| Clickable wrapper | Consumer may pass `onClick`, `role`, and `tabIndex` to the root               | Interactivity remains consumer-owned so the primitive does not pretend to be a button by default. |

`Avatar` has no loading spinner, disabled mode, or presence badge in the shared contract.

---

## Accessibility

### Semantics

- `Avatar` renders a `span` root through `Box` and keeps the visual shell non-interactive by default.
- When the image is meaningful, pass a descriptive `alt`.
- When the avatar is decorative, consumers should pass `aria-hidden="true"` or otherwise remove it from the accessibility tree.
- If fallback content is purely decorative and no `alt` is provided, the fallback node is hidden from assistive tech.

### Keyboard Map

`Avatar` has no keyboard bindings of its own because it is not interactive by default.

### Focus behavior

- `Avatar` does not enter the tab order unless consumers opt in with `tabIndex` or render it inside an interactive wrapper.
- The shared root keeps a visible focus ring style available for consumer-owned interactive cases.

### Screen reader notes

- Image state is announced from the `img` alt text when present.
- Text fallback is read as normal inline content when it conveys identity and `alt` exists.
- Decorative fallback content should stay hidden when no meaningful text alternative exists.

---

## Usage Examples

### 1. Basic image usage

```tsx
<Avatar src="https://github.com/shadcn.png" alt="Shadcn UI" />
```

### 2. Derived initials fallback

```tsx
<Avatar alt="Ayu Pratama" />
```

### 3. Broken-image fallback content

```tsx
<Avatar src="https://example.invalid/avatar.png" alt="Platform team" fallback="PT" />
```

### 4. Consumer-composed group

```tsx
<Box className="flex -space-x-2">
  <Avatar src="https://github.com/shadcn.png" alt="Shadcn UI" className="ring-2 ring-background" />
  <Avatar alt="Mina Putri" className="ring-2 ring-background" />
  <Avatar alt="Rafi Akbar" className="ring-2 ring-background" />
</Box>
```

---

## Do / Don't

| Do                                                                                                    | Don't                                                                           |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Pass meaningful `alt` text when the avatar conveys identity.                                          | Rely on a generic `"Avatar"` string as the only accessible label in real usage. |
| Use `fallback` for explicit initials or short text when parity requires it.                           | Add shared `status`, `online`, or grouped-stack props to the primitive.         |
| Compose clickable or stacked treatments around `Avatar` with standard HTML props and layout wrappers. | Turn the shared primitive into a router-aware profile menu trigger.             |
| Keep authored JSX on `Box` for the root, image, fallback, and stories.                                | Hand-write native `span`, `img`, or `div` tags in shared authored JSX.          |
| Use the later shared `Image` contract or app-local media components for large images.                 | Stretch `Avatar` into a generic responsive media component.                     |

---

## Storybook Stories Required

**Story file title:** `'Data Display/Avatar'`

- [x] `Image`
- [x] `Fallback`
- [x] `Shadow`
- [x] `Sizes`
- [x] `StackedGroup`

---

## Box-only DOM policy

- Authored shared JSX for this component and its stories must use `Box` for every DOM node.
- `AvatarPrimitive.Root`, `AvatarPrimitive.Image`, and `AvatarPrimitive.Fallback` are all composed with `asChild` so the authored root, image, and fallback still render through `Box`.
- No direct native `span`, `img`, or other DOM tags are authored in the shared implementation or story compositions.

---

## Changelog

| Date       | Change                                                                                    |
| ---------- | ----------------------------------------------------------------------------------------- |
| 2026-03-12 | Initial Avatar spec                                                                       |
| 2026-04-03 | Added normalized `outline` / `shadow` avatar-shell variants with `outline` as the default |
