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

## Badge

Direct adoption guidance:

- Legacy status pills, chips, and compact metadata labels map to `Badge`.
- Existing semantic states such as approved, active, pending, blocked, or failed map to `variant=success | info | warning | destructive | default | secondary | outline` as appropriate.
- Dense table/list labels map to `size="sm"`; general inline labels map to `size="md"`.
- Leading dots remain child composition inside `children` rather than a dedicated shared prop.

Keep local:

- Interactive pills that behave like filters, tabs, or navigation controls.
- Domain status helpers that still compute text, tone, or visibility from business logic before rendering.
- Large notification bodies or rich feedback shells that should instead map to `Alert`.

## Button

Direct adoption guidance:

- Legacy CTA, submit, and toolbar action controls map to `Button`.
- Existing primary/filled treatments map to `variant="default"` or `variant="primary"`; outlined actions map to `variant="outline"`; danger maps to `variant="destructive"`; warning maps to `variant="warning"`.
- Legacy `isLoading` or `pending` props map to `loading`; `withIcon` patterns map to `leftIcon` or `rightIcon`.
- Consumer-owned anchors or router wrappers that only need button styling map to `asChild`.

Keep local:

- Auth-provider, SSO, payment, or SDK-backed buttons that encapsulate third-party logic.
- Buttons whose disabled/loading state still depends on domain permissions, workflow guards, or service orchestration beyond plain props.
- Route-aware wrappers that still own navigation construction instead of receiving a child element.
