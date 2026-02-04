import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import qs from "qs";

export interface PagesResponse {
  data: any;
  id: string;
  created_at: string;
  updated_at: any;
  name: string;
  claim_config: string;
  page: any;
  total: any;
  pageTotal: any;
  meta: any;
}

export class PagesService {
  private httpClient: IHttpClient;
  then: any;

  constructor() {
    this.httpClient = new AxiosHttpClient(
      {
        baseURL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_AUTH_TOKEN,
        },
      },
      true
    );
  }
  async getPages(
    page?: number,
    rowsPerPage?: number,
    categoryId?: string
  ): Promise<PagesResponse> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
      categoryId: categoryId,
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/pages/?${queryString}`);
  }

  async getPagesById(id: string): Promise<any> {
    return this.httpClient.get("/pages/" + id);
  }

  async deletePages(id: string): Promise<any> {
    try {
      return await this.httpClient.delete("/pages/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async savePages(data: any): Promise<any> {
    try {
      return await this.httpClient.post("/pages/", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async updatePages(data: any, id: string): Promise<any> {
    try {
      return await this.httpClient.put("/pages/" + id, data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
}
