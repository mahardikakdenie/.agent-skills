import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "./../lib/http-client-interface";
import Cookies from "universal-cookie";

export interface ProductCategories {
  data: any;
  id: string;
  created_at: string;
  updated_at: any;
  name: string;
  claim_config: string;
}

export class ProductCategoryService {
  private httpClient: IHttpClient;
  then: any;

  constructor() {
    const cookies = new Cookies();
    this.httpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookies.get("token"),
      },
    });
  }
  async getCategory(): Promise<any> {
    try {
      const response = await this.httpClient.get("/v1/categories");
      return (response as { data: ProductCategories[] }).data;
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<any> {
    try {
      return await this.httpClient.delete("/v1/categories/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
}
