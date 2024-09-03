import { AxiosHttpClient } from "@/lib/axios-http-client";
import { HttpClient } from "@/lib/http-client";
import { IHttpClient } from "@/lib/http-client-interface";
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
  private httpClientPromotion_2: HttpClient;

  constructor() {
    this.httpClientPromotion = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_PROMOTION_SERVICE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AUTH_TOKEN,
      }
    });

    this.httpClientPromotion_2 = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_PROMOTION_SERVICE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AUTH_TOKEN,
      }
    });
  }
  

  async getPromotionCampaign(page: number): Promise<PromotionResponse> {
    let limit = 10;
    if (page > 0) {
      return this.httpClientPromotion.get('/api/campaign?page=' + page + "&limit=" + limit);
    } else {
      page = 1;
      return this.httpClientPromotion.get('/api/campaign?page=' + page + "&limit=" + limit);
    }

  }

  async getPromotionCampaignById(id: string): Promise<PromotionResponse> {
    return this.httpClientPromotion.get('/api/campaign/' + id);
  }

   async deleteDiscCampaignById(id: string): Promise<any> {
    return this.httpClientPromotion_2.put('/api/campaign/delete/' + id);
  }

  async updatePromotionCampaign(id: string, data: any): Promise<AxiosResponse<any>> {
    const baseURL = process.env.NEXT_PUBLIC_PROMOTION_SERVICE_URL;
    const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

    return axios.put(`${baseURL}/api/campaign/update/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
  }


  async createPromotion(data: any): Promise<AxiosResponse<any>> {
    const baseURL = process.env.NEXT_PUBLIC_PROMOTION_SERVICE_URL;
    const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

    return axios.post(`${baseURL}/api/campaign`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
  }

}


