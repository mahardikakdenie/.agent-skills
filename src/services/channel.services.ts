import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";


interface PromotionResponse {
  data: any;
  limit: number;
  page: number;
  pageTotal: number;
  total: number;
}

export class ChannelService {
  private httpClientChannels: IHttpClient;

  constructor() {

    this.httpClientChannels = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_CHANNEL_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

  }


  async getChannels(page?: number, limit?: number): Promise<PromotionResponse> {
    let query = "";
    if (page && page <= 0) {
      page = 1;
    }

    if (page && limit) {
      query = `?page=${page}&limit=${limit}`;
    }
    return this.httpClientChannels.get(`/channels${query}`);

  }


  async getChannelById(id: string): Promise<any> {
    return this.httpClientChannels.get('/channels/' + id);
  }

}


