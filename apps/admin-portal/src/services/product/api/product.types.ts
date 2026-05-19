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

export interface ProductResponse {
  data: any;
  page: any;
  total: any;
  pageTotal: any;
  id: string;
  name: string;
  logo_url: string;
  meta: any;
}

export interface CategoriesResponse {
  data: any;
  id: string;
  name: string;
  _count: {
    products: string;
  };
}

export interface InsurancesResponse {
  data: any;
  id: string;
  name: string;
  _count: {
    products: string;
  };
}

export interface HospitalReference {
  fax: string;
  lat: string;
  long: string;
  phone: string;
  address: string;
  inpatient: string;
  name_city: string;
  type_city: string;
  outpatient: string;
  id_provider: number;
  name_province: string;
  provider_type: string;
  type_province: string;
}

export interface HospitalData {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  code: string | null;
  type: string;
  reference: HospitalReference;
  value: string | null;
  category: string;
  deleted_at: string | null;
  distance: number | null;
}

export interface HospitalListMeta {
  total: number;
  page: number;
  pageSize: number;
  pageTotal: number;
}

export interface HospitalListResponse {
  message: string;
  data: HospitalData[];
  meta: HospitalListMeta;
}

export interface ProductCategories {
  data: any;
  id: string;
  created_at: string;
  updated_at: any;
  name: string;
  claim_config: string;
  icon?: string;
  display_name?: string;
}

export interface Insurance {
  _count: any;
  data: any;
  page: any;
  total: any;
  pageTotal: any;
  id: string;
  created_at: string;
  updated_at: any;
  name: string;
  logo_url: string;
  meta: any;
}

export interface CurrencyResponse {
  data: any;
  page: any;
  total: any;
  pageTotal: any;
  id: string;
  name: string;
  logo_url: string;
  meta: any;
  message: string;
}

export interface TypeCurreciesResponse {
  data: any;
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  code: string;
  type: string;
}

export interface EmailTagResponse {
  data: any;
  id: string;
  created_at: string;
  updated_at: any;
  tag: string;
  journey?: string;
  parent?: string;
  meta?: {
    page: number;
    pageSize: number;
    pageTotal: number;
    total: number;
  };
}

export interface MailTemplateResponse {
  data: any;
  id: string;
  category: string;
  insurance: string;
  product: string;
  plan: string;
  journey: string;
  subject: string;
  content: string;
  type?: string;
  meta: any;
  updated_at: string;
}

export interface PlanResponse {
  data: any;
  id: string;
  name: string;
}

export interface ProductInsurance {
  data: any;
  page: any;
  total: any;
  pageTotal: any;
  id: string;
  created_at: string;
  updated_at: any;
  name: string;
  logo_url: string;
  meta: any;
}
