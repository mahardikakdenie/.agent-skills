# 03 - Token and Theming Contract

> Batch: Batch 2 - Design System Foundation
> Branch: feat/ui
> Run date: 2026-03-06
> Source: 06-component-standards.md 5 + 9, current `feat_ui/packages/config`, current `feat_ui/packages/helper`, current `feat_ui/packages/ui/package.json`

---

## 1. Workspace Reality on `feat_ui`

| Package | Current state | Batch 2 ruling |
|---|---|---|
| `@repo/config` | Exports `tailwind.css` with brand-scale `@theme` colors and icon utilities only | This is not yet the semantic CSS-variable preset required by shared components |
| `@repo/helper` | Root `index.ts` is now a barrel and `src/cn.ts` contains the canonical implementation | Keep `@repo/helper` as the single `cn()` source for both apps and `packages/ui`, while scaling future helpers through modular `src/*` files |
| `@repo/ui` | Depends on `@repo/helper` for `cn()` | Shared components should keep consuming the package export path while `@repo/helper` evolves internally through its own module structure |

Operational meaning:
- The token contract below is the locked target state for Batch 3 onward.
- No existing workspace package should be described as already meeting this contract unless the file actually exists in `feat_ui`.

---

## 2. Target Token Architecture

### Foundation Ruling

Semantic tokens MUST be published by `@repo/config`.
Apps consume the semantic token preset from `@repo/config` and then override brand values in their own `globals.css`.
`packages/ui` consumes those tokens only through semantic Tailwind class names.

Target architecture:

```text
@repo/config
  -> semantic-tokens.css (or equivalent exported preset)
       -> CSS custom properties: --primary, --background, --chart-1, ...
  -> apps/<app>/globals.css
       -> app-specific overrides for brand and dark mode
  -> packages/ui components
       -> bg-primary, text-foreground, border-input, ...
```

Compatibility rule:
- The current `@theme` palette in `@repo/config/tailwind.css` may remain during rollout for legacy app code.
- Shared components in `packages/ui` must not depend on raw palette tokens such as `--color-primary-50`.

### `packages/ui` Must Use Semantic Tokens Only

Allowed:
- `bg-primary`
- `text-foreground`
- `border-input`
- `text-destructive`

Forbidden:
- hardcoded hex
- `rgb(...)`
- named CSS colors
- arbitrary Tailwind color utilities

---

## 3. Required Semantic Tokens

Core contract for any app consuming `@repo/ui`:

```css
:root {
  /* Base */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  /* Brand */
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  /* Feedback */
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --success: 142.1 76.2% 36.3%;
  --success-foreground: 355.7 100% 97.3%;
  --warning: 32.1 94.6% 43.7%;
  --warning-foreground: 210 40% 98%;
  --info: 204.7 94.3% 44.1%;
  --info-foreground: 210 40% 98%;

  /* Surfaces */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;

  /* Borders / inputs / focus */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;

  /* Charts */
  --chart-1: 12 76% 61%;
  --chart-2: 173 58% 39%;
  --chart-3: 197 37% 24%;
  --chart-4: 43 74% 66%;
  --chart-5: 27 87% 67%;

  /* Shape */
  --radius: 0.5rem;
}
```

Batch 2 ruling:
- `03-token-theming-contract.md` locks `--chart-1` through `--chart-5` because the prompt explicitly requires the full chart token range.
- Alert/status components use `destructive`, `success`, `warning`, and `info` tokens. There is no separate `error` token family.

---

## 4. Current `@repo/config` Gap and Required Migration

| Current asset | Gap against the foundation contract | Required action |
|---|---|---|
| `@repo/config/tailwind.css` brand palette via `@theme` | No semantic CSS-variable preset for shared components | Add an exported semantic token preset consumed by both apps and `packages/ui` |
| Legacy palette tokens such as `primary-50` | Useful for older app code, but not sufficient for shared components | Keep temporarily for backward compatibility; do not use in new `packages/ui` code |
| `@repo/config` docs | Describe direct palette usage, not the semantic contract | Update README/setup docs after the semantic preset ships |

---

## 5. App `globals.css` Contract

Every app that consumes `@repo/ui` components MUST:

1. Import the semantic token preset from `@repo/config`, or define an equivalent contract locally before using shared components.
2. Declare all required tokens in `:root {}`.
3. Override `--primary` and related foreground values to match the app brand.
4. Set `--radius` to the app's intended shape value.
5. Add dark-mode overrides under `[data-theme="dark"]` when dark mode is supported.

Transition rule:
- Apps may keep `@import '@repo/config/tailwind.css';` for legacy utility classes during migration.
- Shared components still depend on the semantic token block above. There is no fallback inside `packages/ui`.

---

## 6. Dark Mode Strategy

Dark mode is applied via `[data-theme="dark"]` on a parent element, typically `<html>` or `<body>`.
This is the only supported dark-mode pattern for `packages/ui`.

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... all light tokens ... */
}

[data-theme="dark"] {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 48%;
}
```

Forbidden:
- Tailwind `dark:` utilities inside `packages/ui`
- app-specific dark-mode hacks baked into shared component code

---

## 7. Apps Requiring Token Normalization (Critical)

The following apps have identified token normalization as a prerequisite to shared component adoption:

| App | Issue | Action required |
|---|---|---|
| `teman-affiliate-microsite` | HeroUI token system conflicts with the CSS-variable contract | Normalize HeroUI tokens to the semantic contract before adopting shared primitives |
| `haruuz-microsite` | HeroUI color system and hardcoded brand values in CSS | Normalize to semantic tokens first |
| `gelm-xproject-microsite` | HeroUI theming system conflicts with shared token consumption | Token normalization is a prerequisite |
| `grab-landing-page` | MUI + NextUI mix and hardcoded Tailwind color literals | Replace hardcoded colors with semantic tokens |
| `agent-admin` | Hardcoded color values and inline style objects | Move to token-driven styles during migration |
| `teman-affiliate-portal` | Hardcoded utility values and ad-hoc helpers | Standardize token usage before broad shared adoption |

---

## 8. Tailwind Composition Rules

Source: `06-component-standards.md` 9

### `cn()` Utility (canonical)

```ts
// packages/helper/src/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// packages/helper/index.ts
export { cn } from './src/cn';
export type { ClassValue } from './src/cn';
```

Import rules:
- Inside `packages/ui`: `import { cn } from '@repo/helper'`
- In app code: `import { cn } from '@repo/helper'`
- Never install `tailwind-merge` or `clsx` directly inside component files
- Do not keep a second private `cn()` implementation inside `@repo/ui`

Current-state note:
- `@repo/helper` exports `cn()` from the package root, while the implementation itself lives in `src/cn.ts`.
- `@repo/ui` already consumes the shared helper through the stable package import path.
- `tailwind-merge` should live with the canonical helper implementation in `@repo/helper`.

### Class Composition Rules

| Rule | Correct | Incorrect |
|---|---|---|
| Avoid arbitrary values | `p-4` | `p-[16px]` |
| Use semantic tokens | `bg-primary`, `text-destructive` | `bg-blue-600`, `text-red-500` |
| Never hardcode colors | `text-destructive` | hardcoded hex or `rgb(...)` |
| Responsive first | `text-sm md:text-base` | inline style for simple responsive cases |
| Semantic spacing | `gap-2 px-4` | `gap-[8px] px-[16px]` |
| Dark mode | token handles it | `dark:bg-gray-800` in shared code |

### Radix State Selectors

```ts
'data-[state=open]:animate-in'
'data-[state=closed]:animate-out'
'data-[state=checked]:bg-primary'
'data-[state=unchecked]:bg-input'
'data-[disabled]:opacity-50'
'data-[highlighted]:bg-accent'
'data-[side=top]:slide-in-from-bottom-2'
'data-[side=bottom]:slide-in-from-top-2'
```

### Animation Pattern

```ts
// tailwindcss-animate is required before these patterns ship in packages/ui
'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95'
'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'
```

---

## 9. Workspace Prerequisites Before Shipping the Token Contract

| Item | Current state | Blocks | Required action |
|---|---|---|---|
| Semantic preset in `@repo/config` | missing | Any shared component that depends on semantic CSS variables | Add exported semantic token preset |
| `@repo/helper` public `cn()` export | implemented through a root barrel that re-exports `src/cn.ts` | Single canonical class merge helper for apps and `packages/ui` | Keep all consumers on `@repo/helper` while growing internals through modular helper files |
| `tailwind-merge` | installed in `@repo/helper` | Canonical merge behavior for the shared `cn()` utility | Keep it colocated with the canonical helper implementation inside `@repo/helper` |
| `tailwindcss-animate` | missing from `@repo/ui` | Documented motion patterns for overlays and menus | Add dependency before animated components ship |

---

## 10. Forbidden Styling in `packages/ui`

Source: `06-component-standards.md` 5

```ts
// FORBIDDEN - hardcoded values
className="bg-[#016da1]"
className="text-blue-600"
style={{ color: '#016da1' }}
className="dark:bg-gray-800"

// FORBIDDEN - Next.js environment
process.env.NEXT_PUBLIC_MODE

// FORBIDDEN - app-specific assets
import logo from '/public/logo.svg'

// FORBIDDEN - direct low-level merge imports inside component files
import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'
```
