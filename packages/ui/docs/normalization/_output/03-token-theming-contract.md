# 03 — Token & Theming Contract

> **Batch:** Batch 2 — Design System Foundation
> **Branch:** `feat/ui`
> **Run date:** 2026-03-06
> **Source:** `06-component-standards.md §5 Theming & Token Contract` + `06-component-standards.md §9 Tailwind Composition Rules`

---

## Token Architecture

### Source of Truth

Semantic tokens are defined in `@repo/config`. Apps consume from `@repo/config`. `packages/ui` components consume via Tailwind class names that map to CSS custom properties.

```
@repo/config
  └── tokens.css / globals-preset.css
        ↕ (CSS custom properties --primary, --background, etc.)
  apps/<app-name>/src/app/globals.css
        ↕ (`:root {}` block applies per-app theme values)
  components using `bg-primary`, `text-foreground`, etc.
```

### `packages/ui` Must ONLY Use CSS Variable Token Names

`packages/ui` components reference tokens by their Tailwind utility class (e.g., `bg-primary`, `text-destructive-foreground`). They never hardcode hex, rgb, named CSS colors, or arbitrary Tailwind values.

---

## Required Semantic Tokens (in consuming app `globals.css`)

Source: `06-component-standards.md §5`

```css
:root {
  /* Base */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  /* Primary / Brand */
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;

  /* Secondary */
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  /* Muted */
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  /* Accent */
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;

  /* Destructive */
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;

  /* Border / Input / Ring */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;

  /* Shape */
  --radius: 0.5rem;
}
```

**Extended tokens** (required by specific components in at least 3 apps):

```css
:root {
  /* Card */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  /* Popover */
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;

  /* Feedback: success, warning, info */
  --success: 142.1 76.2% 36.3%;
  --success-foreground: 355.7 100% 97.3%;
  --warning: 32.1 94.6% 43.7%;
  --warning-foreground: 210 40% 98%;
  --info: 204.7 94.3% 44.1%;
  --info-foreground: 210 40% 98%;

  /* Chart (required for DataTable apps) */
  --chart-1: 12 76% 61%;
  --chart-2: 173 58% 39%;
  --chart-3: 197 37% 24%;
}
```

---

## App `globals.css` Contract

Every app that consumes `@repo/ui` components MUST:

1. Declare **all required tokens** above in `:root {}` before importing `@repo/ui` styles
2. Set `--radius` to the app's intended border radius value
3. Override `--primary` (and related foreground) to the app's brand color
4. For apps using dark mode: declare overrides under `[data-theme="dark"]` (see below)

**Non-negotiable:** If any required token is missing, components will render with broken colors. The consuming app is responsible for all token declarations. There is no fallback in `packages/ui`.

---

## Dark Mode Strategy

Dark mode is applied via the `[data-theme="dark"]` attribute selector on a parent element (typically `<html>` or `<body>`). This is the **only** supported dark mode pattern in `packages/ui`.

```css
/* In apps/<app>/globals.css */
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

**Forbidden:** `dark:` prefix utilities from Tailwind CSS inside `packages/ui`. All dark mode is handled by token values via `[data-theme="dark"]`.

---

## Apps Requiring Token Normalization (Critical)

The following apps have identified token normalization as a prerequisite to shared component adoption:

| App | Issue | Action required |
|---|---|---|
| `teman-affiliate-microsite` | HeroUI token system conflicts with CSS variable convention | Normalize HeroUI tokens to `@repo/config` tokens before adopting shared primitives |
| `haruuz-microsite` | HeroUI color system; hardcoded brand values in CSS | Normalize to `@repo/config` semantic tokens |
| `gelm-xproject-microsite` | HeroUI (`@heroui/react`, `@heroui/theme`) styling system | Token normalization prerequisite before any shared primitive adoption |
| `grab-landing-page` | MUI + NextUI mixing; hardcoded Tailwind color literals | Replace hardcoded colors with CSS variables |
| `agent-admin` | Hardcoded color values and inline style objects | Migrate to token-driven styles during Batch 5 |
| `teman-affiliate-portal` | Hardcoded utility values + ad-hoc helpers | Box pass + token migration during Batch 5 |

---

## Tailwind Composition Rules

Source: `06-component-standards.md §9`

### `cn()` Utility (canonical)

```ts
// packages/ui/src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Import rules:
- Inside `packages/ui`: `import { cn } from '../../utils/cn'`
- In app code: `import { cn } from '@repo/helper'`
- **Never** install `tailwind-merge` or `clsx` directly in component files

### Class Composition Rules

| Rule | Correct | Incorrect |
|---|---|---|
| Avoid arbitrary values | `p-4` | `p-[16px]` |
| Use CSS variable tokens | `bg-primary`, `text-destructive` | `bg-blue-600`, `text-red-500` |
| Never hardcode colors | `text-destructive` | `text-red-500`, hardcoded hex |
| Responsive first | `text-sm md:text-base` | inline style |
| Semantic spacing | `gap-2 px-4` | `gap-[8px] px-[16px]` |
| Dark mode | token handles it automatically | `dark:bg-gray-800` |

### Radix State Selectors

```ts
// Use data-[state=*] selectors for Radix-managed states
'data-[state=open]:animate-in'
'data-[state=closed]:animate-out'
'data-[state=checked]:bg-primary'
'data-[state=unchecked]:bg-input'
'data-[disabled]:opacity-50'
'data-[highlighted]:bg-accent'

// Side-based positioning (Tooltip, Popover, Select)
'data-[side=top]:slide-in-from-bottom-2'
'data-[side=bottom]:slide-in-from-top-2'
```

### Animation Pattern

```ts
// tailwindcss-animate is included in the design system
// Overlay enter/exit
'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95'
'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'
```

---

## Forbidden Styling in `packages/ui`

Source: `06-component-standards.md §5`

```ts
// FORBIDDEN — hardcoded values
className="bg-[#016da1]"       // use CSS variable tokens
className="text-blue-600"      // use semantic tokens
style={{ color: '#016da1' }}   // use CSS variable tokens
className="dark:bg-gray-800"   // use [data-theme="dark"] token strategy

// FORBIDDEN — Next.js environment
process.env.NEXT_PUBLIC_MODE   // app-specific

// FORBIDDEN — app-specific assets
import logo from '/public/logo.svg'  // app-specific

// FORBIDDEN — direct library imports (use via cn() or @repo/helper)
import { twMerge } from 'tailwind-merge'  // inside component files
import { clsx } from 'clsx'              // inside component files
```