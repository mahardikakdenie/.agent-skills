import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import qs from "qs";

export interface ChannelsResponse {
  data: any;
  id: string;
  name: string;
  type: string;
  total: number;
  pageTotal: number;
}

export class ChannelsService {
  private httpClient: IHttpClient;
  then: any;

  constructor() {
    this.httpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_CHANNEL_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getChannels(
    page?: number,
    rowsPerPage?: number
  ): Promise<ChannelsResponse> {
    const params: any = {
      page: page,
      limit: rowsPerPage,
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/v1/channels/?${queryString}`);
  }

  async getChannelsById(id: string): Promise<any> {
    return this.httpClient.get("/v1/channels/" + id);
  }

  async deleteChannels(id: string): Promise<any> {
    try {
      return await this.httpClient.delete("/v1/channels/" + id);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async saveChannels(data: any): Promise<any> {
    try {
      return await this.httpClient.post("/v1/channels/", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async updateChannels(data: any, id: string): Promise<any> {
    try {
      return await this.httpClient.put("/v1/channels/" + id, data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
}
