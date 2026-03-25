# Image Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Data Display` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Standard` |
| Based on | `Box` + semantic `img` target via `Box as="img"` |

---

## Overview

`Image` is the shared, app-agnostic media surface for generic image display in `@repo/ui`. It covers the repeated baseline needs found across the migration summaries: native image attributes, missing-source fallback treatment, click-through wrapper behavior, aspect-ratio control, and object-fit normalization without pulling `next/image`, route logic, or app-specific optimization policy into the shared package.

The shared contract intentionally stays narrower than framework or product-specific media wrappers. It accepts a plain source, accessible text alternative, optional fallback content, a constrained ratio set, and fit behavior. Optimized delivery, blur placeholders, priority loading, CDN transforms, zoom viewers, and business-specific media flows remain local and may compose this primitive only when the low-level shell itself is reusable.

**When to use:**

- Use `Image` for generic thumbnails, previews, logos, card media, and media placeholders that do not require framework-bound optimization.
- Use `fallback` when parity requires a text tile, icon tile, or app-composed empty-state treatment.
- Use `ratio` and `fit` to stabilize media frames in cards, lists, dashboards, and modal previews.

**When NOT to use:**

- Do not use `Image` for `next/image`-specific optimization, blur placeholders, fill-layout policy, or priority preloading rules.
- Do not move viewers, zoom flows, route-aware click behavior, or media-fetch orchestration into this component.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive | semantic image composed through `Box as="img"` | Preserves native image attributes while honoring the Box-only DOM rule in authored JSX. |
| CVA strategy | slot-based | The wrapper, inner image, and fallback tile need separate tokenized styling without adding public booleans. |
| Controlled vs uncontrolled | none | `Image` is display-only; state is limited to internal load/error tracking. |
| Fallback policy | built-in default with override | Cross-app baselines consistently need a missing-image surface, but apps must still be able to supply custom fallback content. |
| Ratio API | explicit enum | `vercel-composition-patterns` review favors a single `ratio` prop over multiple boolean sizing modes. |
| Fit API | explicit enum | Keeps object-fit decisions readable and avoids ad-hoc utility-class drift across apps. |
| Box-only DOM rule | explicit | Root wrapper, semantic `img`, fallback tile, and stories all render through `Box`; no direct native JSX tags are authored. |

---

## Props Interface

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `src` | `string \| null \| undefined` | `undefined` | No | Image source URL. Missing or falsy values show the fallback surface immediately. |
| `alt` | `string` | `undefined` | No | Accessible text alternative for the image. Decorative usage may omit it and hide the wrapper from assistive tech with `aria-hidden`. |
| `fallback` | `React.ReactNode` | shared default fallback tile | No | Custom content rendered when the image is missing or fails to load. |
| `ratio` | `'auto' \| 'square' \| 'video' \| 'portrait'` | `'auto'` | No | Shared aspect-ratio preset applied to the wrapper surface. |
| `fit` | `'cover' \| 'contain' \| 'fill'` | `'cover'` | No | Object-fit behavior applied to the underlying image element. |
| `className` | `string` | `undefined` | No | Consumer override merged onto the wrapper shell through `cn()`. |
| `width` / `height` | native image attrs | `undefined` | No | Passed to the semantic image element and mirrored into wrapper sizing where applicable. |
| `onClick` | native image attr | `undefined` | No | Attached to the wrapper so both the loaded image and fallback tile can participate in the same consumer-owned click handling. |
| `...props` | `React.ImgHTMLAttributes<HTMLImageElement>` | - | No | Native image props such as `loading`, `decoding`, `referrerPolicy`, `crossOrigin`, `sizes`, and `srcSet`. |

---

## Variants

`Image` does not expose a visual `variant` prop. The public styling surface is limited to `ratio`, `fit`, and consumer `className`.

### Ratio presets

| Ratio | Behavior | Use case |
| --- | --- | --- |
| `auto` | Uses native image dimensions or explicit `width` / `height` attrs | Freeform content images and logos |
| `square` | 1:1 frame | Avatars, tiles, product cards |
| `video` | 16:9 frame | Hero media, article thumbnails, dashboard cards |
| `portrait` | 3:4 frame | Document previews, profile and poster media |

### Fit modes

| Fit | Behavior | Use case |
| --- | --- | --- |
| `cover` | Crops to fill the frame | Default card and thumbnail media |
| `contain` | Preserves the full image within the frame | Logos, screenshots, document previews |
| `fill` | Stretches to match the frame | Rare utility cases where distortion is acceptable |

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Loaded image | Image fills the wrapper using the selected `fit` mode | `img` uses the provided `alt` text |
| Missing source | Shared fallback tile renders immediately | Fallback remains readable and the wrapper keeps its semantic labeling rules |
| Broken source | Fallback replaces the failed image without widening the layout shell | Screen readers still receive the wrapper-level accessible naming |
| Clickable wrapper | Consumer-owned click handling applies to both image and fallback | Keyboard focus remains consumer-owned through `role` / `tabIndex` |
| Decorative media | Wrapper can be hidden from assistive tech with `aria-hidden` | Avoids noisy duplicate announcements for decorative content |

`Image` does not introduce shared loading spinners, retry actions, or transport states.

---

## Accessibility

### Semantics

- `Image` renders a wrapper `span` through `Box` and the semantic image node through `Box as="img"`.
- Pass meaningful `alt` text when the image conveys content.
- For decorative images, omit `alt` or pass an empty string and set `aria-hidden="true"` on the wrapper when appropriate.
- Fallback content should stay descriptive when it replaces meaningful media; decorative fallback content should remain hidden or neutral.

### Keyboard Map

`Image` has no built-in keyboard behavior. If consumers make it interactive, they must provide the correct `role`, `tabIndex`, and keyboard handlers.

### Focus Management

- The wrapper includes visible `focus-visible` styles so consumer-owned interactivity has a shared focus treatment.
- `Image` does not automatically enter the tab order.

### Screen Reader Notes

- Loaded-image announcements come from the semantic `img` `alt` text.
- Missing or failed-image states rely on wrapper naming plus visible fallback content when that fallback is meaningful.
- Decorative wrappers should stay hidden from assistive tech rather than announcing generic placeholder copy.

---

## Usage Examples

### 1. Basic usage

```tsx
<Image
  src="https://cdn.example.com/product.png"
  alt="Travel insurance product card"
  width={320}
  height={180}
/>
```

### 2. With aspect ratio

```tsx
<Box className="w-56">
  <Image
    src="https://cdn.example.com/cover.png"
    alt="Campaign cover"
    ratio="video"
  />
</Box>
```

### 3. With custom fallback

```tsx
<Box className="w-40">
  <Image
    src=""
    alt="Partner logo unavailable"
    ratio="square"
    fit="contain"
    fallback={<Box as="span">Logo unavailable</Box>}
  />
</Box>
```

## Do / Don't

| Do | Don't |
| --- | --- |
| Use `ratio` to stabilize card and preview layouts. | Add separate `square`, `video`, or `portrait` booleans. |
| Use `fit="contain"` for logos, screenshots, and document previews. | Recreate object-fit behavior with app-local utility-class wrappers. |
| Pass native image attrs such as `loading`, `decoding`, and `referrerPolicy` directly. | Import `next/image` into `@repo/ui` or leak framework-specific props into this API. |
| Use `fallback` to replace local `ImageOrDefault` style wrappers. | Keep a second shared “image or default” component when one reusable primitive can cover the same shell. |
| Keep authored shared JSX and stories on `Box`, including the semantic image node. | Hand-write native `img`, `div`, `p`, or `span` tags in shared authored JSX. |
| Keep priority loading, blur placeholders, and CDN transforms local. | Expand the shared primitive into an app-specific optimization wrapper. |

---

## Storybook Stories Required

**Story file title:** `'Data Display/Image'`

- [x] `Default`
- [x] `Fallback`
- [x] `AspectRatios`
- [x] `FitModes`

---

## Box-only DOM policy

- Authored shared JSX for this component and its stories must use `Box` for every DOM node.
- The semantic image node is rendered through `Box as="img"`, and the fallback tile is rendered through `Box as="span"`.
- No direct native DOM or SVG tags are authored in the shared implementation or stories.

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-12 | Initial Image spec |
