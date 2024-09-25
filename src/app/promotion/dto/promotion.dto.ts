
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
  products: Product;
}

export interface Channel {
  id: string;
  name: string;
  type: string;
  channel_id?: string;
}

export interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  insurance: string;
  category: string;
  name: string;
  instant_policy: boolean;
}

export interface ChannelResponseDTO {
  data: Channel[];
  total: number;
  limit: number;
  pageTotal: number;
  page: number;
}


export interface InsuranceResponseDTO {
  data: Insurance[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface Insurance {
  id: string;
  name: string;
  brand: string;
  logo_url: string | null;
}


export interface NewPromotionCampaign {
  campaign_id: string;
  name: string;
  type: string;
  start_date: string;
  end_date: string;
  value: number;
  value_type: string;
  active: boolean;
  value_currency: string;
  minimum_amount: number;
  maximum_amount: number;
  embedded_discount_channels: EmbeddedDiscountChannel[];
  embedded_discount_insurances: EmbeddedDiscountInsurance[];
  embedded_discount_plans: EmbeddedDiscountPlan[];
  embedded_discount_products: EmbeddedDiscountProduct[];
  vouchers: Vouchers[];
}

export interface Vouchers {
  code: string;
  usage_limit: number;
}

export interface EmbeddedDiscountProduct {
  product_id: string;
  product_name: string;
}

export interface EmbeddedDiscountInsurance {
  insurance_id: string;
  insurance_name: string;
}

export interface EmbeddedDiscountPlan {
  plan_id: string;
  name: string;
}

export interface EmbeddedDiscountChannel {
  channel_id: string;
  channel_name: string;
}