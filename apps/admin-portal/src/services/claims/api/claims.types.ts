export interface Claim {
  id: string;
  type: string;
  draft: boolean;
  number: string;
  status: string;
  category: string;
  participants: Participant[];
  package_data?: unknown;
  declarations: {
    transaction_data: unknown;
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
    data: unknown;
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
  label: Record<string, unknown>;
  type: string;
  required: true;
  form: string;
}

export interface ClaimChannel {
  id: string;
  channel: string;
  name: string;
  label: Record<string, unknown>;
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
export type { ClaimFormsRequest, UpdateClaimGrabRequest } from "@/types/claim-form";
