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
export interface PlanResponse {
  data: any;
  id: string;
  name: string;
}

export interface EmailTagResponse {
  data: any;
  id: string;
  journey: string;
  tag: string;
  parent: string;
}

export interface InsurancesResponse {
  data: any;
  id: string;
  name: string;
  _count: {
    products: string;
  };
}
export interface MailTemplateResponse {
  data: any;
  id: string;
  category: string;
  insurance: string;
  product: string;
  plan: string;
  journey: string;
  subject: string;
  content: string;
  type: string;
  meta: any;
  updated_at: string;
}

export class MailTemplateService {
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

  async getMailTemplate(
    page?: number,
    rowsPerPage?: number,
    categoryId?: string
  ): Promise<MailTemplateResponse> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
      category: categoryId,
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`v1/email-templates/journey/?${queryString}`);
  }

  async getJourney(
    page?: number,
    rowsPerPage?: number
  ): Promise<MailTemplateResponse> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(
      `v1/references/type/email-journey?${queryString}`
    );
  }

  async getEmailTag(search: any): Promise<EmailTagResponse> {
    try {
      const queryString = new URLSearchParams({ ...search }).toString();
      return await this.httpClient.get<EmailTagResponse>(
        "v1/email-tags/?" + queryString
      );
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async deleteMailTemplate(id: string): Promise<any> {
    try {
      return await this.httpClient.delete("v1/email-templates/journey/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getMailTemplateById(id: string): Promise<any> {
    return this.httpClient.get("v1/email-templates/journey/" + id);
  }

  async getProductSelect(search: any): Promise<ProductResponse> {
    try {
      const queryString = new URLSearchParams({ ...search }).toString();
      return await this.httpClient.get<ProductResponse>(
        "v1/products/?" + queryString
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

  async getPlans(search: any): Promise<PlanResponse> {
    try {
      const queryString = new URLSearchParams({ ...search }).toString();
      return await this.httpClient.get<PlanResponse>(
        "v1/plans/?" + queryString
      );
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async saveJourney(data: any): Promise<any> {
    try {
      return await this.httpClient.post("v1/email-templates/journey/", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async updateJourney(data: any, id: string): Promise<any> {
    try {
      return await this.httpClient.put(
        "v1/email-templates/journey/" + id,
        data
      );
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
}
