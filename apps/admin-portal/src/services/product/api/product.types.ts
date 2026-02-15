export interface PackageDto {
  premium: number;
  currency: string;
  active: boolean;
  search_params: Record<string, unknown>;
  id: string;
}

export interface ProductCatalogDto {
  id: string;
  name: string;
  products: {
    id: string;
    name: string;
    insurances: {
      id: string;
      name: string;
      logo_url: string;
    };
    categories: {
      id: string;
      name: string;
    };
  };
}

export interface ProductList {
  id: string;
  created_at: string;
  updated_at: string;
  insurance: string;
  category: string;
  name: string;
  instant_policy: boolean;
  riplay: {
    general: string;
    personal: string;
  };
}

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  category: string;
  search_config: unknown;
}

export interface InsuranceDto {
  id: string;
  name: string;
  description: string;
  category: string;
  search_config: unknown;
}

export interface ProductcatalogResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
  };
}

export interface ProductConfig {
  id: string;
  name: string;
  type: string;
  search_configs: unknown;
}

export interface ProductConfigResponse {
  data: ProductConfig;
}

export type {
  ProductResponse,
  CategoriesResponse,
  InsurancesResponse,
  HospitalListResponse,
  HospitalData,
  HospitalReference,
  HospitalListMeta,
} from "@/services/masterdata/product.service";
export type { ProductCategories } from "@/services/masterdata/product-category.service";
export type { Insurance } from "@/services/masterdata/insurance.service";
export type {
  CurrencyResponse,
  TypeCurreciesResponse,
} from "@/services/masterdata/currency.service";
export type { EmailTagResponse } from "@/services/masterdata/email-tag.service";
export type { MailTemplateResponse } from "@/services/masterdata/mail-template.service";
