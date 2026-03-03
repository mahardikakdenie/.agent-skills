# Per-App Baseline Summary - grab-landing-page

## App overview
- Framework: Next.js App Router
- UI stack in app: NextUI + MUI + custom Tailwind classes
- Shared UI surface currently available in `@repo/ui`: `Box` export only

## Component count summary
- Total components audited: 48
- KEEP_APP_LOCAL: 17
- NEW_SHARED_COMPONENT: 20
- MIGRATE_AFTER_SPLIT: 11
- ADOPT_NOW: 0
- ADOPT_WITH_ADAPTER: 0
- EXTEND_EXISTING: 0

## P0 critical needs
- Batch 1.5 split required before migration for: `FooterTransaction`, `ItemProduct`, `HospitalFilterModal`, `HospitalSearchView`, `Compare`, `HeaderCompare`.
- `ReCaptcha` remains app-local and must retain token-generation behavior.

## New shared components needed
- Inputs family: `Checkbox`, `InputText`, `InputEmail`, `InputName`, `InputNumber`, `InputPhone`, `InputCurrency`, `InputSelect`, `InputSelectAutocomplete`, `SelectPhoneCode`, `OtpInput`, `DatePicker`, `FileUpload`, `CustomRadio`.
  Props/variants/states: standardized `label`, `errorMessage`, disabled/readOnly/required flags; size defaults; focus and invalid visuals; loading where applicable.
- Overlays family: `DialogFilter`, `DialogSort`, `AddonInfoModal`.
  Props/variants/states: controlled open-change callbacks; option lists; confirm/cancel actions; default, open, closing, disabled action states.
- Feedback family: `Loader`, `FlashMessage`, `ErrorContent`.
  Props/variants/states: severity and timeout for flash; text payload for error; fallback loading state.

## Extend existing needed
- None in this app batch (current `@repo/ui` surface did not provide matching base exports beyond `Box`).

## Normalization deltas
- Legacy NextUI prop naming (`isDisabled`, `isReadOnly`) needs normalization when moved to shared APIs.
- Hardcoded Tailwind color literals should move to token-driven classes during shared extraction.
- Several components embed Next.js routing/image concerns and require shell abstraction before migration.

## High-risk parity items (top 5)
- HomePage: Behavior tied to cookie prompt and route CTAs
- Compare: Split risk around domain comparison mapping and CTA links
- FooterTransaction: Split risk around premium discount and voucher math
- HeaderCompare: Split risk around exchange conversion and compare card rendering
- HTMLContent: Split risk around remote fetch sanitize and error fallback

## Backlog CSV row count
- 48 rows in `_component-backlog.csv`.

## SoC Evaluation Summary
- Total Batch 1.5 candidates: 11
- SoC potential breakdown: HIGH=4, MEDIUM=7, LOW=11, NONE=26
- Monolith count: 22
- Projected NEW_SHARED_COMPONENT from Batch 1.5 splits: `InfoProductShell`, `ViewImageShell` (2 projected).

## KEEP_APP_LOCAL refactor candidates
- Total KEEP_APP_LOCAL count: 17
- KEEP_APP_LOCAL with SoC HIGH or MEDIUM: 0
- Top 3 candidates: none (all HIGH/MEDIUM candidates are already marked `MIGRATE_AFTER_SPLIT`).

## Batch 1.5 Amendment
- Components split: 11
- NEW_SHARED_COMPONENT candidates from splits: 2 (InfoProductShell, ViewImageShell)
- KEEP_APP_LOCAL-only Shells: 9 (FooterTransactionShell, ItemProductShell, HospitalFilterModalShell, HospitalSearchViewShell, AddonOptionsModalShell, ChangeLangShell, CompareShell, HeaderCompareShell, HTMLContentShell)

