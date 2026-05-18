import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getCookie, setCookie } from "@/helpers/app.helper";
import { AUTH_TOKEN, REFRESH_TOKEN } from "@/constants/app-common.const";
import ApiURL from "@/constants/api-url.const";
import { authToken } from "@/types/auth-token";
import { setGlobalToken } from "@/lib/token-storage";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Refresh token mutex to prevent concurrent refresh calls
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

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
      const token = await getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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

          if (isRefreshing) {
            // Another refresh is in progress — wait for it to complete
            return new Promise((resolve, reject) => {
              addRefreshSubscriber((newToken: string) => {
                if (originalRequest.headers)
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                resolve(apiService(originalRequest));
              });
            });
          }

          isRefreshing = true;

          try {
            const refreshToken = await getCookie(REFRESH_TOKEN);
            if (!refreshToken) {
              return Promise.reject(error);
            }

            const refreshResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}${ApiURL.loginRefresh}`,
              { token: refreshToken },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
                },
              }
            );

            const newAccessToken = refreshResponse.data.access_token;
            const newRefreshToken = refreshResponse.data.refresh_token;

            // Update stored tokens
            await setCookie(AUTH_TOKEN, newAccessToken);
            authToken.token = newAccessToken;
            setGlobalToken(newAccessToken);

            if (newRefreshToken) {
              await setCookie(REFRESH_TOKEN, newRefreshToken);
            }

            // Notify queued requests
            onRefreshed(newAccessToken);

            // Retry original request
            if (originalRequest.headers)
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiService(originalRequest);
          } catch (refreshError) {
            refreshSubscribers = [];
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
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
const communicationService = createApiService(
  process.env.NEXT_PUBLIC_COMMUNICATION_SERVICE_URL as string,
  true
);
const thirdPartyService = createApiService(
  process.env.NEXT_PUBLIC_THIRD_PARTY_SERVICE_URL as string
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
  communicationService,
  thirdPartyService,
  masterdataNotV1Service,
};
