# Admin Portal Batch 4 Shared Readiness Checklist

Last updated: 2026-03-29

## Purpose

This checklist exists to prevent false-positive Batch 4 selection in `apps/admin-portal`.

The original Batch 1 audit marks many local components as `NEW_SHARED_COMPONENT` with `@repo/ui status: missing`.
That field is a snapshot from audit time, not a reliable live readiness source after Phase 04 and later queue corrections.

Before selecting any Batch 8 / Batch 4 item, verify:

1. Exact shared export exists in `packages/ui/src/index.ts`
2. Matching spec exists in `packages/ui/src/<ComponentName>/<ComponentName>.spec.md`
3. Replacement guidance exists in `packages/ui/docs/normalization/_output/21-adapter-mapping.md`
4. The app audit name is either:
   - the exact shared export name, or
   - explicitly mapped to a different canonical shared export

If any of the checks above fail, correct the docs first or log the component as `BLOCKED`.

## Queue Corrections

These components should not be treated as standalone shared-ui Batch 4 targets.

| Audit component | Local file | Current disposition | Canonical shared target | Why |
| --- | --- | --- | --- | --- |
| `OptimizeImageShell` | `src/components/optimize-image-shell.tsx`, `src/components/ui/optimize-image-shell.tsx` | `KEEP_APP_LOCAL` | `Image` remains the shared primitive; optimization shell stays local | Render-prop shell exists only to preserve local `next/image` concerns |
| `SelectAutocomplete` | `src/components/ui/Fields/SelectAutocomplete/index.tsx` | `KEEP_APP_LOCAL` | `Combobox` | Wrapper is an app-local compatibility layer around the shared searchable select pattern |
| `Loading` | `src/components/ui/loading.tsx`, `src/components/ui/Loading/index.tsx` | `KEEP_APP_LOCAL` | `Spinner` / `Skeleton` only | Wrapper layout and blocking policy stay app-local; only loading primitives are shared |
| `SelectPhoneCode` | `src/components/ui/select-phone-code.tsx` | `KEEP_APP_LOCAL` | `Select` | User-form-specific phone-code wrapper with app-owned country metadata and `next/image` cell rendering |

## Canonical Name Mismatches

These components were valid Batch 4 migrations, but the app audit name does not match the actual shared export name 1:1.

| Audit component | Local file | Shared export actually used | Migration status | Notes |
| --- | --- | --- | --- | --- |
| `Drewer` | `src/components/ui/drewer.tsx` | `Drawer` | migrated | Legacy spelling differs from canonical shared export |
| `UploadFile` | `src/components/ui/Fields/UploadFile/index.tsx` | `FileUpload` | migrated | Shared canonical export uses the normalized file-upload name |

## Shared Export Exists But Migration Is Still Blocked

These are not "missing from shared ui", but they still must not be selected blindly.

| Audit component | Shared export | Status | Why blocked |
| --- | --- | --- | --- |
| `DataTable` | `DataTable` | `BLOCKED` | Shared export exists, but current shared contract does not yet preserve admin-portal row-level and header/cell class parity hooks safely |

## Operating Rule

When a component is labeled `NEW_SHARED_COMPONENT` in app docs, do not trust that label alone.

Use this checklist together with:

- `_audit-report.md`
- `_migration-log.md`
- `packages/ui/src/index.ts`
- `packages/ui/docs/normalization/_output/21-adapter-mapping.md`

If the audit name is not a current shared export and no explicit canonical mapping is documented, stop and reconcile the queue before making source changes.
