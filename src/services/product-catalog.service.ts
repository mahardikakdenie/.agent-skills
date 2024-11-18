import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import qs from "qs";

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
  };
}

export interface ProductCatalogRequest {
  insuranceId?: string;
  categoryId?: string;
  instantPolicy?: string;
  page?: number;
}

export interface GetPlansRequest {
  planName?: string;
  insuranceId?: string;
  category?: string;
  productId?: string;
  page?: number;
}

export class ProductCatalogService {
  private httpClient: IHttpClient;

  constructor() {
    this.httpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getPlans(
    params: GetPlansRequest
  ): Promise<ProductcatalogResponse<ProductCatalogDto>> {
    try {
      const queryString = qs.stringify(params, { arrayFormat: "brackets" });
      console.log("queryString", queryString, params);
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
    page: number,
    rowsPerPage: number
  ): Promise<ProductcatalogResponse<PackageDto>> {
    try {
      return await this.httpClient.get<ProductcatalogResponse<PackageDto>>(
        "/v1/packages?active=true&planId=" +
        id +
        "&page=" +
        page +
        "&pageSize=" +
        rowsPerPage
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

  async getProducts(params: ProductCatalogRequest): Promise<ProductList[]> {
    try {
      const queryString = qs.stringify(params, { arrayFormat: "brackets" });
      const response = await this.httpClient.get<any>(
        "/v1/products?" + queryString
      );
      if (response) {
        return response.data;
      } else {
        return [];
      }
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

  async updatePlan(data: any, id: string): Promise<any> {
    try {
      return await this.httpClient.put("/v1/plans/" + id, data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async deletePlan(id: string): Promise<any> {
    try {
      return await this.httpClient.delete("/v1/plans/" + id);
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

  async uploadPlanBenefits(id: string, data: any): Promise<any> {
    try {
      return await this.httpClient.post("/v1/plan-benefit/bulk-create/" + id, data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
  async getPlanBenefits(id: string): Promise<any> {
    try {
      return await this.httpClient.get("/v1/plans/" + id + "/benefits");
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getPlanDetails(id: string, type: string): Promise<any> {
    try {
      return await this.httpClient.get("/v1/plans/" + id + "/details/" + type);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async uploadPlanDetails(id: string, type: string, data: any[]): Promise<any> {
    try {
      return await this.httpClient.post(
        "/v1/plans/bulk-create/" + id + "/" + type,
        data
      );
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async assignPlans(planId: string, channelId: string, channelName: string): Promise<any> {
    try {
      return await this.httpClient.post(
        "/v1/channel-packages/assign-plans", {
        channel: channelId,
        plans: [planId],
        channelName
      }
      );
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async unAssignPlans(planId: string, channelId: string): Promise<any> {
    try {
      return await this.httpClient.post(
        "/v1/channel-packages/unassign-plans", {
        channel: channelId,
        plans: [planId]
      }
      );
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getChannelPlans(planId: string): Promise<any> {
    try {
      return await this.httpClient.get("/v1/plans/" + planId + "/channels");
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
}
