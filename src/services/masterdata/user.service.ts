import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "../../lib/http-client-interface";
import Cookies from "universal-cookie";
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

export class UserService {
  private httpClient: IHttpClient;
  then: any;

  constructor() {
    this.httpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_AUTH_TOKEN,
      },
    });
  }

  async getUser(page?: number, rowsPerPage?: number): Promise<User> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/account/?${queryString}`);
  }

  async getUserById(id: string): Promise<any> {
    return this.httpClient.get("/account/" + id);
  }

  async deleteUser(id: string): Promise<any> {
    try {
      return await this.httpClient.delete("v1/insurances/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async saveUser(data: any): Promise<any> {
    try {
      return await this.httpClient.post("/account", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async updateUser(data: any, id: string): Promise<any> {
    try {
      return await this.httpClient.put("/account/" + id, data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
}
