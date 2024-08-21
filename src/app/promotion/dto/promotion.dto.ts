interface Product {
    product_id: string;
}

interface Insurance {
    insurance_id: string;
}

export interface Plan {
    id: string;
    created_at: string;
    updated_at: string;
    product: string;
    name: string;
    duration_max: number | null;
    duration_max_additional_days: number | null;
    duration_max_additional_premium: number | null;
    policy_per_participant: boolean;
    slug: string;
    premium_discount_type: string;
    premium_discount_value: string;
    premium_campaign_id: string;
  }

export interface Channel {
    id: string;
    name: string;
    type: string;
    channel_id?: string;
  }

export interface ChannelResponseDTO {
    data: [Channel];
    total: number;
    limit: number;
    pageTotal: number;
    page: number;
}

interface ChannelFriendsureDTO {
    id: string;
}


interface Promotion {
    active: boolean;
    value: number;
    start_date: string;
    end_date: string;
    name: string;
    products: Product[];
    insurances: Insurance[];
    plans: Plan[];
    channels: Channel[];
}

