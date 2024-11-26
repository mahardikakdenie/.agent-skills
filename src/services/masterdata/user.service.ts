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

export class UserService {
  private authHttpClient: IHttpClient;
  private channelHttpClient: IHttpClient;
  then: any;

  constructor() {
    this.authHttpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_AUTH_TOKEN,
      },
    }, true);

    this.channelHttpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_CHANNEL_SERVICE_URL,
    }, true);
  }

  async getUser(page?: number, rowsPerPage?: number): Promise<User> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.authHttpClient.get(`/account/?${queryString}`);
  }

  async getChannel(search: any): Promise<Channel> {
    try {
      const queryString = new URLSearchParams({ ...search }).toString();
      return await this.channelHttpClient.get<Channel>(
        "/channels?" + queryString
      );
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

  async saveUser(data: any): Promise<any> {
    try {
      return await this.authHttpClient.post("/account", data);
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
}
