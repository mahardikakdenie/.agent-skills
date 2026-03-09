# 21 - Adapter Mapping

> Batch: Batch 4 - Build Shared Components
> Branch: `feat/ui`
> Run date: 2026-03-10

## Box

Direct adoption guidance:

- Legacy body wrappers that only add responsive horizontal spacing map to `padding`.
- Legacy page containers that only constrain width map to `container`.
- Legacy wrappers whose only responsibility is centering generic content map to `centered`.

Keep local:

- Route chrome, sidebar/header composition, auth gates, and app-specific page shells.
- Any wrapper that combines layout with domain state, routing, feature flags, or branded presentation.

## Alert

Direct adoption guidance:

- Inline status banners and flash-message shells that render inside normal page flow map to `Alert`.
- Existing success/info/warning/error notification bodies map to `variant=success | info | warning | destructive`.
- Local banner headings and body copy map to `title` and `description`; custom leading visuals map to `icon`.
- App-controlled close buttons map to `dismissible` + `onClose`.

Keep local:

- Toast/snackbar timers, portal positioning, and auto-hide orchestration.
- Modal-style confirmations or blocking error states that should instead migrate to `Dialog` or `Drawer`.
- Alert wrappers that still embed routing, domain recovery actions, or service retry logic beyond a simple callback.
