import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import qs from "qs";
import { Transaction } from "./transaction.service";

interface MembershipResponse {
  data: any;
  page: any;
  total: any;
  pageTotal: any;
  id: string;
  type: string;
  draft: boolean;
  number: string;
  status: string;
  category: string;
  participants: any;
  package_data?: any;
  declarations: {
    transaction_data: any;
  };
  account: {
    name: string;
    email: string;
    phone: string;
  };
}


export interface MembershipData {
  id: string;
  type: string;
  draft: boolean;
  number: string;
  status: string;
  category: string;
  participants: Participant[];
  package_data?: any[];
  policy_holder?: any;
  policy_products?: MembershipProductResponse[];
  declarations: {
    transaction_data: Transaction;
  };
  account: {
    name: string;
    email: string;
    phone: string;
  };
  created_at: string;
  total: number;
}

export interface Participant {
  id: string;
  data: any;
  number: string;
}

export interface MembershipProductResponse {
  policy_products: any;
}

export class MembershipService {
  private httpClient: IHttpClient;

  constructor() {
    this.httpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_API_POLICY_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getMembership(
    page: number,
    rowsPerPage: number,
    searchData: string,
    status: string,
    channel: string,
  ): Promise<MembershipResponse> {
    const params: any = {
      page: page,
      limit: rowsPerPage,
    };
    if (searchData) {
      params["keyword"] = searchData;
    }

    if (status) {
      params["status"] = status;
    }
    if (channel) {
      params["channel"] = channel;
    }
    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/v1/insured-parties?${queryString}`);
  }

  async getMembershipDetail(id: string): Promise<any> {
    return this.httpClient.get(`/v1/insured-parties/${id}`);
  }

  async getMembershipExport(
    page: number,
    rowsPerPage: number,
    channel: string,
  ): Promise<MembershipResponse> {
    const params: any = {
      page: page,
      limit: rowsPerPage,
    };

    if (channel) {
      params["channel"] = channel;
    }

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/v1/insured-parties?${queryString}`);
  }

  async getMembershipStatistic(
    page: number,
    rowsPerPage: number,
    filters?: {
      insurance?: string;
      product?: string;
      plan?: string;
      date_from?: string;
      date_to?: string;
    }
  ): Promise<any> {
    const params = {
      page,
      pageSize: rowsPerPage,
      sort: 'desc',
      ...(filters?.insurance && { insurance: filters.insurance }),
      ...(filters?.product && { product: filters.product }),
      ...(filters?.plan && { plan: filters.plan }),
      ...(filters?.date_from && { from: filters.date_from }),
      ...(filters?.date_to && { to: filters.date_to }),
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get<any>(`/v1/insured-parties/statistic-data?${queryString}`);
  }

  async uploadMembership(channelId: string, data: any): Promise<any> {
    try {
      return await this.httpClient.put(`/v1/insured-parties/channel/${channelId}`, data);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }
}
