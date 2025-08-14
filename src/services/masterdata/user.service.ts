import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import qs from "qs";

export interface User {
  data: any;
  id: string;
  name: string;
  email: string;
  phone_number: string;
  permission: string;
  role: string;
  status: string;
  meta: any;
}
export interface Channel {
  data: any;
  id: string;
  name: string;
  type: string;
}
export interface Role {
  data: any;
  id: string;
  name: string;
  description: string;
}

export class UserService {
  private authHttpClient: IHttpClient;
  private channelHttpClient: IHttpClient;
  then: any;

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

    this.channelHttpClient = new AxiosHttpClient(
      {
        baseURL: process.env.NEXT_PUBLIC_CHANNEL_SERVICE_URL,
      },
      true
    );
  }

  async getUser(
    role?: string,
    page?: number,
    rowsPerPage?: number,
    searchData?: string
  ): Promise<User> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
      search: searchData,
      role
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.authHttpClient.get(`/account/?${queryString}`);
  }

  async getExistingUser(data: any): Promise<User> {
    const params: any = { page: 1, pageSize: 1, ...data };
    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.authHttpClient.get(`/account/all-data/pagination?${queryString}`);
  }

    async getPartner(
    page?: number,
    rowsPerPage?: number,
    searchData?: string
  ): Promise<User> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
      search: searchData,
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.authHttpClient.get(`/v1/account/partner?${queryString}`);
  }
  async getChannel(search: any): Promise<Channel> {
    try {
      const queryString = new URLSearchParams({ ...search }).toString();
      return await this.channelHttpClient.get<Channel>(
        "v1/channels?" + queryString + "&limit=1000"
      );
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getRole(search: any): Promise<Role> {
    try {
      const queryString = new URLSearchParams({ ...search }).toString();
      return await this.authHttpClient.get<Role>("/role?" + queryString);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<any> {
    return this.authHttpClient.get("/account/" + id);
  }

  async deleteUser(id: string): Promise<any> {
    try {
      return await this.authHttpClient.delete("/account/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async saveUser(data: any, id: string): Promise<any> {
    try {
      return await this.authHttpClient.post("/account/", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async updateUser(data: any, id: string): Promise<any> {
    try {
      return await this.authHttpClient.put("/account/" + id, data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async updateUserAllData(data: any, id: string): Promise<any> {
    try {
      return await this.authHttpClient.put("/account/all-data/" + id, data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async addAccountGroups(data: any): Promise<any> {
    try {
      return await this.authHttpClient.post("v1/account-groups", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async removeAccountGroups(id: string): Promise<any> {
    try {
      return await this.authHttpClient.delete("v1/account-groups/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
  async addAccountRoles(data: any): Promise<any> {
    try {
      return await this.authHttpClient.post("v1/account-roles", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async removeAccountRoles(id: string): Promise<any> {
    try {
      return await this.authHttpClient.delete("v1/account-roles/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async changePassword(id: string, data: any): Promise<any> {
    try {
      return await this.authHttpClient.put("/v1/account/" + id + "/change-password", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async addAccountChannels(data: any): Promise<any> {
    try {
      return await this.authHttpClient.post("v1/account-channels", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async removeAccountChannels(id: string): Promise<any> {
    try {
      return await this.authHttpClient.delete("v1/account-channels/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getAccountChannelsByAccountId(accountId: string): Promise<any> {
    try {
      return await this.authHttpClient.get(`/v1/account-channels/account/${accountId}`);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
}
