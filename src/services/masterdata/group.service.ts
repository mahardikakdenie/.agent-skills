import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import qs from "qs";

export interface GroupResponse {
  data: any;
  id: string;
  name: string;
  description: string;
  updated_at: string;
  created_at: string;
  _count: any;
  meta: any;
  group_roles: any;
  account_groups: any;
}
export interface Channel {
  data: any;
  id: string;
  name: string;
  type: string;
}

export interface RoleResponse {
  data: any;
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  description: string;
  meta: any;
}

export interface UserResponse {
  data: any;
  id: string;
  name: string;
  email: string;
  phone_number: number;
  status: string;
  role: string;
  meta: any;
}

export interface AccountGroup {
  id: string;
  accounts: {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    role: string;
    channel: string;
    updated_at: string;
  };
}

export class GroupService {
  private httpClient: IHttpClient;

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

  async getGroup(page?: number, rowsPerPage?: number): Promise<GroupResponse> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/v1/group/?${queryString}`);
  }

  async getGroupById(id: string): Promise<any> {
    return this.httpClient.get("/v1/group/" + id);
  }

  async deleteGroup(id: string): Promise<any> {
    try {
      return await this.httpClient.delete("/v1/group/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async updateGroup(data: any, id: string): Promise<any> {
    try {
      return await this.httpClient.put("v1/group/" + id, data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async addGroup(data: any): Promise<any> {
    try {
      return await this.httpClient.post("v1/group/", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getRoles(page?: number, rowsPerPage?: number): Promise<RoleResponse> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/role/?${queryString}`);
  }

  async getUser(page?: number, rowsPerPage?: number): Promise<UserResponse> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/account/?${queryString}`);
  }

  async addGroupRole(data: any): Promise<any> {
    try {
      return await this.httpClient.post("v1/group-roles", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async removeGroupRole(id: string): Promise<any> {
    try {
      return await this.httpClient.delete("v1/group-roles/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async addGroupAccount(data: any): Promise<any> {
    try {
      return await this.httpClient.post("v1/account-groups", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async removeGroupAccount(id: string): Promise<any> {
    try {
      return await this.httpClient.delete("v1/account-groups/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
}
