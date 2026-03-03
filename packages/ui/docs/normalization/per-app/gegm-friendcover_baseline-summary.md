# Per-App Baseline Summary - gegm-friendcover

## 1. App Overview

- Framework: Next.js 16 App Router (`react` 19, TypeScript 5.9.2).
- Styling/UI: Tailwind CSS v4, local app components plus `@repo/ui` (`Box` currently exported).
- Data/Form stack: React Hook Form + Zod + React Query/SWR in app layer.

## 2. Component Count Summary

- Total components audited: **89**
- KEEP_APP_LOCAL: **54** | MIGRATE_AFTER_SPLIT: **20** | NEW_SHARED_COMPONENT: **15**

## 3. P0 Critical Needs

- AppPlanGreatShieldActivePage (`src/app/plan/great-shield-active/page.tsx`): MIGRATE_AFTER_SPLIT / HIGH. Run Batch 1.5 split into Container + Shell, then reclassify Shell for shared eligibility.
- AppPlanGreatShieldActivePurchasePersonalInfoPage (`src/app/plan/great-shield-active/purchase/personal-info/page.tsx`): MIGRATE_AFTER_SPLIT / HIGH. Run Batch 1.5 split into Container + Shell, then reclassify Shell for shared eligibility.
- CustomSearchableDropdown (`src/components/custom-searchable-dropdown.tsx`): NEW_SHARED_COMPONENT / LOW. Queue for Phase 04 Batch 4 shared build; keep local implementation until @repo/ui ships.
- DrawerModal (`src/components/drawer-modal.tsx`): NEW_SHARED_COMPONENT / MEDIUM. Queue for Phase 04 Batch 4 shared build; keep local implementation until @repo/ui ships.
- LoadingWrapper (`src/components/loading-wrapper.tsx`): NEW_SHARED_COMPONENT / MEDIUM. Queue for Phase 04 Batch 4 shared build; keep local implementation until @repo/ui ships.
- TextInput (`src/components/text-input.tsx`): NEW_SHARED_COMPONENT / MEDIUM. Queue for Phase 04 Batch 4 shared build; keep local implementation until @repo/ui ships.
- UploadNric (`src/components/upload-nric.tsx`): MIGRATE_AFTER_SPLIT / HIGH. Run Batch 1.5 split into Container + Shell, then reclassify Shell for shared eligibility.
- FormContactDetailsPlaint (`src/forms/contact-details-plaint.tsx`): MIGRATE_AFTER_SPLIT / HIGH. Run Batch 1.5 split into Container + Shell, then reclassify Shell for shared eligibility.
- FormPersonalInfoPlaint (`src/forms/personal-info-plaint.tsx`): MIGRATE_AFTER_SPLIT / HIGH. Run Batch 1.5 split into Container + Shell, then reclassify Shell for shared eligibility.
- ViewGreatHome360Declaration (`src/views/great-home-360-declaration.tsx`): MIGRATE_AFTER_SPLIT / HIGH. Run Batch 1.5 split into Container + Shell, then reclassify Shell for shared eligibility.

## 4. New Shared Components Needed

- **AlertModal** (Feedback): Props: `title`, `description`, `actions`, `loading`; Variants: info/warning/error/success where relevant; States: idle/loading/error.
- **CarouselArrow** (Navigation): Props: `active`, `onSelect`, `disabled`; Variants: default/active; States: hover, active, disabled.
- **CarouselCustomPaging** (Navigation): Props: `active`, `onSelect`, `disabled`; Variants: default/active; States: hover, active, disabled.
- **CheckboxGroup** (Inputs): Props: `label`, `value`, `onChange`, `error`, `disabled`; Variants: default/compact; States: default, focus, error, disabled.
- **ConfirmationModal** (Feedback): Props: `title`, `description`, `actions`, `loading`; Variants: info/warning/error/success where relevant; States: idle/loading/error.
- **ContentScaler** (Layout): Props: `maxWidth`, `padding`, `children`; Variants: mobile/tablet/desktop scale; States: responsive breakpoints.
- **CustomRadioGroup** (Inputs): Props: `label`, `value`, `onChange`, `error`, `disabled`; Variants: default/compact; States: default, focus, error, disabled.
- **CustomSearchableDropdown** (Inputs): Props: `label`, `value`, `onChange`, `error`, `disabled`; Variants: default/compact; States: default, focus, error, disabled.
- **DrawerError** (Feedback): Props: `title`, `description`, `actions`, `loading`; Variants: info/warning/error/success where relevant; States: idle/loading/error.
- **DrawerModal** (Overlays): Props: `open`, `onOpenChange`, `title`, `size`, `children`; Variants: sm/md/lg; States: open, closing, inert background.
- **LoadingWrapper** (Feedback): Props: `title`, `description`, `actions`, `loading`; Variants: info/warning/error/success where relevant; States: idle/loading/error.
- **SubmissionProgressBar** (Feedback): Props: `title`, `description`, `actions`, `loading`; Variants: info/warning/error/success where relevant; States: idle/loading/error.
- **SuspenseFallback** (Feedback): Props: `title`, `description`, `actions`, `loading`; Variants: info/warning/error/success where relevant; States: idle/loading/error.
- **TextArea** (Inputs): Props: `label`, `value`, `onChange`, `error`, `disabled`; Variants: default/compact; States: default, focus, error, disabled.
- **TextInput** (Inputs): Props: `label`, `value`, `onChange`, `error`, `disabled`; Variants: default/compact; States: default, focus, error, disabled.

## 5. Extend Existing Needed

- None. Current `@repo/ui` export surface is only `Box`, so gaps are tracked as NEW_SHARED_COMPONENT or post-split candidates.

## 6. Normalization Deltas

- Hardcoded utility/color classes remain widespread in app-local components; migrate to tokenized class patterns during Phase 05.
- Multiple monolith components mix navigation/business flow with display JSX (`MIGRATE_AFTER_SPLIT` set) and require Batch 1.5 separation before migration batching.
- Framework-bound imports (`next/image`, `next/link`, `next/navigation`) exist in reusable-looking components; these need prop-injection/container-shell separation before sharing.

## 7. High-Risk Parity Items (Top 5)

- FormPersonalInfoPlaint (`src/forms/personal-info-plaint.tsx`, 1236 LOC): preserve multi-step flow behavior, validation messaging, and navigation transitions.
- ViewGreatHome360Declaration (`src/views/great-home-360-declaration.tsx`, 726 LOC): preserve multi-step flow behavior, validation messaging, and navigation transitions.
- UploadNric (`src/components/upload-nric.tsx`, 519 LOC): preserve multi-step flow behavior, validation messaging, and navigation transitions.
- AppPlanGreatShieldActivePurchasePersonalInfoPage (`src/app/plan/great-shield-active/purchase/personal-info/page.tsx`, 414 LOC): preserve multi-step flow behavior, validation messaging, and navigation transitions.
- ViewGreatHome360PersonalInfo (`src/views/great-home-360-personal-info.tsx`, 346 LOC): preserve multi-step flow behavior, validation messaging, and navigation transitions.

## 8. Backlog CSV Row Count

- Rows written: **92** (includes 3 Shell rows added during Batch 1.5).

## 9. SoC Evaluation Summary

- Batch 1.5 candidates: **0 active** (DONE: 3 originals + 3 Shell rows, SKIPPED: 17)
- SoC breakdown: HIGH **10**, MEDIUM **10**, LOW **21**, NONE **48**
- Monolith count: **41**
- Projected NEW_SHARED_COMPONENT candidates from Batch 1.5 splits: **0** (none)

## 10. KEEP_APP_LOCAL Refactor Candidates

- Total KEEP_APP_LOCAL components: **54**
- KEEP_APP_LOCAL with HIGH/MEDIUM SoC potential: **0**
- Top 3 candidates: n/a (HIGH/MEDIUM candidates are currently tracked under `MIGRATE_AFTER_SPLIT` per Batch 1 rule).


## Batch 1.5 Amendment

- Components split: 3 (CardPlan, PlanList, LayoutPurchaseGsaLayout)
- NEW_SHARED_COMPONENT candidates from splits: 0 (none)
- KEEP_APP_LOCAL-only Shells: 3 (CardPlanShell, PlanListShell, PurchaseGsaLayoutShell)
- Explicitly skipped with reason: 17 (documented in _migration-log.md; deferred to Phase 05A where appropriate)
