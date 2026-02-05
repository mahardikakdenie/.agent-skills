export const countryKeys = {
  all: ["country"] as const,
  countries: () => [...countryKeys.all, "countries"] as const,
};
