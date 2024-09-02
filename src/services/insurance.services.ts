import { AxiosHttpClient } from "@/lib/axios-http-client";
import { HttpClient } from "@/lib/http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import Cookies from "universal-cookie";


interface InsuranceResponse {
  data: any;
  limit: number;
  page: number;
  pageTotal: number;
  total: number;
}

export class InsuranceService {
  private httpClientInsurance: IHttpClient;

  constructor() {

    this.httpClientInsurance = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AUTH_TOKEN,
      }
    });
  }
  


  async getInsurances(): Promise<any> {
    return this.httpClientInsurance.get('/insurances');
  }

  
  async getInsuranceById(id: string): Promise<any> {
    return this.httpClientInsurance.get('/insurances/' + id);
  }

}