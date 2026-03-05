# Shared vs Local Boundary

## Decision Tree

Use this sequence for every candidate:

1. Is the component domain-coupled (business workflow, route orchestration, service wiring, claim/policy specific types)?
   - Yes -> **KEEP_APP_LOCAL**.
   - No -> continue.
2. Is the component needed by 2+ apps or structurally identical to an existing shared candidate?
   - Yes -> **shared (`@repo/ui`)**.
   - No -> continue.
3. Does it differ from an existing shared candidate by <= 2 props/slots and no domain logic?
   - Yes -> **merge into existing shared API** (do not create sibling component).
   - No -> continue.
4. Is it visual/branding-only and app-specific?
   - Yes -> **app-local wrapper over shared primitive**.
   - No -> shared candidate with clear API justification.

## Batch 2 Cross-App Rulings

| Category | Ruling | Rationale |
| --- | --- | --- |
| Core form controls and actions | Shared | High cross-app reuse and stable interaction models |
| Overlay/menu primitives | Shared | Repeated patterns across admin, portal, microsite apps |
| Date/time input family | Shared | Repeated demand, parity-sensitive behavior |
| Data display primitives (`Table`, `Card`, `Badge`) | Shared | Broad reuse and app-agnostic semantics |
| Data-heavy workflow pages (`*View`, route pages) | App-local | Domain/service coupling and routing concerns |
| Auth/routing shells | App-local | App runtime and route policy coupling |
| Brand/marketing one-off shells | App-local | Product-specific identity and campaign constraints |
| Chart wrappers in current baselines | App-local for now | Mostly data-coupled/brand-tuned implementations |

## Consolidation Rulings (Applied)

| Raw variants | Canonical boundary outcome |
| --- | --- |
| Modal/Dialog/BottomSheet/Drewer variants | Shared overlay family: `Dialog` + `Drawer` |
| `Input*` component variants | Shared `Input` contract with typed feature props |
| `Select`, `SelectAutocomplete`, `SelectPhoneCode`, `MultiSelect` | Shared `Select` family (single API surface) |
| `FlashMessage`, `ErrorContent`, `Notification` | Shared feedback under `Alert` family |
| `Ui*` wrappers around primitives | Not separate shared exports; map to canonical base components |

## Zombie Code Policy

### Dead Code

Definition:
- Local component replaced by `@repo/ui` and no usage remains.

Action:
- Delete immediately in migration PR.

### Zombie Code

Definition:
- Local component replaced by `@repo/ui` but still used in 1-2 low-priority paths.

Action:
- Mark deprecated.
- Schedule explicit cleanup ticket and target batch.

### Divergent Code

Definition:
- High domain coupling or app-specific runtime dependencies.

Action:
- Keep in app-local component tree.
- Do not move to `@repo/ui` without a new cross-app case.

## Coverage Outcome by Boundary

- Shared candidate rows after reconciliation: **506**
- Local/deferred rows: **199**
- Canonical shared set approved for Batch 3 planning: **37 components** (+ existing `Box`)

This boundary ruling is final for Batch 2 and used by `05-coverage-baseline.md`.
