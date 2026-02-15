export interface Transaction {
  id: string;
  status: string;
  date: string;
  customer: Customer;
  insurance: Insurance;
  discount: Record<string, unknown>;
  fees: TransactionFee[];
  forms: unknown;
  participants: Participant[];
  category: string;
}

export interface TransactionFee {
  id?: string;
  name: string;
  description?: string;
  value: number;
  currency: string;
  required: boolean;
  exchange_rates: unknown[];
}

export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  account: string;
}

export interface Insurance {
  id: string;
  sum_insured: string | null;
  premium: string;
  currency: string;
  quantity: string;
  plan: {
    id: string;
    name: string;
  };
  product: {
    id: string;
    name: string;
  };
  insurance: {
    name: string;
    logo_url: string;
    currencies: unknown[];
  };
  original_price: number;
  discount: number;
}

export interface Participant {
  id: string;
  data: unknown;
  number: string;
}

export interface TransactionListResponse {
  data: unknown;
  limit?: number;
  page?: number;
  pageTotal?: number;
  total?: number;
}
