import { createApiClient } from "@/lib/api-client";

import { COUNTRY_ENDPOINTS } from "./country.endpoints";

const countryApi = createApiClient(process.env.NEXT_PUBLIC_COUNTRY_SERVICE_URL);

const get = async <T>(url: string) => (await countryApi.get<T>(url)).data;

export const countryService = {
  getCountries: () => get(COUNTRY_ENDPOINTS.countries),
};

