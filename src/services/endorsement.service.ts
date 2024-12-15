import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import qs from "qs";

interface EndorsementResponse {
  data: any;
  page: any;
  total: any;
  pageTotal: any;

  id: string;
  policies: {};
  participants: {};
  number: string;
  type: string;
  status: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export class EndorsementService {
  private httpClient: IHttpClient;

  constructor() {
    this.httpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_API_POLICY_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getEndorsement(
    page: number,
    rowsPerPage: number,
    status: string,
    searchData?: string
  ): Promise<EndorsementResponse> {
    const params: any = {
      page: page,
      limit: rowsPerPage,
      keyword: searchData,
    };

    if (status) {
      params["status"] = status;
    }

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/v1/endorsements?${queryString}`);
  }

  async getEndorsementExport(
    page: number,
    rowsPerPage: number
  ): Promise<EndorsementResponse> {
    const params: any = {
      page: page,
      limit: 100,
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/v1/endorsements?${queryString}`);
  }

  async updateStatus(id: string, data: any): Promise<any> {
    try {
      return await this.httpClient.put(
        "/v1/endorsements/update-status/" + id,
        data
      );
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }
  async getEndorsementDetail(id: string): Promise<any> {
    return this.httpClient.get("v1/endorsements/" + id);
  }
}
