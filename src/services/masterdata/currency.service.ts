import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "../../lib/http-client-interface";
import Cookies from "universal-cookie";
import qs from "qs";

export interface Currency {
  data: any;
  id: string;
  name: string;
  email: string;
  phone_number: string;
  permission: string;
  role: string;
  status: string;
  meta: any;
}

export class UserService {
  private httpClient: IHttpClient;
  then: any;

  constructor() {
    this.httpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_AUTH_TOKEN,
      },
    });
  }

  async getCurrency(page?: number, rowsPerPage?: number): Promise<Currency> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/account/?${queryString}`);
  }

  async getCurrencyById(
    id: string,
    page?: number,
    rowsPerPage?: number
  ): Promise<any> {
    const params: any = {
      page: page,
      pageSize: rowsPerPage,
    };
    return this.httpClient.get("v1/insurances/" + id + "currencies");
  }
}
