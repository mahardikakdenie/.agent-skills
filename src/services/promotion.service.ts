import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";


interface PromotionResponse {
  data: any;
  limit: number;
  page: number;
  pageTotal: number;
  total: number;
}

export class PromotionService {
  private httpClientPromotion: IHttpClient;

  constructor() {
    
    this.httpClientPromotion = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_PROMOTION_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

  }
  

  async getPromotionCampaign(page: number, limit: number): Promise<PromotionResponse> {
    if (page <= 0) {
      page = 1;
    }
    return this.httpClientPromotion.get(`/v1/campaign?page=${page}&limit=${limit}`);

  }

  
  async getPromotionCampaignReport(page: number, limit: number, sortBy: string, filterBy: string): Promise<any> {
    if (page <= 0) {
      page = 1;
    }
    return this.httpClientPromotion.get(`/v1/campaign/report?page=${page}&limit=${limit}&sort=${sortBy}&filter=${filterBy}`);

  }

  async getPromotionCampaignExportReport(sortBy: string, filterBy: string): Promise<any> {

    return this.httpClientPromotion.get(`/v1/campaign/report/export?sort=${sortBy}&filter=${filterBy}`);

  }

  async getPromotionCampaignById(id: string): Promise<PromotionResponse> {
    return this.httpClientPromotion.get(`/v1/campaign/${id}?id=${id}`);
}

  async deleteDiscCampaignById(id: string): Promise<any> {
    return this.httpClientPromotion.delete('/v1/campaign/delete/' + id);
  }
  
  async updatePromotionCampaign(id: string, data: any): Promise<any> {
    return this.httpClientPromotion.put(`/v1/campaign/update/${id}?id=${id}`, data);
  }


  async createPromotion(data: any): Promise<any> {
    return this.httpClientPromotion.post('/v1/campaign', data);
  }

  async getPromotionSearchQuery(query: string, page: number, limit: number): Promise<PromotionResponse> {
    if (page <= 0) {
      page = 1;
    }
    return this.httpClientPromotion.get(`/v1/campaign/search/query?query=${query}&page=${page}&limit=${limit}`);
  }

}


