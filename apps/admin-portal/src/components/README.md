# Admin Portal Components

The component tree is intentionally shallow.

## Structure

- `core`: shared admin components used across routes, including controls, modals, loaders, charts, tables, icons, image wrappers, page headers, navigation shells, and auth entry components.
- `forms`: feature forms and form-owned subcomponents.
- `table-config`: table column factories and table-specific render configuration.

## Guidelines

- Put reusable cross-route components in `core`.
- Put form-owned components beside their form under `forms`.
- Keep table column factories in `table-config` unless they become tightly owned by a single route.
- Import concrete files directly, for example `@/components/core/button`, to keep ownership and bundle behavior predictable.
