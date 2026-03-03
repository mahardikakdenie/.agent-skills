# Batch 1 Per-App Baseline Summary - getrev-da-microsite

- Total components audited: 84
- Count per classification:
  - ADOPT_NOW: 0
  - ADOPT_WITH_ADAPTER: 0
  - EXTEND_EXISTING: 0
  - NEW_SHARED_COMPONENT: 27
  - KEEP_APP_LOCAL: 41
  - MIGRATE_AFTER_SPLIT: 16

- Top 5 highest-parity-risk items with notes:
  - `src/views/order-personal-info-form/components/complete-personal-info.tsx` (HIGH) - Mixed orchestration/state and display in one component; refactor could break transactional flow parity.
  - `src/views/list-plan/list-plan.view.tsx` (HIGH) - Mixed orchestration/state and display in one component; refactor could break transactional flow parity.
  - `src/views/order-customer-info/order-customer-info.view.tsx` (HIGH) - Mixed orchestration/state and display in one component; refactor could break transactional flow parity.
  - `src/views/order-preview/order-preview.view.tsx` (HIGH) - Mixed orchestration/state and display in one component; refactor could break transactional flow parity.
  - `src/common/components/table-benefit-plan.tsx` (HIGH) - Large, stateful component with multiple conditional render paths and high regression surface.

- Components that EXTEND_EXISTING: none in this app baseline (current @repo/ui export surface is Box-only).

- Components that are NEW_SHARED_COMPONENT (preliminary visual spec):
| Component | Story group | Expected shared API shape (initial) | Variants/states to preserve |
| --- | --- | --- | --- |
| CommonComponentsCheckbox | Inputs | value, onChange/onValueChange, label, error, disabled, required | default, focus, error, disabled, loading |
| CommonComponentsDatepicker | Inputs | value, onChange/onValueChange, label, error, disabled, required | default, focus, error, disabled, loading |
| CommonComponentsErrorContent | Feedback | status/message/loading toggles | idle, loading, success, error |
| CommonComponentsFileInput | Inputs | value, onChange/onValueChange, label, error, disabled, required | default, focus, error, disabled, loading |
| CommonComponentsFlashMessage | Feedback | status/message/loading toggles | idle, loading, success, error |
| CommonComponentsFormStep | Layout | content + slots | default + responsive |
| CommonComponentsInputAffiliate | Inputs | value, onChange/onValueChange, label, error, disabled, required | default, focus, error, disabled, loading |
| CommonComponentsInputCurrency | Inputs | value, onChange/onValueChange, label, error, disabled, required | default, focus, error, disabled, loading |
| CommonComponentsInputEmail | Inputs | value, onChange/onValueChange, label, error, disabled, required | default, focus, error, disabled, loading |
| CommonComponentsInputName | Inputs | value, onChange/onValueChange, label, error, disabled, required | default, focus, error, disabled, loading |
| CommonComponentsInputNumber | Inputs | value, onChange/onValueChange, label, error, disabled, required | default, focus, error, disabled, loading |
| CommonComponentsInputPhone | Inputs | value, onChange/onValueChange, label, error, disabled, required | default, focus, error, disabled, loading |
| CommonComponentsInputSelectAutocomplete | Inputs | value, onChange/onValueChange, label, error, disabled, required | default, focus, error, disabled, loading |
| CommonComponentsInputSelect | Inputs | value, onChange/onValueChange, label, error, disabled, required | default, focus, error, disabled, loading |
| CommonComponentsInputText | Inputs | value, onChange/onValueChange, label, error, disabled, required | default, focus, error, disabled, loading |
| CommonComponentsLoader | Feedback | status/message/loading toggles | idle, loading, success, error |
| CommonComponentsModalAcceptCookie | Overlays | isOpen, onOpenChange/onClose, title/body/actions slots | open/close, confirm/cancel, keyboard dismissal |
| CommonComponentsModalSort | Overlays | isOpen, onOpenChange/onClose, title/body/actions slots | open/close, confirm/cancel, keyboard dismissal |
| CommonComponentsModalSuccess | Overlays | isOpen, onOpenChange/onClose, title/body/actions slots | open/close, confirm/cancel, keyboard dismissal |
| CommonComponentsModalTransactionNotFound | Overlays | isOpen, onOpenChange/onClose, title/body/actions slots | open/close, confirm/cancel, keyboard dismissal |
| CommonComponentsNavigationBar | Navigation | title, back action/slot, optional actions | default + responsive |
| CommonComponentsSelectPhoneCode | Inputs | value, onChange/onValueChange, label, error, disabled, required | default, focus, error, disabled, loading |
| CommonComponentsViewImage | Overlays | isOpen, onOpenChange/onClose, title/body/actions slots | open/close, confirm/cancel, keyboard dismissal |
| ViewsHomeComponentsAlertAgeLimit | Feedback | status/message/loading toggles | idle, loading, success, error |
| ViewsListPlanComponentsAlertAgeLimit | Feedback | status/message/loading toggles | idle, loading, success, error |
| ViewsOrderChangePlanComponentsAlertAgeLimit | Feedback | status/message/loading toggles | idle, loading, success, error |
| ViewsOrderPaymentMethodComponentsRadioGroup | Inputs | value, onChange/onValueChange, label, error, disabled, required | default, focus, error, disabled, loading |

- KEEP_APP_LOCAL refactor candidates:
  - Total KEEP_APP_LOCAL count: 41
  - KEEP_APP_LOCAL with SoC potential HIGH or MEDIUM: 0
  - Top 3 KEEP_APP_LOCAL refactor candidates:
    - `src/common/components/table-benefit-plan.tsx` - strategy: none; shell candidate for packages/ui: NO
    - `src/views/order-preview/components/card-personal-info.tsx` - strategy: none; shell candidate for packages/ui: NO
    - `src/common/components/header-product-detail.tsx` - strategy: hook-extraction; shell candidate for packages/ui: NO

- SoC Evaluation Summary:
  - Total Batch 1.5 candidates: 16
  - Breakdown HIGH/MEDIUM/LOW/NONE: 8/8/9/59
  - Projected NEW_SHARED_COMPONENT from splits: 16


## Batch 1.5 Amendment

- Components split: 14
- NEW_SHARED_COMPONENT candidates from splits: 0
- KEEP_APP_LOCAL-only Shells: 14
- Split components:
  - AppCallbackHandlersAuthPage
  - AppCallbackHandlersVerifyPaymentPage
  - AppAgentCodeSlugPage
  - AppFreeLookNotificationPage
  - AppPaymentSuccessPage
  - ViewsHomeHome.view
  - ViewsListPlanListPlan.view
  - ViewsOrderChangePlanOrderChangePlan.view
  - ViewsOrderCustomerInfoOrderCustomerInfo.view
  - ViewsOrderDeclarationOrderDeclaration.view
  - ViewsOrderPaymentMethodOrderPaymentMethod.view
  - ViewsOrderPersonalInfoFormOrderPersonalInfoForm.view
  - ViewsOrderPersonalInfoOrderPersonalInfo.view
  - ViewsOrderPreviewOrderPreview.view
- Explicitly skipped in Batch 1.5 (documented):
  - ViewsOrderPersonalInfoFormComponentsCompletePersonalInfo
  - ViewsOrderPersonalInfoFormComponentsUploadImage
- Notes: all created shells remain app-local in this app; no cross-app-demand-ready shell identified in this pass.
