import { createApiClient } from "@/lib/api-client";
import type { AxiosRequestConfig } from "axios";
import qs from "qs";

import { PRODUCT_ENDPOINTS } from "./product.endpoints";

const productApi = createApiClient(process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL);

const withQuery = (url: string, params?: Record<string, unknown>) => {
  if (!params || Object.keys(params).length === 0) return url;
  return `${url}?${qs.stringify(params, { arrayFormat: "brackets" })}`;
};

const get = async <T>(url: string) => (await productApi.get<T>(url)).data;
const post = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) => (await productApi.post<T>(url, data, config)).data;
const put = async <T>(url: string, data?: unknown) =>
  (await productApi.put<T>(url, data)).data;
const del = async <T>(url: string) => (await productApi.delete<T>(url)).data;

export const productService = {
  getProducts: (params?: Record<string, unknown>) =>
    get(withQuery(PRODUCT_ENDPOINTS.products, params)),
  getProductById: (id: string) =>
    get(withQuery(PRODUCT_ENDPOINTS.products, { id })),
  createProduct: (payload: unknown) => post(PRODUCT_ENDPOINTS.products, payload),
  updateProduct: (id: string, payload: unknown) =>
    put(PRODUCT_ENDPOINTS.productDetail(id), payload),
  deleteProduct: (id: string) => del(PRODUCT_ENDPOINTS.productDetail(id)),

  getCategories: (params?: Record<string, unknown>) =>
    get(withQuery(PRODUCT_ENDPOINTS.categories, params)),
  getCategoryById: (id: string) =>
    get(withQuery(PRODUCT_ENDPOINTS.categories, { id })),
  getCategoriesByChannelId: (channelId: string) =>
    get(PRODUCT_ENDPOINTS.categoriesByChannel(channelId)),
  createCategory: (payload: unknown) => post(PRODUCT_ENDPOINTS.categories, payload),
  updateCategory: (id: string, payload: unknown) =>
    put(PRODUCT_ENDPOINTS.categoryDetail(id), payload),
  deleteCategory: (id: string) => del(PRODUCT_ENDPOINTS.categoryDetail(id)),

  getInsurances: (params?: Record<string, unknown>) =>
    get(withQuery(PRODUCT_ENDPOINTS.insurances, params)),
  getInsuranceById: (id: string) => get(PRODUCT_ENDPOINTS.insuranceDetail(id)),
  createInsurance: (payload: unknown) => post(PRODUCT_ENDPOINTS.insurances, payload),
  updateInsurance: (id: string, payload: unknown) =>
    put(PRODUCT_ENDPOINTS.insuranceDetail(id), payload),
  deleteInsurance: (id: string) => del(PRODUCT_ENDPOINTS.insuranceDetail(id)),

  getInsurancesLegacy: (params?: Record<string, unknown>) =>
    get(withQuery(PRODUCT_ENDPOINTS.insurancesLegacy, params)),
  getInsuranceLegacyById: (id: string) =>
    get(withQuery(PRODUCT_ENDPOINTS.insurancesLegacy, { id })),

  getInsuranceCurrencies: (
    insuranceId: string,
    params?: Record<string, unknown>
  ) => get(withQuery(PRODUCT_ENDPOINTS.insuranceCurrencies(insuranceId), params)),
  createInsuranceCurrency: (insuranceId: string, payload: unknown) =>
    post(PRODUCT_ENDPOINTS.insuranceCurrencies(insuranceId), payload),
  updateInsuranceCurrency: (
    insuranceId: string,
    currencyIdOrPayload: string | unknown,
    payload?: unknown
  ) =>
    typeof currencyIdOrPayload === "string"
      ? put(
          PRODUCT_ENDPOINTS.insuranceCurrencyDetail(
            insuranceId,
            currencyIdOrPayload
          ),
          payload
        )
      : post(PRODUCT_ENDPOINTS.insuranceCurrencies(insuranceId), currencyIdOrPayload),
  deleteInsuranceCurrency: (insuranceId: string, currencyId: string) =>
    del(PRODUCT_ENDPOINTS.insuranceCurrencyDetail(insuranceId, currencyId)),

  getPlans: (params?: Record<string, unknown>) =>
    get(withQuery(PRODUCT_ENDPOINTS.plans, params)),
  getPlansByProductIds: (productIds: string[], params?: Record<string, unknown>) =>
    get(
      withQuery(PRODUCT_ENDPOINTS.plans, {
        ...params,
        productIds,
      })
    ),
  getPlansByInsuranceAndCategory: (
    insuranceId: string,
    category: string,
    params?: Record<string, unknown>
  ) =>
    get(
      withQuery(PRODUCT_ENDPOINTS.plans, {
        ...params,
        insuranceId,
        category,
      })
    ),
  getPlanById: (id: string) =>
    get(withQuery(PRODUCT_ENDPOINTS.plans, { id })),
  createPlan: (payload: unknown) => post(PRODUCT_ENDPOINTS.plans, payload),
  updatePlan: (id: string, payload: unknown) =>
    put(PRODUCT_ENDPOINTS.planDetail(id), payload),
  deletePlan: (id: string) => del(PRODUCT_ENDPOINTS.planDetail(id)),
  getPlanLegacyById: (id: string) =>
    get(withQuery(PRODUCT_ENDPOINTS.plans, { id })),

  getPlanBenefits: (planId: string) => get(PRODUCT_ENDPOINTS.planBenefits(planId)),
  getPlanDetails: (planId: string, type: string) =>
    get(PRODUCT_ENDPOINTS.planDetails(planId, type)),
  bulkCreatePlanDetails: (planId: string, type: string, payload: unknown) =>
    post(PRODUCT_ENDPOINTS.planBulkCreate(planId, type), payload),
  syncEmbeddedDiscounts: () =>
    post(PRODUCT_ENDPOINTS.planSyncEmbeddedDiscounts, {}),

  createPlanBenefit: (payload: unknown) =>
    post(PRODUCT_ENDPOINTS.planBenefitCreate, payload),
  bulkCreatePlanBenefits: (planId: string, payload: unknown) =>
    post(PRODUCT_ENDPOINTS.planBenefitBulkCreate(planId), payload),
  deletePlanBenefit: (id: string) => del(PRODUCT_ENDPOINTS.planBenefitDetail(id)),

  getPackages: (params?: Record<string, unknown>) =>
    get(withQuery(PRODUCT_ENDPOINTS.packages, params)),
  getPackageById: (id: string) =>
    get(withQuery(PRODUCT_ENDPOINTS.packages, { id })),
  createPackage: (payload: unknown) => post(PRODUCT_ENDPOINTS.packages, payload),
  updatePackage: (id: string, payload: unknown) =>
    put(PRODUCT_ENDPOINTS.packageDetail(id), payload),
  deletePackage: (id: string) => del(PRODUCT_ENDPOINTS.packageDetail(id)),
  getPackagesByPlan: (planId: string, params?: Record<string, unknown>) =>
    get(withQuery(PRODUCT_ENDPOINTS.packages, { ...params, active: true, planId })),
  bulkCreatePackagesByCategory: (category: string, id: string, payload: unknown) =>
    post(PRODUCT_ENDPOINTS.packagesBulkCreateByCategory(category, id), payload),

  assignChannelPlans: (payload: unknown) =>
    post(PRODUCT_ENDPOINTS.channelPackagesAssignPlans, payload),
  unassignChannelPlans: (payload: unknown) =>
    post(PRODUCT_ENDPOINTS.channelPackagesUnassignPlans, payload),
  getChannelPackagesByChannel: (channel: string) =>
    get(withQuery(PRODUCT_ENDPOINTS.channelPackagesPlans, { channel })),
  getPlanChannels: (planId: string) => get(PRODUCT_ENDPOINTS.planChannels(planId)),

  getReferenceCurrencies: (params?: Record<string, unknown>) =>
    get(withQuery(PRODUCT_ENDPOINTS.referencesCurrencies, params)),
  getReferenceEmailJourney: (params?: Record<string, unknown>) =>
    get(withQuery(PRODUCT_ENDPOINTS.referencesEmailJourney, params)),
  getReferenceHospitalList: (params?: Record<string, unknown>) =>
    get(withQuery(PRODUCT_ENDPOINTS.referencesHospital, params)),
  uploadReferenceHospital: (formData: FormData) =>
    post(PRODUCT_ENDPOINTS.referencesHospitalUpload, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getEmailTags: (params?: Record<string, unknown>) =>
    get(withQuery(PRODUCT_ENDPOINTS.emailTags, params)),
  getEmailTagById: (id: string) =>
    get(withQuery(PRODUCT_ENDPOINTS.emailTags, { id })),
  createEmailTag: (payload: unknown) => post(PRODUCT_ENDPOINTS.emailTags, payload),
  updateEmailTag: (id: string, payload: unknown) =>
    put(PRODUCT_ENDPOINTS.emailTagDetail(id), payload),
  deleteEmailTag: (id: string) => del(PRODUCT_ENDPOINTS.emailTagDetail(id)),

  getEmailTemplatesJourney: (params?: Record<string, unknown>) =>
    get(withQuery(PRODUCT_ENDPOINTS.emailTemplatesJourney, params)),
  getEmailTemplateJourneyById: (id: string) =>
    get(withQuery(PRODUCT_ENDPOINTS.emailTemplatesJourney, { id })),
  createEmailTemplateJourney: (payload: unknown) =>
    post(PRODUCT_ENDPOINTS.emailTemplatesJourney, payload),
  updateEmailTemplateJourney: (id: string, payload: unknown) =>
    put(PRODUCT_ENDPOINTS.emailTemplateJourneyDetail(id), payload),
  deleteEmailTemplateJourney: (id: string) =>
    del(PRODUCT_ENDPOINTS.emailTemplateJourneyDetail(id)),

  getProductConfigByType: (type: string) =>
    get(PRODUCT_ENDPOINTS.productConfig(type)),
};

