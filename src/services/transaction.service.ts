import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import Cookies from "universal-cookie";

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
    const cookies = new Cookies();
    this.httpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_TRANSACTION_SERVICE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cookies.get('token'),
      }
    });
  }

  async getTransactions(page: number): Promise<TransactionResponse> {
    return this.httpClient.get('/transactions?page=' + page);
  }

  async getTransaction(id: string): Promise<any> {
    return this.httpClient.get('/transactions/' + id);
  }

  async updatePaymentTransaction(id: string, data: any): Promise<any> {
    try {
      return await this.httpClient.put('/transactions/payment/' + id, data);
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }
}