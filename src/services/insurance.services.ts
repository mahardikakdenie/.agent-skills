import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import { getCookie } from "@/lib/utils";


export class InsuranceService {
  private httpClientInsurance: IHttpClient;

  constructor() {
    this.httpClientInsurance = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getCookie("token"),
      },
    });
  }

  async getInsurances(page: number, limit: number): Promise<any> {
    if (page > 0) {
      return this.httpClientInsurance.get(
        "/v1/insurances?page=" + page + "&pageSize=" + limit
      );
    } else {
      page = 1;
      return this.httpClientInsurance.get(
        "/v1/insurances?page=" + page + "&pageSize=" + limit
      );
    }
  }

  async getAllInsurances(): Promise<any> {
    return this.httpClientInsurance.get("/v1/insurances");
}

  async getInsuranceById(id: string): Promise<any> {
    return this.httpClientInsurance.get("/insurances/" + id);
  }
}
