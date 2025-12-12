import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import qs from "qs";

export interface EmailTagResponse {
  data: any;
  id: string;
  created_at: string;
  updated_at: any;
  tag: string;
  meta?: {
    page: number;
    pageSize: number;
    pageTotal: number;
    total: number;
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
  meta: any;
  updated_at: string;
}

export class EmailTagService {
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

  async getEmailJourney(): Promise<any> {
    try {
      const response = await this.httpClient.get("/v1/email-templates/journey");
      return (response as { data: EmailTagResponse[] }).data;
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getEmailTagById(id: string): Promise<any> {
    return this.httpClient.get("/v1/email-tags/" + id);
  }

  async deleteEmailTag(id: string): Promise<any> {
    try {
      return await this.httpClient.delete("/v1/email-tags/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async saveEmailTag(data: any): Promise<any> {
    try {
      return await this.httpClient.post("/v1/email-tags/", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async updateEmailTag(data: any, id: string): Promise<any> {
    try {
      return await this.httpClient.put("/v1/email-tags/" + id, data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
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
}
