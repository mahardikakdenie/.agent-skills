import { AxiosHttpClient } from "@/lib/axios-http-client";
import { HttpClient } from "@/lib/http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import { getCookie } from "@/lib/utils";
import axios, { AxiosResponse } from "axios";

export class VoucherService {
  private httpClientCookie: IHttpClient;

  constructor() {
    this.httpClientCookie = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_PROMOTION_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getCookie("token"),
      },
    });

  }

  async getVoucherByCampaignId(id: string): Promise<any> {
    return this.httpClientCookie.get('/v1/voucher/' + id);
  }

  async getVoucherByCode(code: string): Promise<any> {
    return this.httpClientCookie.get('/v1/voucher/code/' + code);
  }

  async createVoucher(voucherData: { code: string; campaign_id: string }): Promise<any> {
    try {
      return await this.httpClientCookie.post("/v1/plans/", voucherData);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

}