export const API_BASE_URLS = {
  auth: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
  claims: process.env.NEXT_PUBLIC_API_CLAIM_BASE_URL,
  policy: process.env.NEXT_PUBLIC_API_POLICY_BASE_URL,
  transaction: process.env.NEXT_PUBLIC_TRANSACTION_SERVICE_URL,
  channel: process.env.NEXT_PUBLIC_CHANNEL_SERVICE_URL,
  finance: process.env.NEXT_PUBLIC_FINANCE_SERVICE_URL,
  helper: process.env.NEXT_PUBLIC_HELPER_SERVICE_URL,
  product: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
  promotion: process.env.NEXT_PUBLIC_PROMOTION_SERVICE_URL,
  sanction: process.env.NEXT_PUBLIC_SANCTION_SERVICE_URL,
  country: process.env.NEXT_PUBLIC_COUNTRY_SERVICE_URL,
  pdf: process.env.NEXT_PUBLIC_PDF_SERVICE_URL,
} as const;

export const API_TIMEOUT_MS = 30000;

export const API_DEFAULT_HEADERS = {
  "Content-Type": "application/json",
} as const;

export const getInternalBaseUrl = () =>
  typeof window !== "undefined" ? window.location.origin : "";
