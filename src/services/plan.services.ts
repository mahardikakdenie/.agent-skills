import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import { getCookie } from "@/lib/utils";
import axios, { AxiosResponse } from "axios";



export class PlanService {
  private httpClientCookie: IHttpClient;

  constructor() {

    this.httpClientCookie = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getCookie("token"),
      },
    });
  }
  
  async getPlansByProductId(ids: string[], pageSize: number, page: number): Promise<any> {
    const params = new URLSearchParams();
    

    ids.forEach(id => params.append('productIds[]', id));
    
    params.append('pageSize', pageSize.toString());
    params.append('page', page.toString());
  
    const url = `/v1/plans?${params.toString()}`;
    return this.httpClientCookie.get(url);
  }

  async getPlansNameByProductId(ids: string[], searchQuery: string): Promise<any> {

    const params = new URLSearchParams();
    
    const page = 1;
    const pageSize = 10;

    ids.forEach(id => params.append('productIds[]', id));
    
    params.append('pageSize', pageSize.toString());
    params.append('page', page.toString());
    params.append('planName', searchQuery);
  
    const url = `/v1/plans?${params.toString()}`;
    return this.httpClientCookie.get(url);

  }

  async getPlanById(id: string): Promise<any> {
    return this.httpClientCookie.get('/plan/' + id);
  }

  async getSyncEmbeddedDiscount(): Promise<AxiosResponse<any>> {
    const baseURL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL;

    return axios.post(`${baseURL}/plan/sync/embedded-discounts`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + getCookie("token"),
      }
    });
  }
  
}