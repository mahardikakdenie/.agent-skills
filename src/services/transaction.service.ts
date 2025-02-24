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
    page: number,
    rowsPerPage: number,
    status: string
  ): Promise<TransactionResponse> {
    const params: any = {
      page: page,
      limit: rowsPerPage,
    };

    if (status) {
      params["status"] = status;
    }
    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/v1/transactions?${queryString}`);
  }

  async getTransactionsExport(page: number): Promise<TransactionResponse> {
    const params: any = {
      page: page,
      limit: 400,
    };

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
}
