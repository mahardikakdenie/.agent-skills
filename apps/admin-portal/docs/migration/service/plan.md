# Enterprise Service Layer Refactoring - admin-portal

**Why Colocation**
- Reduce cross-folder jumps and make service ownership obvious.
- Keep API endpoints, types, and hooks together per domain.
- Enable incremental migration without breaking existing flows.
- Make new services easy to add and old ones easy to remove.

**Directory Structure**
```text
src/
|-- lib/
|   |-- api-client/
|   |-- react-query/
|-- services/
|   |-- [service-name]/
|   |   |-- api/
|   |   |   |-- [service].endpoints.ts
|   |   |   |-- [service].types.ts
|   |   |   |-- [service].service.ts
|   |   |-- hooks/
|   |   |   |-- queries/
|   |   |   |-- mutations/
|   |   |-- query-keys.ts
|-- types/
|-- utils/
|-- hooks/
```

**Base URL Mapping**
- `NEXT_PUBLIC_AUTH_SERVICE_URL` -> Auth Service
- `NEXT_PUBLIC_API_CLAIM_BASE_URL` -> Claim Service
- `NEXT_PUBLIC_API_POLICY_BASE_URL` -> Policy Service
- `NEXT_PUBLIC_TRANSACTION_SERVICE_URL` -> Transaction Service
- `NEXT_PUBLIC_CHANNEL_SERVICE_URL` -> Channel Service
- `NEXT_PUBLIC_FINANCE_SERVICE_URL` -> Finance Service
- `NEXT_PUBLIC_HELPER_SERVICE_URL` -> Helper Service
- `NEXT_PUBLIC_PRODUCT_SERVICE_URL` -> Product Service
- `NEXT_PUBLIC_PROMOTION_SERVICE_URL` -> Promotion Service
- `NEXT_PUBLIC_SANCTION_SERVICE_URL` -> Sanction Service
- `NEXT_PUBLIC_COUNTRY_SERVICE_URL` -> Country Service
- `NEXT_PUBLIC_PDF_SERVICE_URL` -> PDF Service
- `NEXT_PUBLIC_REPORT_SERVICE_URL` -> Report Service
- `window.location.origin` with `/api` -> Admin-Portal Internal API

**Implementation Checklist**
- Phase 3: Foundation. Create shared API client and React Query setup.
- Phase 4A: API layer. Implement endpoints, types, and service files for all services.
- Phase 4A: Verification gate. Run and fix before continuing.
- Phase 4B: Query keys and hooks. Add query keys, query hooks, mutation hooks for all services.
- Phase 4B: Hook options. Every query and mutation hook accepts an optional `options` param and composes `options?.onSuccess` when adding invalidations.
- Phase 4B: Verification gate. Run and fix before continuing.
- Phase 5: Component migration. Move one feature at a time to new hooks.
- Phase 5: Verification gate. Run after all migrations.
- Phase 6: Cleanup and docs. Remove legacy services and update docs.
- Phase 6: Verification gate. Run and fix before finishing.

**Per-Service Plan**

**Auth Service**
Base URL: `NEXT_PUBLIC_AUTH_SERVICE_URL`
Endpoints:
- `/login`
- `/account`
- `/account/:id`
- `/account/all-data/pagination`
- `/account/all-data/:id`
- `/v1/account/partner`
- `/v1/account/:id/change-password`
- `/v1/account-groups`
- `/v1/account-roles`
- `/v1/account-channels`
- `/v1/account-channels/account/:accountId`
- `/v1/account-insurers`
- `/v1/account-insurers/:id`
- `/v1/account-insurers/account/:accountId`
- `/v1/group`
- `/v1/group-roles`
- `/role`
- `/pages`
- `/v1/permission`
- `/v1/permission/page/:pageId`
- `/v1/role-permission`
- `/v1/role-permission/:id`
Types:
- `LoginCredentials`, `LoginResponse`
- `User`, `Channel`, `Role`
- `RoleResponse`, `PermissionResponse`
- `PagesResponse`
- `GroupResponse`, `UserResponse`, `AccountGroup`
Query Keys Outline:
- `authKeys.accounts`, `authKeys.accountDetail`, `authKeys.accountAllData`, `authKeys.accountPartners`
- `authKeys.accountChannels`, `authKeys.accountInsurers`
- `authKeys.groups`, `authKeys.groupDetail`, `authKeys.groupRoles`
- `authKeys.roles`, `authKeys.roleDetail`
- `authKeys.pages`, `authKeys.pageDetail`
- `authKeys.permissions`, `authKeys.permissionDetail`, `authKeys.permissionByPage`
- `authKeys.rolePermissions`
Query Hooks:
- `useAccounts`
- `useAccountDetail`
- `useAccountAllData`
- `useAccountAllDataDetail`
- `useAccountPartners`
- `useAccountChannelsByAccount`
- `useAccountInsurersByAccount`
- `useGroups`
- `useGroupDetail`
- `useRoles`
- `useRoleDetail`
- `usePages`
- `usePageDetail`
- `usePermissions`
- `usePermissionDetail`
- `usePermissionByPage`
Mutation Hooks:
- `useLogin`
- `useCreateAccount`
- `useUpdateAccount`
- `useDeleteAccount`
- `useChangeAccountPassword`
- `useAddAccountGroup`
- `useRemoveAccountGroup`
- `useAddAccountRole`
- `useRemoveAccountRole`
- `useAddAccountChannel`
- `useRemoveAccountChannel`
- `useAddAccountInsurer`
- `useRemoveAccountInsurer`
- `useCreateGroup`
- `useUpdateGroup`
- `useDeleteGroup`
- `useAddGroupRole`
- `useRemoveGroupRole`
- `useCreateRole`
- `useUpdateRole`
- `useDeleteRole`
- `useCreatePage`
- `useUpdatePage`
- `useDeletePage`
- `useCreatePermission`
- `useUpdatePermission`
- `useDeletePermission`
- `useCreateRolePermission`
- `useDeleteRolePermission`

**Claim Service**
Base URL: `NEXT_PUBLIC_API_CLAIM_BASE_URL`
Endpoints:
- `/v1/claims`
- `/v1/claims/:id`
- `/v1/claims/submit/:id`
- `/v1/claims/update-status/:id`
- `/v1/claims/configurations`
- `/v1/claims/export`
- `/v1/claims/import`
- `/v1/claims/import-data-guide`
- `/v1/claims/claim-list-limit`
- `/v1/claims/statistic-data`
- `/v1/claim-histories`
- `/v1/claim-category-forms/all/:id`
- `/v1/claim-channel-forms/all/:id`
Types:
- `Claim`, `Participant`, `ClaimHistory`
- `ListClaimResponse`, `ListClaimHistoryResponse`
- `ClaimFormsRequest`, `UpdateClaimGrabRequest`
Query Keys Outline:
- `claimKeys.lists`, `claimKeys.list`, `claimKeys.detail`
- `claimKeys.configurations`, `claimKeys.statistics`, `claimKeys.listLimit`
- `claimKeys.histories`
- `claimKeys.categoryForms`, `claimKeys.channelForms`
Query Hooks:
- `useClaims`
- `useClaimDetail`
- `useClaimConfigurations`
- `useClaimStatistics`
- `useClaimListLimit`
- `useClaimHistories`
- `useClaimCategoryForms`
- `useClaimChannelForms`
Mutation Hooks:
- `useUpdateClaim`
- `useSubmitClaim`
- `useUpdateClaimStatus`
- `useImportClaims`
- `useExportClaims`

**Policy Service**
Base URL: `NEXT_PUBLIC_API_POLICY_BASE_URL`
Endpoints:
- `/v1/policies`
- `/v1/policies/:id`
- `/v1/policies/statistic-data`
- `/v1/policies/upload/drgadget`
- `/v1/policies/:id/renew`
- `/v1/endorsements`
- `/v1/endorsements/:id`
- `/v1/endorsements/update-status/:id`
- `/v1/endorsements/update-status-bulking/:id`
- `/v1/endorsements/bulking`
- `/v1/policies/master/:channelId?is_only_master_policy=true`
- `/v1/insured-parties`
- `/v1/insured-parties/:id`
- `/v1/insured-parties/statistic-data`
- `/v1/insured-parties/channel/:channelId`
- `/v1/insured-parties/upload-first-time`
- `/v1/insured-parties/upload-first-time-without-transaction`
Types:
- `PolicyData`, `Participant`, `PolicyProductResponse`
- `MembershipData`, `MembershipProductResponse`
- `EndorsementResponse`
Query Keys Outline:
- `policyKeys.policies`, `policyKeys.policyDetail`, `policyKeys.policyStats`
- `policyKeys.masterPolicies`
- `policyKeys.endorsements`, `policyKeys.endorsementDetail`
- `policyKeys.insuredParties`, `policyKeys.insuredPartyDetail`, `policyKeys.insuredPartyStats`
Query Hooks:
- `usePolicies`
- `usePolicyDetail`
- `usePolicyStatistics`
- `useMasterPoliciesByChannel`
- `useEndorsements`
- `useEndorsementDetail`
- `useInsuredParties`
- `useInsuredPartyDetail`
- `useInsuredPartyStatistics`
Mutation Hooks:
- `useUpdatePolicy`
- `useRenewPolicy`
- `useUploadPolicies`
- `useUpdateEndorsementStatus`
- `useUpdateEndorsementStatusBulking`
- `useBulkCreateEndorsements`
- `useUpdateInsuredPartyChannel`
- `useUploadInsuredPartiesFirstTime`
- `useUploadInsuredPartiesFirstTimeWithoutTransaction`

**Transaction Service**
Base URL: `NEXT_PUBLIC_TRANSACTION_SERVICE_URL`
Endpoints:
- `/v1/transactions`
- `/v1/transactions/:id`
- `/v1/transactions/payment/:id`
- `/v1/transactions/update-status/:id`
- `/v1/transactions/bulk-create/:id`
- `/v1/transactions/statistic-data`
- `/v1/transactions/conventional`
- `/v1/customers`
- `/v1/customers/campaign`
- `/v1/campaigns/report/:id`
Types:
- `Transaction`, `Customer`, `Insurance`, `TransactionFee`, `Participant`
Query Keys Outline:
- `transactionKeys.transactions`, `transactionKeys.transactionDetail`, `transactionKeys.transactionStats`
- `transactionKeys.customers`, `transactionKeys.customerCampaigns`
- `transactionKeys.campaignReports`
Query Hooks:
- `useTransactions`
- `useTransactionDetail`
- `useTransactionStatistics`
- `useTransactionsConventional`
- `useCustomers`
- `useCustomerCampaigns`
- `useCampaignReport`
Mutation Hooks:
- `useUpdateTransactionStatus`
- `useCreateTransactionPayment`
- `useBulkCreateTransactions`
- `useUpdateCampaignReport`

**Channel Service**
Base URL: `NEXT_PUBLIC_CHANNEL_SERVICE_URL`
Endpoints:
- `/channels`
- `/channels/:id`
- `/v1/channels`
- `/v1/channels/:id`
Types:
- `PromotionResponse`
- `ChannelsResponse`
- `Channel`
Query Keys Outline:
- `channelKeys.channels`, `channelKeys.channelDetail`
Query Hooks:
- `useChannels`
- `useChannelDetail`
Mutation Hooks:
- `useCreateChannel`
- `useUpdateChannel`
- `useDeleteChannel`

**Finance Service**
Base URL: `NEXT_PUBLIC_FINANCE_SERVICE_URL`
Endpoints:
- `/v1/billings`
- `/v1/billings/:id`
- `/v1/billings/:id/confirm-reconcilliation`
- `/v1/billings/not-match-reconcilliation`
- `/v1/billings/import/transactions`
- `/v1/fees/broker`
- `/v1/fees/broker-filter`
- `/v1/fees/broker/:id`
- `/v1/fees/channel`
- `/v1/fees/channel-filter`
- `/v1/fees/channel/:channelId`
- `/v1/fees/channel/:id`
- `/api/voucher/code/:code`
- `/v1/plans/`
Types:
- None defined in legacy services. Add as discovered during implementation.
Query Keys Outline:
- `financeKeys.billings`, `financeKeys.billingDetail`
- `financeKeys.feesBroker`, `financeKeys.feesBrokerDetail`
- `financeKeys.feesChannel`, `financeKeys.feesChannelDetail`
- `financeKeys.voucherByCode`
Query Hooks:
- `useBillings`
- `useBillingDetail`
- `useBrokerFees`
- `useBrokerFeeDetail`
- `useChannelFees`
- `useChannelFeeDetail`
- `useVoucherByCode`
Mutation Hooks:
- `useCreateBilling`
- `useUpdateBilling`
- `useConfirmBillingReconciliation`
- `useCreateNotMatchReconciliation`
- `useImportTransactions`
- `useCreateVoucherPlan`

**Helper Service**
Base URL: `NEXT_PUBLIC_HELPER_SERVICE_URL`
Endpoints:
- `/v1/html2pdf`
- `/v1/html2pdf/generate-pdf-service`
- `/v1/calendar`
- `/v1/calendar/:id`
Types:
- None defined in legacy services. Add as discovered during implementation.
Query Keys Outline:
- `helperKeys.calendar`, `helperKeys.calendarDetail`
Query Hooks:
- `useCalendar`
- `useCalendarDetail`
Mutation Hooks:
- `useHtmlToPdf`
- `useGeneratePdfService`
- `useCreateCalendar`
- `useUpdateCalendar`
- `useDeleteCalendar`

**Product Service**
Base URL: `NEXT_PUBLIC_PRODUCT_SERVICE_URL`
Endpoints:
- `/v1/products`
- `/v1/products/:id`
- `/v1/categories`
- `/v1/categories/:id`
- `/v1/categories/channel/:channelId`
- `/v1/insurances`
- `/v1/insurances/:id`
- `/insurances`
- `/insurances/:id`
- `/v1/insurances/:insuranceId/currencies`
- `/v1/insurances/:insuranceId/currencies/:currencyId`
- `/v1/plans`
- `/v1/plans/:id`
- `/v1/plans?productIds[]=`
- `/v1/plans?insuranceId=...&category=...`
- `/v1/plans?page=...&pageSize=...`
- `/plan/:id`
- `/v1/plans/:id/benefits`
- `/v1/plans/:id/details/:type`
- `/v1/plans/bulk-create/:id/:type`
- `/v1/plans/sync/embedded-discounts`
- `/v1/plan-benefit/create`
- `/v1/plan-benefit/bulk-create/:id`
- `/v1/plan-benefit/:id`
- `/v1/packages`
- `/v1/packages/:id`
- `/v1/packages?active=true&planId=...`
- `packages/:category/bulk-create/:id`
- `/v1/channel-packages/assign-plans`
- `/v1/channel-packages/unassign-plans`
- `/v1/channel-packages/plans/?channel=...`
- `/v1/plans/:planId/channels`
- `/v1/references/type/currencies`
- `/v1/references/type/email-journey`
- `/v1/references/type/grab-provider-hospital`
- `/v1/references/upload/grab-provider-hospital`
- `/v1/email-tags`
- `/v1/email-tags/:id`
- `/v1/email-templates/journey`
- `/v1/email-templates/journey/:id`
- `/product-config/:type`
Types:
- `ProductCatalogDto`, `PackageDto`, `ProductList`, `ProductDto`, `InsuranceDto`
- `ProductConfig`, `ProductConfigResponse`
- `ProductResponse`, `CategoriesResponse`, `InsurancesResponse`
- `ProductCategories`
- `Insurance`
- `CurrencyResponse`, `TypeCurreciesResponse`
- `EmailTagResponse`, `MailTemplateResponse`
Query Keys Outline:
- `productKeys.products`, `productKeys.productDetail`
- `productKeys.categories`, `productKeys.categoryDetail`, `productKeys.categoriesByChannel`
- `productKeys.insurances`, `productKeys.insuranceDetail`, `productKeys.insuranceCurrencies`
- `productKeys.plans`, `productKeys.planDetail`, `productKeys.planBenefits`, `productKeys.planDetailsByType`
- `productKeys.packages`, `productKeys.channelPackages`, `productKeys.planChannels`
- `productKeys.references`, `productKeys.emailTags`, `productKeys.emailTemplates`
- `productKeys.productConfig`
Query Hooks:
- `useProducts`
- `useProductDetail`
- `useCategories`
- `useCategoryDetail`
- `useCategoriesByChannel`
- `useInsurances`
- `useInsuranceDetail`
- `useInsuranceCurrencies`
- `usePlans`
- `usePlanDetail`
- `usePlanBenefits`
- `usePlanDetailsByType`
- `usePackages`
- `useChannelPackages`
- `usePlansByChannel`
- `useReferencesByType`
- `useEmailTags`
- `useEmailTagDetail`
- `useEmailTemplatesJourney`
- `useEmailTemplateJourneyDetail`
- `useProductConfig`
Mutation Hooks:
- `useCreateProduct`
- `useUpdateProduct`
- `useDeleteProduct`
- `useCreateCategory`
- `useUpdateCategory`
- `useDeleteCategory`
- `useCreateInsurance`
- `useUpdateInsurance`
- `useDeleteInsurance`
- `useCreateInsuranceCurrency`
- `useUpdateInsuranceCurrency`
- `useDeleteInsuranceCurrency`
- `useCreatePlan`
- `useUpdatePlan`
- `useDeletePlan`
- `useBulkCreatePlans`
- `useSyncEmbeddedDiscounts`
- `useCreatePlanBenefit`
- `useBulkCreatePlanBenefit`
- `useUpdatePlanBenefit`
- `useDeletePlanBenefit`
- `useCreatePackage`
- `useUpdatePackage`
- `useDeletePackage`
- `useBulkCreatePackagesByCategory`
- `useAssignChannelPlans`
- `useUnassignChannelPlans`
- `useUpdatePlanChannels`
- `useUploadReferenceHospital`
- `useCreateEmailTag`
- `useUpdateEmailTag`
- `useDeleteEmailTag`
- `useCreateEmailTemplateJourney`
- `useUpdateEmailTemplateJourney`
- `useDeleteEmailTemplateJourney`
- `useUpdateProductConfig`

**Promotion Service**
Base URL: `NEXT_PUBLIC_PROMOTION_SERVICE_URL`
Endpoints:
- `/v1/campaign`
- `/v1/campaign/:id`
- `/v1/campaign/search/query`
- `/v1/campaign/report`
- `/v1/campaign/report/insurance`
- `/v1/campaign/report/export`
- `/v1/campaign/report/export/insurance`
- `/v1/campaign/embedded/history/:id`
- `/v1/campaign/delete/:id`
- `/v1/campaign/update/:id`
- `/v1/voucher/:id`
- `/v1/voucher/code/:code`
- `/v1/plans/`
Types:
- `PromotionResponse`
Query Keys Outline:
- `promotionKeys.campaigns`, `promotionKeys.campaignDetail`
- `promotionKeys.campaignSearch`
- `promotionKeys.campaignReport`, `promotionKeys.campaignReportInsurance`
- `promotionKeys.campaignHistory`
- `promotionKeys.voucherDetail`, `promotionKeys.voucherByCode`
Query Hooks:
- `useCampaigns`
- `useCampaignDetail`
- `useCampaignSearch`
- `useCampaignReport`
- `useCampaignReportInsurance`
- `useCampaignHistory`
- `useVoucherDetail`
- `useVoucherByCode`
Mutation Hooks:
- `useCreateCampaign`
- `useUpdateCampaign`
- `useDeleteCampaign`
- `useExportCampaignReport`
- `useExportCampaignReportInsurance`
- `useCreateVoucherPlan`

**Sanction Service**
Base URL: `NEXT_PUBLIC_SANCTION_SERVICE_URL`
Endpoints:
- `/v1/sources`
- `/v1/sources/:id`
- `/v1/sources/paging`
- `/v1/sources/delete/:id`
- `/v1/sources/update/:id`
- `/v1/blacklist`
- `/v1/blacklist/:id`
- `/v1/blacklist/delete/:id`
- `/v1/blacklist/update/:id`
Types:
- `Response`, `Insurer`
Query Keys Outline:
- `sanctionKeys.sources`, `sanctionKeys.sourceDetail`, `sanctionKeys.sourcePaging`
- `sanctionKeys.blacklist`, `sanctionKeys.blacklistDetail`
Query Hooks:
- `useSources`
- `useSourceDetail`
- `useSourcesPaging`
- `useBlacklist`
- `useBlacklistDetail`
Mutation Hooks:
- `useCreateSource`
- `useUpdateSource`
- `useDeleteSource`
- `useCreateBlacklist`
- `useUpdateBlacklist`
- `useDeleteBlacklist`

**Country Service**
Base URL: `NEXT_PUBLIC_COUNTRY_SERVICE_URL`
Endpoints:
- `/countries`
Types:
- `Response`
Query Keys Outline:
- `countryKeys.countries`
Query Hooks:
- `useCountries`
Mutation Hooks:
- None expected.

**PDF Service**
Base URL: `NEXT_PUBLIC_PDF_SERVICE_URL`
Endpoints:
- `/pdf-generate`
Types:
- None defined in legacy services. Add as discovered during implementation.
Query Keys Outline:
- None expected.
Query Hooks:
- None expected.
Mutation Hooks:
- `useGeneratePdf`

**Report Service**
Base URL: `NEXT_PUBLIC_REPORT_SERVICE_URL`
Endpoints:
- `/v1/notification-logs`
- `/v1/notification-logs/:id`
Types:
- `NotificationLog`
- `NotificationLogsResponse`
- `GetNotificationLogsParams`
Query Keys Outline:
- `reportKeys.notificationLogs`
- `reportKeys.notificationLogsList`
- `reportKeys.notificationLogDetail`
Query Hooks:
- `useNotificationLogs`
- `useNotificationLogDetail`
Mutation Hooks:
- None expected.

**Admin-Portal Internal API**
Base URL: `window.location.origin` with `/api`
Endpoints:
- `/api/cookie`
- `/api/cookie/:key`
Types:
- None defined in legacy services. Add as discovered during implementation.
Query Keys Outline:
- `internalKeys.cookie`, `internalKeys.cookieByKey`
Query Hooks:
- `useCookie`
- `useCookieByKey`
Mutation Hooks:
- `useSetCookie`
- `useDeleteCookie`

**Example Service**
Service: `claims`
Base URL: `NEXT_PUBLIC_API_CLAIM_BASE_URL`
Example structure:
```text
src/services/claims/
|-- api/
|   |-- claims.endpoints.ts
|   |-- claims.types.ts
|   |-- claims.service.ts
|-- hooks/
|   |-- queries/
|   |   |-- useClaims.ts
|   |   |-- useClaimDetail.ts
|   |-- mutations/
|       |-- useUpdateClaim.ts
|-- query-keys.ts
```
Example query keys:
```ts
export const claimKeys = {
  all: ['claims'] as const,
  lists: () => [...claimKeys.all, 'list'] as const,
  list: (filters: ClaimFilters) => [...claimKeys.lists(), filters] as const,
  detail: (id: string) => [...claimKeys.all, 'detail', id] as const,
};
```
Example query hook:
```ts
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { claimsService } from '../../api/claims.service';
import { claimKeys } from '../../query-keys';

type ClaimsResponse = Awaited<ReturnType<typeof claimsService.getClaims>>;
type ClaimFilters = Parameters<typeof claimsService.getClaims>[0];

export function useClaims(
  filters: ClaimFilters,
  options?: Omit<UseQueryOptions<ClaimsResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: claimKeys.list(filters),
    queryFn: () => claimsService.getClaims(filters),
    ...options,
  });
}
```
Example mutation hook:
```ts
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { claimsService } from '../../api/claims.service';
import { claimKeys } from '../../query-keys';

type UpdateClaimResponse = Awaited<ReturnType<typeof claimsService.updateClaim>>;
type UpdateClaimVariables = Parameters<typeof claimsService.updateClaim>[0];

export function useUpdateClaim(
  options?: UseMutationOptions<UpdateClaimResponse, Error, UpdateClaimVariables>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: claimsService.updateClaim,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: claimKeys.lists() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}
```

