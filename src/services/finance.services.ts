import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import { getCookie } from "@/lib/utils";

export class FinanceService {
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

  async getBillings(page: number, pageSize: number, query: any): Promise<any> {

    // extract object to querystring
    let qs = `?page=${page}&pageSize=${pageSize}`;
    if (Object.keys(query).length > 0) qs += `&${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}`;
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

  async getFees(param: { insuranceId: string, productId?: string, planId?: string; }): Promise<any> {
    const { insuranceId, productId, planId } = param;

    let qs = '?insuranceId=' + insuranceId;
    if (productId) {
      qs += `&productId=${productId}`;
    }

    if (planId) {
      qs += `&planId=${planId}`;
    }


    return this.httpClientCookie.get('/v1/fees/broker-filter/' + qs);
  }

  async getChannelFees(param: { channelId: string, insuranceId?: string, productId?: string, planId?: string; }): Promise<any> {
    const { channelId, insuranceId, productId, planId } = param;

    let qs = '?channelId=' + channelId;
    if (insuranceId) {
      qs += `&insuranceId=${insuranceId}`;
    }
    //sementara di hilangkan
    // if (productId) {
    //   qs += `&productId=${productId}`;
    // }

    // if (planId) {
    //   qs += `&planId=${planId}`;
    // }


    return this.httpClientCookie.get('/v1/fees/channel-filter/' + qs);
  }

  async createBilling(data: any) {
    return this.httpClientCookie.post('/v1/billings', data);
  }

  async importBillingTransactions(data: any) {
    try {
      return new AxiosHttpClient({
        baseURL: process.env.NEXT_PUBLIC_FINANCE_SERVICE_URL,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).post("/v1/billings/import/transactions", data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }    
  }

  async getBillingById(id: string, page?: number, pageSize?: number, groupBy?: string) {
    let qs = '';
    if (page && pageSize) {
      qs = `?page=${page}&pageSize=${pageSize}`;
    }
    if (groupBy) {
      qs += '&groupBy=' + groupBy;
    }
    return this.httpClientCookie.get('/v1/billings/' + id + qs);
  }

  async updateBilling(id: string, data: any) {
    return this.httpClientCookie.put('/v1/billings/' + id, data);
  }

  async confirmReconcilliation(id: string) {
    return this.httpClientCookie.post(`/v1/billings/${id}/confirm-reconcilliation`, {});
  }

  async getBrokerFee(where?: any, page?: number, pageSize?: number, searchData?: string): Promise<any> {
    let qs = '';
    if (page && pageSize) {
      qs = `?page=${page}&pageSize=${pageSize}&keyword=${searchData || ''}`;
    }

    if (Object.keys(where).length > 0) {
      qs += (qs === '' ? '?' : '&') + `${Object.keys(where).map(key => `${key}=${where[key]}`).join('&')}`;
    }
    return this.httpClientCookie.get('/v1/fees/broker' + qs);
  }

  async getChannelFee(where?: any, page?: number, pageSize?: number, searchData?: string): Promise<any> {
    let qs = '';
    if (page && pageSize) {
      qs = `?page=${page}&pageSize=${pageSize}&keyword=${searchData || ''}`;
    }

    if (Object.keys(where).length > 0) {
      qs += (qs === '' ? '?' : '&') + `${Object.keys(where).map(key => `${key}=${where[key]}`).join('&')}`;
    }
    return this.httpClientCookie.get('/v1/fees/channel' + qs);
  }

  async createBrokerFee(data: any) {
    return this.httpClientCookie.post('/v1/fees/broker', data);
  }

  async updateBrokerFee(id: string, data: any) {
    return this.httpClientCookie.put('/v1/fees/broker/' + id, data);
  }

  async deleteBrokerFee(id: string) {
    return this.httpClientCookie.delete('/v1/fees/broker/' + id);
  }

  async createChannelFee(channelId: string, data: any) {
    return this.httpClientCookie.post(`/v1/fees/channel/${channelId}`, data);
  }
  async updateChannelFee(channelId: string, data: any) {
    return this.httpClientCookie.put(`/v1/fees/channel/${channelId}`, data);
  }
  async deleteChannelFee(id: string) {
    return this.httpClientCookie.delete('/v1/fees/channel/' + id);
  }
}