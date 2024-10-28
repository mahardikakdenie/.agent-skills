import { AxiosHttpClient } from "@/lib/axios-http-client";
import { HttpClient } from "@/lib/http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import { getCookie } from "@/lib/utils";
import axios, { AxiosResponse } from "axios";


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
        Authorization: "Bearer " + getCookie("token"),
      },
    });

  }
  

  async getPromotionCampaign(page: number, limit: number): Promise<PromotionResponse> {
    if (page <= 0) {
      page = 1;
    }
    return this.httpClientPromotion.get(`/api/campaign?page=${page}&limit=${limit}`);

  }

  async getPromotionCampaignById(id: string): Promise<PromotionResponse> {
    return this.httpClientPromotion.get(`/api/campaign/${id}?id=${id}`);
}

  async deleteDiscCampaignById(id: string): Promise<any> {
    return this.httpClientPromotion.delete('/api/campaign/delete/' + id);
  }
  
  async updatePromotionCampaign(id: string, data: any): Promise<any> {
    return this.httpClientPromotion.put(`/api/campaign/update/${id}?id=${id}`, data);
  }


  async createPromotion(data: any): Promise<any> {
    return this.httpClientPromotion.post('/api/campaign', data);
  }

}


