# Service Refactor Lifecycle

Friendly, end-to-end lifecycle for refactoring the service layer per app.

How to read:
- The flow is top-to-bottom.
- The verification gate happens after Phase 3, Phase 4A, Phase 4B, and after all component migrations in Phase 5.
- Phase 4A and 4B repeat per service until all services are implemented.
- Phase 5 starts only after all services are ready.

```mermaid
flowchart TB
  classDef phase fill:#f4f6f8,stroke:#6b7280,color:#111,stroke-width:1px;
  classDef gate fill:#fff7ed,stroke:#ea580c,color:#7c2d12,stroke-width:1px;
  classDef decision fill:#ecfeff,stroke:#0ea5e9,color:#0c4a6e,stroke-width:1px;
  classDef artifact fill:#ecfdf3,stroke:#16a34a,color:#14532d,stroke-width:1px;
  classDef fix fill:#fef2f2,stroke:#dc2626,color:#7f1d1d,stroke-width:1px;

  A([Start: App Selected]):::phase
  B[Define App Inputs<br/>dev, build, lint, test, sanity]:::phase
  B0[Batch 0: Verification Gate Setup]:::phase
  B0a[Artifact: verification-gate.md<br/>per app]:::artifact
  C[Phase 1: Audit Current State<br/>per service]:::phase
  C1[Artifact: service-audit.md]:::artifact
  D[Phase 2: Refactoring Plan<br/>per service]:::phase
  D1[Artifact: service-refactoring-plan.md]:::artifact
  E[Phase 3: Implement Foundation]:::phase
  G{Verification Gate<br/>typecheck, build, lint, tests, sanity}:::gate
  F[Fix issue or rollback<br/>then re-run gate]:::fix

  A --> B --> B0 --> B0a --> C --> C1 --> D --> D1 --> E --> G
  G -- pass --> S
  G -- fail --> F --> G

  subgraph S[Phases 4A-6]
    S1[Phase 4A: Implement API Layer<br/>per service, all services first]:::phase --> G1{Verification Gate}:::gate
    G1 -- pass --> S2[Phase 4B: Query Keys and Hooks<br/>per service, all services first]:::phase
    S2 --> G2{Verification Gate}:::gate
    G2 -- pass --> S3[Phase 5: Migrate Components<br/>per component, after all services ready]:::phase
    S3 --> G3{Verification Gate}:::gate
    G3 -- pass --> S4[Phase 6: Cleanup and Docs]:::phase
    S4 --> G4{Verification Gate}:::gate
    G4 -- pass --> S4a[Cleanup Verified]:::phase
    G4 -- fail --> F4[Fix issue or rollback<br/>then re-run gate]:::fix --> G4

    G1 -- fail --> F1[Fix issue or rollback<br/>then re-run gate]:::fix --> G1
    G2 -- fail --> F2[Fix issue or rollback<br/>then re-run gate]:::fix --> G2
    G3 -- fail --> F3[Fix issue or rollback<br/>then re-run gate]:::fix --> G3
  end

  S4a --> L[Artifacts:<br/>ARCHITECTURE.md<br/>ADDING_SERVICES.md<br/>QUERY_PATTERNS.md]:::artifact
  L --> M([Done]):::phase
```

Phase summary:

| Phase | Goal | Output | Gate |
| --- | --- | --- | --- |
| 0. Verification Gate Setup | Define per-app commands and checks | `verification-gate.md` | No |
| 1. Audit | Inventory services, endpoints, and pain points | `service-audit.md` | No |
| 2. Plan | Define colocated structure and per-service plan | `service-refactoring-plan.md` | No |
| 3. Foundation | Set up API client and TanStack Query | Shared infra in `src/lib` | Yes |
| 4A. API Layer | Build per-service API layer for all services | New service API folders | Yes |
| 4B. Hooks | Build query keys and hooks for all services | New service hooks | Yes |
| 5. Migrate Components | Move components to new hooks after all services exist | Updated components | Yes |
| 6. Cleanup & Docs | Remove old services, document patterns | `ARCHITECTURE.md`, `ADDING_SERVICES.md`, `QUERY_PATTERNS.md` | Yes |

Notes:
- `verification-gate.md` is created in Batch 0 per app at `APP_PATH/docs/refactor/verification-gate.md`.
- Old services stay in place until 100% of components are migrated.
- The gate is mandatory after Phase 3, Phase 4A, Phase 4B, after all component migrations in Phase 5, and Phase 6.
- Repeat the full lifecycle per app in the monorepo.
