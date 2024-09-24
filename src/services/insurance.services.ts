import { AxiosHttpClient } from "@/lib/axios-http-client";
import { HttpClient } from "@/lib/http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import Cookies from "universal-cookie";


interface InsuranceResponse {
  data: Insurance[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface Insurance {
  id: string;
  name: string;
  brand: string;
  logo_url: string | null;
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
  


  // async getInsurances(): Promise<any> {
  //   return this.httpClientInsurance.get('/insurances');
  // }


  async getInsurances(page: number, limit: number): Promise<InsuranceResponse> {
    if (page > 0) {
      return this.httpClientInsurance.get('/v1/insurances?page=' + page + "&pageSize=" + limit);
    } else {
      page = 1;
      return this.httpClientInsurance.get('/v1/insurances?page=' + page + "&pageSize=" + limit);
    }

  }

  
  async getInsuranceById(id: string): Promise<any> {
    return this.httpClientInsurance.get('/insurances/' + id);
  }

}