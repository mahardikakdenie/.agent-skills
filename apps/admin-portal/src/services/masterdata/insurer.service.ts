import { AxiosHttpClient } from "@/lib/http-client/axios-http-client";
import { IHttpClient } from "@/lib/http-client/http-client-interface";

export interface Insurer {
  data: any;
  id: string;
  name: string;
  type: string;
}

export class InsurerService {
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

  async addAccountInsurers(data: any): Promise<any> {
    try {
      return await this.authHttpClient.post("v1/account-insurers", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async removeAccountInsurers(id: string): Promise<any> {
    try {
      return await this.authHttpClient.delete("v1/account-insurers/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getAccountInsurersByAccountId(accountId: string): Promise<any> {
    try {
      return await this.authHttpClient.get(`/v1/account-insurers/account/${accountId}`);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
}