import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";



export class PlanService {
  private httpClientPlan: IHttpClient;

  constructor() {

    this.httpClientPlan = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AUTH_TOKEN,
      }
    });
  }
  


  async getPlansByProductId(id: string): Promise<any> {
    return this.httpClientPlan.get('/plan/product/' + id);
  }

  async getPlanById(id: string): Promise<any> {
    return this.httpClientPlan.get('/plan/' + id);
  }

}