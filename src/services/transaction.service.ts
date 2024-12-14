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
    return this.httpClient.get(`/transactions?${queryString}`);
  }

  async getTransactionsExport(
    page: number,
    rowsPerPage: number
  ): Promise<TransactionResponse> {
    const dateTo = dayjs().format("YYYY-MM-DD");
    const dateFrom = dayjs().subtract(1, "month").format("YYYY-MM-DD");

    const params: any = {
      page: page,
      limit: rowsPerPage,
      from: dateFrom,
      to: dateTo,
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/transactions?${queryString}`);
  }

  async getTransaction(id: string): Promise<any> {
    return this.httpClient.get("/transactions/" + id);
  }

  async updatePaymentTransaction(id: string, data: any): Promise<any> {
    try {
      return await this.httpClient.put("/transactions/payment/" + id, data);
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }
}
