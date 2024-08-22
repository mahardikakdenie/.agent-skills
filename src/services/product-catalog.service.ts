// AuthService.ts
import { AxiosHttpClient } from '@/lib/axios-http-client';
import { IHttpClient } from './../lib/http-client-interface';


export interface PackageDto {
  premium: number;
  currency: string;
  active: boolean;
  search_params: any;
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
    },
    categories: {
      id: string;
      name: string;
    };
  },
}

export interface ProductConfigDto {
  id: string;
  name: string;
  search_config: any;
}
export interface ProductcatalogResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export class ProductCatalogService {
  private httpClient: IHttpClient;

  constructor() {
    this.httpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AUTH_TOKEN,
      }
    });
  }

  async getPlans(page: number): Promise<ProductcatalogResponse<ProductCatalogDto>> {
    try {
      return await this.httpClient.get<ProductcatalogResponse<ProductCatalogDto>>('/v1/plans?page=' + page);
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  async getPlanById(id: string): Promise<ProductcatalogResponse<ProductCatalogDto>> {
    try {
      return await this.httpClient.get<ProductcatalogResponse<ProductCatalogDto>>('/v1/plans/' + id);
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  async getPackagesByPlanId(id: string, page: number): Promise<ProductcatalogResponse<PackageDto>> {
    try {
      return await this.httpClient.get<ProductcatalogResponse<PackageDto>>('/v1/packages?planId=' + id + '&page=' + page);
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  async getConfigByCategory(category: string): Promise<ProductcatalogResponse<ProductConfigDto>> {
    try {
      return await this.httpClient.get<ProductcatalogResponse<ProductConfigDto>>('/v1/categories?category=' + category);
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }
}