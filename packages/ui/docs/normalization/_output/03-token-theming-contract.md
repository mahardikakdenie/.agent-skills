# Token and Theming Contract

## Contract Objective

Define the single token/theming interface used by all `@repo/ui` components and all consuming apps.

This contract is mandatory for Batch 3+ implementation work.

## Current Gap to Close

Observed state in `packages/config/tailwind.css`:
- Uses fixed hex palette variables (`--color-primary-*`, `--color-danger-*`, `--color-warning-*`)
- No full semantic token set used by shared components
- No standardized dark theme token surface

Required state after token normalization:
- Semantic CSS variable contract (HSL channels)
- App-level token override support
- Shared component styles reference semantic tokens only

## Required CSS Variables

Every consuming app must define at minimum:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;

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

  --success: 142 71% 45%;
  --success-foreground: 0 0% 98%;
  --warning: 38 92% 50%;
  --warning-foreground: 222.2 47.4% 11.2%;
  --info: 199 89% 48%;
  --info-foreground: 0 0% 98%;

  --chart-1: 221 83% 53%;
  --chart-2: 160 84% 39%;
  --chart-3: 38 92% 50%;
  --chart-4: 262 83% 58%;
  --chart-5: 350 89% 60%;

  --radius: 0.5rem;
}
```

## Dark Theme Strategy

- Theme switch strategy: `data-theme="dark"` on root HTML element.
- Dark token set must override the same variable keys, not introduce alternate key names.
- `@repo/ui` components must not rely on `dark:` utility forks for semantic colors; they read token values.

## App Consumer Integration

Each app `globals.css` must:
1. Import `@repo/config/tailwind.css`
2. Define semantic token variables above
3. Optionally override selected tokens per brand
4. Provide a dark-token block on `[data-theme="dark"]`

## Forbidden in `@repo/ui`

- Hardcoded hex/rgb/hsl color literals in component classnames or inline styles
- Utility-only color coupling like `text-blue-600` for shared semantics
- `!important` token overrides
- App env var reads (`process.env.NEXT_PUBLIC_*`)
- App asset coupling (for example app logo imports)

## Token Ownership Rules

- Token source of truth: `@repo/config`
- Component consumption point: `@repo/ui`
- App branding overrides: app-local `globals.css`, same semantic variable keys
- Non-token visual overrides in apps must still use `className` and semantic values

## Rollout Rules for Batch 3

1. Add/normalize semantic token surface in `@repo/config` before large component rollout.
2. Do not ship new shared components with temporary hardcoded fallback colors.
3. Token additions are additive by default; renames require foundation amendment.
