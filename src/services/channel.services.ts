import { AxiosHttpClient } from "@/lib/axios-http-client";
import { HttpClient } from "@/lib/http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import { getCookie } from "@/lib/utils";
import Cookies from "universal-cookie";


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
        Authorization: "Bearer " + getCookie("token"),
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


