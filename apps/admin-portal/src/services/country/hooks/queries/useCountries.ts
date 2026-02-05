import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { countryService } from "../../api/country.service";
import { countryKeys } from "../../query-keys";

type CountriesResponse = Awaited<
  ReturnType<typeof countryService.getCountries>
>;

export function useCountries(
  options?: Omit<UseQueryOptions<CountriesResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: countryKeys.countries(),
    queryFn: () => countryService.getCountries(),
    ...options,
  });
}
