import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import qs from "qs";
import dayjs from "dayjs";

interface TransactionResponse {
  data: any;
  limit: number;
  page: number;
  pageTotal: number;
  total: number;
}

export interface Transaction {
  id: string;
  status: string;
  date: string;
  customer: Customer;
  insurance: Insurance;
  discount: {};
  fees: TransactionFee[];
  forms: any;
  participants: Participant[];
  category: string;
}

export interface TransactionFee {
  id?: string;
  name: string;
  description?: string;
  value: number;
  currency: string;
  required: boolean;
  exchange_rates: [];
}

export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  account: string;
}

export interface Insurance {
  id: string;
  sum_insured: string | null;
  premium: string;
  currency: string;
  quantity: string;
  plan: {
      id: string;
      name: string;
  };
  product: {
      id: string;
      name: string;
  };
  insurance: {
      name: string;
      logo_url: string;
      currencies: [];
  };
  original_price: number;
  discount: number;
}

export interface Participant {
  id: string;
  data: any;
  number: string;
}
export class TransactionService {
  private httpClient: IHttpClient;

  constructor() {
    this.httpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_TRANSACTION_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getTransactions(
    page?: number,
    rowsPerPage?: number,
    searchData?: string,
    status?: string
  ): Promise<TransactionResponse> {
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
    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/v1/transactions?${queryString}`);
  }

  async getTransactionsExport(params: {
    page: number;
    rowsPerPage: number;
    status?: string;
    keyword?: string;
  }): Promise<TransactionResponse> {
    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/v1/transactions?${queryString}`);
  }

  async getTransaction(id: string): Promise<any> {
    return this.httpClient.get("/v1/transactions/" + id);
  }

  async updatePaymentTransaction(id: string, data: any): Promise<any> {
    try {
      return await this.httpClient.put("/v1/transactions/payment/" + id, data);
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }

  async searchTransactions(search: any): Promise<any> {
    let qs = "";
    if (search) {
      qs = `?${Object.keys(search)
        .map((key) => `${key}=${search[key]}`)
        .join("&")}`;
    }
    try {
      return await this.httpClient.get(`/v1/transactions${qs}`);
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }

  async uploadTransactions(id: string, data: any): Promise<any> {
    try {
      return await this.httpClient.post(
        "/v1/transactions/bulk-create/" + id,
        data
      );
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  async getTransactionStatistic(
    page: number,
    filters?: {
      insurance?: string;
      product?: string;
      plan?: string;
      from?: string;
      to?: string;
    }
  ): Promise<any> {
    const params = {
      page,
      sort: 'desc',
      ...(filters?.insurance && { insurance: filters.insurance }),
      ...(filters?.product && { product: filters.product }),
      ...(filters?.plan && { plan: filters.plan }),
      ...(filters?.from && { from: filters.from }),
      ...(filters?.to && { to: filters.to }),
    };
  
    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get<any>(`/v1/transactions/statistic-data?${queryString}`);
  }
}
