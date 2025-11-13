import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getCookie } from "@/helpers/app.helper";
import { AUTH_TOKEN } from "@/constants/app-common.const";
import ApiURL from "@/constants/api-url.const";
import { authToken } from "@/types/auth-token";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const createApiService = (
  baseURL: string,
  isStaticToken: boolean = false,
  isFormData: boolean = false
): AxiosInstance => {
  const apiService = axios.create({
    baseURL,
    timeout: ApiURL.maxTimeout,
    headers: {
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    },
  });

  const getAuthToken = async () => {
    if (isStaticToken) return process.env.NEXT_PUBLIC_AUTH_TOKEN;
    const tokenValue: string | null = authToken.token;
    if (tokenValue) {
      return tokenValue;
    } else {
      return await getCookie(AUTH_TOKEN);
    }
  };

  apiService.interceptors.request.use(
    async (config) => {
      const authToken = await getAuthToken();
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiService.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        const status = error.response?.status;

        if (
          !isStaticToken &&
          status !== undefined &&
          ApiURL.errorStatusCodeToGetToken.includes(status) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          let retryCount = 0;
          while (retryCount < ApiURL.maxRetries) {
            const newAuthToken = await getAuthToken();
            if (newAuthToken) {
              if (originalRequest.headers)
                originalRequest.headers.Authorization = `Bearer ${newAuthToken}`;

              try {
                return await apiService(originalRequest);
              } catch (err) {
                if (
                  axios.isAxiosError(err) &&
                  err.response?.status !== undefined &&
                  ApiURL.errorStatusCodeToGetToken.includes(err.response.status)
                ) {
                  retryCount++;
                  await new Promise((resolve) =>
                    setTimeout(() => resolve(null), ApiURL.timeoutInterval)
                  );
                } else {
                  return Promise.reject(err);
                }
              }
            }
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return apiService;
};

const authService = createApiService(
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL as string,
  true
);
const claimService = createApiService(
  process.env.NEXT_PUBLIC_API_CLAIM_BASE_URL as string
);
const policyService = createApiService(
  process.env.NEXT_PUBLIC_API_POLICY_BASE_URL as string
);
const policyServiceFormData = createApiService(
  process.env.NEXT_PUBLIC_API_POLICY_BASE_URL as string,
  false,
  true
);
const transactionService = createApiService(
  process.env.NEXT_PUBLIC_TRANSACTION_SERVICE_URL as string
);
const channelService = createApiService(
  process.env.NEXT_PUBLIC_CHANNEL_SERVICE_URL as string
);
const financeService = createApiService(
  process.env.NEXT_PUBLIC_FINANCE_SERVICE_URL as string
);
const financeServiceFormData = createApiService(
  process.env.NEXT_PUBLIC_FINANCE_SERVICE_URL as string,
  false,
  true
);
const helperService = createApiService(
  process.env.NEXT_PUBLIC_HELPER_SERVICE_URL as string
);
const productService = createApiService(
  process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL as string
);
const promotionService = createApiService(
  process.env.NEXT_PUBLIC_PROMOTION_SERVICE_URL as string
);
const sanctionService = createApiService(
  process.env.NEXT_PUBLIC_SANCTION_SERVICE_URL as string
);
const countryService = createApiService(
  process.env.NEXT_PUBLIC_COUNTRY_SERVICE_URL as string
);
const masterdataService = productService;
const masterdataNotV1Service = masterdataService;
export {
  authService,
  claimService,
  policyService,
  policyServiceFormData,
  transactionService,
  channelService,
  financeService,
  financeServiceFormData,
  helperService,
  productService,
  promotionService,
  sanctionService,
  countryService,
  masterdataService,
  masterdataNotV1Service,
};
