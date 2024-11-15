import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import qs from "qs";

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

export class ProductInsuranceProductService {
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

  async getInsuranceProduct(
    page?: number,
    rowsPerPage?: number
  ): Promise<ProductInsurance> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/v1/insurances/?${queryString}`);
  }

  async getInsuranceById(id: string): Promise<any> {
    return this.httpClient.get("v1/insurances/" + id);
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
