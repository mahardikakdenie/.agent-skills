import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "../../lib/http-client-interface";
import qs from "qs";

export interface PermissionResponse {
  data: any;
  page: any;
  total: any;
  pageTotal: any;
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  meta: any;
}

export interface PagesResponse {
  data: any;
  id: string;
  name: string;
  meta: any;
}

export class PermissionService {
  private authHttpClient: IHttpClient;

  constructor() {
    this.authHttpClient = new AxiosHttpClient(
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

  async getPages(page?: number, rowsPerPage?: number): Promise<any> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.authHttpClient.get(`/pages/?${queryString}`);
  }

  async getPermission(
    page?: number,
    rowsPerPage?: number,
    pagesId?: string
  ): Promise<PermissionResponse> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
    };
    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.authHttpClient.get(
      `/v1/permission/page/${pagesId}?${queryString}`
    );
  }

  async getPermissionById(id: string): Promise<any> {
    return this.authHttpClient.get("v1/permission/" + id);
  }

  async deletePermission(id: string): Promise<any> {
    try {
      return await this.authHttpClient.delete("v1/permission/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async savePermission(data: any): Promise<any> {
    try {
      return await this.authHttpClient.post("v1/permission/", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async updatePermission(data: any, id: string): Promise<any> {
    try {
      return await this.authHttpClient.put("v1/permission/" + id, data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
}
