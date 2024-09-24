import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import { getCookie } from "@/lib/utils";
import axios, { AxiosResponse } from "axios";



export class PlanService {
  private httpClientPlan: IHttpClient;
  private httpClientCookie: IHttpClient;

  constructor() {

    this.httpClientPlan = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AUTH_TOKEN,
      }
    });

    this.httpClientCookie = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getCookie("token"),
      },
    });
  }
  


  // async getPlansByProductId(id: string): Promise<any> {
  //   return this.httpClientPlan.get('/plan/product/' + id);
  // }

  async getPlansByProductId(ids: string[], pageSize: number, page: number): Promise<any> {
    const params = new URLSearchParams();
    

    ids.forEach(id => params.append('productIds[]', id));
    
    params.append('pageSize', pageSize.toString());
    params.append('page', page.toString());
  
    const url = `/v1/plans?${params.toString()}`;
    return this.httpClientCookie.get(url);
  }

  async getPlanById(id: string): Promise<any> {
    return this.httpClientPlan.get('/plan/' + id);
  }


  async getSyncEmbeddedDiscount(): Promise<AxiosResponse<any>> {
    const baseURL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL;
    const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

    return axios.post(`${baseURL}/plan/sync/embedded-discounts`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
  }
  
}