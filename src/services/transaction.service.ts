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

interface CustomerConventional {
  type: string;
  name: string;
  phone: string;
  email: string;
}

interface Agent {
  name: string;
  phone_number: string;
}

interface Pic {
  name: string;
  phone_number: string;
  identification_number: string;
  npwp_number: string;
  mailing_address: string;
}

interface CreateTransactionConventional {
  customer: CustomerConventional;
  package_id: string;
  pic: Pic;
  agent: Agent;
  currency: string;
  premium: number;
  expiry_date: string;
  effective_date: string;
  payment_method: string;
  participants: string[];
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

  async getCustomers(
    page: number,
    limit: number,
    type?: string,
    name?: string
  ): Promise<any> {
    const params = new URLSearchParams();

    params.append("page", String(page));
    params.append("limit", String(limit));

    if (type) {
      params.append("type", type);
    }
    if (name) {
      params.append("name", name);
    }

    return this.httpClient.get(`/v1/customers?${params.toString()}`);
  }

  async getCustomersCampaign(page: number, limit: number, channel: string, frequent_buyers: boolean, birthday_month: string): Promise<any> {
    const params = new URLSearchParams();

    params.append("page", String(page));
    params.append("limit", String(limit));
    params.append("frequent_buyers", `${frequent_buyers}`);

    if (channel) params.append("channel", channel);
    if (birthday_month) params.append("birthday_month", birthday_month);

    return this.httpClient.get(`/v1/customers/campaign?${params.toString()}`);
  }

  async getTransactions(
    page?: number,
    rowsPerPage?: number,
    type?: string,
    searchData?: string,
    status?: string
  ): Promise<TransactionResponse> {
    const params: any = {
      page: page,
      limit: rowsPerPage,
      type: type,
    };

    if (type) {
      params["type"] = type;
    }

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
      sort: "desc",
      ...(filters?.insurance && { insurance: filters.insurance }),
      ...(filters?.product && { product: filters.product }),
      ...(filters?.plan && { plan: filters.plan }),
      ...(filters?.from && { from: filters.from }),
      ...(filters?.to && { to: filters.to }),
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get<any>(
      `/v1/transactions/statistic-data?${queryString}`
    );
  }

  async createTransactionConventional(
    data: CreateTransactionConventional
  ): Promise<any> {
    return this.httpClient.post("/v1/transactions/conventional", data);
  }
}
