# Service Audit - admin-portal

## Service Boundary Mapping (Base URL -> Service)
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
- `window.location.origin` (relative `/api`) -> Admin-Portal Internal API

## Refactor Notes
- All query and mutation hooks in `src/services` must accept an optional `options` param (queries: `Omit<UseQueryOptions<...>, 'queryKey' | 'queryFn'>`, mutations: `UseMutationOptions<...>`), and mutations should compose `options?.onSuccess` when adding invalidation logic.

## Auth Service (`NEXT_PUBLIC_AUTH_SERVICE_URL`)
**Base URL/Client Usage**
- `AxiosHttpClient` with static `Authorization: Bearer ${NEXT_PUBLIC_AUTH_TOKEN}` in `src/services/auth.service.ts`
- `AxiosHttpClient` with static auth token in `src/services/masterdata/user.service.ts`, `src/services/masterdata/roles.service.ts`, `src/services/masterdata/permission.service.ts`, `src/services/masterdata/page.service.ts`, `src/services/masterdata/group.service.ts`, `src/services/masterdata/insurer.service.ts`
- `authService` in `src/services/api.service.ts` uses `createApiService(baseURL, true)` with static token

**Legacy Files**
- `src/services/auth.service.ts`
- `src/services/masterdata/user.service.ts`
- `src/services/masterdata/roles.service.ts`
- `src/services/masterdata/permission.service.ts`
- `src/services/masterdata/page.service.ts`
- `src/services/masterdata/group.service.ts`
- `src/services/masterdata/insurer.service.ts`
- `src/services/api.service.ts`

**Endpoints**
- `/login`
- `/account` (list/create)
- `/account/:id` (detail/update/delete)
- `/account/all-data/pagination`
- `/account/all-data/:id`
- `/v1/account/partner`
- `/v1/account/:id/change-password`
- `/v1/account-groups` (add/remove)
- `/v1/account-roles` (add/remove)
- `/v1/account-channels` (add/remove)
- `/v1/account-channels/account/:accountId`
- `/v1/account-insurers` (add/remove)
- `/v1/account-insurers/:id`
- `/v1/account-insurers/account/:accountId`
- `/v1/group` (list/detail/create/update/delete)
- `/v1/group-roles` (add/remove)
- `/role` (list/detail/create/update/delete)
- `/pages` (list/detail/create/update/delete)
- `/v1/permission` (list/detail/create/update/delete)
- `/v1/permission/page/:pageId`
- `/v1/role-permission` (create/delete)
- `/v1/role-permission/:id`

**Types/Interfaces**
- `LoginCredentials`, `LoginResponse` in `src/services/auth.service.ts`
- `User`, `Channel`, `Role` in `src/services/masterdata/user.service.ts`
- `RoleResponse`, `PermissionResponse` in `src/services/masterdata/roles.service.ts`
- `PermissionResponse`, `PagesResponse` in `src/services/masterdata/permission.service.ts`
- `PagesResponse` in `src/services/masterdata/page.service.ts`
- `GroupResponse`, `RoleResponse`, `UserResponse`, `AccountGroup` in `src/services/masterdata/group.service.ts`

**Hardcoded/Direct API Calls**
- None found outside the service layer for this base URL.

**Pain Points / Tech Debt**
- Static auth token usage (`NEXT_PUBLIC_AUTH_TOKEN`) hardcoded into client headers.
- Inconsistent path prefixes (`/v1` vs non-`/v1`) and missing leading slashes in some methods.
- Auth domain responsibilities are spread across multiple service files.

**Migration Complexity**
- `High` due to large surface area and auth coupling.

## Claim Service (`NEXT_PUBLIC_API_CLAIM_BASE_URL`)
**Base URL/Client Usage**
- `AxiosHttpClient` in `src/services/claim.service.ts`
- `claimService` Axios instance in `src/services/api.service.ts`
- `createApiClient` default in `src/lib/interceptor.ts` falls back to this base URL

**Legacy Files**
- `src/services/claim.service.ts`
- `src/services/api.service.ts`
- `src/constants/api-url.const.tsx`
- `src/types/claim.d.ts`
- `src/interface/index.ts`

**Endpoints**
- `/v1/claims` (list/export)
- `/v1/claims/:id` (detail/update)
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

**Types/Interfaces**
- `Claim`, `Participant`, `ClaimHistory`, `ListClaimResponse`, `ListClaimHistoryResponse` in `src/services/claim.service.ts`
- `ClaimFormsRequest`, `UpdateClaimGrabRequest` in `src/interface/index.ts`
- `Claim` types in `src/types/claim.d.ts`

**Hardcoded/Direct API Calls**
- `src/views/claim/detail/detail.view.tsx` uses `claimService.get(ApiURL...)` directly (bypasses `ClaimService`).
- `src/views/claim/detail/detail.view.tsx` uses `fetch(url)` and `XMLHttpRequest` for document URLs (external storage URLs, not service-based).

**Pain Points / Tech Debt**
- Mixed usage of `ClaimService` class and `claimService` instance from `api.service.ts`.
- Extensive manual query-string construction and duplicated endpoints vs `ApiURL` constants.
- Hardcoded claim status list in service logic.

**Migration Complexity**
- `High` due to large endpoint surface area and mixed client usage.

## Policy Service (`NEXT_PUBLIC_API_POLICY_BASE_URL`)
**Base URL/Client Usage**
- `AxiosHttpClient` in `src/services/policy.service.ts`, `src/services/endorsement.service.ts`, `src/services/membership.service.ts`
- Multipart usage via new `AxiosHttpClient` instances in policy upload flows
- `policyService` and `policyServiceFormData` in `src/services/api.service.ts`

**Legacy Files**
- `src/services/policy.service.ts`
- `src/services/endorsement.service.ts`
- `src/services/membership.service.ts`
- `src/services/api.service.ts`
- `src/constants/api-url.const.tsx`
- `src/types/policy.d.ts`
- `src/types/endorsement.d.ts`
- `src/types/membership.ts`

**Endpoints**
- `/v1/policies` (list/export)
- `/v1/policies/:id`
- `/v1/policies/statistic-data`
- `/v1/policies/upload/drgadget`
- `/v1/policies/:id/renew`
- `/v1/endorsements` (list/export)
- `/v1/endorsements/:id`
- `/v1/endorsements/update-status/:id`
- `/v1/endorsements/update-status-bulking/:id`
- `/v1/endorsements/bulking`
- `/v1/policies/master/:channelId?is_only_master_policy=true`
- `/v1/insured-parties` (list/export)
- `/v1/insured-parties/:id`
- `/v1/insured-parties/statistic-data`
- `/v1/insured-parties/channel/:channelId` (PUT)
- `/v1/insured-parties/upload-first-time`
- `/v1/insured-parties/upload-first-time-without-transaction`

**Types/Interfaces**
- `PolicyData`, `Participant`, `PolicyProductResponse` in `src/services/policy.service.ts`
- `MembershipData`, `MembershipProductResponse` in `src/services/membership.service.ts`
- `EndorsementResponse` in `src/services/endorsement.service.ts`
- Type declarations in `src/types/policy.d.ts`, `src/types/endorsement.d.ts`, `src/types/membership.ts`

**Hardcoded/Direct API Calls**
- Several endpoints in `src/services/endorsement.service.ts` are missing leading slashes (`v1/...`).

**Pain Points / Tech Debt**
- Inconsistent path formatting and mixed `/v1` vs non-`/v1` usage.
- Policy, endorsement, and membership are bundled under one base URL, increasing coupling.
- Separate form-data client instances create duplicated setup logic.

**Migration Complexity**
- `High` due to multiple domains and multipart uploads.

## Transaction Service (`NEXT_PUBLIC_TRANSACTION_SERVICE_URL`)
**Base URL/Client Usage**
- `AxiosHttpClient` in `src/services/transaction.service.ts`

**Legacy Files**
- `src/services/transaction.service.ts`
- `src/constants/api-url.const.tsx`
- `src/types/transaction.d.ts`

**Endpoints**
- `/v1/transactions` (list/search/export)
- `/v1/transactions/:id`
- `/v1/transactions/payment/:id`
- `/v1/transactions/update-status/:id`
- `/v1/transactions/bulk-create/:id`
- `/v1/transactions/statistic-data`
- `/v1/transactions/conventional`
- `/v1/customers`
- `/v1/customers/campaign`
- `/v1/campaigns/report/:id` (GET/PUT)

**Types/Interfaces**
- `Transaction`, `Customer`, `Insurance`, `TransactionFee`, `Participant` in `src/services/transaction.service.ts`
- Type declarations in `src/types/transaction.d.ts`

**Hardcoded/Direct API Calls**
- None found outside the service layer for this base URL.

**Pain Points / Tech Debt**
- Mixed query building approaches (`qs`, `URLSearchParams`, manual string concat).
- Campaign report endpoints live under transaction base URL, increasing cross-domain coupling.

**Migration Complexity**
- `Medium-High` due to endpoint breadth and custom query logic.

## Channel Service (`NEXT_PUBLIC_CHANNEL_SERVICE_URL`)
**Base URL/Client Usage**
- `AxiosHttpClient` in `src/services/channel.services.ts`
- `AxiosHttpClient` in `src/services/masterdata/channels.service.ts`
- `channelHttpClient` in `src/services/masterdata/user.service.ts`

**Legacy Files**
- `src/services/channel.services.ts`
- `src/services/masterdata/channels.service.ts`
- `src/services/masterdata/user.service.ts`

**Endpoints**
- `/channels` (list)
- `/channels/:id`
- `/v1/channels` (list/create)
- `/v1/channels/:id` (detail/update/delete)

**Types/Interfaces**
- `PromotionResponse` in `src/services/channel.services.ts`
- `ChannelsResponse` in `src/services/masterdata/channels.service.ts`
- `Channel` in `src/services/masterdata/user.service.ts`

**Hardcoded/Direct API Calls**
- None found outside the service layer for this base URL.

**Pain Points / Tech Debt**
- Duplicate services for the same base URL with overlapping endpoints.
- Inconsistent `/v1` vs non-`/v1` usage.

**Migration Complexity**
- `Medium` due to duplication and inconsistent endpoint usage.

## Finance Service (`NEXT_PUBLIC_FINANCE_SERVICE_URL`)
**Base URL/Client Usage**
- `AxiosHttpClient` in `src/services/finance.services.ts` with `Authorization: Bearer ${getCookie("token")}` set at construction time
- Multipart uploads use new `AxiosHttpClient` instances

**Legacy Files**
- `src/services/finance.services.ts`

**Endpoints**
- `/v1/billings` (list/create)
- `/v1/billings/:id` (detail/update)
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
- `/v1/plans/` (create voucher)

**Types/Interfaces**
- None defined locally in this service file.

**Hardcoded/Direct API Calls**
- `getVoucherByCode` uses `/api/voucher/code/:code` under the finance base URL, which is inconsistent with other `/v1` paths.

**Pain Points / Tech Debt**
- Auth header is captured at construction time and may not refresh with token changes.
- Mixed responsibilities (billing + fees + voucher creation) in a single service.

**Migration Complexity**
- `Medium` due to breadth and mixed concerns.

## Helper Service (`NEXT_PUBLIC_HELPER_SERVICE_URL`)
**Base URL/Client Usage**
- `AxiosHttpClient` in `src/services/helper.service.ts` with `Authorization: Bearer ${getCookie("token")}`

**Legacy Files**
- `src/services/helper.service.ts`

**Endpoints**
- `/v1/html2pdf`
- `/v1/html2pdf/generate-pdf-service`
- `/v1/calendar`
- `/v1/calendar/:id`

**Types/Interfaces**
- None defined locally in this service file.

**Hardcoded/Direct API Calls**
- None found outside the service layer for this base URL.

**Pain Points / Tech Debt**
- None notable beyond standard AxiosHttpClient usage.

**Migration Complexity**
- `Low`.

## Product Service (`NEXT_PUBLIC_PRODUCT_SERVICE_URL`)
**Base URL/Client Usage**
- `AxiosHttpClient` in `src/services/product.services.ts`, `src/services/product-catalog.service.ts`, `src/services/product-config.service.ts`, `src/services/plan.services.ts`, `src/services/insurance.services.ts`
- `AxiosHttpClient` in masterdata services: `src/services/masterdata/product.service.ts`, `src/services/masterdata/product-category.service.ts`, `src/services/masterdata/insurance.service.ts`, `src/services/masterdata/insurance-product.service.ts`, `src/services/masterdata/currency.service.ts`, `src/services/masterdata/email-tag.service.ts`, `src/services/masterdata/mail-template.service.ts`
- `productService` and `masterdataService` in `src/services/api.service.ts`

**Legacy Files**
- `src/services/product.services.ts`
- `src/services/product-catalog.service.ts`
- `src/services/product-config.service.ts`
- `src/services/plan.services.ts`
- `src/services/insurance.services.ts`
- `src/services/masterdata/product.service.ts`
- `src/services/masterdata/product-category.service.ts`
- `src/services/masterdata/insurance.service.ts`
- `src/services/masterdata/insurance-product.service.ts`
- `src/services/masterdata/currency.service.ts`
- `src/services/masterdata/email-tag.service.ts`
- `src/services/masterdata/mail-template.service.ts`
- `src/services/api.service.ts`

**Endpoints (Products, Categories, Insurances)**
- `/v1/products` (list/filter)
- `/v1/products/:id` (detail/update/delete)
- `/v1/categories` (list/filter/create/update/delete)
- `/v1/categories/:id`
- `/v1/categories/channel/:channelId`
- `/v1/insurances` (list/filter/create/update/delete)
- `/v1/insurances/:id`
- `/insurances` (non-`/v1` list)
- `/insurances/:id` (non-`/v1` detail)
- `/v1/insurances/:insuranceId/currencies` (list/create/update)
- `/v1/insurances/:insuranceId/currencies/:currencyId` (delete)

**Endpoints (Plans, Packages, Benefits, Channel Packages)**
- `/v1/plans` (list/create/update/delete)
- `/v1/plans/:id`
- `/v1/plans?productIds[]=` (list by product ids)
- `/v1/plans?insuranceId=...&category=...`
- `/v1/plans?page=...&pageSize=...`
- `/plan/:id` (non-`/v1` detail)
- `/v1/plans/:id/benefits`
- `/v1/plans/:id/details/:type`
- `/v1/plans/bulk-create/:id/:type`
- `/v1/plans/sync/embedded-discounts`
- `/v1/plan-benefit/create`
- `/v1/plan-benefit/bulk-create/:id`
- `/v1/plan-benefit/:id`
- `/v1/packages` (create)
- `/v1/packages/:id` (update/delete)
- `/v1/packages?active=true&planId=...`
- `packages/:category/bulk-create/:id` (missing `/v1` prefix)
- `/v1/channel-packages/assign-plans`
- `/v1/channel-packages/unassign-plans`
- `/v1/channel-packages/plans/?channel=...`
- `/v1/plans/:planId/channels`

**Endpoints (References, Email, Currency, Hospital)**
- `/v1/references/type/currencies`
- `/v1/references/type/email-journey`
- `/v1/references/type/grab-provider-hospital`
- `/v1/references/upload/grab-provider-hospital`
- `/v1/email-tags` (list/create/update/delete)
- `/v1/email-tags/:id`
- `/v1/email-templates/journey` (list/create/update/delete)
- `/v1/email-templates/journey/:id`

**Endpoints (Config)**
- `/product-config/:type`

**Types/Interfaces**
- `ProductCatalogDto`, `PackageDto`, `ProductList`, `ProductDto`, `InsuranceDto` in `src/services/product-catalog.service.ts`
- `ProductConfig`, `ProductConfigResponse` in `src/services/product-config.service.ts`
- `ProductResponse`, `CategoriesResponse`, `InsurancesResponse` in `src/services/masterdata/product.service.ts`
- `ProductCategories` in `src/services/masterdata/product-category.service.ts`
- `Insurance` in `src/services/masterdata/insurance.service.ts`
- `CurrencyResponse`, `TypeCurreciesResponse` in `src/services/masterdata/currency.service.ts`
- `EmailTagResponse`, `MailTemplateResponse` in `src/services/masterdata/email-tag.service.ts` and `src/services/masterdata/mail-template.service.ts`

**Hardcoded/Direct API Calls**
- `src/services/product-catalog.service.ts` uses `axios.get(${NEXT_PUBLIC_PRODUCT_SERVICE_URL}/v1/packages/:id)` with a hardcoded bearer token, bypassing `AxiosHttpClient`.

**Pain Points / Tech Debt**
- Very large surface area spread across many service files with overlapping responsibilities.
- Inconsistent `/v1` usage and missing leading slashes in multiple files.
- Direct `axios` usage with hardcoded token bypasses shared auth handling.

**Migration Complexity**
- `High` due to breadth, duplication, and inconsistent patterns.

## Promotion Service (`NEXT_PUBLIC_PROMOTION_SERVICE_URL`)
**Base URL/Client Usage**
- `AxiosHttpClient` in `src/services/promotion.service.ts`
- `AxiosHttpClient` in `src/services/voucher.services.ts`

**Legacy Files**
- `src/services/promotion.service.ts`
- `src/services/voucher.services.ts`

**Endpoints**
- `/v1/campaign` (create)
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
- `/v1/plans/` (create voucher)

**Types/Interfaces**
- `PromotionResponse` in `src/services/promotion.service.ts`

**Hardcoded/Direct API Calls**
- None found outside the service layer for this base URL.

**Pain Points / Tech Debt**
- Voucher creation uses `/v1/plans/` which appears unrelated to promotions.
- Multiple report endpoints built with manual query strings.

**Migration Complexity**
- `Medium` due to mixed concerns (campaigns + vouchers).

## Sanction Service (`NEXT_PUBLIC_SANCTION_SERVICE_URL`)
**Base URL/Client Usage**
- `AxiosHttpClient` in `src/services/sanction.service.ts`

**Legacy Files**
- `src/services/sanction.service.ts`

**Endpoints**
- `/v1/sources` (create)
- `/v1/sources/:id`
- `/v1/sources/paging`
- `/v1/sources/delete/:id`
- `/v1/sources/update/:id`
- `/v1/blacklist` (list/create)
- `/v1/blacklist/:id`
- `/v1/blacklist/delete/:id`
- `/v1/blacklist/update/:id`

**Types/Interfaces**
- `Response`, `Insurer` in `src/services/sanction.service.ts`

**Hardcoded/Direct API Calls**
- None found outside the service layer for this base URL.

**Pain Points / Tech Debt**
- None notable beyond standard AxiosHttpClient usage.

**Migration Complexity**
- `Medium` due to multiple resources and query handling.

## Country Service (`NEXT_PUBLIC_COUNTRY_SERVICE_URL`)
**Base URL/Client Usage**
- `AxiosHttpClient` in `src/services/sanction.service.ts` (country client)

**Legacy Files**
- `src/services/sanction.service.ts`

**Endpoints**
- `/countries`

**Types/Interfaces**
- `Response` in `src/services/sanction.service.ts`

**Hardcoded/Direct API Calls**
- None found outside the service layer for this base URL.

**Pain Points / Tech Debt**
- Country endpoints are embedded inside the sanction service.

**Migration Complexity**
- `Low`.

## PDF Service (`NEXT_PUBLIC_PDF_SERVICE_URL`)
**Base URL/Client Usage**
- `AxiosHttpClient` in `src/services/pdf.service.ts` with `Authorization: Bearer ${getCookie("token")}`

**Legacy Files**
- `src/services/pdf.service.ts`

**Endpoints**
- `/pdf-generate`

**Types/Interfaces**
- None defined locally in this service file.

**Hardcoded/Direct API Calls**
- None found outside the service layer for this base URL.

**Pain Points / Tech Debt**
- None notable beyond standard AxiosHttpClient usage.

**Migration Complexity**
- `Low`.

## Admin-Portal Internal API (Same-Origin `/api`)
**Base URL/Client Usage**
- Direct `axios` calls using `window.location.origin` in `src/services/masterdata/cookie.service.ts`
- Direct `axios` calls to relative `/api` endpoints in `src/helpers/app.helper.tsx`

**Legacy Files**
- `src/services/masterdata/cookie.service.ts`
- `src/helpers/app.helper.tsx`
- `src/app/api/cookie/route.ts`
- `src/app/api/cookie/[key]/route.ts`

**Endpoints**
- `/api/cookie`
- `/api/cookie/:key`

**Types/Interfaces**
- None defined locally for these endpoints.

**Hardcoded/Direct API Calls**
- Both helper and service use `axios` directly, bypassing shared HTTP client patterns.

**Pain Points / Tech Debt**
- Duplicate cookie logic exists in both helpers and services.
- Direct axios usage bypasses shared interceptors and auth handling.

**Migration Complexity**
- `Low`.

