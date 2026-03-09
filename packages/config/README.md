# @repo/config

Shared styling contract for the monorepo.

## Exports

- `@repo/config/tailwind.css`
  Legacy-friendly Tailwind v4 entrypoint. Imports Tailwind itself, the semantic token preset, and the existing palette-scale utilities.
- `@repo/config/semantic-tokens.css`
  Semantic CSS variable preset for shared components. This is the source of truth for `background`, `foreground`, `primary`, `border`, `ring`, chart tokens, and dark-mode overrides.

## Recommended app setup

In your app `globals.css`:

```css
@import '@repo/config/tailwind.css';

:root {
  --primary: 201 98% 32%;
  --primary-foreground: 210 40% 98%;
  --radius: 0.75rem;
}

[data-theme='dark'] {
  --primary: 201 100% 42%;
}
```

This keeps legacy palette utilities available during migration while also satisfying the semantic token contract used by `@repo/ui`.

## Semantic token classes available to shared UI

The semantic preset maps CSS variables to Tailwind utilities such as:

- `bg-background`, `text-foreground`
- `bg-primary`, `text-primary-foreground`
- `bg-secondary`, `text-secondary-foreground`
- `bg-muted`, `text-muted-foreground`
- `bg-accent`, `text-accent-foreground`
- `border-border`, `border-input`, `ring-ring`
- `text-destructive`, `bg-success`, `bg-warning`, `bg-info`
- `bg-card`, `text-card-foreground`, `bg-popover`, `text-popover-foreground`

## Legacy palette support

The older palette tokens remain available for temporary app-side compatibility:

- `primary-10` through `primary-100`
- `danger-10` through `danger-100`
- `warning-10` through `warning-100`

Do not use these palette utilities in new `@repo/ui` components.