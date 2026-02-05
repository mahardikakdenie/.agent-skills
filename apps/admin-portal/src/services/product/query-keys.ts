export const productKeys = {
  all: ["product"] as const,
  products: () => [...productKeys.all, "products"] as const,
  productList: (params?: Record<string, unknown>) =>
    [...productKeys.products(), "list", params] as const,
  productDetail: (id: string) =>
    [...productKeys.products(), "detail", id] as const,

  categories: () => [...productKeys.all, "categories"] as const,
  categoryList: (params?: Record<string, unknown>) =>
    [...productKeys.categories(), "list", params] as const,
  categoryDetail: (id: string) =>
    [...productKeys.categories(), "detail", id] as const,
  categoriesByChannel: (channelId: string) =>
    [...productKeys.categories(), "channel", channelId] as const,

  insurances: () => [...productKeys.all, "insurances"] as const,
  insuranceList: (params?: Record<string, unknown>) =>
    [...productKeys.insurances(), "list", params] as const,
  insuranceDetail: (id: string) =>
    [...productKeys.insurances(), "detail", id] as const,
  insurancesLegacy: () => [...productKeys.all, "insurances-legacy"] as const,
  insuranceLegacyList: (params?: Record<string, unknown>) =>
    [...productKeys.insurancesLegacy(), "list", params] as const,
  insuranceLegacyDetail: (id: string) =>
    [...productKeys.insurancesLegacy(), "detail", id] as const,
  insuranceCurrencies: (insuranceId: string, params?: Record<string, unknown>) =>
    [...productKeys.insurances(), "currencies", insuranceId, params] as const,

  plans: () => [...productKeys.all, "plans"] as const,
  planList: (params?: Record<string, unknown>) =>
    [...productKeys.plans(), "list", params] as const,
  plansByProductIds: (
    productIds: string[],
    params?: Record<string, unknown>
  ) => [...productKeys.plans(), "by-products", productIds, params] as const,
  plansByInsuranceAndCategory: (
    insuranceId: string,
    category: string,
    params?: Record<string, unknown>
  ) =>
    [
      ...productKeys.plans(),
      "by-insurance-category",
      insuranceId,
      category,
      params,
    ] as const,
  planDetail: (id: string) => [...productKeys.plans(), "detail", id] as const,
  planLegacyDetail: (id: string) =>
    [...productKeys.plans(), "legacy-detail", id] as const,
  planBenefits: (planId: string) =>
    [...productKeys.plans(), "benefits", planId] as const,
  planDetails: (planId: string, type: string) =>
    [...productKeys.plans(), "details", planId, type] as const,

  packages: () => [...productKeys.all, "packages"] as const,
  packageList: (params?: Record<string, unknown>) =>
    [...productKeys.packages(), "list", params] as const,
  packageDetail: (id: string) =>
    [...productKeys.packages(), "detail", id] as const,
  packagesByPlan: (planId: string, params?: Record<string, unknown>) =>
    [...productKeys.packages(), "by-plan", planId, params] as const,
  channelPackages: (channel: string) =>
    [...productKeys.packages(), "channel-packages", channel] as const,
  planChannels: (planId: string) =>
    [...productKeys.plans(), "channels", planId] as const,

  references: () => [...productKeys.all, "references"] as const,
  referenceCurrencies: (params?: Record<string, unknown>) =>
    [...productKeys.references(), "currencies", params] as const,
  referenceEmailJourney: (params?: Record<string, unknown>) =>
    [...productKeys.references(), "email-journey", params] as const,
  referenceHospitals: (params?: Record<string, unknown>) =>
    [...productKeys.references(), "hospitals", params] as const,

  emailTags: () => [...productKeys.all, "email-tags"] as const,
  emailTagList: (params?: Record<string, unknown>) =>
    [...productKeys.emailTags(), "list", params] as const,
  emailTagDetail: (id: string) =>
    [...productKeys.emailTags(), "detail", id] as const,

  emailTemplates: () => [...productKeys.all, "email-templates"] as const,
  emailTemplatesJourney: (params?: Record<string, unknown>) =>
    [...productKeys.emailTemplates(), "journey", params] as const,
  emailTemplateJourneyDetail: (id: string) =>
    [...productKeys.emailTemplates(), "journey-detail", id] as const,

  productConfig: (type: string) =>
    [...productKeys.all, "product-config", type] as const,
};
