# Risk Register (Batch 2 Refresh)

## Scope
Shared risks and high-parity app risks for Batch 3 implementation planning.

## Systemic Risks
| Risk | Type | Mitigation | Rollback |
| --- | --- | --- | --- |
| Token contract not fully semantic in all apps | Visual parity regression | normalize semantic token contract first | keep local styles and defer shared swap |
| Prop naming divergence (`isDisabled`, `kind`, `isOpen`) | API mismatch | enforce adapter mapping to canonical props | keep adapters and postpone strict API lock in affected app |
| Shared surface rollout too broad too early | migration instability | phase rollout by B3.1 to B3.5 with smoke checks | freeze new shared adoption and revert affected imports |
| Missing dependency gates for planned composites | build/runtime failure | preflight dependency checks before each component batch | pin previous `@repo/ui` release and disable new exports |

## High-Risk App Flows (Representative)
| Flow group | Affected apps | Mitigation |
| --- | --- | --- |
| Claim and policy route workflows | admin-portal, claim-portal, partner-portal | keep container logic local; migrate primitives first |
| Checkout/declaration/payment paths | ecommerce-teman, teman-affiliate-microsite | parity-first rollout with staged replacement |
| Dashboard and table/filter orchestration | affiliate-admin, teman-affiliate-admin, ticket-portal | split shell and data logic before shared extraction |
| Locale/form-intensive user flows | customer-portal, mykawan-website | preserve local data contracts; share only stable controls |

## Rollback Strategy
- Revert import changes per route/component group, not global rollback.
- Keep app-local fallback component paths until parity gates pass.
- Use app-level smoke routes from verification gate docs before finalizing adoption.