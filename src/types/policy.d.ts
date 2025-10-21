import {Transaction} from "@/types/transaction";
import {Participant} from "@/types/participant";

export interface Policy {
    id: string;
    type: string;
    draft: boolean;
    number: string;
    status: string;
    category: string;
    participants: Participant[];
    package_data?: any[];
    policy_holder?: any;
    policy_products?: any;
    declarations: {
        transaction_data: Transaction;
    };
    account: {
        name: string;
        email: string;
        phone: string;
    };
    created_at: string;
}
export interface PolicyData {
    id: string;
    type: string;
    draft: boolean;
    number: string;
    status: string;
    category: string;
    participants: Participant[];
    package_data?: any[];
    policy_holder?: any;
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
export interface PlanDataProduct {
    plan_data: {
      name: string;
    };
  }
  
export interface PolicyProductResponse {
    policy_products: PolicyProduct[];
}
export interface ListPolicyResponse {
    data: Policy[];
    total: number;
    limit: number;
    pageTotal: number;
    page: number;
}

export interface ListPolicyRequest {
    category?: string;
    limit: number;
    page: number;
    keyword?: string;
    departure?: string;
    return?: string;
    number?: string;
    status?: string;
    channel?: string;
    from?: string | null;
    to?: string | null;
}

export interface PolicyMonthData {
    total: number;
    country: Record<string, number>;
}

export interface PolicyStatisticYearly {
    year: string;
    months: Record<string, PolicyMonthData>;
}

export interface ListPolicyStatisticDataResponse {
    reduce(arg0: (acc: any, item: any) => any, arg1: Record<string, { name: string; value: number; }>): { [s: string]: unknown; } | ArrayLike<unknown>;
    data: Policy[];
    total: number;
    master_total: number;
}

export interface ListPolicyStatisticDataRequest {
    from?: string;
    to?: string;
    channel?: string;
    insurance?: string;
    product?: string;
    type?: string;
    insuranceId?: string;
    sort?: string;
}