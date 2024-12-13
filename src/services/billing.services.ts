import { AxiosHttpClient } from "@/lib/axios-http-client";
import { HttpClient } from "@/lib/http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import { getCookie } from "@/lib/utils";
import axios, { AxiosResponse } from "axios";

export class BillingService {
  private httpClientCookie: IHttpClient;

  constructor() {
    this.httpClientCookie = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_FINANCE_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getCookie("token"),
      },
    });

  }

  async getBillings(page: number, pageSize: number): Promise<any> {
    const qs = `?page=${page}&pageSize=${pageSize}`;
    return this.httpClientCookie.get('/v1/billings' + qs);
  }

  async getVoucherByCode(code: string): Promise<any> {
    return this.httpClientCookie.get('/api/voucher/code/' + code);
  }

  async createVoucher(voucherData: { code: string; campaign_id: string; }): Promise<any> {
    try {
      return await this.httpClientCookie.post("/v1/plans/", voucherData);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getFees(insuranceId: string): Promise<any> {
    return this.httpClientCookie.get('/v1/fees/broker/insurance/' + insuranceId);
  }

  async createBilling(data: any) {
    return this.httpClientCookie.post('/v1/billings', data);
  }

  async getBillingById(id: string, page: number, pageSize: number) {
    const qs = `?page=${page}&pageSize=${pageSize}`;

    return this.httpClientCookie.get('/v1/billings/' + id + qs);
  }
}