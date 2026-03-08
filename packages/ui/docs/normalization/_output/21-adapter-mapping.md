# 21 - Adapter Mapping

> Batch: Batch 4 - Build Shared Components
> Branch: `feat/ui`
> Run date: 2026-03-08

## Box

Direct adoption guidance:

- Legacy body wrappers that only add responsive horizontal spacing map to `padding`.
- Legacy page containers that only constrain width map to `container`.
- Legacy wrappers whose only responsibility is centering generic content map to `centered`.

Keep local:

- Route chrome, sidebar/header composition, auth gates, and app-specific page shells.
- Any wrapper that combines layout with domain state, routing, feature flags, or branded presentation.
