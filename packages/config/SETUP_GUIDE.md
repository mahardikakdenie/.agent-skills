# Tailwind CSS v4 Setup Guide

This guide shows how apps should consume `@repo/config` during the Batch 3A token bootstrap and later shared-component migration.

## Recommended `globals.css`

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

## Why this setup

- `@repo/config/tailwind.css` loads Tailwind v4 and the semantic token preset.
- Apps can keep legacy palette utilities during migration.
- `@repo/ui` depends on semantic classes such as `bg-primary`, `text-muted-foreground`, and `border-input`.
- Apps remain responsible for brand overrides in `:root` and dark-mode overrides under `[data-theme='dark']`.

## Optional explicit import

If you need to split the imports for a custom setup, this is also valid:

```css
@import 'tailwindcss';
@import '@repo/config/semantic-tokens.css';
@import '@repo/config/tailwind.css';
```

Prefer the single `@repo/config/tailwind.css` import unless your app has a specific reason to separate them.

## Rules for shared UI adoption

- New `@repo/ui` components must use semantic token classes only.
- Do not rely on raw palette utilities like `bg-primary-50` inside `packages/ui`.
- Dark mode must be controlled through `[data-theme='dark']`.
- Apps may override `--primary`, related foreground tokens, and `--radius` locally.