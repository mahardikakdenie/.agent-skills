import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import qs from "qs";

export interface RoleResponse {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  name: string;
  description: string;
  data: any;
  meta: any;
}

export class RoleService {
  private authHttpClient: IHttpClient;

  constructor() {
    this.authHttpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_AUTH_TOKEN,
      },
    }, true);
  }

  async getRole(page?: number, rowsPerPage?: number): Promise<RoleResponse> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.authHttpClient.get(`/role/?${queryString}`);
  }

  async getRoleById(id: string): Promise<any> {
    return this.authHttpClient.get("/role/" + id);
  }

  async deleteRole(id: string): Promise<any> {
    try {
      return await this.authHttpClient.delete("/role/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async addRole(data: any, id: string): Promise<any> {
    try {
      return await this.authHttpClient.post("role/", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async updateRole(data: any, id: string): Promise<any> {
    try {
      return await this.authHttpClient.put("/role/" + id, data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
}
