import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import { getCookie } from "@/lib/utils";


interface PromotionResponse {
  data: any;
  limit: number;
  page: number;
  pageTotal: number;
  total: number;
}

export class SanctionService {
  private httpClientSanction: IHttpClient;

  constructor() {
    
    this.httpClientSanction = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_SANCTION_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getCookie("token"),
      },
    });

  }
  

  async getSanctionList(page: number, limit: number): Promise<PromotionResponse> {
    if (page <= 0) {
      page = 1;
    }
    return this.httpClientSanction.get(`/api/v1/blacklist?page=${page}&limit=${limit}`);

  }

  async getSanctionById(id: string): Promise<PromotionResponse> {
    return this.httpClientSanction.get('/api/v1/blacklist/' + id);
  }

  async deleteDiscSanctionById(id: string): Promise<any> {
    return this.httpClientSanction.delete('/api/v1/blacklist/delete/' + id);
  }

  
}


