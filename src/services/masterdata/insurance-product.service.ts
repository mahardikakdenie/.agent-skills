import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "../../lib/http-client-interface";
import Cookies from "universal-cookie";

export interface ProductInsuranceProduct {
  data: any;
  id: string;
  created_at: string;
  updated_at: any;
  name: string;
  logo_url: string;
}

export class ProductInsuranceProductService {
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

  async getInsuranceProduct(): Promise<any> {
    try {
      const response = await this.httpClient.get("v1/insurances");
      return (response as { data: ProductInsuranceProduct[] }).data;
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async deleteInsuranceProduct(id: string): Promise<any> {
    try {
      return await this.httpClient.delete("v1/insurances/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async saveInsuranceProduct(data: any): Promise<any> {
    try {
      return await this.httpClient.post("v1/insurances/", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async updateInsuranceProduct(data: any, id: string): Promise<any> {
    try {
      return await this.httpClient.put("v1/insurances/" + id, data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
}
