## Batch 1 - Per-App Baseline Summary (sso-portal)

### Total components audited
- Total audited: 22

### Count per classification
- MIGRATE_AFTER_SPLIT: 6
- NEW_SHARED_COMPONENT: 4
- KEEP_APP_LOCAL: 12
- ADOPT_NOW: 0
- ADOPT_WITH_ADAPTER: 0
- EXTEND_EXISTING: 0

### Top 5 highest-parity-risk items
1. SelectPhoneCode (`src/common/components/select-phone-code.tsx`) - HIGH. Query-param to UI behavior/theme coupling.
2. LoginPage (`src/app/[lang]/login/page.tsx`) - HIGH. Route guard and mode-switch logic.
3. OtpPage (`src/app/[lang]/otp/page.tsx`) - HIGH. Route bootstrap and redirect behavior.
4. ReCaptcha (`src/common/components/ReCaptcha.tsx`) - MEDIUM. Runtime script + token lifecycle orchestration.
5. NavigationBar (`src/common/components/navigation-bar.tsx`) - MEDIUM. Language/back controls mixed with shell layout.

### Components that EXTEND_EXISTING
- None in this app.
- Missing variants in @repo/ui: N/A for Batch 1 (no EXTEND_EXISTING entries).

### Components that are NEW_SHARED_COMPONENT (visual spec)

#### OtpInput (`src/common/components/otp-input.tsx`)
- Proposed props: `length`, `value`, `onChange`, `disabled`, `error`, `autoFocus`.
- Variants: `size` (`sm|md|lg`), `status` (`default|error|success`).
- States: empty, focused cell, filled, disabled, error.
- Story group: `Inputs`.

#### Loader (`src/common/components/loader.tsx`)
- Proposed props: `size`, `label`, `className`.
- Variants: `size` (`sm|md|lg`).
- States: default, inline, full-screen wrapper usage.
- Story group: `Feedback`.

#### FlashMessage (`src/common/components/flash-message.tsx`)
- Proposed props: `variant`, `title`, `description`, `onClose`, `autoHideMs`.
- Variants: `info|success|warning|error`.
- States: visible, dismissing, persistent, auto-hide timeout.
- Story group: `Feedback`.

#### ErrorContent (`src/common/components/error-content.tsx`)
- Proposed props: `title`, `description`, `icon`, `actions`.
- Variants: `inline|full-page`.
- States: default error, retry action, custom icon.
- Story group: `Feedback`.

### KEEP_APP_LOCAL refactor candidates
- Total KEEP_APP_LOCAL components: 12
- KEEP_APP_LOCAL with SoC potential HIGH or MEDIUM: 2
- Top candidates:
  - LoginPage - strategy `container-shell`; Shell as `packages/ui` candidate: NO (route-specific).
  - OtpPage - strategy `container-shell`; Shell as `packages/ui` candidate: NO (route/service bootstrap specific).

### SoC Evaluation Summary
- Total Batch 1.5 candidates: 8
- SoC potential breakdown:
  - HIGH: 1
  - MEDIUM: 7
  - LOW: 9
  - NONE: 5
- Projected NEW_SHARED_COMPONENT from splits (post Batch 1.5): 4
  - SelectPhoneCodeShell, NavigationBarShell, ModalSuccessShell, FileUploadShell (tentative).

## Batch 1.5 Amendment
- Components split: 8
- NEW_SHARED_COMPONENT candidates from splits: 6
  - SelectPhoneCodeShell
  - ReCaptchaShell
  - NavigationBarShell
  - ModalSuccessShell
  - FileUploadShell
  - ButtonHeaderShell
- KEEP_APP_LOCAL-only Shells: 2
  - LoginPageShell
  - OtpPageShell

## Legacy Update Amendment - 2026-03-04 12:49 (+07)
- Legacy intake classified:
  - MicrosoftLoginButton -> KEEP_APP_LOCAL
- Guardrail applied:
  - select-phone-code.tsx kept in Container/Shell architecture (no monolith rollback), with country list update retained (+7 Russia).
- Updated totals:
  - Total audited: 22
  - KEEP_APP_LOCAL: 12