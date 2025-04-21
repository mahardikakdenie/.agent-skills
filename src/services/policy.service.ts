import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import qs from "qs";
import { Transaction } from "./transaction.service";

interface PolicyResponse {
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


export interface PolicyData {
  id: string;
  type: string;
  draft: boolean;
  number: string;
  status: string;
  category: string;
  participants: Participant[];
  package_data?: any[];
  policy_holder?: any;
  policy_products?: PolicyProductResponse[];
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

export interface PolicyProductResponse {
  policy_products: any;
}

export class PolicyService {
  private httpClient: IHttpClient;

  constructor() {
    this.httpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_API_POLICY_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getPolicy(
    page: number,
    rowsPerPage: number,
    searchData: string,
    status: string,
    channel: string
  ): Promise<PolicyResponse> {
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
    return this.httpClient.get(`/v1/policies?${queryString}`);
  }

  async getPolicyDetail(id: string): Promise<any> {
    return this.httpClient.get(`/v1/policies/${id}`);
  }

  async getPolicyExport(
    page: number,
    rowsPerPage: number,
    searchData: string,
    status: string,
    channel: string,
  ): Promise<PolicyResponse> {
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
    return this.httpClient.get(`/v1/policies?${queryString}`);
  }


  async getPolicyStatistic(
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
    return this.httpClient.get<any>(`/v1/policies/statistic-data?${queryString}`);
  }
}
