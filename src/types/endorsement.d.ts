export interface PolicyHolder {
  id: string;
  name: string;
  email: string;
}

export interface Policies {
  type: string;
  number: string;
  file: string | null;
  policy_holders: PolicyHolder;
}

export interface EndorsementItem {
  id: string;
  policies: Policies;
  number: string;
  type: string;
  fee: string;
  status: string;
  status_description: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface EndorsementResponse {
  data: EndorsementItem[];
  total: number;
  limit: number;
  pageTotal: number;
  page: number;
}

export interface PolicyHolderLite {
  name: string;
  email: string;
  phone: string;
}

export interface EndorsementPolicyLite {
  type: string;
  number: string;
  file: string | null;
  policy_holders: PolicyHolderLite;
  policy_products?: any[];
}

export interface EndorsementDetailDataProfile {
  policy_number?: string | null;
  subsidiary?: string | null;
  employee_id?: string | null;
  employee_name?: string | null;
  member_name?: string | null;
  gender?: string | null;
  date_of_birth?: string | null;
  member_status?: string | null;
  marital_status?: string | null;
  plan?: string | null;
  effective_date?: string | null;
  remarks?: string | null;
  bank_name?: string | null;
  branch?: string | null;
  bank_account_number?: string | null;
  bank_account_name?: string | null;
  email?: string | null;
  submission_date?: string | null;
  insurance_card?: string | null;
}

export interface EndorsementDetailRawMembership {
  id: string;
  data: {
    profile: EndorsementDetailDataProfile;
    other_info?: Record<string, any>;
  };
  insured_parties?: {
    profile: Record<string, any>;
  };
  endorsements: {
    id: string;
    number: string;
    type: string;
    fee: string;
    status: string;
    status_description: string;
    note: string;
    created_at: string;
    updated_at: string;
  };
}

export interface EndorsementDetailResponse {
  id: string;
  policies: EndorsementPolicyLite;
  number: string;
  type: string;
  fee: string;
  status: string;
  status_description: string;
  note: string | null;
  created_at: string;
  updated_at: string;
  endorsements_detail: EndorsementDetailRawMembership[];
  insurance?: {
    name?: string;
  };
}
