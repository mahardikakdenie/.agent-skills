import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "../../lib/http-client-interface";
import Cookies from "universal-cookie";
import qs from "qs";

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
export interface CategoriesResponse {
  data: any;
  id: string;
  name: string;
}

export class InsuranceService {
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
  async getCategorie(search: any): Promise<CategoriesResponse> {
    try {
      const queryString = new URLSearchParams({ ...search }).toString();
      return await this.httpClient.get<CategoriesResponse>(
        "v1/categories/?" + queryString
      );
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getInsurance(
    page?: number,
    rowsPerPage?: number,
    categoryId?: string
  ): Promise<Insurance> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
      categoryId: categoryId,
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/v1/insurances/?${queryString}`);
  }

  async getInsuranceById(id: string): Promise<any> {
    return this.httpClient.get("v1/insurances/" + id);
  }

  async deleteInsurance(id: string): Promise<any> {
    try {
      return await this.httpClient.delete("v1/insurances/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async saveInsurance(data: any): Promise<any> {
    try {
      return await this.httpClient.post("v1/insurances/", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async updateInsurance(data: any, id: string): Promise<any> {
    try {
      return await this.httpClient.put("v1/insurances/" + id, data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
}
