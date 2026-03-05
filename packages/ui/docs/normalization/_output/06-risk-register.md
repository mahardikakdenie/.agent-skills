# Risk Register

## Scope

This register tracks high-risk migration items identified in per-app Batch 1 baselines and shared-system risks discovered during Batch 2 reconciliation.

## Per-App High-Risk Components/Flows

| High-risk component(s) | Risk type | Affected apps | Mitigation | Rollback plan |
| --- | --- | --- | --- | --- |
| `claim/*` route pages (`history`, `list/detail`, `export`, `import`) | Behavior divergence, routing parity | admin-portal | Keep containers local; migrate only app-agnostic child primitives first; smoke routes before and after | Revert to local component import path and disable shared swap at route-level |
| `product-catalog/*` and `partner-management/*` edit pages | Behavior divergence after SoC split | admin-portal-boost | Enforce split-first policy; extract shell only when route behavior is isolated | Keep current local pages; postpone shared extraction until split gate passes |
| `transaction/export`, `plan/detail`, `home`, `claim/list`, `claim/detail` views | API mismatch + behavior parity | affiliate-admin | Adapter layer for prop normalization; parity checklist on async/filter actions | Revert adapter mapping and restore local view composition |
| `Button`, `DatePicker`, `Input`, `Modal`, `Select` | API mismatch + visual regression | affiliate-portal | Canonical prop adapter (`variant/size/disabled`) and state snapshot checks | Toggle local fallback components per page |
| `SetInsuredPerson`, `TermsAndConditions`, `UploadCropImage`, `DeclarationPerInsured`, `Datepicker` | Workflow/state parity | agent-microsite | Keep workflow containers local; limit shared replacement to primitives | Roll back shared components in affected flow bundle |
| `ArrangeView`, `CustomerView`, `DashboardView`, `FilterMasterCertView`, `FilterSchemeView` | Dashboard orchestration regression | agent-portal | No shared extraction for orchestration views in this phase | Keep app-local views and defer to post-split phase |
| `AlterationView`, `NomineeView`, `CreateNomineeModal`, `CancellationView`, `CreditView` | Multi-step flow breakage | claim-portal | Incremental migration by sub-flow; strict interaction/state parity checks | Restore local flow components and remove adapter hooks |
| `[lang]/auth`, `[lang]/claims`, `[lang]/new-claim`, `[lang]/policy`, `claim-input-fields` | Route/page behavior drift | customer-portal | Keep page containers local; extract only reusable field/overlay primitives | Revert page-level shared integration and retain local components |
| `order-personal-info`, `order-declaration`, `verify-payment`, `button-select-product`, `header-product-detail` | Checkout-state regression | ecommerce-gelm | Split API/data wiring from UI shell first; high-risk smoke scripts required | Revert shell adoption and restore local route bundle |
| `declaration/*` + `payment/*` critical routes | Purchase flow failure risk | ecommerce-teman | Do not replace route-level components directly; use adapter plus staged rollout | Roll back to local components by route segment |
| `CustomFilterDate`, `CustomMultipleSelect`, `CustomNestedSelect`, form `Checkbox`, `DatePicker/DayPicker` | API mismatch + state parity | gegm-friendcover-admin | Normalize APIs to canonical names with wrapper adapters; keep custom business wiring local | Repoint imports to original local custom controls |
| `CalcFinanceInsurance`, `CalcLivingCosts`, `JobForm*` locales | Locale/form state regression | mykawan-website | Keep locale workflow forms local; extract only low-risk primitives | Restore local job forms and calculators |
| `ClaimDetailView`, `ClaimExportView`, `ClaimImportView`, `ClaimListView`, `CustomerListView` | Data-heavy view behavior divergence | partner-portal | Preserve container ownership in app; migrate only reusable shells/components | Revert shared shell usage and keep local view modules |
| `(admin)/affiliate/*` high-risk route pages | Workflow and table/filter regression | teman-affiliate-admin | Split table/filter controls from route orchestration before adoption | Revert to local route components and wrappers |
| `KanbanPage`, `tickets/detail/[id]`, `BoardColumn`, `KanbanHeader`, `TaskCard` | Interaction and drag/state regression | ticket-portal | Keep kanban orchestration local; shared migration only for primitives and generic overlays | Restore local kanban component set |
| All entries with `parity_risk=HIGH` in app `_component-backlog.csv` for: `agent-admin`, `agent-web-portal`, `boost-product-fe`, `gegm-friendcover`, `gelm-xproject-microsite`, `gen-ai-portal`, `getrev-da-microsite`, `grab-landing-page`, `haruuz-microsite`, `sso-portal`, `teman-affiliate-microsite`, `teman-affiliate-portal` | Behavior divergence and API mismatch | Listed apps | Use backlog row IDs as authoritative risk inventory; migrate only after per-route parity checks pass | Revert affected shared imports per route/component and restore local implementation |

## Systemic Shared Risks

| Risk | Risk type | Affected apps | Mitigation | Rollback plan |
| --- | --- | --- | --- | --- |
| Token contract mismatch (`@repo/config` currently palette-only) | Visual regression | All consumers of `@repo/ui` | Implement semantic token contract before broad component rollout | Keep local styles and defer shared swap until token gate passes |
| Missing shared dependencies for planned components (`dropdown-menu`, `navigation-menu`, `menubar`, `command`, table tooling) | Build/runtime failure | Apps adopting affected components | Add dependency gate in Batch 3 before implementation start | Pin to previous `@repo/ui` state and disable affected exports |
| Prop naming divergence across apps (`isDisabled`, `kind`, `isOpen`, etc.) | API mismatch | Most apps | Enforce adapters and canonical API lints | Keep adapter compatibility layer until app migrations complete |
| Large shared surface introduced too quickly | Migration instability | Multi-app | Batch rollout by priority (`B3.1` to `B3.5`) with smoke routes per app | Freeze new shared adoption and continue local components temporarily |
