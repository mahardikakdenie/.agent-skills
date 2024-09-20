import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import Cookies from "universal-cookie";
import qs from "qs";

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
  participants: string;
  package_data?: string;
  declarations: {
    transaction_data: string;
  };
  account: {
    name: string;
    email: string;
    phone: string;
  };
}
export class PolicyService {
  private httpClient: IHttpClient;

  constructor() {
    const cookies = new Cookies();
    this.httpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_API_POLICY_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookies.get("token"),
      },
    });
  }

  async getPolicy(
    page: number,
    rowsPerPage: number,
    status: string
  ): Promise<PolicyResponse> {
    const params: any = {
      page: page,
      limit: rowsPerPage,
    };

    if (status) {
      params["status"] = status;
    }
    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/policies?${queryString}`);
  }

  async getPolicyDetail(id: string): Promise<any> {
    return this.httpClient.get("/policies/" + id);
  }
}
