import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import qs from "qs";

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


export class MdProductService {
  private httpClient: IHttpClient;
  then: any;

  constructor() {
    this.httpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
    });
  }

  async getProduct(
    page: number,
    rowsPerPage: number,
    category: string,
    categoryId: string,
    insuranceId: string
  ): Promise<ProductResponse> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
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
    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/v1/products/?${queryString}`);
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

  async getProductById(id: string): Promise<any> {
    return this.httpClient.get("v1/products/" + id);
  }

  async deleteProduct(id: string): Promise<any> {
    try {
      return await this.httpClient.delete("v1/products/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async saveProduct(data: any): Promise<any> {
    try {
      return await this.httpClient.post("v1/products/", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async updateProduct(data: any, id: string): Promise<any> {
    try {
      return await this.httpClient.put("v1/products/" + id, data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getHospitalList(search?: {
    name?: string;
    page?: number;
    pageSize?: number;
  }): Promise<HospitalListResponse> {
    const params: Record<string, string> = {};
    if (search?.name) params["name"] = search.name;
    if (search?.page !== undefined) params["page"] = search.page.toString();
    if (search?.pageSize !== undefined) params["pageSize"] = search.pageSize.toString();

    const queryString = new URLSearchParams(params).toString();

    return await this.httpClient.get<HospitalListResponse>(
      "/v1/references/type/grab-provider-hospital" + (queryString ? `?${queryString}` : "")
    );
  }

  async uploadHospitalList(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      return await (this.httpClient as any).post(
        "/v1/references/upload/grab-provider-hospital",
        formData,
      );
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  }
}
