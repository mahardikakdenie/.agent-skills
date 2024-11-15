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


  async getChannels(page: number, limit: number): Promise<PromotionResponse> {
    if (page <= 0) {
      page = 1;
    }
    return this.httpClientChannels.get(`/channels?page=${page}&limit=${limit}`);

  }

  
  async getChannelById(id: string): Promise<any> {
    return this.httpClientChannels.get('/channels/' + id);
  }

}


