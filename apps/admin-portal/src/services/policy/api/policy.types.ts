import type { Transaction } from "@/services/transaction/api/transaction.types";

interface Participant {
  id: string;
  data: unknown;
  number: string;
}

export type PolicyParticipant = Participant;
export type MembershipParticipant = Participant;

export interface PolicyProductResponse {
  policy_products: unknown;
}

export interface MembershipProductResponse {
  policy_products: unknown;
}

export interface PolicyData {
  id: string;
  type: string;
  draft: boolean;
  number: string;
  status: string;
  category: string;
  participants: PolicyParticipant[];
  package_data?: unknown[];
  policy_holder?: unknown;
  policy_products?: PolicyProductResponse[];
  declarations: {
    transaction_data: Transaction;
  };
  account: {
    name: string;
    email: string;
    phone: string;
  };
  created_at: string;
  total: number;
}

export interface MembershipData {
  id: string;
  type: string;
  draft: boolean;
  number: string;
  status: string;
  category: string;
  participants: MembershipParticipant[];
  package_data?: unknown[];
  policy_holder?: unknown;
  policy_products?: MembershipProductResponse[];
  declarations: {
    transaction_data: Transaction;
  };
  account: {
    name: string;
    email: string;
    phone: string;
  };
  created_at: string;
  total: number;
}

export interface EndorsementResponse {
  data: unknown;
  page?: number;
  total?: number;
  pageTotal?: number;
  [key: string]: unknown;
}
