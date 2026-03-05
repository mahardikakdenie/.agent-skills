# Shared vs Local Boundary (Batch 2 Refresh)

## Decision Tree
1. Domain-coupled or route-coupled?
   - Yes: KEEP_APP_LOCAL
2. Needed by 2+ apps?
   - Yes: shared candidate for `@repo/ui`
3. Differs by <= 2 presentational props/slots from existing shared candidate?
   - Yes: merge into existing canonical API
4. One-off branding/promo shell?
   - Yes: keep app-local

## Rulings
- Shared: core form controls, overlays, date pickers, table primitives, feedback primitives
- Local: route/page containers, auth orchestration, business-specific views, high-coupling workflow shells

## Zombie Code Policy
- Dead code: replaced + no usage -> delete immediately
- Zombie code: replaced but still used in limited paths -> mark deprecated and schedule cleanup
- Divergent code: domain/runtime-coupled -> keep local

## Batch 2 Consolidation Outcome
- Shared canonical scope fixed to 38 components including `Box`
- Local/deferred candidates remain out of Batch 3 build queue