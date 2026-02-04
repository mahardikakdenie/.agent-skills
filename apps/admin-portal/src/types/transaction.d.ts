import {Customer} from "@/types/customer";
import {Insurance} from "@/types/insurance";
import {Participant} from "@/types/participant";

export interface Transaction {
    id: string;
    status: string;
    date: string;
    customer: Customer;
    insurance: Insurance;
    discount: {};
    fees: TransactionFee[];
    forms: any;
    participants: Participant[];
    category: string;
    invoice: string;
    code:string;
    created_at: string;
}

export interface TransactionFee {
    id?: string;
    name: string;
    description?: string;
    value: number;
    currency: string;
    required: boolean;
    exchange_rates: [];
}

export interface TransactionMonthData {
    revenue: number;
    country: Record<string, any>;
}

export interface TransactionStatisticYearly {
    year: string;
    months: Record<string, TransactionMonthData>;
}

export interface ListTransactionStatisticDataResponse {
    reduce(arg0: (acc: any, item: any) => any, arg1: Record<string, { name: string; value: number; }>): { [s: string]: unknown; } | ArrayLike<unknown>;
    data: Transaction[];
    total: number;
    master_total: number;
}

export interface ListTransactionStatisticDataRequest {
    from?: string;
    to?: string;
    channel?: string;
    insurance?: string;
    product?: string;
    type?: string;
    insuranceId?: string;
    sort?: string;
}