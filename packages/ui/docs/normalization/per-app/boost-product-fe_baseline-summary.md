# Per-App Baseline Summary - boost-product-fe (Batch 1)

## Scope
- Audit target: `components/**/*.tsx` and route/layout UI files under `app/**/page.tsx` plus `app/layout.tsx`
- `@repo/ui` baseline for this audit: `packages/ui/src/index.ts` exports only `Box`
- Total components audited: **43**

## Classification Counts
- `NEW_SHARED_COMPONENT`: **16**
- `MIGRATE_AFTER_SPLIT`: **10**
- `KEEP_APP_LOCAL`: **17**
- `ADOPT_NOW`: **0**
- `ADOPT_WITH_ADAPTER`: **0**
- `EXTEND_EXISTING`: **0**

## Top 5 Highest Parity-Risk Items
1. `components/plan-detail-management.tsx` - Multi-tab plan detail flows with pricing and commission CRUD across multiple services.
2. `components/product-management.tsx` - Largest product lifecycle screen with approval actions and many dependent datasets.
3. `components/campaign-management.tsx` - Reward logic and approval lifecycle mixed with large modal-driven CRUD.
4. `components/plan-management.tsx` - Approval transitions plus product linkage and status filtering.
5. `components/insurance-management.tsx` - Markdown content rendering plus destructive actions and dialog-heavy edits.

## EXTEND_EXISTING Findings
- No `EXTEND_EXISTING` components were identified in this app because no relevant component exports currently exist in `packages/ui/src/index.ts` beyond `Box`.
- Missing variants/props list: **None for Batch 1 in this app**.

## NEW_SHARED_COMPONENT Visual Spec Baseline
These components are strong shared candidates with no domain logic and reusable API shapes.

### Inputs group
- Components: `Input`, `Textarea`, `Label`, `Checkbox`, `Select`, `Command primitives`
- Core props: `value`, `defaultValue`, `onChange` or `onValueChange`, `disabled`, `required`, `placeholder`, `className`
- Variants and sizes: align to design-system conventions (`variant`, `size` where relevant)
- Required states: default, focus-visible, disabled, invalid, loading (where async lookups exist)

### Buttons and feedback group
- Components: `Button`, `Badge`, `ClientErrorBoundary`
- Core props:
  - Button: `variant`, `size`, `asChild`, `disabled`, `onClick`
  - Badge: semantic status variants and optional icon slot
  - ErrorBoundary: `children`, fallback override slot, optional retry callback
- Required states: default, hover, active, disabled, destructive, pending

### Overlays and navigation group
- Components: `Dialog primitives`, `Popover primitives`, `Tooltip primitives`, `DropdownMenu primitives`, `Tabs primitives`
- Core props: controlled and uncontrolled open/value APIs (`open`, `onOpenChange`, `value`, `onValueChange`), trigger/content slots, `side` and alignment controls
- Required states: open and closed animation states, keyboard navigation, focus trap where applicable

### Data display and layout group
- Components: `Table primitives`, `Card primitives`
- Core props: structural slot composition (header/body/footer), row and cell class overrides, semantic heading and description support
- Required states: empty, loading placeholder wrappers, dense and default spacing modes

## KEEP_APP_LOCAL Refactor Candidates
- Total `KEEP_APP_LOCAL`: **17**
- `KEEP_APP_LOCAL` with SoC potential `HIGH` or `MEDIUM`: **0**
- Top 3 deferred refactor candidates (LOW potential only):
  1. `components/dashboard-layout.tsx` - Strategy: `prop-injection`; `packages/ui` shell candidate: **No**
  2. `app/sso-login/page.tsx` - Strategy: `hook-extraction`; `packages/ui` shell candidate: **No**
  3. `app/auth/callback/page.tsx` - Strategy: `hook-extraction`; `packages/ui` shell candidate: **No**

## SoC Evaluation Summary
- Total Batch 1.5 candidates (`HIGH` or `MEDIUM`): **10**
- SoC potential breakdown (all 43 audited components):
  - `HIGH`: **2**
  - `MEDIUM`: **8**
  - `LOW`: **4**
  - `NONE`: **29**
- Projected `NEW_SHARED_COMPONENT` candidates from post-split shells: **6**
  - Candidate shell patterns: `CrudPageShell`, `EntityTableSection`, `EntityFormDialog`, `ApprovalActions`, `DetailTabsShell`, `AsyncStatePanel`

## Batch 1.5 Amendment
- Components split: 10 (`HomePage`, `SettingsManagement`, `CategoryManagement`, `ProductDetailManagement`, `PlanManagement`, `CampaignManagement`, `EligibilityManagement`, `InsuranceManagement`, `ProductManagement`, `PlanDetailManagement`)
- NEW_SHARED_COMPONENT candidates from splits: 0
- KEEP_APP_LOCAL-only Shells: 10 (`HomePageShell`, `SettingsManagementShell`, `CategoryManagementShell`, `ProductDetailManagementShell`, `PlanManagementShell`, `CampaignManagementShell`, `EligibilityManagementShell`, `InsuranceManagementShell`, `ProductManagementShell`, `PlanDetailManagementShell`)
- Explicitly skipped Batch 1.5 candidates: none