import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "../../lib/http-client-interface";
import Cookies from "universal-cookie";
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

export interface MenuResponse {
  id: string;
  name: string;
  updated_at: string;
  created_at: string;
  data: any;
}
export interface PermissionResponse {
  id: string;
  name: string;
  updated_at: string;
  created_at: string;
  page: string;
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
    });
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

  async deletePermission(id: string): Promise<any> {
    try {
      return await this.authHttpClient.delete("/v1/role-permission/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getMenu(page?: number, rowsPerPage?: number): Promise<any> {
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

  async savePermissionRole(data: any, id: string): Promise<any> {
    try {
      return await this.authHttpClient.post("v1/role-permission/", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
}
