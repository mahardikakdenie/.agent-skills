import { Insurance } from "./../app/promotion/dto/promotion.dto";
// AuthService.ts
import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "./../lib/http-client-interface";
import { getCookie } from "@/lib/utils";

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
      logo_url: string;
    };
    categories: {
      id: string;
      name: string;
    };
  };
}

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  category: string;
  search_config: any;
}

export interface InsuranceDto {
  id: string;
  name: string;
  description: string;
  category: string;
  search_config: any;
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
        "Content-Type": "application/json",
        Authorization: "Bearer " + getCookie("token"),
      },
    });
  }

  async getPlans(
    page: number,
    filter: { category: string; planName?: string; insuranceId?: string }
  ): Promise<ProductcatalogResponse<ProductCatalogDto>> {
    try {
      const queryString = new URLSearchParams({
        ...filter,
        page: page.toString(),
      }).toString();
      return await this.httpClient.get<
        ProductcatalogResponse<ProductCatalogDto>
      >("/v1/plans?" + queryString);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getPlanById(
    id: string
  ): Promise<ProductcatalogResponse<ProductCatalogDto>> {
    try {
      return await this.httpClient.get<
        ProductcatalogResponse<ProductCatalogDto>
      >("/v1/plans/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getPackagesByPlanId(
    id: string,
    page: number
  ): Promise<ProductcatalogResponse<PackageDto>> {
    try {
      return await this.httpClient.get<ProductcatalogResponse<PackageDto>>(
        "/v1/packages?active=true&planId=" + id + "&page=" + page
      );
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getConfigByCategory(
    category: string
  ): Promise<ProductcatalogResponse<ProductConfigDto>> {
    try {
      return await this.httpClient.get<
        ProductcatalogResponse<ProductConfigDto>
      >("/v1/categories?category=" + category);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getProducts(
    search: any
  ): Promise<ProductcatalogResponse<ProductCatalogDto>> {
    try {
      const queryString = new URLSearchParams({ ...search }).toString();
      return await this.httpClient.get<
        ProductcatalogResponse<ProductCatalogDto>
      >("/v1/products?" + queryString);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getInsurances(
    search: any
  ): Promise<ProductcatalogResponse<InsuranceDto>> {
    try {
      const queryString = new URLSearchParams({ ...search }).toString();
      return await this.httpClient.get<ProductcatalogResponse<InsuranceDto>>(
        "/v1/insurances?" + queryString
      );
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async savePlan(data: any): Promise<any> {
    try {
      return await this.httpClient.post("/v1/plans", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async uploadPackage(category: string, id: string, data: any): Promise<any> {
    try {
      return await this.httpClient.post(
        "packages/" + category + "/bulk-create/" + id,
        data
      );
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
}
