import { AxiosHttpClient } from "@/lib/axios-http-client";
import { HttpClient } from "@/lib/http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import axios, { AxiosResponse } from "axios";

export class VoucherService {
    private httpClientPromotion: IHttpClient;
  
    constructor() {
      this.httpClientPromotion = new AxiosHttpClient({
        baseURL: process.env.NEXT_PUBLIC_PROMOTION_SERVICE_URL,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AUTH_TOKEN,
        }
      });

    }
    
  
    async getVoucherByCampaignId(id: string): Promise<any> {
      return this.httpClientPromotion.get('/api/voucher/' + id);
    }
  
 
  
  }