import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import Cookies from "universal-cookie";
import qs from "qs";

interface ClaimResponse {
  data: any;
  page: any;
  total: any;
  pageTotal: any;

  id: string;
  number: string;
  status: string;
  policy_data: Claim;
  participant_data: Participant;
  benefit: {
    id?: string;
    description_en: string;
    description_id: string;
  };
  bank_info: {
    bank: string;
    branch: string;
    account_name: string;
    account_number: number;
  };
  personal_info: {
    city: string;
    phone: string;
    state: string;
    address: string;
    address2: string;
    district: string;
    subdistrict: string;
  };
  general: any;
  claim: any;
  created_at: string;
  updated_at: string;
}

export interface Claim {
  id: string;
  type: string;
  draft: boolean;
  number: string;
  status: string;
  category: string;
  participants: Participant[];
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
export interface Participant {
  id: string;
  data: {
    id: string;
    data: any;
  };
}
export interface ClaimHistory {
  id: string;
  name: string;
  data: Claim;
  created_at: string;
}
export interface ListClaimResponse {
  data: Claim[];
  total: number;
  limit: number;
  pageTotal: number;
  page: number;
}
export interface ListClaimHistoryResponse {
  data: ClaimHistory[];
  total: number;
  limit: number;
  pageTotal: number;
  page: number;
}
export interface ListClaimRequest {
  category?: string;
  limit: number;
  page: number;
  keyword?: string;
  policy?: string;
  claim?: string;
  status?: string[];
}

export class ClaimService {
  private httpClient: IHttpClient;

  constructor() {
    const cookies = new Cookies();
    this.httpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_API_CLAIM_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookies.get("token"),
      },
    });
  }

  async getClaims(
    page: number,
    rowsPerPage: number,
    status: string
  ): Promise<ClaimResponse> {
    const params: any = {
      page: page,
      limit: rowsPerPage,
    };

    if (status) {
      params["status"] = status;
    }
    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/claims?${queryString}`);
  }

  async getClaimsDetail(id: string): Promise<any> {
    return this.httpClient.get("/claims/" + id);
  }

  async getClaimsHistories(id: string): Promise<any> {
    return this.httpClient.get(`/claim-histories?claim=${id}`);
  }
}
