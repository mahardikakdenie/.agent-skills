import {Policy} from "@/types/policy";
import {ParticipantData} from "@/types/participant";

export interface Claim {
    id: string;
    number: string;
    status: string;
    channel: string;
    category: string;
    policy: any;
    package: any;
    policy_data: Policy;
    participant_data: ParticipantData;
    type: string;
    benefit: {
        id?: string;
        description_en: string;
        description_id: string;
    };
    bank_info: {
        bank: any;
        branch: string;
        account_name: string;
        account_number:	number;
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
    amount_approved: number;
    note: string;
    currency: string;
    general: any;
    claim: any;
    claim_config: any;
    submitted_at?: string;
    created_at: string;
    updated_at: string;
    sla_status: string;
}

export interface ClaimHistory {
    id: string;
    name: string;
    status: string;
    status_multilanguage: any;
    name_multilanguage: any;
    created_at: string;
    note: string;
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
    status?: string[] | undefined;
    date_from?: string;
    date_to?: string;
    sla_status: string[] | undefined;
    channel?: string;
}

export interface ClaimMonthData {
    amount_approved: number;
    total: number;
}

export interface ClaimStatisticYearly {
    year: string;
    months: Record<string, ClaimMonthData>;
}

export interface ClaimStatisticDataRequest {
    from?: string;
    to?: string;
    channel?: string;
    insurance?: string;
    product?: string;
    type?: string;
    sort?: string;
}