import { API_BASE_URLS, createApiClient } from "@/lib/api-client";

import { COUNTRY_ENDPOINTS } from "./country.endpoints";

const countryApi = createApiClient(API_BASE_URLS.country);

const get = async <T>(url: string) => (await countryApi.get<T>(url)).data;

export const countryService = {
  getCountries: () => get(COUNTRY_ENDPOINTS.countries),
};

