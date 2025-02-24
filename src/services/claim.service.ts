import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import qs from "qs";
import { DateRange } from "react-day-picker";

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
export interface ClaimCategory {
  id: string;
  category: string;
  name: string;
  label: {};
  type: string;
  required: true;
  form: string;
}
export interface ClaimChannel {
  id: string;
  channel: string;
  name: string;
  label: {};
  type: string;
  required: true;
  form: string;
}

export interface ClaimHistoryDetail {
  claimId: string;
  insuredName: string;
  status: string;
  currency: string;
  paymentType: string;
  submittedDate: string;
  claimAmount: number;
  paid: number;
  remainingLimit: number;
  selectedPolicy: string;
}

export interface ClaimHistorySummary {
  data: ClaimHistoryDetail[];
  plans: { planId: string; planName: string }[];
  policies: { policyId: string; policyNo: string }[];
  totalLimit: number;
  totalPaid: number;
  remainingClaimLimit: number;
}
export class ClaimService {
  private httpClient: IHttpClient;

  constructor() {
    this.httpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_API_CLAIM_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  async getClaims(
    page: number,
    rowsPerPage: number,
    status: string,
    searchData?: string,
    searchChannel?: string,
    searchSlaStatus?: any,
    date_from?: string,
    date_to?: string
  ): Promise<ClaimResponse> {
    const params: any = {
      page: page,
      limit: rowsPerPage,
    };

    if (searchData) {
      params["keyword"] = searchData;
    }

    if (searchChannel) {
      params["channel"] = searchChannel;
    }

    if (searchSlaStatus) {
      params["sla_status"] = searchSlaStatus;
    }

    if (status) {
      if (status !== "Draft") {
        params["status"] = [status];
      }
    } else {
      params["status"] = [
        "Submitted",
        "Acknowledged",
        "Document Review Operator",
        "Reupload Document Review Operator",
        "Lack of Documents Operator",
        "Document Review Insurance",
        "Reupload Document Review Insurance",
        "Lack of Documents Insurance",
        "Claim Assessment",
        "Approved",
        "Rejected",
        "Paid",
        "Closed",
      ];
    }

    if (date_from) {
      params["date_from"] = date_from;
    }

    if (date_to) {
      params["date_to"] = date_to;
    }

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/v1/claims?${queryString}`);
  }

  async getClaimsExport(
    page: number,
    rowsPerPage: number
  ): Promise<ClaimResponse> {
    const params: any = {
      page: page,
      limit: 100,
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/v1/claims?${queryString}`);
  }

  async getClaimsDetail(id: string): Promise<any> {
    return this.httpClient.get("/v1/claims/" + id);
  }

  async getClaimsHistories(id: string): Promise<any> {
    return this.httpClient.get(`/v1/claim-histories?claim=${id}`);
  }

  async getClaimsHistoriesList({
    searchData,
    planId,
    policyId,
  }: {
    searchData: string;
    planId?: string;
    policyId?: string;
  }): Promise<{ data: ClaimHistorySummary[] }> {
    const params: any = {};
  
    if (planId) params["plan_id"] = planId;
    if (policyId) params["policy_id"] = policyId;
    if (searchData) params["search"] = searchData;
  
    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get(`/v1/claims/claim-list-limit?${queryString}`);
  }
  async updateClaimStatus(
    id: string,
    data: any,
    amount_approved?: number,
    note?: string,
    lack_of_documents?: string[]
  ): Promise<any> {
    try {
      return await this.httpClient.put("/v1/claims/update-status/" + id, {
        status: data,
        note: note,
        amount_approved: amount_approved,
        lack_of_documents: lack_of_documents,
      });
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }

  async getClaimCategory(id: string): Promise<any> {
    return this.httpClient.get("/v1/claim-category-forms/all/" + id);
  }

  async getClaimChannel(id: string): Promise<any> {
    return this.httpClient.get("/v1/claim-channel-forms/all/" + id);
  }

  async getClaimsStatus(): Promise<any> {
    return this.httpClient.get(`/v1/claims/configurations`);
  }

  async getClaimReport(
    page: number,
    rowsPerPage: number,
    output: string,
    date_from?: string,
    date_to?: string,
  ): Promise<any> {
    const params = {
      page,
      limit: rowsPerPage,
      output,
      ...(date_from && { date_from }),
      ...(date_to && { date_to })
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    return this.httpClient.get<any>(`/v1/claims/export?${queryString}`);
  }

  async import(data: {
    data: string;
    input: string;
    channel: string;
    category: string;
  }) {
    const { data: base64String, input, channel, category } = data;
    return this.httpClient.post(`/v1/claims/import`, {
      data: base64String,
      input: "File",
      channel,
      category,
    });
  }
}
