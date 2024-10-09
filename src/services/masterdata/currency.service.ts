import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "../../lib/http-client-interface";
import Cookies from "universal-cookie";
import qs from "qs";

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

export class CurrenciesService {
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

  async getCurrency(
    page: number,
    rowsPerPage: number,
    category: string,
    categoryId: string,
    insuranceId: string
  ): Promise<CurrencyResponse> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
      insuranceId,
    };

    if (category) {
      params["category"] = category;
    }
    if (categoryId) {
      params["categoryId"] = categoryId;
    }
    if (insuranceId) {
      params["insuranceId"] = insuranceId;
    }
    // const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(
      `/v1/insurances/${insuranceId}/currencies?page=${page}&pageSize=${rowsPerPage}`
    );
  }

  async getCategories(): Promise<any> {
    try {
      const response = await this.httpClient.get("/v1/categories");
      return (response as { data: CategoriesResponse[] }).data;
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getCategory(search: any): Promise<InsurancesResponse> {
    try {
      const queryString = new URLSearchParams({ ...search }).toString();
      return await this.httpClient.get<InsurancesResponse>(
        "/v1/categories?" + queryString
      );
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getInsurance(search: any): Promise<InsurancesResponse> {
    try {
      const queryString = new URLSearchParams({ ...search }).toString();
      return await this.httpClient.get<InsurancesResponse>(
        "v1/insurances/?" + queryString
      );
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getCurrencyById(id: string): Promise<any> {
    return this.httpClient.get("v1/products/" + id);
  }

  async deleteCurrency(id: string): Promise<any> {
    try {
      return await this.httpClient.delete("v1/products/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async saveCurrency(data: any): Promise<any> {
    try {
      return await this.httpClient.post("v1/products/", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async updateCurrency(data: any, id: string): Promise<any> {
    try {
      return await this.httpClient.put("v1/products/" + id, data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
}
