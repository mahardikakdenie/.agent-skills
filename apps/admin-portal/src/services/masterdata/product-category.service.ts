import { AxiosHttpClient } from "@/lib/http-client/axios-http-client";
import { IHttpClient } from "@/lib/http-client/http-client-interface";

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

export class ProductCategoriesService {
  private httpClient: IHttpClient;
  then: any;

  constructor() {
    this.httpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getCategories(): Promise<any> {
    try {
      const response = await this.httpClient.get("/v1/categories");
      return (response as { data: ProductCategories[] }).data;
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getCategoriesById(id: string): Promise<any> {
    return this.httpClient.get("/v1/categories/" + id);
  }

  async getCategoriesByChannelId(channelId: string): Promise<any> {
    return this.httpClient.get("/v1/categories/channel/" + channelId);
  }

  async deleteCategories(id: string): Promise<any> {
    try {
      return await this.httpClient.delete("/v1/categories/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async saveCategories(data: any): Promise<any> {
    try {
      return await this.httpClient.post("/v1/categories/", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async updateCategories(data: any, id: string): Promise<any> {
    try {
      return await this.httpClient.put("/v1/categories/" + id, data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
}
